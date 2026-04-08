/**
 * VMI Wave Generator
 * Based on the Equation of Motion: Paw = PEEP + (V / C) + (R * Flow)
 */

export interface VMIWavePoint {
  time: number;
  pressure: number;
  flow: number;
  volume: number;
}

export interface VMISettings {
  mode: 'PCV' | 'VCV';
  rr: number; // Respiratory Rate (bpm)
  peep: number; // cmH2O
  resistance: number; // cmH2O/L/s (Typical: 5-10)
  compliance: number; // L/cmH2O (Typical: 0.05 - 0.1)
  ieRatio: number; // 1:X (Typical: 2 for 1:2)
  
  // PCV Specific
  pi: number; // Pressure above PEEP (cmH2O)
  
  // VCV Specific
  vt: number; // Tidal Volume (L)
  flowPattern: 'SQUARE' | 'RAMP';
}

/**
 * Generates a full VMI breath cycle
 */
export function generateVMIBreath(
  settings: VMISettings,
  sampleRate: number = 100 // Hz
): VMIWavePoint[] {
  const points: VMIWavePoint[] = [];
  const breathDuration = 60 / settings.rr; // seconds
  const inspiratoryTime = breathDuration / (1 + settings.ieRatio);
  const expiratoryTime = breathDuration - inspiratoryTime;
  
  const totalSamples = Math.floor(breathDuration * sampleRate);
  const insSamples = Math.floor(inspiratoryTime * sampleRate);
  
  // Internal state
  let currentVolume = 0;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const isInspiration = i < insSamples;
    let flow = 0;
    let pressure = settings.peep;
    
    if (isInspiration) {
      if (settings.mode === 'PCV') {
        // Pressure is constant (Ppeak = PEEP + Pi)
        // Flow decays exponentially: Flow = (Pi / R) * exp(-t / (R*C))
        const timeInIns = t;
        const timeConstant = settings.resistance * settings.compliance;
        flow = (settings.pi / settings.resistance) * Math.exp(-timeInIns / timeConstant);
        pressure = settings.peep + settings.pi;
      } else {
        // VCV: Flow is constant (for SQUARE pattern)
        // flow = VT / Ti
        flow = settings.vt / inspiratoryTime;
        // Pressure rises: Paw = PEEP + (V/C) + R * Flow
        pressure = settings.peep + (currentVolume / settings.compliance) + (settings.resistance * flow);
      }
      currentVolume += flow * (1 / sampleRate);
    } else {
      // Expiration: Passive
      // Flow = -(P_alv / R) * exp(-t_exp / RC)
      // P_alv at end of ins = PEEP + (V_end_ins / C)
      const timeInExp = t - inspiratoryTime;
      const timeConstant = settings.resistance * settings.compliance;
      const initialPeakPressure = currentVolume / settings.compliance;
      flow = -(initialPeakPressure / settings.resistance) * Math.exp(-timeInExp / timeConstant);
      
      // Volume decays
      currentVolume += flow * (1 / sampleRate);
      if (currentVolume < 0) currentVolume = 0;
      
      // Pressure at airway during expiration is PEEP (assuming no resistance in circuit for now)
      pressure = settings.peep; 
    }
    
    points.push({
      time: t,
      pressure,
      flow,
      volume: currentVolume
    });
  }
  
  return points;
}

/**
 * Helper to generate continuous points for a chart
 */
export function generateVMIContinuous(
  settings: VMISettings,
  absoluteTime: number,
  sampleRate: number = 60
): VMIWavePoint {
  const breathDuration = 60 / settings.rr;
  const tInBreath = absoluteTime % breathDuration;
  
  const inspiratoryTime = breathDuration / (1 + settings.ieRatio);
  const isInspiration = tInBreath < inspiratoryTime;
  
  let flow = 0;
  let pressure = settings.peep;
  let volume = 0;

  const timeConstant = settings.resistance * settings.compliance;

  if (isInspiration) {
    if (settings.mode === 'PCV') {
      flow = (settings.pi / settings.resistance) * Math.exp(-tInBreath / timeConstant);
      pressure = settings.peep + settings.pi;
      // Volume is integration of flow: V(t) = Pi * C * (1 - exp(-t/RC))
      volume = settings.pi * settings.compliance * (1 - Math.exp(-tInBreath / timeConstant));
    } else {
      flow = settings.vt / inspiratoryTime;
      volume = flow * tInBreath;
      pressure = settings.peep + (volume / settings.compliance) + (settings.resistance * flow);
    }
  } else {
    // Expiration
    const tInExp = tInBreath - inspiratoryTime;
    const vEndIns = settings.mode === 'PCV' 
      ? settings.pi * settings.compliance * (1 - Math.exp(-inspiratoryTime / timeConstant))
      : settings.vt;
    
    const initialPeakPressure = vEndIns / settings.compliance;
    flow = -(initialPeakPressure / settings.resistance) * Math.exp(-tInExp / timeConstant);
    volume = vEndIns * Math.exp(-tInExp / timeConstant);
    pressure = settings.peep;
  }

  return { time: absoluteTime, pressure, flow, volume };
}
