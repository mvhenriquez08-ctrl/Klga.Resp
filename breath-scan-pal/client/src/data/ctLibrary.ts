const normalCt =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-normal_example.jpg"; // Reemplazar con URL real
const groundGlass =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-ground-glass_example.jpg"; // Reemplazar con URL real
const consolidationCt =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-consolidation_example.jpg"; // Reemplazar con URL real
const emphysema =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-emphysema_example.jpg"; // Reemplazar con URL real
const honeycombing =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-honeycombing_example.jpg"; // Reemplazar con URL real
const bronchiectasis =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-bronchiectasis_example.jpg"; // Reemplazar con URL real
const pulmonaryNodule =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-pulmonary-nodule_example.jpg"; // Reemplazar con URL real
const pleuralEffusionCt =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-pleural-effusion_example.jpg"; // Reemplazar con URL real
const crazyPaving =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-crazy-paving_example.jpg"; // Reemplazar con URL real
const pulmonaryEmbolism =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ct-pulmonary-embolism_example.jpg"; // Reemplazar con URL real

export interface CTPattern {
  id: string;
  name: string;
  category:
    | "opacificacion"
    | "densidad"
    | "nodular"
    | "reticular"
    | "vascular"
    | "normal";
  image: string;
  imageUrl?: string;
  description: string;
  mechanism: string;
  differentialDx: string[];
  keyFindings: string[];
  clinicalContext: string;
}

export const ctPatterns: CTPattern[] = [
  // Renamed from bs_ctPatterns
  {
    id: "normal",
    name: "TC de Tórax Normal",
    category: "normal",
    image: normalCt,
    description:
      "Parénquima pulmonar con densidad normal (-700 a -900 UH). Estructuras mediastínicas, vasculares y óseas sin alteraciones.",
    mechanism:
      "Pulmón normalmente aireado con lobulillos secundarios no visibles en condiciones normales.",
    differentialDx: [],
    keyFindings: [
      "Campos pulmonares claros",
      "Mediastino sin adenopatías",
      "Senos costofrénicos libres",
      "Tráquea y bronquios permeables",
    ],
    clinicalContext:
      "Referencia anatómica normal para comparación con hallazgos patológicos.",
  },
  {
    id: "vidrio-deslustrado",
    name: "Vidrio Deslustrado (Ground Glass)",
    category: "opacificacion",
    image: groundGlass,
    description:
      "Aumento de densidad tenue que permite visualizar los vasos pulmonares a través de la opacidad. Puede ser signo de patología alveolar o intersticial.",
    mechanism:
      "Ocupación parcial del espacio aéreo por fluido, células inflamatorias o engrosamiento intersticial. Los alvéolos están parcialmente llenos pero no completamente consolidados.",
    differentialDx: [
      "Neumonía por Pneumocystis",
      "NINE",
      "Hemorragia alveolar",
      "Edema pulmonar",
      "Daño alveolar difuso",
      "Adenocarcinoma",
      "Proteinosis alveolar",
    ],
    keyFindings: [
      "Opacidad tenue que no borra vasos",
      "Signo del bronquio negro",
      "Distribución parcheada o difusa",
      "Puede ser uni o bilateral",
    ],
    clinicalContext:
      "Curso agudo → edema, hemorragia, DAD, infección. Curso crónico → enfermedades intersticiales, adenocarcinoma.",
  },
  {
    id: "consolidacion-tc",
    name: "Consolidación",
    category: "opacificacion",
    image: consolidationCt,
    description:
      "Aumento de densidad parenquimatosa que impide ver la vascularización normal del pulmón. Puede acompañarse de broncograma aéreo.",
    mechanism:
      "Sustitución del aire alveolar por fluido (edema), pus (neumonía), sangre (hemorragia/contusión) o células (adenocarcinoma, linfoma).",
    differentialDx: [
      "Neumonía bacteriana",
      "Edema pulmonar",
      "Hemorragia pulmonar",
      "Contusión pulmonar",
      "Adenocarcinoma",
      "Linfoma",
      "Neumonía organizada",
    ],
    keyFindings: [
      "Opacidad densa que borra vasos",
      "Broncograma aéreo",
      "Distribución lobar o segmentaria",
      "Puede ser multifocal",
    ],
    clinicalContext:
      "Valorar en contexto clínico: agudo vs crónico, infeccioso vs no infeccioso, localización y extensión.",
  },
  {
    id: "enfisema",
    name: "Enfisema",
    category: "densidad",
    image: emphysema,
    description:
      "Aumento permanente y patológico del espacio aéreo distal al bronquiolo terminal con destrucción de paredes alveolares. Zonas de hipoatenuación sin pared visible.",
    mechanism:
      "Destrucción proteolítica de las paredes alveolares, generalmente por desequilibrio proteasas-antiproteasas (tabaquismo, déficit de alfa-1 antitripsina).",
    differentialDx: [
      "Enfisema centrolobulillar",
      "Enfisema paraseptal",
      "Enfisema panacinar",
      "Bullas",
    ],
    keyFindings: [
      "Áreas de hiperclaridad sin paredes",
      "Centrolobulillar: centro del lobulillo",
      "Paraseptal: subpleural en fila única",
      "Panacinar: todo el lobulillo",
    ],
    clinicalContext:
      "Enfisema centrolobulillar predomina en lóbulos superiores (tabaquismo). Panacinar en bases (déficit α1-AT).",
  },
  {
    id: "crazy-paving",
    name: "Crazy Paving (Empedrado)",
    category: "opacificacion",
    image: crazyPaving,
    description:
      "Patrón de vidrio deslustrado con engrosamiento superpuesto de septos interlobulillares, creando un aspecto de empedrado o pavimento irregular.",
    mechanism:
      "Combinación de ocupación parcial alveolar (vidrio deslustrado) con engrosamiento septal (reticular), produciendo un patrón mixto característico.",
    differentialDx: [
      "Proteinosis alveolar",
      "Neumonía por Pneumocystis",
      "Hemorragia alveolar",
      "Neumonía lipoidea",
      "SDRA",
      "COVID-19",
    ],
    keyFindings: [
      "Vidrio deslustrado + reticulación septal",
      "Aspecto de mosaico irregular",
      "Puede ser focal o difuso",
      "Distribución geográfica",
    ],
    clinicalContext:
      "Hallazgo clásico de proteinosis alveolar pulmonar, pero también frecuente en COVID-19 y otras neumonías.",
  },
  {
    id: "panalización",
    name: "Panalización (Honeycombing)",
    category: "reticular",
    image: honeycombing,
    description:
      "Quistes aéreos subpleurales < 1 cm dispuestos en varias filas, representando el estadio final de fibrosis pulmonar con destrucción arquitectural completa.",
    mechanism:
      "Destrucción y remodelación fibrótica del parénquima pulmonar con formación de espacios quísticos revestidos por epitelio bronquiolar.",
    differentialDx: [
      "Neumonía intersticial usual (NIU/FPI)",
      "Asbestosis avanzada",
      "Artritis reumatoide",
      "Esclerodermia",
    ],
    keyFindings: [
      "Quistes subpleurales en múltiples filas",
      "Predominio basal y periférico",
      "Bronquiectasias de tracción asociadas",
      "Pérdida de volumen",
    ],
    clinicalContext:
      "Hallazgo definitorio de patrón NIU. Cuando se asocia a clínica compatible, puede diagnosticar FPI sin biopsia.",
  },
  {
    id: "bronquiectasias",
    name: "Bronquiectasias",
    category: "densidad",
    image: bronchiectasis,
    description:
      "Dilataciones irreversibles del árbol bronquial. Se clasifican en cilíndricas, quísticas y varicosas según su morfología.",
    mechanism:
      "Destrucción de la pared bronquial por infección crónica, inflamación o tracción fibrótica, con pérdida del soporte cartilaginoso.",
    differentialDx: [
      "Fibrosis quística",
      "Infección crónica",
      "ABPA",
      "Discinesia ciliar primaria",
      "Bronquiectasias de tracción (fibrosis)",
    ],
    keyFindings: [
      "Signo del anillo de sello (bronquio > arteria)",
      "Cilíndricas: dilatación uniforme",
      "Quísticas: cavidades con nivel",
      "Varicosas: dilatación irregular",
    ],
    clinicalContext:
      "Las de tracción aparecen en el seno de fibrosis pulmonar y tienen diferente significado que las infecciosas.",
  },
  {
    id: "nodulo-pulmonar",
    name: "Nódulo Pulmonar Solitario",
    category: "nodular",
    image: pulmonaryNodule,
    description:
      "Opacidad redondeada < 3 cm. La TC permite valorar tamaño, márgenes, calcificaciones, contenido graso y captación de contraste.",
    mechanism:
      "Crecimiento focal de tejido anormal: neoplásico (adenocarcinoma, metástasis), infeccioso (granuloma) o benigno (hamartoma).",
    differentialDx: [
      "Adenocarcinoma",
      "Carcinoma escamoso",
      "Metástasis",
      "Granuloma (TB, hongos)",
      "Hamartoma",
      "Carcinoide",
    ],
    keyFindings: [
      "Márgenes espiculados → sospecha malignidad",
      "Calcificación central/laminar → benigno",
      "Calcificación excéntrica → maligno",
      "Grasa intranodular → hamartoma",
      "Captación > 15 UH → sospecha malignidad",
    ],
    clinicalContext:
      "Nódulos < 4 mm tienen < 1% probabilidad de malignidad. Seguimiento según guías Fleischner Society.",
  },
  {
    id: "derrame-pleural-tc",
    name: "Derrame Pleural",
    category: "opacificacion",
    image: pleuralEffusionCt,
    description:
      "Colección líquida en el espacio pleural, visible como densidad homogénea dependiente de la gravedad.",
    mechanism:
      "Acumulación de líquido por aumento de presión hidrostática (trasudado), inflamación pleural (exudado) o sangrado (hemotórax).",
    differentialDx: [
      "Insuficiencia cardíaca",
      "Neumonía con derrame paraneumónico",
      "Empiema",
      "Neoplasia pleural",
      "TEP",
      "Hemotórax",
    ],
    keyFindings: [
      "Densidad < 10 UH → trasudado",
      "Densidad > 15 UH → exudado/hemotórax",
      "Loculaciones → empiema",
      "Engrosamiento pleural → malignidad",
    ],
    clinicalContext:
      "La TC detecta derrames < 10 mL. Distingue entre empiema y derrame simple por patrón de captación.",
  },
  {
    id: "tep",
    name: "Tromboembolismo Pulmonar (TEP)",
    category: "vascular",
    image: pulmonaryEmbolism,
    description:
      "Defecto de llenado intraluminal en las arterias pulmonares en angioTC con contraste. Método de elección para diagnóstico de TEP.",
    mechanism:
      "Migración de trombos (generalmente de MMII) hacia la circulación pulmonar, con obstrucción parcial o completa del flujo arterial.",
    differentialDx: [
      "TEP agudo",
      "TEP crónico",
      "Sarcoma de arteria pulmonar",
      "Artefacto de flujo",
    ],
    keyFindings: [
      "Defecto de llenado intraluminal",
      "Signo del polo (trombo rodeado de contraste)",
      "Dilatación VD (VD/VI > 1)",
      "Reflujo a venas hepáticas",
      "Infarto pulmonar periférico triangular",
    ],
    clinicalContext:
      "Sensibilidad 83%, especificidad 96%. La dilatación del VD indica mal pronóstico y necesidad de tratamiento urgente.",
  },
];

export const ctCategories = [
  { id: "all", label: "Todos" },
  { id: "opacificacion", label: "Opacificación" },
  { id: "normal", label: "Normal" },
  { id: "densidad", label: "↓ Densidad" },
  { id: "nodular", label: "Nodular" },
  { id: "reticular", label: "Reticular" },
  { id: "vascular", label: "Vascular" },
];

export interface InterpretationStep {
  order: number;
  title: string;
  window: string;
  structures: string[];
  tips: string[];
}

export const interpretationSteps: InterpretationStep[] = [
  // Renamed from bs_interpretationSteps
  {
    order: 1,
    title: "Calidad Técnica",
    window: "Todas",
    structures: [
      "Nivel del corte",
      "Uso de contraste",
      "Artefactos de movimiento",
      "Ventana adecuada",
    ],
    tips: [
      "Verificar que el estudio sea completo",
      "Confirmar fase de contraste apropiada para la indicación",
      "Evaluar presencia de artefactos que limiten la interpretación",
    ],
  },
  {
    order: 2,
    title: "Ventana Mediastínica",
    window: "Mediastino (W: 350, L: 50)",
    structures: [
      "Tráquea y bronquios principales",
      "Grandes vasos (aorta, cava, pulmonar)",
      "Corazón y pericardio",
      "Ganglios linfáticos mediastínicos",
      "Esófago",
      "Tiroides (si visible)",
    ],
    tips: [
      "Medir aorta ascendente (normal < 4 cm)",
      "Buscar adenopatías > 1 cm en eje corto",
      "Evaluar relación VD/VI",
      "Valorar derrame pericárdico",
    ],
  },
  {
    order: 3,
    title: "Ventana Pulmonar",
    window: "Pulmón (W: 1500, L: -600)",
    structures: [
      "Parénquima bilateral",
      "Cisuras",
      "Bronquios segmentarios",
      "Vasos pulmonares",
      "Pleura",
    ],
    tips: [
      "Comparar ambos pulmones sistemáticamente",
      "Identificar patrón predominante",
      "Evaluar distribución: central vs periférica, superior vs inferior",
      "Buscar broncograma aéreo en consolidaciones",
      "Valorar signo del anillo de sello para bronquiectasias",
    ],
  },
  {
    order: 4,
    title: "Ventana Ósea",
    window: "Hueso (W: 1500, L: 300)",
    structures: [
      "Columna vertebral",
      "Costillas",
      "Esternón",
      "Escápulas",
      "Clavículas",
    ],
    tips: [
      "Buscar lesiones líticas o blásticas",
      "Evaluar fracturas costales",
      "Valorar aplastamientos vertebrales",
      "Buscar lesiones expansivas",
    ],
  },
  {
    order: 5,
    title: "Tejidos Blandos y Abdomen Superior",
    window: "Tejidos blandos (W: 400, L: 40)",
    structures: [
      "Pared torácica",
      "Mamas",
      "Axila (adenopatías)",
      "Hígado (si visible)",
      "Suprarrenales",
    ],
    tips: [
      "Buscar masas en pared torácica",
      "Evaluar adenopatías axilares",
      "Valorar hígado y suprarrenales en estadiaje oncológico",
    ],
  },
];
