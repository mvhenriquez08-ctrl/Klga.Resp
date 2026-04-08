import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen,
  Image,
  Brain,
  FileText,
  MapPin,
  Calculator,
  Stethoscope,
  ArrowRight,
  Activity,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  Scan,
  FileImage,
  Eye,
  Camera,
  ClipboardList,
  Users,
  ShieldCheck,
  FlaskConical,
  FileDown,
  Library,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pillars = [
  {
    title: "Clínico",
    description:
      "Registro de pacientes, scores de UCI, hemodinamia, farmacología, gasometría e informes PDF",
    icon: Users,
    gradient: "from-destructive to-warning",
    modules: [
      { title: "Pacientes", url: "/pacientes", icon: Users },
      { title: "Scores UCI", url: "/scores", icon: Calculator },
      { title: "Hemodinamia", url: "/hemodinamia", icon: Activity },
      { title: "Farmacología UCI", url: "/vademecum", icon: ShieldCheck },
      { title: "Gasometría", url: "/gasometria", icon: FlaskConical },
      { title: "Informe PDF", url: "/informe", icon: FileDown },
    ],
  },
  {
    title: "Ultrasonido Pulmonar",
    description:
      "Biblioteca, atlas, simulador, protocolos, mapa pulmonar, LUS score y adquisición ecográfica",
    icon: Stethoscope,
    gradient: "from-primary to-accent",
    modules: [
      { title: "Biblioteca LUS", url: "/biblioteca", icon: BookOpen },
      { title: "Atlas Ecográfico", url: "/atlas", icon: Image },
      { title: "Simulador", url: "/simulador", icon: Brain },
      { title: "Protocolos", url: "/protocolos", icon: FileText },
      { title: "Mapa Pulmonar", url: "/mapa", icon: MapPin },
      { title: "LUS Score", url: "/calculadora", icon: Calculator },
      { title: "Adquisición", url: "/adquisicion", icon: Scan },
    ],
  },
  {
    title: "Ventilación Mecánica",
    description:
      "Modos ventilatorios, curvas y loops, asistente IA, asincronías con curvas reales, weaning e índices avanzados",
    icon: Activity,
    gradient: "from-accent to-info",
    modules: [
      { title: "Biblioteca VM", url: "/vm/biblioteca", icon: Activity },
      { title: "Curvas y Loops", url: "/vm/curvas", icon: TrendingUp },
      { title: "Asistente Curvas", url: "/vm/asistente", icon: Camera },
      { title: "Asincronías", url: "/vm/asincronias", icon: AlertTriangle },
      { title: "Weaning", url: "/vm/weaning", icon: HeartPulse },
      { title: "Índices Avanzados", url: "/vm/indices", icon: Calculator },
      { title: "Registro VM", url: "/vm/registro", icon: ClipboardList },
    ],
  },
  {
    title: "Radiografía de Tórax",
    description:
      "Biblioteca radiográfica, visor con zoom y contraste, mapa torácico interactivo y registro",
    icon: FileImage,
    gradient: "from-info to-primary",
    modules: [
      { title: "Biblioteca RX", url: "/rx/biblioteca", icon: FileImage },
      { title: "Visor Radiográfico", url: "/rx/visor", icon: Eye },
      { title: "Mapa Torácico", url: "/rx/mapa", icon: MapPin },
      { title: "Registro RX", url: "/rx/registro", icon: ClipboardList },
    ],
  },
  {
    title: "Tomografía de Tórax",
    description:
      "Biblioteca de patrones tomográficos torácicos con imágenes reales de referencia",
    icon: Scan,
    gradient: "from-primary to-destructive",
    modules: [{ title: "Biblioteca TC", url: "/tc/biblioteca", icon: Scan }],
  },
  {
    title: "Arritmias & ECG",
    description:
      "Biblioteca de arritmias y patrones electrocardiográficos con imágenes reales",
    icon: HeartPulse,
    gradient: "from-destructive to-accent",
    modules: [
      {
        title: "Biblioteca Arritmias",
        url: "/arritmias/biblioteca",
        icon: HeartPulse,
      },
    ],
  },
  {
    title: "ECMO",
    description: "Módulo educativo de oxigenación por membrana extracorpórea",
    icon: Activity,
    gradient: "from-warning to-info",
    modules: [{ title: "Módulo ECMO", url: "/ecmo", icon: Activity }],
  },
  {
    title: "IA & Datos",
    description:
      "Biblioteca inteligente con búsqueda en PubMed, Cochrane, Embase y chat clínico con IA",
    icon: Library,
    gradient: "from-info to-accent",
    modules: [
      { title: "Biblioteca Inteligente", url: "/conocimiento", icon: Library },
      { title: "Chat Clínico", url: "/chat", icon: MessageCircle },
    ],
  },
  {
    title: "Educación",
    description:
      "Centro de evaluación con quizzes interactivos de todas las áreas",
    icon: GraduationCap,
    gradient: "from-accent to-warning",
    modules: [
      { title: "Centro de Evaluación", url: "/quiz", icon: GraduationCap },
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-hero px-6 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 backdrop-blur-sm border border-accent/30">
              <Stethoscope className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Resp Academy
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-2">
              Plataforma digital para interpretación respiratoria avanzada y
              formación clínica, aplicable en hospitales, universidades y
              práctica profesional independiente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/pacientes"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Módulo Clínico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/biblioteca"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              Ultrasonido Pulmonar
            </Link>
            <Link
              to="/vm/biblioteca"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              Ventilación Mecánica
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { label: "Signos ecográficos", value: "14" },
              { label: "Modos ventilatorios", value: "6" },
              { label: "Asincronías", value: "7" },
              { label: "Protocolos clínicos", value: "4" },
              { label: "Módulos totales", value: "9" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-display font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-display text-2xl font-bold mb-8">
          Módulos de la plataforma
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {pillars.map(pillar => (
            <motion.div key={pillar.title} variants={item}>
              <Card className="overflow-hidden border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.gradient} text-primary-foreground`}
                    >
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold flex items-center gap-2">
                        {pillar.title}
                        {pillar.modules.length === 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            Próximamente
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                  {pillar.modules.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {pillar.modules.map(mod => (
                        <Link
                          key={mod.url}
                          href={mod.url}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all text-sm group"
                        >
                          <mod.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-xs font-medium group-hover:text-primary transition-colors">
                            {mod.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-warning">⚠️ Aviso:</strong> Esta plataforma
            es una herramienta educativa y de apoyo clínico. La interpretación
            automática o asistida no reemplaza el juicio clínico del profesional
            que realiza el examen.
          </p>
        </div>
      </div>
    </div>
  );
}
