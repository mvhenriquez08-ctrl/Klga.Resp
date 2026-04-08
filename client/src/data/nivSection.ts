export interface NIVMode {
  id: string;
  name: string;
  fullName: string;
  description: string;
  mechanism: string;
  indications: string[];
  keyParameters: string[];
  advantages: string[];
  disadvantages: string[];
  category: "spontaneous" | "assisted" | "hybrid";
  icon: string;
}

export const nivModes: NIVMode[] = [
  {
    id: "cpap",
    name: "CPAP",
    fullName: "Continuous Positive Airway Pressure",
    description:
      "Presión positiva continua en la vía aérea durante todo el ciclo respiratorio.",
    mechanism:
      "Mantiene una presión constante (EPAP) superior a la atmosférica, lo que aumenta la capacidad residual funcional y recluta alvéolos colapsados.",
    indications: [
      "Edema agudo de pulmón cardiogénico",
      "SAHOS (Apnea obstructiva del sueño)",
      "Atelectasias postoperatorias",
      "Hipoxemia sin hipercapnia",
    ],
    keyParameters: ["EPAP (Presión espiratoria)", "FiO₂ (%)", "Rampa"],
    advantages: [
      "Sencillez de aplicación",
      "Mejora la oxigenación",
      "Reduce el trabajo respiratorio en EAP",
    ],
    disadvantages: [
      "No proporciona soporte ventilatorio (no ayuda a eliminar CO₂)",
      "Mal tolerada si hay mucha demanda de flujo",
    ],
    category: "spontaneous",
    icon: "💨",
  },
  {
    id: "bipap",
    name: "BiLevel / BiPAP",
    fullName: "Bilevel Positive Airway Pressure",
    description:
      "Dos niveles de presión positiva: uno superior durante la inspiración (IPAP) y uno inferior durante la espiración (EPAP).",
    mechanism:
      "La diferencia entre IPAP y EPAP (Pressure Support) genera un gradiente de presión que facilita el volumen corriente y la eliminación de CO₂.",
    indications: [
      "Exacerbación de EPOC",
      "Insuficiencia respiratoria hipercápnica",
      "Sd. de hipoventilación-obesidad",
      "Fallo en el destete (weaning)",
    ],
    keyParameters: [
      "IPAP (Presión inspiratoria)",
      "EPAP (Presión espiratoria)",
      "FiO₂ (%)",
      "Trigger (sensibilidad)",
    ],
    advantages: [
      "Mejora la ventilación alveolar",
      "Reduce la PaCO₂",
      "Disminuye significativamente el trabajo respiratorio",
    ],
    disadvantages: [
      "Riesgo de fugas por presiones altas",
      "Posible asincronía paciente-ventilador",
    ],
    category: "assisted",
    icon: "📊",
  },
  {
    id: "avaps",
    name: "AVAPS",
    fullName: "Average Volume Assured Pressure Support",
    description:
      "Modo híbrido que ajusta automáticamente el IPAP para asegurar un volumen corriente (Vt) objetivo.",
    mechanism:
      "El ventilador calcula el promedio del volumen inspirado y ajusta lentamente la presión de soporte dentro de un rango programado para mantener el Vt deseado.",
    indications: [
      "Enfermedades neuromusculares",
      "Cifoescoliosis",
      "Hipoventilación-obesidad crónica",
    ],
    keyParameters: ["Vt objetivo", "IPAP mín/máx", "EPAP", "FiO₂ (%)"],
    advantages: [
      "Garantiza estabilidad en la ventilación minuto",
      "Se adapta a cambios en la mecánica pulmonar o posición",
    ],
    disadvantages: [
      "Complejidad de programación",
      "Ajustes de presión pueden ser lentos",
    ],
    category: "hybrid",
    icon: "📈",
  },
];

export const nivParameters = [
  {
    id: "ipap",
    name: "IPAP",
    unit: "cmH₂O",
    definition:
      "Presión positiva máxima alcanzada durante la fase inspiratoria.",
    normalRange: "8 - 20 cmH₂O",
    clinicalRelevance:
      "Es el principal determinante del volumen corriente y de la eliminación de CO₂.",
  },
  {
    id: "epap",
    name: "EPAP / CPAP",
    unit: "cmH₂O",
    definition: "Presión positiva mantenida durante la fase espiratoria.",
    normalRange: "4 - 8 cmH₂O",
    clinicalRelevance:
      "Mantiene el reclutamiento alveolar, mejora la oxigenación y contrarresta el auto-PEEP en EPOC.",
  },
  {
    id: "pressure-support",
    name: "Presión de Soporte (PS)",
    unit: "cmH₂O",
    definition: "Diferencia entre IPAP y EPAP (PS = IPAP - EPAP).",
    normalRange: "5 - 15 cmH₂O",
    clinicalRelevance:
      "Es la 'ayuda' real que recibe el paciente para cada respiración.",
  },
  {
    id: "fiO2",
    name: "FiO2",
    unit: "%",
    definition: "Fracción inspirada de oxígeno expresada en porcentaje.",
    normalRange: "21% - 100%",
    clinicalRelevance:
      "Permite ajustar la oxigenación arterial (PaO2). Se debe buscar la FiO2 mínima para saturación > 92%.",
  },
];
