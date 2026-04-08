const normalSinus =
  "https://upload.wikimedia.org/wikipedia/commons/e/ea/Normal_Sinus_Rhythm_Unlabeled.jpg";
const atrialFibrillation =
  "https://upload.wikimedia.org/wikipedia/commons/8/87/ECG_Atrial_Fibrillation_98_bpm.jpg";
const atrialFlutter =
  "https://upload.wikimedia.org/wikipedia/commons/0/0f/ECG_Atrial_Flutter_294_bpm.jpg";
const ventricularTachycardia =
  "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lead_II_rhythm_ventricular_tachycardia_Vtach_VT.JPG";
const ventricularFibrillation =
  "https://upload.wikimedia.org/wikipedia/commons/3/3c/Ventricular_fibrillation_%28from_ecg-quiz.com%29.jpg";
const thirdDegreeAvb =
  "https://upload.wikimedia.org/wikipedia/commons/1/16/3rd_degree_heart_block.PNG";
const svt =
  "https://upload.wikimedia.org/wikipedia/commons/a/a2/Supraventricular_Tachycardia.png";
const wpw =
  "https://upload.wikimedia.org/wikipedia/commons/a/a5/Wolff-Parkinson-White_syndrome_12_lead_EKG.png";
const torsades =
  "https://upload.wikimedia.org/wikipedia/commons/a/a5/Torsades_de_Pointes_TdP.png";
const sinusBradycardia =
  "https://upload.wikimedia.org/wikipedia/commons/a/ad/ECG_Sinus_Bradycardia_49_bpm.jpg";
const sinusTachycardia =
  "https://upload.wikimedia.org/wikipedia/commons/d/df/ECG_Sinus_Tachycardia_132_bpm.jpg";
const lbbb =
  "https://upload.wikimedia.org/wikipedia/commons/3/32/Left_Bundle_Branch_Block_ECG.jpg";
const rbbb =
  "https://upload.wikimedia.org/wikipedia/commons/e/e7/Right_bundle_branch_block_ECG.jpg";
const secondDegreeType1 =
  "https://upload.wikimedia.org/wikipedia/commons/b/b4/Type_I_A-V_block_5-to-4_Wenckebach_periods.png";
const secondDegreeType2 =
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/2to1block.jpg";
const firstDegreeAvb =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/First_Degree_AV_Block_ECG_Unlabeled.jpg";
const pvc = "https://upload.wikimedia.org/wikipedia/commons/a/a5/PVC10.JPG";
const brugada =
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Brugada_syndrome_ECGs.jpg";
const longQt =
  "https://upload.wikimedia.org/wikipedia/commons/b/b4/Long_QT_subtypes.jpg";
const asystole =
  "https://upload.wikimedia.org/wikipedia/commons/e/eb/Lead_II_rhythm_generated_asystole.JPG";
const pacemaker =
  "https://upload.wikimedia.org/wikipedia/commons/2/20/NSR-atrial_fusion-AJR-shifting_pacemaker.png";
const junctional =
  "https://upload.wikimedia.org/wikipedia/commons/1/15/ECG_of_Junctional_Rhythm.png";
const riva =
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Accelerated_idioventricular_rhythm.png";

export type ArrhythmiaCategory =
  | "supraventricular"
  | "ventricular"
  | "bloqueo"
  | "bradicardia"
  | "canalopatia"
  | "preexcitacion"
  | "otros";
export type Severity = "benigna" | "moderada" | "critica";

export interface Arrhythmia {
  id: string;
  name: string;
  category: ArrhythmiaCategory;
  severity: Severity;
  image: string;
  imageUrl?: string;
  description: string;
  ecgCriteria: string[];
  mechanism: string;
  hemodynamicImpact: string;
  icuContext: string;
  management: string[];
  differentialDx: string[];
  keyFact: string;
  electrophysiology?: string;
  pharmacology?: string;
  escGuideline?: string;
  references?: string[];
}

export const categoryLabels: Record<ArrhythmiaCategory, string> = {
  supraventricular: "Supraventriculares",
  ventricular: "Ventriculares",
  bloqueo: "Bloqueos AV",
  bradicardia: "Bradiarritmias",
  canalopatia: "Canalopatías",
  preexcitacion: "Preexcitación",
  otros: "Otros",
};

export const severityLabels: Record<Severity, string> = {
  benigna: "Benigna",
  moderada: "Moderada",
  critica: "Crítica",
};

export const arrhythmias: Arrhythmia[] = [
  {
    id: "normal-sinus",
    name: "Ritmo Sinusal Normal",
    category: "otros",
    severity: "benigna",
    image: normalSinus,
    description:
      "Ritmo cardíaco normal originado en el nodo sinusal. FC 60-100 lpm con conducción AV 1:1.",
    ecgCriteria: [
      "FC 60-100 lpm",
      "Onda P positiva en DII, negativa en aVR",
      "Cada P seguida de QRS",
      "PR 120-200 ms",
      "QRS < 120 ms",
      "Intervalo RR regular",
    ],
    mechanism:
      "Despolarización originada en el nodo sinusal, con conducción normal a través del nodo AV y sistema His-Purkinje.",
    hemodynamicImpact: "Gasto cardíaco normal. Sin compromiso hemodinámico.",
    icuContext:
      "Patrón de referencia. Su ausencia en UCI debe hacer buscar causas de arritmia (hipoxia, alteraciones electrolíticas, fármacos, isquemia).",
    management: ["No requiere tratamiento", "Es el ritmo objetivo terapéutico"],
    differentialDx: [
      "Taquicardia sinusal",
      "Bradicardia sinusal",
      "Arritmia sinusal",
    ],
    keyFact:
      "La arritmia sinusal respiratoria (variación de FC con la respiración) es fisiológica y frecuente en jóvenes.",
  },
  {
    id: "sinus-tachycardia",
    name: "Taquicardia Sinusal",
    category: "supraventricular",
    severity: "benigna",
    image: sinusTachycardia,
    description:
      "Ritmo sinusal con FC > 100 lpm. Respuesta fisiológica a estrés, fiebre, hipovolemia, dolor o ansiedad.",
    ecgCriteria: [
      "FC > 100 lpm (usualmente 100-150)",
      "Onda P sinusal presente antes de cada QRS",
      "PR constante",
      "QRS estrecho",
      "Inicio y fin gradual",
    ],
    mechanism:
      "Aumento del automatismo del nodo sinusal por estímulo simpático o reducción del tono vagal.",
    hemodynamicImpact:
      "Generalmente bien tolerada. En cardiopatía puede aumentar demanda de O₂ miocárdico.",
    icuContext:
      "Causa más frecuente de taquicardia en UCI. Siempre buscar la causa subyacente: fiebre, dolor, hipovolemia, anemia, hipoxia, TEP, sepsis.",
    management: [
      "Tratar la causa subyacente (dolor, fiebre, hipovolemia)",
      "No tratar la FC aisladamente",
      "Beta-bloqueantes solo si isquemia activa y causa controlada",
    ],
    differentialDx: ["TSV", "Flutter auricular 2:1", "Taquicardia auricular"],
    keyFact:
      "Una FC ~150 lpm debe hacer sospechar flutter auricular 2:1 antes que taquicardia sinusal.",
  },
  {
    id: "sinus-bradycardia",
    name: "Bradicardia Sinusal",
    category: "bradicardia",
    severity: "moderada",
    image: sinusBradycardia,
    description:
      "Ritmo sinusal con FC < 60 lpm. Puede ser fisiológica en atletas o patológica en disfunción sinusal.",
    ecgCriteria: [
      "FC < 60 lpm",
      "Onda P sinusal presente",
      "PR normal o ligeramente prolongado",
      "QRS estrecho",
      "Ritmo regular",
    ],
    mechanism:
      "Disminución del automatismo del nodo sinusal por predominio vagal o lesión del nodo.",
    hemodynamicImpact:
      "Bien tolerada en jóvenes/atletas. Puede causar hipotensión, síncope y bajo gasto si FC < 40 lpm.",
    icuContext:
      "Frecuente por fármacos (beta-bloqueantes, amiodarona, propofol), hipotiroidismo, hipotermia, HTE, reflejo de Cushing.",
    management: [
      "Atropina 0.5-1 mg IV si sintomática",
      "Suspender fármacos bradicardizantes",
      "Isoproterenol en infusión si refractaria",
      "Marcapasos transitorio si inestable",
    ],
    differentialDx: [
      "Bloqueo AV de 1er grado",
      "Ritmo de la unión",
      "Enfermedad del nodo sinusal",
    ],
    keyFact:
      "En el reflejo de Cushing (HTE), la bradicardia + hipertensión + respiración irregular es una tríada ominosa.",
  },
  {
    id: "atrial-fibrillation",
    name: "Fibrilación Auricular",
    category: "supraventricular",
    severity: "moderada",
    image: atrialFibrillation,
    description:
      "Activación auricular caótica y desorganizada que produce una respuesta ventricular irregularmente irregular. Es la arritmia sostenida más frecuente (prevalencia 2-4%).",
    ecgCriteria: [
      "Ausencia de ondas P definidas",
      "Línea de base fibrilatoria (ondas f)",
      "Intervalos RR irregularmente irregulares",
      "QRS generalmente estrecho",
      "FC variable (60-170 lpm)",
    ],
    mechanism:
      "Múltiples frentes de onda reentrantes en las aurículas, frecuentemente originados en las venas pulmonares. Se requiere un evento promotor (cambios en tensión auricular, extrasístoles, cambios autonómicos) y un sustrato favorecedor (inflamación, fibrosis). Posteriormente se produce remodelado auricular (edema, dilatación, hipertrofia celular) que perpetúa la arritmia.",
    hemodynamicImpact:
      "Pérdida de la contracción auricular (pérdida del 15-25% del GC). Riesgo tromboembólico elevado por estasis en orejuela izquierda.",
    icuContext:
      "FA de nueva aparición en UCI asociada a sepsis, cirugía cardíaca, hipoxia, alteraciones electrolíticas (hipoK, hipoMg). Aumenta mortalidad en sepsis. En diabéticos suele ser asintomática con riesgo de infarto cerebral silente (61%).",
    management: [
      "Control de frecuencia: Metoprolol 5 mg IV/5-10 min (máx 15 mg), Verapamilo 2.5-5 mg IV/2 min, β-metildigoxina 0.1 mg/ml IV",
      "Control de ritmo: Amiodarona 150 mg IV/3-5 min → 360 mg/6h (1 mg/min) → 540 mg/18h (0.5 mg/min)",
      "Propafenona: bolo 2 mg/kg IV en 10 seg, mantenimiento 5-7 mg/kg/24h",
      "Anticoagulación según CHA₂DS₂-VASc (INR 2-3)",
      "Cardioversión eléctrica bifásica 100-200J si inestabilidad hemodinámica",
      "Ablación con catéter en FA paroxística refractaria a ≥1 antiarrítmico clase I o III",
    ],
    differentialDx: [
      "Flutter auricular",
      "Taquicardia auricular multifocal",
      "Artefacto de movimiento",
    ],
    keyFact:
      "En sepsis, la FA de novo es un predictor independiente de mortalidad y ACV. Se clasifica en paroxística (<7 días), persistente (≥7 días) y permanente (crónica).",
    electrophysiology:
      "Mecanismo de reentrada con múltiples frentes de onda simultáneos. Las anormalidades anatómicas (fibrosis intersticial, infiltración grasa) crean el sustrato. El remodelado eléctrico auricular acorta los períodos refractarios, favoreciendo la perpetuación.",
    pharmacology:
      "El control de frecuencia se prioriza en pacientes estables. La amiodarona es el fármaco de elección en UCI por menor efecto inotrópico negativo. Precaución con β-metildigoxina + amiodarona simultáneas (arritmias graves).",
    escGuideline:
      "Guía ESC 2022: La ablación con catéter está indicada (Clase I) en FA paroxística sintomática refractaria a ≥1 antiarrítmico. La anticoagulación crónica es fundamental con CHA₂DS₂-VASc ≥1 en hombres o ≥2 en mujeres.",
    references: [
      "Guía ESC 2022 sobre arritmias ventriculares y prevención de muerte súbita cardíaca",
      "Baquero Alonso M et al. Recomendaciones de buena práctica clínica en arritmias. Semergen 2010",
      "Gaztañaga L et al. Mecanismos de las arritmias cardiacas. Rev Esp Cardiol 2012;65:174-185",
    ],
  },
  {
    id: "atrial-flutter",
    name: "Flutter Auricular",
    category: "supraventricular",
    severity: "moderada",
    image: atrialFlutter,
    description:
      "Taquiarritmia auricular con circuito de macrorreentrada, produciendo ondas F en dientes de sierra a ~300 lpm.",
    ecgCriteria: [
      "Ondas F en dientes de sierra (mejor en DII, DIII, aVF y V1)",
      "Frecuencia auricular ~300 lpm",
      "Conducción AV fija (2:1, 3:1, 4:1) o variable",
      "FC ventricular 150 lpm (si 2:1) o 75 lpm (si 4:1)",
      "QRS estrecho (salvo conducción aberrante)",
    ],
    mechanism:
      "Circuito de macrorreentrada en la aurícula derecha, generalmente alrededor del istmo cavotricuspídeo.",
    hemodynamicImpact:
      "Similar a FA. Conducción 2:1 puede causar taquicardia sostenida con compromiso hemodinámico.",
    icuContext:
      "Frecuente post-cirugía cardíaca. Puede degenerar en FA. La conducción 1:1 (FC ~300) es una emergencia.",
    management: [
      "Control de frecuencia: similar a FA",
      "Cardioversión eléctrica (50-100 J sincronizado)",
      "Sobreestimulación auricular con marcapasos transitorio",
      "Amiodarona o ibutilida para conversión farmacológica",
      "Ablación del istmo cavotricuspídeo (tratamiento definitivo)",
    ],
    differentialDx: ["Taquicardia sinusal", "TSV", "Taquicardia auricular"],
    keyFact:
      "Una FC ventricular de exactamente ~150 lpm debe siempre hacer sospechar flutter 2:1. Buscar ondas F ocultas.",
  },
  {
    id: "svt",
    name: "Taquicardia Supraventricular (TSV)",
    category: "supraventricular",
    severity: "moderada",
    image: svt,
    description:
      "Taquicardia de QRS estrecho por reentrada nodal (TRNAV) o por vía accesoria (TRAV). FC 150-250 lpm.",
    ecgCriteria: [
      "FC 150-250 lpm",
      "QRS estrecho y regular",
      "Ondas P ausentes o retrógradas (pseudo-S en DII, pseudo-r' en V1)",
      "Inicio y fin bruscos (paroxística)",
      "Sin ondas F visibles",
    ],
    mechanism:
      "Circuito de reentrada en el nodo AV (TRNAV, 60%) o a través de vía accesoria (TRAV, 30%).",
    hemodynamicImpact:
      "Bien tolerada si corazón sano. Puede causar hipotensión, ángor y edema pulmonar en cardiopatía.",
    icuContext:
      "Puede ser desencadenada por catecolaminas exógenas, alteraciones electrolíticas, o estrés. Diferenciar de taquicardia sinusal y flutter.",
    management: [
      "Maniobras vagales (Valsalva modificado, masaje carotídeo)",
      "Adenosina 6 mg → 12 mg IV rápido",
      "Verapamilo o diltiazem IV si adenosina no disponible",
      "Cardioversión eléctrica sincronizada si inestable",
      "Beta-bloqueantes para prevención de recurrencias",
    ],
    differentialDx: [
      "Taquicardia sinusal",
      "Flutter auricular",
      "Taquicardia auricular",
      "TV fascicular",
    ],
    keyFact:
      "La adenosina es diagnóstica y terapéutica: si revierte la taquicardia, confirma reentrada nodal/vía accesoria.",
  },
  {
    id: "wpw",
    name: "Wolff-Parkinson-White (WPW)",
    category: "preexcitacion",
    severity: "critica",
    image: wpw,
    description:
      "Síndrome de preexcitación ventricular por vía accesoria (haz de Kent) que permite conducción AV rápida.",
    ecgCriteria: [
      "PR corto < 120 ms",
      "Onda delta (empastamiento inicial del QRS)",
      "QRS ancho (> 110 ms) por preexcitación",
      "Alteraciones secundarias de ST-T",
      "Patrón tipo A (delta + en V1) o tipo B (delta - en V1)",
    ],
    mechanism:
      "Vía accesoria (haz de Kent) que conecta aurículas y ventrículos saltándose el nodo AV, permitiendo preexcitación.",
    hemodynamicImpact:
      "Riesgo de muerte súbita si FA conduce por vía accesoria (FC > 300 → FV).",
    icuContext:
      "CONTRAINDICADOS: adenosina, verapamilo, digoxina, diltiazem en FA con WPW (pueden acelerar conducción por vía accesoria → FV).",
    management: [
      "TSV ortodrómica: adenosina o cardioversión",
      "FA con preexcitación: procainamida o cardioversión eléctrica",
      "NUNCA adenosina, verapamilo ni digoxina en FA preexcitada",
      "Ablación de vía accesoria (tratamiento definitivo)",
    ],
    differentialDx: [
      "Bloqueo de rama",
      "TV",
      "Infarto con patrón de pseudoinfarto",
    ],
    keyFact:
      "La FA en WPW es una emergencia: la conducción rápida por la vía accesoria puede degenerar en FV y muerte súbita.",
  },
  {
    id: "ventricular-tachycardia",
    name: "Taquicardia Ventricular Monomórfica (TV)",
    category: "ventricular",
    severity: "critica",
    image: ventricularTachycardia,
    description:
      "Taquicardia de QRS ancho originada por debajo del haz de His. FC 150-250 lpm. Los QRS son iguales entre sí en un mismo episodio. Puede ser sostenida (>30s) o no sostenida.",
    ecgCriteria: [
      "QRS ancho > 120 ms, pero iguales entre sí",
      "FC 150-250 lpm",
      "Disociación AV (ondas P independientes)",
      "Latidos de captura y fusión (patognomónicos)",
      "Concordancia en precordiales",
      "Intervalo PR ausente por disociación AV",
    ],
    mechanism:
      "Reentrada en áreas de necrosis miocárdica con bandas de tejido intacto alternadas con tejido cicatrizal. La conducción se enlentece, aparecen focos ectópicos y despolarizaciones repetitivas rápidas por fenómenos de reentrada.",
    hemodynamicImpact:
      "Alto riesgo de deterioro hemodinámico, shock y degeneración a FV. TV sostenida es emergencia médica.",
    icuContext:
      "Asociada a isquemia miocárdica, miocardiopatía, alteraciones electrolíticas (hipoK, hipoMg), toxicidad por fármacos (antidepresivos tricíclicos, procainamida, antihistamínicos), catéteres intracardíacos.",
    management: [
      "Amiodarona: bolo 300 mg IV inmediato (dilución 20-30 ml dextrosa 5%), si no responde 150 mg IV/3-5 min",
      "Infusión lenta: 360 mg IV/6h (1 mg/min), mantenimiento: 540 mg IV/18h (0.5 mg/min)",
      "Lidocaína: 1-1.5 mg/kg IV como alternativa",
      "Cardioversión eléctrica sincronizada si inestable",
      "TV sin pulso: desfibrilación + ACLS",
      "Corregir causas reversibles (4H y 4T)",
    ],
    differentialDx: [
      "TSV con conducción aberrante",
      "TSV con bloqueo de rama",
      "Ritmo de marcapasos",
      "Hiperpotasemia severa",
    ],
    keyFact:
      "Ante taquicardia de QRS ancho, asumir TV hasta demostrar lo contrario. Los criterios de Brugada ayudan en la diferenciación.",
    electrophysiology:
      "El mecanismo principal es la reentrada anatómica alrededor de cicatrices de infarto. El circuito tiene una zona de conducción lenta (istmo) entre barreras anatómicas de tejido no excitable. La ablación con catéter se dirige a este istmo.",
    pharmacology:
      "La amiodarona (clase III) es el antiarrítmico de primera línea. Bloquea canales de K+, Na+ y Ca2+, y tiene efecto anti-adrenérgico. La lidocaína (clase IB) es alternativa en isquemia aguda.",
    escGuideline:
      "ESC 2022: La ablación con catéter está recomendada (Clase I) en pacientes con TV monomórfica recurrente a pesar de tratamiento con amiodarona, o como primera línea en TV idiopática del TSVD/TSVI.",
    references: [
      "Guía ESC 2022 sobre arritmias ventriculares y prevención de MSC",
      "Vallejo Hernández R et al. Arritmias. Bot Plus Web 2017",
    ],
  },
  {
    id: "ventricular-fibrillation",
    name: "Fibrilación Ventricular (FV)",
    category: "ventricular",
    severity: "critica",
    image: ventricularFibrillation,
    description:
      "Actividad eléctrica ventricular caótica y desorganizada sin contracción efectiva. Ritmo de paro cardíaco desfibrilable.",
    ecgCriteria: [
      "Ondulaciones caóticas e irregulares",
      "Sin QRS, ondas P ni ondas T identificables",
      "Amplitud y frecuencia variables",
      "FV gruesa (mayor amplitud, mejor pronóstico) vs FV fina",
      "Ausencia completa de organización eléctrica",
    ],
    mechanism:
      "Múltiples frentes de onda reentrantes en los ventrículos con despolarización completamente desorganizada.",
    hemodynamicImpact:
      "Paro cardíaco. Gasto cardíaco = 0. Muerte en minutos sin desfibrilación.",
    icuContext:
      "Causa más frecuente de muerte súbita cardíaca. En UCI: isquemia aguda, alteraciones electrolíticas severas, toxicidad de fármacos.",
    management: [
      "Desfibrilación inmediata (200 J bifásico)",
      "RCP de alta calidad (ACLS)",
      "Adrenalina 1 mg IV cada 3-5 min",
      "Amiodarona 300 mg → 150 mg IV",
      "Buscar y tratar causas reversibles (4H y 4T)",
      "Considerar hipotermia terapéutica post-ROSC",
    ],
    differentialDx: [
      "Artefacto de movimiento",
      "FV fina vs asistolia",
      "TV polimórfica",
    ],
    keyFact:
      "La supervivencia disminuye ~10% por cada minuto sin desfibrilación. La FV gruesa tiene mejor pronóstico que la FV fina.",
  },
  {
    id: "torsades",
    name: "Torsades de Pointes",
    category: "ventricular",
    severity: "critica",
    image: torsades,
    description:
      "TV polimórfica asociada a QT largo. Patrón característico de QRS que 'gira' alrededor de la línea de base.",
    ecgCriteria: [
      "TV polimórfica con QRS que cambian de amplitud y eje",
      "Patrón de 'huso' (waxing and waning)",
      "Precedida por QT largo (> 500 ms)",
      "Secuencia short-long-short típica al inicio",
      "FC 150-300 lpm",
    ],
    mechanism:
      "Post-despolarizaciones tempranas (EADs) en contexto de QT prolongado, con reentrada funcional.",
    hemodynamicImpact:
      "Puede autolimitarse o degenerar en FV. Episodios repetitivos causan síncope y muerte súbita.",
    icuContext:
      "Causas en UCI: fármacos (amiodarona, haloperidol, ondansetrón, metadona), hipoK, hipoMg, hipoCa, bradicardia, hipotermia.",
    management: [
      "Sulfato de magnesio 2 g IV en 2-5 min (1ª línea)",
      "Isoproterenol para aumentar FC y acortar QT",
      "Marcapasos transitorio a FC alta (90-110 lpm)",
      "Suspender TODOS los fármacos que prolongan QT",
      "Corregir hipokalemia (K+ objetivo > 4.5 mEq/L)",
      "Desfibrilación si degenera en FV",
    ],
    differentialDx: ["TV polimórfica sin QT largo", "FV", "Artefacto"],
    keyFact:
      "El magnesio IV es el tratamiento de 1ª línea, incluso con magnesemia normal. La amiodarona está CONTRAINDICADA (prolonga QT).",
  },
  {
    id: "lbbb",
    name: "Bloqueo de Rama Izquierda (BRI)",
    category: "bloqueo",
    severity: "moderada",
    image: lbbb,
    description:
      "Retraso en la conducción por la rama izquierda del haz de His. El ventrículo izquierdo se despolariza tardíamente desde el derecho, causando una despolarización ventricular asincrónica y un QRS ancho. Un BRI de novo casi siempre indica patología subyacente.",
    ecgCriteria: [
      "QRS ancho > 120 ms.",
      "Morfología en V1: Onda S ancha y profunda, a menudo como un complejo QS o rS (letra 'W').",
      "Morfología en V6: Onda R ancha, monofásica, empastada o con muescas (letra 'M'). Ausencia de onda Q septal.",
      "Alteraciones secundarias de la repolarización: ST deprimido y onda T negativa en derivaciones con R dominante (I, aVL, V5-V6).",
      "Eje del QRS frecuentemente desviado a la izquierda.",
    ],
    mechanism:
      "El impulso despolariza primero el septo y el VD. Luego, la activación se propaga lentamente al VI a través del miocardio, de derecha a izquierda. Este retraso masivo en la activación del VI genera el QRS ancho y la morfología característica.",
    hemodynamicImpact:
      "Causa disincronía interventricular e intraventricular, con contracción tardía del VI que puede reducir la eficiencia cardíaca y la FEVI. Puede inducir o empeorar la insuficiencia cardíaca.",
    icuContext:
      "Un BRI de novo en un paciente con dolor torácico agudo es un equivalente de SCACEST hasta que se demuestre lo contrario (aplicar criterios de Sgarbossa para el diagnóstico de IAM).",
    management: [
      "No requiere tratamiento agudo per se. Buscar y tratar la causa subyacente (isquemia, IC).",
      "En pacientes con IC sintomática y FEVI < 35%, considerar Terapia de Resincronización Cardíaca (TRC) para mejorar la sincronía y la función ventricular.",
    ],
    differentialDx: [
      "Taquicardia ventricular",
      "Ritmo de marcapasos ventricular",
      "Hiperpotasemia severa",
    ],
    keyFact:
      "Regla mnemotécnica para V1 y V6: 'WiLLiaM'. La 'W' en V1 (ViLLiam) y la 'M' en V6 (wiLLiaM) sugieren un bloqueo de rama izquierda (Left).",
  },
  {
    id: "rbbb",
    name: "Bloqueo de Rama Derecha (BRD)",
    category: "bloqueo",
    severity: "benigna",
    image: rbbb,
    description:
      "Retraso en la conducción por la rama derecha del haz de His. El ventrículo derecho se despolariza tardíamente desde el izquierdo. Puede ser un hallazgo benigno en corazones sanos.",
    ecgCriteria: [
      "QRS ancho > 120 ms.",
      "Morfología en V1: Patrón rSR' o rsR' con R' alta y ancha (orejas de conejo, letra 'M').",
      "Morfología en V6: Onda S ancha, empastada y profunda (letra 'W'). Onda q y R preservadas.",
      "Alteraciones secundarias de la repolarización: Ondas T negativas en precordiales derechas (V1-V3).",
      "Eje del QRS usualmente normal.",
    ],
    mechanism:
      "El septo y el VI se despolarizan normalmente a través de la rama izquierda. El impulso luego viaja lentamente hacia el VD a través del miocardio. La activación tardía del VD genera el vector final lento (onda R' en V1 y S ancha en V6).",
    hemodynamicImpact:
      "Generalmente bien tolerado hemodinámicamente, no causa disincronía ventricular significativa. Suele ser un hallazgo incidental sin repercusión clínica en individuos sanos.",
    icuContext:
      "Un BRD puede ser un hallazgo crónico. Si es de nueva aparición, debe hacer sospechar una sobrecarga aguda del ventrículo derecho, como en un tromboembolismo pulmonar (TEP), especialmente si se asocia al patrón S1Q3T3.",
    management: [
      "Generalmente no requiere tratamiento. Investigar causas subyacentes (TEP, enfermedad pulmonar crónica) si es de nueva aparición y el contexto clínico lo sugiere.",
    ],
    differentialDx: [
      "Síndrome de Brugada (tipo 2)",
      "Displasia arritmogénica del VD",
      "Colocación alta de electrodos V1-V2",
      "TV con origen en TSVD",
    ],
    keyFact:
      "Regla mnemotécnica para V1 y V6: 'MaRRoW'. La 'M' en V1 (MaRRow) y la 'W' (onda S ancha) en V6 (marroW) sugieren un bloqueo de rama derecha (Right).",
  },
  {
    id: "pvc",
    name: "Extrasístoles Ventriculares (EV/CVP)",
    category: "ventricular",
    severity: "benigna",
    image: pvc,
    description:
      "Latidos prematuros originados en los ventrículos. Frecuentes y generalmente benignas en corazón sano.",
    ecgCriteria: [
      "QRS ancho y prematuro (> 120 ms)",
      "Sin onda P precedente",
      "Pausa compensadora completa",
      "Onda T en dirección opuesta al QRS",
      "Pueden ser unifocales o multifocales",
      "Bigeminismo (alternantes), trigeminismo, pareadas",
    ],
    mechanism:
      "Foco ectópico ventricular con automatismo aumentado, reentrada focal o actividad gatillada.",
    hemodynamicImpact:
      "Aisladas sin impacto. Frecuentes (> 10% del total) pueden causar taquicardiomiopatía a largo plazo.",
    icuContext:
      "Muy frecuentes en UCI. Causas: hipoxia, catecolaminas, hipoK, hipoMg, catéteres intracardíacos. Las R sobre T pueden desencadenar TV/FV.",
    management: [
      "Corregir causas reversibles (electrolitos, hipoxia)",
      "No tratar EV aisladas en corazón sano",
      "Beta-bloqueantes si sintomáticas",
      "Retirar catéter venoso central si EV por irritación mecánica",
      "Amiodarona si refractarias y frecuentes",
    ],
    differentialDx: [
      "Extrasístoles auriculares con aberrancia",
      "Latidos de escape ventricular",
      "Artefacto",
    ],
    keyFact:
      "El fenómeno R sobre T (EV que cae en el período vulnerable de la T) puede desencadenar TV/FV, especialmente en isquemia.",
  },
  {
    id: "junctional",
    name: "Ritmo de la Unión (Nodal)",
    category: "bradicardia",
    severity: "moderada",
    image: junctional,
    description:
      "Ritmo de escape originado en el nodo AV o haz de His. FC 40-60 lpm. Aparece cuando falla el nodo sinusal.",
    ecgCriteria: [
      "FC 40-60 lpm",
      "QRS estrecho (< 120 ms)",
      "P ausentes, retrógradas (negativas en DII) o posteriores al QRS",
      "Ritmo regular",
      "PR corto si P precede al QRS",
    ],
    mechanism:
      "Automatismo del nodo AV como ritmo de escape cuando el nodo sinusal falla o la conducción sinusal está bloqueada.",
    hemodynamicImpact:
      "Pérdida de la contribución auricular al llenado ventricular. Puede causar bajo gasto en pacientes con función diastólica comprometida.",
    icuContext:
      "Frecuente en intoxicación digitálica, post-cirugía cardíaca, IAM inferior, exceso de beta-bloqueantes.",
    management: [
      "Tratar la causa subyacente",
      "Atropina si sintomático",
      "Suspender digoxina si intoxicación",
      "Marcapasos si bradicardia sintomática persistente",
    ],
    differentialDx: [
      "Bradicardia sinusal con P de baja amplitud",
      "Ritmo idioventricular acelerado",
      "BAV completo con escape nodal",
    ],
    keyFact:
      "En intoxicación digitálica, la taquicardia de la unión (ritmo nodal acelerado > 60 lpm) es un hallazgo característico.",
  },
  {
    id: "brugada",
    name: "Síndrome de Brugada",
    category: "canalopatia",
    severity: "critica",
    image: brugada,
    description:
      "Canalopatía con patrón ECG característico en V1-V3 y riesgo de muerte súbita por arritmias ventriculares.",
    ecgCriteria: [
      "Tipo 1 (diagnóstico): elevación ST coved ≥ 2 mm en V1-V2 con T negativa",
      "Tipo 2: elevación ST en silla de montar (saddleback) ≥ 2 mm",
      "Imagen de BRD completo o incompleto",
      "QRS puede ser normal o ligeramente prolongado",
      "Patrón puede ser intermitente o desenmascarado por fiebre/fármacos",
    ],
    mechanism:
      "Mutación en canales de sodio (SCN5A) que crea un gradiente transmural en el TSVD, generando un sustrato arritmogénico.",
    hemodynamicImpact:
      "El patrón ECG per se no afecta la hemodinámica, pero predispone a FV y muerte súbita, especialmente durante el sueño.",
    icuContext:
      "La fiebre puede desenmascarar o exacerbar el patrón → tratar agresivamente la fiebre. Evitar propofol, cocaína, y bloqueadores de Na+ en estos pacientes.",
    management: [
      "DAI (desfibrilador automático implantable) si síncope o TV/FV documentada",
      "Control agresivo de fiebre (paracetamol, enfriamiento)",
      "Evitar fármacos de la lista de Brugada (www.brugadadrugs.org)",
      "Isoproterenol para tormentas eléctricas",
      "Quinidina como alternativa farmacológica",
    ],
    differentialDx: [
      "BRD",
      "Pericarditis",
      "IAM de VD",
      "Patrón de Brugada fenocopia",
    ],
    keyFact:
      "La fiebre es el desencadenante más común de arritmias en Brugada. En UCI, controlar agresivamente la temperatura.",
  },
  {
    id: "long-qt",
    name: "Síndrome de QT Largo",
    category: "canalopatia",
    severity: "critica",
    image: longQt,
    description:
      "Prolongación del intervalo QT corregido (QTc > 470 ms hombres, > 480 ms mujeres) con riesgo de torsades de pointes.",
    ecgCriteria: [
      "QTc prolongado (Bazett: QT/√RR)",
      "QTc > 500 ms = alto riesgo de arritmias",
      "Ondas T con morfología anormal (muescas, bífidas, de baja amplitud)",
      "Ondas U prominentes",
      "Alternancia eléctrica de la onda T (signo ominoso)",
    ],
    mechanism:
      "Prolongación de la repolarización ventricular por disfunción de canales iónicos (K+ o Na+), creando sustrato para EADs y torsades.",
    hemodynamicImpact:
      "El QT largo per se no afecta hemodinámica, pero las torsades resultantes causan síncope, convulsiones y muerte súbita.",
    icuContext:
      "Causa adquirida más frecuente: fármacos (amiodarona, haloperidol, ondansetrón, eritromicina, metoclopramida) + hipoK + hipoMg.",
    management: [
      "Suspender fármacos que prolongan QT",
      "Corregir K+ > 4.5 mEq/L y Mg²+ > 2 mg/dL",
      "Magnesio IV profiláctico si QTc > 500 ms",
      "Monitorización continua del QTc",
      "Beta-bloqueantes para QT largo congénito (LQT1, LQT2)",
      "DAI si alto riesgo o eventos previos",
    ],
    differentialDx: [
      "QT prolongado normal por bradicardia",
      "Hipocalcemia",
      "Hipotiroidismo",
    ],
    keyFact:
      "En UCI, medir QTc al ingreso y cada vez que se añade un fármaco nuevo. QTc > 500 ms o aumento > 60 ms = suspender fármaco.",
  },
  {
    id: "asystole",
    name: "Asistolia",
    category: "ventricular",
    severity: "critica",
    image: asystole,
    description:
      "Ausencia de actividad eléctrica ventricular. Ritmo de paro cardíaco NO desfibrilable. Peor pronóstico que FV.",
    ecgCriteria: [
      "Línea isoeléctrica plana",
      "Ausencia completa de QRS",
      "Pueden existir ondas P aisladas (asistolia ventricular)",
      "Confirmar en al menos 2 derivaciones",
      "Descartar FV fina y errores técnicos",
    ],
    mechanism:
      "Cese completo de la actividad eléctrica ventricular. Puede ser primaria o terminal (post-FV prolongada).",
    hemodynamicImpact:
      "Paro cardíaco. Sin gasto cardíaco ni perfusión. Muerte si no se trata inmediatamente.",
    icuContext:
      "Causas en UCI: hipoxia severa, acidosis, hiperpotasemia, hipotermia profunda, FV deteriorada. Pronóstico generalmente pobre.",
    management: [
      "RCP inmediata de alta calidad",
      "Adrenalina 1 mg IV cada 3-5 min",
      "NO desfibrilar (ritmo no desfibrilable)",
      "Buscar causas reversibles (4H y 4T)",
      "Considerar marcapasos transcutáneo solo si ondas P presentes",
      "Evaluar criterios de cese de reanimación",
    ],
    differentialDx: [
      "FV fina",
      "Desconexión de electrodos",
      "Interferencia técnica",
    ],
    keyFact:
      "Siempre verificar la asistolia en 2 derivaciones. Buscar las 4H (hipoxia, hipovolemia, hipo/hiperK, hipotermia) y 4T (tensión neumotórax, taponamiento, tóxicos, TEP).",
  },
  {
    id: "pacemaker",
    name: "Ritmo de Marcapasos",
    category: "otros",
    severity: "benigna",
    image: pacemaker,
    description:
      "Ritmo generado por un marcapasos artificial. Se identifica por espículas de estimulación antes de las ondas estimuladas.",
    ecgCriteria: [
      "Espículas de estimulación (spikes) antes de P y/o QRS",
      "QRS ancho con morfología de BRI si estimulación ventricular derecha",
      "Ritmo regular a la frecuencia programada",
      "Puede tener latidos fusión o pseudofusión",
      "Modo de estimulación variable (AAI, VVI, DDD)",
    ],
    mechanism:
      "Dispositivo electrónico que genera impulsos eléctricos para estimular aurículas, ventrículos o ambos según programación.",
    hemodynamicImpact:
      "Restaura la frecuencia cardíaca adecuada. El síndrome de marcapasos puede ocurrir por pérdida de sincronía AV en modo VVI.",
    icuContext:
      "Evaluar: captura (spike seguido de contracción), sensado (detección de actividad intrínseca), umbrales. Las alteraciones electrolíticas pueden afectar los umbrales.",
    management: [
      "Verificar captura y sensado",
      "Evaluar función con imán si duda",
      "Corregir electrolitos (K+ afecta umbral)",
      "Reprogramar si disfunción",
      "Monitorización continua post-implante",
    ],
    differentialDx: [
      "TV (si no se ven spikes)",
      "BRI con QRS ancho",
      "Disfunción de marcapasos",
    ],
    keyFact:
      "Fallo de captura: spike sin QRS. Fallo de sensado: spike compitiendo con ritmo propio (riesgo de R sobre T).",
  },
  {
    id: "multifocal-atrial-tachycardia",
    name: "Taquicardia Auricular Multifocal (TAM)",
    category: "supraventricular",
    severity: "moderada",
    image: normalSinus, // reuse image
    description:
      "Taquicardia irregular con ≥ 3 morfologías de onda P diferentes. Frecuente en EPOC descompensado e hipoxia.",
    ecgCriteria: [
      "FC > 100 lpm",
      "≥ 3 morfologías de onda P diferentes",
      "Intervalos PP, PR y RR variables",
      "Línea de base isoeléctrica entre ondas P",
      "QRS estrecho",
    ],
    mechanism:
      "Focos ectópicos auriculares múltiples con automatismo aumentado, típicamente por distensión auricular o hipoxia.",
    hemodynamicImpact:
      "Variable según FC y cardiopatía subyacente. Puede ser confundida con FA.",
    icuContext:
      "Muy asociada a EPOC exacerbado, hipoxia, hipercapnia, teofilina, insuficiencia cardíaca, hipomagnesemia.",
    management: [
      "Tratar la causa subyacente (EPOC, hipoxia)",
      "Corregir Mg²+ y K+",
      "Magnesio IV incluso con niveles normales",
      "Verapamilo puede ser útil para control de FC",
      "La cardioversión eléctrica NO es efectiva",
    ],
    differentialDx: [
      "Fibrilación auricular",
      "Flutter auricular con conducción variable",
      "Taquicardia sinusal",
    ],
    keyFact:
      "A diferencia de la FA, la TAM tiene ondas P claramente visibles con línea isoeléctrica. El magnesio es clave en el tratamiento.",
  },
  {
    id: "idioventricular-accelerated",
    name: "Ritmo Idioventricular Acelerado (RIVA)",
    category: "ventricular",
    severity: "benigna",
    image: riva,
    description:
      "Ritmo ventricular a FC 60-120 lpm. Frecuente como signo de reperfusión post-trombolisis o angioplastia en IAM.",
    ecgCriteria: [
      "QRS ancho > 120 ms",
      "FC 60-120 lpm (más lento que TV)",
      "Ritmo regular",
      "Inicio y fin graduales (no paroxístico)",
      "Fusión con ritmo sinusal frecuente",
    ],
    mechanism:
      "Automatismo aumentado de fibras de Purkinje, frecuentemente por reperfusión coronaria.",
    hemodynamicImpact:
      "Generalmente bien tolerado. La FC moderada mantiene gasto cardíaco aceptable.",
    icuContext:
      "Arritmia de reperfusión por excelencia. Su aparición post-fibrinolisis sugiere reperfusión exitosa. No requiere tratamiento antiarrítmico.",
    management: [
      "Observación (generalmente autolimitado)",
      "NO suprimir con antiarrítmicos (puede eliminar un ritmo de rescate)",
      "Atropina si FC inadecuada",
      "Tratar solo si compromiso hemodinámico",
    ],
    differentialDx: [
      "TV lenta",
      "Ritmo de escape ventricular",
      "Ritmo de marcapasos",
    ],
    keyFact:
      "El RIVA es un marcador de reperfusión exitosa. Tratarlo con antiarrítmicos puede suprimir el único ritmo viable del paciente.",
  },
  {
    id: "polymorphic-vt",
    name: "Taquicardia Ventricular Polimórfica",
    category: "ventricular",
    severity: "critica",
    image: torsades,
    description:
      "TV con QRS de morfología variable y amplias variaciones. Cuando se asocia a QT largo se denomina torsades de pointes. Rápido deterioro a FV.",
    ecgCriteria: [
      "FC 150-250 lpm",
      "Ritmo ventricular regular o irregular",
      "QRS ancho con amplias variaciones morfológicas",
      "Disociación AV",
      "Intervalo PR ausente",
    ],
    mechanism:
      "Actividad desencadenada (post-despolarizaciones tempranas o tardías) combinada con reentrada funcional en sustrato heterogéneo. En isquemia aguda, las bandas de necrosis alternadas con tejido intacto crean gradientes de repolarización que favorecen la reentrada.",
    hemodynamicImpact:
      "Rápido deterioro hemodinámico. Alta probabilidad de degeneración a FV si no se trata inmediatamente.",
    icuContext:
      "Causas principales: isquemia aguda (SCA), prolongación del QT por fármacos, hipokalemia severa, hipomagnesemia, síndromes hereditarios del QT largo.",
    management: [
      "Si QT largo: Magnesio 2g IV + isoproterenol + marcapasos (ver Torsades)",
      "Si QT normal: Amiodarona 300 mg IV bolo + tratar isquemia",
      "Desfibrilación bifásica 120-200J si degenera en FV",
      "Corrección agresiva de electrolitos",
      "Beta-bloqueantes IV si sospecha de isquemia",
    ],
    differentialDx: [
      "Torsades de Pointes",
      "FV",
      "TV monomórfica con aberrancia variable",
      "Artefacto",
    ],
    keyFact:
      "La TV polimórfica con QT normal suele ser isquémica y se trata con amiodarona. Con QT largo es torsades y se trata con magnesio (amiodarona CONTRAINDICADA).",
    escGuideline:
      "ESC 2022: En TV polimórfica sostenida/recurrente sin QT largo, buscar isquemia aguda (coronariografía urgente). Beta-bloqueantes IV como primera línea si sospecha de isquemia.",
    references: [
      "Guía ESC 2022 sobre arritmias ventriculares",
      "Vallejo Hernández R et al. Arritmias. Bot Plus Web 2017",
    ],
  },
  {
    id: "tvpc",
    name: "TV Polimórfica Catecolaminérgica (TVPC)",
    category: "canalopatia",
    severity: "critica",
    image: ventricularTachycardia,
    description:
      "Canalopatía hereditaria con TV polimórfica o bidireccional desencadenada por estrés físico o emocional en corazón estructuralmente normal.",
    ecgCriteria: [
      "ECG basal normal (diagnóstico por provocación)",
      "TV bidireccional (alternancia del eje QRS latido a latido) — patognomónica",
      "TV polimórfica reproducible con ejercicio",
      "Extrasístoles ventriculares crecientes con el esfuerzo",
      "FC de inicio típicamente > 120 lpm durante ejercicio",
    ],
    mechanism:
      "Mutación en receptor de rianodina (RyR2, 60%) o calsecuestrina (CASQ2). La estimulación adrenérgica causa liberación excesiva de Ca2+ del retículo sarcoplásmico, generando post-despolarizaciones tardías (DADs) y actividad desencadenada.",
    hemodynamicImpact:
      "La TV bidireccional puede degenerar en FV y causar muerte súbita, especialmente durante ejercicio físico intenso.",
    icuContext:
      "Sospechar en muerte súbita o síncope durante ejercicio con corazón estructuralmente normal y ECG basal normal. La ergometría es diagnóstica.",
    management: [
      "Beta-bloqueantes (nadolol preferido): piedra angular del tratamiento",
      "Flecainida como terapia adjunta si recurrencias con beta-bloqueantes",
      "DAI si TV/FV documentada a pesar de tratamiento óptimo",
      "Restricción de ejercicio competitivo (obligatoria)",
      "Denervación simpática cardíaca izquierda si refractaria",
    ],
    differentialDx: [
      "SQTL",
      "FV idiopática",
      "Síndrome de Brugada",
      "TV polimórfica isquémica",
    ],
    keyFact:
      "La TV bidireccional (alternancia latido a latido del eje QRS) durante ejercicio es prácticamente patognomónica de TVPC. Solo se ve también en intoxicación digitálica.",
    electrophysiology:
      "La sobreactivación de los receptores de rianodina (RyR2) produce fuga de Ca2+ del retículo sarcoplásmico durante la diástole, generando corrientes de entrada transitorias (Iti) que causan DADs. Cuando las DADs alcanzan el umbral, producen extrasístoles y TV.",
    escGuideline:
      "ESC 2022: Beta-bloqueantes sin actividad simpaticomimética intrínseca (Clase I). Flecainida como adjunto (Clase IIa). DAI recomendado en parada cardíaca previa (Clase I). Evitar ejercicio de competición (Clase III).",
    references: [
      "Guía ESC 2022: Sección 7.2.6 - TVPC",
      "Gaztañaga L et al. Mecanismos de las arritmias cardiacas. Rev Esp Cardiol 2012;65:174-185",
    ],
  },
  {
    id: "atrial-ectopic-tachycardia",
    name: "Taquicardia Auricular Ectópica",
    category: "supraventricular",
    severity: "moderada",
    image: sinusTachycardia,
    description:
      "Taquicardia originada en un foco auricular diferente al nodo sinusal. Puede ser repetitiva (benigna) o incesante (riesgo de miocardiopatía dilatada).",
    ecgCriteria: [
      "Onda P de morfología diferente a la sinusal",
      "P positiva en aVL indica foco en aurícula derecha",
      "P negativa en DI y positiva en V1 indica foco auricular izquierdo",
      "Frecuencia auricular 150-220 lpm",
      "Línea isoeléctrica entre ondas P",
      "QRS estrecho (generalmente)",
    ],
    mechanism:
      "Foco ectópico auricular con automatismo anormal o actividad desencadenada. La forma incesante puede causar remodelado y miocardiopatía dilatada por taquicardiomiopatía.",
    hemodynamicImpact:
      "Variable. La forma repetitiva es generalmente bien tolerada. La incesante puede causar insuficiencia cardíaca con miocardiopatía dilatada.",
    icuContext:
      "Asociada a cardiopatía estructural, intoxicación digitálica, hipocalcemia. La forma incesante tiene mala respuesta farmacológica y requiere ablación.",
    management: [
      "Adenosina 6 mg IV + 20 ml SF en 3 seg (diagnóstica: no revierte pero puede desenmascarar ondas P)",
      "Si no mejora: Adenosina 12 mg IV en 1-2 min",
      "Metoprolol 5 mg IV/5-10 min (máx 15 mg) para control de FC",
      "Ablación con catéter en forma incesante o refractaria",
      "Tratar causa subyacente (intoxicación digitálica, electrolitos)",
    ],
    differentialDx: [
      "Taquicardia sinusal",
      "Flutter auricular",
      "TSV (TRNAV)",
      "TAM",
    ],
    keyFact:
      "La adenosina no revierte la taquicardia auricular ectópica (a diferencia de la TSV por reentrada), pero puede desenmascarar las ondas P al producir bloqueo AV transitorio.",
    pharmacology:
      "La adenosina es útil como herramienta diagnóstica. Los beta-bloqueantes y calcio-antagonistas controlan la respuesta ventricular. La ablación con catéter tiene alta tasa de éxito en taquicardias focales.",
    references: ["Vallejo Hernández R et al. Arritmias. Bot Plus Web 2017"],
  },
  {
    id: "aesp",
    name: "Actividad Eléctrica Sin Pulso (AESP)",
    category: "ventricular",
    severity: "critica",
    image: asystole,
    description:
      "Ritmo eléctrico organizado en el ECG pero sin contracción mecánica efectiva. No genera pulso ni presión arterial. Ritmo de paro cardíaco NO desfibrilable.",
    ecgCriteria: [
      "ECG puede mostrar cualquier ritmo organizado",
      "QRS presentes pero sin pulso palpable",
      "Puede ser bradicárdico o taquicárdico",
      "QRS ancho sugiere peor pronóstico",
      "Diferente de asistolia: hay actividad eléctrica visible",
    ],
    mechanism:
      "Disociación electromecánica: el sistema eléctrico genera impulsos pero el miocardio no se contrae eficazmente por daño mecánico, metabólico o de llenado.",
    hemodynamicImpact:
      "Paro cardíaco. Sin gasto cardíaco efectivo a pesar de actividad eléctrica. Muerte si no se identifica y trata la causa.",
    icuContext:
      "Causas en UCI: hipovolemia severa (la más frecuente), neumotórax a tensión, taponamiento cardíaco, TEP masivo, hiperpotasemia, hipotermia, acidosis.",
    management: [
      "RCP inmediata de alta calidad",
      "Adrenalina 1 mg IV cada 3-5 min",
      "NO desfibrilar (ritmo no desfibrilable)",
      "Buscar y tratar causas reversibles (4H y 4T) — es la clave del manejo",
      "Ecografía POCUS para diagnóstico etiológico (taponamiento, TEP, hipovolemia)",
      "Volumen IV agresivo si sospecha de hipovolemia",
    ],
    differentialDx: [
      "Asistolia",
      "Bradicardia extrema con pulso débil",
      "Pseudo-AESP (contracción débil detectable por eco)",
    ],
    keyFact:
      "La AESP es tratable si se identifica la causa. A diferencia de la asistolia, buscar activamente causas reversibles puede salvar la vida. La ecografía en RCP ayuda a identificar taponamiento, TEP y contractilidad residual.",
  },
];

export const ecgInterpretationSteps = [
  {
    step: 1,
    title: "Frecuencia Cardíaca",
    description:
      "Calcular la FC: 300 ÷ número de cuadrados grandes entre 2 R consecutivas. O contar R en 6 segundos × 10.",
    checkpoints: [
      "¿FC normal (60-100), taquicardia (>100) o bradicardia (<60)?",
      "¿FC extrema (< 40 o > 150)?",
    ],
  },
  {
    step: 2,
    title: "Ritmo",
    description:
      "Evaluar regularidad de los intervalos RR. Determinar si el ritmo es regular, irregular regular o irregularmente irregular.",
    checkpoints: [
      "¿Los intervalos RR son regulares?",
      "¿Hay patrón en la irregularidad?",
      "¿Es irregularmente irregular (FA)?",
    ],
  },
  {
    step: 3,
    title: "Onda P",
    description: "Buscar ondas P, evaluar morfología, relación con QRS y eje.",
    checkpoints: [
      "¿Hay ondas P presentes?",
      "¿Son todas iguales? ¿Positivas en DII?",
      "¿Cada P va seguida de un QRS?",
      "¿Relación P:QRS es 1:1?",
    ],
  },
  {
    step: 4,
    title: "Intervalo PR",
    description:
      "Medir desde el inicio de la P hasta el inicio del QRS. Normal: 120-200 ms (3-5 cuadraditos).",
    checkpoints: [
      "¿PR normal (0.12-0.20 s)?",
      "¿PR corto (< 0.12 s)? → Preexcitación",
      "¿PR largo (> 0.20 s)? → BAV",
      "¿PR constante o variable?",
    ],
  },
  {
    step: 5,
    title: "Complejo QRS",
    description:
      "Evaluar duración (< 120 ms normal), morfología, eje y amplitud.",
    checkpoints: [
      "¿QRS estrecho (< 120 ms) o ancho (> 120 ms)?",
      "¿Eje normal, desviado a izquierda o derecha?",
      "¿Patrón de bloqueo de rama (BRI/BRD)?",
      "¿Ondas Q patológicas?",
    ],
  },
  {
    step: 6,
    title: "Segmento ST y Onda T",
    description:
      "Evaluar elevación/depresión del ST, morfología de la T e intervalo QT.",
    checkpoints: [
      "¿ST isoeléctrico, elevado o deprimido?",
      "¿Ondas T normales, invertidas, picudas o aplanadas?",
      "¿QTc normal (< 450 ms hombres, < 460 ms mujeres)?",
      "¿Ondas U presentes?",
    ],
  },
];
