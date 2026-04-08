const normalPaImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/normal-pa_88be26cc.jpg"; // Example image for normal PA
const normalLateralImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/normal-lateral_example.jpg"; // Example image for normal lateral
const pleuralEffusionLargeImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion-large_2199541e.jpg"; // Example image for large pleural effusion
const pulmonaryEdemaBilateralImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pulmonary-edema-bilateral_b5ab5041.jpg"; // Example image for bilateral pulmonary edema
const tensionPneumothoraxImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/tension-pneumothorax_a71f032a.jpg"; // Example image for tension pneumothorax
const lobarPneumoniaImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lobar-pneumonia_ba1ed9e2.jpg"; // Example image for lobar pneumonia
const atelectasisRulImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/atelectasis-rul_example.jpg"; // Example image for RUL atelectasis
const cardiomegalySevereImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/cardiomegaly-severe_example.png"; // Example image for severe cardiomegaly
const ardsIcuImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ards-icu_9c3d113b.jpg"; // Example image for ARDS in ICU
const mediastinalWideningImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/mediastinal-widening_example.png"; // Example image for mediastinal widening

export interface RXGalleryItem {
  // Kept from second rxGallery.ts
  id: string;
  title: string;
  category: "normal" | "patologico" | "critico";
  projection: string;
  imageUrl: string;
  description: string;
  keyFindings: string[];
  clinicalContext: string;
}

export const rxGalleryItems: RXGalleryItem[] = [
  {
    id: "normal-pa",
    title: "Tórax Normal – Proyección PA",
    category: "normal",
    projection: "PA",
    imageUrl: normalPaImg,
    description:
      "Radiografía posteroanterior estándar de tórax normal. Campos pulmonares claros, silueta cardíaca de tamaño normal, ángulos costofrénicos libres.",
    keyFindings: [
      "Campos pulmonares limpios y simétricos",
      "Índice cardiotorácico < 0.5",
      "Ángulos costofrénicos agudos y libres",
      "Tráquea centrada",
      "Hilios normales en posición y tamaño",
      "Diafragma derecho ligeramente más alto que el izquierdo",
    ],
    clinicalContext:
      "Referencia de normalidad para comparación con estudios patológicos.",
  },
  {
    id: "normal-lateral",
    title: "Tórax Normal – Proyección Lateral",
    category: "normal",
    projection: "Lateral",
    imageUrl: normalLateralImg,
    description:
      "Proyección lateral izquierda complementaria. Permite evaluar el espacio retroesternal, retrocardiaco y las cisuras pulmonares.",
    keyFindings: [
      "Espacio retroesternal claro",
      "Espacio retrocardiaco libre",
      "Columna vertebral progresivamente más oscura hacia inferior",
      "Cisuras mayor y menor visibles",
      "Diafragma visible con ángulos costofrénicos posteriores libres",
    ],
    clinicalContext:
      "Complemento esencial de la proyección PA para localización tridimensional de lesiones.",
  },
  {
    id: "lobar-pneumonia",
    title: "Neumonía Lobar",
    category: "patologico",
    projection: "PA",
    imageUrl: lobarPneumoniaImg,
    description:
      "Consolidación neumónica del lóbulo inferior derecho con broncograma aéreo. Opacidad homogénea de límites bien definidos respetando la cisura.",
    keyFindings: [
      "Opacidad homogénea lobar con broncograma aéreo",
      "Respeta los límites cisurales",
      "Signo de la silueta según localización",
      "Sin pérdida de volumen significativa",
      "Posible derrame paraneumónico asociado",
    ],
    clinicalContext:
      "Neumonía bacteriana típica. Fiebre, tos productiva, crepitantes focales, leucocitosis con desviación izquierda.",
  },
  {
    id: "pleural-effusion-large",
    title: "Derrame Pleural Masivo",
    category: "patologico",
    projection: "PA",
    imageUrl: pleuralEffusionLargeImg,
    description:
      "Derrame pleural derecho de gran volumen con opacificación de la base y signo del menisco. Desplazamiento mediastínico contralateral.",
    keyFindings: [
      "Opacidad homogénea basal con menisco cóncavo superior",
      "Borramiento del ángulo costofrénico derecho",
      "Posible desviación mediastínica contralateral",
      "Ausencia de broncograma aéreo",
      "Velamiento del hemitórax en decúbito",
    ],
    clinicalContext:
      "Etiología variable: ICC, infección (empiema), neoplasia, TEP. Matidez a la percusión, abolición del murmullo vesicular.",
  },
  {
    id: "tension-pneumothorax",
    title: "Neumotórax a Tensión",
    category: "critico",
    projection: "PA",
    imageUrl: tensionPneumothoraxImg,
    description:
      "Neumotórax izquierdo a tensión con colapso pulmonar completo y desviación mediastínica hacia la derecha. Emergencia médica.",
    keyFindings: [
      "Ausencia completa de trama vascular en hemitórax afectado",
      "Línea pleural visceral visible",
      "Desviación mediastínica contralateral",
      "Aplanamiento del hemidiafragma ipsilateral",
      "Hiperclaridad del hemitórax afectado",
    ],
    clinicalContext:
      "Emergencia vital. Disnea severa, hipotensión, ingurgitación yugular, desviación traqueal. Requiere descompresión inmediata.",
  },
  {
    id: "pulmonary-edema",
    title: "Edema Pulmonar Bilateral",
    category: "critico",
    projection: "PA",
    imageUrl: pulmonaryEdemaBilateralImg,
    description:
      "Edema pulmonar cardiogénico con patrón en alas de mariposa bilateral, redistribución vascular cefálica y posible derrame pleural bilateral.",
    keyFindings: [
      "Opacidades bilaterales perihiliares (alas de mariposa)",
      "Redistribución vascular cefálica (cefalización del flujo)",
      "Líneas de Kerley B en bases",
      "Derrame pleural bilateral (más frecuente derecho)",
      "Posible cardiomegalia asociada",
    ],
    clinicalContext:
      "ICC descompensada. Disnea, ortopnea, crepitantes bilaterales, taquicardia, ingurgitación yugular.",
  },
  {
    id: "atelectasis-rul",
    title: "Atelectasia del Lóbulo Superior Derecho",
    category: "patologico",
    projection: "PA",
    imageUrl: atelectasisRulImg,
    description:
      "Colapso del lóbulo superior derecho con elevación de la cisura menor y desviación traqueal ipsilateral. Pérdida de volumen evidente.",
    keyFindings: [
      "Opacidad del lóbulo superior derecho",
      "Elevación de la cisura menor",
      "Desviación traqueal hacia la derecha",
      "Elevación del hemidiafragma derecho",
      "Hiperinsuflación compensatoria del lóbulo inferior",
    ],
    clinicalContext:
      "Causa frecuente: obstrucción endobronquial (tumor, tapón mucoso). Disminución del murmullo vesicular apical.",
  },
  {
    id: "cardiomegaly-severe",
    title: "Cardiomegalia Severa",
    category: "patologico",
    projection: "PA",
    imageUrl: cardiomegalySevereImg,
    description:
      "Cardiomegalia global con índice cardiotorácico significativamente aumentado. Silueta cardíaca en forma de botella de agua.",
    keyFindings: [
      "Índice cardiotorácico > 0.6",
      "Silueta cardíaca globalmente agrandada",
      "Posible congestión venosa pulmonar asociada",
      "Derrame pericárdico si silueta en botella de agua",
      "Redistribución vascular cefálica",
    ],
    clinicalContext:
      "Miocardiopatía dilatada, derrame pericárdico masivo, valvulopatía severa. Disnea, edema periférico, tercer ruido.",
  },
  {
    id: "ards-icu",
    title: "SDRA en UCI – Proyección AP Portátil",
    category: "critico",
    projection: "AP",
    imageUrl: ardsIcuImg,
    description:
      "Radiografía AP portátil en paciente de UCI con SDRA. Opacidades bilaterales difusas, tubo endotraqueal y catéter venoso central visibles.",
    keyFindings: [
      "Opacidades bilaterales difusas y parcheadas",
      "Broncograma aéreo bilateral",
      "Tubo endotraqueal in situ",
      "Catéter venoso central",
      "Sin evidencia de cardiomegalia (diferencial con edema cardiogénico)",
    ],
    clinicalContext:
      "SDRA: PaO₂/FiO₂ < 300, opacidades bilaterales no explicadas por ICC. Causa pulmonar o extrapulmonar.",
  },
  {
    id: "mediastinal-widening",
    title: "Ensanchamiento Mediastínico",
    category: "patologico",
    projection: "PA",
    imageUrl: mediastinalWideningImg,
    description:
      "Ensanchamiento mediastínico con adenopatías hiliares bilaterales. Mediastino superior ensanchado con bordes lobulados.",
    keyFindings: [
      "Mediastino superior > 8 cm",
      "Adenopatías hiliares bilaterales simétricas",
      "Bordes mediastínicos lobulados",
      "Tráquea puede estar comprimida o desplazada",
      "Signo 1-2-3 (sarcoidosis)",
    ],
    clinicalContext:
      "Diagnóstico diferencial: sarcoidosis, linfoma, metástasis, aneurisma aórtico. Requiere TC para caracterización.",
  },
];

export const rxGalleryCategories = [
  { id: "all", label: "Todas", icon: "🔍" },
  { id: "normal", label: "Normal", icon: "✅" },
  { id: "patologico", label: "Patológico", icon: "⚠️" },
  { id: "critico", label: "Crítico", icon: "🚨" },
];
