import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { FileDown, Loader2, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function ReportGenerator() {
 const [selectedPatient, setSelectedPatient] = useState("");
 const [generating, setGenerating] = useState(false);

 const { data: patients = [] } = useQuery({
  queryKey: ["patients"],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("name");
   if (error) throw error;
   return data;
  },
 });

 const { data: lusRecords = [] } = useQuery({
  queryKey: ["lus-report", selectedPatient],
  enabled: !!selectedPatient,
  queryFn: async () => {
   const { data, error } = await supabase
    .from("lung_examinations")
    .select("*")
    .eq("patient_id", selectedPatient)
    .order("exam_date", { ascending: false });
   if (error) throw error;
   return data;
  },
 });

 const { data: vmRecords = [] } = useQuery({
  queryKey: ["vm-report", selectedPatient],
  enabled: !!selectedPatient,
  queryFn: async () => {
   const { data, error } = await supabase
    .from("ventilation_records")
    .select("*")
    .eq("patient_id", selectedPatient)
    .order("record_date", { ascending: false });
   if (error) throw error;
   return data;
  },
 });

 const { data: rxRecords = [] } = useQuery({
  queryKey: ["rx-report", selectedPatient],
  enabled: !!selectedPatient,
  queryFn: async () => {
   const { data, error } = await supabase
    .from("xray_examinations")
    .select("*")
    .eq("patient_id", selectedPatient)
    .order("exam_date", { ascending: false });
   if (error) throw error;
   return data;
  },
 });

 const patient = patients.find(p => p.id === selectedPatient);

 const generatePDF = () => {
  if (!patient) return;
  setGenerating(true);

  const findingsStr = (findings: Record<string, boolean | null> | null) => {
   if (!findings) return "Sin hallazgos registrados";
   return (
    Object.entries(findings)
     .filter(([, v]) => v)
     .map(([k]) => k.replace(/_/g, " "))
     .join(", ") || "Sin hallazgos positivos"
   );
  };

  const now = new Date().toLocaleDateString("es-CL");

  let html = `
   <html><head><meta charset="utf-8">
   <style>
    body { font-family: Arial, sans-serif; padding: 40px; font-size: 12px; color: #333; }
    h1 { color: #1a365d; border-bottom: 2px solid #2c7a7b; padding-bottom: 8px; font-size: 20px; }
    h2 { color: #2c7a7b; margin-top: 24px; font-size: 14px; }
    h3 { font-size: 12px; margin-top: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .patient-info { background: #f7fafc; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
    .patient-info span { margin-right: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; font-size: 11px; }
    th { background: #edf2f7; font-weight: 600; }
    .disclaimer { margin-top: 30px; padding: 10px; background: #fffbeb; border: 1px solid #f6e05e; border-radius: 4px; font-size: 10px; }
    .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #a0aec0; }
    @media print { body { padding: 20px; } }
   </style></head><body>
   <div class="header">
    <h1>🩺 Resp Academy — Informe Clínico</h1>
    <span>Fecha: ${now}</span>
   </div>
   <div class="patient-info">
    <strong>Paciente:</strong> <span>${patient.name}</span>
    ${patient.age ? `<span>Edad: ${patient.age}</span>` : ""}
    ${patient.sex ? `<span>Sexo: ${patient.sex}</span>` : ""}
    ${patient.height ? `<span>Talla: ${patient.height} cm</span>` : ""}
    ${patient.weight ? `<span>Peso: ${patient.weight} kg</span>` : ""}
    ${patient.external_id ? `<span>ID: ${patient.external_id}</span>` : ""}
   </div>
  `;

  if (lusRecords.length > 0) {
   html += `<h2>Ultrasonido Pulmonar (${lusRecords.length} evaluaciones)</h2><table><tr><th>Fecha</th><th>Pulmón</th><th>Zona</th><th>Score</th><th>Hallazgos</th><th>Notas</th></tr>`;
   lusRecords.forEach(r => {
    html += `<tr><td>${r.exam_date}</td><td>${r.lung_side || "—"}</td><td>${r.zone || "—"}</td><td>${r.lus_total ?? "—"}</td><td>${findingsStr(r.findings as any)}</td><td>${r.notes || "—"}</td></tr>`;
   });
   html += `</table>`;
  }

  if (vmRecords.length > 0) {
   html += `<h2>Ventilación Mecánica (${vmRecords.length} registros)</h2><table><tr><th>Fecha</th><th>Modo</th><th>FiO₂</th><th>PEEP</th><th>Vt</th><th>FR</th><th>Ppico</th><th>Pplat</th><th>DP</th><th>Compliance</th><th>SpO₂</th></tr>`;
   vmRecords.forEach((r: any) => {
    html += `<tr><td>${r.record_date}</td><td>${r.ventilation_mode || "—"}</td><td>${r.fio2 ?? "—"}</td><td>${r.peep ?? "—"}</td><td>${r.tidal_volume ?? "—"}</td><td>${r.respiratory_rate ?? "—"}</td><td>${r.peak_pressure ?? "—"}</td><td>${r.plateau_pressure ?? "—"}</td><td>${r.driving_pressure ?? "—"}</td><td>${r.compliance ?? "—"}</td><td>${r.spo2 ?? "—"}</td></tr>`;
   });
   html += `</table>`;
  }

  if (rxRecords.length > 0) {
   html += `<h2>Radiografía de Tórax (${rxRecords.length} estudios)</h2><table><tr><th>Fecha</th><th>Tipo</th><th>Calidad</th><th>Hallazgos</th><th>Notas</th></tr>`;
   rxRecords.forEach((r: any) => {
    html += `<tr><td>${r.exam_date}</td><td>${(r.xray_type || "—").toUpperCase()}</td><td>${r.technical_quality || "—"}</td><td>${findingsStr(r.findings)}</td><td>${r.notes || "—"}</td></tr>`;
   });
   html += `</table>`;
  }

  html += `
   <div class="disclaimer">
    ⚠️ <strong>Aviso:</strong> Este informe es generado como herramienta de apoyo clínico y educativo.
    Las interpretaciones automáticas no reemplazan el juicio clínico del profesional responsable.
   </div>
   <div class="footer">Resp Academy — Plataforma de Evaluación Respiratoria Multimodal</div>
   </body></html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
   printWindow.document.write(html);
   printWindow.document.close();
   setTimeout(() => {
    printWindow.print();
    setGenerating(false);
   }, 500);
  } else {
   toast.error("No se pudo abrir la ventana de impresión");
   setGenerating(false);
  }
 };

 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-4xl">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
        <FileDown className="h-5 w-5 text-accent-foreground" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Informe Clínico
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Genera informes PDF con datos multimodales del paciente.
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-4xl px-6 py-8">
    <Card>
     <CardHeader>
      <CardTitle className="text-sm font-display">
       Generar Informe
      </CardTitle>
     </CardHeader>
     <CardContent className="space-y-4">
      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
       <SelectTrigger className="max-w-xs">
        <SelectValue placeholder="Seleccionar paciente" />
       </SelectTrigger>
       <SelectContent>
        {patients.map(p => (
         <SelectItem key={p.id} value={p.id}>
          {p.name}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>

      {selectedPatient && patient && (
       <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
         <div className="p-3 rounded-lg border text-center">
          <Stethoscope className="h-4 w-4 mx-auto mb-1 text-primary" />
          <p className="text-lg font-bold">{lusRecords.length}</p>
          <p className="text-[10px] text-muted-foreground">
           Ecografías
          </p>
         </div>
         <div className="p-3 rounded-lg border text-center">
          <p className="text-lg font-bold">{vmRecords.length}</p>
          <p className="text-[10px] text-muted-foreground">
           Registros VM
          </p>
         </div>
         <div className="p-3 rounded-lg border text-center">
          <p className="text-lg font-bold">{rxRecords.length}</p>
          <p className="text-[10px] text-muted-foreground">
           Radiografías
          </p>
         </div>
        </div>

        <Button
         onClick={generatePDF}
         disabled={generating}
         className="w-full gap-2"
        >
         {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
          <FileDown className="h-4 w-4" />
         )}
         Generar e Imprimir PDF
        </Button>
       </div>
      )}
     </CardContent>
    </Card>

    <div className="mt-6 rounded-lg bg-warning/5 border border-warning/20 p-4">
     <p className="text-xs text-muted-foreground">
      <strong className="text-warning">⚠️</strong> El informe incluye
      todas las modalidades registradas (LUS, VM, RX) y se abre en una
      ventana de impresión para exportar como PDF.
     </p>
    </div>
   </div>
  </div>
 );
}
