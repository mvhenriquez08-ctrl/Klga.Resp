import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wind, HeartPulse, Zap } from "lucide-react";
import { ECGChartSync } from "@/components/ecg/ECGChartSync";
import { arrhythmias } from "@/lib/arrhythmiaData";
import { generateVMIContinuous, VMISettings } from "@/lib/vmiWaveGenerator";
import { generateHemoContinuous, HemoSettings } from "@/lib/hemoWaveGenerator";

export default function ClinicalMonitor() {
  const [time, setTime] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Simulation Settings
  const [ecgId, setEcgId] = useState("normal");
  const [vmiSettings] = useState<VMISettings>({
    mode: 'PCV',
    rr: 15,
    peep: 5,
    resistance: 10,
    compliance: 0.05,
    ieRatio: 2,
    pi: 15,
    vt: 0.5,
    flowPattern: 'SQUARE'
  });
  const [hemoSettings] = useState<HemoSettings>({
    hr: 75,
    sbp: 120,
    dbp: 80,
    cvpAvg: 8
  });

  const animate = () => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const currentArrhythmia = arrhythmias.find(a => a.id === ecgId) || arrhythmias[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-50 p-6 gap-6 font-sans overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tighter uppercase">Monitor Multiparámetros UCI</h1>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Simulación de Alta Fidelidad v2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1">
            <div className="size-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            Paciente Estable
          </Badge>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Tiempo de Simulación</p>
            <p className="text-xl font-mono font-bold text-primary">{time.toFixed(1)}s</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Left Column: Waveforms */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* ECG Layer */}
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <HeartPulse className="size-4 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">ECG Lead II (25mm/s)</span>
            </div>
            <CardContent className="p-0 h-[200px]">
              <ECGChartSync 
                arrhythmia={currentArrhythmia} 
                isPlaying={true}
                height={200}
                pixelsPerMm={20}
              />
            </CardContent>
          </Card>

          {/* VMI Layer (Respiratory) */}
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <Wind className="size-4 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Ventilación Mecánica (Paw / Flow)</span>
            </div>
            <CardContent className="p-0 h-[240px] flex flex-col">
              {/* This is a placeholder for a combined VMI chart, but we can reuse the same canvas logic */}
              <VMIUnifiedChart 
                 settings={vmiSettings}
                 time={time}
              />
            </CardContent>
          </Card>

          {/* Hemodynamics Layer */}
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <Activity className="size-4 text-rose-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Hemodinamia Invasiva (ArtLine)</span>
            </div>
            <CardContent className="p-0 h-[180px]">
              <HemoUnifiedChart 
                settings={hemoSettings}
                time={time}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Parameters & Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card className="bg-slate-900 border-slate-800 shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-500 font-bold">Signos Vitales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">FC (bpm)</p>
                  <p className="text-4xl font-display font-bold text-emerald-400">75</p>
                </div>
                <HeartPulse className="size-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
              </div>
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-rose-400 transition-colors">TA (mmHg)</p>
                  <p className="text-4xl font-display font-bold text-rose-400">120/80</p>
                </div>
                <Activity className="size-8 text-rose-500/20 group-hover:text-rose-500/40 transition-colors" />
              </div>
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">SatO2 (%)</p>
                  <p className="text-4xl font-display font-bold text-cyan-400">98</p>
                </div>
                <Zap className="size-8 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-500 font-bold">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">Ritmo ECG</p>
                <select 
                  className="w-full bg-slate-800 border-slate-700 rounded-md text-xs p-2 focus:ring-1 focus:ring-primary outline-none"
                  value={ecgId}
                  onChange={(e) => setEcgId(e.target.value)}
                >
                  {arrhythmias.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-component for VMI Canvas
 */
function VMIUnifiedChart({ settings, time }: { settings: VMISettings, time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw Pressure Wave (Yellow)
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = time - (width - x) / 100;
      const point = generateVMIContinuous(settings, t);
      const py = height/2 - (point.pressure * 2);
      if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }
    ctx.stroke();

    // Draw Flow Wave (Cyan)
    ctx.strokeStyle = "#22d3ee";
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = time - (width - x) / 100;
      const point = generateVMIContinuous(settings, t);
      const fy = height/2 + 50 - (point.flow * 50);
      if (x === 0) ctx.moveTo(x, fy); else ctx.lineTo(x, fy);
    }
    ctx.stroke();

  }, [time, settings]);

  return <canvas ref={canvasRef} width={1000} height={240} className="w-full h-full" />;
}

/**
 * Sub-component for Hemo Canvas
 */
function HemoUnifiedChart({ settings, time }: { settings: HemoSettings, time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw ArtLine (Rose)
    ctx.strokeStyle = "#fb7185";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = time - (width - x) / 100;
      const point = generateHemoContinuous(settings, t);
      const y = height - (point.artLine * 1.2) + 20;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

  }, [time, settings]);

  return <canvas ref={canvasRef} width={1000} height={180} className="w-full h-full" />;
}
