import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, FlaskConical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
 ReferenceLine,
} from "recharts";

interface Patient {
 id: string;
 name: string;
 initials: string | null;
}

interface ABGRecord {
 id: string;
 record_date: string;
 ph: number | null;
 paco2: number | null;
 pao2: number | null;
 hco3: number | null;
 lactate: number | null;
 pf_ratio: number | null;
 base_excess: number | null;
 sao2: number | null;
}

const PARAM_CONFIG = [
 {
  key: "ph",
  label: "pH",
  color: "hsl(var(--primary))",
  refMin: 7.35,
  refMax: 7.45,
 },
 {
  key: "paco2",
  label: "PaCO₂ (mmHg)",
  color: "hsl(var(--destructive))",
  refMin: 35,
  refMax: 45,
 },
 {
  key: "pao2",
  label: "PaO₂ (mmHg)",
  color: "hsl(var(--accent))",
  refMin: 80,
  refMax: 100,
 },
 {
  key: "hco3",
  label: "HCO₃⁻ (mEq/L)",
  color: "hsl(var(--info))",
  refMin: 22,
  refMax: 26,
 },
 {
  key: "lactate",
  label: "Lactato (mmol/L)",
  color: "hsl(var(--warning))",
  refMin: 0,
  refMax: 2,
 },
 {
  key: "pf_ratio",
  label: "PaO₂/FiO₂",
  color: "hsl(var(--success))",
  refMin: 300,
  refMax: 500,
 },
];

export default function ABGTrends({
 embedded = false,
}: {
 embedded?: boolean;
}) {
 const [patients, setPatients] = useState<Patient[]>([]);
 const [selectedPatient, setSelectedPatient] = useState<string>("");
 const [records, setRecords] = useState<ABGRecord[]>([]);
 const [selectedParam, setSelectedParam] = useState("ph");
 const [loading, setLoading] = useState(false);

 useEffect(() => {
  supabase
   .from("patients")
   .select("id, name, initials")
   .order("name")
   .then(({ data }) => {
    if (data) setPatients(data);
   });
 }, []);

 useEffect(() => {
  if (!selectedPatient) {
   setRecords([]);
   return;
  }
  setLoading(true);
  supabase
   .from("abg_records")
   .select(
    "id, record_date, ph, paco2, pao2, hco3, lactate, pf_ratio, base_excess, sao2"
   )
   .eq("patient_id", selectedPatient)
   .order("record_date", { ascending: true })
   .then(({ data }) => {
    setRecords(data || []);
    setLoading(false);
   });
 }, [selectedPatient]);

 const paramConfig = PARAM_CONFIG.find(p => p.key === selectedParam)!;

 const chartData = records.map(r => ({
  date: new Date(r.record_date).toLocaleDateString("es-ES", {
   day: "2-digit",
   month: "short",
  }),
  value: r[selectedParam as keyof ABGRecord] as number | null,
 }));

 return (
  <div className={embedded ? "" : "min-h-full"}>
   {!embedded && (
    <div className="bg-gradient-hero px-6 py-10">
     <div className="mx-auto max-w-5xl">
      <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
      >
       <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
         <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-foreground">
         Tendencias Gasométricas
        </h1>
       </div>
       <p className="text-sm text-primary-foreground/60">
        Evolución temporal de parámetros de gasometría arterial por
        paciente.
       </p>
      </motion.div>
     </div>
    </div>
   )}

   <div
    className={`mx-auto max-w-5xl ${embedded ? "" : "px-6 py-8"} space-y-6`}
   >
    <div className="flex flex-wrap gap-4">
     <div className="w-64">
      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
       <SelectTrigger>
        <SelectValue placeholder="Seleccionar paciente" />
       </SelectTrigger>
       <SelectContent>
        {patients.map(p => (
         <SelectItem key={p.id} value={p.id}>
          {p.initials || p.name}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>
     </div>
     <div className="w-52">
      <Select value={selectedParam} onValueChange={setSelectedParam}>
       <SelectTrigger>
        <SelectValue />
       </SelectTrigger>
       <SelectContent>
        {PARAM_CONFIG.map(p => (
         <SelectItem key={p.key} value={p.key}>
          {p.label}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>
     </div>
    </div>

    {!selectedPatient ? (
     <Card>
      <CardContent className="p-12 text-center">
       <FlaskConical className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
       <p className="text-sm text-muted-foreground">
        Selecciona un paciente para ver sus tendencias gasométricas.
       </p>
      </CardContent>
     </Card>
    ) : loading ? (
     <Card>
      <CardContent className="p-12 text-center">
       <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </CardContent>
     </Card>
    ) : records.length === 0 ? (
     <Card>
      <CardContent className="p-12 text-center">
       <p className="text-sm text-muted-foreground">
        No hay registros de gasometría para este paciente.
       </p>
      </CardContent>
     </Card>
    ) : (
     <>
      <Card>
       <CardHeader>
        <div className="flex items-center justify-between">
         <CardTitle className="font-display text-lg">
          {paramConfig.label}
         </CardTitle>
         <Badge variant="secondary">{records.length} registros</Badge>
        </div>
       </CardHeader>
       <CardContent>
        <ResponsiveContainer width="100%" height={350}>
         <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
         >
          <CartesianGrid
           strokeDasharray="3 3"
           className="opacity-30"
          />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
          <Tooltip
           contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
           }}
          />
          <ReferenceLine
           y={paramConfig.refMin}
           stroke="hsl(var(--muted-foreground))"
           strokeDasharray="4 4"
           label={{
            value: `Min: ${paramConfig.refMin}`,
            fontSize: 10,
            fill: "hsl(var(--muted-foreground))",
           }}
          />
          <ReferenceLine
           y={paramConfig.refMax}
           stroke="hsl(var(--muted-foreground))"
           strokeDasharray="4 4"
           label={{
            value: `Max: ${paramConfig.refMax}`,
            fontSize: 10,
            fill: "hsl(var(--muted-foreground))",
           }}
          />
          <Line
           type="monotone"
           dataKey="value"
           stroke={paramConfig.color}
           strokeWidth={2}
           dot={{ r: 4, fill: paramConfig.color }}
           activeDot={{ r: 6 }}
           name={paramConfig.label}
           connectNulls
          />
         </LineChart>
        </ResponsiveContainer>
       </CardContent>
      </Card>

      <Card>
       <CardHeader>
        <CardTitle className="font-display text-sm">
         Registros
        </CardTitle>
       </CardHeader>
       <CardContent>
        <div className="overflow-x-auto">
         <table className="w-full text-xs">
          <thead>
           <tr className="border-b">
            <th className="text-left p-2 font-medium">Fecha</th>
            {PARAM_CONFIG.map(p => (
             <th
              key={p.key}
              className="text-center p-2 font-medium"
             >
              {p.label}
             </th>
            ))}
           </tr>
          </thead>
          <tbody>
           {records.map(r => (
            <tr
             key={r.id}
             className="border-b border-border/30 hover:bg-muted/30"
            >
             <td className="p-2 font-mono">
              {new Date(r.record_date).toLocaleDateString(
               "es-ES"
              )}
             </td>
             {PARAM_CONFIG.map(p => {
              const val = r[p.key as keyof ABGRecord] as
               | number
               | null;
              const outOfRange =
               val != null && (val < p.refMin || val > p.refMax);
              return (
               <td
                key={p.key}
                className={`text-center p-2 ${outOfRange ? "text-destructive font-semibold" : ""}`}
               >
                {val != null ? val : "—"}
               </td>
              );
             })}
            </tr>
           ))}
          </tbody>
         </table>
        </div>
       </CardContent>
      </Card>
     </>
    )}
   </div>
  </div>
 );
}
