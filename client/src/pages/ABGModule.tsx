import { useState } from "react";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
 FlaskConical,
 AlertCircle,
 CheckCircle2,
 TrendingUp,
 TrendingDown,
 Info,
 Waves,
 Activity,
 Zap,
 ChevronRight,
 Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ABGModule() {
 const [ph, setPh] = useState("");
 const [pco2, setPco2] = useState("");
 const [hco3, setHco3] = useState("");
 const [po2, setPo2] = useState("");
 const [fio2, setFio2] = useState("21");
 const [na, setNa] = useState("");
 const [cl, setCl] = useState("");

 const interpret = () => {
  const valPh = parseFloat(ph);
  const valPco2 = parseFloat(pco2);
  const valHco3 = parseFloat(hco3);
  const valPo2 = parseFloat(po2);
  const valFio2 = parseFloat(fio2) / 100;
  const valNa = parseFloat(na);
  const valCl = parseFloat(cl);

  if (isNaN(valPh) || isNaN(valPco2) || isNaN(valHco3)) return null;

  let primary = "Eubasia";
  let status = "NORMAL";
  let color = "text-emerald-500";
  let bgGradient = "from-emerald-500/10 to-emerald-500/5";

  if (valPh < 7.35) {
   status = "ACIDEMIA";
   color = "text-red-500";
   bgGradient = "from-red-500/10 to-red-500/5";
   if (valPco2 > 45) primary = "Respiratoria";
   else if (valHco3 < 22) primary = "Metabólica";
  } else if (valPh > 7.45) {
   status = "ALCALEMIA";
   color = "text-blue-500";
   bgGradient = "from-blue-500/10 to-blue-500/5";
   if (valPco2 < 35) primary = "Respiratoria";
   else if (valHco3 > 26) primary = "Metabólica";
  }

  const pafio2 = valPo2 / valFio2;
  let oxyStatus = "Normal";
  let oxyColor = "text-emerald-600";
  if (pafio2 < 100) {
   oxyStatus = "Severa";
   oxyColor = "text-red-600";
  } else if (pafio2 < 200) {
   oxyStatus = "Moderada";
   oxyColor = "text-orange-600";
  } else if (pafio2 < 300) {
   oxyStatus = "Leve";
   oxyColor = "text-amber-600";
  }

  let anionGap = null;
  if (!isNaN(valNa) && !isNaN(valCl)) {
   anionGap = valNa - (valCl + valHco3);
  }

  return {
   status,
   primary,
   pafio2: pafio2.toFixed(0),
   oxyStatus,
   oxyColor,
   color,
   bgGradient,
   anionGap,
  };
 };
 const result = interpret();
 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-6">
    <div className="mx-auto max-w-5xl">
     <div className="flex items-center gap-3 mb-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
       <FlaskConical className="h-5 w-5 text-white" />
      </div>
      <h1 className="font-display text-2xl font-bold text-primary-foreground uppercase tracking-tight">
       Análisis <span className="text-blue-400">Gasométrico</span>
      </h1>
     </div>
     <p className="text-sm text-primary-foreground/60">
      Interpretación Ácido-Base e Intercambio Gaseoso según estándares clínicos.
     </p>
    </div>
   </div>

   <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 w-full flex-1">
    <div className="grid lg:grid-cols-2 gap-6">
     <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4">
       <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Entrada de Parámetros
       </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
       <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
         <Label htmlFor="ph" className="text-xs font-semibold">pH Arterial</Label>
         <Input id="ph" placeholder="7.40" value={ph} onChange={e => setPh(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-2">
         <Label htmlFor="pco2" className="text-xs font-semibold">pCO₂ (mmHg)</Label>
         <Input id="pco2" placeholder="40" value={pco2} onChange={e => setPco2(e.target.value)} className="h-10 text-sm" />
        </div>
       </div>
       <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
         <Label htmlFor="hco3" className="text-xs font-semibold">HCO₃⁻ (mEq/L)</Label>
         <Input id="hco3" placeholder="24" value={hco3} onChange={e => setHco3(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-2">
         <Label htmlFor="po2" className="text-xs font-semibold">pO₂ (mmHg)</Label>
         <Input id="po2" placeholder="90" value={po2} onChange={e => setPo2(e.target.value)} className="h-10 text-sm" />
        </div>
       </div>
       <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
         <Label htmlFor="fio2" className="text-xs font-semibold">FiO₂ (%)</Label>
         <Input id="fio2" placeholder="21" value={fio2} onChange={e => setFio2(e.target.value)} className="h-10 text-sm" />
        </div>
        <div className="space-y-2">
         <Label htmlFor="na" className="text-xs font-semibold">Na⁺ (mEq/L)</Label>
         <Input id="na" placeholder="140" value={na} onChange={e => setNa(e.target.value)} className="h-10 text-sm" />
        </div>
       </div>
       <div className="space-y-2">
        <Label htmlFor="cl" className="text-xs font-semibold">Cl⁻ (mEq/L)</Label>
        <Input id="cl" placeholder="104" value={cl} onChange={e => setCl(e.target.value)} className="h-10 text-sm" />
       </div>
      </CardContent>
     </Card>

     {result ? (
      <div className="space-y-4">
       <Card className="rounded-xl border border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="text-center p-6 border-b border-slate-50">
         <Badge className="mb-2 uppercase text-[8px] tracking-widest mx-auto bg-slate-100 text-slate-500 border-none font-bold">
          Estado Clínico
         </Badge>
         <h2 className={cn("text-3xl font-display font-bold tracking-tighter uppercase", result.color)}>
          {result.status}
         </h2>
         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          Alteración Primaria: <span className="text-slate-900">{result.primary}</span>
         </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
         <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg flex flex-col items-center gap-1 text-center border border-slate-100/50">
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PaFiO₂</p>
           <p className={cn("text-2xl font-display font-bold tracking-tight", result.oxyColor)}>{result.pafio2}</p>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Falla: {result.oxyStatus}</p>
          </div>
          {result.anionGap !== null && (
           <div className="p-4 bg-slate-50 rounded-lg flex flex-col items-center gap-1 text-center border border-slate-100/50">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Anion Gap</p>
            <p className="text-2xl font-display font-bold text-indigo-600 tracking-tight">{result.anionGap.toFixed(1)}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">VN: 8-12</p>
           </div>
          )}
         </div>
         <div className="p-4 bg-slate-950 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
           <Info className="w-3 h-3 text-indigo-400" />
           <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-400">Racional</span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-slate-300">
           {result.status} de origen {result.primary.toLowerCase()} con insuficiencia respiratoria grado {result.oxyStatus.toLowerCase()}.
          </p>
         </div>
        </CardContent>
       </Card>
      </div>
     ) : (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 p-8 bg-white rounded-xl border-2 border-dashed border-slate-100">
       <div className="p-6 bg-slate-50 rounded-full text-slate-300">
        <FlaskConical className="h-12 w-12" />
       </div>
       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Esperando Datos</h3>
      </div>
     )}
    </div>
   </div>

   <footer className="flex items-center justify-center gap-8 py-8 border-t bg-white mt-auto">
    <div className="flex items-center gap-2 text-muted-foreground">
     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
     <span className="text-[10px] font-bold uppercase tracking-widest">Análisis Ácido-Base 2024</span>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground">
     <Activity className="w-4 h-4 text-sky-500" />
     <span className="text-[10px] font-bold uppercase tracking-widest">Stewart compatible</span>
    </div>
   </footer>
  </div>
 );
}
