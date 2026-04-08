require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ¡IMPORTANTE! Asegúrate de que estas variables de entorno estén definidas.
// No uses claves reales hardcodeadas en producción.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    console.error("Error: Las variables de entorno SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y GEMINI_API_KEY deben estar definidas.");
    process.exit(1); // Termina el proceso si las claves críticas no están presentes
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

const pdfFolder = path.join(__dirname, '..', 'apuntes');

async function processAllPDFs() {
    if (!fs.existsSync(pdfFolder)) {
        console.error("No se encontró la carpeta 'apuntes'. Por favor, créala y pon tus PDFs allí.");
        return;
    }

    const files = fs.readdirSync(pdfFolder).filter(f => f.toLowerCase().endsWith('.pdf'));
    console.log(`Encontrados ${files.length} PDFs. Iniciando RAG Pipeline...`);

    for (const file of files) {
        console.log(`\nProcesando: ${file}...`);

        const dataBuffer = fs.readFileSync(path.join(pdfFolder, file));
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Divide el texto en fragmentos de ~2500 caracteres (aprox 500 palabras)
        const chunks = text.match(/[\s\S]{1,2500}/g) || [];
        console.log(`Dividido en ${chunks.length} fragmentos.`);

        for (let i = 0; i < chunks.length; i++) {
            try {
                const result = await embedModel.embedContent(chunks[i]);
                const embedding = result.embedding.values;

                await supabase.from('document_chunks').insert({
                    document_name: file,
                    content: chunks[i],
                    embedding: embedding
                });
                process.stdout.write('.'); // Muestra un puntito por cada fragmento procesado
                await new Promise(r => setTimeout(r, 1000)); // Pausa para no saturar la API gratuita
            } catch (err) {
                console.error(`\nError en fragmento ${i} de ${file}:`, err); // Log the full error object
            }
        }
        console.log(`\n✅ ${file} guardado exitosamente en pgvector.`);
    }
    console.log("\n🚀 ¡Todos los documentos indexados! PulmoIA ya puede leerlos.");
}

processAllPDFs();