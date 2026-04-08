export interface SimulatorCase {
  id: string;
  title: string;
  clinicalContext: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  questions: SimulatorQuestion[];
  finalDiagnosis: string;
  explanation: string;
  teachingPoints: string[];
}

export interface SimulatorQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const simulatorCases: SimulatorCase[] = [
  {
    id: "case-1",
    title: "Disnea aguda en UCI",
    clinicalContext:
      "Paciente de 65 años, post-operado de cirugía abdominal, ventilación mecánica. Desarrolla hipoxemia súbita con SpO2 88%. Se realiza ecografía pulmonar de urgencia. Se observa: ausencia de deslizamiento pleural en hemitórax derecho anterior, presencia de líneas A, código de barras en modo M.",
    difficulty: "Básico",
    questions: [
      {
        id: "q1",
        question: "¿Hay deslizamiento pleural?",
        options: [
          "Sí, deslizamiento normal",
          "No, ausencia de deslizamiento",
          "Deslizamiento reducido",
          "No evaluable",
        ],
        correctAnswer: 1,
        explanation:
          "La ausencia de deslizamiento pleural es el primer hallazgo a evaluar. En este caso está ausente en el hemitórax derecho anterior.",
      },
      {
        id: "q2",
        question: "¿Qué patrón se observa en modo M?",
        options: [
          "Signo de la playa (seashore)",
          "Signo del código de barras (stratosphere)",
          "Signo del sinusoide",
          "Patrón normal",
        ],
        correctAnswer: 1,
        explanation:
          "El código de barras en modo M confirma la ausencia de deslizamiento pleural. Solo se ven líneas horizontales paralelas sin el patrón granular inferior.",
      },
      {
        id: "q3",
        question: "¿Cuál es el diagnóstico más probable?",
        options: [
          "Derrame pleural",
          "Neumotórax",
          "Edema pulmonar",
          "Consolidación",
        ],
        correctAnswer: 1,
        explanation:
          "Ausencia de deslizamiento + líneas A + código de barras = alta sospecha de neumotórax. Se debe buscar el punto pulmonar para confirmar.",
      },
    ],
    finalDiagnosis: "Neumotórax derecho",
    explanation:
      "La tríada de ausencia de deslizamiento pleural, presencia de líneas A y código de barras en modo M es altamente sugestiva de neumotórax. La ecografía pulmonar tiene sensibilidad del 90-95% para neumotórax, superior a la radiografía de tórax en decúbito supino.",
    teachingPoints: [
      "La ausencia de deslizamiento es el primer signo a buscar",
      "El código de barras confirma en modo M",
      "El punto pulmonar es patognomónico (especificidad 100%)",
      "La ecografía supera a la Rx de tórax en decúbito para neumotórax",
    ],
  },
  {
    id: "case-2",
    title: "Insuficiencia cardíaca descompensada",
    clinicalContext:
      "Paciente de 72 años con antecedentes de insuficiencia cardíaca, ingresa por disnea progresiva y ortopnea. PA 160/95, FC 110, SpO2 90% con O2. Ecografía pulmonar muestra: deslizamiento pleural presente bilateral, múltiples líneas B (>3 por campo) bilaterales y simétricas en zonas anteriores y laterales.",
    difficulty: "Básico",
    questions: [
      {
        id: "q1",
        question: "¿Hay líneas B patológicas?",
        options: [
          "No hay líneas B",
          "Líneas B aisladas (<3 por campo)",
          "Líneas B múltiples (≥3 por campo)",
          "Solo líneas Z",
        ],
        correctAnswer: 2,
        explanation:
          "Se observan ≥3 líneas B por campo intercostal, lo que constituye un patrón B patológico indicativo de síndrome intersticial.",
      },
      {
        id: "q2",
        question: "¿Cuál es la distribución de las líneas B?",
        options: [
          "Unilateral focal",
          "Bilateral asimétrica",
          "Bilateral simétrica difusa",
          "Solo posterior",
        ],
        correctAnswer: 2,
        explanation:
          "La distribución bilateral y simétrica de las líneas B es característica del edema pulmonar cardiogénico, a diferencia de la distribución asimétrica o focal de la neumonía.",
      },
      {
        id: "q3",
        question: "¿Existe patrón intersticial?",
        options: ["No", "Sí, focal", "Sí, difuso bilateral", "Indeterminado"],
        correctAnswer: 2,
        explanation:
          "El patrón intersticial difuso bilateral (perfil B del protocolo BLUE) en contexto de cardiopatía orienta fuertemente a edema pulmonar cardiogénico.",
      },
    ],
    finalDiagnosis: "Edema agudo de pulmón cardiogénico",
    explanation:
      "El perfil B bilateral simétrico (múltiples líneas B difusas en ambos campos pulmonares) con deslizamiento conservado y línea pleural regular es el patrón ecográfico del edema pulmonar. La correlación con la clínica (ICC, ortopnea, HTA) confirma el origen cardiogénico.",
    teachingPoints: [
      "Perfil B bilateral simétrico = edema pulmonar (protocolo BLUE)",
      "Las líneas B son el correlato ecográfico del edema intersticial",
      "Distribución simétrica → cardiogénico; asimétrica → SDRA/neumonía",
      "La ecografía detecta congestión pulmonar antes que la radiografía",
    ],
  },
  {
    id: "case-3",
    title: "Neumonía en paciente ventilado",
    clinicalContext:
      "Paciente de 58 años, 7 días en ventilación mecánica. Fiebre 38.8°C, secreciones purulentas, leucocitosis. Ecografía pulmonar: zona posteroinferior izquierda muestra consolidación con textura tipo hígado, broncograma aéreo dinámico visible, pequeño derrame pleural asociado.",
    difficulty: "Intermedio",
    questions: [
      {
        id: "q1",
        question: "¿Existe consolidación pulmonar?",
        options: [
          "No",
          "Sí, con patrón tisular tipo hígado",
          "Solo derrame",
          "Atelectasia simple",
        ],
        correctAnswer: 1,
        explanation:
          "Se observa hepatización del parénquima pulmonar: el pulmón adopta una ecotextura similar al hígado por pérdida completa de aire alveolar.",
      },
      {
        id: "q2",
        question: "¿Qué tipo de broncograma se observa?",
        options: [
          "No hay broncograma",
          "Broncograma aéreo estático",
          "Broncograma aéreo dinámico",
          "Broncograma líquido",
        ],
        correctAnswer: 2,
        explanation:
          "El broncograma aéreo dinámico (los puntos hiperecogénicos se mueven con la respiración) es sugestivo de neumonía, a diferencia del estático que sugiere atelectasia obstructiva.",
      },
      {
        id: "q3",
        question: "¿Cuál es el diagnóstico más probable?",
        options: [
          "Atelectasia obstructiva",
          "Neumonía asociada a ventilación mecánica",
          "Edema pulmonar",
          "Neumotórax",
        ],
        correctAnswer: 1,
        explanation:
          "Consolidación con broncograma aéreo dinámico + fiebre + leucocitosis + secreciones purulentas en paciente ventilado = neumonía asociada a VM (NAV).",
      },
    ],
    finalDiagnosis: "Neumonía asociada a ventilación mecánica (NAV)",
    explanation:
      "La consolidación con broncograma aéreo dinámico en contexto de fiebre, leucocitosis y secreciones purulentas en un paciente con >48h de ventilación mecánica configura el diagnóstico de NAV. El derrame paraneumónico asociado es frecuente.",
    teachingPoints: [
      "Broncograma aéreo dinámico → neumonía; estático → atelectasia",
      "El broncograma líquido sugiere obstrucción bronquial",
      "El derrame paraneumónico es un hallazgo frecuente asociado",
      "La ecografía tiene sensibilidad >90% para consolidación pulmonar",
    ],
  },
  {
    id: "case-4",
    title: "Derrame pleural masivo",
    clinicalContext:
      "Paciente de 68 años con antecedente de neoplasia pulmonar, disnea severa progresiva. Ecografía: gran colección anecoica en hemitórax derecho con pulmón colapsado flotante (signo de la medusa), signo del cuadrilátero presente, sinusoide positivo en modo M.",
    difficulty: "Intermedio",
    questions: [
      {
        id: "q1",
        question: "¿Hay deslizamiento pleural?",
        options: [
          "Sí, normal",
          "No, ausente",
          "Reemplazado por signo del sinusoide",
          "No evaluable por el líquido",
        ],
        correctAnswer: 2,
        explanation:
          "En presencia de derrame, el deslizamiento es reemplazado por el movimiento del pulmón dentro del líquido (sinusoide). El deslizamiento clásico requiere contacto pleural directo.",
      },
      {
        id: "q2",
        question: "¿Qué signos ecográficos están presentes?",
        options: [
          "Líneas A y B",
          "Cuadrilátero, sinusoide y medusa",
          "Código de barras",
          "Solo consolidación",
        ],
        correctAnswer: 1,
        explanation:
          "Los tres signos clásicos del derrame: cuadrilátero (delimita el derrame), sinusoide (confirma líquido libre), medusa (indica derrame masivo con colapso pulmonar).",
      },
      {
        id: "q3",
        question: "¿Cuál es la urgencia terapéutica?",
        options: [
          "Observación",
          "Drenaje torácico urgente",
          "Antibióticos",
          "Ventilación mecánica",
        ],
        correctAnswer: 1,
        explanation:
          "Un derrame masivo con colapso pulmonar (signo de la medusa) causa insuficiencia respiratoria y requiere drenaje urgente para re-expandir el pulmón.",
      },
    ],
    finalDiagnosis: "Derrame pleural masivo de origen neoplásico",
    explanation:
      "El derrame masivo con signo de la medusa indica colapso completo del pulmón. Los tres signos ecográficos (cuadrilátero, sinusoide, medusa) confirman derrame libre masivo. En contexto de neoplasia, orienta a derrame maligno.",
    teachingPoints: [
      "Signo de la medusa = derrame masivo con colapso pulmonar",
      "El sinusoide confirma líquido libre (no tabicado)",
      "La ecogenicidad del líquido orienta la etiología",
      "La ecografía guía la punción: marca el punto seguro de drenaje",
    ],
  },
  {
    id: "case-5",
    title: "SDRA en COVID-19",
    clinicalContext:
      "Paciente de 55 años con COVID-19, 10 días de evolución, PaO2/FiO2 120. Ecografía pulmonar: líneas B confluentes bilaterales con distribución parcheada, consolidaciones subpleurales pequeñas, línea pleural irregular y engrosada, deslizamiento reducido.",
    difficulty: "Avanzado",
    questions: [
      {
        id: "q1",
        question: "¿Cómo se distribuyen las líneas B?",
        options: [
          "Bilateral simétrica homogénea",
          "Bilateral parcheada (heterogénea)",
          "Unilateral",
          "Ausentes",
        ],
        correctAnswer: 1,
        explanation:
          "En SDRA, las líneas B tienen distribución parcheada e irregular, a diferencia del edema cardiogénico donde son simétricas y homogéneas. Esto refleja la afectación pulmonar heterogénea del SDRA.",
      },
      {
        id: "q2",
        question: "¿Cómo está la línea pleural?",
        options: [
          "Normal, lisa y regular",
          "Irregular, engrosada y fragmentada",
          "Ausente",
          "Con derrame",
        ],
        correctAnswer: 1,
        explanation:
          "En SDRA, la línea pleural se engrosa, se fragmenta y pierde su regularidad. Las consolidaciones subpleurales pequeñas son características. Esto diferencia SDRA de edema cardiogénico (pleura regular).",
      },
      {
        id: "q3",
        question: "¿Qué diferencia este patrón del edema cardiogénico?",
        options: [
          "Nada, son idénticos",
          "Distribución parcheada + pleura irregular + consolidaciones",
          "Solo la clínica los diferencia",
          "Las líneas B son diferentes",
        ],
        correctAnswer: 1,
        explanation:
          "SDRA: distribución parcheada, pleura irregular, consolidaciones subpleurales, spared areas. Edema cardiogénico: distribución homogénea bilateral, pleura regular, sin consolidaciones.",
      },
    ],
    finalDiagnosis: "SDRA por COVID-19",
    explanation:
      "El patrón ecográfico del SDRA se caracteriza por líneas B confluentes con distribución parcheada (no homogénea), consolidaciones subpleurales, línea pleural irregular y áreas respetadas (spared areas). Esto refleja la afectación pulmonar heterogénea típica del SDRA.",
    teachingPoints: [
      "SDRA: parcheado, irregular; Edema: homogéneo, regular",
      "Las consolidaciones subpleurales son típicas del SDRA",
      "Las 'spared areas' ayudan a diferenciar de edema cardiogénico",
      "El LUS score es útil para monitorizar la evolución del SDRA",
    ],
  },
];
