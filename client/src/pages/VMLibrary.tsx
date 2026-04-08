import { useState } from "react";
import { motion } from "framer-motion";
import { ventilationModes, ventilationParameters } from "@/data/ventilation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { Activity, BookOpen, Settings } from "lucide-react";

const categoryLabels: Record<string, string> = {
 controlled: "Controlado",
 assisted: "Asistido",
 spontaneous: "Espontáneo",
 hybrid: "Híbrido",
};

const categoryColors: Record<string, string> = {
 controlled: "bg-destructive/10 text-destructive",
 assisted: "bg-warning/10 text-warning",
 spontaneous: "bg-success/10 text-success",
 hybrid: "bg-info/10 text-info",
};

export default function VMLibrary() {
 const [selectedMode, setSelectedMode] = useState(ventilationModes[0].id);
 const mode = ventilationModes.find(m => m.id === selectedMode)!;

 return (
  <div className="min-h-full bg-slate-50/30">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-5">
       <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
        <Activity className="h-8 w-8" />
       </div>
       <div>
        <h1 className="text-2xl font-display font-bold text-primary-foreground tracking-tighter uppercase leading-none">
         Biblioteca de Ventilación <span className="text-blue-400">Invasiva (VMI)</span>
        </h1>
        <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
         Modos ventilatorios, parámetros y conceptos fundamentales
        </p>
       </div>
      </div>
     </motion.div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
    <Tabs defaultValue="modes" className="space-y-10">
     <div className="flex justify-center">
      <TabsList className="bg-white border-2 border-slate-100 p-1.5 rounded-xl h-auto shadow-sm">
       <TabsTrigger
        value="modes"
        className="rounded-xl px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-sans font-bold text-[10px] uppercase tracking-widest flex items-center gap-3"
       >
        <BookOpen className="h-4 w-4" /> Modos Ventilatorios
       </TabsTrigger>
       <TabsTrigger
        value="parameters"
        className="rounded-xl px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-sans font-bold text-[10px] uppercase tracking-widest flex items-center gap-3"
       >
        <Settings className="h-4 w-4" /> Parámetros
       </TabsTrigger>
      </TabsList>
     </div>

     <TabsContent value="modes">
      <div className="grid lg:grid-cols-12 gap-10">
       <div className="lg:col-span-4 space-y-4">
        <div className="px-2 mb-4">
         <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500 ">
          Modos Disponibles
         </p>
        </div>
        <div className="grid gap-4">
         {ventilationModes.map(m => (
          <button
           key={m.id}
           onClick={() => setSelectedMode(m.id)}
           className={`group flex items-center justify-between p-6 rounded-xl border-2 transition-all relative overflow-hidden text-left ${
            selectedMode === m.id
             ? "bg-white border-blue-600 shadow-2xl scale-[1.03] ring-4 ring-blue-500/5"
             : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm"
           }`}
          >
           <div className="flex items-center gap-4 relative z-10">
            <div
             className={`w-2 h-10 rounded-full transition-all ${selectedMode === m.id ? "bg-blue-600" : "bg-slate-200"}`}
            />
            <div>
             <div className="flex items-center gap-2 mb-1">
              <span className="font-sans font-bold text-sm tracking-tighter uppercase">
               {m.name}
              </span>
              <Badge
               variant="secondary"
               className={`text-[8px] font-sans font-bold uppercase ${categoryColors[m.category]}`}
              >
               {categoryLabels[m.category]}
              </Badge>
             </div>
             <p className="text-[11px] font-bold text-slate-400 ">
              {m.fullName}
             </p>
            </div>
           </div>
          </button>
         ))}
        </div>
       </div>

       <div className="lg:col-span-8">
        <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden relative border-t-8 border-t-blue-600">
         <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="space-y-4">
           <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest border-none shadow-lg">
            DETALLES DE MODO
           </Badge>
           <h2 className="text-2xl font-sans font-bold tracking-tighter uppercase text-slate-900 leading-none">
            {mode.name} — <span className="text-blue-600">{mode.fullName}</span>
           </h2>
          </div>
         </CardHeader>
         <CardContent className="p-10 space-y-12">
          <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-8">
            <div>
             <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-slate-900 mb-4">
              Descripción Clínica
             </h4>
             <p className="text-sm text-slate-600 leading-relaxed font-bold ">
              "{mode.description}"
             </p>
            </div>
            <div>
             <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-slate-900 mb-4">
              Mecanismo de Entrega
             </h4>
             <p className="text-sm text-slate-700 leading-relaxed font-bold">
              {mode.mechanism}
             </p>
            </div>
           </div>
           <div className="space-y-8">
            <div>
             <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-blue-600 mb-4">
              Parámetros Clave
             </h4>
             <div className="flex flex-wrap gap-2">
              {mode.keyParameters.map(p => (
               <Badge
                key={p}
                variant="outline"
                className="text-[9px] font-sans font-bold border-blue-500/20 px-4 py-1.5 rounded-full text-blue-600 uppercase tracking-tighter"
               >
                {p}
               </Badge>
              ))}
             </div>
            </div>
            <div>
             <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Indicaciones
             </h4>
             <div className="grid gap-2">
              {mode.indications.map(i => (
               <div
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 text-[11px] font-bold "
               >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {i}
               </div>
              ))}
             </div>
            </div>
           </div>
          </div>
         </CardContent>
        </Card>
       </div>
      </div>
     </TabsContent>

     <TabsContent value="parameters">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
       {ventilationParameters.map(param => (
        <Card key={param.id}>
         <CardHeader className="pb-2">
          <CardTitle className="font-sans text-base flex items-center justify-between">
           {param.name}
           <Badge variant="outline" className="text-[10px]">
            {param.unit}
           </Badge>
          </CardTitle>
         </CardHeader>
         <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
           {param.definition}
          </p>
          <div className="bg-muted/50 rounded-md p-2">
           <p className="text-xs font-medium">
            Rango normal: {param.normalRange}
           </p>
          </div>
          <p className="text-xs text-muted-foreground">
           {param.clinicalRelevance}
          </p>
          {param.formula && (
           <div className="bg-primary/5 rounded-md p-2 border border-primary/10">
            <p className="text-xs font-mono whitespace-pre-line">
             {param.formula}
            </p>
           </div>
          )}
         </CardContent>
        </Card>
       ))}
      </div>
     </TabsContent>
    </Tabs>
   </div>
  </div>
 );
}
