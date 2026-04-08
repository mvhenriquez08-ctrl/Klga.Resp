import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 ScatterChart,
 Scatter,
} from "recharts";
import { Activity, Beaker, Wind, Zap } from "lucide-react";
import { VentEngine, AlveolarNode } from "@/lib/VentEngine";

function generatePressureTime(
 peep: number,
 ppeak: number,
 rr: number,
 ie: number
) {
 const data = [];
 const cycleTime = 60 / rr;
 const iTime = cycleTime / (1 + ie);
 const eTime = cycleTime - iTime;
 const steps = 100;
 for (let i = 0; i <= steps; i++) {
  const t = (i / steps) * cycleTime;
  let pressure;
  if (t < iTime * 0.1) {
   pressure = peep + ((ppeak - peep) * t) / (iTime * 0.1);
  } else if (t < iTime) {
   pressure = ppeak;
  } else if (t < iTime + eTime * 0.15) {
   const frac = (t - iTime) / (eTime * 0.15);
   pressure = ppeak - (ppeak - peep) * frac;
  } else {
   pressure = peep;
  }
  data.push({ time: +(t * 1000).toFixed(0), pressure: +pressure.toFixed(1) });
 }
 return data;
}

function generateFlowTime(rr: number, ie: number, peakFlow: number) {
 const data = [];
 const cycleTime = 60 / rr;
 const iTime = cycleTime / (1 + ie);
 const steps = 100;
 for (let i = 0; i <= steps; i++) {
  const t = (i / steps) * cycleTime;
  let flow;
  if (t < iTime * 0.05) {
   flow = (peakFlow * t) / (iTime * 0.05);
  } else if (t < iTime) {
   flow = peakFlow * (1 - 0.6 * ((t - iTime * 0.05) / (iTime * 0.95)));
  } else if (t < iTime + 0.05 * cycleTime) {
   flow = 0;
  } else {
   const eFrac =
    (t - iTime - 0.05 * cycleTime) / (cycleTime - iTime - 0.05 * cycleTime);
   flow = -peakFlow * 0.8 * Math.exp(-3 * eFrac);
  }
  data.push({ time: +(t * 1000).toFixed(0), flow: +flow.toFixed(1) });
 }
 return data;
}

function generateVolumeTime(vt: number, rr: number, ie: number) {
 const data = [];
 const cycleTime = 60 / rr;
 const iTime = cycleTime / (1 + ie);
 const steps = 100;
 for (let i = 0; i <= steps; i++) {
  const t = (i / steps) * cycleTime;
  let volume;
  if (t < iTime) {
   volume = vt * (t / iTime);
  } else {
   const eFrac = (t - iTime) / (cycleTime - iTime);
   volume = vt * (1 - eFrac);
  }
  data.push({ time: +(t * 1000).toFixed(0), volume: +volume.toFixed(0) });
 }
 return data;
}

function generatePVLoop(
 vt: number,
 peep: number,
 compliance: number,
 nodes: AlveolarNode[]
) {
 const data = [];
 const steps = 50;

 // Inspiración
 for (let i = 0; i <= steps; i++) {
  const vol = (vt * i) / steps;
  const pStatic = peep + vol / compliance;
  // Efecto de reclutamiento dinámico en la curva
  const rec = VentEngine.updateRecruitment(nodes, pStatic);
  const pIncl = pStatic + 2 * Math.sin((Math.PI * i) / steps) * (2 - rec);
  data.push({
   pressure: +pIncl.toFixed(1),
   volume: +vol.toFixed(0),
   phase: "ins",
  });
 }

 // Espiración
 for (let i = steps; i >= 0; i--) {
  const vol = (vt * i) / steps;
  const pStatic = peep + vol / compliance;
  const rec = VentEngine.updateRecruitment(nodes, pStatic);
  const pExcl = pStatic - 1.5 * Math.sin((Math.PI * i) / steps) * (rec + 0.5);
  data.push({
   pressure: +pExcl.toFixed(1),
   volume: +vol.toFixed(0),
   phase: "exp",
  });
 }
 return data;
}

export default function VMCurves() {
 const [peep, setPeep] = useState(5);
 const [ppeak, setPpeak] = useState(25);
 const [rr, setRr] = useState(16);
 const [iRatio, setIRatio] = useState(1);
 const [eRatio, setERatio] = useState(2);
 const [vt, setVt] = useState(500);
 const [compliance, setCompliance] = useState(50);
 const [paco2, setPaco2] = useState(40);

 // Inicializar pulmones multinodales
 const lungs = useMemo(() => VentEngine.generateLungs(100, 15, 5), []);

 const ie = eRatio / iRatio;
 const peakFlow = 60;

 // Cálculos de VentEngine
 const otisRR = useMemo(
  () => VentEngine.solveOtis((vt * rr) / 1000, 0.15, 10, compliance),
  [vt, rr, compliance]
 );

 const duffinVE = useMemo(() => VentEngine.solveDuffin(paco2), [paco2]);

 const pressureData = useMemo(
  () => generatePressureTime(peep, ppeak, rr, ie),
  [peep, ppeak, rr, ie]
 );
 const flowData = useMemo(() => generateFlowTime(rr, ie, peakFlow), [rr, ie]);
 const volumeData = useMemo(
  () => generateVolumeTime(vt, rr, ie),
  [vt, rr, ie]
 );
 const pvLoop = useMemo(
  () => generatePVLoop(vt, peep, compliance, lungs),
  [vt, peep, compliance, lungs]
 );

 const cycleTime = 60 / rr;
 const iTimeSec = cycleTime / (1 + ie);
 const eTimeSec = cycleTime - iTimeSec;

 const pulmoContext = useMemo(
  () =>
   `Página: Curvas y Loops. Motor Pulmonar: Otis FR=${otisRR.toFixed(1)} rpm, Duffin Spont VE=${duffinVE.toFixed(1)} L/min. PEEP=${peep}, Ppeak=${ppeak}, FR=${rr}, Vt=${vt}, C=${compliance}. PaCO2 estim: ${paco2} mmHg.`,
  [
   peep,
   ppeak,
   rr,
   vt,
   compliance,
   iRatio,
   eRatio,
   iTimeSec,
   eTimeSec,
   otisRR,
   duffinVE,
   paco2,
  ]
 );

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
       <Activity className="h-8 w-8" />
      </div>
      <div>
       <h1 className="text-2xl font-display font-bold text-primary-foreground tracking-tighter uppercase leading-none">
        Curvas y <span className="text-blue-400">Loops</span>
       </h1>
       <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
        Simulación y Monitoreo Fisiológico Avanzado
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-6 py-8">
    <div className="grid gap-6 lg:grid-cols-4">
     {/* Controls */}
     <Card className="lg:col-span-1">
      <CardHeader className="pb-3 text-center">
       <CardTitle className="text-sm font-sans flex items-center justify-center gap-2">
        <Wind className="h-4 w-4 text-accent" />
        Motor Fisiológico
       </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
       {[
        {
         label: "PEEP",
         value: peep,
         set: setPeep,
         min: 0,
         max: 20,
         unit: "cmH₂O",
        },
        {
         label: "P. Pico",
         value: ppeak,
         set: setPpeak,
         min: 10,
         max: 50,
         unit: "cmH₂O",
        },
        {
         label: "FR",
         value: rr,
         set: setRr,
         min: 8,
         max: 35,
         unit: "rpm",
        },
        {
         label: "Vt",
         value: vt,
         set: setVt,
         min: 200,
         max: 800,
         unit: "mL",
         step: 50,
        },
        {
         label: "Compliance",
         value: compliance,
         set: setCompliance,
         min: 10,
         max: 100,
         unit: "mL/cmH₂O",
        },
        {
         label: "PaCO2 (Drive)",
         value: paco2,
         set: setPaco2,
         min: 30,
         max: 80,
         unit: "mmHg",
        },
       ].map(ctrl => (
        <div key={ctrl.label}>
         <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium">{ctrl.label}</span>
          <Badge variant="outline" className="text-[10px]">
           {ctrl.value} {ctrl.unit}
          </Badge>
         </div>
         <Slider
          value={[ctrl.value]}
          onValueChange={([v]) => ctrl.set(v)}
          min={ctrl.min}
          max={ctrl.max}
          step={ctrl.step || 1}
         />
        </div>
       ))}

       {/* I:E Ratio editable */}
       <div>
        <div className="flex justify-between text-xs mb-1.5">
         <span className="font-medium">Relación I:E</span>
         <Badge variant="outline" className="text-[10px]">
          {iRatio}:{eRatio}
         </Badge>
        </div>
        <div className="flex items-center gap-2">
         <div className="flex-1 space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           I
          </Label>
          <Input
           type="number"
           min={0.5}
           max={4}
           step={0.5}
           value={iRatio}
           onChange={e =>
            setIRatio(
             Math.max(0.5, parseFloat(e.target.value) || 0.5)
            )
           }
           className="h-8 text-sm text-center"
          />
         </div>
         <span className="text-sm font-bold text-muted-foreground mt-4">
          :
         </span>
         <div className="flex-1 space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           E
          </Label>
          <Input
           type="number"
           min={0.5}
           max={6}
           step={0.5}
           value={eRatio}
           onChange={e =>
            setERatio(
             Math.max(0.5, parseFloat(e.target.value) || 0.5)
            )
           }
           className="h-8 text-sm text-center"
          />
         </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
         <span>Ti: {iTimeSec.toFixed(2)}s</span>
         <span>Te: {eTimeSec.toFixed(2)}s</span>
        </div>
       </div>

       <div className="pt-3 border-t space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
         <Beaker className="h-3 w-3" /> Insights Otis/Duffin
        </div>
        <div className="flex justify-between text-xs">
         <span>FR Opt (Otis)</span>
         <span className="font-semibold text-accent">
          {otisRR.toFixed(1)} bpm
         </span>
        </div>
        <div className="flex justify-between text-xs">
         <span>Drive (Duffin)</span>
         <span className="font-semibold text-success">
          {duffinVE.toFixed(1)} L/min
         </span>
        </div>
       </div>

       <div className="pt-3 border-t space-y-1">
        <div className="flex justify-between text-xs">
         <span>Driving Pressure</span>
         <span
          className={`font-semibold ${ppeak - peep > 15 ? "text-destructive" : "text-success"}`}
         >
          {ppeak - peep} cmH₂O
         </span>
        </div>
        <div className="flex justify-between text-xs">
         <span>VM actual</span>
         <span className="font-semibold">
          {((vt * rr) / 1000).toFixed(1)} L/min
         </span>
        </div>
       </div>
      </CardContent>
     </Card>

     {/* Charts */}
     <div className="lg:col-span-3 space-y-4">
      <Tabs defaultValue="waveforms">
       <TabsList>
        <TabsTrigger value="waveforms">Curvas</TabsTrigger>
        <TabsTrigger value="loops">Loops</TabsTrigger>
       </TabsList>

       <TabsContent value="waveforms" className="space-y-4">
        {[
         {
          title: "Presión — Tiempo",
          data: pressureData,
          key: "pressure",
          color: "var(--primary)",
          yLabel: "cmH₂O",
         },
         {
          title: "Flujo — Tiempo",
          data: flowData,
          key: "flow",
          color: "var(--accent)",
          yLabel: "L/min",
         },
         {
          title: "Volumen — Tiempo",
          data: volumeData,
          key: "volume",
          color: "var(--success)",
          yLabel: "mL",
         },
        ].map(chart => (
         <Card key={chart.title}>
          <CardHeader className="py-3 px-4">
           <CardTitle className="text-sm font-sans">
            {chart.title}
           </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
           <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chart.data}>
             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
             <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              label={{
               value: "ms",
               fontSize: 10,
               position: "insideBottomRight",
              }}
             />
             <YAxis
              tick={{ fontSize: 10 }}
              label={{
               value: chart.yLabel,
               fontSize: 10,
               angle: -90,
               position: "insideLeft",
              }}
             />
             <Tooltip contentStyle={{ fontSize: 12 }} />
             <Line
              type="monotone"
              dataKey={chart.key}
              stroke={chart.color}
              strokeWidth={2}
              dot={false}
             />
            </LineChart>
           </ResponsiveContainer>
          </CardContent>
         </Card>
        ))}
       </TabsContent>

       <TabsContent value="loops">
        <Card>
         <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-sans">
           Loop Presión — Volumen
          </CardTitle>
         </CardHeader>
         <CardContent className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={400}>
           <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
             dataKey="pressure"
             type="number"
             name="Presión"
             unit=" cmH₂O"
             tick={{ fontSize: 10 }}
            />
            <YAxis
             dataKey="volume"
             type="number"
             name="Volumen"
             unit=" mL"
             tick={{ fontSize: 10 }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
             data={pvLoop}
             fill="var(--primary)"
             line={{ stroke: "var(--primary)", strokeWidth: 2 }}
             lineType="joint"
            />
           </ScatterChart>
          </ResponsiveContainer>
         </CardContent>
        </Card>
       </TabsContent>
      </Tabs>
     </div>
    </div>
   </div>
  </div>
 );
}
