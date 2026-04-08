/**
 * ECG Wave Generator - Basado en estándares clínicos del paper
 * Parámetros: 25 mm/seg, 10 mm/mV (0.1 mV por mm)
 * 
 * Calibración:
 * - Tiempo: 0.04 seg por cuadrícula pequeña, 0.2 seg por cuadrícula grande
 * - Voltaje: 0.1 mV por cuadrícula pequeña, 0.5 mV por cuadrícula grande
 */

export interface ECGWaveParams {
  heartRate: number;
  prInterval: number; // ms
  qrsWidth: number; // ms
  qtInterval: number; // ms
  pAmplitude: number; // mV
  qAmplitude: number; // mV (negativo)
  rAmplitude: number; // mV
  sAmplitude: number; // mV (negativo)
  tAmplitude: number; // mV
  stSegmentShift: number; // mV
}

// Parámetros normales refinados según estándares clínicos
export const NORMAL_ECG_PARAMS: ECGWaveParams = {
  heartRate: 72,
  prInterval: 160,
  qrsWidth: 80,
  qtInterval: 400,
  pAmplitude: 0.15,
  qAmplitude: -0.1,
  rAmplitude: 1.0,
  sAmplitude: -0.3,
  tAmplitude: 0.4,
  stSegmentShift: 0,
};

/**
 * Genera una onda ECG normal basada en parámetros clínicos de alta fidelidad
 * @param time Tiempo absoluto en segundos
 * @param p Parámetros ECG
 * @returns Valor de voltaje en mV
 */
export const generateNormalECGWave = (time: number, p: ECGWaveParams = NORMAL_ECG_PARAMS): number => {
  // Fase del ciclo (0 a 1)
  const phase = (time * p.heartRate / 60) % 1;
  const cycleMs = 60000 / p.heartRate;

  // Duraciones relativas al ciclo (calculadas a partir de milisegundos clínicos)
  const pEnd = 80 / cycleMs;
  const prEnd = p.prInterval / cycleMs;
  
  const qStart = prEnd;
  const qEnd = qStart + 20 / cycleMs; // Onda Q: ~20ms
  const rEnd = qEnd + 50 / cycleMs;   // Onda R: ~50ms
  const sEnd = rEnd + (p.qrsWidth - 70) / cycleMs; // Onda S: resto del QRS
  
  const stEnd = sEnd + 50 / cycleMs;  // Segmento ST: ~50ms
  const qtEnd = p.qtInterval / cycleMs;

  let v = 0;

  // ONDA P: Positiva y redondeada
  if (phase < pEnd) {
    const x = phase / pEnd;
    v = p.pAmplitude * Math.sin(Math.PI * x);
  }
  // SEGMENTO PR: Isoelectrónico
  else if (phase < prEnd) {
    v = 0;
  }
  // ONDA Q: Deflexión negativa pequeña
  else if (phase < qEnd) {
    const x = (phase - qStart) / (qEnd - qStart);
    v = p.qAmplitude * Math.sin(Math.PI * x);
  }
  // ONDA R: Deflexión positiva principal
  else if (phase < rEnd) {
    const x = (phase - qEnd) / (rEnd - qEnd);
    v = p.rAmplitude * Math.sin(Math.PI * x);
  }
  // ONDA S: Deflexión negativa post-R
  else if (phase < sEnd) {
    const x = (phase - rEnd) / (sEnd - rEnd);
    v = p.sAmplitude * Math.sin(Math.PI * x);
  }
  // SEGMENTO ST: Posible elevación/depresión
  else if (phase < stEnd) {
    v = p.stSegmentShift;
  }
  // ONDA T: Positiva y redondeada (lenta)
  else if (phase < qtEnd) {
    const x = (phase - stEnd) / (qtEnd - stEnd);
    v = p.tAmplitude * Math.sin(Math.PI * x);
  }
  // LÍNEA DE BASE
  else {
    v = 0;
  }

  return v;
};

/**
 * Genera onda de Fibrilación Auricular
 * Características: Ondas f caóticas, ritmo irregular, sin onda P clara
 */
export const generateAtrialFibrillation = (time: number): number => {
  // En FA el ritmo es "irregularmente irregular"
  // Simulamos esto variando ligeramente el tiempo efectivo
  const heartRate = 110;
  const cycleSec = 60 / heartRate;
  
  // Añadir una pequeña variación caótica al tiempo para el ritmo ventricular
  const jitter = 0.15 * Math.sin(time * 0.8) + 0.05 * Math.sin(time * 3.1);
  const effectiveTime = time + jitter;
  const phase = (effectiveTime / cycleSec) % 1;
  
  // Ondas f caóticas (pequeñas oscilaciones de la línea base)
  const fWaves = 
    0.12 * Math.sin(time * 25) +
    0.08 * Math.sin(time * 42) +
    0.06 * Math.random();
  
  let value = 0;
  
  // QRS estrecho (asumiendo conducción normal)
  if (phase < 0.05) {
    const x = phase / 0.05;
    value = 1.2 * Math.sin(Math.PI * x);
  }
  // Onda T
  else if (phase < 0.25) {
    const x = (phase - 0.05) / 0.20;
    value = 0.4 * Math.sin(Math.PI * x);
  }
  
  return value + fWaves;
};

/**
 * Genera onda de Fibrilación Ventricular
 * Características: Patrón completamente caótico, sin componentes reconocibles
 */
export const generateVentricularFibrillation = (time: number): number => {
  const x = time * 2; // Factor de velocidad para FV caótica {
  // Ruido blanco con múltiples frecuencias
  const noise1 = Math.sin(x * Math.PI * 47) * 0.3;
  const noise2 = Math.sin(x * Math.PI * 73) * 0.25;
  const noise3 = Math.sin(x * Math.PI * 101) * 0.2;
  const noise4 = Math.sin(x * Math.PI * 13) * 0.15;
  
  // Amplitud variable
  const amplitude = 0.5 + 0.3 * Math.sin(x * Math.PI * 3);
  
  return (noise1 + noise2 + noise3 + noise4) * amplitude;
};

/**
 * Genera onda de Taquicardia Sinusal
 * Características: Ritmo regular rápido, componentes normales pero frecuencia elevada
 */
export const generateSinusTachycardia = (x: number): number => {
  const params: ECGWaveParams = {
    ...NORMAL_ECG_PARAMS,
    heartRate: 120, // Elevada
  };
  return generateNormalECGWave(x, params);
};

/**
 * Genera onda de Bradicardia Sinusal
 * Características: Ritmo regular lento, componentes normales pero frecuencia reducida
 */
export const generateSinusBradycardia = (x: number): number => {
  const params: ECGWaveParams = {
    ...NORMAL_ECG_PARAMS,
    heartRate: 45, // Reducida
  };
  return generateNormalECGWave(x, params);
};

/**
 * Genera onda de Bloqueo AV de Primer Grado
 * Características: Intervalo PR prolongado (> 0.2 seg)
 */
export const generateFirstDegreeAVBlock = (x: number): number => {
  const params: ECGWaveParams = {
    ...NORMAL_ECG_PARAMS,
    prInterval: 240, // Prolongado
  };
  return generateNormalECGWave(x, params);
};

/**
 * Genera onda de Taquicardia Ventricular
 * Características: QRS ancho (> 0.12 seg), ritmo rápido
 */
export const generateVentricularTachycardia = (time: number): number => {
  const heartRate = 180;
  const phase = (time * heartRate / 60) % 1;
  const cycleMs = 60000 / heartRate;
  
  const qrsEnd = 100 / cycleMs; // QRS ancho ~100ms
  const tEnd = 300 / cycleMs;   // Onda T ~200ms después

  if (phase < qrsEnd) {
    // QRS ancho y alto
    const x = phase / qrsEnd;
    return 2.0 * Math.sin(Math.PI * x);
  } else if (phase < tEnd) {
    // T invertida característica de TV
    const x = (phase - qrsEnd) / (tEnd - qrsEnd);
    return -0.8 * Math.sin(Math.PI * x);
  }
  return 0;
};

/**
 * Genera onda de Extrasístoles Ventriculares (PVC)
 * Características: QRS prematuro y ancho, onda T invertida
 */
export const generatePrematureVentricularContractions = (time: number): number => {
  const heartRate = 72;
  const cycleSec = 60 / heartRate;
  const phase = (time / (cycleSec * 2)) % 1; // Un ciclo de 2 latidos
  
  if (phase < 0.5) {
    // Latido normal (primera mitad del ciclo doble)
    return generateNormalECGWave(time);
  } else if (phase < 0.65) {
    // PVC prematuro y ancho
    const x = (phase - 0.5) / 0.15;
    return 1.8 * Math.sin(Math.PI * x);
  } else if (phase < 0.8) {
    // Onda T invertida compensatoria
    const x = (phase - 0.65) / 0.15;
    return -0.6 * Math.sin(Math.PI * x);
  }
  // Pausa compensatoria
  return 0;
};

/**
 * Genera onda de Aleteo Auricular
 * Características: Ondas flutter regulares, ritmo ventricular variable
 */
export const generateAtrialFlutter = (time: number): number => {
  const heartRate = 75; // Ritmo ventricular (ej. conducción 4:1)
  const phase = (time * heartRate / 60) % 1;
  
  // Ondas flutter (F) en "diente de sierra" ~300 bpm (5 Hz)
  const fFreq = 5; // Hz
  const fWave = (time * fFreq) % 1;
  const sawtooth = (fWave < 0.5 ? fWave * 2 : (1 - fWave) * 2) * 0.25 - 0.1;
  
  let value = sawtooth;
  
  // Complejo QRS
  if (phase < 0.05) {
    const x = phase / 0.05;
    value = 1.0 * Math.sin(Math.PI * x);
  }
  // Onda T
  else if (phase < 0.25) {
    const x = (phase - 0.05) / 0.20;
    value = 0.3 * Math.sin(Math.PI * x) + sawtooth;
  }
  
  return value;
};

/**
 * Genera onda de Asistolia (Paro Cardíaco)
 * Características: Línea plana sin actividad eléctrica
 */
export const generateAsystole = (x: number): number => {
  // Línea completamente plana con mínimo ruido
  return Math.random() * 0.02 - 0.01;
};

/**
 * Genera onda de Infarto de Miocardio (STEMI)
 * Características: Elevación del segmento ST
 */
export const generateSTElevationMI = (x: number): number => {
  const params: ECGWaveParams = {
    ...NORMAL_ECG_PARAMS,
    stSegmentShift: 0.3, // Elevación del ST
    rAmplitude: 1.2, // R reducida
  };
  return generateNormalECGWave(x, params);
};

/**
 * Genera Bloqueo AV 2do Grado Mobitz I (Wenckebach)
 * El intervalo PR se prolonga progresivamente hasta que una onda P no conduce (drop)
 */
export const generateSecondDegreeAVBlockMobitzI = (time: number): number => {
  const heartRate = 60;
  const cycleSec = 60 / heartRate;
  const totalCycleSec = cycleSec * 4; // Ciclo de 4 latidos (3 conducidos, 1 bloqueado)
  const masterPhase = (time / totalCycleSec) % 1;
  
  const beatIndex = Math.floor(masterPhase * 4);
  const beatPhase = (masterPhase * 4) % 1;
  const beatTime = beatPhase * cycleSec;

  if (beatIndex < 3) {
    // Latidos conducidos con PR creciente
    const prIntervals = [160, 240, 320];
    const params: ECGWaveParams = {
      ...NORMAL_ECG_PARAMS,
      prInterval: prIntervals[beatIndex]
    };
    return generateNormalECGWave(beatTime, params);
  } else {
    // Latido bloqueado (solo onda P)
    const cycleMs = 60000 / heartRate;
    const pEnd = 80 / cycleMs;
    if (beatPhase < pEnd) {
      const x = beatPhase / pEnd;
      return NORMAL_ECG_PARAMS.pAmplitude * Math.sin(Math.PI * x);
    }
    return 0;
  }
};

/**
 * Genera Bloqueo AV 2do Grado Mobitz II
 * Intervalo PR constante, pero falla la conducción de forma súbita (ej. 3:1 o 2:1)
 */
export const generateSecondDegreeAVBlockMobitzII = (time: number): number => {
  const heartRate = 60;
  const cycleSec = 60 / heartRate;
  const totalCycleSec = cycleSec * 3; // Ciclo de 3 latidos (2 conducidos, 1 bloqueado)
  const masterPhase = (time / totalCycleSec) % 1;
  
  const beatIndex = Math.floor(masterPhase * 3);
  const beatPhase = (masterPhase * 3) % 1;
  const beatTime = beatPhase * cycleSec;

  if (beatIndex < 2) {
    return generateNormalECGWave(beatTime);
  } else {
    // Latido bloqueado (solo onda P)
    const cycleMs = 60000 / heartRate;
    const pEnd = 80 / cycleMs;
    if (beatPhase < pEnd) {
      const x = beatPhase / pEnd;
      return NORMAL_ECG_PARAMS.pAmplitude * Math.sin(Math.PI * x);
    }
    return 0;
  }
};

/**
 * Genera Bloqueo AV de 3er Grado (Completo)
 * Disociación aurículo-ventricular completa. P a ~80 bpm, QRS a ~40 bpm
 */
export const generateThirdDegreeAVBlock = (time: number): number => {
  // Ondas P regulares a 80 bpm
  const pRate = 80;
  const pPhase = (time * pRate / 60) % 1;
  const pCycleMs = 60000 / pRate;
  const pEnd = 80 / pCycleMs;
  let pVal = 0;
  if (pPhase < pEnd) {
    pVal = NORMAL_ECG_PARAMS.pAmplitude * Math.sin(Math.PI * (pPhase / pEnd));
  }

  // Complejos QRS regulares a 40 bpm
  const qrsRate = 40;
  const qrsPhase = (time * qrsRate / 60) % 1;
  const qrsCycleMs = 60000 / qrsRate;
  
  const qrsStart = 0;
  const rEnd = 50 / qrsCycleMs;
  const sEnd = rEnd + 50 / qrsCycleMs;
  const tStart = 150 / qrsCycleMs;
  const tEnd = 400 / qrsCycleMs;

  let vVal = 0;
  if (qrsPhase < rEnd) {
    vVal = 1.2 * Math.sin(Math.PI * (qrsPhase / rEnd));
  } else if (qrsPhase < sEnd) {
    vVal = -0.4 * Math.sin(Math.PI * ((qrsPhase - rEnd) / (sEnd - rEnd)));
  } else if (qrsPhase > tStart && qrsPhase < tEnd) {
    vVal = 0.4 * Math.sin(Math.PI * ((qrsPhase - tStart) / (tEnd - tStart)));
  }

  return pVal + vVal;
};

/**
 * Genera Extrasístole Auricular (PAC)
 * Un latido que se adelanta con una onda P de diferente morfología
 */
export const generatePrematureAtrialContraction = (time: number): number => {
  const heartRate = 72;
  const cycleSec = 60 / heartRate;
  const totalCycleSec = cycleSec * 3; // Ciclo de 3 latidos (Normal, PAC, Pausa)
  const masterPhase = (time / totalCycleSec) % 1;
  
  if (masterPhase < 0.33) {
    return generateNormalECGWave(time);
  } else if (masterPhase < 0.55) {
    // PAC: Llega antes (a los 0.22 de ciclo en lugar de 0.33)
    const beatPhase = (masterPhase - 0.33) / 0.22;
    const params = { ...NORMAL_ECG_PARAMS, pAmplitude: 0.25 }; // P diferente
    return generateNormalECGWave(beatPhase * cycleSec, params);
  }
  return 0; // Pausa no compensatoria parcial
};

/**
 * Genera Taquicardia Supraventricular Paroxística (PSVT)
 * Frecuencia muy alta (180 bpm), ondas P a menudo ocultas
 */
export const generatePSVT = (time: number): number => {
  const params: ECGWaveParams = {
    ...NORMAL_ECG_PARAMS,
    heartRate: 180,
    prInterval: 100, // PR muy corto
    pAmplitude: 0.05  // P casi invisible
  };
  return generateNormalECGWave(time, params);
};

/**
 * Genera Bloqueo de Rama Derecha (RBBB)
 * QRS ancho con morfología RSR' (orejas de conejo)
 */
export const generateRightBundleBranchBlock = (time: number): number => {
  const p = { ...NORMAL_ECG_PARAMS, qrsWidth: 140 };
  const phase = (time * p.heartRate / 60) % 1;
  const cycleMs = 60000 / p.heartRate;
  
  const prEnd = p.prInterval / cycleMs;
  const r1End = prEnd + 30 / cycleMs;
  const sEnd = r1End + 30 / cycleMs;
  const r2End = sEnd + 40 / cycleMs;
  
  if (phase > prEnd && phase < r1End) {
    return 0.8 * Math.sin(Math.PI * ((phase - prEnd) / (r1End - prEnd)));
  } else if (phase < sEnd) {
    return -0.4 * Math.sin(Math.PI * ((phase - r1End) / (sEnd - r1End)));
  } else if (phase < r2End) {
    return 1.2 * Math.sin(Math.PI * ((phase - sEnd) / (r2End - sEnd)));
  }
  
  return generateNormalECGWave(time, p);
};

/**
 * Genera Bloqueo de Rama Izquierda (LBBB)
 * QRS muy ancho, deflexión R mellada o S profunda
 */
export const generateLeftBundleBranchBlock = (time: number): number => {
  const p = { ...NORMAL_ECG_PARAMS, qrsWidth: 160, rAmplitude: 0.5, sAmplitude: -1.5 };
  return generateNormalECGWave(time, p);
};

/**
 * Genera Síndrome de Wolff-Parkinson-White (WPW)
 * Intervalo PR corto y onda delta (empastamiento inicial del QRS)
 */
export const generateWPWSyndrome = (time: number): number => {
  const p = { ...NORMAL_ECG_PARAMS, prInterval: 100 };
  const phase = (time * p.heartRate / 60) % 1;
  const cycleMs = 60000 / p.heartRate;
  
  const prEnd = p.prInterval / cycleMs;
  const deltaEnd = prEnd + 40 / cycleMs;
  
  if (phase > prEnd && phase < deltaEnd) {
    // Onda Delta (subida lenta)
    const x = (phase - prEnd) / (deltaEnd - prEnd);
    return 0.4 * x; 
  }
  
  return generateNormalECGWave(time, p);
};

/**
 * Genera Depresión del Segmento ST
 * Signo de isquemia miocárdica
 */
export const generateSTDepression = (time: number): number => {
  const p = { ...NORMAL_ECG_PARAMS, stSegmentShift: -0.2 };
  return generateNormalECGWave(time, p);
};
