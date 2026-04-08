/**
 * Hemodynamics Wave Generator
 * Provides high-fidelity Arterial Line and CVP waveforms
 */

export interface HemoWavePoint {
  time: number;
  artLine: number;
  cvp: number;
}

export interface HemoSettings {
  hr: number; // Heart Rate (bpm)
  sbp: number; // Systolic Blood Pressure (mmHg)
  dbp: number; // Diastolic Blood Pressure (mmHg)
  cvpAvg: number; // Average CVP (mmHg)
}

/**
 * Generates a synthetic Arterial Line point
 * Uses a sum of Gaussians or piecewise logic for high fidelity
 */
export function generateArtLinePoint(
  tInCycle: number,
  cycleDuration: number,
  sbp: number,
  dbp: number
): number {
  const pulsePressure = sbp - dbp;
  
  // Systolic rise (0 to 0.15 of cycle)
  const tSys = 0.3 * cycleDuration; // Duration of systole
  const tNotch = 0.4 * cycleDuration; // When dicrotic notch occurs
  
  if (tInCycle < tSys) {
    // Systolic upstroke and peak
    // Using a sine-like or Gaussian-like curve for the peak
    const peakT = tSys * 0.4;
    return dbp + pulsePressure * Math.sin((Math.PI / 2) * (tInCycle / peakT));
  } else if (tInCycle < tNotch) {
    // Decay towards notch
    const startVal = sbp;
    const endVal = dbp + pulsePressure * 0.7; // Notch pressure
    const tRelative = (tInCycle - tSys) / (tNotch - tSys);
    return startVal - (startVal - endVal) * tRelative;
  } else if (tInCycle < tNotch + 0.1 * cycleDuration) {
    // Dicrotic wave (small bounce)
    const tRelative = (tInCycle - tNotch) / (0.1 * cycleDuration);
    const notchVal = dbp + pulsePressure * 0.7;
    const bounceVal = dbp + pulsePressure * 0.75;
    return notchVal + (bounceVal - notchVal) * Math.sin(Math.PI * tRelative);
  } else {
    // Diastolic decay
    const tRelative = (tInCycle - (tNotch + 0.1 * cycleDuration)) / (cycleDuration - (tNotch + 0.1 * cycleDuration));
    const startVal = dbp + pulsePressure * 0.7;
    return startVal - (startVal - dbp) * tRelative;
  }
}

/**
 * Generates a synthetic CVP point (a, c, v waves)
 */
export function generateCVPPoint(
  tInCycle: number,
  cycleDuration: number,
  avg: number
): number {
  // a wave (atrial contraction) - start of cycle
  // c wave (ventricular contraction/tricuspid bulge) - mid cycle
  // v wave (venous filling) - end of cycle
  
  const aWave = 2 * Math.exp(-Math.pow((tInCycle - 0.1 * cycleDuration) / (0.05 * cycleDuration), 2));
  const cWave = 1 * Math.exp(-Math.pow((tInCycle - 0.35 * cycleDuration) / (0.05 * cycleDuration), 2));
  const vWave = 2 * Math.exp(-Math.pow((tInCycle - 0.7 * cycleDuration) / (0.1 * cycleDuration), 2));
  
  return avg + aWave + cWave + vWave;
}

/**
 * Helper to generate continuous points
 */
export function generateHemoContinuous(
  settings: HemoSettings,
  absoluteTime: number
): HemoWavePoint {
  const cycleDuration = 60 / settings.hr;
  const tInCycle = absoluteTime % cycleDuration;
  
  const artLine = generateArtLinePoint(tInCycle, cycleDuration, settings.sbp, settings.dbp);
  const cvp = generateCVPPoint(tInCycle, cycleDuration, settings.cvpAvg);
  
  return { time: absoluteTime, artLine, cvp };
}
