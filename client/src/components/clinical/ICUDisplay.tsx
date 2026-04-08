import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Wind, Heart, Thermometer, Droplets, Zap } from "lucide-react";

interface ICUDisplayProps {
  hr?: number;
  spo2?: number;
  bp?: string;
  rr?: number;
  temp?: string;
  pip?: number;
  peep?: number;
  vt?: number;
  mode?: string;
}

export function ICUDisplay({
  hr = 75,
  spo2 = 98,
  bp = "120/80",
  rr = 14,
  temp = "36.8",
  pip = 22,
  peep = 5,
  vt = 450,
  mode = "VCV"
}: ICUDisplayProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white p-6 rounded-3xl border-8 border-slate-800 shadow-2xl font-mono overflow-hidden max-w-5xl mx-auto">
      {/* Header / Status Bar */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-slate-800 rounded text-xs font-bold text-slate-400">BED 04</div>
          <div className="text-xs font-bold text-slate-500">{time.toLocaleTimeString()}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">System Active</span>
          </div>
          <div className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-bold border border-blue-600/30">
            {mode} MODE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Vital Signs Monitor */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* ECG Section */}
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-green-500">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">ECG II</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-500 leading-none">{hr}</div>
                <div className="text-[10px] font-bold text-green-500/50 uppercase">BPM</div>
              </div>
            </div>
            <div className="h-24 w-full relative overflow-hidden">
               <ECGWave color="#22c55e" speed={2} />
            </div>
          </div>

          {/* SpO2 Section */}
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Droplets className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">SpO2</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-cyan-400 leading-none">{spo2}</div>
                <div className="text-[10px] font-bold text-cyan-400/50 uppercase">%</div>
              </div>
            </div>
            <div className="h-20 w-full relative overflow-hidden">
               <ECGWave color="#22d3ee" speed={1.5} amplitude={15} />
            </div>
          </div>

          {/* BP & Temp Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">NIBP</span>
              </div>
              <div className="text-3xl font-bold text-red-500">{bp}</div>
              <div className="text-[10px] font-bold text-red-500/50 uppercase">mmHg</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">TEMP</span>
              </div>
              <div className="text-3xl font-bold text-yellow-500">{temp}</div>
              <div className="text-[10px] font-bold text-yellow-500/50 uppercase">°C</div>
            </div>
          </div>
        </div>

        {/* Right Column: Ventilator Monitor */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border-2 border-blue-600/30 h-full flex flex-col">
            <div className="flex items-center gap-2 text-blue-400 mb-6">
              <Wind className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Ventilator Status</span>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">PIP</div>
                <div className="text-4xl font-bold text-blue-400">{pip}</div>
                <div className="text-[10px] font-bold text-blue-400/50 uppercase">cmH2O</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">PEEP</div>
                <div className="text-4xl font-bold text-blue-400">{peep}</div>
                <div className="text-[10px] font-bold text-blue-400/50 uppercase">cmH2O</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Vte</div>
                <div className="text-4xl font-bold text-blue-400">{vt}</div>
                <div className="text-[10px] font-bold text-blue-400/50 uppercase">mL</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Rate</div>
                <div className="text-4xl font-bold text-blue-400">{rr}</div>
                <div className="text-[10px] font-bold text-blue-400/50 uppercase">bpm</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Pressure Wave</span>
                <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
              </div>
              <div className="h-24 bg-black/40 rounded-lg border border-slate-800/50 overflow-hidden">
                <VentWave color="#3b82f6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ECGWave({ color, speed = 2, amplitude = 25 }: { color: string, speed?: number, amplitude?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(xRef.current, 0, speed + 2, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      const y = canvas.height / 2 + Math.sin(xRef.current * 0.1) * amplitude * (Math.random() > 0.9 ? 2 : 0.2);
      
      ctx.moveTo(xRef.current, canvas.height / 2);
      ctx.lineTo(xRef.current + speed, y);
      ctx.stroke();

      xRef.current = (xRef.current + speed) % canvas.width;
      requestAnimationFrame(draw);
    };

    const anim = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(anim);
  }, [color, speed, amplitude]);

  return <canvas ref={canvasRef} width={600} height={100} className="w-full h-full" />;
}

function VentWave({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(xRef.current, 0, 3, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      const cycle = (xRef.current * 0.05) % (Math.PI * 2);
      const y = canvas.height - 20 - (cycle < Math.PI ? Math.sin(cycle) * 40 : 0);
      
      ctx.moveTo(xRef.current, canvas.height - 20);
      ctx.lineTo(xRef.current + 2, y);
      ctx.stroke();

      xRef.current = (xRef.current + 2) % canvas.width;
      requestAnimationFrame(draw);
    };

    const anim = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(anim);
  }, [color]);

  return <canvas ref={canvasRef} width={400} height={100} className="w-full h-full" />;
}
