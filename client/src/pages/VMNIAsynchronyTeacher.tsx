import { useState, useEffect, useRef } from "react";
import {
 ChevronRight,
 ChevronLeft,
 Play,
 Pause,
 RotateCcw,
 Info,
 AlertTriangle,
 Wrench,
 BookOpen,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurvePoint {
 t: number;
 pressure: number;
 flow: number;
 volume: number;
 effort: number;
}

interface AsynchronyLesson {
 id: string;
 name: string;
 emoji: string;
 color: string;
 tagline: string;
 definition: string;
 mechanism: string;
 whyHappens: string[];
 howToIdentify: string[];
 correction: string[];
 clinicalImpact: string;
 frequency: string;
 relatedPathologies: string[];
 generateCurves: () => CurvePoint[];
 annotations: {
  t: number;
  curve: "pressure" | "flow" | "volume";
  label: string;
  y?: number;
 }[];
}

// ─── Curve generators ────────────────────────────────────────────────────────

function range(start: number, end: number, step = 0.02): number[] {
 const arr: number[] = [];
 for (let i = start; i <= end; i = +(i + step).toFixed(3)) arr.push(i);
 return arr;
}

function generateNormal(cycles = 5): CurvePoint[] {
 const IPAP = 16,
  EPAP = 5,
  Ti = 1.0,
  Te = 2.0,
  cycle = Ti + Te;
 return range(0, cycles * cycle).map(t => {
  const ct = t % cycle;

  const pressure =
   ct < Ti
    ? EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.1))
    : EPAP + (IPAP - EPAP) * Math.exp(-(ct - Ti) / 0.05);

  const flow =
   ct < Ti ? 55 * Math.exp(-ct / 0.6) : -45 * Math.exp(-(ct - Ti) / 0.4);

  const volume =
   ct < Ti
    ? 450 * (1 - Math.exp(-ct / 0.5))
    : 450 * (1 - Math.exp(-Ti / 0.5)) * Math.exp(-(ct - Ti) / 0.4);

  const effort =
   ct < Ti * 0.8 ? -Math.sin((Math.PI * ct) / (Ti * 0.8)) * 3 : 0;

  return { t, pressure, flow, volume, effort };
 });
}

function generateIneffectiveEffort(): CurvePoint[] {
 const IPAP = 16,
  EPAP = 5,
  Ti = 1.0,
  Te = 2.0,
  cycle = Ti + Te;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const cn = Math.floor(t / cycle);
  const isIneffective = cn % 3 === 1;
  let pressure = EPAP,
   flow = 0,
   volume = 0,
   effort = 0;

  if (isIneffective) {
   // Strong effort but no ventilator response
   effort =
    ct > 0.5 && ct < 1.5 ? -Math.sin((Math.PI * (ct - 0.5)) / 1.0) * 4 : 0;
   pressure = EPAP + effort * 0.5;
   flow = effort < 0 ? -effort * 2 : 0;
   volume = effort < 0 ? 30 * Math.sin((Math.PI * (ct - 0.5)) / 1.0) : 0;
  } else {
   pressure =
    ct < Ti
     ? EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.1))
     : EPAP + (IPAP - EPAP) * Math.exp(-(ct - Ti) / 0.05);
   flow =
    ct < Ti ? 55 * Math.exp(-ct / 0.6) : -45 * Math.exp(-(ct - Ti) / 0.4);
   volume =
    ct < Ti
     ? 450 * (1 - Math.exp(-ct / 0.5))
     : 450 * (1 - Math.exp(-Ti / 0.5)) * Math.exp(-(ct - Ti) / 0.4);
   effort = ct < Ti * 0.8 ? -Math.sin((Math.PI * ct) / (Ti * 0.8)) * 3 : 0;
  }
  return { t, pressure, flow, volume, effort };
 });
}

function generateDoubleTriggering(): CurvePoint[] {
 const IPAP = 18,
  EPAP = 6,
  Ti = 0.8,
  Te = 2.2,
  cycle = Ti + Te;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const cn = Math.floor(t / cycle);
  const hasDouble = cn % 2 === 0;
  let pressure = EPAP,
   flow = 0,
   volume = 0;
  const effort = ct < 1.6 ? -Math.sin((Math.PI * ct) / 1.6) * 5 : 0;

  if (ct < Ti) {
   pressure = EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.1));
   flow = 50 * Math.exp(-ct / 0.5);
   volume = 400 * (1 - Math.exp(-ct / 0.4));
  } else if (hasDouble && ct < Ti + 0.1) {
   pressure = EPAP + (IPAP - EPAP) * Math.exp(-(ct - Ti) / 0.05);
   flow = -20 * Math.exp(-(ct - Ti) / 0.05);
   const vMax = 400 * (1 - Math.exp(-Ti / 0.4));
   volume = vMax - 20 * (ct - Ti);
  } else if (hasDouble && ct >= Ti + 0.1 && ct < Ti + 0.1 + Ti) {
   const ct2 = ct - (Ti + 0.1);
   pressure = EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct2 / 0.1));
   flow = 45 * Math.exp(-ct2 / 0.5);
   const vStart = 400 * (1 - Math.exp(-Ti / 0.4)) - 2;
   volume = vStart + 350 * (1 - Math.exp(-ct2 / 0.4));
  } else {
   const expStart = hasDouble ? Ti + 0.1 + Ti : Ti;
   const vMax = hasDouble ? 700 : 400 * (1 - Math.exp(-Ti / 0.4));
   pressure = EPAP + (IPAP - EPAP) * Math.exp(-(ct - expStart) / 0.05);
   flow = -50 * Math.exp(-(ct - expStart) / 0.4);
   volume = vMax * Math.exp(-(ct - expStart) / 0.4);
  }
  return { t, pressure, flow, volume, effort };
 });
}

function generatePrematureCycling(): CurvePoint[] {
 const IPAP = 16,
  EPAP = 5,
  cycle = 3.0;
 const ventTi = 0.8;
 const patTi = 1.5;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const effort = ct < patTi ? -Math.sin((Math.PI * ct) / patTi) * 4 : 0;
  let pressure = EPAP,
   flow = 0,
   volume = 0;

  if (ct < ventTi) {
   pressure = EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.1));
   flow = 55 * Math.exp(-ct / 0.6);
   volume = 400 * (1 - Math.exp(-ct / 0.5));
  } else if (ct < patTi) {
   pressure = EPAP + effort * 0.8;
   flow = -effort * 5;
   const vAtCycling = 400 * (1 - Math.exp(-ventTi / 0.5));
   volume = vAtCycling + flow * (ct - ventTi) * 0.5;
  } else {
   pressure = EPAP;
   const expStart = patTi;
   const vMax = 400 * (1 - Math.exp(-ventTi / 0.5)) + 15;
   flow = -45 * Math.exp(-(ct - expStart) / 0.3);
   volume = vMax * Math.exp(-(ct - expStart) / 0.3);
  }
  return { t, pressure, flow, volume, effort };
 });
}

function generateLateCycling(): CurvePoint[] {
 const IPAP = 16,
  EPAP = 5,
  cycle = 3.0;
 const patTi = 0.8;
 const ventTi = 1.5;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const effort = ct < patTi ? -Math.sin((Math.PI * ct) / patTi) * 4 : 0;
  let pressure = EPAP,
   flow = 0,
   volume = 0;

  if (ct < patTi) {
   pressure = EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.1));
   flow = 55 * Math.exp(-ct / 0.5);
   volume = 400 * (1 - Math.exp(-ct / 0.4));
  } else if (ct < ventTi) {
   pressure =
    IPAP + 2 * Math.sin((Math.PI * (ct - patTi)) / (ventTi - patTi));
   flow = -20 * Math.sin((Math.PI * (ct - patTi)) / (ventTi - patTi));
   const vAtPatEnd = 400 * (1 - Math.exp(-patTi / 0.4));
   volume = vAtPatEnd - 20 * (ct - patTi);
  } else {
   pressure = EPAP + (IPAP - EPAP) * Math.exp(-(ct - ventTi) / 0.05);
   flow = -50 * Math.exp(-(ct - ventTi) / 0.3);
   const vAtVentEnd = 400 * (1 - Math.exp(-patTi / 0.4)) - 10;
   volume = vAtVentEnd * Math.exp(-(ct - ventTi) / 0.3);
  }
  return { t, pressure, flow, volume, effort };
 });
}

function generateAutoPEEP(): CurvePoint[] {
 const IPAP = 18,
  EPAP = 5,
  Ti = 1.0,
  Te = 1.0,
  cycle = Ti + Te;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const cn = Math.floor(t / cycle);
  const accumAP = Math.min(6, cn * 1.5);
  let pressure = EPAP,
   flow = 0,
   volume = 0;
  const effort =
   ct < Ti * 0.8 ? -Math.sin((Math.PI * ct) / (Ti * 0.8)) * 4 : 0;

  if (ct < Ti) {
   pressure =
    EPAP + accumAP + (IPAP - EPAP - accumAP) * (1 - Math.exp(-ct / 0.1));
   flow = 50 * Math.exp(-ct / 0.6);
   volume = accumAP * 40 + 400 * (1 - Math.exp(-ct / 0.5));
  } else {
   pressure = EPAP + accumAP * Math.exp(-(ct - Ti) / 0.5);
   flow = -40 * Math.exp(-(ct - Ti) / 0.6);
   volume = accumAP * 40 + 400 * Math.exp(-(ct - Ti) / 0.6);
  }
  return { t, pressure, flow, volume, effort };
 });
}

function generateFlowHunger(): CurvePoint[] {
 const IPAP = 16,
  EPAP = 5,
  cycle = 3.0,
  Ti = 1.2;
 return range(0, 5 * cycle).map(t => {
  const ct = t % cycle;
  const effort = ct < Ti ? -Math.sin((Math.PI * ct) / Ti) * 6 : 0;
  let pressure = EPAP,
   flow = 0,
   volume = 0;

  if (ct < Ti) {
   const slowRise = EPAP + (IPAP - EPAP) * (1 - Math.exp(-ct / 0.5));
   pressure = slowRise + effort * 0.8;
   flow = 40 * Math.sin((Math.PI * ct) / Ti);
   volume = (400 * (1 - Math.cos((Math.PI * ct) / Ti))) / 2;
  } else {
   pressure = EPAP + (IPAP - EPAP) * Math.exp(-(ct - Ti) / 0.05);
   flow = -45 * Math.exp(-(ct - Ti) / 0.4);
   volume = 400 * Math.exp(-(ct - Ti) / 0.4);
  }
  return { t, pressure, flow, volume, effort };
 });
}

// ─── Lessons data ─────────────────────────────────────────────────────────────

const LESSONS: AsynchronyLesson[] = [
 {
  id: "normal",
  name: "Ciclo Normal",
  emoji: "✅",
  color: "#10b981",
  tagline: "La referencia: así deben verse las curvas ideales en VMNI",
  definition:
   "Un ciclo ventilatorio sincronizado es aquel donde el inicio, la duración y el fin del ciclo del ventilador coinciden perfectamente con el esfuerzo neural del paciente.",
  mechanism:
   "El ventilador detecta el esfuerzo inspiratorio del paciente (trigger), entrega el flujo necesario durante toda la inspiración neural, y cicla a espiración exactamente cuando el paciente termina su esfuerzo. Las curvas muestran transiciones suaves y simétricas.",
  whyHappens: [
   "Trigger sensible y bien calibrado detecta el inicio del esfuerzo",
   "Rise time (velocidad de presurización) satisface la demanda de flujo del paciente",
   "Criterio de ciclado (% de flujo pico) coincide con el fin del esfuerzo neural",
   "EPAP suficiente para contrarrestar el umbral de trigger pero sin generar hiperinsuflación",
  ],
  howToIdentify: [
   "Curva de presión: sube rápido y limpiamente al IPAP, baja suavemente al EPAP",
   "Curva de flujo: pico inspiratorio positivo amplio, seguido de flujo espiratorio negativo suave",
   "Curva de volumen: ascenso rápido seguido de descenso completo a cero en cada ciclo",
   "No hay deflexiones anómalas, dientes de sierra ni mesetas inesperadas",
  ],
  correction: [
   "Este es el objetivo terapéutico — no requiere corrección",
   "Mantener configuración y monitorizar cambios en el estado del paciente",
  ],
  clinicalImpact:
   "El paciente descansa cómodamente, el trabajo respiratorio es mínimo y la ventilación alveolar es óptima.",
  frequency: "Referencia",
  relatedPathologies: [],
  generateCurves: () => generateNormal(),
  annotations: [],
 },
 {
  id: "esfuerzo_inefectivo",
  name: "Esfuerzo Inefectivo",
  emoji: "💨",
  color: "#f59e0b",
  tagline: "El paciente intenta respirar pero el ventilador no responde",
  definition:
   "Asincronía donde el paciente realiza un esfuerzo inspiratorio real que no genera un ciclo ventilatorio. El ventilador no detecta el esfuerzo y no entrega presión adicional.",
  mechanism:
   "El paciente genera presión negativa intratorácica al contraer el diafragma, pero esa presión negativa no supera el umbral del trigger del ventilador. Esto ocurre principalmente cuando hay auto-PEEP que el paciente debe vencer primero antes de llegar al umbral de trigger.",
  whyHappens: [
   "Auto-PEEP elevado: el paciente debe vencer el auto-PEEP + umbral de trigger, lo que requiere un esfuerzo mayor",
   "Trigger demasiado poco sensible (umbral demasiado alto)",
   "Sobreasistencia: el paciente está tan bien ventilado que su drive respiratorio es bajo y los esfuerzos son débiles",
   "Frecuente en EPOC con hiperinsuflación dinámica",
  ],
  howToIdentify: [
   "Deflexión negativa de presión durante la espiración SIN que siga un ciclo inspiratorio",
   "Pequeña oscilación en la curva de flujo sin reversión positiva completa",
   "La curva de volumen muestra una pequeña muesca descendente sin ascenso posterior",
   "El paciente tiene FR aparente mayor en el monitor de cabecera que en el ventilador",
  ],
  correction: [
   "Reducir EPAP si hay auto-PEEP para disminuir el umbral efectivo de trigger",
   "Aumentar la sensibilidad del trigger (reducir el umbral)",
   "Reducir IPAP si hay sobreasistencia para estimular el drive respiratorio",
   "Considerar broncodilatadores en EPOC para reducir hiperinsuflación",
  ],
  clinicalImpact:
   "Aumenta significativamente el trabajo respiratorio. El paciente trabaja sin recibir ayuda. Asociado a peores outcomes en UCI y mayor probabilidad de fracaso de VMNI.",
  frequency: "Muy frecuente (30-40% en EPOC)",
  relatedPathologies: [
   "EPOC",
   "Hiperinsuflación dinámica",
   "Sobreasistencia",
  ],
  generateCurves: () => generateIneffectiveEffort(),
  annotations: [
   { t: 4.0, curve: "pressure", label: "⚠ Esfuerzo sin respuesta" },
   { t: 13.0, curve: "pressure", label: "⚠ Esfuerzo sin respuesta" },
  ],
 },
 {
  id: "doble_disparo",
  name: "Doble Disparo",
  emoji: "⚡",
  color: "#ef4444",
  tagline:
   "Un esfuerzo del paciente genera dos ciclos consecutivos del ventilador",
  definition:
   "Asincronía donde un único esfuerzo inspiratorio del paciente genera dos ciclos ventilatorios consecutivos. El segundo ciclo ocurre durante la espiración neural del paciente.",
  mechanism:
   "Al final del primer ciclo, el ventilador cicla a espiración pero el paciente aún está en fase inspiratoria neural. Al comenzar su espiración activa, genera flujo que el trigger interpreta como un nuevo esfuerzo inspiratorio, disparando un segundo ciclo.",
  whyHappens: [
   "Tiempo inspiratorio del ventilador (Ti) más corto que el Ti neural del paciente",
   "Criterio de ciclado por flujo demasiado alto (cicla demasiado pronto)",
   "Drive respiratorio muy alto (SDRA, hipoxemia severa)",
   "Rise time muy rápido que hace que el flujo caiga rápidamente al umbral de ciclado",
  ],
  howToIdentify: [
   "Dos ciclos consecutivos muy cercanos con prácticamente sin tiempo espiratorio entre ellos",
   "El segundo ciclo tiene menor presión pico y menor volumen que el primero",
   "La curva de flujo muestra dos picos inspiratorios positivos seguidos",
   "El volumen tidal total (suma de ambos ciclos) puede ser muy elevado y peligroso",
  ],
  correction: [
   "Aumentar el Ti del ventilador para que coincida mejor con el Ti neural",
   "Reducir el criterio de ciclado por flujo (% del pico de flujo) para que cicle más tarde",
   "Reducir el rise time (más lento) para que el flujo tarde más en caer al umbral de ciclado",
   "Considerar modo con Ti fijo (BiPAP-ST en lugar de BiPAP espontáneo)",
  ],
  clinicalImpact:
   "Genera volúmenes corrientes muy elevados (volutrauma). Especialmente peligroso en SDRA donde se debe proteger el pulmón. Puede causar barotrauma y lesión pulmonar inducida por el ventilador.",
  frequency: "Frecuente en SDRA y drive respiratorio elevado",
  relatedPathologies: [
   "SDRA",
   "Drive respiratorio elevado",
   "Hipoxemia severa",
  ],
  generateCurves: () => generateDoubleTriggering(),
  annotations: [
   { t: 0.9, curve: "flow", label: "⚡ 2do ciclo" },
   { t: 6.9, curve: "flow", label: "⚡ 2do ciclo" },
  ],
 },
 {
  id: "ciclado_prematuro",
  name: "Ciclado Prematuro",
  emoji: "✂️",
  color: "#8b5cf6",
  tagline: "El ventilador termina la insuflación antes que el paciente",
  definition:
   "El ventilador cicla a espiración mientras el paciente todavía está en fase inspiratoria neural activa. El paciente sigue queriendo inspirar pero el ventilador ya no entrega presión.",
  mechanism:
   "El criterio de ciclado del ventilador (porcentaje del pico de flujo al que se cicla) se alcanza antes que el fin del esfuerzo neural. El paciente intenta continuar inspirando contra una válvula que ya está en posición espiratoria.",
  whyHappens: [
   "Criterio de ciclado por flujo demasiado alto (cicla cuando el flujo aún es alto)",
   "Ti del ventilador demasiado corto",
   "Paciente con Ti neural largo (IRC, obesidad, SAHOS)",
   "Fugas excesivas que hacen que el flujo no caiga al umbral de ciclado o que cicle por tiempo",
  ],
  howToIdentify: [
   "Al final de la presurización, se ve una 'joroba' o elevación de presión: el paciente tira contra el ventilador",
   "La curva de flujo muestra flujo positivo que persiste o rebota después del ciclado",
   "El paciente muestra signos de disconfort al final de la inspiración",
   "La curva de volumen puede mostrar una meseta o una pequeña ganancia adicional post-ciclado",
  ],
  correction: [
   "Reducir el criterio de ciclado por flujo (% más bajo = cicla más tarde)",
   "Aumentar el Ti mínimo en modos con Ti mínimo configurable",
   "Cambiar a modo con Ti fijo y ajustarlo al Ti neural del paciente",
   "Revisar y corregir fugas del sistema",
  ],
  clinicalImpact:
   "El paciente pelea contra el ventilador al final de la inspiración. Aumenta el trabajo respiratorio inspiratorio y puede generar disconfort severo, agitación y rechazo a la VMNI.",
  frequency: "Común en pacientes con Ti neural largo",
  relatedPathologies: ["IRC", "Obesidad", "SAHOS", "Fugas de mascarilla"],
  generateCurves: () => generatePrematureCycling(),
  annotations: [
   { t: 0.8, curve: "pressure", label: "✂️ Ciclado precoz" },
   { t: 3.8, curve: "pressure", label: "✂️ Ciclado precoz" },
  ],
 },
 {
  id: "ciclado_tardio",
  name: "Ciclado Tardío",
  emoji: "⏱️",
  color: "#06b6d4",
  tagline: "El ventilador sigue insuflando después que el paciente ya espira",
  definition:
   "El ventilador continúa en fase inspiratoria después que el esfuerzo neural del paciente ya terminó. El paciente comienza a espirar activamente mientras el ventilador sigue entregando presión positiva.",
  mechanism:
   "El criterio de ciclado se alcanza demasiado tarde respecto al fin del esfuerzo neural. El paciente activa sus músculos espiratorios para vencer la presión positiva del ventilador, generando una lucha entre espiración activa del paciente e inspiración forzada del ventilador.",
  whyHappens: [
   "Criterio de ciclado por flujo demasiado bajo (el ventilador espera que el flujo caiga mucho antes de ciclar)",
   "Ti del ventilador demasiado largo",
   "Fugas que mantienen el flujo alto artificialmente, retrasando el ciclado por flujo",
   "Paciente con Ti neural corto (EPOC con drive alto, taquipnea)",
  ],
  howToIdentify: [
   "Caída brusca de presión al final de la fase inspiratoria: el paciente espira activamente",
   "Flujo espiratorio negativo que aparece antes del ciclado del ventilador",
   "La curva de presión tiene una 'muesca' al final de la meseta inspiratoria",
   "El tiempo inspiratorio en el monitor es claramente mayor que el Ti visual del paciente",
  ],
  correction: [
   "Aumentar el criterio de ciclado por flujo (% más alto = cicla más pronto)",
   "Reducir el Ti máximo en modos con Ti configurable",
   "Revisar fugas que puedan mantener artificialmente alto el flujo",
   "Considerar modo espontáneo con trigger espiratorio sensible",
  ],
  clinicalImpact:
   "El paciente espira contra presión positiva, aumentando el trabajo espiratorio. Puede generar sensación de ahogo, retención de CO₂ y rechazo al tratamiento.",
  frequency: "Frecuente con fugas o Ti largo",
  relatedPathologies: ["EPOC", "Fugas de mascarilla", "Taquipnea"],
  generateCurves: () => generateLateCycling(),
  annotations: [
   { t: 0.8, curve: "pressure", label: "⏱️ Ciclado tardío" },
   { t: 3.8, curve: "pressure", label: "⏱️ Ciclado tardío" },
  ],
 },
 {
  id: "auto_peep",
  name: "Auto-PEEP / Atrapamiento",
  emoji: "🫧",
  color: "#10b981",
  tagline: "El aire queda atrapado en los pulmones ciclo a ciclo",
  definition:
   "Acumulación progresiva de aire en los pulmones debido a que la espiración es incompleta antes del siguiente ciclo inspiratorio. Genera una PEEP intrínseca adicional a la PEEP programada.",
  mechanism:
   "Cuando el tiempo espiratorio es insuficiente para que el volumen corriente salga completamente, queda un volumen residual. En el siguiente ciclo, el paciente parte de un volumen pulmonar mayor. Esto se acumula progresivamente generando hiperinsuflación dinámica.",
  whyHappens: [
   "FR de respaldo demasiado alta (poco tiempo para espirar entre ciclos)",
   "Obstrucción al flujo espiratorio (broncoespasmo, EPOC, secreciones)",
   "Ti demasiado largo que acorta el tiempo espiratorio",
   "IPAP muy alta que genera grandes volúmenes que tardan más en salir",
  ],
  howToIdentify: [
   "La curva de flujo espiratorio no llega a cero antes del siguiente ciclo",
   "La presión basal entre ciclos es mayor que el EPAP programado",
   "El volumen en la curva de volumen no vuelve a cero entre ciclos",
   "Clínicamente: el paciente usa músculos accesorios y tiene dificultad para triggerear",
  ],
  correction: [
   "Reducir la FR de respaldo para dar más tiempo espiratorio",
   "Aumentar el tiempo espiratorio (reducir Ti, reducir FR)",
   "Tratar la causa subyacente (broncodilatadores en EPOC, aspirar secreciones)",
   "Aumentar levemente el EPAP externo puede reducir el trabajo de trigger al contrarrestar el auto-PEEP",
  ],
  clinicalImpact:
   "Aumenta el trabajo inspiratorio porque el paciente debe vencer el auto-PEEP para triggerear. Puede llevar a fatiga muscular, falla de VMNI e inestabilidad hemodinámica.",
  frequency: "Muy frecuente en EPOC (hasta 50%)",
  relatedPathologies: ["EPOC", "Asma", "Obstrucción de vía aérea"],
  generateCurves: () => generateAutoPEEP(),
  annotations: [
   { t: 2.0, curve: "flow", label: "🫧 Flujo no llega a cero" },
   { t: 4.0, curve: "flow", label: "🫧 Flujo no llega a cero" },
  ],
 },
 {
  id: "asincronia_flujo",
  name: "Asincronía de Flujo",
  emoji: "📉",
  color: "#3b82f6",
  tagline: "El ventilador no entrega el flujo que el paciente necesita",
  definition:
   "El flujo entregado por el ventilador no satisface la demanda instantánea del paciente. La velocidad de presurización es insuficiente para la demanda ventilatoria del paciente.",
  mechanism:
   "El paciente tiene un drive respiratorio alto y necesita un flujo inspiratorio elevado rápidamente. Si el ventilador presuriza lentamente (rise time lento o IPAP baja), el paciente sigue generando esfuerzo durante la fase inspiratoria porque siente que no tiene suficiente flujo.",
  whyHappens: [
   "Rise time (tiempo de presurización) configurado demasiado lento",
   "IPAP insuficiente para la demanda ventilatoria del paciente",
   "Drive respiratorio muy elevado (SDRA, acidosis, hipoxemia severa)",
   "Resistencia aumentada en la vía aérea que limita el flujo entregado",
  ],
  howToIdentify: [
   "Deflexión negativa de presión al inicio de la inspiración (antes de alcanzar el IPAP)",
   "La curva de presión muestra una 'concavidad' al inicio en lugar de una rampa limpia",
   "El flujo inspiratorio no alcanza el pico esperado para el IPAP programado",
   "Clínicamente: el paciente parece 'hambriento de aire', usa músculos accesorios durante la inspiración",
  ],
  correction: [
   "Reducir el rise time (presurización más rápida) para satisfacer la demanda inmediata",
   "Aumentar el IPAP si la demanda es genuinamente alta",
   "Evaluar y tratar la causa del drive elevado (hipoxemia, acidosis, dolor)",
   "Cambiar a modo de control de volumen si la demanda es extremadamente alta",
  ],
  clinicalImpact:
   "Genera sensación de 'hambre de aire' (air hunger), uno de los síntomas más angustiantes para el paciente. Aumenta el trabajo respiratorio y puede llevar a agitación y rechazo al tratamiento.",
  frequency: "Común con drive respiratorio alto",
  relatedPathologies: [
   "SDRA",
   "Hipoxemia severa",
   "Acidosis metabólica severa",
  ],
  generateCurves: () => generateFlowHunger(),
  annotations: [
   { t: 0.3, curve: "pressure", label: "📉 Dip de demanda" },
   { t: 3.3, curve: "pressure", label: "📉 Dip de demanda" },
  ],
 },
];

// ─── Chart component ──────────────────────────────────────────────────────────

function AnimatedChart({
 data,
 field,
 label,
 unit,
 color,
 yMin,
 yMax,
 annotations = [],
 animationProgress,
}: {
 data: CurvePoint[];
 field: keyof CurvePoint;
 label: string;
 unit: string;
 color: string;
 yMin: number;
 yMax: number;
 annotations?: { t: number; label: string }[];
 animationProgress: number;
}) {
 const W = 560,
  H = 110;
 const PAD = { top: 10, right: 10, bottom: 22, left: 42 };
 const cW = W - PAD.left - PAD.right;
 const cH = H - PAD.top - PAD.bottom;
 const maxT = data[data.length - 1]?.t ?? 15;
 const visibleData = data.slice(
  0,
  Math.floor(data.length * animationProgress)
 );

 const xS = (t: number) => (t / maxT) * cW;
 const yS = (v: number) =>
  cH - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * cH;

 const pathD =
  visibleData.length < 2
   ? ""
   : visibleData
     .map(
      (p, i) =>
       `${i === 0 ? "M" : "L"}${xS(p.t).toFixed(1)},${yS(p[field] as number).toFixed(1)}`
     )
     .join(" ");

 const gridVals = [yMin, (yMin + yMax) / 2, yMax];

 return (
  <div>
   <div className="flex items-center gap-2 mb-1">
    <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
    <span className="text-xs font-semibold" style={{ color }}>
     {label}
    </span>
    <span className="text-xs text-gray-500">({unit})</span>
   </div>
   <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
    <g transform={`translate(${PAD.left},${PAD.top})`}>
     {/* Background */}
     <rect x={0} y={0} width={cW} height={cH} fill="#0f172a" rx={4} />

     {/* Grid */}
     {gridVals.map((v, i) => (
      <g key={i}>
       <line
        x1={0}
        y1={yS(v)}
        x2={cW}
        y2={yS(v)}
        stroke="#1e293b"
        strokeWidth={1}
       />
       <text
        x={-4}
        y={yS(v) + 3}
        textAnchor="end"
        fontSize={9}
        fill="#64748b"
       >
        {v.toFixed(0)}
       </text>
      </g>
     ))}

     {/* Zero line */}
     {yMin < 0 && (
      <line
       x1={0}
       y1={yS(0)}
       x2={cW}
       y2={yS(0)}
       stroke="#334155"
       strokeWidth={1}
       strokeDasharray="3,3"
      />
     )}

     {/* Curve */}
     {pathD && (
      <path
       d={pathD}
       fill="none"
       stroke={color}
       strokeWidth={2}
       strokeLinecap="round"
       strokeLinejoin="round"
      />
     )}

     {/* Glow effect */}
     {pathD && (
      <path
       d={pathD}
       fill="none"
       stroke={color}
       strokeWidth={4}
       strokeLinecap="round"
       strokeLinejoin="round"
       opacity={0.15}
      />
     )}

     {/* Annotations */}
     {animationProgress >= 0.99 &&
      annotations.map((ann, i) => (
       <g key={i} transform={`translate(${xS(ann.t)}, 0)`}>
        <line
         y1={0}
         y2={cH}
         stroke={color}
         strokeWidth={1}
         strokeDasharray="4,2"
         opacity={0.6}
        />
        <rect
         x={-2}
         y={2}
         width={ann.label.length * 5.5 + 4}
         height={13}
         fill="#0f172a"
         opacity={0.9}
         rx={2}
        />
        <text y={12} fontSize={8} fill={color} fontWeight="600">
         {ann.label}
        </text>
       </g>
      ))}

     {/* X axis */}
     <line
      x1={0}
      y1={cH}
      x2={cW}
      y2={cH}
      stroke="#334155"
      strokeWidth={1}
     />
     {[0, 3, 6, 9, 12, 15]
      .filter(t => t <= maxT)
      .map(t => (
       <text
        key={t}
        x={xS(t)}
        y={cH + 14}
        textAnchor="middle"
        fontSize={9}
        fill="#475569"
       >
        {t}s
       </text>
      ))}
    </g>
   </svg>
  </div>
 );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VMNIAsynchronyTeacher() {
 const [lessonIndex, setLessonIndex] = useState(0);
 const [activeTab, setActiveTab] = useState<
  "curves" | "info" | "identify" | "correct"
 >("curves");
 const [animProgress, setAnimProgress] = useState(1);
 const [isAnimating, setIsAnimating] = useState(false);
 const [curveData, setCurveData] = useState<CurvePoint[]>([]);
 const animRef = useRef<number>(0);
 const startTimeRef = useRef<number>(0);
 const ANIM_DURATION = 3000;

 const lesson = LESSONS[lessonIndex];

 useEffect(() => {
  setCurveData(lesson.generateCurves());
  setAnimProgress(1);
  setIsAnimating(false);
  setActiveTab("curves");
 }, [lessonIndex]);

 const startAnimation = () => {
  setIsAnimating(true);
  setAnimProgress(0);
  startTimeRef.current = performance.now();
  const animate = (now: number) => {
   const elapsed = now - startTimeRef.current;
   const progress = Math.min(1, elapsed / ANIM_DURATION);
   setAnimProgress(progress);
   if (progress < 1) {
    animRef.current = requestAnimationFrame(animate);
   } else {
    setIsAnimating(false);
    setAnimProgress(1);
   }
  };
  animRef.current = requestAnimationFrame(animate);
 };

 const resetAnimation = () => {
  if (animRef.current) cancelAnimationFrame(animRef.current);
  setIsAnimating(false);
  setAnimProgress(1);
 };

 const handleSliderChange = (val: number[]) => {
  if (isAnimating) resetAnimation();
  setAnimProgress(val[0]);
 };

 useEffect(
  () => () => {
   if (animRef.current) cancelAnimationFrame(animRef.current);
  },
  []
 );

 const pressureAnnotations = lesson.annotations
  .filter(a => a.curve === "pressure")
  .map(a => ({ t: a.t, label: a.label }));
 const flowAnnotations = lesson.annotations
  .filter(a => a.curve === "flow")
  .map(a => ({ t: a.t, label: a.label }));

 const tabs = [
  { id: "curves" as const, label: "Curvas", icon: "📈" },
  { id: "info" as const, label: "¿Por qué ocurre?", icon: "🔬" },
  { id: "identify" as const, label: "¿Cómo identificar?", icon: "🔍" },
  { id: "correct" as const, label: "Corrección", icon: "🔧" },
 ];

 return (
  <div className="min-h-screen bg-slate-950 text-slate-100">
   {/* Top bar */}
   <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
     <div className="flex items-center gap-3">
      <span className="text-xl">🫁</span>
      <div>
       <h1 className="font-bold text-white text-sm">
        Asincronías en VMNI
       </h1>
       <p className="text-xs text-slate-500">
        Módulo educativo interactivo
       </p>
      </div>
     </div>
     <div className="flex items-center gap-1">
      {LESSONS.map((l, i) => (
       <button
        key={l.id}
        onClick={() => setLessonIndex(i)}
        title={l.name}
        className={`w-7 h-7 rounded-full text-sm transition-all ${i === lessonIndex ? "scale-110 ring-2 ring-offset-1 ring-offset-slate-900" : "opacity-50 hover:opacity-80"}`}
        style={
         i === lessonIndex
          ? ({ "--tw-ring-color": l.color } as React.CSSProperties)
          : {}
        }
       >
        {l.emoji}
       </button>
      ))}
     </div>
    </div>
   </div>

   <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
    {/* Lesson header */}
    <div
     className="rounded-2xl p-5 border"
     style={{
      backgroundColor: lesson.color + "10",
      borderColor: lesson.color + "30",
     }}
    >
     <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
       <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{lesson.emoji}</span>
        <div>
         <h2 className="text-xl font-bold text-white">
          {lesson.name}
         </h2>
         <p className="text-sm" style={{ color: lesson.color }}>
          {lesson.tagline}
         </p>
        </div>
       </div>
       <p className="text-sm text-slate-300 leading-relaxed">
        {lesson.definition}
       </p>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
       {lesson.frequency !== "Referencia" && (
        <span
         className="text-xs px-3 py-1 rounded-full border text-center"
         style={{
          borderColor: lesson.color + "40",
          color: lesson.color,
          backgroundColor: lesson.color + "10",
         }}
        >
         {lesson.frequency}
        </span>
       )}
       {lesson.relatedPathologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
         {lesson.relatedPathologies.map(p => (
          <span
           key={p}
           className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full"
          >
           {p}
          </span>
         ))}
        </div>
       )}
      </div>
     </div>
    </div>

    {/* Navigation */}
    <div className="flex gap-2 overflow-x-auto pb-1">
     {tabs.map(tab => (
      <button
       key={tab.id}
       onClick={() => setActiveTab(tab.id)}
       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"}`}
       style={
        activeTab === tab.id
         ? {
           backgroundColor: lesson.color + "25",
           color: lesson.color,
           border: `1px solid ${lesson.color}40`,
          }
         : {}
       }
      >
       <span>{tab.icon}</span>
       {tab.label}
      </button>
     ))}
    </div>

    {/* Content */}
    {activeTab === "curves" && (
     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
       <h3 className="font-semibold text-white">
        Curvas características
       </h3>
       <div className="flex gap-2">
        <button
         onClick={resetAnimation}
         className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
         <RotateCcw className="w-4 h-4" />
        </button>
        <button
         onClick={isAnimating ? resetAnimation : startAnimation}
         className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors text-slate-950"
         style={{ backgroundColor: lesson.color }}
        >
         {isAnimating ? (
          <Pause className="w-4 h-4" />
         ) : (
          <Play className="w-4 h-4" />
         )}
         {isAnimating
          ? "Pausar"
          : animProgress > 0
           ? "Repetir"
           : "Animar"}
        </button>
       </div>
      </div>

      <div className="space-y-3">
       <AnimatedChart
        data={curveData}
        field="pressure"
        label="Presión"
        unit="cmH₂O"
        color="#06b6d4"
        yMin={0}
        yMax={28}
        annotations={pressureAnnotations}
        animationProgress={animProgress}
       />
       <AnimatedChart
        data={curveData}
        field="flow"
        label="Flujo"
        unit="L/min"
        color="#10b981"
        yMin={-60}
        yMax={65}
        annotations={flowAnnotations}
        animationProgress={animProgress}
       />
       <AnimatedChart
        data={curveData}
        field="volume"
        label="Volumen"
        unit="mL"
        color="#8b5cf6"
        yMin={0}
        yMax={700}
        annotations={[]}
        animationProgress={animProgress}
       />
      </div>

      <div className="pt-4 flex items-center gap-3">
       <span className="text-xs text-slate-500 font-mono w-4 text-right">
        0s
       </span>
       <Slider
        value={[animProgress]}
        max={1}
        step={0.01}
        onValueChange={handleSliderChange}
        className="flex-1 cursor-ew-resize"
       />
       <span className="text-xs text-slate-500 font-mono w-6">15s</span>
      </div>

      {!isAnimating && animProgress === 1 && (
       <p className="text-xs text-slate-500 text-center">
        Presiona <strong>Animar</strong> o usa el control deslizante
        para analizar las curvas 🎬
       </p>
      )}
     </div>
    )}

    {activeTab === "info" && (
     <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
       <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔬</span>
        <h3 className="font-semibold text-white">
         Mecanismo fisiopatológico
        </h3>
       </div>
       <p className="text-slate-300 text-sm leading-relaxed">
        {lesson.mechanism}
       </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
       <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">❓</span>
        <h3 className="font-semibold text-white">¿Por qué ocurre?</h3>
       </div>
       <ul className="space-y-2">
        {lesson.whyHappens.map((reason, i) => (
         <li
          key={i}
          className="flex items-start gap-3 text-sm text-slate-300"
         >
          <span
           className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 mt-0.5"
           style={{ backgroundColor: lesson.color }}
          >
           {i + 1}
          </span>
          {reason}
         </li>
        ))}
       </ul>
      </div>

      {lesson.clinicalImpact && lesson.id !== "normal" && (
       <div
        className="rounded-2xl p-5 border"
        style={{
         backgroundColor: "#ef444410",
         borderColor: "#ef444430",
        }}
       >
        <div className="flex items-center gap-2 mb-2">
         <AlertTriangle className="w-4 h-4 text-red-400" />
         <h3 className="font-semibold text-red-400">
          Impacto clínico
         </h3>
        </div>
        <p className="text-sm text-slate-300">
         {lesson.clinicalImpact}
        </p>
       </div>
      )}
     </div>
    )}

    {activeTab === "identify" && (
     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
       <span className="text-lg">🔍</span>
       <h3 className="font-semibold text-white">
        Cómo identificarla en las curvas
       </h3>
      </div>
      <div className="space-y-3">
       {lesson.howToIdentify.map((sign, i) => (
        <div
         key={i}
         className="flex items-start gap-3 p-3 bg-slate-800 rounded-xl text-sm text-slate-200"
        >
         <span className="flex-shrink-0 text-base">
          {i === 0 ? "📈" : i === 1 ? "📉" : i === 2 ? "📊" : "👁️"}
         </span>
         {sign}
        </div>
       ))}
      </div>
     </div>
    )}

    {activeTab === "correct" && (
     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
       <Wrench className="w-4 h-4" style={{ color: lesson.color }} />
       <h3 className="font-semibold text-white">Cómo corregirla</h3>
      </div>
      <div className="space-y-3">
       {lesson.correction.map((step, i) => (
        <div
         key={i}
         className="flex items-start gap-3 p-3 rounded-xl text-sm border"
         style={{
          backgroundColor: lesson.color + "08",
          borderColor: lesson.color + "25",
         }}
        >
         <span
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 mt-0.5"
          style={{ backgroundColor: lesson.color }}
         >
          {i + 1}
         </span>
         <span className="text-slate-200">{step}</span>
        </div>
       ))}
      </div>
     </div>
    )}

    {/* Navigation buttons */}
    <div className="flex items-center justify-between pt-2">
     <button
      onClick={() => setLessonIndex(Math.max(0, lessonIndex - 1))}
      disabled={lessonIndex === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
     >
      <ChevronLeft className="w-4 h-4" />
      Anterior
     </button>

     <div className="flex gap-1.5">
      {LESSONS.map((_, i) => (
       <button
        key={i}
        onClick={() => setLessonIndex(i)}
        className="w-2 h-2 rounded-full transition-all"
        style={{
         backgroundColor: i === lessonIndex ? lesson.color : "#334155",
         transform: i === lessonIndex ? "scale(1.3)" : "scale(1)",
        }}
       />
      ))}
     </div>

     <button
      onClick={() =>
       setLessonIndex(Math.min(LESSONS.length - 1, lessonIndex + 1))
      }
      disabled={lessonIndex === LESSONS.length - 1}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-950"
      style={{ backgroundColor: lesson.color }}
     >
      Siguiente
      <ChevronRight className="w-4 h-4" />
     </button>
    </div>
   </div>
  </div>
 );
}
