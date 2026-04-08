/**
 * VentEngine.ts
 * Motor matemático para la simulación de ventilación mecánica de alta fidelidad.
 * Basado en modelos de Otis (WOB), Duffin (Control Químico) y C/S Multinodal (Reclutamiento).
 */

export interface PatientState {
  age: number;
  height: number; // cm
  weight: number; // kg (Actual)
  ibw: number; // Ideal Body Weight
  gender: "male" | "female";
  hgb: number; // Hemoglobina
  r_phys: number; // Resistencia fisiológica (cmH2O/L/s)
  c_static: number; // Compliancia basal (mL/cmH2O)
  paco2: number; // mmHg
  pao2: number; // mmHg
  metabolic_rate: number; // VO2 (mL/min), normal ~250
  cardiac_output: number; // L/min, normal ~5
  shunted_fraction: number; // 0 to 1
  pathology?: "normal" | "ards" | "copd";
}

export interface AlveolarNode {
  p_open: number;
  p_close: number;
  is_open: boolean;
  volume_factor: number; // Fracción del volumen total que este nodo representa
}

export class VentEngine {
  private static readonly ATOMS_CO2_CONSTANT = 0.863; // Constant for Alveolar Gas Equation

  /**
   * Calcula el Peso Ideal (IBW)
   */
  static getIBW(height: number, gender: "male" | "female"): number {
    const baseHeight = 152.4;
    const baseWeight = gender === "male" ? 50 : 45.5;
    return baseWeight + 0.91 * (height - baseHeight);
  }

  /**
   * Ecuación de Otis (1950)
   * Calcula la FR óptima para minimizar el Trabajo Respiratorio.
   * f_opt = (-1 + sqrt(1 + 2 * a * VE / VD)) / a, donde a = 2 * pi^2 * R * C
   */
  static solveOtis(ve: number, vd: number, r: number, c: number): number {
    const rL = r / 60; // Convert to cmH2O/L/min for consistency with VE (L/min)
    const cL = c / 1000; // Convert to L/cmH2O
    const a = 2 * Math.pow(Math.PI, 2) * rL * cL;

    // Si VE es 0 o VD es mayor que VT, retornamos un valor base
    if (ve <= 0 || vd <= 0) return 12;

    const rr = (-1 + Math.sqrt(1 + 2 * a * (ve / vd))) / a;
    return Math.min(Math.max(rr, 5), 40); // Límites clínicos razonables
  }

  /**
   * Modelo de Duffin (1990) - Drive Spontáneo
   * Calcula el Volumen Minuto (VE) en base a la quimio-sensibilidad al CO2.
   * VE = S * (PaCO2 - B)
   */
  static solveDuffin(
    paco2: number,
    sensitivity: number = 1.2,
    threshold: number = 38
  ): number {
    if (paco2 <= threshold) return 0; // Apnea threshold
    return sensitivity * (paco2 - threshold);
  }

  /**
   * Aplica pre-ajustes de patología al estado del paciente
   */
  static applyPathology(
    state: PatientState,
    type: "normal" | "ards" | "copd"
  ): PatientState {
    const newState = { ...state, pathology: type };
    switch (type) {
      case "ards":
        newState.c_static = 30; // Pulmón rígido
        newState.r_phys = 10;
        newState.shunted_fraction = 0.3;
        break;
      case "copd":
        newState.c_static = 80; // Hiperinsuflación
        newState.r_phys = 25; // Alta resistencia
        newState.shunted_fraction = 0.15;
        break;
      default:
        newState.c_static = 60;
        newState.r_phys = 5;
        newState.shunted_fraction = 0.05;
    }
    return newState;
  }

  /**
   * Genera un conjunto de nodos alveolares para reclutamiento multinodal.
   * Distribución normal de presiones de apertura/cierre.
   */
  static generateLungs(
    nodeCount: number = 100,
    meanOpen: number = 15,
    stdDev: number = 5
  ): AlveolarNode[] {
    const nodes: AlveolarNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const p_open = meanOpen + z0 * stdDev;
      nodes.push({
        p_open: Math.max(0, p_open),
        p_close: Math.max(0, p_open - 5), // Hysteresis de 5 cmH2O aprox
        is_open: false,
        volume_factor: 1 / nodeCount,
      });
    }
    return nodes;
  }

  /**
   * Calcula el porcentaje de pulmón reclutado basado en la presión actual.
   * Maneja histéresis (diferencia entre inflación y deflación).
   */
  static updateRecruitment(
    nodes: AlveolarNode[],
    currentPressure: number
  ): number {
    let openCount = 0;
    nodes.forEach(node => {
      if (!node.is_open && currentPressure >= node.p_open) {
        node.is_open = true;
      } else if (node.is_open && currentPressure <= node.p_close) {
        node.is_open = false;
      }
      if (node.is_open) openCount++;
    });
    return openCount / nodes.length;
  }

  /**
   * Intercambio Gaseoso: Alveolar Gas Equation & CO2 linkage
   * Estima cambios en PaCO2 y PaO2 basado en ventilación y metabolismo.
   */
  static stepGasExchange(
    state: PatientState,
    alveolarVentilation: number, // L/min (VA = f * (VT - VD))
    dt: number // Tiempo en minutos
  ): { paco2: number; pao2: number } {
    // 1. Metabolismo CO2 (Ecuación simplificada)
    const vco2 = state.metabolic_rate * 0.8; // RQ = 0.8
    const paco2_target =
      (vco2 * this.ATOMS_CO2_CONSTANT) / Math.max(alveolarVentilation, 0.1);

    const co2_change_rate = 0.2; // Velocidad de equilibrio
    const new_paco2 =
      state.paco2 + (paco2_target - state.paco2) * co2_change_rate * dt;

    // 2. Oxigenación (Simplified Alveolar Gas Equation)
    const p_atm = 760;
    const p_h2o = 47;
    const fio2 = 0.21;
    const pao2_target = fio2 * (p_atm - p_h2o) - new_paco2 / 0.8;

    const effective_pao2 = pao2_target * (1 - state.shunted_fraction);

    return {
      paco2: Math.max(new_paco2, 10),
      pao2: Math.max(effective_pao2, 30),
    };
  }

  /**
   * Calcula la presión y flujo en un momento específico del ciclo respiratorio.
   * t: tiempo actual (s)
   */
  static getWaveformPoint(
    t: number,
    params: {
      peep: number;
      tidalVolume: number;
      compliance: number;
      resistance: number;
      inspireTime: number;
      cycleTime: number;
    }
  ): { pressure: number; flow: number } {
    const {
      peep,
      tidalVolume,
      compliance,
      resistance,
      inspireTime,
      cycleTime,
    } = params;
    const currentTime = t % cycleTime;

    let pressure = peep;
    let flow = 0;

    if (currentTime < inspireTime) {
      // Inspiración (Flujo Constante / Onda Cuadrada)
      flow = tidalVolume / 1000 / inspireTime; // L/s
      const volumeAtTime = (tidalVolume * (currentTime / inspireTime)) / 1000; // L
      pressure = peep + volumeAtTime / (compliance / 1000) + flow * resistance;
    } else {
      // Expiración (Pasiva, decaimiento exponencial)
      const decayTime = currentTime - inspireTime;
      const peakPressure = peep + tidalVolume / compliance;
      const tau = resistance * (compliance / 1000);

      pressure =
        peep + (peakPressure - peep) * Math.max(0, Math.exp(-decayTime / tau));

      const peakFlow = -(peakPressure - peep) / resistance;
      flow = peakFlow * Math.max(0, Math.exp(-decayTime / tau));
    }

    return { pressure, flow: flow * 20 }; // Escalamiento de flujo para visualización
  }
}
