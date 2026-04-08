const normalLungImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/normal-lung_29a25342.png";
const pneumothoraxImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pneumothorax_bb6ff51f.gif";
const pleuralEffusionImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion_77d5e6e4.png"; // Using the same image as in library.ts
const consolidationImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/consolidation_7dd05c69.gif";
const interstitialEdemaImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/interstitial-edema_160eec6f.gif";
const atelectasisImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/atelectasis_11112c9a.gif";

export interface AtlasCase {
  id: string;
  title: string;
  category: string;
  description: string;
  findings: string[];
  diagnosis: string;
  explanation: string;
  keyFeatures: string[];
  color: string;
  imageUrl?: string;
}

export const atlasCases: AtlasCase[] = [
  {
    id: "normal-lung",
    title: "Pulmón Normal",
    category: "Normal",
    description:
      "Ecografía pulmonar normal que muestra la interfaz pleural con deslizamiento, líneas A y ausencia de líneas B patológicas.",
    findings: [
      "Línea pleural hiperecogénica visible",
      "Deslizamiento pleural presente (sliding sign)",
      "Líneas A equidistantes y horizontales",
      "Ausencia de líneas B patológicas (≤2 por campo)",
      "Signo de la playa en modo M",
    ],
    diagnosis: "Pulmón normalmente aireado",
    explanation:
      "El pulmón normal aireado refleja casi completamente el ultrasonido en la interfaz pleural, generando artefactos de reverberación (líneas A). El deslizamiento pleural confirma el contacto entre ambas pleuras y el movimiento respiratorio normal.",
    keyFeatures: ["Deslizamiento +", "Líneas A", "Seashore sign en modo M"],
    color: "hsl(152, 60%, 40%)",
    imageUrl: normalLungImg,
  },
  {
    id: "pneumothorax",
    title: "Neumotórax",
    category: "Emergencia",
    description:
      "Presencia de aire en el espacio pleural que separa las pleuras visceral y parietal, aboliendo el deslizamiento pleural.",
    findings: [
      "Ausencia de deslizamiento pleural",
      "Líneas A presentes (sin deslizamiento)",
      "Signo del código de barras en modo M",
      "Ausencia de líneas B",
      "Punto pulmonar (patognomónico, en neumotórax parcial)",
    ],
    diagnosis: "Neumotórax",
    explanation:
      "El aire libre en el espacio pleural impide el contacto entre las pleuras, aboliendo el deslizamiento. El modo M muestra el signo del código de barras (solo líneas horizontales). El punto pulmonar, cuando presente, es 100% específico.",
    keyFeatures: ["No sliding", "Barcode sign", "Lung point", "No B-lines"],
    color: "hsl(0, 84%, 60%)",
    imageUrl: pneumothoraxImg,
  },
  {
    id: "pleural-effusion",
    title: "Derrame Pleural",
    category: "Frecuente",
    description:
      "Acumulación de líquido en el espacio pleural visible como colección anecoica o ecogénica entre las pleuras.",
    findings: [
      "Colección anecoica/ecogénica entre pleuras",
      "Signo del cuadrilátero",
      "Signo del sinusoide en modo M",
      "Pulmón comprimido/atelectásico visible",
      "Posible signo de la medusa en derrames masivos",
    ],
    diagnosis: "Derrame pleural",
    explanation:
      "El líquido pleural es visible como espacio anecoico (trasudado) o ecogénico (exudado/sangre). El signo del cuadrilátero delimita el derrame. El sinusoide en modo M confirma líquido libre. La ecogenicidad orienta la etiología.",
    keyFeatures: ["Quad sign", "Sinusoid sign", "Jellyfish sign"],
    color: "hsl(215, 60%, 50%)",
    imageUrl: pleuralEffusionImg,
  },
  {
    id: "consolidation",
    title: "Consolidación Pulmonar",
    category: "Frecuente",
    description:
      "Hepatización del parénquima pulmonar donde el pulmón adquiere una ecotextura similar al hígado por llenado alveolar.",
    findings: [
      "Patrón tisular similar al hígado (hepatización)",
      "Broncograma aéreo dinámico o estático",
      "Posible broncograma líquido",
      "Bordes irregulares (shred sign)",
      "Derrame paraneumónico asociado frecuente",
    ],
    diagnosis: "Consolidación pulmonar (neumonía, atelectasia)",
    explanation:
      "Cuando los alvéolos se llenan de líquido inflamatorio, el pulmón pierde aire y se vuelve ecogénicamente similar al hígado. Los bronquios con aire dentro aparecen como broncogramas aéreos. Su carácter dinámico o estático orienta entre neumonía y atelectasia.",
    keyFeatures: ["Hepatización", "Air bronchogram", "Shred sign"],
    color: "hsl(25, 80%, 50%)",
    imageUrl: consolidationImg,
  },
  {
    id: "interstitial-edema",
    title: "Edema Pulmonar Intersticial",
    category: "Frecuente",
    description:
      "Síndrome intersticial ecográfico caracterizado por múltiples líneas B bilaterales difusas que indican acumulación de líquido extravascular pulmonar.",
    findings: [
      "Múltiples líneas B (≥3 por campo intercostal)",
      "Distribución bilateral y simétrica",
      "Deslizamiento pleural conservado",
      "Línea pleural regular",
      "Posible derrame pleural bilateral asociado",
    ],
    diagnosis: "Edema pulmonar / Síndrome intersticial",
    explanation:
      "Las líneas B múltiples reflejan el engrosamiento de los septos interlobulillares por edema. Su distribución bilateral y simétrica sugiere causa cardiogénica. La asimetría o distribución parcheada orienta hacia SDRA o neumonía.",
    keyFeatures: ["B-lines ≥3", "Bilateral", "Simétrico"],
    color: "hsl(200, 80%, 55%)",
    imageUrl: interstitialEdemaImg,
  },
  {
    id: "atelectasis",
    title: "Atelectasia",
    category: "Frecuente",
    description:
      "Colapso del parénquima pulmonar con pérdida de volumen. Puede ser compresiva (por derrame) u obstructiva (por tapón mucoso o tumor).",
    findings: [
      "Consolidación con pérdida de volumen",
      "Broncograma aéreo estático (obstructiva)",
      "Broncograma líquido (obstructiva)",
      "Pulso pulmonar presente (sin deslizamiento)",
      "Frecuentemente asociada a derrame pleural",
    ],
    diagnosis: "Atelectasia pulmonar",
    explanation:
      "El pulmón colapsado pierde aire y se consolida. En atelectasia obstructiva, los bronquios se llenan de moco (broncograma líquido) y no se mueven (broncograma estático). En compresiva, el derrame empuja el pulmón. El pulso pulmonar diferencia de neumotórax.",
    keyFeatures: ["Static bronchogram", "Lung pulse", "Volume loss"],
    color: "hsl(280, 50%, 50%)",
    imageUrl: atelectasisImg,
  },
];

export const atlasCategories = [
  { id: "all", label: "Todos" },
  { id: "Normal", label: "Normal" },
  { id: "Emergencia", label: "Emergencia" },
  { id: "Frecuente", label: "Frecuente" },
];
