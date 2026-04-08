export interface ScoreField {
  id: string;
  label: string;
  type: "select" | "number" | "checkbox";
  options?: { label: string; value: number }[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface UCIScore {
  id: string;
  name: string;
  fullName: string;
  description: string;
  fields: ScoreField[];
  interpret: (score: number) => {
    label: string;
    color: string;
    detail: string;
  };
  references: string[];
}

export const sofaScore: UCIScore = {
  id: "sofa",
  name: "SOFA",
  fullName: "Sequential Organ Failure Assessment",
  description:
    "Evalúa disfunción orgánica secuencial. Cada sistema se puntúa de 0-4. Score ≥2 sugiere disfunción orgánica.",
  fields: [
    {
      id: "pao2fio2",
      label: "PaO₂/FiO₂ (respiratorio)",
      type: "select",
      options: [
        { label: "≥ 400", value: 0 },
        { label: "300-399", value: 1 },
        { label: "200-299", value: 2 },
        { label: "100-199 + VM", value: 3 },
        { label: "< 100 + VM", value: 4 },
      ],
    },
    {
      id: "platelets",
      label: "Plaquetas ×10³/µL (coagulación)",
      type: "select",
      options: [
        { label: "≥ 150", value: 0 },
        { label: "100-149", value: 1 },
        { label: "50-99", value: 2 },
        { label: "20-49", value: 3 },
        { label: "< 20", value: 4 },
      ],
    },
    {
      id: "bilirubin",
      label: "Bilirrubina mg/dL (hepático)",
      type: "select",
      options: [
        { label: "< 1.2", value: 0 },
        { label: "1.2-1.9", value: 1 },
        { label: "2.0-5.9", value: 2 },
        { label: "6.0-11.9", value: 3 },
        { label: "≥ 12", value: 4 },
      ],
    },
    {
      id: "map",
      label: "Cardiovascular (PAM / vasopresores)",
      type: "select",
      options: [
        { label: "PAM ≥ 70", value: 0 },
        { label: "PAM < 70", value: 1 },
        { label: "Dopa ≤ 5 ó Dobutamina", value: 2 },
        { label: "Dopa > 5 ó Epi/NE ≤ 0.1", value: 3 },
        { label: "Dopa > 15 ó Epi/NE > 0.1", value: 4 },
      ],
    },
    {
      id: "gcs",
      label: "Glasgow (neurológico)",
      type: "select",
      options: [
        { label: "15", value: 0 },
        { label: "13-14", value: 1 },
        { label: "10-12", value: 2 },
        { label: "6-9", value: 3 },
        { label: "< 6", value: 4 },
      ],
    },
    {
      id: "creatinine",
      label: "Creatinina mg/dL ó diuresis (renal)",
      type: "select",
      options: [
        { label: "< 1.2", value: 0 },
        { label: "1.2-1.9", value: 1 },
        { label: "2.0-3.4", value: 2 },
        { label: "3.5-4.9 ó <500ml/d", value: 3 },
        { label: "≥ 5.0 ó <200ml/d", value: 4 },
      ],
    },
  ],
  interpret: score => {
    if (score <= 1)
      return {
        label: "Bajo",
        color: "text-green-400",
        detail: "Mortalidad < 3.3%",
      };
    if (score <= 5)
      return {
        label: "Moderado",
        color: "text-yellow-400",
        detail: "Mortalidad ~6.4%",
      };
    if (score <= 9)
      return {
        label: "Alto",
        color: "text-orange-400",
        detail: "Mortalidad ~20.2%",
      };
    if (score <= 14)
      return {
        label: "Muy alto",
        color: "text-red-400",
        detail: "Mortalidad ~21.5-50%",
      };
    return {
      label: "Crítico",
      color: "text-red-500",
      detail: "Mortalidad > 80%",
    };
  },
  references: [
    "Vincent JL et al. The SOFA score. Intensive Care Med 1996;22:707-710",
    "Ferreira FL et al. Serial evaluation of SOFA score. JAMA 2001;286:1754-8",
  ],
};

export const qsofaScore: UCIScore = {
  id: "qsofa",
  name: "qSOFA",
  fullName: "Quick SOFA",
  description:
    "Screening rápido de sepsis a pie de cama. ≥2 puntos sugiere alto riesgo de mal pronóstico.",
  fields: [
    { id: "rr", label: "FR ≥ 22 rpm", type: "checkbox" },
    {
      id: "mental",
      label: "Alteración del estado mental (GCS < 15)",
      type: "checkbox",
    },
    { id: "sbp", label: "PAS ≤ 100 mmHg", type: "checkbox" },
  ],
  interpret: score => {
    if (score <= 0)
      return {
        label: "Bajo riesgo",
        color: "text-green-400",
        detail: "Mortalidad ~1%",
      };
    if (score === 1)
      return {
        label: "Intermedio",
        color: "text-yellow-400",
        detail: "Mortalidad ~2-3%",
      };
    return {
      label: "Alto riesgo",
      color: "text-red-400",
      detail: "Mortalidad ≥10%. Evaluar SOFA completo.",
    };
  },
  references: [
    "Seymour CW et al. Assessment of clinical criteria for sepsis. JAMA 2016;315:762-774",
    "Singer M et al. Third International Consensus Definitions for Sepsis (Sepsis-3). JAMA 2016;315:801-810",
  ],
};

export const apacheIIScore: UCIScore = {
  id: "apache2",
  name: "APACHE II",
  fullName: "Acute Physiology And Chronic Health Evaluation II",
  description:
    "Score de gravedad en UCI. Se calcula en las primeras 24h de ingreso. Rango: 0-71 puntos.",
  fields: [
    {
      id: "temp",
      label: "Temperatura rectal °C",
      type: "select",
      options: [
        { label: "36-38.4", value: 0 },
        { label: "38.5-38.9", value: 1 },
        { label: "34-35.9 ó 39-40.9", value: 2 },
        { label: "32-33.9 ó ≥41", value: 3 },
        { label: "30-31.9", value: 4 },
      ],
    },
    {
      id: "pam_a",
      label: "PAM (mmHg)",
      type: "select",
      options: [
        { label: "70-109", value: 0 },
        { label: "110-129 ó 50-69", value: 2 },
        { label: "130-159", value: 3 },
        { label: "≥160 ó ≤49", value: 4 },
      ],
    },
    {
      id: "hr",
      label: "Frecuencia Cardíaca",
      type: "select",
      options: [
        { label: "70-109", value: 0 },
        { label: "55-69 ó 110-139", value: 2 },
        { label: "40-54 ó 140-179", value: 3 },
        { label: "≤39 ó ≥180", value: 4 },
      ],
    },
    {
      id: "rr_a",
      label: "Frecuencia Respiratoria",
      type: "select",
      options: [
        { label: "12-24", value: 0 },
        { label: "10-11 ó 25-34", value: 1 },
        { label: "6-9 ó 35-49", value: 3 },
        { label: "≤5 ó ≥50", value: 4 },
      ],
    },
    {
      id: "pao2_a",
      label: "Oxigenación",
      type: "select",
      options: [
        { label: "PaO₂ > 70 ó AaDO₂ < 200", value: 0 },
        { label: "PaO₂ 61-70", value: 1 },
        { label: "AaDO₂ 200-349 ó PaO₂ 55-60", value: 2 },
        { label: "AaDO₂ 350-499", value: 3 },
        { label: "AaDO₂ ≥500 ó PaO₂ < 55", value: 4 },
      ],
    },
    {
      id: "ph_a",
      label: "pH arterial",
      type: "select",
      options: [
        { label: "7.33-7.49", value: 0 },
        { label: "7.50-7.59 ó 7.25-7.32", value: 1 },
        { label: "7.60-7.69 ó 7.15-7.24", value: 3 },
        { label: "≥7.70 ó <7.15", value: 4 },
      ],
    },
    {
      id: "na_a",
      label: "Sodio (mEq/L)",
      type: "select",
      options: [
        { label: "130-149", value: 0 },
        { label: "150-154 ó 120-129", value: 2 },
        { label: "155-159 ó 111-119", value: 3 },
        { label: "≥160 ó ≤110", value: 4 },
      ],
    },
    {
      id: "k_a",
      label: "Potasio (mEq/L)",
      type: "select",
      options: [
        { label: "3.5-5.4", value: 0 },
        { label: "3.0-3.4 ó 5.5-5.9", value: 1 },
        { label: "2.5-2.9 ó 6.0-6.9", value: 2 },
        { label: "< 2.5 ó ≥ 7.0", value: 4 },
      ],
    },
    {
      id: "cr_a",
      label: "Creatinina (mg/dL)",
      type: "select",
      options: [
        { label: "0.6-1.4", value: 0 },
        { label: "< 0.6 ó 1.5-1.9", value: 2 },
        { label: "2.0-3.4", value: 3 },
        { label: "≥ 3.5", value: 4 },
      ],
    },
    {
      id: "hct_a",
      label: "Hematocrito (%)",
      type: "select",
      options: [
        { label: "30-45.9", value: 0 },
        { label: "20-29.9 ó 46-49.9", value: 2 },
        { label: "50-59.9", value: 3 },
        { label: "< 20 ó ≥ 60", value: 4 },
      ],
    },
    {
      id: "wbc_a",
      label: "Leucocitos ×10³",
      type: "select",
      options: [
        { label: "3-14.9", value: 0 },
        { label: "15-19.9 ó 1-2.9", value: 2 },
        { label: "20-39.9", value: 3 },
        { label: "≥ 40 ó < 1", value: 4 },
      ],
    },
    {
      id: "gcs_a",
      label: "Glasgow (15 - GCS)",
      type: "select",
      options: [
        { label: "GCS 15 → 0 pts", value: 0 },
        { label: "GCS 13-14 → 1-2 pts", value: 2 },
        { label: "GCS 10-12 → 3-5 pts", value: 4 },
        { label: "GCS 7-9 → 6-8 pts", value: 7 },
        { label: "GCS 3-6 → 9-12 pts", value: 11 },
      ],
    },
    {
      id: "age_a",
      label: "Edad (años)",
      type: "select",
      options: [
        { label: "< 45", value: 0 },
        { label: "45-54", value: 2 },
        { label: "55-64", value: 3 },
        { label: "65-74", value: 5 },
        { label: "≥ 75", value: 6 },
      ],
    },
    {
      id: "chronic",
      label: "Enfermedad crónica",
      type: "select",
      options: [
        { label: "Ninguna", value: 0 },
        { label: "Postqx electivo", value: 2 },
        { label: "Postqx urgencia ó no quirúrgico", value: 5 },
      ],
    },
  ],
  interpret: score => {
    if (score <= 4)
      return {
        label: "Bajo",
        color: "text-green-400",
        detail: "Mortalidad ~4%",
      };
    if (score <= 9)
      return {
        label: "Leve",
        color: "text-green-300",
        detail: "Mortalidad ~8%",
      };
    if (score <= 14)
      return {
        label: "Moderado",
        color: "text-yellow-400",
        detail: "Mortalidad ~15%",
      };
    if (score <= 19)
      return {
        label: "Grave",
        color: "text-orange-400",
        detail: "Mortalidad ~25%",
      };
    if (score <= 24)
      return {
        label: "Muy grave",
        color: "text-red-400",
        detail: "Mortalidad ~40%",
      };
    if (score <= 29)
      return {
        label: "Severo",
        color: "text-red-500",
        detail: "Mortalidad ~55%",
      };
    if (score <= 34)
      return {
        label: "Crítico",
        color: "text-red-600",
        detail: "Mortalidad ~75%",
      };
    return {
      label: "Extremo",
      color: "text-red-700",
      detail: "Mortalidad ~85%",
    };
  },
  references: [
    "Knaus WA et al. APACHE II: a severity of disease classification system. Crit Care Med 1985;13:818-829",
  ],
};

export const murrayScore: UCIScore = {
  id: "murray",
  name: "Murray (LIS)",
  fullName: "Lung Injury Score (Murray Score)",
  description:
    "Evalúa severidad de lesión pulmonar aguda. Promedio de 4 componentes. >2.5 = SDRA severo (considerar ECMO).",
  fields: [
    {
      id: "consolidation",
      label: "Consolidación en RX de tórax",
      type: "select",
      options: [
        { label: "Sin consolidación", value: 0 },
        { label: "1 cuadrante", value: 1 },
        { label: "2 cuadrantes", value: 2 },
        { label: "3 cuadrantes", value: 3 },
        { label: "4 cuadrantes", value: 4 },
      ],
    },
    {
      id: "pao2fio2_m",
      label: "PaO₂/FiO₂ (mmHg)",
      type: "select",
      options: [
        { label: "≥ 300", value: 0 },
        { label: "225-299", value: 1 },
        { label: "175-224", value: 2 },
        { label: "100-174", value: 3 },
        { label: "< 100", value: 4 },
      ],
    },
    {
      id: "peep",
      label: "PEEP (cmH₂O)",
      type: "select",
      options: [
        { label: "≤ 5", value: 0 },
        { label: "6-8", value: 1 },
        { label: "9-11", value: 2 },
        { label: "12-14", value: 3 },
        { label: "≥ 15", value: 4 },
      ],
    },
    {
      id: "compliance_m",
      label: "Compliance (ml/cmH₂O)",
      type: "select",
      options: [
        { label: "≥ 80", value: 0 },
        { label: "60-79", value: 1 },
        { label: "40-59", value: 2 },
        { label: "20-39", value: 3 },
        { label: "≤ 19", value: 4 },
      ],
    },
  ],
  interpret: score => {
    if (score <= 0.1)
      return {
        label: "Sin lesión",
        color: "text-green-400",
        detail: "Sin lesión pulmonar",
      };
    if (score <= 2.5)
      return {
        label: "Leve-moderado",
        color: "text-yellow-400",
        detail: "Lesión pulmonar leve a moderada",
      };
    return {
      label: "Severo (SDRA)",
      color: "text-red-400",
      detail: "SDRA severo — considerar ECMO VV",
    };
  },
  references: [
    "Murray JF et al. An expanded definition of ARDS. Am Rev Respir Dis 1988;138:720-723",
  ],
};

export const allScores = [sofaScore, qsofaScore, apacheIIScore, murrayScore];
