export interface ProtocolStep {
  step: number;
  title: string;
  description: string;
  action: string;
  findings: string[];
  interpretation: string;
}

export interface Protocol {
  id: string;
  name: string;
  fullName: string;
  description: string;
  indication: string;
  zones: string[];
  steps: ProtocolStep[];
  color: string;
}

export const protocols: Protocol[] = [
  {
    id: "blue",
    name: "Protocolo BLUE",
    fullName: "Bedside Lung Ultrasound in Emergency",
    description:
      "Protocolo de diagnóstico rápido para insuficiencia respiratoria aguda. Permite identificar las principales causas de disnea en menos de 3 minutos.",
    indication:
      "Paciente con insuficiencia respiratoria aguda o disnea de causa no clara",
    zones: [
      "Punto BLUE anterior superior",
      "Punto BLUE anterior inferior",
      "Punto PLAPS (posterolateral)",
    ],
    steps: [
      {
        step: 1,
        title: "Evaluar deslizamiento pleural",
        description:
          "Colocar la sonda en el punto BLUE anterior superior. Evaluar presencia de deslizamiento pleural.",
        action: "Explorar punto anterior superior bilateral",
        findings: ["Deslizamiento presente", "Deslizamiento ausente"],
        interpretation:
          "Si ausente → buscar punto pulmonar → si presente: NEUMOTÓRAX. Si deslizamiento presente → continuar paso 2.",
      },
      {
        step: 2,
        title: "Evaluar perfil pulmonar",
        description:
          "Con deslizamiento presente, determinar si predominan líneas A o líneas B.",
        action: "Explorar ambos puntos BLUE anteriores bilateral",
        findings: [
          "Perfil A (líneas A predominantes)",
          "Perfil B (líneas B ≥3 bilateral)",
          "Perfil A/B (asimétrico)",
          "Perfil C (consolidación anterior)",
        ],
        interpretation:
          "Perfil B bilateral → EDEMA PULMONAR. Perfil A → continuar paso 3. Perfil A/B o C → NEUMONÍA.",
      },
      {
        step: 3,
        title: "Evaluar punto PLAPS",
        description:
          "Con perfil A anterior, explorar el punto PLAPS (posterolateral alveolar y/o pleural syndrome).",
        action: "Explorar punto PLAPS bilateral",
        findings: [
          "PLAPS positivo (consolidación y/o derrame)",
          "PLAPS negativo",
        ],
        interpretation:
          "Perfil A + PLAPS positivo → NEUMONÍA. Perfil A + PLAPS negativo → sospechar TEP (tromboembolismo pulmonar) o EPOC/Asma.",
      },
    ],
    color: "hsl(215, 80%, 28%)",
  },
  {
    id: "falls",
    name: "Protocolo FALLS",
    fullName: "Fluid Administration Limited by Lung Sonography",
    description:
      "Protocolo secuencial para el manejo del shock. Utiliza ecografía pulmonar para guiar la reposición de volumen y evitar la sobrecarga hídrica.",
    indication: "Paciente en shock de causa no clara. Guía de fluidoterapia.",
    zones: ["Puntos BLUE anteriores", "Evaluación cardíaca", "Punto PLAPS"],
    steps: [
      {
        step: 1,
        title: "Descartar shock obstructivo",
        description:
          "Realizar ecografía pulmonar y cardíaca para descartar neumotórax, taponamiento cardíaco y TEP masivo.",
        action: "Ecografía pulmonar + cardíaca rápida",
        findings: ["Neumotórax", "Taponamiento", "TEP", "Ninguno"],
        interpretation:
          "Si presente → tratar causa obstructiva. Si ninguno → continuar paso 2.",
      },
      {
        step: 2,
        title: "Evaluar perfil B (shock cardiogénico)",
        description:
          "Buscar líneas B difusas bilaterales que sugieran edema pulmonar por falla cardíaca.",
        action: "Explorar puntos BLUE anteriores bilateral",
        findings: ["Perfil B bilateral (líneas B difusas)", "Sin perfil B"],
        interpretation:
          "Si perfil B → SHOCK CARDIOGÉNICO (no dar volumen). Si no → continuar paso 3.",
      },
      {
        step: 3,
        title: "Prueba de volumen guiada por LUS",
        description:
          "En ausencia de perfil B, administrar volumen de forma controlada monitorizando la aparición de líneas B.",
        action: "Administrar bolo de cristaloide y re-evaluar",
        findings: [
          "Aparición de líneas B → STOP volumen",
          "Sin líneas B → continuar reposición",
          "Mejoría hemodinámica",
        ],
        interpretation:
          "Perfil A mantenido → SHOCK HIPOVOLÉMICO (continuar volumen). Aparición de B → límite de volumen alcanzado. Si no mejora → SHOCK DISTRIBUTIVO (vasopresores).",
      },
    ],
    color: "hsl(190, 70%, 42%)",
  },
  {
    id: "pleural-effusion-eval",
    name: "Evaluación de Derrame Pleural",
    fullName: "Protocolo de Evaluación Ecográfica de Derrame Pleural",
    description:
      "Evaluación sistemática del derrame pleural por ecografía: detección, cuantificación, caracterización y guía para procedimientos.",
    indication: "Sospecha de derrame pleural. Guía para toracocentesis.",
    zones: ["Zona posteroinferior", "Zona lateral", "Zona anterior"],
    steps: [
      {
        step: 1,
        title: "Detección del derrame",
        description:
          "Explorar zona posteroinferior con paciente sentado o semiincorporado. Buscar el signo del cuadrilátero.",
        action: "Sonda convexa en zona posteroinferior bilateral",
        findings: ["Signo del cuadrilátero presente", "Sin derrame visible"],
        interpretation:
          "Cuadrilátero presente → derrame confirmado → continuar evaluación. Ausente → buscar en otras posiciones.",
      },
      {
        step: 2,
        title: "Cuantificación",
        description:
          "Medir la distancia máxima entre pleura parietal y visceral en espiración.",
        action: "Medir distancia interpleural máxima",
        findings: [
          "< 15mm → derrame mínimo (~150ml)",
          "15-45mm → derrame moderado (500ml)",
          "> 45mm → derrame importante (>1000ml)",
        ],
        interpretation:
          "La cuantificación orienta la decisión terapéutica. Derrames >500ml suelen ser drenables.",
      },
      {
        step: 3,
        title: "Caracterización",
        description:
          "Evaluar la ecogenicidad del líquido y buscar septos, masas o signos de organización.",
        action: "Analizar características del líquido",
        findings: [
          "Anecoico → trasudado probable",
          "Ecogénico → exudado/sangre",
          "Septado → empiema/organizado",
          "Con masas → neoplasia",
        ],
        interpretation:
          "La caracterización ecográfica orienta la etiología y el manejo: trasudado (ICC, cirrosis), exudado (infección, neoplasia), hemotórax (trauma).",
      },
    ],
    color: "hsl(200, 70%, 45%)",
  },
  {
    id: "pneumothorax-eval",
    name: "Evaluación de Neumotórax",
    fullName: "Protocolo de Evaluación Ecográfica de Neumotórax",
    description:
      "Evaluación sistemática por ecografía para detectar neumotórax con alta sensibilidad y especificidad, superior a la radiografía de tórax.",
    indication:
      "Sospecha de neumotórax: trauma, post-procedimiento, ventilación mecánica, disnea aguda.",
    zones: ["Punto anterior superior", "Zona anterior", "Zona lateral"],
    steps: [
      {
        step: 1,
        title: "Evaluar deslizamiento pleural",
        description:
          "Colocar sonda lineal en zona anterior superior (más alta en decúbito supino). Evaluar deslizamiento en modo B.",
        action: "Sonda lineal en 2° espacio intercostal línea medioclavicular",
        findings: [
          "Deslizamiento presente → DESCARTA neumotórax en ese punto",
          "Deslizamiento ausente → SOSPECHA → continuar",
        ],
        interpretation:
          "El deslizamiento pleural presente tiene un valor predictivo negativo cercano al 100% para neumotórax.",
      },
      {
        step: 2,
        title: "Confirmar en modo M",
        description:
          "Activar modo M sobre la línea pleural. Buscar signo de la playa vs código de barras.",
        action: "Modo M sobre línea pleural",
        findings: [
          "Signo de la playa → normal, descarta neumotórax",
          "Código de barras → sospecha neumotórax → buscar punto pulmonar",
        ],
        interpretation:
          "El código de barras confirma ausencia de deslizamiento. Se debe buscar el punto pulmonar para confirmar.",
      },
      {
        step: 3,
        title: "Buscar punto pulmonar",
        description:
          "Desplazar la sonda lateralmente desde anterior hasta encontrar el punto donde alterna deslizamiento con no deslizamiento.",
        action: "Desplazar lateralmente buscando transición",
        findings: [
          "Punto pulmonar encontrado → CONFIRMA neumotórax (100% especificidad)",
          "No encontrado → neumotórax masivo o no hay neumotórax",
        ],
        interpretation:
          "El punto pulmonar es patognomónico. Su posición indica el tamaño del neumotórax. Si no se encuentra pero hay código de barras → considerar neumotórax masivo o a tensión.",
      },
    ],
    color: "hsl(0, 72%, 51%)",
  },
];
