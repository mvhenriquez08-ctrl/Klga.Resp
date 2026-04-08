/**
 * ECG Wave Generator - Estándares clínicos
 * Todos los tiempos internos en segundos.
 * La función recibe `t` en segundos absolutos y devuelve voltaje en mV.
 * El llamador pasa t = tiempo_global para animación continua.
 */

export interface ECGWaveParams {
  heartRate: number;       // bpm
  prInterval: number;      // ms
  qrsWidth: number;        // ms
  qtInterval: number;      // ms
  pAmplitude: number;      // mV
  rAmplitude: number;      // mV
  tAmplitude: number;      // mV
  stSegmentShift: number;  // mV
}

export const NORMAL_ECG_PARAMS: ECGWaveParams = {
  heartRate: 72,
  prInterval: 160,
  qrsWidth: 80,
  qtInterval: 400,
  pAmplitude: 0.25,
  rAmplitude: 1.5,
  tAmplitude: 0.45,
  stSegmentShift: 0,
};

/**
 * Genera un pulso gaussiano — más suave que sin, ideal para P y T
 */
const gaussian = (x: number, center: number, width: number): number => {
  const d = (x - center) / width;
  return Math.exp(-0.5 * d * d);
};

/**
 * Genera UN ciclo ECG completo.
 * @param phase  0..1 — posición dentro del ciclo cardíaco
 * @param p      Parámetros clínicos
 */
export const generateNormalECGWave = (
  phase: number,
  p: ECGWaveParams = NORMAL_ECG_PARAMS
): number => {
  const ph = ((phase % 1) + 1) % 1; // siempre 0..1

  const cycleSec = 60 / p.heartRate;           // duración del ciclo en segundos
  const t = ph * cycleSec;                      // tiempo dentro del ciclo (seg)

  // --- Duraciones en segundos ---
  const pDur     = 0.08;
  const prSec    = p.prInterval  / 1000;        // inicio del QRS
  const qrsSec   = p.qrsWidth    / 1000;
  const qtSec    = p.qtInterval  / 1000;

  // Centros de cada onda (en segundos desde el inicio del ciclo)
  const pCenter  = prSec - pDur / 2 - 0.01;    // onda P centrada antes del QRS

  const qStart   = prSec;
  const qEnd     = qStart + qrsSec * 0.25;
  const rCenter  = qStart + qrsSec * 0.50;
  const sStart   = qStart + qrsSec * 0.65;
  const sEnd     = qStart + qrsSec;

  const stStart  = qStart + qrsSec;
  const stEnd    = stStart + 0.08;

  const tCenter  = (qtSec + stStart) / 2;
  const tSigma   = (qtSec - stEnd) * 0.35;

  let v = 0;

  // ONDA P — gaussiana suave
  v += p.pAmplitude * gaussian(t, pCenter, pDur * 0.38);

  // ONDA Q — deflexión negativa breve
  if (t >= qStart && t < qEnd) {
    const q = (t - qStart) / (qEnd - qStart);
    v += -p.rAmplitude * 0.15 * Math.sin(q * Math.PI);
  }

  // ONDA R — pico positivo pronunciado (triangular suavizado)
  const rSigma = qrsSec * 0.18;
  v += p.rAmplitude * gaussian(t, rCenter, rSigma);

  // ONDA S — deflexión negativa post-R
  if (t >= sStart && t < sEnd) {
    const s = (t - sStart) / (sEnd - sStart);
    v += -p.rAmplitude * 0.25 * Math.sin(s * Math.PI);
  }

  // SEGMENTO ST — línea base con posible elevación/depresión
  if (t >= stStart && t < stEnd) {
    v += p.stSegmentShift;
  }

  // ONDA T — gaussiana amplia y positiva
  if (t >= stEnd && t < qtSec + 0.04) {
    v += p.tAmplitude * gaussian(t, tCenter, tSigma);
  }

  return v;
};

// ─── Arritmias ────────────────────────────────────────────────────────────────

export const generateSinusTachycardia = (phase: number): number =>
  generateNormalECGWave(phase, { ...NORMAL_ECG_PARAMS, heartRate: 125 });

export const generateSinusBradycardia = (phase: number): number =>
  generateNormalECGWave(phase, { ...NORMAL_ECG_PARAMS, heartRate: 42 });

export const generateFirstDegreeAVBlock = (phase: number): number =>
  generateNormalECGWave(phase, { ...NORMAL_ECG_PARAMS, prInterval: 260 });

export const generateSTElevationMI = (phase: number): number =>
  generateNormalECGWave(phase, {
    ...NORMAL_ECG_PARAMS,
    stSegmentShift: 0.35,
    rAmplitude: 1.0,
    tAmplitude: 0.6,
  });

/**
 * Fibrilación Auricular — sin onda P, QRS irregular, ondas f caóticas
 */
export const generateAtrialFibrillation = (phase: number): number => {
  const ph = ((phase % 1) + 1) % 1;

  // Ondas f — fibrilación auricular (alta frecuencia, baja amplitud)
  const fWaves =
    0.06 * Math.sin(ph * Math.PI * 2 * 6.5) +
    0.05 * Math.sin(ph * Math.PI * 2 * 8.3) +
    0.04 * Math.sin(ph * Math.PI * 2 * 11.1);

  // QRS irregular — aparece en posiciones variables
  const beats = [0.15, 0.42, 0.61, 0.83]; // posiciones irregulares
  let qrs = 0;
  for (const b of beats) {
    const d = ph - b;
    if (Math.abs(d) < 0.04) {
      const q = (d + 0.04) / 0.08;
      qrs += 1.4 * Math.sin(q * Math.PI);
      // onda T pequeña
      if (d > 0.01 && d < 0.07) {
        qrs += 0.25 * Math.sin(((d - 0.01) / 0.06) * Math.PI);
      }
    }
  }

  return fWaves + qrs;
};

/**
 * Fibrilación Ventricular — caos total, amplitud variable
 */
export const generateVentricularFibrillation = (phase: number): number => {
  const x = phase * Math.PI * 2;
  const noise =
    0.5  * Math.sin(x * 4.7 + 1.2) +
    0.4  * Math.sin(x * 7.3 + 2.4) +
    0.35 * Math.sin(x * 11.1 + 0.8) +
    0.25 * Math.sin(x * 13.7 + 3.1) +
    0.2  * Math.sin(x * 17.3 + 1.7);
  const envelope = 0.7 + 0.3 * Math.sin(x * 0.9);
  return noise * envelope;
};

/**
 * Taquicardia Ventricular — QRS ancho, morfología bizarra, rápido
 */
export const generateVentricularTachycardia = (phase: number): number => {
  const ph = ((phase % 1) + 1) % 1;

  // QRS muy ancho (0.14 s = ~17% del ciclo a 120 bpm)
  const qrsCenter = 0.18;
  const qrsW = 0.08;

  let v = 0;
  // Onda principal positiva ancha
  v += 1.8 * gaussian(ph, qrsCenter, qrsW);
  // Muesca característica
  v += -0.4 * gaussian(ph, qrsCenter + 0.05, 0.02);
  // Onda T invertida y amplia
  v += -0.5 * gaussian(ph, 0.52, 0.09);

  return v;
};

/**
 * Extrasístoles Ventriculares (PVC) — latido normal seguido de PVC
 */
export const generatePrematureVentricularContractions = (phase: number): number => {
  const ph = ((phase % 1) + 1) % 1;

  // Latido sinusal normal (ocupa 55% del ciclo)
  if (ph < 0.55) {
    return generateNormalECGWave(ph / 0.55);
  }

  // PVC: QRS ancho prematuro
  const pvcPhase = (ph - 0.55) / 0.45;
  const pp = pvcPhase;

  let v = 0;
  if (pp < 0.3) {
    v = 1.9 * Math.sin((pp / 0.3) * Math.PI);
  } else if (pp < 0.65) {
    const t = (pp - 0.3) / 0.35;
    v = -0.55 * Math.sin(t * Math.PI);
  }
  return v;
};

/**
 * Aleteo Auricular — ondas F en diente de sierra, bloqueo 2:1
 */
export const generateAtrialFlutter = (phase: number): number => {
  const ph = ((phase % 1) + 1) % 1;

  // Ondas F (diente de sierra a ~300/min → ~5 por ciclo visible)
  const flutterF = -0.18 * (((ph * 5) % 1) - 0.5) * 2;

  // QRS normal cada 2 ondas F (bloqueo 2:1)
  const beats = [0.2, 0.7];
  let qrs = 0;
  for (const b of beats) {
    const d = ph - b;
    if (Math.abs(d) < 0.06) {
      const q = (d + 0.06) / 0.12;
      qrs += 1.4 * Math.sin(q * Math.PI);
      if (d > 0.02 && d < 0.09) {
        qrs += 0.3 * Math.sin(((d - 0.02) / 0.07) * Math.PI);
      }
    }
  }

  return flutterF + qrs;
};

/**
 * Asistolia — línea plana con artefacto mínimo
 */
export const generateAsystole = (_phase: number): number =>
  (Math.random() - 0.5) * 0.015;
