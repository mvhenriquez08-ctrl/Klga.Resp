import { useState } from "react";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
 Search,
 ShieldCheck,
 Info,
 AlertTriangle,
 Zap,
 Activity,
 Droplets,
 Microscope,
 Stethoscope,
 HeartPulse,
} from "lucide-react";

const drugs = [
 // --- VASOACTIVOS & INOTRÓPICOS ---
 {
  name: "Noradrenalina",
  category: "Vasoactivos",
  dose: "0.01 - 1.0 mcg/kg/min",
  indications:
   "Shock distributivo (séptico), shock cardiogénico con hipotensión severa.",
  pearls:
   "Primera línea en sepsis. Usar preferentemente por vía central. Vigilar isquemia distal.",
  color: "bg-red-500",
 },
 {
  name: "Adrenalina (Epinefrina)",
  category: "Vasoactivos",
  dose: "0.05 - 0.5 mcg/kg/min",
  indications:
   "Paro cardíaco, shock anafiláctico, shock cardiogénico refractario.",
  pearls:
   "Potente inotrópico y cronotrópico. Puede aumentar el lactato por estimulación B2.",
  color: "bg-red-500",
 },
 {
  name: "Vasopresina",
  category: "Vasoactivos",
  dose: "0.01 - 0.04 U/min (dosis fija)",
  indications: "Shock séptico refractario a noradrenalina.",
  pearls:
   "No titular. Ayuda a 'ahorrar' noradrenalina. Cuidado con isquemia esplácnica.",
  color: "bg-red-400",
 },
 {
  name: "Dobutamina",
  category: "Inotrópicos",
  dose: "2.5 - 20 mcg/kg/min",
  indications:
   "Falla cardiaca aguda, bajo gasto cardiaco, shock cardiogénico.",
  pearls:
   "Puede causar hipotensión por vasodilatación B2 (ino-dilatador). Arritmogénica.",
  color: "bg-blue-500",
 },
 {
  name: "Milrinona",
  category: "Inotrópicos",
  dose: "0.25 - 0.75 mcg/kg/min",
  indications:
   "Falla cardiaca derecha, hipertensión pulmonar, post-op cardiaco.",
  pearls:
   "Inhibidor de la PDE3. Vida media larga (ajustar en falla renal). Riesgo de hipotensión.",
  color: "bg-blue-400",
 },

 // --- SEDOANALGESIA ---
 {
  name: "Fentanilo",
  category: "Sedoanalgesia",
  dose: "1 - 5 mcg/kg/h",
  indications: "Analgesia en VM, procedimientos dolorosos.",
  pearls:
   "Opioide de elección en inestabilidad hemodinámica. Riesgo de tórax en tabla en bolos rápidos.",
  color: "bg-purple-500",
 },
 {
  name: "Propofol",
  category: "Sedoanalgesia",
  dose: "5 - 50 mcg/kg/min",
  indications: "Sedación profunda, inducción rápida.",
  pearls:
   "Rápido inicio y fin. Vigilar triglicéridos y síndrome de infusión de propofol (PRIS). No analgésico.",
  color: "bg-purple-400",
 },
 {
  name: "Dexmedetomidina",
  category: "Sedoanalgesia",
  dose: "0.2 - 1.4 mcg/kg/h",
  indications: "Sedación consciente, destete de VM, delírium.",
  pearls:
   "Agonista A2. No deprime el centro respiratorio. Puede causar bradicardia e hipotensión.",
  color: "bg-purple-300",
 },
 {
  name: "Midazolam",
  category: "Sedoanalgesia",
  dose: "0.02 - 0.1 mg/kg/h",
  indications: "Sedación, crisis convulsivas refractarias.",
  pearls:
   "Acumulable en falla renal y obesidad. Mayor riesgo de delírium comparado con propofol.",
  color: "bg-indigo-500",
 },

 // --- ANTIBIÓTICOS ---
 {
  name: "Meropenem",
  category: "Antibióticos",
  dose: "1 - 2 g c/8h (Dosis UCI)",
  indications: "Infecciones graves por Gram negativos multirresistentes.",
  pearls: "Infusión extendida (3-4h) mejora PK/PD en pacientes críticos.",
  color: "bg-emerald-500",
 },
 {
  name: "Vancomicina",
  category: "Antibióticos",
  dose: "15 - 20 mg/kg c/8-12h",
  indications: "S. aureus MRSA, infecciones por Gram positivos.",
  pearls:
   "Monitorizar niveles plasmáticos (Valle 15-20 mcg/ml). Ajustar por función renal.",
  color: "bg-emerald-400",
 },
 {
  name: "Pip / Tazobactam",
  category: "Antibióticos",
  dose: "4.5 g c/6h",
  indications: "Infecciones intraabdominales, neumonía nosocomial.",
  pearls:
   "Cubrimiento para Pseudomona. También se recomienda infusión extendida.",
  color: "bg-emerald-300",
 },
];

const categories = [
 "Todos",
 "Vasoactivos",
 "Inotrópicos",
 "Sedoanalgesia",
 "Antibióticos",
];

export default function Vademecum() {
 const [search, setSearch] = useState("");
 const [activeCategory, setActiveCategory] = useState("Todos");

 const filteredDrugs = drugs.filter(d => {
  const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
  const matchesCategory =
   activeCategory === "Todos" || d.category === activeCategory;
  return matchesSearch && matchesCategory;
 });

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-slate-900/5 px-6 py-6 border-b border-slate-200/50">
    <div className="mx-auto max-w-5xl">
     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
       <div className="p-2.5 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
        <Activity className="h-5 w-5" />
       </div>
       <div>
        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tighter uppercase leading-none">
         Vademecum <span className="text-indigo-600">UCI</span>
        </h1>
        <p className="text-slate-500 font-sans font-bold text-[9px] uppercase tracking-widest mt-1.5 ">
         Guía Farmacológica de Alta Densidad
        </p>
       </div>
      </div>
      <div className="relative w-full md:w-80">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
       <Input
        placeholder="Buscar fármaco..."
        className="pl-10 h-10 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 transition-all font-semibold text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
       />
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-5xl mx-auto px-6 py-4 space-y-6 w-full flex-1">
    <div className="flex flex-wrap gap-2">
     {categories.map(cat => (
      <Button
       key={cat}
       variant={activeCategory === cat ? "default" : "outline"}
       className={cn(
        "rounded-lg px-4 h-8 font-sans font-bold text-[9px] uppercase tracking-widest transition-all",
        activeCategory === cat
         ? "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-sm"
         : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm"
       )}
       onClick={() => setActiveCategory(cat)}
      >
       {cat}
      </Button>
     ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {filteredDrugs.map((drug, idx) => (
      <Card key={idx} className="rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white overflow-hidden">
       <div className={cn("h-1 w-full", drug.color)} />
       <CardContent className="p-4 flex flex-col flex-1 space-y-4">
        <div>
         <div className="flex justify-between items-start mb-1">
          <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] font-sans font-bold uppercase tracking-tight px-2 py-0">
           {drug.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-indigo-600">
           <Zap className="w-3 h-3" />
           <span className="text-[8px] font-sans font-bold uppercase tracking-widest">UCI</span>
          </div>
         </div>
         <h3 className="text-base font-display font-bold text-slate-900 tracking-tight uppercase leading-tight">
          {drug.name}
         </h3>
         <p className="text-[10px] text-indigo-600 font-sans font-bold mt-1 uppercase tracking-tight">
          Dosis: {drug.dose}
         </p>
        </div>

        <div className="space-y-1">
         <p className="text-[8px] font-sans font-bold uppercase tracking-widest text-slate-400">Indicaciones</p>
         <p className="text-[11px] text-slate-600 leading-snug font-medium line-clamp-2">
          {drug.indications}
         </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg text-white mt-auto">
         <div className="flex items-center gap-2 text-[8px] font-sans font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
          <Info className="w-2.5 h-2.5" /> Perla Clínica
         </div>
         <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
          {drug.pearls}
         </p>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>

    {filteredDrugs.length === 0 && (
     <div className="py-20 text-center space-y-4 bg-white rounded-xl border border-dashed border-slate-200">
      <Stethoscope className="w-10 h-10 mx-auto text-slate-200" />
      <p className="text-slate-400 font-sans font-bold text-[10px] uppercase tracking-widest">No se encontraron fármacos</p>
     </div>
    )}

    <footer className="p-6 bg-slate-900 text-white rounded-xl flex items-start gap-4 shadow-sm border-t-2 border-indigo-600 mt-4">
     <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
      <ShieldCheck className="w-5 h-5" />
     </div>
     <div className="space-y-1">
      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-indigo-400">Protocolo de Seguridad</p>
      <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
       "Las dosis indicadas son referenciales. Valide con protocolos locales y considere el contexto clínico del paciente."
      </p>
     </div>
    </footer>
   </div>
  </div>
 );
}
