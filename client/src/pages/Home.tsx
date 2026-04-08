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
 Box,
 Bot,
 Wind,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pillars = [
 {
  title: "Clínico",
  description:
   "Scores de UCI, hemodinamia, farmacología y gasometría arterial",
  icon: Stethoscope,
  gradient: "from-destructive to-warning",
  modules: [
   { title: "Scores UCI", url: "/scores", icon: Calculator },
   { title: "Hemodinamia", url: "/hemodinamia", icon: Activity },
   { title: "Vademécum", url: "/vademecum", icon: ShieldCheck },
   { title: "Gasometría", url: "/gasometria", icon: FlaskConical },
  ],
 },
 {
  title: "Ventilación Mecánica Invasiva (VMI)",
  description:
   "Modos ventilatorios, curvas y loops, asistente IA, asincronías y weaning",
  icon: Activity,
  gradient: "from-accent to-info",
  modules: [
   { title: "Biblioteca VMI", url: "/vm/biblioteca", icon: Activity },
   { title: "Curvas y Loops", url: "/vm/curvas", icon: TrendingUp },
   { title: "Asincronías", url: "/vm/asincronias", icon: AlertTriangle },
   { title: "Weaning", url: "/vm/weaning", icon: HeartPulse },
   { title: "Índices Avanzados", url: "/vm/indices", icon: Calculator },
  ],
 },
 {
  title: "Ventilación No Invasiva (VMNI)",
  description:
   "Biblioteca de ventilación no invasiva y profesor de asincronías",
  icon: Wind,
  gradient: "from-info to-accent",
  modules: [
   { title: "Biblioteca VMNI", url: "/vm/noninvasiva", icon: Wind },
   {
    title: "Asincronías VMNI",
    url: "/vm/asincronias-vmni",
    icon: AlertTriangle,
   },
  ],
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
];

const container = {
 hidden: {},
 show: {
  transition: {
   staggerChildren: 0.1,
  },
 },
};

const item = {
 hidden: { opacity: 0, y: 20 },
 show: { opacity: 1, y: 0 },
};

export default function Home() {
 const { user } = useAuth();

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   {/* Hero Section */}
   <div className="bg-gradient-hero px-10 py-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none animate-pulse">
     <Brain className="w-96 h-96" />
    </div>
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
     <div className="flex-1 space-y-8 text-center md:text-left">
      <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white px-5 py-2 rounded-full font-display font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl">
       PLATAFORMA RESPIRATORIA INTEGRAL
      </Badge>
      <h1 className="text-6xl md:text-8xl font-display font-bold text-primary-foreground tracking-tighter leading-none">
       Respi <span className="text-blue-400">Academy</span>
      </h1>
      <p className="text-xl text-primary-foreground/60 font-display font-bold max-w-2xl leading-tight">
       Centro educativo multimedia y toma de decisiones clínicas
       avanzadas para el intensivista moderno.
      </p>
      <div className="flex flex-wrap gap-5 justify-center md:justify-start pt-4">
       <Link href="/biblioteca">
        <Button
         size="lg"
         className="rounded-full px-10 h-14 bg-white text-slate-900 hover:bg-slate-50 font-display font-bold text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 border-none"
        >
         <BookOpen className="h-5 w-5 mr-3" /> Explorar Biblioteca
        </Button>
       </Link>
      </div>
     </div>
     <div className="relative hidden lg:block group">
      <div className="absolute -inset-10 bg-indigo-500/30 blur-[80px] rounded-full animate-pulse group-hover:bg-indigo-500/50 transition-colors" />
      <motion.div
       initial={{ scale: 0.9, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       transition={{ duration: 1 }}
       className="w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 backdrop-blur-2xl border-2 border-white/20 rounded-[4rem] flex items-center justify-center p-12 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform duration-700"
      >
       <Brain className="w-full h-full text-white drop-shadow-2xl" />
      </motion.div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-16 space-y-20 w-full flex-1">
    {/* Pillars Grid */}
    <motion.div
     variants={container}
     initial="hidden"
     animate="show"
     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
     {pillars.map(pillar => (
      <motion.div key={pillar.title} variants={item} className="h-full">
       <Card className="h-full overflow-hidden border-none shadow-2xl bg-white rounded-[3.5rem] flex flex-col group hover:shadow-indigo-500/10 transition-all border-t-8 border-t-indigo-600/10 hover:border-t-indigo-600">
        <CardContent className="p-10 flex flex-col flex-1">
         <div className="flex items-center gap-5 mb-6">
          <div
           className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${pillar.gradient} text-white shadow-xl shadow-indigo-500/10 transition-transform group-hover:rotate-12`}
          >
           <pillar.icon className="h-7 w-7" />
          </div>
          <h3 className="font-display font-bold text-2xl tracking-tighter uppercase ">
           {pillar.title}
          </h3>
         </div>
         <p className="text-xs text-slate-500 mb-10 line-clamp-2 font-bold leading-relaxed">
          "{pillar.description}"
         </p>
         <div className="grid grid-cols-2 gap-4 flex-1">
          {pillar.modules.map(mod => (
           <Link
            key={mod.url}
            href={mod.url}
            className="p-4 rounded-[1.2rem] bg-slate-50 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 border border-slate-100 group/mod hover:shadow-xl hover:shadow-indigo-600/20 hover:-translate-y-1"
           >
            <mod.icon className="h-4 w-4 text-indigo-500 group-hover/mod:text-white transition-colors" />
            <span className="font-display font-bold text-[10px] uppercase tracking-widest truncate">
             {mod.title}
            </span>
           </Link>
          ))}
         </div>
        </CardContent>
       </Card>
      </motion.div>
     ))}
    </motion.div>

    </div>
   </div>
  );
}
