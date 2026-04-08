const deHaroThesisFig1DC =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/deharo-thesis-fig1-doble-ciclado_542988ea.jpg";
const autoTriggerFig4 =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/auto-trigger-fig4_9015d5b5.png";
const deHaroThesisFig2RT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/deharo-thesis-fig2-trigger-reverso_d14f8021.jpg";
const deHaroThesisFig3IE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/deharo-thesis-fig3-esfuerzos-inefectivos_009fd04a.jpg";
const mallatFig3FlowStarvation =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/mallat2021-fig3-flow-starvation_9794c2bc.jpg";
const mallatFig4PrematureCycling =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/mallat2021-fig4-premature-cycling_cd60ba61.jpg";
const mallatFig5DelayedCycling =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/mallat2021-fig5-delayed-cycling_babc761c.jpg";

const nivInterfacesImg = "";
const nivModesImg = "";

export interface VentilationMode {
  id: string;
  name: string;
  fullName: string;
  category: "controlled" | "assisted" | "spontaneous" | "hybrid";
  description: string;
  mechanism: string;
  indications: string[];
  advantages: string[];
  disadvantages: string[];
  keyParameters: string[];
  icon: string;
}

export interface VentilationParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  definition: string;
  clinicalRelevance: string;
  formula?: string;
}

export interface Asynchrony {
  id: string;
  name: string;
  definition: string;
  mechanism: string;
  identification: string;
  curvePattern: string;
  management: string[];
  clinicalImpact: string;
  icon: string;
  image?: string;
}

// Real clinical waveforms from published papers (Open Access)
// de Haro C. Tesis Doctoral UAB 2019 (CC0) - Asincronías paciente-ventilador

// Mallat J et al. J Clin Med 2021;10(19):4550 (CC BY 4.0) - PMC8509510

export const ventilationModes: VentilationMode[] = [
  {
    id: "vcv",
    name: "VCV",
    fullName: "Ventilación Controlada por Volumen",
    category: "controlled",
    description:
      "Modo en el que el ventilador entrega un volumen corriente predeterminado en cada ciclo respiratorio, con flujo y tiempo inspiratorio fijos.",
    mechanism:
      "El ventilador genera un flujo inspiratorio constante (onda cuadrada) o decelerado hasta alcanzar el volumen corriente programado. La presión en la vía aérea es variable y depende de la compliance y resistencia del sistema respiratorio.",
    indications: [
      "SDRA",
      "Paciente sin esfuerzo respiratorio",
      "Necesidad de control estricto de volumen",
      "Postoperatorio inmediato",
    ],
    advantages: [
      "Volumen corriente garantizado",
      "Permite monitorizar cambios en mecánica respiratoria",
      "Fácil de programar",
    ],
    disadvantages: [
      "Riesgo de barotrauma si aumenta resistencia/disminuye compliance",
      "Puede generar asincronías",
      "No se adapta a demanda del paciente",
    ],
    keyParameters: [
      "Volumen corriente",
      "Frecuencia respiratoria",
      "Flujo inspiratorio",
      "PEEP",
      "FiO2",
    ],
    icon: "📊",
  },
  {
    id: "pcv",
    name: "PCV",
    fullName: "Ventilación Controlada por Presión",
    category: "controlled",
    description:
      "Modo en el que el ventilador entrega una presión inspiratoria constante durante un tiempo inspiratorio definido. El volumen resultante depende de la mecánica pulmonar.",
    mechanism:
      "El ventilador aplica una presión constante durante la inspiración, generando un flujo decelerado que se adapta a la mecánica del paciente. El volumen corriente es variable.",
    indications: [
      "SDRA",
      "Fístula broncopleural",
      "Riesgo de barotrauma",
      "Neonatos y pediátricos",
    ],
    advantages: [
      "Limita presión en vía aérea",
      "Flujo decelerado mejora distribución de gas",
      "Mejor sincronía paciente-ventilador",
    ],
    disadvantages: [
      "Volumen corriente no garantizado",
      "Requiere monitorización estrecha",
      "Cambios en mecánica alteran ventilación",
    ],
    keyParameters: [
      "Presión inspiratoria",
      "Tiempo inspiratorio",
      "Frecuencia respiratoria",
      "PEEP",
      "FiO2",
    ],
    icon: "📈",
  },
  {
    id: "psv",
    name: "PSV",
    fullName: "Ventilación con Presión de Soporte",
    category: "spontaneous",
    description:
      "Modo espontáneo en el que cada esfuerzo inspiratorio del paciente es asistido con una presión de soporte predeterminada. El paciente controla frecuencia, tiempo inspiratorio y volumen.",
    mechanism:
      "Al detectar el esfuerzo inspiratorio del paciente, el ventilador aplica una presión constante de soporte. El ciclado a espiración ocurre cuando el flujo inspiratorio cae a un porcentaje del flujo pico.",
    indications: [
      "Weaning",
      "Paciente con drive respiratorio preservado",
      "Ventilación no invasiva",
      "Transición de modos controlados",
    ],
    advantages: [
      "Mejor sincronía",
      "Menor sedación requerida",
      "Previene atrofia diafragmática",
      "Confort del paciente",
    ],
    disadvantages: [
      "Requiere esfuerzo respiratorio",
      "Volumen variable",
      "Riesgo de hipoventilación si soporte insuficiente",
    ],
    keyParameters: [
      "Presión de soporte",
      "PEEP",
      "FiO2",
      "Sensibilidad de trigger",
      "Criterio de ciclado",
    ],
    icon: "🫁",
  },
  {
    id: "simv",
    name: "SIMV",
    fullName: "Ventilación Mandatoria Intermitente Sincronizada",
    category: "hybrid",
    description:
      "Modo que combina ciclos mandatorios (controlados) sincronizados con el esfuerzo del paciente, permitiendo respiraciones espontáneas entre los ciclos mandatorios.",
    mechanism:
      "El ventilador entrega un número fijo de respiraciones mandatorias sincronizadas con el trigger del paciente. Entre ciclos mandatorios, el paciente puede respirar espontáneamente con o sin presión de soporte.",
    indications: [
      "Weaning gradual",
      "Transición de ventilación controlada",
      "Paciente con esfuerzo respiratorio parcial",
    ],
    advantages: [
      "Permite respiración espontánea",
      "Transición gradual al destete",
      "Reduce riesgo de atrofia diafragmática",
    ],
    disadvantages: [
      "Puede aumentar trabajo respiratorio",
      "Asincronías frecuentes",
      "Destete más lento que PSV",
    ],
    keyParameters: [
      "Frecuencia mandatoria",
      "Volumen corriente o presión",
      "PEEP",
      "FiO2",
      "Presión de soporte para espontáneas",
    ],
    icon: "🔄",
  },
  {
    id: "cpap",
    name: "CPAP",
    fullName: "Presión Positiva Continua en la Vía Aérea",
    category: "spontaneous",
    description:
      "Modo completamente espontáneo que mantiene una presión positiva constante durante todo el ciclo respiratorio. No entrega ciclos mandatorios.",
    mechanism:
      "El ventilador mantiene una presión positiva constante (equivalente a PEEP) en la vía aérea. El paciente genera todo el trabajo respiratorio. Puede usarse con o sin presión de soporte adicional.",
    indications: [
      "Prueba de ventilación espontánea",
      "Apnea obstructiva del sueño",
      "Edema pulmonar cardiogénico",
      "Post-extubación",
    ],
    advantages: [
      "Mejora capacidad residual funcional",
      "Reduce trabajo respiratorio",
      "Previene atelectasias",
      "Simple de usar",
    ],
    disadvantages: [
      "Requiere drive respiratorio intacto",
      "No garantiza ventilación",
      "Puede reducir retorno venoso",
    ],
    keyParameters: ["CPAP/PEEP", "FiO2"],
    icon: "💨",
  },
  {
    id: "aprv",
    name: "APRV",
    fullName: "Ventilación con Liberación de Presión en la Vía Aérea",
    category: "hybrid",
    description:
      "Modo que mantiene una presión alta (P-high) durante un tiempo prolongado (T-high), con liberaciones breves a una presión baja (P-low) durante un tiempo corto (T-low).",
    mechanism:
      "Se mantiene reclutamiento alveolar con P-high sostenida. Las liberaciones breves a P-low permiten la eliminación de CO2. El paciente puede respirar espontáneamente sobre P-high, mejorando la ventilación-perfusión.",
    indications: [
      "SDRA moderado-severo",
      "Necesidad de reclutamiento alveolar sostenido",
      "Fracaso de ventilación convencional",
    ],
    advantages: [
      "Reclutamiento alveolar sostenido",
      "Permite respiración espontánea",
      "Menor sedación",
      "Mejora relación V/Q",
    ],
    disadvantages: [
      "Curva de aprendizaje",
      "Difícil de ajustar",
      "Riesgo de atrapamiento aéreo",
      "Monitorización compleja",
    ],
    keyParameters: ["P-high", "P-low", "T-high", "T-low", "FiO2"],
    icon: "⚡",
  },
];

export const ventilationParameters: VentilationParameter[] = [
  {
    id: "peep",
    name: "PEEP",
    unit: "cmH₂O",
    normalRange: "5-20",
    definition:
      "Presión positiva al final de la espiración que previene el colapso alveolar y mejora la oxigenación.",
    clinicalRelevance:
      "Recluta alvéolos colapsados, mejora la CRF y la oxigenación. PEEP excesiva puede causar sobredistensión y compromiso hemodinámico.",
  },
  {
    id: "fio2",
    name: "FiO₂",
    unit: "%",
    normalRange: "21-100",
    definition:
      "Fracción inspirada de oxígeno. Concentración de oxígeno en la mezcla de gas inspirado.",
    clinicalRelevance:
      "Objetivo: mantener SpO₂ 88-95% en SDRA, >94% en otras condiciones. FiO₂ elevada prolongada causa toxicidad por oxígeno.",
  },
  {
    id: "vt",
    name: "Volumen Corriente",
    unit: "mL",
    normalRange: "6-8 mL/kg peso ideal",
    definition: "Volumen de gas entregado en cada ciclo respiratorio.",
    clinicalRelevance:
      "Ventilación protectora: 6-8 mL/kg de peso ideal. Volúmenes altos causan volutrauma y biotrauma.",
    formula:
      "Peso ideal (hombres) = 50 + 0.91 × (talla cm - 152.4)\nPeso ideal (mujeres) = 45.5 + 0.91 × (talla cm - 152.4)",
  },
  {
    id: "rr",
    name: "Frecuencia Respiratoria",
    unit: "rpm",
    normalRange: "12-20",
    definition:
      "Número de ciclos respiratorios por minuto programados en el ventilador.",
    clinicalRelevance:
      "Determina la ventilación minuto junto con el Vt. Ajustar según PaCO₂ y pH objetivo.",
  },
  {
    id: "ppeak",
    name: "Presión Pico",
    unit: "cmH₂O",
    normalRange: "< 40",
    definition:
      "Presión máxima alcanzada durante la inspiración. Incluye componente resistivo y elástico.",
    clinicalRelevance:
      "Refleja la presión total del sistema. Diferencia con Pplateau indica componente resistivo. Presiones pico elevadas sugieren aumento de resistencia.",
  },
  {
    id: "pplat",
    name: "Presión Plateau",
    unit: "cmH₂O",
    normalRange: "< 30",
    definition:
      "Presión medida durante una pausa inspiratoria. Refleja la presión alveolar sin componente de flujo.",
    clinicalRelevance:
      "Indicador de presión alveolar y riesgo de barotrauma. Mantener < 30 cmH₂O para ventilación protectora.",
  },
  {
    id: "dp",
    name: "Driving Pressure",
    unit: "cmH₂O",
    normalRange: "< 15",
    definition:
      "Diferencia entre presión plateau y PEEP. Representa la presión de distensión alveolar.",
    clinicalRelevance:
      "Principal determinante de mortalidad en SDRA. Refleja el estrés mecánico sobre el pulmón funcional (baby lung). Mantener < 15 cmH₂O.",
    formula: "DP = Pplateau - PEEP",
  },
  {
    id: "compliance",
    name: "Compliance",
    unit: "mL/cmH₂O",
    normalRange: "50-80 (estática)",
    definition:
      "Distensibilidad del sistema respiratorio. Relación entre cambio de volumen y cambio de presión.",
    clinicalRelevance:
      "Compliance disminuida: SDRA, edema pulmonar, fibrosis, atelectasia. Compliance aumentada: enfisema. Monitorizar tendencia para evaluar respuesta al tratamiento.",
    formula: "Cst = Vt / (Pplateau - PEEP)",
  },
  {
    id: "resistance",
    name: "Resistencia",
    unit: "cmH₂O/L/s",
    normalRange: "5-10",
    definition:
      "Oposición al flujo de gas en las vías aéreas. Depende del calibre de la vía aérea y del tubo endotraqueal.",
    clinicalRelevance:
      "Resistencia aumentada: broncoespasmo, secreciones, tubo estrecho. Se calcula como diferencia entre Ppico y Pplateau dividida por el flujo.",
    formula: "R = (Ppico - Pplateau) / Flujo",
  },
];

export const asynchronies: Asynchrony[] = [
  {
    id: "ineffective-trigger",
    name: "Trigger Inefectivo",
    definition:
      "El esfuerzo inspiratorio del paciente no logra activar el ventilador. Hay esfuerzo muscular sin respuesta del ventilador.",
    mechanism:
      "Esfuerzo inspiratorio insuficiente para alcanzar el umbral de trigger, generalmente por hiperinsuflación dinámica (auto-PEEP), soporte excesivo o debilidad muscular.",
    identification:
      "Deflexión en la curva de presión o flujo que no genera un ciclo ventilatorio. Se observa una caída de presión en la curva de vía aérea sin ciclo subsecuente.",
    curvePattern:
      "Pequeña deflexión negativa en la curva de presión sin ciclo inspiratorio correspondiente. En la curva de flujo, se observa una perturbación durante la fase espiratoria.",
    management: [
      "Reducir nivel de soporte",
      "Ajustar sensibilidad de trigger",
      "Aplicar PEEP externa para contrarrestar auto-PEEP",
      "Reducir sedación",
    ],
    clinicalImpact:
      "Aumenta trabajo respiratorio, prolonga ventilación mecánica, genera fatiga muscular y dificultad para el weaning.",
    icon: "⚠️",
    image: deHaroThesisFig3IE,
  },
  {
    id: "auto-trigger",
    name: "Auto-trigger",
    definition:
      "El ventilador inicia un ciclo inspiratorio sin esfuerzo del paciente. La máquina se dispara por artefactos.",
    mechanism:
      "Sensibilidad de trigger excesiva, oscilaciones cardíacas transmitidas, condensación en el circuito, fugas en el sistema.",
    identification:
      "Ciclos ventilatorios que no coinciden con esfuerzo del paciente. Frecuencia respiratoria mayor a la esperada. Ausencia de deflexión de presión previa al ciclo.",
    curvePattern:
      "Ciclos que se inician sin deflexión negativa previa en la curva de presión. Pueden coincidir con el latido cardíaco.",
    management: [
      "Reducir sensibilidad de trigger",
      "Drenar condensación del circuito",
      "Verificar fugas",
      "Evaluar oscilaciones cardíacas",
    ],
    clinicalImpact:
      "Hiperventilación, alcalosis respiratoria, atrapamiento aéreo, hiperinsuflación dinámica.",
    icon: "🔴",
    image: autoTriggerFig4,
  },
  {
    id: "double-trigger",
    name: "Doble Trigger",
    definition:
      "Dos ciclos ventilatorios consecutivos separados por un tiempo espiratorio muy breve, generados por un único esfuerzo del paciente.",
    mechanism:
      "El esfuerzo inspiratorio del paciente continúa después de que el ventilador ha ciclado a espiración. Tiempo inspiratorio neural mayor que el mecánico.",
    identification:
      "Dos ciclos seguidos con espiración mínima entre ellos. El segundo ciclo se inicia inmediatamente después del primero.",
    curvePattern:
      "Dos ondas de presión y flujo consecutivas con fase espiratoria muy corta o ausente entre ellas. Volumen entregado es aproximadamente el doble del programado.",
    management: [
      "Aumentar tiempo inspiratorio",
      "Aumentar volumen corriente",
      "Ajustar criterio de ciclado",
      "Evaluar drive respiratorio",
    ],
    clinicalImpact:
      "Volumen corriente entregado duplicado, riesgo de volutrauma, presiones elevadas, lesión pulmonar inducida por ventilador.",
    icon: "⏩",
    image: deHaroThesisFig1DC,
  },
  {
    id: "premature-cycling",
    name: "Ciclado Precoz",
    definition:
      "El ventilador termina la inspiración antes de que el paciente haya completado su esfuerzo inspiratorio neural.",
    mechanism:
      "El criterio de ciclado (porcentaje de flujo pico) se alcanza antes de que termine el esfuerzo del paciente. Tiempo inspiratorio mecánico menor que el neural.",
    identification:
      "El paciente continúa el esfuerzo inspiratorio durante la fase espiratoria. Se observa contracción del diafragma durante la espiración temprana.",
    curvePattern:
      "Perturbación en la fase espiratoria temprana de la curva de flujo. Posible segundo esfuerzo inspiratorio visible en la curva de presión.",
    management: [
      "Reducir criterio de ciclado",
      "Aumentar tiempo inspiratorio",
      "Evaluar constante de tiempo del sistema",
    ],
    clinicalImpact:
      "Insatisfacción del paciente, aumento del trabajo respiratorio, posible doble trigger secundario.",
    icon: "⏪",
    image: mallatFig4PrematureCycling,
  },
  {
    id: "delayed-cycling",
    name: "Ciclado Tardío",
    definition:
      "El ventilador continúa la inspiración después de que el paciente ha terminado su esfuerzo inspiratorio neural.",
    mechanism:
      "El criterio de ciclado se alcanza después de que el esfuerzo del paciente ha cesado. Frecuente con constantes de tiempo prolongadas (EPOC).",
    identification:
      "El paciente activa los músculos espiratorios mientras el ventilador aún entrega flujo inspiratorio. Se puede observar contracción abdominal activa.",
    curvePattern:
      "Pico de presión al final de la inspiración (esfuerzo espiratorio contra flujo inspiratorio). Flujo inspiratorio que se mantiene después del pico de presión.",
    management: [
      "Aumentar criterio de ciclado",
      "Reducir tiempo inspiratorio",
      "Evaluar presencia de auto-PEEP",
    ],
    clinicalImpact:
      "Incomodidad, contracción muscular espiratoria activa, riesgo de atrapamiento aéreo.",
    icon: "⏳",
    image: mallatFig5DelayedCycling,
  },
  {
    id: "flow-starvation",
    name: "Flow Starvation",
    definition:
      "El flujo inspiratorio entregado por el ventilador es insuficiente para satisfacer la demanda del paciente.",
    mechanism:
      "En VCV con flujo fijo, si la demanda del paciente supera el flujo programado, se genera presión negativa en la vía aérea durante la inspiración.",
    identification:
      "Concavidad en la fase inspiratoria de la curva de presión-tiempo (aspecto cóncavo o 'scooped'). El paciente muestra signos de esfuerzo respiratorio aumentado.",
    curvePattern:
      "Curva de presión con forma cóncava durante la inspiración en lugar de la forma convexa normal. El flujo alcanza el valor programado pero no satisface la demanda.",
    management: [
      "Aumentar flujo inspiratorio",
      "Cambiar a modo controlado por presión",
      "Evaluar causa del aumento de demanda",
      "Ajustar sedación",
    ],
    clinicalImpact:
      "Aumento del trabajo respiratorio, disconfort, fatiga muscular respiratoria, dificultad para el destete.",
    icon: "🌊",
    image: mallatFig3FlowStarvation,
  },
  {
    id: "reverse-trigger",
    name: "Trigger Reverso",
    definition:
      "Contracción diafragmática inducida por la insuflación mecánica del ventilador, en lugar de ser iniciada por el centro respiratorio del paciente.",
    mechanism:
      "La insuflación mecánica activa un arco reflejo que provoca contracción diafragmática secundaria. Se observa especialmente en pacientes con sedación profunda o con acoplamiento neural alterado.",
    identification:
      "El esfuerzo del paciente aparece DESPUÉS del inicio del ciclo mecánico, no antes. Se detecta con monitorización de presión esofágica o actividad eléctrica diafragmática (Edi).",
    curvePattern:
      "Deflexión en la curva de presión o perturbación en la curva de flujo que ocurre durante o al final de la fase inspiratoria mecánica, indicando contracción muscular tardía respecto al ciclo del ventilador.",
    management: [
      "Ajustar nivel de sedación",
      "Modificar frecuencia respiratoria programada",
      "Evaluar acoplamiento neuromecánico",
      "Considerar ventilación asistida si hay drive respiratorio",
    ],
    clinicalImpact:
      "Puede generar doble trigger secundario, breath stacking, volutrauma y aumento de presiones transpulmonares. Asociado a mayor duración de ventilación mecánica.",
    icon: "🔄",
    image: deHaroThesisFig2RT,
  },
];

export interface WeaningCriteria {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  method?: string;
  formula?: string;
}

export const weaningData: WeaningCriteria[] = [
  {
    id: "readiness",
    name: "Criterios de Preparación para Destete",
    description:
      "Evaluación de requisitos mínimos para iniciar la desconexión de la ventilación mecánica.",
    criteria: [
      "Resolución o mejoría de la causa que motivó la VM",
      "PaO₂/FiO₂ > 150-200",
      "PEEP ≤ 8 cmH₂O",
      "FiO₂ ≤ 0.40",
      "Estabilidad hemodinámica (sin vasopresores o dosis bajas)",
      "Nivel de conciencia adecuado (GCS ≥ 8)",
      "Temperatura < 38.5°C",
      "Hemoglobina > 7-8 g/dL",
      "Electrolitos corregidos",
      "Tos eficaz y manejo de secreciones",
      "Sin cirugía planificada en las próximas 24h",
    ],
  },
  {
    id: "sbt",
    name: "Prueba de Ventilación Espontánea (SBT)",
    description:
      "Test que evalúa la capacidad del paciente de mantener ventilación adecuada sin soporte significativo.",
    criteria: [
      "Duración: 30-120 minutos",
      "Modalidades: tubo T, CPAP 5 cmH₂O, o PSV 5-8 cmH₂O",
      "Monitorizar: FR, Vt, SpO₂, FC, PA, signos de distrés",
    ],
    method:
      "Reducir soporte ventilatorio a nivel mínimo y evaluar tolerancia del paciente durante 30-120 minutos. Criterios de fracaso: FR > 35 rpm, SpO₂ < 90%, FC > 140 o cambio > 20%, PA sistólica > 180 o < 90, agitación, diaforesis, uso de músculos accesorios.",
  },
  {
    id: "tobin",
    name: "Índice de Tobin (RSBI)",
    description:
      "Rapid Shallow Breathing Index. Relación entre frecuencia respiratoria y volumen corriente durante respiración espontánea.",
    criteria: [
      "RSBI < 105: alta probabilidad de éxito en destete",
      "RSBI > 105: alto riesgo de fracaso",
      "Medir durante 1 minuto de respiración espontánea",
    ],
    formula: "RSBI = FR (rpm) / Vt (L)",
    method:
      "Desconectar al paciente del ventilador durante 1 minuto. Medir frecuencia respiratoria y volumen corriente en litros. Calcular el cociente. Valores < 105 predicen éxito de extubación con sensibilidad del 97%.",
  },
  {
    id: "diaphragm-us",
    name: "Ecografía Diafragmática",
    description:
      "Evaluación ecográfica de la función diafragmática como predictor de éxito en el destete ventilatorio.",
    criteria: [
      "Excursión diafragmática > 10-14 mm durante respiración espontánea",
      "Fracción de engrosamiento diafragmático (DTF) > 30-36%",
      "DTF = (grosor al final de inspiración - grosor al final de espiración) / grosor al final de espiración × 100",
      "Evaluación en modo M o modo B en zona de aposición",
    ],
    method:
      "Sonda lineal en zona de aposición (línea axilar media, 8°-9° espacio intercostal). Medir grosor diafragmático al final de inspiración y espiración. Para excursión: sonda convexa subcostal en modo M.",
  },
  {
    id: "lus-weaning",
    name: "LUS Score en Weaning",
    description:
      "Uso del score de ultrasonido pulmonar para predecir el resultado del destete ventilatorio.",
    criteria: [
      "LUS score < 13-17: mayor probabilidad de éxito en extubación",
      "LUS score elevado: mayor riesgo de re-intubación por edema post-extubación",
      "Evaluación pre y post SBT permite detectar pérdida de aireación",
      "Diferencia de LUS score pre-post SBT > 4: sugiere fracaso",
    ],
    method:
      "Realizar LUS score de 12 zonas antes y al final de la prueba de ventilación espontánea. Un aumento significativo del score sugiere desreclutamiento y mayor riesgo de fracaso.",
  },
];

export interface NIVTopic {
  id: string;
  title: string;
  summary: string;
  content: string[];
  keyPoints: string[];
  image?: string;
}

export const nivTopics: NIVTopic[] = [
  {
    id: "niv-definition",
    title: "Definición y Objetivos de la VNI",
    summary:
      "Soporte ventilatorio sin vía aérea artificial (tubo endotraqueal o traqueostomía).",
    content: [
      "La Ventilación No Invasiva (VNI) es una técnica de soporte ventilatorio que no requiere una vía aérea artificial. Se administra a través de una mascarilla (nasal, facial, oronasal) o un casco (helmet).",
      "Sus objetivos principales son: reducir el trabajo respiratorio, mejorar el intercambio gaseoso, evitar la intubación orotraqueal y sus complicaciones, y aumentar el confort del paciente.",
    ],
    keyPoints: [
      "Reduce el trabajo respiratorio",
      "Mejora la oxigenación y la ventilación",
      "Evita las complicaciones asociadas a la intubación",
      "Requiere colaboración del paciente",
    ],
  },
  {
    id: "niv-interfaces",
    title: "Interfaces de VNI",
    summary: "Mascarillas (nasal, oronasal, facial total) y casco (helmet).",
    content: [
      "La elección de la interfaz es clave para el éxito de la VNI. Debe ser cómoda y sellar bien para evitar fugas.",
      "**Mascarilla Oronasal (Full-face):** La más usada en insuficiencia respiratoria aguda. Cubre nariz y boca. Mayor riesgo de aspiración y claustrofobia.",
      "**Mascarilla Nasal:** Cubre solo la nariz. Mejor tolerada, permite hablar y comer. Las fugas por la boca son un problema común.",
      "**Casco (Helmet):** Cubre toda la cabeza. Mejor tolerado en uso prolongado (>48h), menos lesiones cutáneas, pero genera más espacio muerto y ruido.",
    ],
    keyPoints: [
      "Oronasal: la más común en patología aguda",
      "Nasal: más cómoda, pero con riesgo de fuga oral",
      "Helmet: ideal para uso prolongado, menos lesiones cutáneas",
    ],
    image: nivInterfacesImg,
  },
  {
    id: "niv-modes",
    title: "Modos Ventilatorios en VNI (CPAP y BiPAP)",
    summary:
      "CPAP para oxigenación y BiPAP (PSV+PEEP) para soporte ventilatorio.",
    content: [
      "Los dos modos principales en VNI son CPAP y BiPAP (o S/T).",
      "**CPAP (Continuous Positive Airway Pressure):** Aplica una presión positiva constante durante todo el ciclo respiratorio. No asiste la inspiración, solo mantiene la vía aérea abierta. Es excelente para mejorar la oxigenación (aumenta CRF) y es la primera línea en Edema Agudo de Pulmón Cardiogénico.",
      "**BiPAP (Bilevel Positive Airway Pressure) / Modo S/T (Spontaneous/Timed):** Aplica dos niveles de presión: una presión inspiratoria (IPAP) y una espiratoria (EPAP). La diferencia entre IPAP y EPAP es la Presión de Soporte (PS), que ayuda a 'lavar' CO₂. Es el modo de elección para insuficiencia respiratoria hipercápnica (EPOC exacerbado).",
    ],
    keyPoints: [
      "CPAP: Presión única. Ideal para fallo hipoxémico (EAPC).",
      "BiPAP: Dos presiones (IPAP/EPAP). Ideal para fallo hipercápnico (EPOC).",
      "IPAP - EPAP = Presión de Soporte (ayuda a ventilar).",
      "EPAP = PEEP (mejora oxigenación y recluta alvéolos).",
    ],
    image: nivModesImg,
  },
  {
    id: "niv-indications",
    title: "Indicaciones de la VNI",
    summary:
      "EPOC exacerbado, Edema Agudo de Pulmón Cardiogénico, e Insuficiencia Respiratoria en Inmunosuprimidos.",
    content: [
      "La VNI tiene evidencia sólida en patologías específicas:",
      "**EPOC Exacerbado con Acidosis Respiratoria (pH < 7.35):** Indicación con mayor evidencia. Reduce necesidad de intubación y mortalidad.",
      "**Edema Agudo de Pulmón Cardiogénico (EAPC):** Reduce el trabajo respiratorio y mejora la oxigenación rápidamente. CPAP es a menudo la primera opción.",
      "**Insuficiencia Respiratoria Hipoxémica en Inmunosuprimidos:** Reduce la mortalidad al evitar las complicaciones infecciosas de la intubación.",
      "**Insuficiencia Respiratoria Post-extubación:** Útil para prevenir el fallo de la extubación en pacientes de alto riesgo (ej. hipercápnicos).",
    ],
    keyPoints: [
      "EPOC exacerbado (pH < 7.35): Nivel de evidencia 1A",
      "EAPC: CPAP o BiPAP para reducir trabajo respiratorio",
      "Inmunosuprimidos: evita infecciones asociadas a IOT",
      "Post-extubación: previene fallo en pacientes de riesgo",
    ],
  },
  {
    id: "niv-contraindications",
    title: "Contraindicaciones de la VNI",
    summary:
      "Paro cardíaco, incapacidad para proteger vía aérea, y trauma facial severo son contraindicaciones absolutas.",
    content: [
      "**Contraindicaciones Absolutas:**",
      "• Paro cardiorrespiratorio.",
      "• Incapacidad para proteger la vía aérea (coma, GCS < 8, riesgo de aspiración masiva).",
      "• Secreciones abundantes o vómito activo.",
      "• Inestabilidad hemodinámica severa o arritmias malignas.",
      "• Trauma facial severo o cirugía facial reciente.",
      "• Obstrucción de la vía aérea superior.",
      "**Contraindicaciones Relativas:**",
      "• Agitación o falta de cooperación.",
      "• Obesidad mórbida extrema.",
      "• Cirugía esofágica o gástrica reciente.",
    ],
    keyPoints: [
      "La incapacidad para proteger la vía aérea es una contraindicación clave",
      "La inestabilidad hemodinámica severa requiere intubación",
      "La falta de cooperación del paciente es un factor de fracaso importante",
    ],
  },
  {
    id: "niv-failure-criteria",
    title: "Criterios de Fracaso de la VNI",
    summary:
      "Signos que indican que la VNI no es efectiva y se debe considerar la intubación.",
    content: [
      "El fracaso de la VNI se define como la necesidad de intubación orotraqueal tras un período de prueba. Es crucial identificarlo precozmente (en 1-2 horas) para evitar retrasar una intubación necesaria, lo que aumenta la mortalidad.",
      "**Criterios Clínicos:**",
      "• Empeoramiento del trabajo respiratorio (uso de musculatura accesoria, tiraje, respiración paradójica).",
      "• Taquipnea persistente o que empeora (FR > 35 rpm).",
      "• Agitación, ansiedad o disminución del nivel de conciencia (GCS < 8).",
      "• Incapacidad para manejar secreciones o aspiración.",
      "• Intolerancia a la interfaz (fugas masivas, disconfort severo).",
      "**Criterios Gasométricos:**",
      "• Empeoramiento de la hipoxemia (PaO₂/FiO₂ < 150 o SpO₂ < 90% con FiO₂ alta).",
      "• Empeoramiento o no mejoría de la acidosis respiratoria (pH < 7.25 persistente).",
      "**Criterios Hemodinámicos:**",
      "• Inestabilidad hemodinámica (hipotensión, necesidad de vasopresores a dosis altas).",
    ],
    keyPoints: [
      "El empeoramiento del estado neurológico es un signo de alarma.",
      "La no mejoría del pH y la PaCO₂ tras 1-2 horas es un fuerte predictor de fracaso.",
      "La intolerancia a la interfaz es una causa común de fracaso.",
      "Retrasar la intubación en un fracaso de VNI aumenta la mortalidad.",
    ],
  },
];
