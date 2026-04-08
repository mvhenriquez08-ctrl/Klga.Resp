const aLinesImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/a-lines_87586e4e.gif";
const bLinesImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/few-b-lines_4b55481e.gif";
const lungSlidingImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-sliding_877f00a8.gif";
const lungPulseImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-pulse_c0abcb13.png";
const seashoreSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/seashore-sign_ee1c5401.png";
const barcodeSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/barcode-sign_77d722a9.gif";
const lungPointImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-point_b4f5b84b.gif";
const jellyfishSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/jellyfish-sign_3dca3bb8.gif";
const quadSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/quad-sign_a31b35bf.png";
const sinusoidSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/sinusoid-sign_dc88f6f5.png";
const airBronchogramImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/air-bronchogram_6929e36e.gif";
const consolidationImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/consolidation_93984838.gif";
const pleuralEffusionImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion_77d5e6e4.png";
const whiteLungImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/white-lung_7a2f02f4.gif";
const zLinesImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/z-lines_e4b54e8e.gif";
const eLinesImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/e-lines_f4b54e8e.gif";
const curtainSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/curtain-sign_g4b54e8e.gif";
const spineSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/spine-sign_h4b54e8e.gif";
const shredSignImg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/shred-sign_i4b54e8e.gif";

export interface LUSSign {
  id: string;
  name: string;
  category: string;
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
    id: "bat-sign",
    name: "Signo del murciélago (Bat Sign)",
    category: "anatomy",
    definition: "Imagen anatómica fundamental que consiste en dos sombras acústicas (costillas superior e inferior) y una línea hiperecogénica horizontal entre ellas (línea pleural).",
    pathophysiology: "El ultrasonido no penetra el hueso de las costillas, dejando sombras acústicas negras. La pleura, que es altamente ecogénica, dibuja una línea brillante horizontal que asemeja el cuerpo de un murciélago, siendo las sombras costales sus alas.",
    clinicalExample: "Exploración normal en eje longitudinal (corte sagital) sobre cualquier espacio intercostal.",
    clinicalInterpretation: "Es el paso cero de cualquier ecografía pulmonar: permite identificar con seguridad dónde está la línea pleural para evitar confundirla con la fascia endotorácica u otras estructuras musculares.",
    associatedDiagnosis: ["Anatomía normal base"],
    icon: "bat",
    color: "hsl(210, 20%, 50%)",
    imageUrl: aLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "a-lines",
    name: "Líneas A",
    category: "artifact",
    definition: "Artefactos de reverberación horizontales, hiperecogénicas, equidistantes y paralelas a la línea pleural. Son repeticiones de la línea pleural a intervalos regulares.",
    pathophysiology: "Se generan por la reflexión repetida del ultrasonido entre la sonda y la pleura. Indican presencia de aire subpleural (pulmón normal aireado). La impedancia acústica entre tejido blando y aire causa reflexión casi total.",
    clinicalExample: "Paciente sano en bipedestación. Al explorar la zona anterior del tórax se observan líneas horizontales repetitivas por debajo de la línea pleural, con deslizamiento pleural presente.",
    clinicalInterpretation: "Patrón A con deslizamiento pleural = pulmón normal aireado. Patrón A sin deslizamiento = sospechar neumotórax. Las líneas A por sí solas no confirman normalidad.",
    associatedDiagnosis: ["Pulmón normal", "Neumotórax (sin deslizamiento)", "EPOC", "Asma", "TEP"],
    icon: "waves",
    color: "hsl(190, 70%, 42%)",
    imageUrl: aLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "b-lines",
    name: "Líneas B",
    category: "artifact",
    definition: "Artefactos verticales hiperecogénicos tipo 'cola de cometa' que nacen de la línea pleural, se extienden hasta el fondo de la pantalla, se mueven con el deslizamiento pleural y borran las líneas A.",
    pathophysiology: "Se producen por la reverberación del ultrasonido en los septos interlobulillares engrosados o alvéolos llenos de líquido. Reflejan el síndrome intersticial: acumulación de líquido extravascular pulmonar.",
    clinicalExample: "Paciente con insuficiencia cardíaca aguda. Se observan múltiples líneas B bilaterales (≥3 por campo intercostal) en zonas anteriores y laterales del tórax.",
    clinicalInterpretation: "≥3 líneas B por espacio intercostal = patrón B (síndrome intersticial). B lines difusas bilaterales sugieren edema pulmonar. Focales pueden indicar neumonía o contusión.",
    associatedDiagnosis: ["Edema pulmonar cardiogénico", "SDRA", "Neumonía intersticial", "Fibrosis pulmonar", "Contusión pulmonar"],
    icon: "align-justify",
    color: "hsl(215, 80%, 28%)",
    imageUrl: bLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "white-lung",
    name: "Pulmón Blanco (Confluencia de Líneas B)",
    category: "artifact",
    definition: "Fusión masiva de múltiples líneas B (> 5 por espacio) que crea una banda brillante ecogénica continua que ocupa todo el espacio intercostal y borra completamente las líneas A.",
    pathophysiology: "Refleja una pérdida casi total de la aireación alveolar por ocupación líquida difusa del intersticio y de los espacios alveolares, generando una reverberación acústica masiva.",
    clinicalExample: "Paciente con edema agudo de pulmón severo o SDRA avanzado. La pantalla muestra un resplandor blanco constante bajo la línea pleural.",
    clinicalInterpretation: "Indica síndrome alvéolo-intersticial severo. Representa un estado mucho más grave de acumulación de líquido que las líneas B discretas.",
    associatedDiagnosis: ["Edema pulmonar cardiogénico severo", "SDRA grave", "Neumonitis severa"],
    icon: "cloud",
    color: "hsl(215, 90%, 70%)",
    imageUrl: whiteLungImg,
    imageSource: "POCUS 101",
  },
  {
    id: "z-lines",
    name: "Líneas Z (Falsas Líneas B)",
    category: "artifact",
    definition: "Artefactos verticales cortos, no bien definidos, que nacen de la línea pleural pero se desvanecen rápidamente sin llegar a la parte inferior de la pantalla. No borran las líneas A ni se mueven sincronizadamente.",
    pathophysiology: "Se generan por pequeñas irregularidades inespecíficas en la superficie de la pared torácica o de la pleura. Carecen de significado patológico.",
    clinicalExample: "Paciente sano donde se ven pequeños 'destellos' verticales que no atraviesan toda la pantalla.",
    clinicalInterpretation: "No deben confundirse con las verdaderas líneas B. Las líneas Z son un hallazgo normal y no indican patología intersticial.",
    associatedDiagnosis: ["Pulmón normal (sin patología)"],
    icon: "zap",
    color: "hsl(210, 10%, 40%)",
    imageUrl: zLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "e-lines",
    name: "Líneas E (Enfisema)",
    category: "artifact",
    definition: "Líneas verticales similares a las líneas B, pero que nacen por encima (más superficiales) de la línea pleural anatómica.",
    pathophysiology: "El aire atrapado en el tejido subcutáneo de la pared torácica genera fuertes reflejos de ultrasonido antes de que el haz alcance la cavidad pleural.",
    clinicalExample: "Paciente politraumatizado con enfisema subcutáneo evidente a la palpación.",
    clinicalInterpretation: "Confirma el diagnóstico de enfisema subcutáneo. Al impedir que el haz de ultrasonido alcance la pleura, las líneas E hacen imposible evaluar el pulmón subyacente (y diagnosticar neumotórax mediante LUS en esa zona).",
    associatedDiagnosis: ["Enfisema subcutáneo", "Traumatismo torácico"],
    icon: "circle-dashed",
    color: "hsl(280, 50%, 60%)",
    imageUrl: eLinesImg,
    imageSource: "POCUS 101",
  },
  {
    id: "pleural-sliding",
    name: "Deslizamiento pleural",
    category: "sign",
    definition: "Movimiento horizontal de la línea pleural sincronizado con la respiración. Representa el deslizamiento de la pleura visceral sobre la parietal.",
    pathophysiology: "Durante la respiración, la pleura visceral se desplaza sobre la parietal. Este movimiento genera un patrón centelleante en la línea pleural visible en modo B y el signo de la playa en modo M.",
    clinicalExample: "Paciente con disnea aguda. Se evalúa la presencia de deslizamiento pleural para descartar neumotórax. Un deslizamiento presente descarta neumotórax en el punto explorado.",
    clinicalInterpretation: "Deslizamiento presente = las pleuras están en contacto, descarta neumotórax en ese punto. Ausencia de deslizamiento puede indicar neumotórax, pleurodesis, apnea, intubación selectiva.",
    associatedDiagnosis: ["Normal (presente)", "Neumotórax (ausente)", "Pleurodesis (ausente)", "Intubación selectiva (ausente)"],
    icon: "move-horizontal",
    color: "hsl(152, 60%, 40%)",
    imageUrl: lungSlidingImg,
    imageSource: "POCUS 101",
  },
  {
    id: "lung-pulse",
    name: "Pulso pulmonar",
    category: "sign",
    definition: "Movimiento sutil de la línea pleural sincronizado con el latido cardíaco, visible cuando no hay deslizamiento pleural pero las pleuras mantienen contacto.",
    pathophysiology: "La transmisión del impulso cardíaco a través del parénquima pulmonar genera un movimiento rítmico sutil de la pleura. Su presencia indica que las pleuras están en contacto, descartando neumotórax.",
    clinicalExample: "Paciente intubado sin deslizamiento pleural. Se observa un movimiento sutil rítmico de la línea pleural coincidente con el ECG. Esto descarta neumotórax.",
    clinicalInterpretation: "La presencia de pulso pulmonar descarta neumotórax aunque no haya deslizamiento. Indica contacto pleural mantenido. Se ve en atelectasia, apnea, parálisis diafragmática.",
    associatedDiagnosis: ["Atelectasia", "Apnea", "Intubación selectiva contralateral"],
    icon: "heart",
    color: "hsl(0, 72%, 51%)",
    imageUrl: lungPulseImg,
    imageSource: "Ilustración esquemática",
  },
  {
    id: "seashore-sign",
    name: "Signo de la playa (Seashore sign)",
    category: "sign",
    definition: "Patrón en modo M que muestra líneas horizontales paralelas (pared torácica) sobre un patrón granular tipo arena de playa (parénquima pulmonar en movimiento).",
    pathophysiology: "En modo M, la pared torácica inmóvil genera líneas horizontales. Por debajo de la línea pleural, el movimiento del pulmón aireado genera un patrón granular. Juntos simulan 'mar y arena'.",
    clinicalExample: "Al activar el modo M sobre un pulmón normal con deslizamiento, se observa el clásico patrón de playa: ondas (mar) arriba y arena (granular) abajo.",
    clinicalInterpretation: "Signo de la playa presente = deslizamiento pleural normal, descarta neumotórax. Es la confirmación en modo M del deslizamiento pleural visto en modo B.",
    associatedDiagnosis: ["Pulmón normal", "Descarta neumotórax"],
    icon: "sun",
    color: "hsl(40, 80%, 55%)",
    imageUrl: seashoreSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "curtain-sign",
    name: "Signo del telón (Curtain Sign)",
    category: "sign",
    definition: "Aparición dinámica del pulmón aireado (lleno de líneas A) que baja y cubre los órganos abdominales (hígado o bazo) durante la fase inspiratoria.",
    pathophysiology: "Durante la inspiración profunda, la expansión del lóbulo pulmonar inferior empuja el diafragma hacia abajo, interponiéndose entre la sonda y los órganos abdominales en las zonas basales.",
    clinicalExample: "Explorando la unión tóraco-abdominal derecha. Al inspirar, un artefacto de aire 'baja' tapando la visualización del hígado.",
    clinicalInterpretation: "Es indicativo de pulmón inferior libre, aireado y diafragma móvil. Su ausencia puede sugerir derrame pleural, consolidación basal masiva o parálisis diafragmática.",
    associatedDiagnosis: ["Transición tóraco-abdominal normal"],
    icon: "clapperboard",
    color: "hsl(140, 50%, 50%)",
    imageUrl: curtainSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "barcode-sign",
    name: "Signo del código de barras (Stratosphere sign)",
    category: "sign",
    definition: "Patrón en modo M que muestra únicamente líneas horizontales paralelas tanto por encima como por debajo de la línea pleural, sin patrón granular.",
    pathophysiology: "La ausencia de movimiento pulmonar (sin deslizamiento) genera un patrón uniforme de líneas horizontales en modo M. La pleura y el pulmón están inmóvil o separados por aire.",
    clinicalExample: "Paciente con trauma torácico. En modo M se observan líneas horizontales continuas (código de barras) sin patrón de playa, altamente sugestivo de neumotórax.",
    clinicalInterpretation: "Signo del código de barras = ausencia de deslizamiento pleural = alta sospecha de neumotórax. También puede verse en pleurodesis o pulmón inmóvil por otras causas.",
    associatedDiagnosis: ["Neumotórax", "Pleurodesis", "Apnea"],
    icon: "barcode",
    color: "hsl(0, 0%, 35%)",
    imageUrl: barcodeSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "lung-point",
    name: "Signo del punto pulmonar",
    category: "sign",
    definition: "Punto donde alterna el patrón de deslizamiento pleural (signo de la playa) con su ausencia (código de barras). Marca el límite del neumotórax.",
    pathophysiology: "En el neumotórax parcial, existe un punto de transición donde el pulmón colapsado se separa de la pared torácica. En este punto se observa alternancia entre deslizamiento y no deslizamiento.",
    clinicalExample: "Paciente con neumotórax parcial. Al desplazar la sonda lateralmente se encuentra un punto donde intermitentemente aparece y desaparece el deslizamiento pleural.",
    clinicalInterpretation: "Es patognomónico de neumotórax (especificidad 100%). Su localización indica el tamaño del neumotórax. Cuanto más lateral o posterior, mayor es el neumotórax.",
    associatedDiagnosis: ["Neumotórax (patognomónico)"],
    icon: "map-pin",
    color: "hsl(0, 84%, 60%)",
    imageUrl: lungPointImg,
    imageSource: "POCUS 101",
  },
  {
    id: "jellyfish-sign",
    name: "Signo de la medusa",
    category: "sign",
    definition: "Imagen ecográfica donde el pulmón atelectásico flota dentro del derrame pleural, con movimientos ondulantes que recuerdan a una medusa en el agua.",
    pathophysiology: "En derrames pleurales masivos, el pulmón completamente colapsado flota libremente en el líquido pleural. Los movimientos respiratorios y cardíacos generan ondulaciones del parénquima colapsado.",
    clinicalExample: "Paciente con derrame pleural masivo. Se observa el parénquima pulmonar colapsado flotando dentro del líquido, con movimientos ondulantes respiratorios.",
    clinicalInterpretation: "Indica derrame pleural masivo con atelectasia completa del lóbulo o pulmón. Sugiere necesidad de drenaje urgente y evaluación de la causa del derrame.",
    associatedDiagnosis: ["Derrame pleural masivo", "Atelectasia compresiva completa"],
    icon: "fish",
    color: "hsl(200, 80%, 55%)",
    imageUrl: jellyfishSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "quad-sign",
    name: "Signo del cuadrilátero",
    category: "sign",
    definition: "Imagen ecográfica rectangular delimitada superiormente por la línea pleural, lateralmente por las sombras costales e inferiormente por la línea del pulmón, con contenido anecoico (líquido).",
    pathophysiology: "El líquido pleural se acumula entre la pleura visceral y parietal. Las costillas generan sombras laterales y la pleura visceral forma el límite inferior, creando una imagen rectangular con líquido anecoico.",
    clinicalExample: "Paciente con derrame pleural moderado. Entre las costillas se visualiza una colección anecoica rectangular entre la pared torácica y el pulmón.",
    clinicalInterpretation: "Confirma la presencia de derrame pleural. El contenido anecoico sugiere trasudado. El contenido ecogénico o con septos sugiere exudado, hemotórax o empiema.",
    associatedDiagnosis: ["Derrame pleural", "Hemotórax", "Empiema"],
    icon: "square",
    color: "hsl(215, 60%, 50%)",
    imageUrl: quadSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "sinusoid-sign",
    name: "Signo del sinusoide",
    category: "sign",
    definition: "En modo M sobre un derrame pleural, la línea del pulmón (pleura visceral) se acerca y aleja de la pared torácica con la respiración, generando un patrón sinusoidal.",
    pathophysiology: "Durante la inspiración, el pulmón se expande y la pleura visceral se acerca a la pared torácica, reduciendo el espacio del derrame. En espiración se aleja. Esto crea una onda sinusoidal en modo M.",
    clinicalExample: "Paciente con derrame pleural libre. En modo M se observa movimiento ondulante de la línea pulmonar que se acerca y aleja rítmicamente de la pared torácica.",
    clinicalInterpretation: "Indica derrame pleural libre (no tabicado). Un derrame tabicado no mostrará este signo. Útil para diferenciar derrames libres de organizados antes de drenar.",
    associatedDiagnosis: ["Derrame pleural libre"],
    icon: "activity",
    color: "hsl(170, 60%, 45%)",
    imageUrl: sinusoidSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "spine-sign",
    name: "Signo de la columna (Spine Sign)",
    category: "sign",
    definition: "Visualización anormal de la columna vertebral torácica (cuerpos vertebrales acústicos) por encima de la línea del diafragma.",
    pathophysiology: "Normalmente, el pulmón aireado dispersa el ultrasonido, por lo que la columna por encima del diafragma no se ve. Si hay líquido pleural (o una gran consolidación) por encima del diafragma, el líquido actúa como una excelente ventana acústica que permite ver la columna vertebral supradiafragmática.",
    clinicalExample: "Exploración en cuadrante torácico posterolateral derecho. Se observa el hígado, el diafragma y por encima de éste, una colección oscura y la sombra de las vértebras extendiéndose hacia arriba.",
    clinicalInterpretation: "Hallazgo clásico e inequívoco para confirmar la presencia de derrame pleural significativo o hemotórax.",
    associatedDiagnosis: ["Derrame pleural", "Hemotórax", "Consolidación lobar basal extensa"],
    icon: "bone",
    color: "hsl(260, 40%, 60%)",
    imageUrl: spineSignImg,
    imageSource: "POCUS 101",
  },
  {
    id: "air-bronchogram",
    name: "Broncograma aéreo",
    category: "sign",
    definition: "Imágenes puntiformes o lineales hiperecogénicas dentro de una consolidación pulmonar, que representan bronquios con aire rodeados de parénquima hepatizado.",
    pathophysiology: "Cuando los alvéolos se llenan de líquido/pus/células, el parénquima pulmonar se 'hepatiza'. Los bronquios que mantienen aire dentro de esta consolidación generan reflexiones hiperecogénicas.",
    clinicalExample: "Paciente con neumonía lobar. Se observa una consolidación con textura similar al hígado (hepatización) con puntos brillantes en su interior que se mueven con la respiración (broncograma aéreo dinámico).",
    clinicalInterpretation: "Broncograma aéreo dinámico (se mueve con respiración) sugiere neumonía. Broncograma estático (inmóvil) sugiere atelectasia obstructiva. Es clave para diferenciar consolidación infecciosa de obstructiva.",
    associatedDiagnosis: ["Neumonía", "Atelectasia obstructiva", "SDRA"],
    icon: "lungs",
    color: "hsl(25, 80%, 50%)",
    imageUrl: airBronchogramImg,
    imageSource: "POCUS 101",
  },
  {
    id: "fluid-bronchogram",
    name: "Broncograma líquido",
    category: "sign",
    definition: "Estructuras tubulares anecoicas (oscuras) dentro de una consolidación pulmonar, que representan bronquios llenos de líquido o moco rodeados de parénquima consolidado.",
    pathophysiology: "Cuando tanto los alvéolos como los bronquios se llenan de líquido, los bronquios aparecen como estructuras tubulares anecoicas. Indica obstrucción bronquial completa con retención de secreciones.",
    clinicalExample: "Paciente con atelectasia obstructiva por tapón mucoso. Se observa consolidación con estructuras tubulares anecoicas ramificadas en su interior.",
    clinicalInterpretation: "El broncograma líquido sugiere fuertemente atelectasia obstructiva (por tumor, moco o cuerpo extraño). Es importante para el diagnóstico diferencial con neumonía y para indicar broncoscopia.",
    associatedDiagnosis: ["Atelectasia obstructiva", "Neumonía necrotizante", "Carcinoma bronquial"],
    icon: "droplet",
    color: "hsl(200, 70%, 45%)",
    imageUrl: consolidationImg,
    imageSource: "POCUS 101",
  },
  {
    id: "shred-sign",
    name: "Signo del desgarro (Shred Sign / Fractal Sign)",
    category: "sign",
    definition: "Borde irregular y fracturado ('desgarrado') en el límite profundo de una consolidación subpleural de forma no anatómica.",
    pathophysiology: "Ocurre cuando la consolidación pulmonar no afecta a todo el lóbulo. El ultrasonido penetra la consolidación tisular, pero se detiene bruscamente al chocar con el parénquima pulmonar adyacente aún aireado, dibujando un borde posterior irregular e hiperecogénico.",
    clinicalExample: "Exploración en la zona anterior durante una neumonía adquirida en la comunidad. Se observa un parche oscuro subpleural (hepatizado) que termina de forma abrupta en una línea rota y brillante.",
    clinicalInterpretation: "Altamente específico de consolidaciones no translobares, principalmente de origen infeccioso (neumonías pequeñas o parches) o infartos pulmonares por TEP.",
    associatedDiagnosis: ["Neumonía lobulillar/parcheada", "Infarto pulmonar subpleural", "Contusión pulmonar focal"],
    icon: "puzzle",
    color: "hsl(10, 80%, 50%)",
    imageUrl: shredSignImg,
    imageSource: "POCUS 101",
  },
];

export const libraryCategories = [
  { id: "all", label: "Todos", count: lusLibrary.length },
  { id: "artifact", label: "Artefactos", count: lusLibrary.filter(s => s.category === "artifact").length },
  { id: "sign", label: "Signos", count: lusLibrary.filter(s => s.category === "sign").length },
];

export interface BLUEProfile {
  id: string;
  name: string;
  findings: string[];
  diagnosis: string;
  description: string;
  color: string;
}

export const blueProtocol: BLUEProfile[] = [
  {
    id: "a-profile",
    name: "Perfil A",
    findings: ["Deslizamiento pleural presente", "Líneas A predominantes", "Sin líneas B significativas"],
    diagnosis: "Pulmón normal o asma/EPOC",
    description: "Si hay TVP (trombosis venosa profunda): sospechar TEP. Sin TVP y con disnea: considerar asma/EPOC.",
    color: "hsl(190, 70%, 42%)",
  },
  {
    id: "b-profile",
    name: "Perfil B",
    findings: ["Deslizamiento pleural presente", "Líneas B bilaterales difusas (≥3 por campo)", "Sin consolidación significativa"],
    diagnosis: "Edema pulmonar cardiogénico",
    description: "Patrón B bilateral simétrico con deslizamiento pleural. Típico de ICC descompensada.",
    color: "hsl(215, 80%, 28%)",
  },
  {
    id: "ab-profile",
    name: "Perfil A/B",
    findings: ["Líneas A en un hemitórax", "Líneas B en el otro hemitórax", "Patrón asimétrico"],
    diagnosis: "Neumonía",
    description: "Patrón asimétrico donde un lado muestra perfil A y el otro perfil B. Sugiere neumonía.",
    color: "hsl(25, 80%, 50%)",
  },
  {
    id: "b-prime-profile",
    name: "Perfil B'",
    findings: ["Líneas B anteriores", "Abolición del deslizamiento pleural", "Sin punto pulmonar"],
    diagnosis: "Neumonía",
    description: "Líneas B con pérdida de deslizamiento. A diferencia del perfil B (edema), aquí el deslizamiento está ausente.",
    color: "hsl(0, 72%, 51%)",
  },
  {
    id: "c-profile",
    name: "Perfil C",
    findings: ["Consolidación anterior visible", "Hepatización del parénquima", "Posible broncograma aéreo"],
    diagnosis: "Neumonía",
    description: "Consolidación visible directamente en la zona anterior del tórax. Indica neumonía extensa.",
    color: "hsl(40, 80%, 55%)",
  },
  {
    id: "a-prime-profile",
    name: "Perfil A'",
    findings: ["Líneas A predominantes", "Sin deslizamiento pleural", "Sin punto pulmonar"],
    diagnosis: "Neumotórax",
    description: "Perfil A (líneas A) pero SIN deslizamiento pleural. La presencia de punto pulmonar confirma neumotórax.",
    color: "hsl(0, 0%, 35%)",
  },
  {
    id: "plaps-profile",
    name: "Perfil PLAPS",
    findings: ["Consolidación basal", "Derrame pleural", "Visto en las zonas PLAPS"],
    diagnosis: "Derrame Pleural o Neumonía Basal",
    description: "Evaluación del punto PLAPS (Posterolateral Alveolar and/or Pleural Syndrome). Presencia de colecciones o tejido hepatizado en las bases dependientes.",
    color: "hsl(260, 50%, 45%)",
  },
];
