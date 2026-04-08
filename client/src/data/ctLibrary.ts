const normalCt =
  "https://upload.wikimedia.org/wikipedia/commons/e/e8/Ct-scan_of_human_brain_with_all_lobes_labeled.jpg"; // Placeholder - TC toracico normal no disponible en commons
const groundGlass =
  "https://upload.wikimedia.org/wikipedia/commons/d/d2/X-ray_and_CT_of_ground_glass_opacities_and_pneumothorax_in_pneumocystis_pneumonia.jpg";
const consolidationCt =
  "https://upload.wikimedia.org/wikipedia/commons/4/4e/Lung_lacerations.JPG";
const emphysema =
  "https://upload.wikimedia.org/wikipedia/commons/9/9e/Centrilobular_emphysema_865_lores.jpg";
const honeycombing =
  "https://upload.wikimedia.org/wikipedia/commons/7/79/UIP_%28Usual_interstitial_pneumonia%29-CT_scan.jpg";
const bronchiectasis =
  "https://upload.wikimedia.org/wikipedia/commons/9/95/Bronchiektasen_links_basal_51M_-_CT_coronar_-_001.jpg";
const pulmonaryNodule =
  "https://upload.wikimedia.org/wikipedia/commons/b/b3/Solitary_pulmonary_nodule_CT_arrow.jpg";
const pleuralEffusionCt =
  "https://upload.wikimedia.org/wikipedia/commons/f/fe/Pleural_effusion_CT_axial_WTF.jpg";
const crazyPaving =
  "https://upload.wikimedia.org/wikipedia/commons/2/26/Crazy_paving_pattern_on_chest_CT_scan.jpg";
const pulmonaryEmbolism =
  "https://upload.wikimedia.org/wikipedia/commons/4/4d/Pulmonary_embolism_CTPA.JPEG";

export interface CTPattern {
  id: string;
  name: string;
  category: "opacificacion" | "densidad" | "nodular" | "reticular" | "vascular";
  image: string;
  imageUrl?: string;
  description: string;
  mechanism: string;
  differentialDx: string[];
  keyFindings: string[];
  clinicalContext: string;
}

export const ctPatterns: CTPattern[] = [
  {
    id: "normal",
    name: "TC de Tórax Normal",
    category: "opacificacion",
    image: normalCt,
    description:
      "Parénquima pulmonar con densidad normal (-700 a -900 UH). Estructuras mediastínicas, vasculares y óseas sin alteraciones.",
    mechanism:
      "Pulmón normalmente aireado con lobulillos secundarios no visibles en condiciones normales.",
    differentialDx: [],
    keyFindings: [
      "Campos pulmonares claros",
      "Mediastino sin adenopatías",
      "Senos costofrénicos libres",
      "Tráquea y bronquios permeables",
    ],
    clinicalContext:
      "Referencia anatómica normal para comparación con hallazgos patológicos.",
  },
  {
    id: "vidrio-deslustrado",
    name: "Patrón en Vidrio Esmerilado (Ground-Glass Opacity)",
    category: "opacificacion",
    image: groundGlass,
    description:
      "Aumento de la atenuación del parénquima pulmonar que no borra los contornos de los vasos sanguíneos ni de las paredes bronquiales. Es uno de los hallazgos más importantes pero menos específicos en TC de tórax, indicando una alteración a nivel del espacio aéreo o intersticial.",
    mechanism:
      "La etiopatogenia del vidrio esmerilado se basa en: 1) Ocupación parcial de los espacios aéreos por líquido, células o material proteináceo (el aire no se desplaza por completo). 2) Engrosamiento del intersticio pulmonar (septos interlobulillares o pared alveolar) por debajo de la resolución de la TC. 3) Colapso parcial de alvéolos (microatelectasias). 4) Aumento del volumen sanguíneo capilar pulmonar. A diferencia de la consolidación, la preservación de los contornos vasculobronquiales indica que parte del aire alveolar persiste.",
    differentialDx: [
      "**Causas Agudas:**",
      "  - **Edema Pulmonar:** Cardiogénico (distribución perihiliar, gravitacional) o no cardiogénico/SDRA (distribución en parches, difusa).",
      "  - **Neumonías Infecciosas:** Atípicas (Pneumocystis jirovecii, CMV, Mycoplasma), virales (COVID-19, Influenza, RSV).",
      "  - **Hemorragia Alveolar Difusa:** Asociada a vasculitis, coagulopatías o daño alveolar agudo.",
      "  - **Neumonitis por Hipersensibilidad Aguda:** Exposición a un antígeno conocido, a menudo con áreas de atrapamiento aéreo.",
      "**Causas Crónicas:**",
      "  - **Neumonías Intersticiales Idiopáticas:** Neumonía Intersticial No Específica (NINE, patrón típico), Neumonía Organizada Criptogenética (COP).",
      "  - **Neoplasias:** Adenocarcinoma (especialmente lepidico), Carcinoma Bronquioloalveolar.",
      "  - **Toxicidad por Fármacos:** Amiodarona, Bleomicina, Metotrexato.",
      "  - **Proteinosis Alveolar (si se asocia a 'crazy-paving').**",
    ],
    keyFindings: [
      "Aumento de densidad que permite ver los vasos y bronquios subyacentes.",
      "Puede ser el único hallazgo o asociarse a otros patrones (consolidación, reticulación).",
      "**Distribución:** Difusa, en parches, nodular, centrolobulillar o peribroncovascular.",
      "El **'signo del bronquio negro'** (bronquios de paredes finas y llenos de aire que destacan sobre el fondo opaco) es una manifestación característica.",
      "En el contexto de COVID-19, suele ser bilateral, periférico y basal.",
    ],
    clinicalContext:
      "Es un signo muy sensible pero poco específico. La temporalidad (agudo vs. crónico), la distribución de las opacidades y, sobre todo, el estado inmunológico del paciente y su historia clínica son cruciales para un diagnóstico diferencial adecuado. Un vidrio esmerilado que persiste o progresa en el tiempo requiere un estudio más profundo para descartar fibrosis o neoplasia.",
  },
  {
    id: "arbol-en-brote",
    name: "Patrón de Árbol en Brote (Tree-in-Bud)",
    category: "nodular",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tree-in-bud_appearance_on_CT.jpg/800px-Tree-in-bud_appearance_on_CT.jpg",
    description:
      "Opacidades nodulares centrolobulillares y lineales ramificadas en forma de 'V' o 'Y' que recuerdan a las ramas de un árbol en gemación. Es un signo radiológico patognomónico de enfermedad de la vía aérea pequeña (bronquiolos < 2 mm).",
    mechanism:
      "La imagen se produce por la ocupación de los bronquiolos terminales y respiratorios por material patológico (pus, moco, líquido, células) junto con el engrosamiento de sus paredes por inflamación. La 'punta' o 'brote' corresponde al bronquiolo terminal impactado, y las 'ramas' a las divisiones bronquiolares más distales que también están ocupadas. Al estar en el centro del lobulillo secundario, este patrón respeta la pleura visceral y los septos interlobulillares.",
    differentialDx: [
      "**Infecciones (causa más común):**",
      "  - **Tuberculosis Endobronquial:** Causa clásica, a menudo con distribución en lóbulos superiores.",
      "  - **Micobacterias no Tuberculosas:** Especialmente Mycobacterium avium complex (MAC).",
      "  - **Bronquiolitis Infecciosa:** Bacteriana (S. aureus, H. influenzae) o viral en niños y adultos.",
      "**Aspiración:** Crónica o subaguda, típicamente en lóbulos inferiores y posteriores.",
      "**Enfermedades de la Vía Aérea:**",
      "  - **Fibrosis Quística:** Con bronquiectasias asociadas.",
      "  - **Panbronquiolitis Difusa:** Enfermedad rara, principalmente en población asiática.",
      "  - **Aspergilosis Broncopulmonar Alérgica (ABPA):** Con impactaciones mucosas de alta densidad.",
      "**Otras:** Enfermedades del tejido conectivo, embolia tumoral intravascular.",
    ],
    keyFindings: [
      "Nódulos centrolobulillares de pequeño tamaño (< 5 mm) bien definidos.",
      "Presencia de estructuras lineales ramificadas que se originan de los nódulos.",
      "Localización a pocos milímetros de la superficie pleural, sin llegar a contactarla.",
      "Hallazgo predominante en la periferia de los pulmones.",
      "Puede asociarse a engrosamiento de la pared bronquial o bronquiectasias.",
    ],
    clinicalContext:
      "Identificar un patrón de árbol en brote dirige inmediatamente el diagnóstico hacia una patología bronquiolar. La distribución es clave: apical sugiere TBC, basal sugiere aspiración. La presencia de otros hallazgos como cavitaciones (TBC) o bronquiectasias (Fibrosis Quística) son pistas diagnósticas fundamentales.",
  },
  {
    id: "signo-del-halo",
    name: "Signo del Halo y Halo Invertido",
    category: "nodular",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Reversed_halo_sign_in_a_patient_with_organizing_pneumonia.jpg",
    description:
      "Son dos signos radiológicos distintos con diagnósticos diferenciales específicos. **Signo del Halo:** opacidad en vidrio esmerilado que rodea un nódulo o masa. **Signo del Halo Invertido (Signo del Atolón):** opacidad central en vidrio esmerilado rodeada por un anillo más denso de consolidación.",
    mechanism:
      "La fisiopatología difiere significativamente entre ambos: **Signo del Halo:** El nódulo central representa el foco primario de la patología (ej. infarto por angioinvasión fúngica, tumor primario), y el halo de vidrio esmerilado circundante representa un proceso secundario, como hemorragia alveolar (lo más común en aspergilosis), infiltración inflamatoria o diseminación tumoral lepidica. **Signo del Halo Invertido:** El anillo externo de consolidación corresponde histológicamente a neumonía organizada (tejido de granulación en los espacios aéreos distales), mientras que el centro en vidrio esmerilado representa inflamación alveolar con exudados celulares y detritos.",
    differentialDx: [
      "**Signo del Halo:**",
      "  - **Infeccioso (Inmunodeprimidos):** Aspergilosis Angioinvasiva (hallazgo clásico en neutropenia febril), otras micosis (Mucor, Candida).",
      "  - **Infeccioso (Inmunocompetentes):** Tuberculosis, Coxiella burnetii (Fiebre Q).",
      "  - **No Infeccioso:** Metástasis hemorrágicas (melanoma, angiosarcoma, coriocarcinoma), Granulomatosis con Poliangeítis (Wegener), Sarcoidosis.",
      "  - **Neoplásico:** Adenocarcinoma pulmonar.",
      "**Signo del Halo Invertido:**",
      "  - **Neumonía Organizada Criptogenética (COP/BOOP):** Es el diagnóstico más específico para este signo.",
      "  - **Infeccioso:** Paracoccidioidomicosis (muy característico en áreas endémicas), Tuberculosis post-primaria, Neumonía por Pneumocystis jirovecii, COVID-19.",
      "  - **Otros:** Granulomatosis con Poliangeítis, Sarcoidosis, después de radioterapia.",
    ],
    keyFindings: [
      "**Halo:** Nódulo o masa central de atenuación de tejidos blandos. Halo periférico de menor atenuación (vidrio esmerilado) que lo rodea completamente.",
      "**Halo Invertido:** Área focal, a menudo redondeada, de vidrio esmerilado. Anillo o semiluna circundante de consolidación, de al menos 2 mm de espesor y forma, a veces, poligonal o irregular.",
    ],
    clinicalContext:
      "La aparición del signo del halo en un paciente neutropénico con fiebre que no responde a antibióticos es altamente sugestiva de aspergilosis invasiva y a menudo justifica el inicio de tratamiento antifúngico empírico. El signo del halo invertido, aunque no es 100% patognomónico, tiene una fuerte asociación con la Neumonía Organizada, especialmente si es migratorio o múltiple.",
  },
  {
    id: "consolidacion-tc",
    name: "Consolidación",
    category: "opacificacion",
    image: consolidationCt,
    description:
      "Aumento de densidad parenquimatosa que impide ver la vascularización normal del pulmón. Puede acompañarse de broncograma aéreo.",
    mechanism:
      "Sustitución del aire alveolar por fluido (edema), pus (neumonía), sangre (hemorragia/contusión) o células (adenocarcinoma, linfoma).",
    differentialDx: [
      "Neumonía bacteriana",
      "Edema pulmonar",
      "Hemorragia pulmonar",
      "Contusión pulmonar",
      "Adenocarcinoma",
      "Linfoma",
      "Neumonía organizada",
    ],
    keyFindings: [
      "Opacidad densa que borra vasos",
      "Broncograma aéreo",
      "Distribución lobar o segmentaria",
      "Puede ser multifocal",
    ],
    clinicalContext:
      "Valorar en contexto clínico: agudo vs crónico, infeccioso vs no infeccioso, localización y extensión.",
  },
  {
    id: "enfisema",
    name: "Enfisema",
    category: "densidad",
    image: emphysema,
    description:
      "Aumento permanente y patológico del espacio aéreo distal al bronquiolo terminal con destrucción de paredes alveolares. Zonas de hipoatenuación sin pared visible.",
    mechanism:
      "Destrucción proteolítica de las paredes alveolares, generalmente por desequilibrio proteasas-antiproteasas (tabaquismo, déficit de alfa-1 antitripsina).",
    differentialDx: [
      "Enfisema centrolobulillar",
      "Enfisema paraseptal",
      "Enfisema panacinar",
      "Bullas",
    ],
    keyFindings: [
      "Áreas de hiperclaridad sin paredes",
      "Centrolobulillar: centro del lobulillo",
      "Paraseptal: subpleural en fila única",
      "Panacinar: todo el lobulillo",
    ],
    clinicalContext:
      "Enfisema centrolobulillar predomina en lóbulos superiores (tabaquismo). Panacinar en bases (déficit α1-AT).",
  },
  {
    id: "crazy-paving",
    name: "Crazy Paving (Empedrado)",
    category: "opacificacion",
    image: crazyPaving,
    description:
      "Patrón de vidrio deslustrado con engrosamiento superpuesto de septos interlobulillares, creando un aspecto de empedrado o pavimento irregular.",
    mechanism:
      "Combinación de ocupación parcial alveolar (vidrio deslustrado) con engrosamiento septal (reticular), produciendo un patrón mixto característico.",
    differentialDx: [
      "Proteinosis alveolar",
      "Neumonía por Pneumocystis",
      "Hemorragia alveolar",
      "Neumonía lipoidea",
      "SDRA",
      "COVID-19",
    ],
    keyFindings: [
      "Vidrio deslustrado + reticulación septal",
      "Aspecto de mosaico irregular",
      "Puede ser focal o difuso",
      "Distribución geográfica",
    ],
    clinicalContext:
      "Hallazgo clásico de proteinosis alveolar pulmonar, pero también frecuente en COVID-19 y otras neumonías.",
  },
  {
    id: "panalización",
    name: "Panalización (Honeycombing)",
    category: "reticular",
    image: honeycombing,
    description:
      "Quistes aéreos subpleurales < 1 cm dispuestos en varias filas, representando el estadio final de fibrosis pulmonar con destrucción arquitectural completa.",
    mechanism:
      "Destrucción y remodelación fibrótica del parénquima pulmonar con formación de espacios quísticos revestidos por epitelio bronquiolar.",
    differentialDx: [
      "Neumonía intersticial usual (NIU/FPI)",
      "Asbestosis avanzada",
      "Artritis reumatoide",
      "Esclerodermia",
    ],
    keyFindings: [
      "Quistes subpleurales en múltiples filas",
      "Predominio basal y periférico",
      "Bronquiectasias de tracción asociadas",
      "Pérdida de volumen",
    ],
    clinicalContext:
      "Hallazgo definitorio de patrón NIU. Cuando se asocia a clínica compatible, puede diagnosticar FPI sin biopsia.",
  },
  {
    id: "bronquiectasias",
    name: "Bronquiectasias",
    category: "densidad",
    image: bronchiectasis,
    description:
      "Dilataciones irreversibles del árbol bronquial. Se clasifican en cilíndricas, quísticas y varicosas según su morfología.",
    mechanism:
      "Destrucción de la pared bronquial por infección crónica, inflamación o tracción fibrótica, con pérdida del soporte cartilaginoso.",
    differentialDx: [
      "Fibrosis quística",
      "Infección crónica",
      "ABPA",
      "Discinesia ciliar primaria",
      "Bronquiectasias de tracción (fibrosis)",
    ],
    keyFindings: [
      "Signo del anillo de sello (bronquio > arteria)",
      "Cilíndricas: dilatación uniforme",
      "Quísticas: cavidades con nivel",
      "Varicosas: dilatación irregular",
    ],
    clinicalContext:
      "Las de tracción aparecen en el seno de fibrosis pulmonar y tienen diferente significado que las infecciosas.",
  },
  {
    id: "nodulo-pulmonar",
    name: "Nódulo Pulmonar Solitario",
    category: "nodular",
    image: pulmonaryNodule,
    description:
      "Opacidad redondeada < 3 cm. La TC permite valorar tamaño, márgenes, calcificaciones, contenido graso y captación de contraste.",
    mechanism:
      "Crecimiento focal de tejido anormal: neoplásico (adenocarcinoma, metástasis), infeccioso (granuloma) o benigno (hamartoma).",
    differentialDx: [
      "Adenocarcinoma",
      "Carcinoma escamoso",
      "Metástasis",
      "Granuloma (TB, hongos)",
      "Hamartoma",
      "Carcinoide",
    ],
    keyFindings: [
      "Márgenes espiculados → sospecha malignidad",
      "Calcificación central/laminar → benigno",
      "Calcificación excéntrica → maligno",
      "Grasa intranodular → hamartoma",
      "Captación > 15 UH → sospecha malignidad",
    ],
    clinicalContext:
      "Nódulos < 4 mm tienen < 1% probabilidad de malignidad. Seguimiento según guías Fleischner Society.",
  },
  {
    id: "derrame-pleural-tc",
    name: "Derrame Pleural",
    category: "opacificacion",
    image: pleuralEffusionCt,
    description:
      "Colección líquida en el espacio pleural, visible como densidad homogénea dependiente de la gravedad.",
    mechanism:
      "Acumulación de líquido por aumento de presión hidrostática (trasudado), inflamación pleural (exudado) o sangrado (hemotórax).",
    differentialDx: [
      "Insuficiencia cardíaca",
      "Neumonía con derrame paraneumónico",
      "Empiema",
      "Neoplasia pleural",
      "TEP",
      "Hemotórax",
    ],
    keyFindings: [
      "Densidad < 10 UH → trasudado",
      "Densidad > 15 UH → exudado/hemotórax",
      "Loculaciones → empiema",
      "Engrosamiento pleural → malignidad",
    ],
    clinicalContext:
      "La TC detecta derrames < 10 mL. Distingue entre empiema y derrame simple por patrón de captación.",
  },
  {
    id: "tep",
    name: "Tromboembolismo Pulmonar (TEP)",
    category: "vascular",
    image: pulmonaryEmbolism,
    description:
      "Defecto de llenado intraluminal en las arterias pulmonares en angioTC con contraste. Método de elección para diagnóstico de TEP.",
    mechanism:
      "Migración de trombos (generalmente de MMII) hacia la circulación pulmonar, con obstrucción parcial o completa del flujo arterial.",
    differentialDx: [
      "TEP agudo",
      "TEP crónico",
      "Sarcoma de arteria pulmonar",
      "Artefacto de flujo",
    ],
    keyFindings: [
      "Defecto de llenado intraluminal",
      "Signo del polo (trombo rodeado de contraste)",
      "Dilatación VD (VD/VI > 1)",
      "Reflujo a venas hepáticas",
      "Infarto pulmonar periférico triangular",
    ],
    clinicalContext:
      "Sensibilidad 83%, especificidad 96%. La dilatación del VD indica mal pronóstico y necesidad de tratamiento urgente.",
  },
];

export const ctCategories = [
  { id: "all", label: "Todos" },
  { id: "opacificacion", label: "Opacificación" },
  { id: "densidad", label: "↓ Densidad" },
  { id: "nodular", label: "Nodular" },
  { id: "reticular", label: "Reticular" },
  { id: "vascular", label: "Vascular" },
];

export interface InterpretationStep {
  order: number;
  title: string;
  window: string;
  structures: string[];
  tips: string[];
}

export const interpretationSteps: InterpretationStep[] = [
  {
    order: 1,
    title: "Calidad Técnica",
    window: "Todas",
    structures: [
      "Nivel del corte",
      "Uso de contraste",
      "Artefactos de movimiento",
      "Ventana adecuada",
    ],
    tips: [
      "Verificar que el estudio sea completo",
      "Confirmar fase de contraste apropiada para la indicación",
      "Evaluar presencia de artefactos que limiten la interpretación",
    ],
  },
  {
    order: 2,
    title: "Ventana Mediastínica",
    window: "Mediastino (W: 350, L: 50)",
    structures: [
      "Tráquea y bronquios principales",
      "Grandes vasos (aorta, cava, pulmonar)",
      "Corazón y pericardio",
      "Ganglios linfáticos mediastínicos",
      "Esófago",
      "Tiroides (si visible)",
    ],
    tips: [
      "Medir aorta ascendente (normal < 4 cm)",
      "Buscar adenopatías > 1 cm en eje corto",
      "Evaluar relación VD/VI",
      "Valorar derrame pericárdico",
    ],
  },
  {
    order: 3,
    title: "Ventana Pulmonar",
    window: "Pulmón (W: 1500, L: -600)",
    structures: [
      "Parénquima bilateral",
      "Cisuras",
      "Bronquios segmentarios",
      "Vasos pulmonares",
      "Pleura",
    ],
    tips: [
      "Comparar ambos pulmones sistemáticamente",
      "Identificar patrón predominante",
      "Evaluar distribución: central vs periférica, superior vs inferior",
      "Buscar broncograma aéreo en consolidaciones",
      "Valorar signo del anillo de sello para bronquiectasias",
    ],
  },
  {
    order: 4,
    title: "Ventana Ósea",
    window: "Hueso (W: 1500, L: 300)",
    structures: [
      "Columna vertebral",
      "Costillas",
      "Esternón",
      "Escápulas",
      "Clavículas",
    ],
    tips: [
      "Buscar lesiones líticas o blásticas",
      "Evaluar fracturas costales",
      "Valorar aplastamientos vertebrales",
      "Buscar lesiones expansivas",
    ],
  },
  {
    order: 5,
    title: "Tejidos Blandos y Abdomen Superior",
    window: "Tejidos blandos (W: 400, L: 40)",
    structures: [
      "Pared torácica",
      "Mamas",
      "Axila (adenopatías)",
      "Hígado (si visible)",
      "Suprarrenales",
    ],
    tips: [
      "Buscar masas en pared torácica",
      "Evaluar adenopatías axilares",
      "Valorar hígado y suprarrenales en estadiaje oncológico",
    ],
  },
];
