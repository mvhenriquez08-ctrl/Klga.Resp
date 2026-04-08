import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ¡IMPORTANTE! Reemplaza estos valores con tus claves reales
// ¡IMPORTANTE! Asegúrate de que estas variables de entorno estén definidas.
// No uses claves reales hardcodeadas en producción.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    console.error("Error: Las variables de entorno SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y GEMINI_API_KEY deben estar definidas.");
    process.exit(1); // Termina el proceso si las claves críticas no están presentes
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const folderNames = [
    'Diplomado VM',
    'Mención cardio',
    'POCUS - 2023 2',
    'Ecopulmonar',
    'rx_torax',
    'Curso kineintensiva 2',
    'Cursos'
];

const possibleBases = [
    process.env.HOME || '/Users/victoriahenriquez',
    path.join(process.env.HOME || '/Users/victoriahenriquez', 'Desktop'),
    path.join(process.env.HOME || '/Users/victoriahenriquez', 'Documents'),
    path.join(process.env.HOME || '/Users/victoriahenriquez', 'Downloads'),
    path.join(process.env.HOME || '/Users/victoriahenriquez', 'Library', 'Mobile Documents', 'com~apple~CloudDocs'),
    __dirname
];

const targetFolders = [];
for (const name of folderNames) {
    for (const base of possibleBases) {
        const fullPath = path.join(base, name);
        if (fs.existsSync(fullPath)) {
            targetFolders.push(fullPath);
            break;
        }
    }
}

async function processAllPDFs() {
    let allFiles = [];

    for (const folder of targetFolders) {
        if (!fs.existsSync(folder)) {
            console.warn(`⚠️ No se encontró la carpeta: ${folder}`);
            continue;
        }

        const files = fs.readdirSync(folder)
            .filter(f => f.toLowerCase().endsWith('.pdf'))
            .map(f => path.join(folder, f));

        allFiles = allFiles.concat(files);
    }

    console.log(`Encontrados ${allFiles.length} PDFs en total. Iniciando RAG Pipeline...`);

    for (const filePath of allFiles) {
        const file = path.basename(filePath);
        console.log(`\nProcesando: ${file}...`);

        const dataBuffer = fs.readFileSync(filePath);
        let text = "";
        try {
            const pdf = new pdfParse.PDFParse({ data: dataBuffer });
            const result = await pdf.getText();
            text = result.text;
        } catch (e) {
            console.error(`Error al leer PDF ${file}:`, e.message);
            continue;
        }


        // Divide el texto en fragmentos de ~2500 caracteres (aprox 500 palabras)
        const chunks = text.match(/[\s\S]{1,2500}/g) || [];
        console.log(`Dividido en ${chunks.length} fragmentos.`);

        const batchSize = 10; // Procesar de a 10 fragmentos por petición
        for (let i = 0; i < chunks.length; i += batchSize) {
            const chunkBatch = chunks.slice(i, i + batchSize);
            let retryCount = 0;
            const maxRetries = 5;
            let success = false;

            while (retryCount < maxRetries && !success) {
                try {
                    const requests = chunkBatch.map(chunk => ({
                        content: { parts: [{ text: chunk }] },
                        taskType: 'RETRIEVAL_DOCUMENT',
                        outputDimensionality: 768
                    }));

                    const result = await embedModel.batchEmbedContents({ requests });
                    const embeddings = result.embeddings.map(e => e.values);

                    const rows = chunkBatch.map((chunk, idx) => ({
                        document_name: file,
                        content: chunk,
                        embedding: embeddings[idx]
                    }));

                    const { error } = await supabase.from('document_chunks').insert(rows);

                    if (error) {
                        console.error(`\nError de Supabase en lote ${i}:`, error.message);
                        if (error.message.includes("JWT")) {
                            console.error("ERROR CRÍTICO: Se requiere la SUPABASE_SERVICE_ROLE_KEY válida.");
                            return;
                        }
                    } else {
                        process.stdout.write('.'.repeat(chunkBatch.length)); // Muestra un puntito por cada fragmento procesado
                        success = true;
                    }
                    await new Promise(r => setTimeout(r, 6500)); // Pausa de 6.5 segundos para no saturar la cuota
                } catch (err) {
                    if (err.message.includes("429") || err.message.toLowerCase().includes("quota") || err.message.toLowerCase().includes("limit")) {
                        retryCount++;
                        const waitTime = Math.pow(2, retryCount) * 15000; // Esperar 30s, 60s, 120s...
                        console.warn(`\n⚠️ Límite de API alcanzado. Enfriando motor por ${waitTime / 1000}s... (Intento ${retryCount}/${maxRetries})`);
                        await new Promise(r => setTimeout(r, waitTime));
                    } else {
                        console.error(`\nError en lote ${i} de ${file}:`, err); // Log the full error object
                        break; // Error no recuperable
                    }
                }
            }
        }
        console.log(`\n✅ ${file} procesado.`);
    }
    console.log("\n🚀 Pipeline finalizado.");
}

processAllPDFs();