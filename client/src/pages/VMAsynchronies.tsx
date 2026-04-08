import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { asynchronies } from "@/data/ventilation";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Play, Pause, Activity, RotateCcw } from "lucide-react";

interface CurvePoint {
 time: number;
 pressure: number;
 flow: number;
 volume: number;
}

interface CurveAnnotation {
 t: number;
 curve: "pressure" | "flow" | "volume";
 label: string;
}

// ─── Curve generators (VMI - Paciente Intubado) ──────────────────────────────

function range(start: number, end: number, step = 0.02): number[] {
 const arr: number[] = [];
 for (let i = start; i <= end; i = +(i + step).toFixed(3)) arr.push(i);
 return arr;
}

function generateCurves(type: string, cycles = 4): CurvePoint[] {
 const PEEP = 5,
  PIP = 25,
  Ti = 1.0,
  Te = 2.5,
  cycle = Ti + Te;

 return range(0, cycles * cycle).map(t => {
  const ct = t % cycle;
  const cn = Math.floor(t / cycle);
  let pressure = PEEP,
   flow = 0,
   volume = 0;

  // ── Base waveform (PCV-like) ──
  if (ct < Ti) {
   pressure = PEEP + (PIP - PEEP) * (1 - Math.exp(-ct / 0.08));
   flow = 55 * Math.exp(-ct / 0.5);
   volume = 500 * (1 - Math.exp(-ct / 0.45));
  } else {
   pressure = PEEP + (PIP - PEEP) * Math.exp(-(ct - Ti) / 0.05);
   flow = -50 * Math.exp(-(ct - Ti) / 0.4);
   volume = Math.max(
    0,
    500 * (1 - Math.exp(-Ti / 0.45)) * Math.exp(-(ct - Ti) / 0.45)
   );
  }

  // ── Asynchrony modifications ──
  switch (type) {
   case "ineffective-trigger": {
    const isIneffective = cn % 3 === 1;
    if (isIneffective) {
     if (ct > 0.5 && ct < 1.5) {
      const effort = Math.sin((Math.PI * (ct - 0.5)) / 1.0) * 4;
      pressure = PEEP - effort * 0.5;
      flow = effort * 2;
      volume = 30 * Math.sin((Math.PI * (ct - 0.5)) / 1.0);
     } else {
      pressure = PEEP;
      flow = 0;
      volume = 0;
     }
    }
    break;
   }
   case "auto-trigger": {
    if (ct > cycle * 0.55 && ct < cycle * 0.55 + Ti) {
     const ct2 = ct - cycle * 0.55;
     pressure = PEEP + (PIP - PEEP) * (1 - Math.exp(-ct2 / 0.08));
     flow = 45 * Math.exp(-ct2 / 0.5);
     volume = 350 * (1 - Math.exp(-ct2 / 0.45));
    }
    break;
   }
   case "double-trigger": {
    const hasDouble = cn % 2 === 0;
    if (hasDouble && ct >= Ti + 0.1 && ct < Ti + 0.1 + Ti) {
     const ct2 = ct - (Ti + 0.1);
     pressure = PEEP + (PIP - PEEP) * (1 - Math.exp(-ct2 / 0.08));
     flow = 45 * Math.exp(-ct2 / 0.5);
     const vStart = 500 * (1 - Math.exp(-Ti / 0.45)) - 2;
     volume = vStart + 350 * (1 - Math.exp(-ct2 / 0.4));
    } else if (hasDouble && ct >= Ti + 0.1 + Ti) {
     const expStart = Ti + 0.1 + Ti;
     pressure = PEEP + (PIP - PEEP) * Math.exp(-(ct - expStart) / 0.05);
     flow = -55 * Math.exp(-(ct - expStart) / 0.4);
     volume = 700 * Math.exp(-(ct - expStart) / 0.4);
    } else if (hasDouble && ct >= Ti && ct < Ti + 0.1) {
     pressure = PEEP + (PIP - PEEP) * Math.exp(-(ct - Ti) / 0.05);
     flow = -20;
     volume = 500 * (1 - Math.exp(-Ti / 0.45)) - 20 * (ct - Ti);
    }
    break;
   }
   case "premature-cycling": {
    const ventTi = 0.5;
    const patTi = 1.2;
    const effort = ct < patTi ? Math.sin((Math.PI * ct) / patTi) * 4 : 0;
    if (ct < ventTi) {
     pressure = PEEP + (PIP - PEEP) * (1 - Math.exp(-ct / 0.08));
     flow = 55 * Math.exp(-ct / 0.5);
     volume = 300 * (1 - Math.exp(-ct / 0.4));
    } else if (ct < patTi) {
     pressure = PEEP + effort * 0.8;
     flow = effort * 5;
     const vAtCycling = 300 * (1 - Math.exp(-ventTi / 0.4));
     volume = vAtCycling + flow * (ct - ventTi) * 0.3;
    } else {
     pressure = PEEP;
     flow = -45 * Math.exp(-(ct - patTi) / 0.3);
     volume = Math.max(0, 400 * Math.exp(-(ct - patTi) / 0.35));
    }
    break;
   }
   case "delayed-cycling": {
    const patTi = 0.8;
    const ventTi = 1.5;
    if (ct < patTi) {
     // normal insp
    } else if (ct < ventTi) {
     pressure =
      PIP + 2 * Math.sin((Math.PI * (ct - patTi)) / (ventTi - patTi));
     flow = -20 * Math.sin((Math.PI * (ct - patTi)) / (ventTi - patTi));
     const vAtEnd = 500 * (1 - Math.exp(-patTi / 0.45));
     volume = vAtEnd - 20 * (ct - patTi);
    } else {
     pressure = PEEP + (PIP - PEEP) * Math.exp(-(ct - ventTi) / 0.05);
     flow = -50 * Math.exp(-(ct - ventTi) / 0.3);
     const vAtVentEnd = 500 * (1 - Math.exp(-patTi / 0.45)) - 10;
     volume = Math.max(0, vAtVentEnd * Math.exp(-(ct - ventTi) / 0.3));
    }
    break;
   }
   case "flow-starvation": {
    if (ct < Ti) {
     const slowRise = PEEP + (PIP - PEEP) * (1 - Math.exp(-ct / 0.5));
     const effort = Math.sin((Math.PI * ct) / Ti) * 6;
     pressure = slowRise - effort * 0.8;
     flow = 40 * Math.sin((Math.PI * ct) / Ti);
     volume = (400 * (1 - Math.cos((Math.PI * ct) / Ti))) / 2;
    } else {
     pressure = PEEP + (PIP - PEEP) * Math.exp(-(ct - Ti) / 0.05);
     flow = -45 * Math.exp(-(ct - Ti) / 0.4);
     volume = Math.max(0, 400 * Math.exp(-(ct - Ti) / 0.4));
    }
    break;
   }
   case "reverse-trigger": {
    if (ct > Ti * 0.6 && ct < Ti + 0.5) {
     const eff = Math.sin(((ct - Ti * 0.6) * Math.PI) / 0.9);
     pressure -= eff * 6;
     flow += eff * 15;
    }
    break;
   }
  }

  return { time: t, pressure, flow, volume: Math.max(0, volume) };
 });
}

// ─── Annotation map for each asynchrony ──────────────────────────────────────

const ASYNCHRONY_ANNOTATIONS: Record<string, CurveAnnotation[]> = {
 "ineffective-trigger": [
  { t: 4.5, curve: "pressure", label: "⚠ Esfuerzo sin respuesta" },
  { t: 11.5, curve: "pressure", label: "⚠ Esfuerzo sin respuesta" },
 ],
 "auto-trigger": [
  { t: 2.9, curve: "pressure", label: "🔴 Auto-disparo sin esfuerzo" },
  { t: 6.4, curve: "pressure", label: "🔴 Auto-disparo" },
 ],
 "double-trigger": [
  { t: 1.2, curve: "flow", label: "⚡ 2do ciclo" },
  { t: 8.2, curve: "flow", label: "⚡ 2do ciclo" },
 ],
 "premature-cycling": [
  { t: 0.5, curve: "pressure", label: "✂️ Ciclado precoz" },
  { t: 4.0, curve: "pressure", label: "✂️ Ciclado precoz" },
 ],
 "delayed-cycling": [
  { t: 1.0, curve: "pressure", label: "⏱️ Ciclado tardío" },
  { t: 4.5, curve: "pressure", label: "⏱️ Ciclado tardío" },
 ],
 "flow-starvation": [
  { t: 0.3, curve: "pressure", label: "📉 Dip de demanda" },
  { t: 3.8, curve: "pressure", label: "📉 Dip de demanda" },
 ],
 "reverse-trigger": [
  { t: 0.8, curve: "pressure", label: "🔄 Trigger reverso" },
  { t: 4.3, curve: "pressure", label: "🔄 Trigger reverso" },
 ],
};

// ─── AnimatedChart (same visual style as VMNI) ───────────────────────────────

function AnimatedChart({
 data,
 field,
 label,
 unit,
 color,
 yMin,
 yMax,
 annotations = [],
 animationProgress,
}: {
 data: CurvePoint[];
 field: keyof CurvePoint;
 label: string;
 unit: string;
 color: string;
 yMin: number;
 yMax: number;
 annotations?: { t: number; label: string }[];
 animationProgress: number;
}) {
 const W = 560,
  H = 110;
 const PAD = { top: 10, right: 10, bottom: 22, left: 42 };
 const cW = W - PAD.left - PAD.right;
 const cH = H - PAD.top - PAD.bottom;
 const maxT = data[data.length - 1]?.time ?? 14;
 const progress = isNaN(animationProgress)
  ? 1
  : Math.max(0, Math.min(1, animationProgress));
 const visibleData = data.slice(
  0,
  Math.max(1, Math.floor(data.length * progress))
 );

 const xS = (t: number) => (t / maxT) * cW;
 const yS = (v: number) =>
  cH - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * cH;

 const pathD =
  visibleData.length < 2
   ? ""
   : visibleData
     .map(
      (p, i) =>
       `${i === 0 ? "M" : "L"}${xS(p.time).toFixed(1)},${yS(p[field] as number).toFixed(1)}`
     )
     .join(" ");

 const gridVals = [yMin, (yMin + yMax) / 2, yMax];

 return (
  <div>
   <div className="flex items-center justify-between mb-1">
    <div className="flex items-center gap-2">
     <div
      className="w-4 h-0.5 rounded"
      style={{ backgroundColor: color }}
     />
     <span className="text-xs font-semibold" style={{ color }}>
      {label}
     </span>
     <span className="text-xs text-gray-500">({unit})</span>
    </div>
    {visibleData.length > 0 && (
     <span className="font-mono text-xs font-bold" style={{ color }}>
      {(visibleData[visibleData.length - 1][field] as number).toFixed(1)}
     </span>
    )}
   </div>
   <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
    <g transform={`translate(${PAD.left},${PAD.top})`}>
     {/* Background */}
     <rect x={0} y={0} width={cW} height={cH} fill="#0f172a" rx={4} />

     {/* Grid */}
     {gridVals.map((v, i) => (
      <g key={i}>
       <line
        x1={0}
        y1={yS(v)}
        x2={cW}
        y2={yS(v)}
        stroke="#1e293b"
        strokeWidth={1}
       />
       <text
        x={-4}
        y={yS(v) + 3}
        textAnchor="end"
        fontSize={9}
        fill="#64748b"
       >
        {v.toFixed(0)}
       </text>
      </g>
     ))}

     {/* Zero line */}
     {yMin < 0 && (
      <line
       x1={0}
       y1={yS(0)}
       x2={cW}
       y2={yS(0)}
       stroke="#334155"
       strokeWidth={1}
       strokeDasharray="3,3"
      />
     )}

     {/* Main curve */}
     {pathD && (
      <path
       d={pathD}
       fill="none"
       stroke={color}
       strokeWidth={2}
       strokeLinecap="round"
       strokeLinejoin="round"
      />
     )}
     {/* Glow effect */}
     {pathD && (
      <path
       d={pathD}
       fill="none"
       stroke={color}
       strokeWidth={4}
       strokeLinecap="round"
       strokeLinejoin="round"
       opacity={0.15}
      />
     )}

     {/* Annotation arrows */}
     {progress >= 0.99 &&
      annotations.map((ann, i) => (
       <g key={i} transform={`translate(${xS(ann.t)}, 0)`}>
        {/* Vertical dashed line */}
        <line
         y1={0}
         y2={cH}
         stroke={color}
         strokeWidth={1}
         strokeDasharray="4,2"
         opacity={0.6}
        />
        {/* Arrow pointing down */}
        <polygon
         points={`${-4},8 ${4},8 0,16`}
         fill={color}
         opacity={0.9}
        />
        {/* Label background */}
        <rect
         x={-2}
         y={0}
         width={ann.label.length * 5.5 + 4}
         height={13}
         fill="#0f172a"
         opacity={0.9}
         rx={2}
        />
        {/* Label text */}
        <text y={10} fontSize={8} fill={color} fontWeight="600">
         {ann.label}
        </text>
       </g>
      ))}

     {/* Scanner line */}
     <line
      x1={progress * cW}
      y1={0}
      x2={progress * cW}
      y2={cH}
      stroke="#ef4444"
      strokeWidth={0.5}
      opacity={0.7}
     />

     {/* X axis */}
     <line
      x1={0}
      y1={cH}
      x2={cW}
      y2={cH}
      stroke="#334155"
      strokeWidth={1}
     />
     {[0, 2, 4, 6, 8, 10, 12, 14]
      .filter(v => v <= maxT)
      .map(v => (
       <text
        key={v}
        x={xS(v)}
        y={cH + 14}
        textAnchor="middle"
        fontSize={9}
        fill="#475569"
       >
        {v}s
       </text>
      ))}
    </g>
   </svg>
  </div>
 );
}

// ─── Simulator panel ─────────────────────────────────────────────────────────

function SimulatorPanel({ type }: { type: string }) {
 const [isPlaying, setIsPlaying] = useState(false);
 const [data, setData] = useState<CurvePoint[]>([]);
 const [animProgress, setAnimProgress] = useState(1);
 const animRef = useRef<number>(0);
 const startRef = useRef<number>(0);
 const ANIM_DURATION = 3000;

 useEffect(() => {
  setData(generateCurves(type, 4));
  setAnimProgress(1);
  setIsPlaying(false);
 }, [type]);

 const startAnimation = () => {
  setIsPlaying(true);
  setAnimProgress(0);
  startRef.current = performance.now();
  const animate = (now: number) => {
   const elapsed = now - startRef.current;
   const prog = Math.min(1, elapsed / ANIM_DURATION);
   setAnimProgress(prog);
   if (prog < 1) {
    animRef.current = requestAnimationFrame(animate);
   } else {
    setIsPlaying(false);
    setAnimProgress(1);
   }
  };
  animRef.current = requestAnimationFrame(animate);
 };

 const resetAnimation = () => {
  if (animRef.current) cancelAnimationFrame(animRef.current);
  setIsPlaying(false);
  setAnimProgress(0);
 };

 useEffect(
  () => () => {
   if (animRef.current) cancelAnimationFrame(animRef.current);
  },
  []
 );

 const allAnnotations = ASYNCHRONY_ANNOTATIONS[type] ?? [];
 const pressureAnnotations = allAnnotations
  .filter(a => a.curve === "pressure")
  .map(a => ({ t: a.t, label: a.label }));
 const flowAnnotations = allAnnotations
  .filter(a => a.curve === "flow")
  .map(a => ({ t: a.t, label: a.label }));
 const volumeAnnotations = allAnnotations
  .filter(a => a.curve === "volume")
  .map(a => ({ t: a.t, label: a.label }));

 return (
  <div className="space-y-4">
   <div className="flex justify-between items-center bg-slate-900 rounded-xl p-3 text-slate-200 border border-slate-800">
    <div className="flex items-center gap-2">
     <Activity className="h-5 w-5 text-emerald-400" />
     <span className="text-sm font-semibold">
      Monitor VM Invasiva (Simulación)
     </span>
    </div>
    <div className="flex gap-2">
     <button
      onClick={resetAnimation}
      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
     >
      <RotateCcw className="h-4 w-4" />
     </button>
     <button
      onClick={isPlaying ? resetAnimation : startAnimation}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-emerald-500 text-slate-950 hover:bg-emerald-400"
     >
      {isPlaying ? (
       <Pause className="w-4 h-4" />
      ) : (
       <Play className="w-4 h-4" />
      )}
      {isPlaying ? "Pausar" : "Animar"}
     </button>
    </div>
   </div>

   <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
    <AnimatedChart
     data={data}
     field="pressure"
     label="Presión"
     unit="cmH₂O"
     color="#06b6d4"
     yMin={-5}
     yMax={35}
     annotations={pressureAnnotations}
     animationProgress={animProgress}
    />
    <AnimatedChart
     data={data}
     field="flow"
     label="Flujo"
     unit="L/min"
     color="#10b981"
     yMin={-60}
     yMax={65}
     annotations={flowAnnotations}
     animationProgress={animProgress}
    />
    <AnimatedChart
     data={data}
     field="volume"
     label="Volumen"
     unit="mL"
     color="#8b5cf6"
     yMin={0}
     yMax={800}
     annotations={volumeAnnotations}
     animationProgress={animProgress}
    />
   </div>

   {animProgress === 0 && (
    <p className="text-xs text-muted-foreground text-center">
     Presiona <strong>Animar</strong> para ver las curvas dibujarse en
     tiempo real 🎬
    </p>
   )}
  </div>
 );
}

// ─── Main page component ─────────────────────────────────────────────────────

export default function VMAsynchronies() {
 const [selected, setSelected] = useState(asynchronies[0].id);
 const item = asynchronies.find(a => a.id === selected)!;

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
       <AlertTriangle className="h-8 w-8 text-yellow-400" />
      </div>
      <div>
       <h1 className="text-2xl font-display font-bold text-primary-foreground tracking-tighter uppercase leading-none">
        Asincronías <span className="text-yellow-400">Ventilatorias</span>
       </h1>
       <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
        Simulador Dinámico e Identificación de Conflictos P-V
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="grid gap-10 md:grid-cols-12">
     <div className="space-y-2 md:col-span-4">
      <h3 className="font-semibold text-sm mb-3">Tipos de Asincronía</h3>
      <div className="space-y-2">
       {asynchronies.map(a => (
        <button
         key={a.id}
         onClick={() => setSelected(a.id)}
         className={`w-full text-left p-3 rounded-lg border transition-all ${
          selected === a.id
           ? "border-warning bg-warning/5 shadow-sm ring-1 ring-warning/30"
           : "border-border hover:border-warning/30 hover:bg-muted/50"
         }`}
        >
         <div className="flex items-center gap-2">
          <span className="text-lg">{a.icon}</span>
          <span className="font-sans font-semibold text-sm">
           {a.name}
          </span>
         </div>
         <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
          {a.definition}
         </p>
        </button>
       ))}
      </div>
     </div>

     <div className="md:col-span-8">
      <Card className="h-full border-border/50 shadow-sm">
       <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
         <span className="text-3xl">{item.icon}</span>
         <div>
          <CardTitle className="font-sans text-2xl">
           {item.name}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
           {item.definition}
          </CardDescription>
         </div>
        </div>
       </CardHeader>
       <CardContent>
        <Tabs defaultValue="simulator" className="w-full">
         <TabsList className="w-full grid justify-start grid-cols-3 mb-6 bg-muted/50 h-auto p-1">
          <TabsTrigger
           value="simulator"
           className="py-2 text-xs sm:text-sm"
          >
           Simulador de Curvas
          </TabsTrigger>
          <TabsTrigger
           value="theory"
           className="py-2 text-xs sm:text-sm"
          >
           Conceptos y Teoría
          </TabsTrigger>
          <TabsTrigger
           value="management"
           className="py-2 text-xs sm:text-sm"
          >
           Manejo Clínico
          </TabsTrigger>
         </TabsList>

         <TabsContent value="simulator" className="mt-0">
          <div className="space-y-4">
           <SimulatorPanel type={item.id} />
           <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
             <Activity className="h-4 w-4 text-primary" />{" "}
             Identificación en Curvas Reales
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
             {item.identification}
            </p>

            {item.image && (
             <div className="rounded-lg overflow-hidden border bg-background/50">
              <img
               src={item.image}
               alt={`Curvas ventilatorias reales de ${item.name}`}
               className="w-full h-auto max-h-[250px] object-contain"
               loading="lazy"
              />
              <p className="text-[10px] text-muted-foreground px-3 py-1.5 text-center bg-muted/30">
               {item.image.includes("deharo")
                ? "Fuente: de Haro C. Tesis Doctoral UAB 2019."
                : item.image.includes("mallat")
                 ? "Fuente: Mallat J et al. J Clin Med 2021;10(19):4550."
                 : "Curva clínica representativa"}
              </p>
             </div>
            )}
           </div>
          </div>
         </TabsContent>

         <TabsContent value="theory" className="space-y-6 mt-0">
          <div className="space-y-4">
           <div>
            <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
             <span className="bg-primary/10 text-primary p-1 rounded-md">
              🧠
             </span>{" "}
             Mecanismo Fisiopatológico
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
             {item.mechanism}
            </p>
           </div>

           <div className="bg-muted/40 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
             Patrón Geométrico Típico
            </h4>
            <p className="text-sm text-muted-foreground ">
             {item.curvePattern}
            </p>
           </div>
          </div>
         </TabsContent>

         <TabsContent value="management" className="space-y-6 mt-0">
          <div>
           <h4 className="font-semibold text-md mb-3 flex items-center gap-2">
            <span className="bg-success/10 text-success p-1 rounded-md">
             🛠️
            </span>{" "}
            Ajustes en el Ventilador
           </h4>
           <ul className="grid gap-2">
            {item.management.map(m => (
             <li
              key={m}
              className="bg-background border rounded-lg p-3 text-sm text-foreground flex items-center gap-3 shadow-sm"
             >
              <div className="h-2 w-2 rounded-full bg-success shrink-0" />
              {m}
             </li>
            ))}
           </ul>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
           <h4 className="font-semibold text-sm mb-2 text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Impacto Clínico
            Relevante
           </h4>
           <p className="text-sm text-destructive/90 leading-relaxed font-medium">
            {item.clinicalImpact}
           </p>
          </div>
         </TabsContent>
        </Tabs>
       </CardContent>
      </Card>
     </div>
    </div>
   </div>
  </div>
 );
}
