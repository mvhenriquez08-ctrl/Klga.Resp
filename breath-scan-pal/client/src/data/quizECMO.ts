export interface QuizQuestion {
  id: string;
  question: string;
  image?: string; // This field is not used in the current quiz data, but kept for consistency with UnifiedQuizQuestion
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export const ecmoQuiz: QuizQuestion[] = [
  {
    id: "ecmo-1",
    question:
      "Paciente de 35 años con neumonía viral bilateral, PaO₂/FiO₂ de 45 mmHg por 4 horas a pesar de prono y VM protectora. ¿Qué tipo de ECMO está indicado?",
    options: ["ECMO VA", "ECMO VV", "ECMO VAV", "Ninguno, continuar VM"],
    correctIndex: 1,
    explanation:
      "ECMO VV es la indicación en fallo respiratorio puro con función cardíaca preservada. Según criterios EOLIA: PaO₂/FiO₂ < 50 por ≥3 horas cumple indicación.",
    category: "Indicaciones",
  },
  {
    id: "ecmo-2",
    question:
      "¿Cuál es el fenómeno de Síndrome de Arlequín (Norte-Sur) en ECMO VA femoral?",
    options: [
      "Hipoxia en miembros inferiores con normoxia superior",
      "Hipoxia diferencial: hemicuerpo superior cianótico, inferior oxigenado",
      "Embolismo aéreo en el circuito",
      "Trombosis de la cánula arterial",
    ],
    correctIndex: 1,
    explanation:
      "En ECMO VA femoral, el flujo retrógrado de la ECMO compite con el flujo anterógrado del corazón. Si el VI eyecta sangre poco oxigenada, la mitad superior (cerebro, coronarias) recibe sangre desaturada mientras que la inferior recibe sangre oxigenada del ECMO.",
    category: "Complicaciones",
  },
  {
    id: "ecmo-3",
    question:
      "Paciente en ECMO VA con presión de pulso arterial < 5 mmHg. ¿Qué indica este hallazgo?",
    options: [
      "Buena recuperación miocárdica",
      "El VI no está eyectando (estasis intracardíaco)",
      "Recirculación excesiva",
      "Flujo de ECMO insuficiente",
    ],
    correctIndex: 1,
    explanation:
      "La presión de pulso en ECMO VA refleja la contractilidad del VI. Una presión diferencial < 10 mmHg indica que el VI no eyecta, generando estasis intracardíaco con riesgo de trombosis. Requiere descompresión del VI.",
    category: "Monitorización",
  },
  {
    id: "ecmo-4",
    question:
      "¿Cuál es la principal diferencia entre el oxigenador de membrana ECMO y un oxigenador de CEC convencional?",
    options: [
      "El de ECMO usa membrana de silicona permeable al plasma",
      "El de ECMO usa membrana PMP impermeable al plasma para uso prolongado",
      "No hay diferencia significativa",
      "El de ECMO no permite control de CO₂",
    ],
    correctIndex: 1,
    explanation:
      "Los oxigenadores ECMO usan membrana de polimetilpenteno (PMP) que es impermeable al plasma, permitiendo uso durante días sin fugas. Los de CEC convencional usan membranas permeables al plasma diseñadas para horas.",
    category: "Componentes",
  },
  {
    id: "ecmo-5",
    question: "¿Cómo se controla la eliminación de CO₂ en ECMO?",
    options: [
      "Aumentando el flujo de la bomba centrífuga",
      "Variando el flujo de gas (sweep) del oxigenador",
      "Aumentando la FiO₂ del mezclador",
      "Cambiando el tamaño de las cánulas",
    ],
    correctIndex: 1,
    explanation:
      "Control independiente: O₂ se controla con FiO₂ del mezclador; CO₂ se controla con el flujo de gas (sweep gas). Mayor flujo de gas = mayor eliminación de CO₂.",
    category: "Manejo",
  },
  {
    id: "ecmo-6",
    question:
      "En el SAVE Score para ECMO VA, ¿cuál factor tiene la mayor penalización?",
    options: [
      "Falla hepática (-3 puntos)",
      "Paro cardíaco preECMO (-2 puntos)",
      "ERC con TFG < 60 por > 3 meses (-6 puntos)",
      "HCO₃ < 15 mmol/L (-3 puntos)",
    ],
    correctIndex: 2,
    explanation:
      "La Enfermedad Renal Crónica (ERC) con TFG < 60 por más de 3 meses penaliza con -6 puntos, siendo el factor más desfavorable del SAVE Score.",
    category: "Pronóstico",
  },
  {
    id: "ecmo-7",
    question: "¿Qué parámetro de anticoagulación se monitoriza durante ECMO?",
    options: [
      "INR cada 12 horas",
      "TCA (Tiempo de Coagulación Activado) 150-180 segundos",
      "TTPa cada 24 horas",
      "Fibrinógeno diario únicamente",
    ],
    correctIndex: 1,
    explanation:
      "Se monitoriza TCA (Tiempo de Coagulación Activado) con objetivo de 150-180 segundos durante asistencia ECMO, usando heparina no fraccionada como anticoagulante de elección.",
    category: "Manejo",
  },
  {
    id: "ecmo-8",
    question:
      "Paciente con shock cardiogénico por miocarditis aguda, 28 años, sin comorbilidades. ¿Cuál es su clase SAVE Score aproximada?",
    options: [
      "Clase V (supervivencia ~18%)",
      "Clase I (supervivencia ~75%)",
      "Clase III (supervivencia ~42%)",
      "Clase IV (supervivencia ~30%)",
    ],
    correctIndex: 1,
    explanation:
      "Miocarditis (+3), edad 18-38 (+7), sin comorbilidades = score alto. Clase I (>5 puntos) con supervivencia ~75%. La miocarditis tiene el mejor pronóstico en ECMO VA.",
    category: "Pronóstico",
  },
  {
    id: "ecmo-9",
    question: "¿Cuál es la contraindicación ABSOLUTA para ECMO?",
    options: [
      "Ventilación mecánica por 5 días",
      "Edad de 70 años",
      "Falla orgánica múltiple establecida con pronóstico fatal a corto plazo",
      "Sangrado activo controlable",
    ],
    correctIndex: 2,
    explanation:
      "La falla orgánica múltiple establecida con mal pronóstico a corto plazo es contraindicación absoluta. VM prolongada y edad avanzada son contraindicaciones relativas.",
    category: "Indicaciones",
  },
  {
    id: "ecmo-10",
    question: "En ECMO VV, ¿qué es la recirculación y cómo se minimiza?",
    options: [
      "Trombosis del circuito — se minimiza con anticoagulación",
      "Sangre oxigenada re-drenada antes de pasar por pulmón — optimizar posición de cánulas",
      "Hemólisis por la bomba — reducir RPM",
      "Fuga de plasma por el oxigenador — cambiar membrana",
    ],
    correctIndex: 1,
    explanation:
      "La recirculación es la fracción de sangre ya oxigenada que es re-drenada por la cánula de drenaje sin pasar por la circulación pulmonar. Se minimiza optimizando la distancia entre cánulas (configuración fémoro-atrial).",
    category: "Complicaciones",
  },
];

export const ctQuiz: QuizQuestion[] = [
  {
    id: "ct-1",
    question:
      "¿Qué patrón tomográfico se caracteriza por opacidades en vidrio esmerilado con engrosamiento septal superpuesto?",
    options: [
      "Consolidación",
      "Crazy paving",
      "Panal de abeja",
      "Nódulo pulmonar",
    ],
    correctIndex: 1,
    explanation:
      "El patrón de 'crazy paving' (empedrado loco) combina vidrio esmerilado con engrosamiento de septos interlobulillares. Se ve en proteinosis alveolar, neumonía por COVID-19 y hemorragia alveolar.",
    category: "Patrones",
  },
  {
    id: "ct-2",
    question: "¿Cuál es el hallazgo tomográfico más específico de TEP agudo?",
    options: [
      "Derrame pleural bilateral",
      "Defecto de llenado intraluminal en arteria pulmonar",
      "Vidrio esmerilado difuso",
      "Consolidación basal",
    ],
    correctIndex: 1,
    explanation:
      "El defecto de llenado intraluminal en las arterias pulmonares en la angioTC es el hallazgo diagnóstico del TEP agudo. Aparece como una zona hipodensa dentro del vaso contrastado.",
    category: "Vascular",
  },
  {
    id: "ct-3",
    question:
      "¿Qué signo tomográfico indica fibrosis pulmonar en estadio avanzado?",
    options: [
      "Vidrio esmerilado",
      "Crazy paving",
      "Honeycombing (panal de abeja)",
      "Nódulo solitario",
    ],
    correctIndex: 2,
    explanation:
      "El honeycombing (panal de abeja) son espacios quísticos agrupados con paredes gruesas, típico de fibrosis pulmonar en fase terminal. Es un criterio de UIP (neumonía intersticial usual).",
    category: "Intersticial",
  },
  {
    id: "ct-4",
    question:
      "¿Qué patrón de enfisema se asocia más frecuentemente al tabaquismo?",
    options: [
      "Panlobulillar",
      "Centroacinar (centrilobulillar)",
      "Paraseptal",
      "Irregular",
    ],
    correctIndex: 1,
    explanation:
      "El enfisema centroacinar (centrilobulillar) es el más asociado a tabaquismo. Afecta predominantemente los lóbulos superiores y destruye el centro del acino pulmonar.",
    category: "Vía aérea",
  },
  {
    id: "ct-5",
    question:
      "Paciente con tos crónica productiva. La TC muestra dilatación bronquial con signo del anillo de sello. ¿Diagnóstico?",
    options: ["Enfisema", "Bronquiectasias", "Fibrosis quística", "EPOC"],
    correctIndex: 1,
    explanation:
      "El signo del anillo de sello (bronquio dilatado adyacente a su arteria pulmonar acompañante) es patognomónico de bronquiectasias. La bronquiectasia es la dilatación irreversible del bronquio.",
    category: "Vía aérea",
  },
];

export const rxQuiz: QuizQuestion[] = [
  {
    id: "rx-1",
    question:
      "¿Cuál es el signo radiográfico clásico del neumotórax a tensión?",
    options: [
      "Broncograma aéreo",
      "Desplazamiento contralateral del mediastino + aplanamiento diafragmático",
      "Borramiento del seno costofrénico",
      "Silueta cardíaca aumentada",
    ],
    correctIndex: 1,
    explanation:
      "El neumotórax a tensión muestra: 1) Hiperclaridad sin trama vascular, 2) Desplazamiento mediastínico contralateral, 3) Aplanamiento o inversión del diafragma ipsilateral. Es una emergencia.",
    category: "Urgencias",
  },
  {
    id: "rx-2",
    question:
      "En una RX de tórax, ¿qué hallazgo sugiere edema pulmonar cardiogénico?",
    options: [
      "Consolidación lobar unilateral",
      "Redistribución vascular cefálica + líneas B de Kerley + derrame bilateral",
      "Nódulo pulmonar solitario",
      "Atelectasia laminar",
    ],
    correctIndex: 1,
    explanation:
      "El edema cardiogénico muestra patrón de redistribución vascular (cefalización), líneas B de Kerley (edema intersticial), manguitos peribronquiales, derrame bilateral y cardiomegalia.",
    category: "Cardíaco",
  },
  {
    id: "rx-3",
    question: "¿Qué signo radiográfico confirma consolidación pulmonar?",
    options: [
      "Línea pleural visible",
      "Broncograma aéreo",
      "Hiperinsuflación",
      "Calcificaciones",
    ],
    correctIndex: 1,
    explanation:
      "El broncograma aéreo (bronquios con aire visibles dentro de parénquima opacificado) confirma consolidación del espacio aéreo. Típico de neumonía, pero también en SDRA y hemorragia alveolar.",
    category: "Parénquima",
  },
  {
    id: "rx-4",
    question:
      "¿Cuánto derrame pleural mínimo se necesita para ver borramiento del seno costofrénico en RX PA de pie?",
    options: ["50 mL", "200-300 mL", "500 mL", "1000 mL"],
    correctIndex: 1,
    explanation:
      "Se necesitan aproximadamente 200-300 mL de líquido pleural para borrar el seno costofrénico en una radiografía PA de pie. En decúbito lateral se detectan cantidades menores (~100 mL).",
    category: "Pleura",
  },
  {
    id: "rx-5",
    question:
      "Paciente intubado en UCI. La RX muestra opacidad homogénea del hemitórax derecho con desplazamiento ipsilateral del mediastino. ¿Diagnóstico más probable?",
    options: [
      "Derrame pleural masivo",
      "Atelectasia completa del pulmón derecho",
      "Neumonía masiva",
      "Neumotórax",
    ],
    correctIndex: 1,
    explanation:
      "La atelectasia completa muestra opacidad con desplazamiento IPSILATERAL del mediastino (pérdida de volumen). El derrame masivo causa desplazamiento CONTRALATERAL (efecto de masa).",
    category: "UCI",
  },
];
