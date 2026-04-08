const aLinesImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/a-lines_87586e4e.gif";
const bLinesImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/few-b-lines_4b55481e.gif";
const lungSlidingImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-sliding_877f00a8.gif";
const lungPulseImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-pulse_c0abcb13.png";
const seashoreSignImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/seashore-sign_ee1c5401.png";
const barcodeSignImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/barcode-sign_77d722a9.gif";
const lungPointImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-point_b4f5b84b.gif";
const jellyfishSignImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/jellyfish-sign_3dca3bb8.gif";
const quadSignImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/quad-sign_a31b35bf.png";
const sinusoidSignImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/sinusoid-sign_dc88f6f5.png";
const airBronchogramImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/air-bronchogram_6929e36e.gif";
const consolidationImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/consolidation_93984838.gif";
const pleuralEffusionImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion_77d5e6e4.png";
const fluidBronchogramImg =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/fluid-bronchogram_example.gif"; // Reemplazar con una URL real

export interface LUSSign {
  id: string;
  name: string;
  category: "artifact" | "sign" | "physics";
  definition: string;
  pathophysiology: string;
  clinicalExample: string;
  clinicalInterpretation: string;
  associatedDiagnosis: string[];
  icon: string;
  color: string;
  imageUrl?: string;
  imageSource?: string;
}

export const lusLibrary: LUSSign[] = [
  {
    id: "a-lines",
    name: "Líneas A",
    category: "artifact",
    definition:
      "Artefactos de reverberación horizontales, hiperecogénicas, equidistantes y paralelas a la línea pleural. Son repeticiones de la línea pleural a intervalos regulares.",
    pathophysiology:
      "Se generan por la reflexión repetida del ultrasonido entre la sonda y la pleura. Indican presencia de aire subpleural (pulmón normal aireado). La impedancia acústica entre tejido blando y aire causa reflexión casi total.",
    clinicalExample:
      "Paciente sano en bipedestación. Al explorar la zona anterior del tórax se observan líneas horizontales repetitivas por debajo de la línea pleural, con deslizamiento pleural presente.",
    clinicalInterpretation:
      "Patrón A con deslizamiento pleural = pulmón normal aireado. Patrón A sin deslizamiento = sospechar neumotórax. Las líneas A por sí solas no confirman normalidad.",
    associatedDiagnosis: [
      "Pulmón normal",
      "Neumotórax (sin deslizamiento)",
      "EPOC",
      "Asma",
      "TEP",
    ],
    icon: "〰️",
    color: "hsl(190, 70%, 42%)",
    imageUrl: aLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "b-lines",
    name: "Líneas B",
    category: "artifact",
    definition:
      "Artefactos verticales hiperecogénicos tipo 'cola de cometa' que nacen de la línea pleural, se extienden hasta el fondo de la pantalla, se mueven con el deslizamiento pleural y borran las líneas A.",
    pathophysiology:
      "Se producen por la reverberación del ultrasonido en los septos interlobulillares engrosados o alvéolos llenos de líquido. Reflejan el síndrome intersticial: acumulación de líquido extravascular pulmonar.",
    clinicalExample:
      "Paciente con insuficiencia cardíaca aguda. Se observan múltiples líneas B bilaterales (≥3 por campo intercostal) en zonas anteriores y laterales del tórax.",
    clinicalInterpretation:
      "≥3 líneas B por espacio intercostal = patrón B (síndrome intersticial). B lines difusas bilaterales sugieren edema pulmonar. Focales pueden indicar neumonía o contusión.",
    associatedDiagnosis: [
      "Edema pulmonar cardiogénico",
      "SDRA",
      "Neumonía intersticial",
      "Fibrosis pulmonar",
      "Contusión pulmonar",
    ],
    icon: "📊",
    color: "hsl(215, 80%, 28%)",
    imageUrl: bLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "pleural-sliding",
    name: "Deslizamiento pleural",
    category: "sign",
    definition:
      "Movimiento horizontal de la línea pleural sincronizado con la respiración. Representa el deslizamiento de la pleura visceral sobre la parietal.",
    pathophysiology:
      "Durante la respiración, la pleura visceral se desplaza sobre la parietal. Este movimiento genera un patrón centelleante en la línea pleural visible en modo B y el signo de la playa en modo M.",
    clinicalExample:
      "Paciente con disnea aguda. Se evalúa la presencia de deslizamiento pleural para descartar neumotórax. Un deslizamiento presente descarta neumotórax en el punto explorado.",
    clinicalInterpretation:
      "Deslizamiento presente = las pleuras están en contacto, descarta neumotórax en ese punto. Ausencia de deslizamiento puede indicar neumotórax, pleurodesis, apnea, intubación selectiva.",
    associatedDiagnosis: [
      "Normal (presente)",
      "Neumotórax (ausente)",
      "Pleurodesis (ausente)",
      "Intubación selectiva (ausente)",
    ],
    icon: "↔️",
    color: "hsl(152, 60%, 40%)",
    imageUrl: lungSlidingImg,
    imageSource: "POCUS 101",
  },
  {
    id: "lung-pulse",
    name: "Pulso pulmonar",
    category: "sign",
    definition:
      "Movimiento sutil de la línea pleural sincronizado con el latido cardíaco, visible cuando no hay deslizamiento pleural pero las pleuras mantienen contacto.",
    pathophysiology:
      "La transmisión del impulso cardíaco a través del parénquima pulmonar genera un movimiento rítmico sutil de la pleura. Su presencia indica que las pleuras están en contacto, descartando neumotórax.",
    clinicalExample:
      "Paciente intubado sin deslizamiento pleural. Se observa un movimiento sutil rítmico de la línea pleural coincidente con el ECG. Esto descarta neumotórax.",
    clinicalInterpretation:
      "La presencia de pulso pulmonar descarta neumotórax aunque no haya deslizamiento. Indica contacto pleural mantenido. Se ve en atelectasia, apnea, parálisis diafragmática.",
    associatedDiagnosis: [
      "Atelectasia",
      "Apnea",
      "Intubación selectiva contralateral",
    ],
    icon: "💓",
    color: "hsl(0, 72%, 51%)",
    imageUrl: lungPulseImg,
    imageSource: "Ilustración esquemática",
  },
  {
    id: "seashore-sign",
    name: "Signo de la playa (Seashore sign)",
    category: "sign",
    definition:
      "Patrón en modo M que muestra líneas horizontales paralelas (pared torácica) sobre un patrón granular tipo arena de playa (parénquima pulmonar en movimiento).",
    pathophysiology:
      "En modo M, la pared torácica inmóvil genera líneas horizontales. Por debajo de la línea pleural, el movimiento del pulmón aireado genera un patrón granular. Juntos simulan 'mar y arena'.",
    clinicalExample:
      "Al activar el modo M sobre un pulmón normal con deslizamiento, se observa el clásico patrón de playa: ondas (mar) arriba y arena (granular) abajo.",
    clinicalInterpretation:
      "Signo de la playa presente = deslizamiento pleural normal, descarta neumotórax. Es la confirmación en modo M del deslizamiento pleural visto en modo B.",
    associatedDiagnosis: ["Pulmón normal", "Descarta neumotórax"],
    icon: "🏖️",
    color: "hsl(40, 80%, 55%)",
    imageUrl: seashoreSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "barcode-sign",
    name: "Signo del código de barras (Stratosphere sign)",
    category: "sign",
    definition:
      "Patrón en modo M que muestra únicamente líneas horizontales paralelas tanto por encima como por debajo de la línea pleural, sin patrón granular.",
    pathophysiology:
      "La ausencia de movimiento pulmonar (sin deslizamiento) genera un patrón uniforme de líneas horizontales en modo M. La pleura y el pulmón están inmóviles o separados por aire.",
    clinicalExample:
      "Paciente con trauma torácico. En modo M se observan líneas horizontales continuas (código de barras) sin patrón de playa, altamente sugestivo de neumotórax.",
    clinicalInterpretation:
      "Signo del código de barras = ausencia de deslizamiento pleural = alta sospecha de neumotórax. También puede verse en pleurodesis o pulmón inmóvil por otras causas.",
    associatedDiagnosis: ["Neumotórax", "Pleurodesis", "Apnea"],
    icon: "📱",
    color: "hsl(0, 0%, 35%)",
    imageUrl: barcodeSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "lung-point",
    name: "Signo del punto pulmonar",
    category: "sign",
    definition:
      "Punto donde alterna el patrón de deslizamiento pleural (signo de la playa) con su ausencia (código de barras). Marca el límite del neumotórax.",
    pathophysiology:
      "En el neumotórax parcial, existe un punto de transición donde el pulmón colapsado se separa de la pared torácica. En este punto se observa alternancia entre deslizamiento y no deslizamiento.",
    clinicalExample:
      "Paciente con neumotórax parcial. Al desplazar la sonda lateralmente se encuentra un punto donde intermitentemente aparece y desaparece el deslizamiento pleural.",
    clinicalInterpretation:
      "Es patognomónico de neumotórax (especificidad 100%). Su localización indica el tamaño del neumotórax. Cuanto más lateral o posterior, mayor es el neumotórax.",
    associatedDiagnosis: ["Neumotórax (patognomónico)"],
    icon: "📍",
    color: "hsl(0, 84%, 60%)",
    imageUrl: lungPointImg,
    imageSource: "POCUS 101",
  },
  {
    id: "jellyfish-sign",
    name: "Signo de la medusa",
    category: "sign",
    definition:
      "Imagen ecográfica donde el pulmón atelectásico flota dentro del derrame pleural, con movimientos ondulantes que recuerdan a una medusa en el agua.",
    pathophysiology:
      "En derrames pleurales masivos, el pulmón completamente colapsado flota libremente en el líquido pleural. Los movimientos respiratorios y cardíacos generan ondulaciones del parénquima colapsado.",
    clinicalExample:
      "Paciente con derrame pleural masivo. Se observa el parénquima pulmonar colapsado flotando dentro del líquido, con movimientos ondulantes respiratorios.",
    clinicalInterpretation:
      "Indica derrame pleural masivo con atelectasia completa del lóbulo o pulmón. Sugiere necesidad de drenaje urgente y evaluación de la causa del derrame.",
    associatedDiagnosis: [
      "Derrame pleural masivo",
      "Atelectasia compresiva completa",
    ],
    icon: "🪼",
    color: "hsl(200, 80%, 55%)",
    imageUrl: jellyfishSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "quad-sign",
    name: "Signo del cuadrilátero",
    category: "sign",
    definition:
      "Imagen ecográfica rectangular delimitada superiormente por la línea pleural, lateralmente por las sombras costales e inferiormente por la línea del pulmón, con contenido anecoico (líquido).",
    pathophysiology:
      "El líquido pleural se acumula entre la pleura visceral y parietal. Las costillas generan sombras laterales y la pleura visceral forma el límite inferior, creando una imagen rectangular con líquido anecoico.",
    clinicalExample:
      "Paciente con derrame pleural moderado. Entre las costillas se visualiza una colección anecoica rectangular entre la pared torácica y el pulmón.",
    clinicalInterpretation:
      "Confirma la presencia de derrame pleural. El contenido anecoico sugiere trasudado. El contenido ecogénico o con septos sugiere exudado, hemotórax o empiema.",
    associatedDiagnosis: ["Derrame pleural", "Hemotórax", "Empiema"],
    icon: "⬜",
    color: "hsl(215, 60%, 50%)",
    imageUrl: quadSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "sinusoid-sign",
    name: "Signo del sinusoide",
    category: "sign",
    definition:
      "En modo M sobre un derrame pleural, la línea del pulmón (pleura visceral) se acerca y aleja de la pared torácica con la respiración, generando un patrón sinusoidal.",
    pathophysiology:
      "Durante la inspiración, el pulmón se expande y la pleura visceral se acerca a la pared torácica, reduciendo el espacio del derrame. En espiración se aleja. Esto crea una onda sinusoidal en modo M.",
    clinicalExample:
      "Paciente con derrame pleural libre. En modo M se observa movimiento ondulante de la línea pulmonar que se acerca y aleja rítmicamente de la pared torácica.",
    clinicalInterpretation:
      "Indica derrame pleural libre (no tabicado). Un derrame tabicado no mostrará este signo. Útil para diferenciar derrames libres de organizados antes de drenar.",
    associatedDiagnosis: ["Derrame pleural libre"],
    icon: "〰️",
    color: "hsl(170, 60%, 45%)",
    imageUrl: sinusoidSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "air-bronchogram",
    name: "Broncograma aéreo",
    category: "sign",
    definition:
      "Imágenes puntiformes o lineales hiperecogénicas dentro de una consolidación pulmonar, que representan bronquios con aire rodeados de parénquima hepatizado.",
    pathophysiology:
      "Cuando los alvéolos se llenan de líquido/pus/células, el parénquima pulmonar se 'hepatiza'. Los bronquios que mantienen aire dentro de esta consolidación generan reflexiones hiperecogénicas.",
    clinicalExample:
      "Paciente con neumonía lobar. Se observa una consolidación con textura similar al hígado (hepatización) con puntos brillantes en su interior que se mueven con la respiración (broncograma aéreo dinámico).",
    clinicalInterpretation:
      "Broncograma aéreo dinámico (se mueve con respiración) sugiere neumonía. Broncograma estático (inmóvil) sugiere atelectasia obstructiva. Es clave para diferenciar consolidación infecciosa de obstructiva.",
    associatedDiagnosis: ["Neumonía", "Atelectasia obstructiva", "SDRA"],
    icon: "🫁",
    color: "hsl(25, 80%, 50%)",
    imageUrl: airBronchogramImg,
    imageSource: "POCUS 101",
  },
  {
    id: "fluid-bronchogram",
    name: "Broncograma líquido",
    category: "sign",
    definition:
      "Estructuras tubulares anecoicas (oscuras) dentro de una consolidación pulmonar, que representan bronquios llenos de líquido o moco rodeados de parénquima consolidado.",
    pathophysiology:
      "Cuando tanto los alvéolos como los bronquios se llenan de líquido, los bronquios aparecen como estructuras tubulares anecoicas. Indica obstrucción bronquial completa con retención de secreciones.",
    clinicalExample:
      "Paciente con atelectasia obstructiva por tapón mucoso. Se observa consolidación con estructuras tubulares anecoicas ramificadas en su interior.",
    clinicalInterpretation:
      "El broncograma líquido sugiere fuertemente atelectasia obstructiva (por tumor, moco o cuerpo extraño). Es importante para el diagnóstico diferencial con neumonía y para indicar broncoscopia.",
    associatedDiagnosis: [
      "Atelectasia obstructiva",
      "Neumonía necrotizante",
      "Carcinoma bronquial",
    ],
    icon: "💧",
    color: "hsl(200, 70%, 45%)",
    imageUrl: consolidationImg,
    imageSource: "POCUS 101",
  },
];

export const libraryCategories = [
  { id: "all", label: "Todos", count: lusLibrary.length },
  {
    id: "artifact",
    label: "Artefactos",
    count: lusLibrary.filter(s => s.category === "artifact").length,
  },
  {
    id: "sign",
    label: "Signos",
    count: lusLibrary.filter(s => s.category === "sign").length,
  },
];
