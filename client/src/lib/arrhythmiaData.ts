/**
 * Datos de arritmias cardíacas con información clínica y parámetros ECG
 * Basado en estándares clínicos del paper y documento LIM 2016
 */

import {
  generateNormalECGWave,
  generateAtrialFibrillation,
  generateVentricularFibrillation,
  generateSinusTachycardia,
  generateSinusBradycardia,
  generateFirstDegreeAVBlock,
  generateVentricularTachycardia,
  generatePrematureVentricularContractions,
  generateAtrialFlutter,
  generateAsystole,
  generateSTElevationMI,
  generateSecondDegreeAVBlockMobitzI,
  generateSecondDegreeAVBlockMobitzII,
  generateThirdDegreeAVBlock,
  generatePrematureAtrialContraction,
  generatePSVT,
  generateRightBundleBranchBlock,
  generateLeftBundleBranchBlock,
  generateWPWSyndrome,
  generateSTDepression,
  NORMAL_ECG_PARAMS,
} from './ecgWaveGenerator';

export interface ArrhythmiaData {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalInfo: string;
  characteristics: string[];
  heartRate: number;
  rhythm: string;
  ecgParameters: {
    prInterval: number; // ms
    qrsWidth: number; // ms
    qtInterval: number; // ms
    stSegment: string;
  };
  severity: 'mild' | 'moderate' | 'severe';
  treatment: string[];
  waveformGenerator: (time: number) => number;
}

export const arrhythmias: ArrhythmiaData[] = [
  {
    id: 'normal',
    name: 'Ritmo Sinusal Normal',
    category: 'Normal',
    description: 'Ritmo cardíaco normal y regular originado en el nodo sinoauricular.',
    clinicalInfo: 'El ritmo sinusal normal es el patrón de conducción eléctrica esperado en el corazón sano. Cada impulso se origina en el nodo sinoauricular (SA) y se propaga de manera ordenada a través de las aurículas y ventrículos. Según el paper, la frecuencia cardíaca normal en reposo es de 60-100 latidos por minuto.',
    characteristics: [
      'Frecuencia cardíaca: 60-100 bpm',
      'Ritmo regular',
      'Onda P presente antes de cada QRS',
      'Intervalo PR: 120-200 ms',
      'Complejo QRS: <120 ms',
      'Onda T simétrica',
      'Segmento ST isoelectrónico'
    ],
    heartRate: 72,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 80,
      qtInterval: 400,
      stSegment: 'Isoelectrónico'
    },
    severity: 'mild',
    treatment: [],
    waveformGenerator: (t: number) => generateNormalECGWave(t, NORMAL_ECG_PARAMS)
  },
  {
    id: 'tachycardia',
    name: 'Taquicardia Sinusal',
    category: 'Arritmias Supraventriculares',
    description: 'Aumento de la frecuencia cardíaca por encima de 100 bpm en ritmo sinusal normal.',
    clinicalInfo: 'La taquicardia sinusal es una respuesta fisiológica del corazón a demandas aumentadas de oxígeno. Puede ser causada por ejercicio, fiebre, estrés, ansiedad, hipoxia o hipovolemia. El ECG mantiene la morfología normal pero con intervalos RR más cortos.',
    characteristics: [
      'Frecuencia cardíaca: >100 bpm',
      'Ritmo regular',
      'Onda P presente y normal',
      'Intervalo PR normal',
      'Complejo QRS normal',
      'Aumento de la frecuencia de ondas P'
    ],
    heartRate: 130,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 80,
      qtInterval: 320,
      stSegment: 'Isoelectrónico'
    },
    severity: 'mild',
    treatment: ['Tratar causa subyacente', 'Reposo', 'Hidratación'],
    waveformGenerator: (t: number) => generateSinusTachycardia(t)
  },
  {
    id: 'bradycardia',
    name: 'Bradicardia Sinusal',
    category: 'Arritmias Supraventriculares',
    description: 'Disminución de la frecuencia cardíaca por debajo de 60 bpm en ritmo sinusal normal.',
    clinicalInfo: 'La bradicardia sinusal es común en atletas y personas en reposo. Puede ser patológica si se acompaña de síntomas como mareos, fatiga o síncope. Puede indicar problemas en el nodo sinoauricular o disfunción del sistema de conducción.',
    characteristics: [
      'Frecuencia cardíaca: <60 bpm',
      'Ritmo regular',
      'Onda P presente y normal',
      'Intervalo PR normal',
      'Complejo QRS normal',
      'Intervalos RR prolongados'
    ],
    heartRate: 45,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 80,
      qtInterval: 480,
      stSegment: 'Isoelectrónico'
    },
    severity: 'mild',
    treatment: ['Monitoreo', 'Evaluación de causa', 'Marcapasos si sintomático'],
    waveformGenerator: (t: number) => generateSinusBradycardia(t)
  },
  {
    id: 'afib',
    name: 'Fibrilación Auricular',
    category: 'Arritmias Supraventriculares',
    description: 'Arritmia caótica de las aurículas con respuesta ventricular irregular.',
    clinicalInfo: 'La fibrilación auricular (FA) es la arritmia más común en la práctica clínica. Se caracteriza por actividad eléctrica desorganizada en las aurículas, resultando en una respuesta ventricular irregular e impredecible. Aumenta el riesgo de tromboembolismo y puede causar insuficiencia cardíaca. La prevalencia oscila entre 2 y 4%.',
    characteristics: [
      'Frecuencia auricular: 350-600 bpm',
      'Respuesta ventricular: 80-160 bpm (variable)',
      'Ritmo completamente irregular',
      'Ausencia de onda P clara',
      'Línea base irregular (ondas f caóticas)',
      'Complejos QRS normales pero irregulares'
    ],
    heartRate: 110,
    rhythm: 'Irregular',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 80,
      qtInterval: 350,
      stSegment: 'Variable'
    },
    severity: 'moderate',
    treatment: ['Anticoagulación', 'Control de frecuencia', 'Cardioversión si inestable'],
    waveformGenerator: (t: number) => generateAtrialFibrillation(t)
  },
  {
    id: 'aflutter',
    name: 'Aleteo Auricular',
    category: 'Arritmias Supraventriculares',
    description: 'Arritmia auricular regular con respuesta ventricular variable.',
    clinicalInfo: 'El aleteo auricular es menos común que la fibrilación auricular. Se caracteriza por ondas de flutter regulares en la línea base, típicamente a una frecuencia de 250-350 bpm. La respuesta ventricular depende del grado de bloqueo AV. La incidencia es de 88 por 1,000,000 de personas/año.',
    characteristics: [
      'Frecuencia auricular: 250-350 bpm',
      'Ondas flutter regulares (diente de sierra)',
      'Respuesta ventricular: variable (2:1, 3:1, 4:1)',
      'Ritmo ventricular regular o irregular',
      'Ausencia de línea isoelectrónica',
      'Complejos QRS normales'
    ],
    heartRate: 130,
    rhythm: 'Regular o irregular',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 80,
      qtInterval: 350,
      stSegment: 'Isoelectrónico'
    },
    severity: 'moderate',
    treatment: ['Control de frecuencia', 'Ablación por catéter', 'Cardioversión'],
    waveformGenerator: (t: number) => generateAtrialFlutter(t)
  },
  {
    id: 'pvc',
    name: 'Extrasístoles Ventriculares',
    category: 'Arritmias Ventriculares',
    description: 'Contracciones ventriculares prematuras originadas fuera del nodo sinoauricular.',
    clinicalInfo: 'Las extrasístoles ventriculares (PVC) son contracciones ventriculares prematuras que se originan en el miocardio ventricular. Pueden ser benignas en corazones sanos o indicar enfermedad cardíaca subyacente. Se caracterizan por complejos QRS anchos y prematuros.',
    characteristics: [
      'Complejo QRS ancho (>120 ms)',
      'Prematuro (antes del latido esperado)',
      'Onda T invertida',
      'Pausa compensatoria',
      'Ausencia de onda P',
      'Pueden ser unifocales o multifocales'
    ],
    heartRate: 85,
    rhythm: 'Irregular',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 140,
      qtInterval: 380,
      stSegment: 'Deprimido'
    },
    severity: 'mild',
    treatment: ['Monitoreo', 'Antiarrítmicos si sintomáticos', 'Tratar causa subyacente'],
    waveformGenerator: (t: number) => generatePrematureVentricularContractions(t)
  },
  {
    id: 'vt',
    name: 'Taquicardia Ventricular',
    category: 'Arritmias Ventriculares',
    description: 'Ritmo ventricular rápido originado en el miocardio ventricular.',
    clinicalInfo: 'La taquicardia ventricular (TV) es una arritmia potencialmente mortal caracterizada por tres o más complejos QRS anchos consecutivos a una frecuencia >120 bpm. Puede degenerar en fibrilación ventricular. Requiere tratamiento urgente.',
    characteristics: [
      'Frecuencia: >120 bpm',
      'Complejos QRS anchos (>120 ms)',
      'Ritmo regular o irregular',
      'Ausencia de onda P',
      'Disociación AV',
      'Puede ser monomórfica o polimórfica'
    ],
    heartRate: 180,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 160,
      qtInterval: 300,
      stSegment: 'Deprimido'
    },
    severity: 'severe',
    treatment: ['RCP si inconsciente', 'Desfibrilación', 'Amiodarona IV', 'Cardioversión sincronizada'],
    waveformGenerator: (t: number) => generateVentricularTachycardia(t)
  },
  {
    id: 'vfib',
    name: 'Fibrilación Ventricular',
    category: 'Arritmias Ventriculares',
    description: 'Actividad eléctrica ventricular caótica sin producción de pulso.',
    clinicalInfo: 'La fibrilación ventricular (FV) es una emergencia médica que requiere desfibrilación inmediata. El corazón no puede bombear sangre, resultando en paro cardíaco. Sin tratamiento inmediato, es fatal. Es la causa más común de muerte súbita cardíaca.',
    characteristics: [
      'Patrón completamente caótico',
      'Sin complejos QRS reconocibles',
      'Sin pulso',
      'Sin presión arterial',
      'Inconsciencia inmediata',
      'Requiere desfibrilación urgente'
    ],
    heartRate: 0,
    rhythm: 'Caótico',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 0,
      qtInterval: 0,
      stSegment: 'Caótico'
    },
    severity: 'severe',
    treatment: ['Desfibrilación inmediata', 'RCP', 'Epinefrina', 'Amiodarona'],
    waveformGenerator: (t: number) => generateVentricularFibrillation(t)
  },
  {
    id: 'avblock1',
    name: 'Bloqueo AV de Primer Grado',
    category: 'Bloqueos de Conducción',
    description: 'Retraso en la conducción AV con todos los impulsos conducidos.',
    clinicalInfo: 'El bloqueo AV de primer grado se caracteriza por un intervalo PR prolongado (>0.2 seg). Todos los impulsos sinusales se conducen a los ventrículos, pero con retraso. Generalmente es asintomático y puede ser causado por fármacos como beta-bloqueadores o calcio-antagonistas.',
    characteristics: [
      'Intervalo PR prolongado (>200 ms)',
      'Todos los complejos QRS precedidos por onda P',
      'Ritmo regular',
      'Complejos QRS normales',
      'Onda T normal',
      'Asintomático generalmente'
    ],
    heartRate: 72,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 240,
      qrsWidth: 80,
      qtInterval: 400,
      stSegment: 'Isoelectrónico'
    },
    severity: 'mild',
    treatment: ['Monitoreo', 'Evaluar medicamentos', 'Tratamiento de causa subyacente'],
    waveformGenerator: (t: number) => generateFirstDegreeAVBlock(t)
  },
  {
    id: 'asystole',
    name: 'Asistolia',
    category: 'Paro Cardíaco',
    description: 'Ausencia de actividad eléctrica cardíaca.',
    clinicalInfo: 'La asistolia es un ritmo no desfibrilable que representa paro cardíaco completo. No hay actividad eléctrica ni mecánica. Es una emergencia médica que requiere RCP inmediata y medicamentos de reanimación. El pronóstico es generalmente pobre.',
    characteristics: [
      'Línea plana sin actividad eléctrica',
      'Sin pulso',
      'Sin presión arterial',
      'Inconsciencia',
      'Ausencia de respiración',
      'Requiere RCP inmediata'
    ],
    heartRate: 0,
    rhythm: 'Ausente',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 0,
      qtInterval: 0,
      stSegment: 'Plano'
    },
    severity: 'severe',
    treatment: ['RCP inmediata', 'Epinefrina IV', 'Intubación', 'Tratamiento de causa subyacente'],
    waveformGenerator: (t: number) => generateAsystole(t)
  },
  {
    id: 'stemi',
    name: 'Infarto Agudo de Miocardio (STEMI)',
    category: 'Síndromes Coronarios',
    description: 'Elevación del segmento ST indicativa de infarto de miocardio transmural.',
    clinicalInfo: 'El infarto agudo de miocardio con elevación del ST (STEMI) es una emergencia médica que requiere reperfusión urgente mediante angioplastia primaria o trombolisis. Se caracteriza por elevación del segmento ST en derivaciones contiguas. El pronóstico depende del tiempo de reperfusión.',
    characteristics: [
      'Elevación del segmento ST (>1 mm)',
      'Onda Q patológica',
      'Onda T invertida',
      'Complejos QRS pueden estar ensanchados',
      'Dolor torácico',
      'Cambios dinámicos en el ECG'
    ],
    heartRate: 95,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 100,
      qtInterval: 420,
      stSegment: 'Elevado'
    },
    severity: 'severe',
    treatment: ['Angioplastia primaria', 'Trombolisis', 'Antiagregantes', 'Betabloqueadores', 'IECA'],
    waveformGenerator: (t: number) => generateSTElevationMI(t)
  },
  {
    id: 'mobitz1',
    name: 'Bloqueo AV de Segundo Grado – Mobitz I',
    category: 'Bloqueos de Conducción',
    description: 'El intervalo PR se prolonga progresivamente hasta que una onda P no conduce.',
    clinicalInfo: 'También conocido como Wenckebach. Suele ser benigno y a menudo se observa en atletas o durante el sueño. Se debe a un retraso progresivo en el nodo AV.',
    characteristics: [
      'Prolongación progresiva del intervalo PR',
      'Falla súbita de la conducción ventricular (onda P sin QRS)',
      'Ritmo atrial regular, ritmo ventricular irregular',
      'Complejos QRS generalmente normales'
    ],
    heartRate: 60,
    rhythm: 'Irregular',
    ecgParameters: {
      prInterval: 240,
      qrsWidth: 80,
      qtInterval: 400,
      stSegment: 'Normal'
    },
    severity: 'moderate',
    treatment: ['Observación', 'Atropina si es sintomático', 'Revisar medicamentos'],
    waveformGenerator: (t: number) => generateSecondDegreeAVBlockMobitzI(t)
  },
  {
    id: 'mobitz2',
    name: 'Bloqueo AV de Segundo Grado – Mobitz II',
    category: 'Bloqueos de Conducción',
    description: 'Intervalo PR constante con fallas súbitas e intermitentes de la conducción.',
    clinicalInfo: 'A diferencia del tipo I, este bloqueo ocurre generalmente por debajo del nodo AV y tiene un mayor riesgo de progresar a un bloqueo completo.',
    characteristics: [
      'Intervalo PR constante en los latidos conducidos',
      'Falla súbita de la conducción ventricular de forma intermitente',
      'Riesgo elevado de síncope y paro cardíaco',
      'A menudo asociado con complejos QRS anchos'
    ],
    heartRate: 50,
    rhythm: 'Irregular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 100,
      qtInterval: 400,
      stSegment: 'Normal'
    },
    severity: 'severe',
    treatment: ['Marcapasos permanente', 'Monitoreo continuo', 'Evitar fármacos bloqueadores AV'],
    waveformGenerator: (t: number) => generateSecondDegreeAVBlockMobitzII(t)
  },
  {
    id: 'avblock3',
    name: 'Bloqueo AV de Tercer Grado (Completo)',
    category: 'Bloqueos de Conducción',
    description: 'Disociación completa entre las aurículas y los ventrículos.',
    clinicalInfo: 'Ningún impulso auricular se conduce a los ventrículos. Las aurículas y ventrículos laten de forma independiente (disociación AV). Es una emergencia médica.',
    characteristics: [
      'Disociación completa entre ondas P y complejos QRS',
      'Frecuencia auricular regular (ej. 80 bpm)',
      'Frecuencia ventricular regular pero lenta (ej. 40 bpm)',
      'Intervalos PR completamente variables'
    ],
    heartRate: 40,
    rhythm: 'Regular (pero disociado)',
    ecgParameters: {
      prInterval: 0,
      qrsWidth: 120,
      qtInterval: 420,
      stSegment: 'Normal'
    },
    severity: 'severe',
    treatment: ['Marcapasos de urgencia', 'Atropina/Isoproterenol temporal', 'Marcapasos definitivo'],
    waveformGenerator: (t: number) => generateThirdDegreeAVBlock(t)
  },
  {
    id: 'pac',
    name: 'Extrasístole Auricular (PAC)',
    category: 'Arritmias Supraventriculares',
    description: 'Latido prematuro originado en las aurículas fuera del nodo sinusal.',
    clinicalInfo: 'Común en personas sanas, pero puede ser desencadenado por cafeína, estrés, tabaco o alcohol. Se produce por un foco ectópico auricular.',
    characteristics: [
      'Onda P prematura con morfología diferente a la sinusal',
      'Intervalo PR puede ser diferente',
      'Pausa no compensatoria incompleta',
      'Complejo QRS generalmente normal'
    ],
    heartRate: 75,
    rhythm: 'Irregular',
    ecgParameters: {
      prInterval: 140,
      qrsWidth: 80,
      qtInterval: 400,
      stSegment: 'Normal'
    },
    severity: 'mild',
    treatment: ['Tratar causa desencadenante', 'Reducir estimulantes', 'Betabloqueadores si hay síntomas'],
    waveformGenerator: (t: number) => generatePrematureAtrialContraction(t)
  },
  {
    id: 'psvt',
    name: 'Taquicardia Supraventricular Paroxística (PSVT)',
    category: 'Arritmias Supraventriculares',
    description: 'Taquicardia de inicio y fin súbito originada por encima de los ventrículos.',
    clinicalInfo: 'Frecuentemente causada por un mecanismo de reentrada en el nodo AV. Se caracteriza por un ritmo rápido y regular que puede causar palpitaciones y ansiedad.',
    characteristics: [
      'Ritmo regular muy rápido (150-250 bpm)',
      'Ondas P a menudo ocultas en la onda T o retrógradas',
      'Complejos QRS estrechos',
      'Inicio y terminación súbitos'
    ],
    heartRate: 180,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 100,
      qrsWidth: 80,
      qtInterval: 280,
      stSegment: 'Deprimido (taquicardia)'
    },
    severity: 'moderate',
    treatment: ['Maniobras vagales', 'Adenosina IV', 'Cardioversión si hay inestabilidad'],
    waveformGenerator: (t: number) => generatePSVT(t)
  },
  {
    id: 'rbbb',
    name: 'Bloqueo de Rama Derecha (RBBB)',
    category: 'Bloqueos de Conducción',
    description: 'Retraso en la conducción eléctrica a través de la rama derecha del haz de His.',
    clinicalInfo: 'Puede verse en personas sanas o asociarse con enfermedades pulmonares o cardíacas. El ventrículo derecho se despolariza después del izquierdo.',
    characteristics: [
      'Complejo QRS ancho (>120 ms)',
      'Morfología RSR\' (orejas de conejo) en V1-V2',
      'Ondas S anchas y profundas en DI y V6',
      'Cambios secundarios en la onda T'
    ],
    heartRate: 72,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 140,
      qtInterval: 420,
      stSegment: 'Normal'
    },
    severity: 'mild',
    treatment: ['Tratar enfermedad subyacente', 'Monitoreo', 'Generalmente no requiere tratamiento específico'],
    waveformGenerator: (t: number) => generateRightBundleBranchBlock(t)
  },
  {
    id: 'lbbb',
    name: 'Bloqueo de Rama Izquierda (LBBB)',
    category: 'Bloqueos de Conducción',
    description: 'Retraso en la conducción eléctrica a través de la rama izquierda del haz de His.',
    clinicalInfo: 'Casi siempre indica enfermedad cardíaca subyacente significativa. Dificulta la interpretación de isquemia o infarto en el ECG.',
    characteristics: [
      'Complejo QRS muy ancho (>120 ms)',
      'Ondas R anchas y melladas en DI, aVL, V5-V6',
      'Ausencia de ondas Q septales',
      'Desviación del eje a la izquierda frecuente'
    ],
    heartRate: 72,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 160,
      qtInterval: 440,
      stSegment: 'Cambios secundarios'
    },
    severity: 'moderate',
    treatment: ['Evaluación cardiológica completa', 'Tratar causa subyacente', 'Resincronización si hay falla cardíaca'],
    waveformGenerator: (t: number) => generateLeftBundleBranchBlock(t)
  },
  {
    id: 'wpw',
    name: 'Síndrome de Wolff-Parkinson-White (WPW)',
    category: 'Bloqueos de Conducción', // Aunque es preexcitación, a menudo se agrupa aquí
    description: 'Presencia de una vía accesoria que "puentea" el nodo AV.',
    clinicalInfo: 'Se caracteriza por una preexcitación ventricular. Puede predisponer a taquicardias severas si no se trata mediante ablación.',
    characteristics: [
      'Intervalo PR corto (<120 ms)',
      'Onda delta (inicio empastado del QRS)',
      'Complejo QRS ancho',
      'Riesgo de taquiarritmias por reentrada'
    ],
    heartRate: 72,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 100,
      qrsWidth: 120,
      qtInterval: 400,
      stSegment: 'Normal'
    },
    severity: 'moderate',
    treatment: ['Ablación por catéter', 'Evitar bloqueadores de nodo AV en FA', 'Betabloqueadores'],
    waveformGenerator: (t: number) => generateWPWSyndrome(t)
  },
  {
    id: 'st_depression',
    name: 'Depresión del Segmento ST',
    category: 'Síndromes Coronarios',
    description: 'Descenso del segmento ST por debajo de la línea isoeléctrica.',
    clinicalInfo: 'Indicador frecuente de isquemia miocárdica subendocárdica o efecto de fármacos como la digoxina. Requiere correlación clínica con dolor torácico.',
    characteristics: [
      'Segmento ST >0.5 mm por debajo de la línea J',
      'Morfología horizontal, descendente o ascendente',
      'A menudo se asocia con ondas T invertidas',
      'Signo de isquemia activa o esfuerzo'
    ],
    heartRate: 75,
    rhythm: 'Regular',
    ecgParameters: {
      prInterval: 160,
      qrsWidth: 80,
      qtInterval: 400,
      stSegment: 'Deprimido'
    },
    severity: 'moderate',
    treatment: ['Evaluación de isquemia', 'Nitratos', 'Antiagregantes', 'Prueba de esfuerzo'],
    waveformGenerator: (t: number) => generateSTDepression(t)
  }
];

export const categories = [
  'Normal',
  'Arritmias Supraventriculares',
  'Arritmias Ventriculares',
  'Bloqueos de Conducción',
  'Síndromes Coronarios',
  'Paro Cardíaco'
];

export const getArrhythmiaById = (id: string): ArrhythmiaData | undefined => {
  return arrhythmias.find(arr => arr.id === id);
};

export const getArrhythmiasByCategory = (category: string): ArrhythmiaData[] => {
  return arrhythmias.filter(arr => arr.category === category);
};
