import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
 Activity,
 Heart,
 Zap,
 AlertCircle,
 TrendingUp,
 Info,
 Stethoscope,
 ChevronRight,
 Waves,
 Table,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shockProfiles, monitoringParameters } from "@/data/hemodynamics";

export default function Hemodynamics() {
 const [activeShock, setActiveShock] = useState(shockProfiles[0]);
 const [activeParam, setActiveParam] = useState(monitoringParameters[0]);

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
       <Heart className="h-8 w-8" />
      </div>
      <div>
       <h1 className="text-2xl font-sans font-bold text-primary-foreground tracking-tighter uppercase leading-none">
        Monitorización{" "}
        <span className="text-blue-400">Hemodinámica</span>
       </h1>
       <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
        Análisis de perfiles de shock y parámetros críticos
       </p>
      </div>
     </div>
     <div className="flex gap-2">
      <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[100px]">
       <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">
        PAM Obj
       </span>
       <span className="text-xl font-sans font-bold text-white tracking-tighter leading-none">
        {">"}65
       </span>
      </div>
      <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[100px]">
       <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">
        SVR Obj
       </span>
       <span className="text-xl font-sans font-bold text-white tracking-tighter leading-none">
        800-1200
       </span>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 w-full flex-1">
    <div className="grid lg:grid-cols-12 gap-10">
     {/* Left: Shock Navigation */}
     <div className="lg:col-span-4 space-y-8">
      <div className="flex items-center justify-between px-2">
       <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500 ">
        Perfiles de Shock
       </p>
       <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] uppercase px-3 py-1 rounded-full">
        Diferenciación
       </Badge>
      </div>
      <div className="grid gap-4">
       {shockProfiles.map(shock => (
        <button
         key={shock.id}
         onClick={() => setActiveShock(shock)}
         className={cn(
          "group flex items-center justify-between p-5 rounded-xl border-2 transition-all relative overflow-hidden",
          activeShock.id === shock.id
           ? "bg-white border-indigo-600 shadow-2xl scale-[1.03]"
           : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm"
         )}
        >
         <div className="flex items-center gap-4 relative z-10 text-left">
          <div
           className={cn(
            "w-2 h-10 rounded-full transition-all",
            activeShock.id === shock.id
             ? "bg-indigo-600"
             : "bg-slate-200"
           )}
          />
          <div>
           <h3
            className={cn(
             "text-sm font-sans font-bold uppercase tracking-tighter",
             activeShock.id === shock.id
              ? "text-slate-900"
              : "text-slate-500"
            )}
           >
            {shock.type}
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
            {shock.id === "distributive"
             ? "Vasodilatación"
             : shock.id === "cardiogenic"
              ? "Falla de Bomba"
              : "Pérdida Volumen"}
           </p>
          </div>
         </div>
         <ChevronRight
          className={cn(
           "w-5 h-5 transition-transform",
           activeShock.id === shock.id
            ? "text-indigo-600 translate-x-1"
            : "text-slate-300"
          )}
         />
        </button>
       ))}
      </div>

      {/* Monitoring Params Quick View */}
      <div className="pt-2 space-y-3">
       <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 px-2">
        Monitorización Avanzada
       </p>
       <div className="grid grid-cols-3 gap-2">
        {monitoringParameters.map(p => (
         <button
          key={p.id}
          onClick={() => setActiveParam(p)}
          className={cn(
           "p-3 rounded-xl border transition-all font-sans ",
           activeParam.id === p.id
            ? "bg-slate-900 border-transparent text-white shadow-xl scale-[1.02]"
            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm"
          )}
         >
          <p className="text-[9px] font-bold uppercase tracking-tighter opacity-60 mb-1">
           {p.abbreviation}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-tight">
           {p.normalRange}
          </p>
         </button>
        ))}
       </div>
      </div>
     </div>

      {/* Right: Clinical Viewboard */}
     <div className="lg:col-span-8">
      <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden relative border-t-4 border-t-indigo-600">
       <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="space-y-3">
          <Badge className="bg-indigo-600 text-white px-3 py-1 rounded-full font-sans font-bold text-[9px] uppercase tracking-widest border-none shadow-sm">
           ANÁLISIS DE CHOQUE
          </Badge>
          <div>
           <h2 className="text-xl font-sans font-bold tracking-tighter text-slate-900 uppercase leading-none ">
            {activeShock.name}
           </h2>
           <p className="text-slate-500 font-sans font-bold text-[10px] mt-4 leading-relaxed max-w-2xl uppercase tracking-widest">
            "{activeShock.description}"
           </p>
          </div>
         </div>
        </div>
       </CardHeader>

       <CardContent className="p-6 space-y-8">
        {/* Hemodynamics Array */}
        <div className="space-y-4">
         <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
           <Table className="h-3 w-3" />
          </div>
          <h3 className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 ">
           Perfiles de Variables
          </h3>
         </div>
         <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {activeShock.hemodynamics.map((h, i) => (
           <div
            key={i}
            className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-500/20 transition-all group relative min-h-[80px] flex flex-col justify-between"
           >
            <p className="text-[8px] font-sans font-bold uppercase tracking-tighter text-slate-400 group-hover:text-indigo-600 transition-colors leading-none ">
             {h.parameter}
            </p>
            <div className="space-y-1">
             <p className={cn(
               "font-sans font-bold text-slate-900 tracking-tighter leading-none",
               h.value.length > 15 ? "text-xs" : "text-sm"
             )}>
              {h.value}
             </p>
             <div className="flex justify-end">
              {h.value.includes("↑") && (
               <TrendingUp className="w-3 h-3 text-indigo-500" />
              )}
              {h.value.includes("↓") && (
               <TrendingUp className="w-3 h-3 text-indigo-500 rotate-180" />
              )}
             </div>
            </div>
           </div>
          ))}
         </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
         {/* Ultrasound Findings */}
         <div className="space-y-6">
          <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
            <Waves className="h-3.5 w-3.5" />
           </div>
           <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-900 ">
            Hallazgos POCUS
           </h3>
          </div>
          <div className="grid gap-2">
           {activeShock.ecoFindings.map((finding, i) => (
            <div
             key={i}
             className="flex items-start gap-3 p-4 rounded-xl bg-sky-50/30 border border-sky-100/50 text-sky-900 group transition-all hover:bg-white hover:shadow-xl hover:border-sky-300"
            >
             <div className="h-6 w-6 rounded-lg bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
              {i + 1}
             </div>
             <p className="text-[10px] font-bold leading-relaxed mt-0.5">
              {finding}
             </p>
            </div>
           ))}
          </div>
         </div>

         {/* Management Strategy */}
         <div className="space-y-6">
          <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Zap className="h-3.5 w-3.5" />
           </div>
           <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 ">
            Intervención
           </h3>
          </div>
          <div className="grid gap-2">
           {activeShock.management.map((task, i) => (
            <div
             key={i}
             className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/30 border border-emerald-100/50 text-emerald-900 transition-all hover:bg-white hover:shadow-xl hover:border-emerald-300 group"
            >
             <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
             </div>
             <p className="text-[10px] font-bold leading-relaxed mt-0.5">
              {task}
             </p>
            </div>
           ))}
          </div>
         </div>
        </div>

        {/* Param Detail Footer */}
        <div className="pt-4">
         <div className="p-6 rounded-xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group border-b-4 border-b-indigo-600">
          <div className="flex items-center gap-3 mb-4 relative z-10">
           <Badge className="bg-indigo-600 text-white border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            DETALLE DE PARÁMETRO
           </Badge>
           <span className="text-white/40 font-bold text-[9px] tracking-widest uppercase">
            {activeParam.abbreviation}
           </span>
          </div>
          <h4 className="text-lg font-sans font-bold uppercase tracking-tight mb-2 relative z-10 ">
           {activeParam.name}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-6 max-w-4xl relative z-10 ">
           "{activeParam.clinicalUse}"
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
           {activeParam.interpretation.map((inter, i) => (
            <div
             key={i}
             className="px-4 py-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-0.5 hover:bg-white/10 transition-colors"
            >
             <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">
              {inter.range}
             </span>
             <span className="text-[11px] font-sans font-bold text-white uppercase tracking-tight ">
              {inter.meaning}
             </span>
            </div>
           ))}
          </div>
         </div>
        </div>
       </CardContent>
      </Card>
     </div>
    </div>
   </div>
  </div>
 );
}
