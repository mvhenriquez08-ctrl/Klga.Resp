import fitz  # PyMuPDF
import os

pdf_dir = "/Users/victoriahenriquez/Desktop/manus/breath-scan-pal-manus-final/public/temp_pdfs/"
output_dir = "/Users/victoriahenriquez/Desktop/manus/breath-scan-pal-manus-final/client/public/rx_images/"

os.makedirs(output_dir, exist_ok=True)

pathologies = {
    "atelectasia": ["atelectasia"],
    "derrame_pleural": ["derrame pleural", "pleural effusion"],
    "neumotorax": ["neumotórax", "neumotorax", "pneumothorax"],
    "consolidacion": ["consolidación", "consolidacion", "opacidad", "relleno alveolar"],
    "edema_pulmonar": ["edema pulmonar", "edema agudo"],
    "cardiomegalia": ["cardiomegalia", "silueta cardiaca aumentada", "crecimiento cardiaco"],
    "enfisema": ["enfisema"],
    "neumonia": ["neumonía", "neumonia", "pneumonia"],
    "derrame_pericardico": ["derrame pericárdico", "derrame pericardico"],
    "ensanchamiento_mediastinico": ["ensanchamiento mediastínico", "ensanchamiento mediastinico", "mediastino ensanchado"]
}

found = {}

pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]

for pdf_name in pdf_files:
    pdf_path = os.path.join(pdf_dir, pdf_name)
    print(f"Buscando en {pdf_name}...")
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text().lower()
            
            for key, terms in pathologies.items():
                if key in found:
                    continue
                for term in terms:
                    if term in text:
                        print(f"  Encontrado {key} en {pdf_name} página {page_num + 1}")
                        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                        pix.save(os.path.join(output_dir, f"{key}.png"))
                        found[key] = f"{pdf_name} p.{page_num + 1}"
                        break
        doc.close()
    except Exception as e:
        print(f"  Error al abrir {pdf_name}: {e}")

print("\nResumen de extracción:")
for key, loc in found.items():
    print(f"- {key}: {loc}")

missing = set(pathologies.keys()) - set(found.keys())
if missing:
    print("\nNo se encontraron las siguientes patologías:")
    for m in missing:
        print(f"- {m}")
