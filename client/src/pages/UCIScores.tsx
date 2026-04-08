import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Activity,
 TrendingUp,
 Calculator,
 Brain,
 AlertTriangle,
 Info,
 ChevronDown,
 ChevronUp,
 CheckCircle,
 XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreOption {
 p: number;
 label: string;
 detail?: string;
}

// ─── Shared Components ────────────────────────────────────────────────────────

function ScoreSelector({
 label,
 sublabel,
 options,
 current,
 onSelect,
 color = "blue",
}: {
 label: string;
 sublabel?: string;
 options: ScoreOption[];
 current: number;
 onSelect: (v: number) => void;
 color?: string;
}) {
 const colors: Record<string, string> = {
  blue: "bg-blue-500 border-blue-500 text-white shadow-blue-200",
  red: "bg-red-500 border-red-500 text-white shadow-red-200",
  amber: "bg-amber-500 border-amber-500 text-white shadow-amber-200",
  emerald: "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200",
  violet: "bg-violet-500 border-violet-500 text-white shadow-violet-200",
  cyan: "bg-cyan-500 border-cyan-500 text-white shadow-cyan-200",
 };

 return (
  <div className="space-y-2">
   <div className="px-1">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">
     {label}
    </p>
    {sublabel && (
     <p className="text-[10px] text-slate-400 font-sans font-medium mt-0.5 ">
      {sublabel}
     </p>
    )}
   </div>
   <div className="space-y-1">
    {options.map(opt => (
     <button
      key={opt.p + opt.label}
      onClick={() => onSelect(opt.p)}
      className={cn(
       "w-full flex justify-between items-center px-4 py-2.5 rounded-lg border transition-all text-[13px] font-bold text-left font-sans",
       current === opt.p
        ? colors[color] + " shadow-sm border-transparent"
        : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50 shadow-sm"
      )}
     >
      <span className="flex-1">{opt.label}</span>
      {opt.detail && (
       <span
        className={cn(
         "text-xs mr-3",
         current === opt.p ? "text-white/70" : "text-slate-500"
        )}
       >
        {opt.detail}
       </span>
      )}
      <Badge
       className={cn(
        "ml-2 font-bold text-[10px] flex-shrink-0 border-none px-3 py-1 rounded-full",
        current === opt.p ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
       )}
      >
       {opt.p >= 0 ? `+${opt.p}` : opt.p}
      </Badge>
     </button>
    ))}
   </div>
  </div>
 );
}

function ResultCard({
 score,
 label,
 color,
 interpretation,
 ranges,
}: {
 score: number | string;
 label: string;
 color: string;
 interpretation: string;
 ranges?: { range: string; label: string; color: string }[];
}) {
 const colorMap: Record<string, string> = {
  blue: "text-indigo-600 border-indigo-100 bg-indigo-50/30",
  red: "text-rose-600 border-rose-100 bg-rose-50/30",
  amber: "text-amber-600 border-amber-100 bg-amber-50/30",
  emerald: "text-emerald-600 border-emerald-100 bg-emerald-50/30",
  violet: "text-violet-600 border-violet-100 bg-violet-50/30",
  cyan: "text-cyan-600 border-cyan-100 bg-cyan-50/30",
 };

 return (
  <div
   className={cn(
    "rounded-xl border shadow-sm p-6 text-center space-y-4 relative overflow-hidden",
    colorMap[color] || colorMap.blue
   )}
  >
   <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 font-sans">
    {label}
   </p>
   <h3 className="text-5xl font-display font-bold tracking-tighter leading-none">
    {score}
   </h3>
   <div className="flex flex-col items-center gap-2">
    <Badge className="bg-current/10 border-none px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest tracking-tighter">
     {interpretation}
    </Badge>
    
    {ranges && (
     <div className="grid grid-cols-2 gap-2 w-full pt-4 border-t border-current/10">
      {ranges.map((r, i) => (
       <div key={i} className="text-left">
        <p className="text-[8px] font-bold opacity-60 uppercase">{r.range}</p>
        <p className="text-[9px] font-bold uppercase truncate">{r.label}</p>
       </div>
      ))}
     </div>
    )}
   </div>
  </div>
 );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
 const [open, setOpen] = useState(false);
 return (
  <div className="rounded-xl border-2 border-slate-100 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
   <button
    onClick={() => setOpen(!open)}
    className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/50 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:bg-slate-50"
   >
    <div className="flex items-center gap-2">
     <Info className="w-3.5 h-3.5" />
     {title}
    </div>
    {open ? (
     <ChevronUp className="w-3.5 h-3.5" />
    ) : (
     <ChevronDown className="w-3.5 h-3.5" />
    )}
   </button>
   {open && (
    <ul className="px-4 py-3 space-y-1.5">
     {items.map((item, i) => (
      <li
       key={i}
       className="flex items-start gap-2 text-xs text-slate-600"
      >
       <span className="text-blue-500 mt-0.5">•</span>
       {item}
      </li>
     ))}
    </ul>
   )}
  </div>
 );
}

// ─── SOFA Score ───────────────────────────────────────────────────────────────

function SOFAScore() {
 const [sofa, setSofa] = useState({
  resp: 0,
  coag: 0,
  liver: 0,
  cv: 0,
  cns: 0,
  renal: 0,
 });
 const total = Object.values(sofa).reduce((a: number, b: number) => a + b, 0);

 const getMortality = () => {
  if (total <= 6) return { label: "< 10%", color: "text-emerald-600" };
  if (total <= 9) return { label: "15-20%", color: "text-yellow-600" };
  if (total <= 12) return { label: "40-50%", color: "text-orange-600" };
  if (total <= 14) return { label: "50-60%", color: "text-red-600" };
  return { label: "> 80%", color: "text-red-700 font-black" };
 };

 const mortality = getMortality();

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
    <ScoreSelector
     label="Respiratorio"
     sublabel="PaO₂/FiO₂ (mmHg)"
     color="cyan"
     options={[
      { p: 0, label: "PaFi > 400", detail: "Normal" },
      { p: 1, label: "PaFi 300–400", detail: "Leve" },
      { p: 2, label: "PaFi 200–300", detail: "Moderado" },
      { p: 3, label: "PaFi 100–200 + VM", detail: "Grave" },
      { p: 4, label: "PaFi < 100 + VM", detail: "Crítico" },
     ]}
     current={sofa.resp}
     onSelect={v => setSofa({ ...sofa, resp: v })}
    />

    <ScoreSelector
     label="Coagulación"
     sublabel="Plaquetas (×10³/µL)"
     color="violet"
     options={[
      { p: 0, label: "> 150.000" },
      { p: 1, label: "100.000–150.000" },
      { p: 2, label: "50.000–100.000" },
      { p: 3, label: "20.000–50.000" },
      { p: 4, label: "< 20.000" },
     ]}
     current={sofa.coag}
     onSelect={v => setSofa({ ...sofa, coag: v })}
    />

    <ScoreSelector
     label="Hígado"
     sublabel="Bilirrubina (mg/dL)"
     color="amber"
     options={[
      { p: 0, label: "< 1.2 mg/dL" },
      { p: 1, label: "1.2–1.9 mg/dL" },
      { p: 2, label: "2.0–5.9 mg/dL" },
      { p: 3, label: "6.0–11.9 mg/dL" },
      { p: 4, label: "> 12.0 mg/dL" },
     ]}
     current={sofa.liver}
     onSelect={v => setSofa({ ...sofa, liver: v })}
    />

    <ScoreSelector
     label="Cardiovascular"
     sublabel="PAM o vasopresores (µg/kg/min)"
     color="red"
     options={[
      { p: 0, label: "PAM ≥ 70 mmHg", detail: "Sin vasopresores" },
      { p: 1, label: "PAM < 70 mmHg", detail: "Sin vasopresores" },
      { p: 2, label: "Dopamina ≤ 5 o Dobutamina" },
      { p: 3, label: "Dopa > 5 o Norad ≤ 0.1" },
      { p: 4, label: "Dopa > 15 o Norad > 0.1" },
     ]}
     current={sofa.cv}
     onSelect={v => setSofa({ ...sofa, cv: v })}
    />

    <ScoreSelector
     label="SNC"
     sublabel="Escala de Glasgow"
     color="blue"
     options={[
      { p: 0, label: "GCS 15", detail: "Alerta" },
      { p: 1, label: "GCS 13–14", detail: "Confusión leve" },
      { p: 2, label: "GCS 10–12", detail: "Confusión mod." },
      { p: 3, label: "GCS 6–9", detail: "Estupor" },
      { p: 4, label: "GCS < 6", detail: "Coma" },
     ]}
     current={sofa.cns}
     onSelect={v => setSofa({ ...sofa, cns: v })}
    />

    <ScoreSelector
     label="Renal"
     sublabel="Creatinina o diuresis"
     color="emerald"
     options={[
      { p: 0, label: "Crea < 1.2 mg/dL" },
      { p: 1, label: "Crea 1.2–1.9 mg/dL" },
      { p: 2, label: "Crea 2.0–3.4 mg/dL" },
      { p: 3, label: "Crea 3.5–4.9 o < 500 mL/d" },
      { p: 4, label: "Crea > 5.0 o < 200 mL/d" },
     ]}
     current={sofa.renal}
     onSelect={v => setSofa({ ...sofa, renal: v })}
    />
   </div>

   <div className="lg:col-span-4 space-y-4">
    <ResultCard
     score={total}
     label="SOFA Total"
     color="blue"
     interpretation="Disfunción orgánica múltiple"
     ranges={[
      { range: "0–6", label: "< 10%", color: "text-emerald-600" },
      { range: "7–9", label: "15–20%", color: "text-yellow-600" },
      { range: "10–12", label: "40–50%", color: "text-orange-600" },
      { range: "13–14", label: "50–60%", color: "text-red-600" },
      { range: "> 15", label: "> 80%", color: "text-red-700" },
     ]}
    />

    <div className="rounded-xl bg-slate-50/50 border-2 border-slate-100 p-6 shadow-sm">
     <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
      Mortalidad estimada
     </p>
     <p className={cn("text-3xl font-sans font-bold tracking-tighter", mortality.color)}>
      {mortality.label}
     </p>
     <p className="text-[10px] text-slate-400 font-sans font-medium mt-1 ">
      Basado en score actual de {total}
     </p>
    </div>

    <div className="rounded-xl bg-blue-50/50 border-2 border-blue-100 p-6 shadow-sm">
     <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">
      qSOFA (Sepsis)
     </p>
     <p className="text-[11px] text-slate-600 font-sans font-bold ">
      SOFA ≥ 2 + sospecha infección = <strong>SEPSIS</strong>
     </p>
     <p className="text-[11px] text-slate-600 font-sans font-bold mt-1">
      SOFA ≥ 2 + vasopresores + lactato {">"} 2 ={" "}
      <strong>SHOCK SÉPTICO</strong>
     </p>
    </div>

    <InfoBox
     title="Acerca del SOFA"
     items={[
      "Validado en UCI para predecir mortalidad hospitalaria",
      "Variación de ≥ 2 puntos aguda = criterio de sepsis (Sepsis-3)",
      "Evalúa 6 sistemas: resp., coag., hepático, CV, SNC y renal",
      "Puede calcularse diariamente para monitorizar evolución",
      "No usar en pacientes con enfermedad crónica de órgano",
     ]}
    />

    <button
     onClick={() =>
      setSofa({ resp: 0, coag: 0, liver: 0, cv: 0, cns: 0, renal: 0 })
     }
     className="w-full py-3.5 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 border-2 border-slate-100 rounded-xl hover:border-red-200 transition-all hover:bg-red-50/30 "
    >
     Reiniciar
    </button>
   </div>
  </div>
 );
}

// ─── APACHE II ────────────────────────────────────────────────────────────────

function APACHEIIScore() {
 const [gcsActual, setGcsActual] = useState(15);
 const [age, setAge] = useState(0);
 const [chronic, setChronic] = useState(0);
 const gcsPoints = 15 - gcsActual;

 // ... getMortality will be defined later to access 'total'

 const physioVars = [
  {
   name: "Temperatura rectal (°C)",
   options: [
    { p: 4, label: "≥41" },
    { p: 3, label: "39-40.9" },
    { p: 1, label: "38.5-38.9" },
    { p: 0, label: "36-38.4" },
    { p: 1, label: "34-35.9" },
    { p: 2, label: "32-33.9" },
    { p: 3, label: "30-31.9" },
    { p: 4, label: "<30" },
   ],
  },
  {
   name: "PAM (mmHg)",
   options: [
    { p: 4, label: "≥160" },
    { p: 3, label: "130-159" },
    { p: 2, label: "110-129" },
    { p: 0, label: "70-109" },
    { p: 2, label: "50-69" },
    { p: 4, label: "<50" },
   ],
  },
  {
   name: "FC (lpm)",
   options: [
    { p: 4, label: "≥180" },
    { p: 3, label: "140-179" },
    { p: 2, label: "110-139" },
    { p: 0, label: "70-109" },
    { p: 2, label: "55-69" },
    { p: 3, label: "40-54" },
    { p: 4, label: "<40" },
   ],
  },
  {
   name: "FR (rpm)",
   options: [
    { p: 4, label: "≥50" },
    { p: 3, label: "35-49" },
    { p: 1, label: "25-34" },
    { p: 0, label: "12-24" },
    { p: 1, label: "10-11" },
    { p: 2, label: "6-9" },
    { p: 4, label: "<4" },
   ],
  },
  {
   name: "PaO₂ o AaDO₂",
   options: [
    { p: 4, label: "AaDO₂ >500 (FiO₂≥.5)" },
    { p: 3, label: "AaDO₂ 350-499 (FiO₂≥.5)" },
    { p: 2, label: "AaDO₂ 200-349 (FiO₂≥.5)" },
    { p: 0, label: "AaDO₂ <200 o PaO₂ >70" },
    { p: 1, label: "PaO₂ 61-70" },
    { p: 3, label: "PaO₂ 55-60" },
    { p: 4, label: "PaO₂ <55" },
   ],
  },
  {
   name: "pH arterial",
   options: [
    { p: 4, label: "≥7.7" },
    { p: 3, label: "7.6-7.69" },
    { p: 1, label: "7.5-7.59" },
    { p: 0, label: "7.33-7.49" },
    { p: 2, label: "7.25-7.32" },
    { p: 3, label: "7.15-7.24" },
    { p: 4, label: "<7.15" },
   ],
  },
  {
   name: "Na⁺ sérico (mEq/L)",
   options: [
    { p: 4, label: "≥180" },
    { p: 3, label: "160-179" },
    { p: 2, label: "155-159" },
    { p: 1, label: "150-154" },
    { p: 0, label: "130-149" },
    { p: 2, label: "120-129" },
    { p: 3, label: "111-119" },
    { p: 4, label: "<111" },
   ],
  },
  {
   name: "K⁺ sérico (mEq/L)",
   options: [
    { p: 4, label: "≥7" },
    { p: 3, label: "6-6.9" },
    { p: 1, label: "5.5-5.9" },
    { p: 0, label: "3.5-5.4" },
    { p: 1, label: "3-3.4" },
    { p: 2, label: "2.5-2.9" },
    { p: 4, label: "<2.5" },
   ],
  },
  {
   name: "Creatinina (mg/dL)",
   options: [
    { p: 4, label: "≥3.5" },
    { p: 3, label: "2-3.4" },
    { p: 2, label: "1.5-1.9" },
    { p: 0, label: "0.6-1.4" },
    { p: 2, label: "<0.6" },
   ],
  },
  {
   name: "Hematocrito (%)",
   options: [
    { p: 4, label: "≥60" },
    { p: 2, label: "50-59.9" },
    { p: 1, label: "46-49.9" },
    { p: 0, label: "30-45.9" },
    { p: 2, label: "20-29.9" },
    { p: 4, label: "<20" },
   ],
  },
  {
   name: "Leucocitos (×1000/mm³)",
   options: [
    { p: 4, label: "≥40" },
    { p: 2, label: "20-39.9" },
    { p: 1, label: "15-19.9" },
    { p: 0, label: "3-14.9" },
    { p: 2, label: "1-2.9" },
    { p: 4, label: "<1" },
   ],
  },
 ];

 const [selectedPhysio, setSelectedPhysio] = useState<Record<number, number>>(
  {}
 );
 const physioPoints = Object.values(selectedPhysio).reduce((a, b) => a + b, 0);
 const total = physioPoints + age + chronic + gcsPoints;

 const getMortality = () => {
  if (total < 5) return "< 5%";
  if (total < 10) return "~8%";
  if (total < 15) return "~15%";
  if (total < 20) return "~25%";
  if (total < 25) return "~40%";
  if (total < 30) return "~55%";
  if (total < 35) return "~70%";
  return "> 85%";
 };

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 space-y-6">
    <div className="rounded-xl border-2 border-slate-100 overflow-hidden bg-white shadow-sm">
     <div className="bg-slate-50/50 px-6 py-5 border-b-2 border-slate-100">
      <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-900 ">
       Variables fisiológicas — Referencia rápida
      </p>
      <p className="text-[10px] text-slate-400 font-sans font-medium mt-1 ">
       Selecciona el valor más alterado en las primeras 24h
      </p>
     </div>
     <div className="divide-y-2 divide-slate-50 overflow-auto max-h-[500px]">
      {physioVars.map((v, i) => (
       <div key={i} className="px-6 py-5 space-y-4">
        <p className="text-[11px] font-sans font-bold text-slate-800 uppercase tracking-tight ">
         {i + 1}. {v.name}
        </p>
        <div className="flex flex-wrap gap-2">
         {v.options.map((opt, idx) => (
          <button
           key={idx}
           onClick={() =>
            setSelectedPhysio(prev => ({ ...prev, [i]: opt.p }))
           }
           className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-bold border-2 transition-all font-sans ",
            selectedPhysio[i] === opt.p
             ? "bg-amber-500 border-transparent text-white shadow-xl shadow-amber-500/20 scale-105"
             : "bg-slate-50/50 border-slate-100 text-slate-500 hover:border-slate-300"
           )}
          >
           {opt.label} ({opt.p >= 0 ? `+${opt.p}` : opt.p})
          </button>
         ))}
        </div>
       </div>
      ))}
     </div>
     <div className="bg-amber-500/5 px-6 py-5 border-t-2 border-amber-500/10 flex justify-between items-center">
      <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-amber-700 ">
       Subtotal Fisiológico
      </span>
      <span className="text-2xl font-sans font-bold text-amber-600 tracking-tighter">
       {physioPoints} pts
      </span>
     </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
     <div className="space-y-4">
      <Label className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-900 px-2">
       GCS actual
      </Label>
      <div className="p-8 rounded-xl bg-indigo-50/50 border-2 border-indigo-100 shadow-sm space-y-4">
       <Input
        type="number"
        min={3}
        max={15}
        value={gcsActual}
        onChange={e =>
         setGcsActual(
          Math.min(15, Math.max(3, parseInt(e.target.value) || 15))
         )
        }
        className="h-12 rounded-xl border-2 border-indigo-200 bg-white font-black text-lg text-center"
       />
       <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest text-center">
        Puntos GCS = 15 − {gcsActual} = {gcsPoints}
       </p>
      </div>
     </div>

     <ScoreSelector
      label="Puntos por edad"
      color="amber"
      options={[
       { p: 0, label: "< 44 años" },
       { p: 2, label: "45–54 años" },
       { p: 3, label: "55–64 años" },
       { p: 5, label: "65–74 años" },
       { p: 6, label: "≥ 75 años" },
      ]}
      current={age}
      onSelect={setAge}
     />

     <ScoreSelector
      label="Salud crónica"
      sublabel="Inmunocomp., cirrosis, EPOC severo, ICC IV, IRC diálisis"
      color="red"
      options={[
       { p: 0, label: "Sin comorbilidades relevantes" },
       { p: 2, label: "Enf. crónica + cirugía electiva" },
       { p: 5, label: "Enf. crónica + urgencia o no quirúrgico" },
      ]}
      current={chronic}
      onSelect={setChronic}
     />
    </div>
   </div>

   <div className="lg:col-span-4 space-y-4">
    <ResultCard
     score={total}
     label="APACHE II Total"
     color="amber"
     interpretation="Gravedad al ingreso UCI"
     ranges={[
      { range: "< 10", label: "< 10% mort.", color: "text-emerald-600" },
      { range: "10–19", label: "~15–25%", color: "text-yellow-600" },
      { range: "20–29", label: "~40–55%", color: "text-orange-600" },
      { range: "≥ 30", label: "> 70%", color: "text-red-600" },
     ]}
    />

    <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 space-y-4 shadow-sm shadow-amber-500/5">
     <p className="text-xs font-black uppercase tracking-widest text-amber-600 ">
      Desglose Técnico
     </p>
     <div className="space-y-2 text-xs text-slate-600">
      <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
       <span>Fisiológico</span>
       <strong className="text-slate-900">{physioPoints} pts</strong>
      </div>
      <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
       <span>Déficit GCS</span>
       <strong className="text-slate-900">{gcsPoints} pts</strong>
      </div>
      <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
       <span>Factor Edad</span>
       <strong className="text-slate-900">{age} pts</strong>
      </div>
      <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
       <span>Salud Crónica</span>
       <strong className="text-slate-900">{chronic} pts</strong>
      </div>
      <div className="flex justify-between items-center pt-2 font-black text-amber-700 text-sm">
       <span>Total General</span>
       <span>{total} pts</span>
      </div>
     </div>
    </div>

    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
     <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
      Mortalidad estimada
     </p>
     <p className="text-xl font-black text-amber-600">{getMortality()}</p>
    </div>

    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
     <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">
      qSOFA (Sepsis)
     </p>
     <p className="text-xs text-slate-600">
      SOFA ≥ 2 + sospecha infección = <strong>SEPSIS</strong>
     </p>
     <p className="text-xs text-slate-600 mt-1">
      SOFA ≥ 2 + vasopresores + lactato {">"} 2 ={" "}
      <strong>SHOCK SÉPTICO</strong>
     </p>
    </div>

    <InfoBox
     title="Acerca del APACHE II"
     items={[
      "Rango: 0–71 puntos (máximo teórico)",
      "Diseñado para evaluar gravedad en las primeras 24h de ingreso UCI",
      "No usar para seguimiento diario (usar SOFA para eso)",
      "Puede subestimar mortalidad en patologías específicas (trauma, quemados)",
      "Considerar siempre en conjunto con juicio clínico",
     ]}
    />

    <button
     onClick={() => {
      setSelectedPhysio({});
      setGcsActual(15);
      setAge(0);
      setChronic(0);
     }}
     className="w-full py-2 text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 rounded-xl hover:border-red-200 transition-colors"
    >
     Reiniciar
    </button>
   </div>
  </div>
 );
}

// ─── Murray LIS ───────────────────────────────────────────────────────────────

function MurrayScore() {
 const [murray, setMurray] = useState({
  cxr: 0,
  pafi: 0,
  peep: 0,
  compliance: 0,
 });
 const total =
  Object.values(murray).reduce((a: number, b: number) => a + b, 0) / 4;
 const totalStr = total.toFixed(2);

 const getSeverity = () => {
  if (total === 0) return { label: "Sin lesión", color: "text-emerald-600" };
  if (total <= 1) return { label: "Lesión leve", color: "text-yellow-600" };
  if (total <= 2.5)
   return { label: "Lesión moderada", color: "text-orange-600" };
  return { label: "SDRA severo", color: "text-red-600" };
 };

 const severity = getSeverity();

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
    <ScoreSelector
     label="Infiltrados en Rx tórax"
     sublabel="Cuadrantes comprometidos"
     color="cyan"
     options={[
      { p: 0, label: "Sin infiltrados" },
      { p: 1, label: "1 cuadrante" },
      { p: 2, label: "2 cuadrantes" },
      { p: 3, label: "3 cuadrantes" },
      { p: 4, label: "4 cuadrantes" },
     ]}
     current={murray.cxr}
     onSelect={v => setMurray({ ...murray, cxr: v })}
    />

    <ScoreSelector
     label="Hipoxemia (PaO₂/FiO₂)"
     color="red"
     options={[
      { p: 0, label: "PaFi ≥ 300 mmHg", detail: "Normal" },
      { p: 1, label: "PaFi 225–299 mmHg", detail: "Leve" },
      { p: 2, label: "PaFi 175–224 mmHg", detail: "Moderado" },
      { p: 3, label: "PaFi 100–174 mmHg", detail: "Grave" },
      { p: 4, label: "PaFi < 100 mmHg", detail: "Crítico" },
     ]}
     current={murray.pafi}
     onSelect={v => setMurray({ ...murray, pafi: v })}
    />

    <ScoreSelector
     label="PEEP (cmH₂O)"
     color="violet"
     options={[
      { p: 0, label: "≤ 5 cmH₂O" },
      { p: 1, label: "6–8 cmH₂O" },
      { p: 2, label: "9–11 cmH₂O" },
      { p: 3, label: "12–14 cmH₂O" },
      { p: 4, label: "≥ 15 cmH₂O" },
     ]}
     current={murray.peep}
     onSelect={v => setMurray({ ...murray, peep: v })}
    />

    <ScoreSelector
     label="Compliance estática (mL/cmH₂O)"
     color="emerald"
     options={[
      { p: 0, label: "≥ 80 mL/cmH₂O", detail: "Normal" },
      { p: 1, label: "60–79 mL/cmH₂O" },
      { p: 2, label: "40–59 mL/cmH₂O" },
      { p: 3, label: "20–39 mL/cmH₂O" },
      { p: 4, label: "≤ 19 mL/cmH₂O", detail: "Severo" },
     ]}
     current={murray.compliance}
     onSelect={v => setMurray({ ...murray, compliance: v })}
    />
   </div>

   <div className="lg:col-span-4 space-y-4">
    <ResultCard
     score={totalStr}
     label="Murray LIS"
     color="emerald"
     interpretation="Lung Injury Score"
     ranges={[
      { range: "0", label: "Sin lesión", color: "text-emerald-600" },
      { range: "0.1–1", label: "Lesión leve", color: "text-yellow-600" },
      { range: "1.1–2.5", label: "Moderada", color: "text-orange-600" },
      { range: "> 2.5", label: "SDRA severo", color: "text-red-600" },
     ]}
    />

    <div className="rounded-xl border-2 border-slate-200 p-8 text-center bg-white shadow-xl">
     <p className={cn("text-2xl font-sans font-bold tracking-tighter", severity.color)}>
      {severity.label}
     </p>
     <p className="text-[10px] text-slate-400 font-sans font-medium mt-2 ">
      Score {">"} 2.5: considerar ECMO
     </p>
    </div>

    <div className="rounded-xl bg-emerald-50/50 border-2 border-emerald-100 p-8 space-y-4 shadow-sm">
     <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2 ">
      Desglose
     </p>
     {[
      { label: "Rx tórax", v: murray.cxr },
      { label: "PaFi", v: murray.pafi },
      { label: "PEEP", v: murray.peep },
      { label: "Compliance", v: murray.compliance },
     ].map(({ label, v }) => (
      <div
       key={label}
       className="flex justify-between text-[11px] text-slate-600 font-sans font-bold "
      >
       <span className="opacity-60">{label}</span>
       <strong>{v} pts</strong>
      </div>
     ))}
     <div className="flex justify-between text-[11px] font-sans font-bold border-t-2 border-emerald-100 pt-3 uppercase tracking-widest text-emerald-700">
      <span>Promedio</span>
      <span>{totalStr}</span>
     </div>
    </div>

    <InfoBox
     title="Acerca del Murray LIS"
     items={[
      "Lung Injury Score — evalúa severidad del SDRA",
      "Score > 2.5 sugiere SDRA severo y puede indicar criterio ECMO",
      "Combina radiología, oxigenación, PEEP y mecánica pulmonar",
      "Útil para monitorizar progresión del SDRA",
      "No predice mortalidad por sí solo — usar en conjunto con SOFA",
     ]}
    />

    <button
     onClick={() => setMurray({ cxr: 0, pafi: 0, peep: 0, compliance: 0 })}
     className="w-full py-4 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 border-2 border-slate-100 rounded-xl hover:border-red-200 transition-all hover:bg-red-50/30 "
    >
     Reiniciar Murray LIS
    </button>
   </div>
  </div>
 );
}

// ─── RASS ────────────────────────────────────────────────────────────────────

function RASSScore() {
 const [selected, setSelected] = useState<number | null>(null);

 const levels = [
  {
   score: +4,
   label: "Combativo",
   desc: "Violento, peligro inmediato para el personal",
   color: "bg-red-600 text-white",
   tag: "AGITACIÓN",
  },
  {
   score: +3,
   label: "Muy agitado",
   desc: "Tira o arranca tubos o catéteres; agresivo",
   color: "bg-red-500 text-white",
   tag: "",
  },
  {
   score: +2,
   label: "Agitado",
   desc: "Movimientos frecuentes sin propósito; lucha con el ventilador",
   color: "bg-orange-400 text-white",
   tag: "",
  },
  {
   score: +1,
   label: "Inquieto",
   desc: "Ansioso pero movimientos no agresivos o vigorosos",
   color: "bg-yellow-400 text-slate-800",
   tag: "",
  },
  {
   score: 0,
   label: "Alerta y calmado",
   desc: "Espontáneamente alerta; calmado",
   color: "bg-emerald-500 text-white",
   tag: "OBJETIVO",
  },
  {
   score: -1,
   label: "Somnoliento",
   desc: "No completamente alerta, pero tiene apertura ocular sostenida (>10s) a la voz",
   color: "bg-blue-300 text-slate-800",
   tag: "SEDACIÓN",
  },
  {
   score: -2,
   label: "Sedación leve",
   desc: "Apertura ocular breve (<10s) a la voz",
   color: "bg-blue-400 text-white",
   tag: "",
  },
  {
   score: -3,
   label: "Sedación moderada",
   desc: "Movimiento o apertura ocular a la voz (sin contacto visual)",
   color: "bg-blue-500 text-white",
   tag: "",
  },
  {
   score: -4,
   label: "Sedación profunda",
   desc: "Sin respuesta a la voz, pero movimiento o apertura ocular al estímulo físico",
   color: "bg-indigo-600 text-white",
   tag: "",
  },
  {
   score: -5,
   label: "No estimulable",
   desc: "Sin respuesta a la voz o estímulo físico",
   color: "bg-slate-800 text-white",
   tag: "COMA",
  },
 ];

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 space-y-3">
    <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">
     Selecciona el nivel que describe al paciente
    </p>
    {levels.map(level => (
     <button
      key={level.score}
      onClick={() => setSelected(level.score)}
      className={cn(
       "w-full flex items-center gap-5 px-6 py-4 rounded-xl border-2 transition-all text-left font-sans ",
       selected === level.score
        ? "border-transparent shadow-2xl scale-[1.02] " + level.color
        : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
      )}
     >
      <div
       className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner",
        selected === level.score ? "bg-white/20" : level.color
       )}
      >
       {level.score > 0 ? `+${level.score}` : level.score}
      </div>
      <div className="flex-1 min-w-0">
       <div className="flex items-center gap-3">
        <p
         className={cn(
          "text-base font-bold tracking-tight",
          selected === level.score ? "" : "text-slate-700"
         )}
        >
         {level.label}
        </p>
        {level.tag && (
         <Badge className="text-[9px] font-bold tracking-widest px-3 py-0.5 rounded-full border-none shadow-sm capitalize">
          {level.tag.toLowerCase()}
         </Badge>
        )}
       </div>
       <p
        className={cn(
         "text-[11px] mt-1 font-medium",
         selected === level.score ? "opacity-80" : "text-slate-400"
        )}
       >
        {level.desc}
       </p>
      </div>
     </button>
    ))}
   </div>

   <div className="lg:col-span-4 space-y-4">
    <div
     className={cn(
      "rounded-2xl border-2 p-6 text-center space-y-2",
      selected === null
       ? "bg-slate-50 border-slate-200"
       : selected >= 1
        ? "bg-red-50 border-red-200"
        : selected === 0
         ? "bg-emerald-50 border-emerald-200"
         : selected >= -3
          ? "bg-blue-50 border-blue-200"
          : "bg-slate-100 border-slate-300"
     )}
    >
     <p className="text-xs font-black uppercase tracking-wider text-slate-500">
      RASS
     </p>
     <p className="text-4xl font-black tracking-tighter">
      {selected === null ? "–" : selected > 0 ? `+${selected}` : selected}
     </p>
     <p className="text-sm font-bold">
      {selected === null
       ? "Sin selección"
       : levels.find(l => l.score === selected)?.label}
     </p>
    </div>

    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
     <p className="text-xs font-black uppercase tracking-wider text-slate-500">
      Objetivos clínicos
     </p>
     <div className="space-y-1.5 text-xs text-slate-600">
      <p>
       <strong>VM invasiva:</strong> RASS −2 a 0
      </p>
      <p>
       <strong>SDRA grave:</strong> RASS −3 a −2
      </p>
      <p>
       <strong>VMNI:</strong> RASS 0 a −1
      </p>
      <p>
       <strong>Despertar:</strong> intentar RASS ≥ −1
      </p>
     </div>
    </div>

    <InfoBox
     title="Método de evaluación"
     items={[
      "1. Observar al paciente 30 segundos (movimiento espontáneo)",
      "2. Si no hay respuesta: llamar por nombre en voz alta",
      "3. Si no responde: estimulación física (frotación esternal)",
      "Objetivo UCI: RASS 0 o −1 en la mayoría de pacientes",
      "Siempre evaluar RASS antes del CAM-ICU",
     ]}
    />
   </div>
  </div>
 );
}

// ─── CAM-ICU ──────────────────────────────────────────────────────────────────

function CAMICUScore() {
 const [feature1, setFeature1] = useState<boolean | null>(null);
 const [feature2, setFeature2] = useState<boolean | null>(null);
 const [feature3, setFeature3] = useState<boolean | null>(null);
 const [feature4, setFeature4] = useState<boolean | null>(null);

 const isPositive =
  feature1 === true &&
  feature2 === true &&
  (feature3 === true || feature4 === true);
 const isNegative =
  feature1 === false ||
  feature2 === false ||
  (feature3 === false && feature4 === false);
 const isIncomplete = !isPositive && !isNegative;

 const FeatureSelector = ({
  num,
  title,
  desc,
  value,
  onChange,
 }: {
  num: number;
  title: string;
  desc: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
 }) => (
  <div className="rounded-xl border-2 border-slate-100 overflow-hidden bg-white shadow-sm">
   <div className="bg-slate-50/50 px-6 py-4 border-b-2 border-slate-50">
    <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 ">
     Característica {num}
    </p>
    <p className="text-sm font-sans font-bold text-slate-800 mt-1 tracking-tight uppercase">{title}</p>
    <p className="text-[11px] text-slate-400 font-sans font-medium mt-1 leading-relaxed">{desc}</p>
   </div>
   <div className="grid grid-cols-2 gap-3 p-6">
    <button
     onClick={() => onChange(true)}
     className={cn(
      "py-3.5 rounded-xl text-[10px] font-sans font-bold border-2 transition-all flex items-center justify-center gap-2 uppercase tracking-widest ",
      value === true
       ? "bg-red-500 border-transparent text-white shadow-xl shadow-red-500/20 scale-[1.03]"
       : "bg-white border-slate-100 text-slate-400 hover:border-red-200"
     )}
    >
     <CheckCircle className="w-3.5 h-3.5" /> Presente
    </button>
    <button
     onClick={() => onChange(false)}
     className={cn(
      "py-3.5 rounded-xl text-[10px] font-sans font-bold border-2 transition-all flex items-center justify-center gap-2 uppercase tracking-widest ",
      value === false
       ? "bg-emerald-500 border-transparent text-white shadow-xl shadow-emerald-500/20 scale-[1.03]"
       : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200"
     )}
    >
     <XCircle className="w-3.5 h-3.5" /> Ausente
    </button>
   </div>
  </div>
 );

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 space-y-4">
    <div className="rounded-xl bg-amber-50/50 border-2 border-amber-200 p-6 shadow-sm">
     <p className="text-[11px] font-sans font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
      ⚠️ Prerrequisito: evaluar solo si RASS ≥ −3. Si RASS −4 o −5, el
      paciente no es evaluable.
     </p>
    </div>

    <FeatureSelector
     num={1}
     title="Inicio agudo o curso fluctuante"
     desc="¿Hay evidencia de cambio agudo en el estado mental respecto al basal? ¿O el comportamiento ha fluctuado durante el día?"
     value={feature1}
     onChange={setFeature1}
    />

    <FeatureSelector
     num={2}
     title="Inatención"
     desc="¿El paciente tiene dificultad para mantener la atención? (Prueba de las letras: decir 'SAVEAHAART' — el paciente debe apretar la mano en cada 'A'. Errores ≥ 3 = positivo)"
     value={feature2}
     onChange={setFeature2}
    />

    <FeatureSelector
     num={3}
     title="Pensamiento desorganizado"
     desc="¿El paciente tiene pensamiento desorganizado o incoherente? (Preguntas sí/no: '¿Flota una piedra en el agua?', '¿Hay peces en el mar?', etc.)"
     value={feature3}
     onChange={setFeature3}
    />

    <FeatureSelector
     num={4}
     title="Nivel de conciencia alterado"
     desc="¿RASS es diferente de 0 en este momento? (Cualquier valor diferente de 'alerta y calmado' = positivo)"
     value={feature4}
     onChange={setFeature4}
    />
   </div>

   <div className="lg:col-span-4 space-y-4">
    <div
     className={cn(
      "rounded-2xl border-2 p-6 text-center space-y-3",
      isPositive
       ? "bg-red-50 border-red-300"
       : isNegative
        ? "bg-emerald-50 border-emerald-300"
        : "bg-slate-50 border-slate-200"
     )}
    >
     <p className="text-xs font-black uppercase tracking-wider text-slate-500">
      CAM-ICU
     </p>
     <div
      className={cn(
       "text-2xl font-black",
       isPositive
        ? "text-red-600"
        : isNegative
         ? "text-emerald-600"
         : "text-slate-400"
      )}
     >
      {isPositive ? "POSITIVO" : isNegative ? "NEGATIVO" : "Incompleto"}
     </div>
     <p
      className={cn(
       "text-sm font-bold",
       isPositive
        ? "text-red-600"
        : isNegative
         ? "text-emerald-600"
         : "text-slate-400"
      )}
     >
      {isPositive
       ? "🔴 DELIRIUM presente"
       : isNegative
        ? "✅ Sin delirium"
        : "Completar evaluación"}
     </p>
    </div>

    <div className="rounded-xl bg-slate-50/50 border-2 border-slate-100 p-6 shadow-sm">
     <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ">
      Criterio diagnóstico
     </p>
     <p className="text-[11px] text-slate-600 font-sans font-bold ">
      CAM-ICU (+) = <strong>Car. 1 + Car. 2 + (Car. 3 o Car. 4)</strong>
     </p>
    </div>

    <InfoBox
     title="Tipos de delirium"
     items={[
      "Hiperactivo: agitación, intentos de retirar tubos (RASS positivo)",
      "Hipoactivo: letargia, falta de respuesta (RASS negativo) — más frecuente y peor pronóstico",
      "Mixto: fluctúa entre ambos",
      "El delirium aumenta mortalidad, estancia y deterioro cognitivo",
      "Tratar causa subyacente + estrategias no farmacológicas primero",
     ]}
    />

    <button
     onClick={() => {
      setFeature1(null);
      setFeature2(null);
      setFeature3(null);
      setFeature4(null);
     }}
     className="w-full py-4 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 border-2 border-slate-100 rounded-xl hover:border-red-200 transition-all hover:bg-red-50/30 "
    >
     Reiniciar CAM-ICU
    </button>
   </div>
  </div>
 );
}

// ─── CPIS ─────────────────────────────────────────────────────────────────────

function CPISScore() {
 const [cpis, setCpis] = useState({
  temp: 0,
  leuco: 0,
  secrecion: 0,
  oxigenacion: 0,
  rx: 0,
  cultivo: 0,
 });
 const total = Object.values(cpis).reduce((a: number, b: number) => a + b, 0);

 return (
  <div className="grid lg:grid-cols-12 gap-6">
   <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
    <ScoreSelector
     label="Temperatura (°C)"
     color="red"
     options={[
      { p: 0, label: "36.5 – 38.4 °C" },
      { p: 1, label: "38.5 – 38.9 °C" },
      { p: 2, label: "≤ 36 o ≥ 39 °C" },
     ]}
     current={cpis.temp}
     onSelect={v => setCpis({ ...cpis, temp: v })}
    />

    <ScoreSelector
     label="Leucocitos (×10³/µL)"
     color="amber"
     options={[
      { p: 0, label: "4.000 – 11.000" },
      { p: 1, label: "< 4.000 o > 11.000" },
      { p: 2, label: "< 4.000 o > 11.000 + cayados ≥ 50%" },
     ]}
     current={cpis.leuco}
     onSelect={v => setCpis({ ...cpis, leuco: v })}
    />

    <ScoreSelector
     label="Secreción traqueal"
     color="violet"
     options={[
      { p: 0, label: "Sin secreción" },
      { p: 1, label: "Secreción no purulenta" },
      { p: 2, label: "Secreción purulenta" },
     ]}
     current={cpis.secrecion}
     onSelect={v => setCpis({ ...cpis, secrecion: v })}
    />

    <ScoreSelector
     label="Oxigenación (PaO₂/FiO₂)"
     color="cyan"
     options={[
      { p: 0, label: "> 240 o SDRA" },
      { p: 2, label: "≤ 240 sin SDRA" },
     ]}
     current={cpis.oxigenacion}
     onSelect={v => setCpis({ ...cpis, oxigenacion: v })}
    />

    <ScoreSelector
     label="Radiografía de tórax"
     color="blue"
     options={[
      { p: 0, label: "Sin infiltrados" },
      { p: 1, label: "Infiltrados difusos" },
      { p: 2, label: "Infiltrados localizados" },
     ]}
     current={cpis.rx}
     onSelect={v => setCpis({ ...cpis, rx: v })}
    />

    <ScoreSelector
     label="Cultivo traqueal"
     color="emerald"
     options={[
      { p: 0, label: "Escaso crecimiento o negativo" },
      { p: 1, label: "Crecimiento moderado/alto" },
      { p: 2, label: "Mismo microorganismo en Gram" },
     ]}
     current={cpis.cultivo}
     onSelect={v => setCpis({ ...cpis, cultivo: v })}
    />
   </div>

   <div className="lg:col-span-4 space-y-4">
    <ResultCard
     score={total}
     label="CPIS"
     color="violet"
     interpretation="Clinical Pulmonary Infection Score"
     ranges={[
      {
       range: "< 6",
       label: "NAV improbable",
       color: "text-emerald-600",
      },
      { range: "≥ 6", label: "NAV probable", color: "text-red-600" },
     ]}
    />

    <div className="rounded-xl bg-violet-50/50 border-2 border-violet-100 p-8 shadow-sm">
     <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-violet-600 mb-4 ">
      Interpretación Clínica
     </p>
     <p
      className={cn(
       "text-2xl font-sans font-bold tracking-tighter mb-2",
       total >= 6 ? "text-red-600" : "text-emerald-600"
      )}
     >
      {total >= 6 ? "🔴 NAV probable" : "✅ NAV improbable"}
     </p>
     <p className="text-[10px] text-slate-400 font-sans font-medium ">
      NAV = Neumonía asociada al ventilador
     </p>
    </div>

    <InfoBox
     title="Acerca del CPIS"
     items={[
      "Diagnóstico clínico de neumonía asociada a ventilador (NAV)",
      "Score ≥ 6 tiene sensibilidad ~72% y especificidad ~85%",
      "Útil para iniciar o desescalar antibióticos en UCI",
      "Puede repetirse a las 72h para evaluar respuesta al tratamiento",
      "No reemplaza al diagnóstico microbiológico",
     ]}
    />

    <button
     onClick={() =>
      setCpis({
       temp: 0,
       leuco: 0,
       secrecion: 0,
       oxigenacion: 0,
       rx: 0,
       cultivo: 0,
      })
     }
     className="w-full py-4 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 border-2 border-slate-100 rounded-xl hover:border-red-200 transition-all hover:bg-red-50/30 "
    >
     Reiniciar CPIS
    </button>
   </div>
  </div>
 );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SCORES = [
 {
  id: "sofa",
  label: "SOFA",
  icon: "🫀",
  desc: "Falla orgánica múltiple",
  component: SOFAScore,
 },
 {
  id: "apache",
  label: "APACHE II",
  icon: "📊",
  desc: "Gravedad al ingreso",
  component: APACHEIIScore,
 },
 {
  id: "murray",
  label: "Murray LIS",
  icon: "🫁",
  desc: "Lesión pulmonar / SDRA",
  component: MurrayScore,
 },
 {
  id: "rass",
  label: "RASS",
  icon: "🧠",
  desc: "Sedación y agitación",
  component: RASSScore,
 },
 {
  id: "camicu",
  label: "CAM-ICU",
  icon: "⚠️",
  desc: "Delirium en UCI",
  component: CAMICUScore,
 },
 {
  id: "cpis",
  label: "CPIS",
  icon: "🦠",
  desc: "Neumonía asociada a VM",
  component: CPISScore,
 },
];

export default function UCIScores() {
 const [selected, setSelected] = useState("sofa");
 const ActiveComponent =
  SCORES.find(s => s.id === selected)?.component ?? SOFAScore;

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
       <Calculator className="h-8 w-8" />
      </div>
      <div>
       <h1 className="text-2xl font-sans font-bold text-primary-foreground tracking-tighter uppercase leading-none">
        Scores y Escalas <span className="text-blue-400">UCI</span>
       </h1>
       <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
        Evaluación clínica objetiva y estratificación de riesgo
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-8 space-y-10 w-full">
    <Tabs
     defaultValue="sofa"
     className="space-y-10"
     value={selected}
     onValueChange={setSelected}
    >
     <div className="flex justify-center">
      <TabsList className="bg-white border-2 border-slate-100 p-1.5 rounded-xl h-auto shadow-sm">
       {SCORES.map(t => (
        <TabsTrigger
         key={t.id}
         value={t.id}
         className="rounded-xl px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-sans font-bold text-[10px] uppercase tracking-widest flex items-center gap-3"
        >
         <span className="text-base">{t.icon}</span> {t.label}
        </TabsTrigger>
       ))}
      </TabsList>
     </div>

     <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden relative border-t-8 border-t-indigo-600">
      <CardContent className="p-10">
       <TabsContent value="sofa">
        <SOFAScore />
       </TabsContent>
       <TabsContent value="apache">
        <APACHEIIScore />
       </TabsContent>
       <TabsContent value="murray">
        <MurrayScore />
       </TabsContent>
       <TabsContent value="rass">
        <RASSScore />
       </TabsContent>
       <TabsContent value="camicu">
        <CAMICUScore />
       </TabsContent>
       <TabsContent value="cpis">
        <CPISScore />
       </TabsContent>
      </CardContent>
     </Card>
    </Tabs>
   </div>
  </div>
 );
}
