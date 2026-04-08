export interface ShockProfile {
  id: string;
  type: string;
  name: string;
  description: string;
  hemodynamics: { parameter: string; value: string }[];
  ecoFindings: string[];
  examples: string[];
  management: string[];
  color: string;
}

export interface MonitoringParameter {
  id: string;
  name: string;
  abbreviation: string;
  normalRange: string;
  unit: string;
  interpretation: { range: string; meaning: string }[];
  clinicalUse: string;
}

export const shockProfiles: ShockProfile[] = [
  {
    id: "cardiogenic",
    type: "Cardiogénico",
    name: "Shock Cardiogénico",
    description:
      "Fallo de bomba cardíaca con incapacidad de mantener gasto cardíaco adecuado para la perfusión tisular.",
    hemodynamics: [
      { parameter: "GC/IC", value: "↓↓ (< 2.2 L/min/m²)" },
      { parameter: "PVC", value: "↑↑ (> 12 mmHg)" },
      { parameter: "PCP (wedge)", value: "↑↑ (> 18 mmHg)" },
      { parameter: "RVS", value: "↑↑ (> 1200 dyn)" },
      { parameter: "SvO₂", value: "↓↓ (< 60%)" },
      { parameter: "PAM", value: "↓ (< 65 mmHg)" },
    ],
    ecoFindings: [
      "FEVI disminuida (< 30-40%)",
      "Dilatación de cavidades izquierdas",
      "Hipoquinesia global o segmentaria",
      "VCI dilatada sin colapso inspiratorio",
      "Posible insuficiencia mitral funcional",
    ],
    examples: [
      "IAM extenso",
      "Miocarditis fulminante",
      "Cardiomiopatía descompensada",
      "Valvulopatía aguda",
    ],
    management: [
      "Inotrópicos (dobutamina, milrinona)",
      "Vasopresores si PAM < 65 (norepinefrina)",
      "BIAC / Impella / ECMO VA en refractarios",
      "Revascularización urgente si SCA",
    ],
    color: "text-red-400 border-red-500/30 bg-red-500/10",
  },
  {
    id: "distributive",
    type: "Distributivo",
    name: "Shock Distributivo (Séptico)",
    description:
      "Vasodilatación patológica con redistribución del flujo sanguíneo y disfunción microcirculatoria.",
    hemodynamics: [
      { parameter: "GC/IC", value: "↑ (hiperdinámico) o ↓ (tardío)" },
      { parameter: "PVC", value: "↓ o normal" },
      { parameter: "PCP (wedge)", value: "↓ o normal" },
      { parameter: "RVS", value: "↓↓ (< 800 dyn)" },
      { parameter: "SvO₂", value: "↑ (> 70%) o ↓ en tardío" },
      { parameter: "PAM", value: "↓↓ (< 65 mmHg)" },
    ],
    ecoFindings: [
      "FEVI normal o hiperdinámica (fase inicial)",
      "VCI colapsada (hipovolemia relativa)",
      "Posible disfunción VD en sepsis severa",
      "FEVI reducida en miocardiopatía séptica",
    ],
    examples: [
      "Sepsis / shock séptico",
      "Anafilaxia",
      "Crisis adrenal",
      "Shock neurogénico",
    ],
    management: [
      "Reanimación con cristaloides (30 ml/kg inicial)",
      "Norepinefrina como vasopresor de primera línea",
      "Vasopresina como segundo vasopresor",
      "Hidrocortisona si refractario a vasopresores",
      "ATB empírico precoz (< 1h) en sepsis",
    ],
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  },
  {
    id: "hypovolemic",
    type: "Hipovolémico",
    name: "Shock Hipovolémico",
    description:
      "Reducción del volumen intravascular con disminución de la precarga y el gasto cardíaco.",
    hemodynamics: [
      { parameter: "GC/IC", value: "↓↓" },
      { parameter: "PVC", value: "↓↓ (< 5 mmHg)" },
      { parameter: "PCP (wedge)", value: "↓↓ (< 8 mmHg)" },
      { parameter: "RVS", value: "↑↑" },
      { parameter: "SvO₂", value: "↓↓ (< 60%)" },
      { parameter: "PAM", value: "↓" },
    ],
    ecoFindings: [
      "VCI colapsada (< 1 cm) con colapso > 50%",
      "Cavidades 'vacías' (kissing walls)",
      "FEVI hiperdinámica (compensación)",
      "Sin derrame pericárdico/pleural significativo",
    ],
    examples: [
      "Hemorragia masiva",
      "Deshidratación severa",
      "Quemaduras extensas",
      "Tercer espacio",
    ],
    management: [
      "Control del sangrado (hemostasia quirúrgica/IR)",
      "Reposición de volumen (cristaloides + hemoderivados)",
      "Protocolo de transfusión masiva si aplica",
      "Ácido tranexámico en las primeras 3 horas",
    ],
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    id: "obstructive",
    type: "Obstructivo",
    name: "Shock Obstructivo",
    description:
      "Obstrucción mecánica al flujo sanguíneo que impide el llenado o vaciamiento cardíaco.",
    hemodynamics: [
      { parameter: "GC/IC", value: "↓↓" },
      { parameter: "PVC", value: "↑↑" },
      {
        parameter: "PCP (wedge)",
        value: "Variable (↑ en TEP, ↑↑ en taponamiento)",
      },
      { parameter: "RVS", value: "↑↑" },
      { parameter: "SvO₂", value: "↓↓" },
      { parameter: "PAM", value: "↓↓" },
    ],
    ecoFindings: [
      "TEP: Dilatación VD, septum paradójico, McConnell",
      "Taponamiento: derrame pericárdico con colapso de AD/VD",
      "Neumotórax a tensión: ausencia de sliding + colapso",
      "VCI dilatada sin colapso inspiratorio",
    ],
    examples: [
      "TEP masivo",
      "Taponamiento cardíaco",
      "Neumotórax a tensión",
      "Hiperinsuflación dinámica",
    ],
    management: [
      "TEP: Anticoagulación + fibrinólisis sistémica si masivo",
      "Taponamiento: Pericardiocentesis urgente",
      "Neumotórax: Descompresión con aguja → tubo torácico",
      "Fluidos con precaución (pueden empeorar)",
    ],
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
];

export const monitoringParameters: MonitoringParameter[] = [
  {
    id: "pvc",
    name: "Presión Venosa Central",
    abbreviation: "PVC",
    normalRange: "2-8",
    unit: "mmHg",
    interpretation: [
      { range: "< 2", meaning: "Hipovolemia" },
      { range: "2-8", meaning: "Normal" },
      { range: "8-12", meaning: "Elevada — valorar contexto (VM, PEEP)" },
      { range: "> 12", meaning: "Sobrecarga / falla VD / taponamiento" },
    ],
    clinicalUse:
      "Estimación de precarga del VD. Limitada como indicador de respuesta a fluidos.",
  },
  {
    id: "pcp",
    name: "Presión Capilar Pulmonar (Wedge)",
    abbreviation: "PCP",
    normalRange: "6-12",
    unit: "mmHg",
    interpretation: [
      { range: "< 6", meaning: "Hipovolemia" },
      { range: "6-12", meaning: "Normal" },
      { range: "12-18", meaning: "Elevada — sobrecarga leve" },
      { range: "> 18", meaning: "Edema pulmonar cardiogénico probable" },
    ],
    clinicalUse:
      "Estimación de presión de llenado del VI. Gold standard con Swan-Ganz.",
  },
  {
    id: "gc",
    name: "Gasto Cardíaco",
    abbreviation: "GC",
    normalRange: "4-8",
    unit: "L/min",
    interpretation: [
      {
        range: "< 4",
        meaning: "Bajo gasto — shock cardiogénico u obstructivo",
      },
      { range: "4-8", meaning: "Normal" },
      { range: "> 8", meaning: "Alto gasto — fase hiperdinámica (sepsis)" },
    ],
    clinicalUse:
      "Medido por termodilución (Swan-Ganz), ecocardiografía (VTI × TSVI) o métodos no invasivos.",
  },
  {
    id: "ic",
    name: "Índice Cardíaco",
    abbreviation: "IC",
    normalRange: "2.5-4.0",
    unit: "L/min/m²",
    interpretation: [
      { range: "< 2.2", meaning: "Shock cardiogénico" },
      { range: "2.2-2.5", meaning: "Bajo gasto limítrofe" },
      { range: "2.5-4.0", meaning: "Normal" },
      { range: "> 4.0", meaning: "Hiperdinámico" },
    ],
    clinicalUse:
      "GC indexado a superficie corporal. Más preciso que GC absoluto.",
  },
  {
    id: "rvs",
    name: "Resistencia Vascular Sistémica",
    abbreviation: "RVS",
    normalRange: "800-1200",
    unit: "dyn·s·cm⁻⁵",
    interpretation: [
      { range: "< 800", meaning: "Vasodilatación (sepsis, anafilaxia)" },
      { range: "800-1200", meaning: "Normal" },
      {
        range: "> 1200",
        meaning: "Vasoconstricción (shock cardiogénico, hipovolemia)",
      },
    ],
    clinicalUse:
      "Fórmula: (PAM - PVC) × 80 / GC. Clave para diferenciar tipos de shock.",
  },
  {
    id: "svo2",
    name: "Saturación Venosa Mixta",
    abbreviation: "SvO₂",
    normalRange: "65-75",
    unit: "%",
    interpretation: [
      {
        range: "< 60",
        meaning: "Extracción tisular aumentada — hipoperfusión",
      },
      { range: "60-75", meaning: "Normal" },
      { range: "> 75", meaning: "Disminución de extracción (sepsis) o shunt" },
    ],
    clinicalUse:
      "Refleja balance entre aporte y consumo de O₂. Ideal: catéter en arteria pulmonar.",
  },
];
