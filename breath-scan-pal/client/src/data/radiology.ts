const bs_consolidationRxImg = "/rx_images/consolidacion.png";
const bs_atelectasisRxImg = "/rx_images/atelectasia.png";
const bs_pleuralEffusionRxImg = "/rx_images/derrame_pleural.png";
const bs_pneumothoraxRxImg = "/rx_images/neumotorax.png";
const bs_pulmonaryEdemaRxImg = "/rx_images/edema_pulmonar.png";
const bs_cardiomegaliaRxImg = "/rx_images/cardiomegalia.png";
const bs_enfisemaRxImg = "/rx_images/enfisema.png";
const bs_neumoniaRxImg = "/rx_images/neumonia.png";
const bs_derramePericardicoRxImg = "/rx_images/derrame_pericardico.png";

export interface RXTechnique {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  indications: string[];
  limitations: string[];
  icon: string;
}

export interface RXPathology {
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
  id: string;
  name: string;
  anatomicalLandmarks: string;
  normalFindings: string[];
  abnormalFindings: string[];
  svgPath?: string;
}

export interface RXQualityCriteria {
  id: string;
  name: string;
  description: string;
  howToAssess: string;
  adequate: string;
  inadequate: string;
}

// Radiology images

export const rxTechniques: RXTechnique[] = [
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
    imageUrl: bs_consolidationRxImg,
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
    imageUrl: bs_atelectasisRxImg,
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
    imageUrl: bs_pleuralEffusionRxImg,
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
    imageUrl: bs_pneumothoraxRxImg,
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
    imageUrl: bs_pulmonaryEdemaRxImg,
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
    imageUrl: bs_cardiomegaliaRxImg,
  },
  {
    id: "emphysema",
    name: "Enfisema Pulmonar",
    definition:
      "Destrucción de las paredes alveolares que conduce a un agrandamiento permanente de los espacios aéreos distal al bronquiolo terminal.",
    rxFindings: [
      "Hiperclaridad pulmonar (más negro)",
      "Aplanamiento de los hemidiafragmas",
      "Aumento del espacio aéreo retroesternal",
      "Corazón 'en gota' (verticalizado)",
      "Aumento de los espacios intercostales",
    ],
    distribution: "Difuso, predominio en campos superiores",
    differentialDiagnosis: [
      "Alfa-1 antitripsina",
      "Tabaquismo crónico",
      "Bula gigante",
    ],
    clinicalCorrelation:
      "Disnea progresiva, tórax en tonel, espiración prolongada.",
    icon: "💨",
    imageUrl: bs_enfisemaRxImg,
  },
  {
    id: "pneumonia",
    name: "Neumonía",
    definition:
      "Infección que inflama los sacos aéreos de uno o ambos pulmones, los cuales pueden llenarse de líquido o pus.",
    rxFindings: [
      "Consolidación focal",
      "Broncograma aéreo",
      "Bordes mal definidos",
      "Signo de la silueta positivo",
    ],
    distribution: "Lobar o segmentaria",
    differentialDiagnosis: [
      "Atelectasia",
      "Infarto pulmonar",
      "Edema localizado",
    ],
    clinicalCorrelation:
      "Fiebre, escalofríos, tos con esputo, dolor pleurítico.",
    icon: "🦠",
    imageUrl: bs_neumoniaRxImg,
  },
  {
    id: "pericardial-effusion",
    name: "Derrame Pericárdico",
    definition: "Acumulación anómala de líquido en la cavidad pericárdica.",
    rxFindings: [
      "Aumento global de la silueta cardíaca",
      "Corazón en forma de 'cantimplora' o 'botellón'",
      "Campos pulmonares característicamente limpios (a menos que haya ICC asociada)",
    ],
    distribution: "Pericardio",
    differentialDiagnosis: [
      "Cardiomegalia por dilatación",
      "Derrame pleural masivo simulado",
    ],
    clinicalCorrelation:
      "Tonos cardíacos apagados, pulso paradójico, ingurgitación yugular.",
    icon: "💓",
    imageUrl: bs_derramePericardicoRxImg,
  },
];

export const thoracicZones: ThoracicZone[] = [
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
