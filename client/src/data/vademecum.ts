export interface Drug {
  id: string;
  name: string;
  category: DrugCategory;
  indication: string;
  presentation: string;
  dilution: string;
  doseRange: { min: number; max: number; unit: string; perKg: boolean };
  infusionCalc?: (
    weightKg: number,
    dosePerUnit: number
  ) => { mlH: number; label: string };
  bolus?: string;
  onset: string;
  halfLife: string;
  sideEffects: string[];
  notes: string[];
}

export type DrugCategory =
  | "vasopressor"
  | "inotrope"
  | "sedation"
  | "analgesic"
  | "nmb"
  | "other";

export const categoryLabels: Record<DrugCategory, string> = {
  vasopressor: "Vasopresores",
  inotrope: "Inotrópicos",
  sedation: "Sedantes",
  analgesic: "Analgésicos",
  nmb: "Bloqueadores NM",
  other: "Otros",
};

export const categoryColors: Record<DrugCategory, string> = {
  vasopressor: "text-red-400 border-red-500/30 bg-red-500/10",
  inotrope: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  sedation: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  analgesic: "text-green-400 border-green-500/30 bg-green-500/10",
  nmb: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  other: "text-gray-400 border-gray-500/30 bg-gray-500/10",
};

export const drugs: Drug[] = [
  {
    id: "norepinephrine",
    name: "Norepinefrina",
    category: "vasopressor",
    indication: "Vasopresor de primera línea en shock séptico y distributivo",
    presentation: "4 mg/4 mL (1 mg/mL) ó 8 mg/8 mL",
    dilution: "8 mg en 250 mL SG5% → 32 µg/mL",
    doseRange: { min: 0.01, max: 3.0, unit: "µg/kg/min", perKg: true },
    onset: "1-2 min",
    halfLife: "2-4 min",
    sideEffects: [
      "Taquicardia",
      "Arritmias",
      "Isquemia periférica",
      "Hipertensión",
    ],
    notes: [
      "Primera línea en shock séptico (Surviving Sepsis 2021)",
      "Efecto predominantemente α1 con algo de β1",
      "Administrar por vía central. Acceso periférico solo transitorio",
    ],
  },
  {
    id: "vasopressin",
    name: "Vasopresina",
    category: "vasopressor",
    indication:
      "Segundo vasopresor en shock séptico refractario a norepinefrina",
    presentation: "20 UI/mL",
    dilution: "40 UI en 100 mL SF → 0.4 UI/mL",
    doseRange: { min: 0.01, max: 0.04, unit: "UI/min", perKg: false },
    onset: "Inmediato",
    halfLife: "10-20 min",
    sideEffects: [
      "Isquemia mesentérica",
      "Isquemia digital",
      "Hiponatremia",
      "Bradicardia",
    ],
    notes: [
      "Dosis fija: 0.03-0.04 UI/min (no titular por kg)",
      "No usar como vasopresor único",
      "Puede reducir dosis de NE (ahorro de catecolaminas)",
    ],
  },
  {
    id: "epinephrine",
    name: "Epinefrina (Adrenalina)",
    category: "vasopressor",
    indication:
      "Shock anafiláctico, paro cardíaco, segundo vasopresor en shock séptico",
    presentation: "1 mg/mL",
    dilution: "5 mg en 250 mL SG5% → 20 µg/mL",
    doseRange: { min: 0.01, max: 0.5, unit: "µg/kg/min", perKg: true },
    bolus: "PCR: 1 mg IV c/3-5 min. Anafilaxia: 0.3-0.5 mg IM",
    onset: "Inmediato",
    halfLife: "2-3 min",
    sideEffects: [
      "Taquicardia",
      "Arritmias",
      "Acidosis láctica",
      "Hiperglucemia",
    ],
    notes: [
      "Dosis bajas (≤0.05): predominio β1/β2. Dosis altas: predominio α1",
      "Aumenta lactato por estimulación β2 (no confundir con hipoperfusión)",
    ],
  },
  {
    id: "dobutamine",
    name: "Dobutamina",
    category: "inotrope",
    indication: "Inotrópico en shock cardiogénico con bajo gasto",
    presentation: "250 mg/20 mL",
    dilution: "250 mg en 250 mL SG5% → 1000 µg/mL",
    doseRange: { min: 2, max: 20, unit: "µg/kg/min", perKg: true },
    onset: "1-2 min (pico: 10 min)",
    halfLife: "2 min",
    sideEffects: [
      "Taquicardia",
      "Arritmias",
      "Hipotensión (vasodilatación)",
      "Isquemia miocárdica",
    ],
    notes: [
      "Efecto predominantemente β1 (inotropismo) con β2 (vasodilatación)",
      "No usar como vasopresor (puede bajar PAM)",
      "Considerar milrinona si taquicardia excesiva",
    ],
  },
  {
    id: "milrinone",
    name: "Milrinona",
    category: "inotrope",
    indication:
      "Inodilatador en IC aguda, especialmente con hipertensión pulmonar",
    presentation: "10 mg/10 mL",
    dilution: "20 mg en 80 mL SF → 200 µg/mL",
    doseRange: { min: 0.125, max: 0.75, unit: "µg/kg/min", perKg: true },
    bolus: "50 µg/kg en 10 min (opcional, vigilar hipotensión)",
    onset: "5-15 min",
    halfLife: "2.3 h (ajustar en IR)",
    sideEffects: ["Hipotensión", "Arritmias", "Trombocitopenia"],
    notes: [
      "Inhibidor de fosfodiesterasa III — no depende de receptores β",
      "Útil en pacientes con β-bloqueante previo",
      "Ajustar dosis en insuficiencia renal",
    ],
  },
  {
    id: "propofol",
    name: "Propofol",
    category: "sedation",
    indication:
      "Sedación en UCI para intubación y mantenimiento (< 48-72h ideal)",
    presentation: "200 mg/20 mL (10 mg/mL) ó 500 mg/50 mL",
    dilution: "Sin diluir (emulsión lipídica)",
    doseRange: { min: 5, max: 50, unit: "µg/kg/min", perKg: true },
    bolus: "Inducción: 1-2 mg/kg IV",
    onset: "15-30 seg",
    halfLife: "3-12 h (contexto-sensible)",
    sideEffects: [
      "Hipotensión",
      "Bradicardia",
      "Síndrome de infusión de propofol (PRIS)",
      "Hipertrigliceridemia",
    ],
    notes: [
      "Monitorizar triglicéridos cada 48-72h",
      "PRIS: dosis > 80 µg/kg/min o > 48h. Acidosis metabólica + rabdomiólisis",
      "Contabilizar aporte calórico lipídico (1.1 kcal/mL)",
    ],
  },
  {
    id: "midazolam",
    name: "Midazolam",
    category: "sedation",
    indication: "Sedación y ansiolisis en UCI. Status epiléptico.",
    presentation: "15 mg/3 mL (5 mg/mL) ó 50 mg/10 mL",
    dilution: "50 mg en 50 mL SF → 1 mg/mL",
    doseRange: { min: 0.02, max: 0.1, unit: "mg/kg/h", perKg: true },
    bolus: "0.01-0.05 mg/kg IV",
    onset: "1-5 min",
    halfLife: "1.5-2.5 h (prolongada en obesidad, IR, IH)",
    sideEffects: [
      "Hipotensión",
      "Depresión respiratoria",
      "Delirium",
      "Acumulación",
    ],
    notes: [
      "Metabolito activo (α-hydroxymidazolam) se acumula en IR",
      "Preferir dexmedetomidina o propofol para sedación < 48h",
      "Antídoto: flumazenil 0.2 mg IV",
    ],
  },
  {
    id: "dexmedetomidine",
    name: "Dexmedetomidina",
    category: "sedation",
    indication: "Sedación leve-moderada en UCI. Permite sedación cooperativa.",
    presentation: "200 µg/2 mL (100 µg/mL)",
    dilution: "400 µg en 100 mL SF → 4 µg/mL",
    doseRange: { min: 0.2, max: 1.5, unit: "µg/kg/h", perKg: true },
    bolus: "1 µg/kg en 10 min (opcional, riesgo de bradicardia)",
    onset: "5-10 min",
    halfLife: "2 h",
    sideEffects: ["Bradicardia", "Hipotensión", "Boca seca"],
    notes: [
      "Agonista α2 central — sedación sin depresión respiratoria",
      "Ideal para weaning ventilatorio y prevención de delirium",
      "No produce sedación profunda — no usar como agente único en SDRA severo",
    ],
  },
  {
    id: "fentanyl",
    name: "Fentanilo",
    category: "analgesic",
    indication: "Analgesia en UCI. Analgesia-first sedation strategy.",
    presentation: "500 µg/10 mL (50 µg/mL)",
    dilution: "2500 µg en 50 mL SF → 50 µg/mL",
    doseRange: { min: 0.5, max: 3, unit: "µg/kg/h", perKg: true },
    bolus: "0.5-1 µg/kg IV",
    onset: "1-2 min",
    halfLife: "2-4 h (contexto-sensible hasta 12-18h)",
    sideEffects: [
      "Depresión respiratoria",
      "Rigidez torácica",
      "Bradicardia",
      "Íleo",
    ],
    notes: [
      "100× más potente que morfina",
      "Acumulación significativa en infusiones prolongadas",
      "Preferido en inestabilidad hemodinámica (no libera histamina)",
    ],
  },
  {
    id: "cisatracurium",
    name: "Cisatracurio",
    category: "nmb",
    indication:
      "Bloqueo NM en SDRA con PaO₂/FiO₂ < 150 (primeras 48h). Intubación.",
    presentation: "10 mg/5 mL (2 mg/mL) ó 200 mg/20 mL",
    dilution: "200 mg en 200 mL SF → 1 mg/mL",
    doseRange: { min: 1, max: 3, unit: "µg/kg/min", perKg: true },
    bolus: "Intubación: 0.15-0.2 mg/kg IV",
    onset: "2-3 min",
    halfLife: "22-29 min (eliminación de Hofmann)",
    sideEffects: [
      "Debilidad prolongada (miopatía del crítico)",
      "Bradicardia (rara)",
      "Atelectasias si sedación inadecuada",
    ],
    notes: [
      "Estudio ACURASYS: mejoría de supervivencia en SDRA severo (48h)",
      "Eliminación por vía de Hofmann (no depende de hígado/riñón)",
      "SIEMPRE asegurar sedación adecuada antes de iniciar BNM",
      "Monitorizar con TOF (Train of Four) cada 4-6h",
    ],
  },
  {
    id: "rocuronium",
    name: "Rocuronio",
    category: "nmb",
    indication: "Intubación de secuencia rápida. Bloqueo NM en UCI.",
    presentation: "50 mg/5 mL (10 mg/mL)",
    dilution: "500 mg en 50 mL SF → 10 mg/mL",
    doseRange: { min: 0.3, max: 0.6, unit: "mg/kg/h", perKg: true },
    bolus: "ISR: 1-1.2 mg/kg IV. Estándar: 0.6 mg/kg IV",
    onset: "60-90 seg (ISR: 45 seg)",
    halfLife: "70-80 min",
    sideEffects: ["Acumulación en IR/IH", "Debilidad prolongada"],
    notes: [
      "Antídoto: Sugammadex (16 mg/kg para reversión inmediata)",
      "Eliminación hepatorrenal — acumulación en disfunción orgánica",
      "Preferido para ISR cuando succinilcolina está contraindicada",
    ],
  },
  {
    id: "ketamine",
    name: "Ketamina",
    category: "other",
    indication:
      "Inducción en pacientes hemodinámicamente inestables. Analgesia. Status asmático.",
    presentation: "500 mg/10 mL (50 mg/mL)",
    dilution: "500 mg en 50 mL SF → 10 mg/mL",
    doseRange: { min: 0.1, max: 0.5, unit: "mg/kg/h", perKg: true },
    bolus: "Inducción: 1-2 mg/kg IV. Analgesia: 0.1-0.3 mg/kg IV",
    onset: "30-60 seg IV",
    halfLife: "2-3 h",
    sideEffects: [
      "Alucinaciones",
      "Sialorrea",
      "↑PIC",
      "Hipertensión transitoria",
    ],
    notes: [
      "Mantiene tono simpático — no produce hipotensión",
      "Broncodilatador potente — útil en estatus asmático",
      "Coadministrar con benzodiazepina para evitar efectos disociativos",
    ],
  },
];
