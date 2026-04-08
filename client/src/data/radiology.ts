const consolidationRxImg =
  "https://upload.wikimedia.org/wikipedia/commons/5/51/X-ray_of_lobar_pneumonia.jpg"; // Example image for consolidation
const atelectasisRxImg = "/images/rx/atelectasia.png"; // Example image for atelectasis
const pleuralEffusionRxImg = "/images/rx/derrame.jpeg"; // Example image for pleural effusion
const pneumothoraxRxImg =
  "https://upload.wikimedia.org/wikipedia/commons/d/d2/X-ray_and_CT_of_ground_glass_opacities_and_pneumothorax_in_pneumocystis_pneumonia.jpg"; // Example image for pneumothorax
const pulmonaryEdemaRxImg = "/images/rx/edema.png"; // Example image for pulmonary edema
const cardiomegalyRxImg = "/images/rx/cardiomegalia.jpeg"; // Example image for cardiomegaly
const emphysemaRxImg = "/images/rx/enfisema.jpeg"; // Example image for emphysema
const hydropneumothoraxRxImg =
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Hydropneumothorax.jpg"; // Example image for hydropneumothorax
const pneumoniaRxImg = "/rx_images/neumonia.png"; // Example image for pneumonia
const derramePericardicoRxImg = "/rx_images/derrame_pericardico.png"; // Example image for pericardial effusion

export interface RXTechnique {
  // Kept from second radiology.ts
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  indications: string[];
  limitations: string[];
  icon: string;
}

export interface RXPathology {
  // Kept from second radiology.ts
  id: string;
  name: string;
  definition: string;
  rxFindings: string[];
  distribution: string;
  differentialDiagnosis: string[];
  clinicalCorrelation: string;
  lusCorrelation?: string;
  icon: string;
  imageUrl?: string;
}

export interface ThoracicZone {
  // Kept from second radiology.ts
  id: string;
  name: string;
  anatomicalLandmarks: string;
  normalFindings: string[];
  abnormalFindings: string[];
  svgPath?: string;
}

export interface RXQualityCriteria {
  // Kept from second radiology.ts
  id: string;
  name: string;
  description: string;
  howToAssess: string;
  adequate: string;
  inadequate: string;
}

export const rxABCDE = [
  // Kept from second radiology.ts
  {
    id: "A",
    title: "A - Airway (Vía Aérea)",
    items: [
      "Tráquea centrada: buscar desviaciones por masa o neumotórax",
      "Carina y bronquios principales: evaluar ángulo (normal 60-100°)",
      "Hilios pulmonares: buscar aumento de tamaño o densidad (adenopatías)",
    ],
    checks: ["¿Tubo ET a 2-4cm de carina?", "¿Sonda gástrica en posición?"],
  },
  {
    id: "B",
    title: "B - Breathing (Pulmones y Pleura)",
    items: [
      "Campos pulmonares: simetría, hiperclaridad u opacidades",
      "Trama vascular: debe llegar hasta 1cm de la pared",
      "Líneas pleurales: descartar neumotórax (línea blanca fina)",
      "Cisuras pulmonares: evaluar engrosamiento o líquido",
    ],
    checks: ["¿Hay neumotórax?", "¿Derrame pleural?", "¿Consolidación?"],
  },
  {
    id: "C",
    title: "C - Cardiac & Circulation",
    items: [
      "Índice Cardiotorácico: normal < 0.5 en PA (<0.55-0.6 en AP)",
      "Configuración del corazón: botón aórtico, cintura cardíaca",
      "Vasos pulmonares: ¿cefalización del flujo (ICC)?",
    ],
    checks: ["¿Cardiomegalia?", "¿Pedículo vascular ensanchado?"],
  },
  {
    id: "D",
    title: "D - Diaphragm (Diafragma)",
    items: [
      "Posición: hemidiafragma derecho 1.5-2cm más alto que el izquierdo",
      "Ángulos costofrénicos y cardiofrénicos: deben estar libres (agudos)",
      "Bajo el diafragma: ¿aire libre (neumoperitoneo)?",
    ],
    checks: ["¿Diafragmas aplanados?", "¿Gas bajo diafragma?"],
  },
  {
    id: "E",
    title: "E - Everything Else (Extra/Huesos)",
    items: [
      "Huesos: costillas, clavículas, escápulas y columna (fracturas/metástasis)",
      "Partes blandas: enfisema subcutáneo, sombras mamarias",
      "Dispositivos médicos: catéteres, cables, marcapasos",
    ],
    checks: ["¿Fracturas costales?", "¿Enfisema subcutáneo?"],
  },
];

export const rxTechniques: RXTechnique[] = [
  // Renamed from bs_rxTechniques
  {
    id: "pa",
    name: "Proyección PA (Posteroanterior)",
    description:
      "El haz de rayos X entra por la espalda y sale por el tórax anterior hacia la placa. Es la proyección estándar y preferida para evaluación torácica.",
    characteristics: [
      "Paciente de pie, tórax contra la placa",
      "Distancia foco-placa: 1.8 metros",
      "Inspiración profunda",
      "Brazos en rotación interna, manos en caderas",
      "Silueta cardíaca de tamaño real",
      "Escápulas fuera de los campos pulmonares",
    ],
    indications: [
      "Evaluación estándar de tórax",
      "Paciente ambulatorio",
      "Control evolutivo",
    ],
    limitations: [
      "Requiere paciente en bipedestación",
      "No disponible en pacientes críticos encamados",
    ],
    icon: "📐",
  },
  {
    id: "ap",
    name: "Proyección AP (Anteroposterior)",
    description:
      "El haz de rayos X entra por el tórax anterior. Técnica utilizada en pacientes encamados que no pueden ponerse de pie.",
    characteristics: [
      "Paciente en decúbito supino o semisentado",
      "Placa detrás del paciente",
      "Distancia foco-placa: variable (generalmente menor)",
      "Magnificación de estructuras anteriores",
      "Silueta cardíaca aparece agrandada",
      "Escápulas pueden superponerse a campos pulmonares",
    ],
    indications: [
      "Paciente en UCI",
      "Paciente encamado",
      "Urgencias",
      "Postoperatorio inmediato",
    ],
    limitations: [
      "Magnificación cardíaca (falsa cardiomegalia)",
      "Peor resolución",
      "Campos pulmonares parcialmente ocultos por escápulas",
    ],
    icon: "🛏️",
  },
  {
    id: "lateral",
    name: "Proyección Lateral",
    description:
      "El paciente se coloca de perfil con el lado izquierdo contra la placa. Complementa la PA para localización tridimensional de lesiones.",
    characteristics: [
      "Paciente de pie, lado izquierdo contra la placa",
      "Brazos elevados sobre la cabeza",
      "Permite evaluar espacio retroesternal y retrocardiaco",
      "Visualiza cisuras pulmonares",
      "Identifica lesiones posteriores",
    ],
    indications: [
      "Complemento de PA",
      "Localización de lesiones",
      "Evaluación del mediastino posterior",
      "Sospecha de derrame pleural pequeño",
    ],
    limitations: [
      "Superposición de estructuras",
      "Requiere correlación con PA",
    ],
    icon: "📏",
  },
];

export const rxPathologies: RXPathology[] = [
  // Renamed from bs_rxPathologies
  {
    id: "consolidation",
    name: "Consolidación Pulmonar",
    definition:
      "Ocupación del espacio aéreo alveolar por material inflamatorio, edema, sangre o células. El parénquima se opacifica al perder su contenido de aire.",
    rxFindings: [
      "Opacidad homogénea con bordes mal definidos",
      "Broncograma aéreo (bronquios permeables dentro de la opacidad)",
      "Signo de la silueta (borramiento del borde cardíaco o diafragmático)",
      "Distribución lobar o segmentaria",
      "No retrae estructuras (a diferencia de la atelectasia)",
    ],
    distribution: "Lobar, segmentaria o multifocal según etiología",
    differentialDiagnosis: [
      "Neumonía bacteriana",
      "Neumonía aspirativa",
      "Hemorragia alveolar",
      "Carcinoma bronquioloalveolar",
    ],
    clinicalCorrelation:
      "Fiebre, tos productiva, leucocitosis, crepitantes focales en auscultación.",
    lusCorrelation:
      "Ecografía: patrón de hepatización con broncograma aéreo dinámico. Ausencia de deslizamiento pleural focal.",
    icon: "🫁",
    imageUrl: consolidationRxImg,
  },
  {
    id: "atelectasis",
    name: "Atelectasia",
    definition:
      "Colapso parcial o total de un segmento, lóbulo o pulmón completo por pérdida de volumen. El parénquima colapsado se opacifica.",
    rxFindings: [
      "Opacidad con pérdida de volumen",
      "Desplazamiento de cisuras hacia la atelectasia",
      "Elevación del hemidiafragma ipsilateral",
      "Desviación mediastínica hacia el lado afectado",
      "Hiperinsuflación compensatoria contralateral",
      "Pinzamiento de espacios intercostales",
    ],
    distribution:
      "Lobar, segmentaria o subsegmentaria (atelectasias laminares)",
    differentialDiagnosis: [
      "Obstrucción bronquial (tumor, tapón mucoso)",
      "Compresión extrínseca",
      "Atelectasia por absorción post-intubación",
    ],
    clinicalCorrelation:
      "Disminución del murmullo vesicular, matidez a la percusión, signos de tracción ipsilateral.",
    lusCorrelation:
      "Ecografía: patrón de hepatización similar a consolidación, pero con signo del pulmón en mapa y ausencia de broncograma aéreo dinámico.",
    icon: "📉",
    imageUrl: atelectasisRxImg,
  },
  {
    id: "pleural-effusion",
    name: "Derrame Pleural",
    definition:
      "Acumulación de líquido en el espacio pleural. Puede ser trasudado (ICC, cirrosis) o exudado (infección, neoplasia, inflamación).",
    rxFindings: [
      "Opacidad homogénea en bases con menisco cóncavo (signo del menisco)",
      "Borramiento del ángulo costofrénico (>200 mL en PA de pie)",
      "En decúbito: opacidad difusa del hemitórax (velamiento)",
      "Derrame masivo: opacificación completa con desviación mediastínica contralateral",
      "Derrame subpulmonar: aparente elevación del hemidiafragma",
    ],
    distribution:
      "Dependiente de la gravedad: posterior y basal en bipedestación",
    differentialDiagnosis: [
      "ICC",
      "Neumonía paraneumónica/empiema",
      "Neoplasia",
      "TEP",
      "Cirrosis",
    ],
    clinicalCorrelation:
      "Matidez a la percusión, abolición del murmullo vesicular, egofonía en límite superior.",
    lusCorrelation:
      "Ecografía: signo del cuadrilátero, signo del sinusoide, espacio anecoico entre pleura parietal y visceral. Superior a RX para derrames pequeños.",
    icon: "💧",
    imageUrl: pleuralEffusionRxImg,
  },
  {
    id: "pneumothorax",
    name: "Neumotórax",
    definition:
      "Presencia de aire en el espacio pleural que causa colapso parcial o total del pulmón. Puede ser espontáneo, traumático o iatrogénico.",
    rxFindings: [
      "Línea pleural visceral visible separada de la pared torácica",
      "Ausencia de trama vascular periférica más allá de la línea",
      "Hiperclaridad del espacio pleural (negro)",
      "Neumotórax a tensión: desviación mediastínica contralateral, aplanamiento diafragmático",
      "En decúbito (AP): signo del surco profundo",
    ],
    distribution: "Generalmente apical en bipedestación, anterior en decúbito",
    differentialDiagnosis: [
      "Bulla enfisematosa gigante",
      "Artefacto por pliegue cutáneo",
      "Neumomediastino",
    ],
    clinicalCorrelation:
      "Dolor torácico agudo, disnea, disminución del murmullo vesicular, timpanismo.",
    lusCorrelation:
      "Ecografía: ausencia de deslizamiento pleural, ausencia de líneas B, signo del código de barras en modo M, punto pulmonar (patognomónico). Superior a RX en decúbito.",
    icon: "🌬️",
    imageUrl: pneumothoraxRxImg,
  },
  {
    id: "pulmonary-edema",
    name: "Edema Pulmonar",
    definition:
      "Acumulación de líquido en el intersticio y/o los alvéolos pulmonares. Puede ser cardiogénico (aumento de presión hidrostática) o no cardiogénico (aumento de permeabilidad).",
    rxFindings: [
      "Redistribución vascular cefálica (cefalización del flujo)",
      "Engrosamiento de septos interlobulillares (líneas de Kerley B)",
      "Opacidades bilaterales en alas de mariposa (edema alveolar)",
      "Broncograma aéreo bilateral",
      "Derrame pleural bilateral (más frecuente derecho)",
      "Cardiomegalia (en edema cardiogénico)",
    ],
    distribution:
      "Bilateral, simétrico, predominio perihiliar y basal en cardiogénico. Difuso y parcheado en no cardiogénico (SDRA).",
    differentialDiagnosis: [
      "ICC descompensada",
      "SDRA",
      "Sobrecarga de volumen",
      "Hemorragia alveolar difusa",
    ],
    clinicalCorrelation:
      "Disnea, ortopnea, crepitantes bilaterales, taquicardia, ingurgitación yugular.",
    lusCorrelation:
      "Ecografía: líneas B bilaterales confluentes, patrón B simétrico, posible derrame pleural bilateral. LUS más sensible que RX para edema intersticial temprano.",
    icon: "🌊",
    imageUrl: pulmonaryEdemaRxImg,
  },
  {
    id: "cardiomegaly",
    name: "Cardiomegalia",
    definition:
      "Aumento del tamaño de la silueta cardíaca. El índice cardiotorácico (ICT) es la relación entre el diámetro transverso máximo del corazón y el diámetro transverso máximo del tórax.",
    rxFindings: [
      "Índice cardiotorácico > 0.5 en PA",
      "Aumento de cavidades específicas según morfología",
      "AI: doble contorno derecho, elevación del bronquio principal izquierdo",
      "VI: elongación y desplazamiento del ápex hacia abajo e izquierda",
      "VD: ocupación del espacio retroesternal (lateral)",
    ],
    distribution: "Central, silueta cardíaca",
    differentialDiagnosis: [
      "ICC",
      "Miocardiopatía dilatada",
      "Derrame pericárdico",
      "Valvulopatía",
      "Artefacto por técnica AP",
    ],
    clinicalCorrelation:
      "Disnea de esfuerzo, edema de miembros inferiores, ingurgitación yugular, tercer ruido.",
    icon: "❤️",
    imageUrl: cardiomegalyRxImg,
  },
  {
    id: "emphysema",
    name: "Enfisema Pulmonar",
    definition:
      "Destrucción permanente de las paredes alveolares con aumento patológico del espacio aéreo distal al bronquiolo terminal. Se traduce en hiperinsuflación y pobreza vascular en la radiografía.",
    rxFindings: [
      "Hiperinsuflación pulmonar: aumento del volumen pulmonar",
      "Diafragmas aplanados (por debajo del 7º-8º arco costal anterior)",
      "Espacios intercostales ensanchados y horizontalizados",
      "Pobreza vascular periférica (vasos delgados y escasos)",
      "Aumento del espacio retroesternal en lateral (> 3 cm)",
      "Corazón en forma de gota (verticalizado)",
      "Posibles bullas (\u00e1reas de hiperclaridad sin pared visible)",
    ],
    distribution:
      "Predominio en lóbulos superiores (centrolobulillar/tabaquismo) o difuso (panacinar/déficit alfa-1 AT)",
    differentialDiagnosis: [
      "Asma con hiperinsuflación",
      "Obstrucción bronquial difusa",
      "Bullas enfisematosas aisladas",
    ],
    clinicalCorrelation:
      "Disnea progresiva, taquipnea, tórax en tonel, murmullo vesicular disminuido, hiperresonancia. Tabaquismo como principal factor de riesgo.",
    lusCorrelation:
      "Ecografía: líneas A prominentes bilaterales con deslizamiento pleural reducido. Menor número de líneas B.",
    icon: "💨",
    imageUrl: emphysemaRxImg,
  },
  {
    id: "hydropneumothorax",
    name: "Hidroneumotórax",
    definition:
      "Coexistencia de aire y líquido en el espacio pleural. Produce una imagen característica de nivel hidro-aéreo horizontal.",
    rxFindings: [
      "Nivel hidro-aéreo horizontal en la cavidad pleural",
      "Cámara aérea superior sin trama vascular",
      "Opacidad líquida inferior homogénea",
      "Límite netamente horizontal (a diferencia del menisco del derrame puro)",
      "Posible desviación mediastínica si a tensión",
    ],
    distribution: "Unilateral, con nivel horizontal característico",
    differentialDiagnosis: [
      "Neumotórax + derrame pleural",
      "Fuga broncopleural",
      "Empiema con fístula aérea",
      "Post-procedimiento (drenaje, cirugía)",
    ],
    clinicalCorrelation:
      "Combinación de síntomas de neumotórax y derrame: dolor pleurítico, disnea, timpanismo apical con matidez basal.",
    lusCorrelation:
      "Ecografía: punto pulmonar + espacio ane-coico basal. Código de barras en modo M superiormente, cuadrilátero inferiormente.",
    icon: "🌊",
    imageUrl: hydropneumothoraxRxImg,
  },
  {
    id: "pneumonia",
    name: "Neumonía",
    definition:
      "Infección que inflama los sacos aéreos de uno o ambos pulmones, los cuales pueden llenarse de líquido o pus.",
    rxFindings: [
      "Consolidación lobar o segmentaria",
      "Broncograma aéreo",
      "Opacidades algodonosas o reticulonodulares",
      "Derrame pleural asociado (paraneumónico)",
      "Pérdida de volumen si hay atelectasia asociada",
    ],
    distribution: "Variable, puede ser focal, lobar, segmentaria o difusa",
    differentialDiagnosis: [
      "Edema pulmonar",
      "Hemorragia alveolar",
      "Neoplasia",
      "Atelectasia",
    ],
    clinicalCorrelation:
      "Fiebre, tos con expectoración, disnea, leucocitosis, crepitantes.",
    icon: "🦠",
    imageUrl: pneumoniaRxImg,
  },
  {
    id: "pericardial-effusion",
    name: "Derrame Pericárdico",
    definition: "Acumulación anómala de líquido en la cavidad pericárdica.",
    rxFindings: [
      "Cardiomegalia con forma de 'cantimplora' o 'botella de agua'",
      "Aumento de la silueta cardíaca sin signos de congestión pulmonar",
      "Borramiento de los contornos cardíacos normales",
    ],
    distribution: "Alrededor del corazón",
    differentialDiagnosis: [
      "Cardiomegalia por dilatación",
      "Miocardiopatía",
      "Tumor cardíaco",
    ],
    clinicalCorrelation:
      "Disnea, dolor torácico, hipotensión (si taponamiento), ruidos cardíacos apagados.",
    icon: "💓",
    imageUrl: derramePericardicoRxImg,
  },
];

export const thoracicZones: ThoracicZone[] = [
  // Renamed from bs_thoracicZones
  {
    id: "right-apex",
    name: "Ápice Derecho",
    anatomicalLandmarks:
      "Desde la clavícula hasta el 2° arco costal anterior derecho",
    normalFindings: [
      "Trama vascular fina",
      "Transparencia pulmonar normal",
      "Sin opacidades",
    ],
    abnormalFindings: [
      "Opacidad apical (Pancoast)",
      "Engrosamiento pleural apical",
      "Cavitación (TBC)",
      "Neumotórax apical",
    ],
  },
  {
    id: "left-apex",
    name: "Ápice Izquierdo",
    anatomicalLandmarks:
      "Desde la clavícula hasta el 2° arco costal anterior izquierdo",
    normalFindings: ["Trama vascular fina", "Transparencia pulmonar normal"],
    abnormalFindings: [
      "Opacidad apical",
      "Lesión cavitada",
      "Fibrosis apical",
      "Neumotórax",
    ],
  },
  {
    id: "right-mid",
    name: "Campo Medio Derecho",
    anatomicalLandmarks:
      "Desde el 2° al 4° arco costal anterior derecho. Incluye hilio derecho.",
    normalFindings: [
      "Hilio derecho visible (arteria pulmonar + bronquios)",
      "Trama vascular normal",
    ],
    abnormalFindings: [
      "Adenopatía hiliar",
      "Masa hiliar",
      "Infiltrado parahiliar",
      "Consolidación del lóbulo medio",
    ],
  },
  {
    id: "left-mid",
    name: "Campo Medio Izquierdo",
    anatomicalLandmarks:
      "Desde el 2° al 4° arco costal anterior izquierdo. Incluye hilio izquierdo.",
    normalFindings: [
      "Hilio izquierdo (más alto que el derecho)",
      "Silueta cardíaca normal",
    ],
    abnormalFindings: [
      "Adenopatía hiliar",
      "Masa perihiliar",
      "Lingular: borramiento del borde cardíaco izquierdo",
    ],
  },
  {
    id: "right-base",
    name: "Base Derecha",
    anatomicalLandmarks:
      "Desde el 4° arco costal anterior hasta el diafragma derecho. Incluye ángulo costofrénico derecho.",
    normalFindings: [
      "Ángulo costofrénico agudo y libre",
      "Diafragma derecho ligeramente más alto que el izquierdo",
      "Trama basal normal",
    ],
    abnormalFindings: [
      "Borramiento costofrénico (derrame >200 mL)",
      "Consolidación basal",
      "Atelectasia basal",
      "Elevación diafragmática",
    ],
  },
  {
    id: "left-base",
    name: "Base Izquierda",
    anatomicalLandmarks:
      "Desde el 4° arco costal anterior hasta el diafragma izquierdo. Incluye ángulo costofrénico izquierdo.",
    normalFindings: [
      "Ángulo costofrénico agudo",
      "Burbuja gástrica bajo diafragma izquierdo",
    ],
    abnormalFindings: [
      "Derrame pleural",
      "Consolidación basal",
      "Atelectasia",
      "Hernia diafragmática",
    ],
  },
  {
    id: "right-hilum",
    name: "Hilio Derecho",
    anatomicalLandmarks:
      "Zona central derecha a nivel del 2°-3° arco costal anterior",
    normalFindings: [
      "Arteria pulmonar derecha",
      "Bronquio principal derecho",
      "Ganglios no visibles normalmente",
    ],
    abnormalFindings: [
      "Adenopatía hiliar",
      "Masa hiliar",
      "Ensanchamiento hiliar",
      "Calcificaciones",
    ],
  },
  {
    id: "left-hilum",
    name: "Hilio Izquierdo",
    anatomicalLandmarks:
      "Zona central izquierda, ligeramente más alto que el derecho",
    normalFindings: [
      "Arteria pulmonar izquierda",
      "Bronquio principal izquierdo",
    ],
    abnormalFindings: [
      "Adenopatía",
      "Masa",
      "Desplazamiento (atelectasia, derrame)",
    ],
  },
  {
    id: "mediastinum",
    name: "Mediastino",
    anatomicalLandmarks:
      "Espacio central entre ambos pulmones, desde el opérculo torácico hasta el diafragma",
    normalFindings: [
      "Tráquea centrada",
      "Botón aórtico visible",
      "Silueta cardíaca normal",
      "Líneas mediastínicas normales",
    ],
    abnormalFindings: [
      "Ensanchamiento mediastínico",
      "Desviación traqueal",
      "Neumomediastino",
      "Masa mediastínica",
      "Adenopatías",
    ],
  },
];

export const rxQualityCriteria: RXQualityCriteria[] = [
  // Renamed from bs_rxQualityCriteria
  {
    id: "rotation",
    name: "Rotación",
    description:
      "Evaluación de la simetría del tórax respecto a la columna vertebral.",
    howToAssess:
      "Las apófisis espinosas deben estar equidistantes de los extremos mediales de ambas clavículas.",
    adequate:
      "Apófisis espinosas centradas entre clavículas. Distancias simétricas.",
    inadequate:
      "Asimetría clavicular. Puede simular ensanchamiento mediastínico o falsa cardiomegalia.",
  },
  {
    id: "inspiration",
    name: "Inspiración",
    description:
      "Evaluación del grado de inspiración durante la toma de la radiografía.",
    howToAssess:
      "Contar los arcos costales anteriores visibles sobre el diafragma derecho.",
    adequate:
      "6 arcos costales anteriores o 10 arcos posteriores sobre el diafragma. Diafragma a nivel del 6° arco costal anterior.",
    inadequate:
      "Menos de 6 arcos costales anteriores. Puede causar falsa cardiomegalia y falsas opacidades basales.",
  },
  {
    id: "exposure",
    name: "Exposición / Penetración",
    description: "Evaluación de la correcta penetración de los rayos X.",
    howToAssess:
      "Los cuerpos vertebrales deben ser visibles detrás de la silueta cardíaca, pero los espacios intervertebrales no deben ser completamente transparentes.",
    adequate:
      "Cuerpos vertebrales visibles tras silueta cardíaca. Vasos pulmonares visibles hasta la periferia.",
    inadequate:
      "Sobreexpuesta: excesiva transparencia. Subexpuesta: opacificación general, cuerpos vertebrales no visibles.",
  },
  {
    id: "soft-tissues",
    name: "Partes Blandas y Artefactos",
    description:
      "Evaluación de artefactos y tejidos blandos que pueden confundir la interpretación.",
    howToAssess:
      "Identificar elementos superpuestos: trenzas, botones, cables, electrodos, sondas, catéteres.",
    adequate:
      "Sin artefactos que interfieran con la evaluación. Partes blandas simétricas.",
    inadequate:
      "Artefactos que simulan patología. Mastectomía que causa asimetría de campos. Enfisema subcutáneo.",
  },
];
