const ecmoVVCircuit =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ecmo-vv-circuit_e59906d1.jpg";
const ecmoVACircuit =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ecmo-va-circuit_14187878.jpg";
const ecmoComponents =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/ecmo-components_bf26d2df.jpg";
const harlequinSyndrome =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/harlequin-syndrome_20ac9298.jpg";

export interface ECMOTopic {
  id: string;
  title: string;
  category: ECMOCategory;
  summary: string;
  content: string[];
  keyPoints?: string[];
  image?: string;
  references?: string[];
}

export type ECMOCategory =
  | "fundamentals"
  | "vv"
  | "va"
  | "components"
  | "management"
  | "complications"
  | "covid"
  | "weaning";

export interface ECMOIndication {
  id: string;
  type: "VV" | "VA";
  condition: string;
  criteria: string;
  guideline: "EOLIA" | "ELSO" | "General";
}

export interface ECMOMonitoringParameter {
  id: string;
  parameter: string;
  unit: string;
  normalRange: string;
  description: string;
  clinicalSignificance: string;
  category: "Bomba" | "Oxigenador" | "Paciente";
}

export const ecmoIndications: ECMOIndication[] = [
  {
    id: "vv-hypoxemia-1",
    type: "VV",
    condition: "Hipoxemia refractaria severa",
    criteria: "PaO₂/FiO₂ < 50 mmHg con FiO₂ > 80% por > 3 horas",
    guideline: "EOLIA",
  },
  {
    id: "vv-hypoxemia-2",
    type: "VV",
    condition: "Hipoxemia refractaria",
    criteria: "PaO₂/FiO₂ < 80 mmHg con FiO₂ > 80% por > 6 horas",
    guideline: "EOLIA",
  },
  {
    id: "vv-acidosis",
    type: "VV",
    condition: "Acidosis respiratoria no compensada",
    criteria:
      "pH arterial < 7.25 con PaCO₂ > 60 mmHg por > 6 horas (con Pplat < 30)",
    guideline: "EOLIA",
  },
  {
    id: "vv-bridge-transplant",
    type: "VV",
    condition: "Puente a trasplante pulmonar",
    criteria: "Deterioro respiratorio agudo en paciente en lista de espera",
    guideline: "General",
  },
  {
    id: "va-cardiogenic-shock",
    type: "VA",
    condition: "Shock cardiogénico refractario",
    criteria:
      "Hipotensión sostenida (PAS < 90 mmHg) con evidencia de hipoperfusión tisular, a pesar de vasopresores e inotrópicos",
    guideline: "ELSO",
  },
  {
    id: "va-ecpr",
    type: "VA",
    condition: "Paro cardíaco (ECPR)",
    criteria:
      "Paro cardíaco presenciado, sin ROSC tras 10-15 min de RCP de alta calidad, en causa potencialmente reversible",
    guideline: "ELSO",
  },
  {
    id: "va-postcardiotomy",
    type: "VA",
    condition: "Fallo al destete de CEC",
    criteria:
      "Imposibilidad de salir de bypass cardiopulmonar tras cirugía cardíaca",
    guideline: "General",
  },
  {
    id: "va-arrhythmia",
    type: "VA",
    condition: "Arritmias ventriculares refractarias",
    criteria:
      "TV/FV incesante que causa inestabilidad hemodinámica a pesar de antiarrítmicos y/o desfibrilación",
    guideline: "ELSO",
  },
];

export const ecmoMonitoringParameters: ECMOMonitoringParameter[] = [
  {
    id: "rpm",
    parameter: "RPM (Revoluciones Por Minuto)",
    unit: "revoluciones/min",
    normalRange: "1500-4000",
    description: "Velocidad de giro de la bomba centrífuga.",
    clinicalSignificance:
      "Principal determinante del flujo. Se ajusta para alcanzar el flujo objetivo. Una caída del flujo a las mismas RPM indica un problema de precarga (hipovolemia) o postcarga.",
    category: "Bomba",
  },
  {
    id: "pump-flow",
    parameter: "Flujo de Bomba",
    unit: "L/min",
    normalRange: "3-7 (adultos)",
    description:
      "Volumen de sangre que la bomba impulsa por minuto. Ajustado según el soporte requerido.",
    clinicalSignificance:
      "Parámetro clave del soporte. En VA, determina el gasto cardíaco. En VV, la oxigenación. Objetivo: 50-70 ml/kg/min.",
    category: "Bomba",
  },
  {
    id: "pre-pump-pressure",
    parameter: "Presión de Drenaje (Pre-Bomba)",
    unit: "mmHg",
    normalRange: "-20 a -80",
    description: "Presión en la línea venosa antes de la bomba.",
    clinicalSignificance:
      'Indica la adecuación de la precarga. Presiones muy negativas (< -100 mmHg) sugieren "chattering" por hipovolemia, acodamiento o malposición de la cánula.',
    category: "Bomba",
  },
  {
    id: "sweep-gas-flow",
    parameter: "Flujo de Gas de Barrido (Sweep)",
    unit: "L/min",
    normalRange: "1-15",
    description: "Flujo de gas (O₂ y aire) que atraviesa el oxigenador.",
    clinicalSignificance:
      "Controla directamente la eliminación de CO₂ (PaCO₂). A mayor flujo, mayor lavado de CO₂. Se ajusta según la gasometría.",
    category: "Oxigenador",
  },
  {
    id: "fio2-sweep",
    parameter: "FiO₂ del Mezclador",
    unit: "%",
    normalRange: "21-100",
    description: "Fracción de oxígeno en el gas de barrido.",
    clinicalSignificance:
      "Controla la oxigenación de la sangre que sale del circuito. Se ajusta para mantener una PaO₂ y SatO₂ adecuadas en el paciente.",
    category: "Oxigenador",
  },
  {
    id: "pre-membrane-pressure",
    parameter: "Presión Pre-Membrana (P-in)",
    unit: "mmHg",
    normalRange: "100-300",
    description: "Presión de la sangre justo antes de entrar al oxigenador.",
    clinicalSignificance:
      "Un aumento progresivo sugiere formación de trombos en la membrana del oxigenador.",
    category: "Oxigenador",
  },
  {
    id: "post-membrane-pressure",
    parameter: "Presión Post-Membrana (P-out)",
    unit: "mmHg",
    normalRange: "80-280",
    description:
      "Presión de la sangre inmediatamente después de salir del oxigenador.",
    clinicalSignificance:
      "Depende de la resistencia de la cánula de retorno y la post-carga del paciente.",
    category: "Oxigenador",
  },
  {
    id: "trans-membrane-gradient",
    parameter: "Gradiente Trans-Membrana (ΔP)",
    unit: "mmHg",
    normalRange: "20-60",
    description:
      "Diferencia entre la presión pre y post-membrana (P-in - P-out).",
    clinicalSignificance:
      "El indicador más fiable de la función del oxigenador. Un aumento sostenido (>50 mmHg sobre el basal) indica trombosis de la membrana y es un criterio para el cambio del oxigenador.",
    category: "Oxigenador",
  },
  {
    id: "sato2-post-membrane",
    parameter: "SatO₂ Post-Membrana",
    unit: "%",
    normalRange: "99-100",
    description: "Saturación de oxígeno de la sangre que sale del oxigenador.",
    clinicalSignificance:
      "Debe ser del 100%. Una caída indica fallo del oxigenador (incapacidad para oxigenar la sangre a pesar de FiO₂ del 100% en el mezclador).",
    category: "Oxigenador",
  },
  {
    id: "svo2",
    parameter: "SvO₂ (Saturación Venosa Mixta)",
    unit: "%",
    normalRange: "65-80",
    description:
      "Saturación de oxígeno en la sangre venosa que llega al circuito.",
    clinicalSignificance:
      "Refleja el equilibrio entre el aporte y el consumo de oxígeno del paciente. Una SvO₂ baja indica un soporte insuficiente o un aumento del consumo de O₂ (fiebre, sepsis).",
    category: "Paciente",
  },
];

export const categoryLabels: Record<ECMOCategory, string> = {
  fundamentals: "Fundamentos",
  vv: "ECMO Veno-Venoso",
  va: "ECMO Veno-Arterial",
  components: "Componentes",
  management: "Manejo",
  complications: "Complicaciones",
  covid: "ECMO & COVID-19",
  weaning: "Destete",
};

export const categoryColors: Record<ECMOCategory, string> = {
  fundamentals: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  vv: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  va: "bg-red-500/10 text-red-400 border-red-500/30",
  components: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  management: "bg-green-500/10 text-green-400 border-green-500/30",
  complications: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  covid: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  weaning: "bg-teal-500/10 text-teal-400 border-teal-500/30",
};

export const ecmoTopics: ECMOTopic[] = [
  // ===== FUNDAMENTOS =====
  {
    id: "intro-ecmo",
    title: "Introducción al ECMO",
    category: "fundamentals",
    summary:
      "Soporte vital extracorpóreo (ECLS) que suple la función cardíaca, pulmonar o ambas de forma temporal.",
    image: ecmoComponents,
    content: [
      "ECMO (ExtraCorporeal Membrane Oxygenation) es una terapia de 'rescate' para soporte hemodinámico y/o respiratorio. Su uso está restringido a centros especializados con equipos entrenados.",
      "Los sistemas ECLS son dispositivos de reanimación que permiten asistir a pacientes sacándolos de la situación más crítica, proporcionando tiempo para que la patología de base se recupere o para la toma de decisiones.",
      "El éxito de esta tecnología depende de: 1) Selección adecuada de pacientes, 2) Momento óptimo de implantación, 3) Correcto manejo postoperatorio por equipo multidisciplinar.",
      "Históricamente, fue aceptada como práctica a principios de 1990. En 2009 el uso de ECMO repuntó durante la pandemia de influenza AH1N1. Los estudios CESAR y EOLIA demostraron que ECMO en SDRA no provocaba mayor daño y su uso temprano puede ser beneficioso.",
    ],
    keyPoints: [
      "Terapia de rescate para fallo cardíaco y/o respiratorio refractario",
      "Requiere equipo multidisciplinar especializado",
      "Puede ser VV (respiratorio), VA (circulatorio) o híbrido",
      "Centros ECMO deben tener ≥20 casos/año (mínimo 12 para falla respiratoria)",
      "ELSO coordina y estandariza los procesos a nivel mundial",
    ],
    references: [
      "Monográfico AEP: Soporte vital extracorpóreo. Rev Esp Perfusión 2017;62",
      "Lima Linares R. Oxigenación con membrana extracorpórea. Rev Chil Anest 2021;50:314-329",
    ],
  },
  {
    id: "history-ecmo",
    title: "Historia y Evolución",
    category: "fundamentals",
    summary:
      "Desde Gibbon en 1953 hasta los estudios CESAR y EOLIA, la evolución del soporte extracorpóreo.",
    content: [
      "1953 — Gibbon: primera cirugía a corazón abierto con perfusión y oxigenación artificial en la Clínica Mayo.",
      "1965 — Rashkind: primer uso de oxigenador de burbuja en neonato con insuficiencia respiratoria grave.",
      "1972 — Zapol: primer uso exitoso de ECMO prolongado en adulto con politrauma e insuficiencia respiratoria. Publicado en NEJM.",
      "1975 — Bartlett: primer uso exitoso de ECMO en neonatos con insuficiencia respiratoria severa.",
      "1989 — Creación de ELSO (Extracorporeal Life Support Organization) en Nueva Orleans para coordinar centros y estandarizar procesos.",
      "2009 — Estudio CESAR: primer RCT de ECMO VV en SDRA. Repunte de uso durante pandemia H1N1.",
      "2018 — Estudio EOLIA: no demostró reducción significativa de mortalidad pero sí beneficio del uso temprano de ECMO en SDRA severo.",
      "2020 — Pandemia COVID-19: guías ELSO para uso de ECMO en pacientes con SARS-CoV-2.",
    ],
    keyPoints: [
      "70+ años de desarrollo desde la primera CEC",
      "Evolución de neonatos → adultos y de quirófano → UCI",
      "ELSO: organización global desde 1989",
      "Evidencia creciente de beneficio con uso temprano",
    ],
  },

  // ===== COMPONENTES =====
  {
    id: "circuit-components",
    title: "Componentes del Circuito ECMO",
    category: "components",
    summary:
      "Cánulas, bomba centrífuga, oxigenador de membrana, consola, mezclador de gas e intercambiador de calor.",
    image: ecmoComponents,
    content: [
      "**Cánulas**: Poliuretano reforzado con anillos de acero inoxidable, flexibles, resistentes al acodamiento y radiopacas. Venosas (azul): salida del paciente. Arteriales (rojo): entrada al paciente. Se seleccionan según superficie corporal y calibre vascular.",
      "**Bomba centrífuga**: Proporciona energía para impulsar la sangre. Levitación magnética (menor fricción, hemólisis y trombosis). Genera flujo laminar no pulsátil. No oclusiva — si se detiene, la sangre fluye retrógradamente (pinzar línea arterial).",
      "**Oxigenador de membrana**: Membrana de polimetilpenteno (PMP) impermeable al plasma. Permite intercambio gaseoso por difusión durante días. Compuesto por fase gaseosa y fase sanguínea separadas por membrana.",
      "**Mezclador de gas (caudalímetro)**: Regula proporción O₂/aire y flujo de la mezcla. Control de CO₂: variar flujo de gas. Control de O₂: variar FiO₂ del gas suministrado.",
      "**Intercambiador de calor**: Serpentín con agua a temperatura variable. Mantener normotermia (36°C) para evitar arritmias cardíacas.",
      "**Consola**: Control hemodinámico del sistema. Registra RPM, flujo (LPM), y datos de sensores. Diseñada para transporte — controlar duración de batería.",
    ],
    keyPoints: [
      "Cánulas de mayor calibre posible para asegurar flujo y minimizar resistencias",
      "Canulación femoral requiere cánula adicional para perfusión del miembro",
      "Bombas de levitación magnética: menor hemólisis y trombosis",
      "Oxigenadores PMP: uso prolongado sin fugas de plasma",
      "Control independiente de O₂ (FiO₂) y CO₂ (flujo de gas)",
    ],
  },

  // ===== ECMO VV =====
  {
    id: "ecmo-vv",
    title: "ECMO Veno-Venoso",
    category: "vv",
    summary:
      "Soporte respiratorio puro: oxigenación y eliminación de CO₂ en sangre venosa sin soporte circulatorio.",
    image: ecmoVVCircuit,
    content: [
      "El ECMO VV se caracteriza por la oxigenación y eliminación de CO₂ en sangre venosa. Es utilizado para tratar la falla pulmonar pura con función cardíaca preservada.",
      "**Canulación**: Habitualmente cánula de drenaje larga en vena femoral (punta en VCI/unión AD) y cánula de retorno corta en yugular interna derecha. También puede usarse cánula de doble lumen en yugular.",
      "**Recirculación**: Fracción inevitable de sangre oxigenada que es re-drenada. La magnitud depende de la localización de las cánulas. La configuración fémoro-atrial reduce la recirculación al dirigir sangre oxigenada hacia la válvula tricúspide.",
      "**Indicación principal**: SDRA severo (criterios de Berlín: PaO₂/FiO₂ < 100 con PEEP ≥ 5). El paciente mantiene su propio gasto cardíaco.",
    ],
    keyPoints: [
      "Solo soporte respiratorio — el paciente mantiene gasto cardíaco propio",
      "Indicación: fallo respiratorio refractario con función cardíaca preservada",
      "Recirculación: problema inherente — optimizar posición de cánulas",
      "Se recomienda prono previo al ECMO en SDRA severo",
    ],
  },
  {
    id: "ecmo-vv-indications",
    title: "Indicaciones ECMO VV",
    category: "vv",
    summary:
      "Criterios basados en estudio EOLIA para inicio de ECMO en SDRA severo.",
    content: [
      "**Indicaciones principales (Estudio EOLIA)**:",
      "• PaO₂/FiO₂ < 50 mmHg por 3 horas",
      "• PaO₂/FiO₂ < 80 mmHg por 6 horas",
      "• pH arterial < 7.25 con PaCO₂ > 60 mmHg por 6 horas",
      "**Otras indicaciones**:",
      "• Neumonías graves con hipoxemia refractaria",
      "• Contusiones pulmonares severas",
      "• Estatus asmático refractario",
      "• SDRA con insuficiencia respiratoria potencialmente reversible",
      "• Fallo precoz del injerto post-trasplante pulmonar",
      "• Pacientes en lista de espera de trasplante pulmonar con deterioro grave",
    ],
    keyPoints: [
      "Criterios EOLIA: PaFiO₂ < 50 por 3h o < 80 por 6h",
      "Acidosis respiratoria refractaria: pH < 7.25 con PaCO₂ > 60",
      "Recomendación: activar alerta ECMO al considerar prono",
      "Uso temprano = mejores resultados que aplicación tardía",
    ],
  },
  {
    id: "ecmo-vv-contraindications",
    title: "Contraindicaciones ECMO VV",
    category: "vv",
    summary:
      "Contraindicaciones absolutas y relativas para la instauración de ECMO veno-venoso.",
    content: [
      "**Contraindicaciones absolutas**:",
      "• Paciente moribundo con falla orgánica múltiple establecida",
      "• Mal pronóstico a corto plazo (ej. enfermedad metastásica maligna)",
      "• Comorbilidades en etapa avanzada (insuficiencia respiratoria crónica sin indicación de trasplante)",
      "• Patología neurológica devastadora (ej. hemorragia masiva intracraneal)",
      "**Contraindicaciones relativas**:",
      "• Ventilación mecánica con presiones altas por más de 7 días",
      "• Edad avanzada",
      "• Accesos vasculares limitados",
      "• Sangrado activo",
      "• Contraindicaciones para anticoagulación (en ocasiones puede colocarse sin anticoagulación)",
    ],
    keyPoints: [
      "VM > 7 días con presiones altas: peor pronóstico",
      "Falla multiorgánica establecida = contraindicación absoluta",
      "Valorar riesgo-beneficio individualmente en relativas",
    ],
  },

  // ===== ECMO VA =====
  {
    id: "ecmo-va",
    title: "ECMO Veno-Arterial",
    category: "va",
    summary:
      "Soporte circulatorio y respiratorio: drenaje venoso con retorno arterial para shock cardiogénico refractario.",
    image: ecmoVACircuit,
    content: [
      "El ECMO VA consiste en drenar sangre desde la aurícula derecha (vía yugular, femoral o directa) y retornarla a la aorta (vía carótida, femoral o aórtica).",
      "**Meta inicial**: Flujo 50-70 ml/kg/min con PAM > 60 mmHg y presión diferencial > 10 mmHg.",
      "**Monitorización**: Línea arterial radial derecha (contenido cerebral de O₂). La presión de pulso indica contractilidad: baja (< 10 mmHg) = VI no eyecta → estasis y riesgo trombótico. Elevada = posible recuperación miocárdica.",
      "**Objetivos según contexto**: Puente a recuperación, puente a decisión, 'bridge to bridge' (estabilización para soporte duradero), puente a trasplante cardíaco.",
      "**Anticoagulación**: Niveles más altos que ECMO VV por riesgo de trombosis sistémica. Heparina no fraccionada de elección. Bivalirudina/Argatroban como alternativas en TIH.",
    ],
    keyPoints: [
      "Soporte circulatorio + respiratorio completo",
      "Meta: flujo 50-70 ml/kg/min, PAM > 60 mmHg",
      "Presión de pulso: indicador indirecto de recuperación",
      "Anticoagulación más agresiva que ECMO VV",
      "Descompresión del VI: pilar fundamental",
    ],
  },
  {
    id: "ecmo-va-indications",
    title: "Indicaciones ECMO VA",
    category: "va",
    summary:
      "Shock cardiogénico refractario, paro cardíaco (ECPR), y otras indicaciones de soporte circulatorio.",
    content: [
      "**Indicaciones principales**:",
      "1. Paro cardíaco (RCP Extracorpórea — ECPR)",
      "2. Shock cardiogénico en contexto de:",
      "   • Síndrome coronario agudo",
      "   • Insuficiencia cardíaca aguda",
      "   • Falla ventricular derecha aguda por embolismo pulmonar",
      "   • Falla VD durante uso de dispositivos de asistencia ventricular izquierda",
      "   • Postcardiotomía — incapaz de salir de bypass cardiopulmonar",
      "   • Falla primaria de injerto post-trasplante cardíaco",
      "   • Miocarditis",
      "   • Arritmias ventriculares refractarias",
      "   • Hipotermia severa (< 28°C) con inestabilidad hemodinámica",
      "   • Miocardiopatía séptica",
    ],
    keyPoints: [
      "Shock cardiogénico refractario: indicación principal",
      "ECPR: requiere equipo altamente entrenado",
      "Miocarditis: mejor pronóstico (mortalidad hospitalaria ~33%)",
      "Decisión rápida: ni muy pronto ni muy tarde",
    ],
  },
  {
    id: "harlequin-syndrome",
    title: "Síndrome de Arlequín (Norte-Sur)",
    category: "va",
    summary:
      "Hipoxia diferencial en ECMO VA: cuerpo inferior oxigenado por ECMO, superior cianótico por el corazón.",
    image: harlequinSyndrome,
    content: [
      "Cuando el VI genera gasto cardíaco importante (especialmente en fase de recuperación), este flujo compite con el flujo del ECMO en la aorta descendente desde la femoral.",
      "**Resultado**: Parte inferior del cuerpo más oxigenada que la superior. Los órganos diana críticos (cerebro, coronarias) reciben sangre menos oxigenada.",
      "**Diagnóstico**: Monitorización dual de SatO₂ — sensor en frente/oreja + sensor en dedos del pie. Gasometría de arteria radial derecha para correlación cerebral.",
      "**Manejo**: 1) Ajustar parámetros ventilatorios, 2) Considerar canulación central (subclavia/tronco braquiocefálico), 3) Disminuir eyección del VI, 4) Convertir a ECMO V-A-V (híbrido).",
    ],
    keyPoints: [
      "Complicación específica de ECMO VA con canulación femoral",
      "Monitorización dual obligatoria de SatO₂",
      "Gasometría: arteria radial más alejada del retorno ECMO",
      "Conversión a ECMO híbrido (VAV) como solución",
    ],
  },
  {
    id: "save-score",
    title: "SAVE Score — Pronóstico ECMO VA",
    category: "va",
    summary:
      "Herramienta pronóstica para mortalidad en shock cardiogénico refractario con ECMO VA (Schmidt et al.).",
    content: [
      "El SAVE Score fue desarrollado por Schmidt et al. a partir de 3,846 pacientes con shock cardiogénico refractario tratados con ECMO VA.",
      "**Factores protectores** (suman puntos): Edad joven (18-38: +7), menor peso, miocarditis aguda (+3), TV/FV refractaria (+2), PAD elevada preECMO (> 40 mmHg: +3), PIP < 20 cmH₂O (+3).",
      "**Factores de riesgo** (restan puntos): Falla hepática (-3), disfunción SNC (-3), falla renal (-3), ERC (-6), intubación > 30h preECMO (-4), paro cardíaco preECMO (-2), HCO₃ < 15 (-3).",
      "**Clasificación**: Clase I (> 5): 75% supervivencia. Clase II (1-5): 58%. Clase III (-4 a 0): 42%. Clase IV (-9 a -5): 30%. Clase V (< -10): 18%.",
    ],
    keyPoints: [
      "Rango: -35 a +17 puntos",
      "5 clases de supervivencia hospitalaria (18% a 75%)",
      "ERC: mayor penalización (-6 puntos)",
      "Miocarditis aguda: mejor pronóstico",
    ],
  },

  // ===== MANEJO =====
  {
    id: "pre-implant",
    title: "Preparación Pre-Implante",
    category: "management",
    summary:
      "Evaluación y preparación del paciente antes de la colocación del ECMO.",
    content: [
      "**Analítica**: Bioquímica con lactato, hemograma, hemostasia y gasometría arterial (si > 2h de la última).",
      "**Hemoderivados**: Cruzar y reservar 4 unidades de concentrados de hematíes. Transfundir si: Hcto < 30%, plaquetas < 100.000/mm³, o alteraciones de coagulación.",
      "**Antibióticos**: Iniciar profilaxis antibiótica — primera dosis previa al implante, mantener 48 horas.",
      "**Accesos vasculares**: Si precisa BIAC → femoral izquierda (preservar derecha para ECMO). Swan-Ganz: colocar previo a ECMO.",
      "**Línea arterial**: Radial derecha si canulación femoral o subclavia izquierda. Radial izquierda si subclavia derecha.",
      "**Monitorización dual SatO₂**: Sensor en frente/oreja + sensor en dedos del pie (mismo miembro si canulación femoral).",
      "**Anticoagulación**: Heparina sódica no fraccionada. Bolo 1 mg/kg. Si TCA < 200 seg tras 30 min → segundo bolo 0.5 mg/kg.",
    ],
    keyPoints: [
      "Reservar 4 U de hematíes antes del implante",
      "Profilaxis ATB: 48h post-implante",
      "Canulación femoral: preservar contralateral para BIAC",
      "TCA objetivo: 150-180 segundos durante asistencia",
    ],
  },
  {
    id: "during-ecmo",
    title: "Manejo Durante la Asistencia",
    category: "management",
    summary:
      "Monitorización, ajuste de parámetros y objetivos durante el soporte ECMO.",
    content: [
      "**Inicio**: FiO₂ del mezclador al 100%. Flujo de gas 1:1 respecto al de la bomba. Flujo inicial: 50-80 ml/kg/min (comenzar con 20 ml/kg/min e incrementar gradualmente cada 5-10 min).",
      "**Objetivos principales**: Flujo de bomba estable (según SC), PAM > 60 mmHg, PVC 10-15 mmHg, diuresis > 0.5-1 ml/kg/h, SvO₂ mixta 60-70%, Hcto 25-30%, disminuir lactato.",
      "**Ventilación protectora**: FiO₂ baja, volúmenes tidal pequeños, frecuencias bajas (parámetros de descanso), PEEP suficiente para evitar atelectasia. No usar Vt alto ni Pplat > 25 cmH₂O.",
      "**Anticoagulación**: TCA 150-180 seg. Inspección meticulosa del circuito al menos 1 vez/día. Depósitos blancos (fibrina) inmóviles: bajo riesgo. Depósitos oscuros (trombo) con movilidad: valorar cambio de dispositivo.",
      "**Volemia**: Optimizar precarga. Reponer con sangre/hemoderivados o albúmina (mejor que cristaloides). Evitar sobrecarga del VD.",
      "**Inotrópicos**: Mantener inotropismo en función cardíaca marginal para evitar estasis intracardíaco. Disminuir progresivamente.",
    ],
    keyPoints: [
      "Inicio gradual del flujo: 20 → objetivo en incrementos de 10 ml/kg/min",
      "PAM > 60 mmHg, SvO₂ 60-70%, lactato descendente",
      "Registrar parámetros cada 8h y ante cambios",
      "Ventilación de descanso: minimizar daño pulmonar",
    ],
  },
  {
    id: "monitoring-parameters",
    title: "Parámetros de Monitorización del Circuito",
    category: "management",
    summary:
      "Vigilancia de RPM, flujo de bomba, flujo de gas de barrido y presiones del circuito para asegurar un funcionamiento eficaz y seguro.",
    content: [
      "La monitorización continua de los parámetros del circuito es fundamental para la seguridad del paciente y la eficacia del soporte ECMO.",
      "**1. Flujo de Bomba (L/min) y RPM (Revoluciones Por Minuto)**:",
      "   - El Flujo de Bomba es el volumen de sangre que el circuito procesa por minuto. Es el parámetro principal para ajustar el nivel de soporte circulatorio (en VA) o de oxigenación (en VV).",
      "   - Las RPM indican la velocidad de giro de la bomba centrífuga. El flujo depende de las RPM y de las resistencias del circuito (pre-carga y post-carga).",
      "   - **Vigilancia Clave**: Un descenso del flujo a las mismas RPM indica un problema: hipovolemia (causa más común), malposición de la cánula de drenaje, o aumento de la post-carga (ej. HTA en VA).",
      "**2. Flujo de Gas de Barrido (Sweep Gas Flow, L/min)**:",
      "   - Controla directamente la eliminación de CO₂. Aumentar el 'sweep' aumenta el lavado de CO₂, disminuyendo la PaCO₂.",
      "   - Se ajusta para mantener una PaCO₂ objetivo (generalmente 35-45 mmHg).",
      "   - No afecta significativamente a la oxigenación, la cual depende del flujo de bomba y de la FiO₂ del gas.",
      "**3. Presiones del Circuito**:",
      "   - **Presión Pre-membrana (P-in)**: Presión de la sangre al entrar al oxigenador. Un aumento progresivo sugiere formación de trombos en la membrana.",
      "   - **Presión Post-membrana (P-out)**: Presión de la sangre al salir del oxigenador.",
      "   - **Gradiente Trans-membrana (ΔP = P-in - P-out)**: El indicador más fiable de la función del oxigenador. Un aumento sostenido del ΔP (> 50-100 mmHg sobre el basal) indica trombosis de la membrana y es un criterio para el cambio del oxigenador.",
      "   - **Presión de Drenaje (Pre-bomba)**: Presión en la línea venosa antes de la bomba. Debe ser ligeramente negativa. Presiones muy negativas (ej. < -50 mmHg) indican 'chattering' o colapso de la vena por hipovolemia o malposición de la cánula.",
    ],
    keyPoints: [
      "Caída de flujo a mismas RPM = problema de pre-carga (hipovolemia).",
      "El 'Sweep Gas' controla el CO₂; el Flujo de Bomba controla el O₂.",
      "Aumento del gradiente trans-membrana = trombosis del oxigenador.",
      "Presión de drenaje muy negativa = hipovolemia o problema de cánula.",
    ],
    references: ["ELSO General Guidelines for all ECLS Cases (2021)"],
  },

  // ===== COMPLICACIONES =====
  {
    id: "complications",
    title: "Complicaciones del ECMO",
    category: "complications",
    summary:
      "Canulación, técnicas, trombosis, hemorragia, hemólisis, infecciones y falla renal.",
    content: [
      "**Canulación (ELSO: 6%)**: Debe realizarse por operador experto con ecografía o fluoroscopia. Complicaciones potencialmente mortales — disponer de hemoderivados. Fijación adecuada para evitar migración. Riesgo de embolia aérea.",
      "**Técnica (ELSO: 10%)**: Fallos del oxigenador o circuito. Las membranas PMP modernas han reducido fugas de plasma y ruptura de tubería.",
      "**Trombosis y hemorragia (3.8% sangrado intracerebral en VV)**: Hemólisis mínima en VV. Activación y destrucción plaquetaria. 10 eventos hemorrágicos por cada 100 días de ECMO. Sitios: tórax, sitio de cánulas, tracto GI.",
      "**Hemólisis (5-18%)**: Hb libre de plasma > 100 mg/L asociada a mayor mortalidad (32%).",
      "**Insuficiencia renal aguda (33-55.6%)**: Sin diferencia por tipo de canulación. Prevalencia de hemodiálisis post-ECMO VA: 28-52%.",
      "**Infecciones**: Infección sanguínea: 3-18% (2.98-20.55 episodios/1000 días ECMO). Infección respiratoria: 24.4 episodios/1000 días ECMO. ITU: 1-2%.",
      "**SIRS post-decanulación (30%)**: Factores de riesgo: edad > 60, mayor duración de ECMO, infección.",
      "**Isquemia de extremidades (VA)**: 20-30% complicaciones vasculares, isquemia en 40%. Canulación femoral requiere cánula de perfusión distal.",
    ],
    keyPoints: [
      "Canulación: siempre por experto con imagen",
      "Sangrado intracerebral: complicación más temida (3.8%)",
      "IRA muy frecuente: 33-55% de los pacientes",
      "Cánula de perfusión distal obligatoria en femoral",
      "Inspección visual del circuito diaria",
    ],
  },

  // ===== COVID-19 =====
  {
    id: "ecmo-covid",
    title: "ECMO y COVID-19",
    category: "covid",
    summary:
      "Guías ELSO para manejo con ECMO en pacientes con SARS-CoV-2 y falla cardiorrespiratoria severa.",
    content: [
      "La pandemia COVID-19 ocurrió con infraestructura ECMO más evolucionada y mayor evidencia de eficacia y seguridad en SDRA.",
      "**Recomendaciones ELSO para COVID-19**:",
      "1. ECMO debe considerarse caso a caso según recursos disponibles del hospital",
      "2. ECPR: solo en centros experimentados. Riesgo de contaminación del personal",
      "3. ECMO para indicaciones habituales: restringir según recursos",
      "4. **Prioridad**: Pacientes con pocas comorbilidades. TRABAJADORES DE LA SALUD SON ALTA PRIORIDAD",
      "5. **Exclusiones**: Enfermedad terminal, daño SNC, DNR, VM > 7 días, comorbilidades avanzadas",
      "6. **Futilidad**: Si no hay recuperación en ~21 días → considerar discontinuar",
      "7. **Falla cardíaca**: Evaluación ecocardiográfica seriada. Soporte VA o VAV puede indicarse",
      "**Abordaje**: VV como primera línea. Se ha reportado afección miocárdrica directa (miocarditis, eventos coronarios) — considerar introductor arterial femoral para potencial conversión a VA o VAV.",
    ],
    keyPoints: [
      "ECMO VV como primera línea en COVID-19",
      "Trabajadores de salud: alta prioridad",
      "Futilidad: reevaluar si no mejora en 21 días",
      "Afección miocárdica directa: preparar para conversión VA/VAV",
      "Control estricto de infecciones y EPP",
    ],
    references: [
      "ELSO Guidance Document: ECMO for COVID-19 Patients with Severe Cardiopulmonary Failure",
      "Lima Linares R. ECMO y COVID-19. Rev Chil Anest 2020;49:343-347",
      "Ramanathan K et al. Lancet Respir Med 2020",
    ],
  },

  // ===== DESTETE =====
  {
    id: "weaning-ecmo",
    title: "Destete del ECMO",
    category: "weaning",
    summary:
      "Criterios y proceso de retirada progresiva del soporte extracorpóreo.",
    content: [
      "**ECMO VV — Criterios para inicio de destete**:",
      "• Mejoría de la compliance pulmonar",
      "• Mejoría radiológica",
      "• PaO₂/FiO₂ > 200 con parámetros ventilatorios moderados",
      "• FiO₂ del ECMO reducida a < 50% manteniendo SatO₂ adecuada",
      "**Proceso VV**: Reducir progresivamente el flujo de gas (sweep gas) y la FiO₂ del ECMO. Si tolera sweep gas mínimo (1 L/min) por 6-24h con gasometría aceptable → considerar decanulación.",
      "**ECMO VA — Criterios**:",
      "• Recuperación de contractilidad (aumento de presión de pulso)",
      "• Ecocardiografía: FEVI > 20-25%, ITV Ao > 10 cm",
      "• Mejoría de parámetros hemodinámicos con reducción de flujo",
      "**Proceso VA**: Reducir flujo gradualmente (0.5-1 L/min cada 6-12h). Evaluar tolerancia hemodinámica. Flujo mínimo ~1-1.5 L/min (no inferior por riesgo de trombosis). Si tolera flujo mínimo por 2-6h → decanulación.",
      "**Post-decanulación**: Vigilar SRIS (30% de casos). Seguimiento ecocardiográfico. Control de hemostasia y sitios de canulación.",
    ],
    keyPoints: [
      "VV: reducir sweep gas progresivamente — prueba con mínimo",
      "VA: no reducir flujo < 1-1.5 L/min (trombosis)",
      "Presión de pulso creciente = signo de recuperación",
      "30% SRIS post-decanulación",
      "Nunca apresurar: evaluar sistemáticamente",
    ],
  },
];

export const sdraAlgorithm = {
  title: "Algoritmo de Manejo SDRA → ECMO",
  steps: [
    {
      label: "Tratar la causa del SDRA",
      description:
        "Identificar y tratar etiología. Diuresis o resucitación apropiada.",
    },
    {
      label: "Ventilación protectora",
      description:
        "Vt 6 ml/kg peso predicho, Pplat ≤ 30 cmH₂O, PEEP según tabla.",
    },
    {
      label: "Evaluar PaO₂/FiO₂",
      description:
        "Si PaFiO₂ < 150 mmHg → continuar. Si > 150 → mantener tratamiento.",
    },
    {
      label: "Posición prono + BNM",
      description:
        "Altamente recomendado si PaFiO₂ < 150. Considerar PEEP alto y vasodilatadores pulmonares inhalados.",
    },
    {
      label: "Evaluar criterios ECMO",
      description:
        "PaFi < 80 por 6h, PaFi < 50 por 3h, o pH < 7.25 con PaCO₂ > 60 por 6h.",
    },
    {
      label: "Iniciar ECMO VV",
      description:
        "Activar ECMO team. No demorar inicio. Considerar activar logística desde PaFiO₂ ≈ 100 o indicación de prono.",
    },
  ],
};
