const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

// Define la ruta de tu carpeta con PDFs.
const pdfFolder = path.join(__dirname, "..", "apuntes");
const outputFile = path.join(__dirname, "..", "conocimiento_extraido.txt");

async function extractText() {
  if (!fs.existsSync(pdfFolder)) {
    console.error(`¡Error! No se encontró la carpeta: ${pdfFolder}`);
    console.log(
      "Por favor, crea una carpeta llamada 'apuntes' en la raíz del proyecto y pon tus PDFs ahí."
    );
    return;
  }

  const files = fs
    .readdirSync(pdfFolder)
    .filter(file => file.toLowerCase().endsWith(".pdf"));
  let fullText = "";

  console.log(
    `Se encontraron ${files.length} archivos PDF. Comenzando extracción...`
  );

  for (const file of files) {
    console.log(`📖 Leyendo: ${file}...`);
    const dataBuffer = fs.readFileSync(path.join(pdfFolder, file));
    const data = await pdf(dataBuffer);
    fullText += `\n\n--- DOCUMENTO: ${file} ---\n\n`;
    fullText += data.text;
  }

  fs.writeFileSync(outputFile, fullText);
  console.log(
    `\n✅ ¡Éxito! Todo el texto fue extraído y guardado en: ${outputFile}`
  );
  console.log(
    `Ahora puedes abrir 'conocimiento_extraido.txt', copiar su contenido y pegarlo en supabase/functions/pulmoia/index.ts`
  );
}

extractText();
