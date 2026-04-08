import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Activity, Save, Loader2, Camera, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function VMRegistry() {
 const queryClient = useQueryClient();
 const [patientId, setPatientId] = useState("");
 const [mode, setMode] = useState("");
 const [fio2, setFio2] = useState("");
 const [peep, setPeep] = useState("");
 const [vt, setVt] = useState("");
 const [rrVal, setRrVal] = useState("");
 const [ppeak, setPpeak] = useState("");
 const [pplat, setPplat] = useState("");
 const [dp, setDp] = useState("");
 const [compliance, setCompliance] = useState("");
 const [resistance, setResistance] = useState("");
 const [spo2, setSpo2] = useState("");
 const [ph, setPh] = useState("");
 const [pao2, setPao2] = useState("");
 const [paco2, setPaco2] = useState("");
 const [hco3, setHco3] = useState("");
 const [notes, setNotes] = useState("");
 const [isRecognizing, setIsRecognizing] = useState(false);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const cameraInputRef = useRef<HTMLInputElement>(null);

 const { data: patients = [] } = useQuery({
  queryKey: ["patients"],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("patients")
    .select("id, name")
    .order("name");
   if (error) throw error;
   return data;
  },
 });

 const { data: records = [], isLoading } = useQuery({
  queryKey: ["ventilation-records"],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("ventilation_records")
    .select("*, patients(name)")
    .order("created_at", { ascending: false })
    .limit(20);
   if (error) throw error;
   return data;
  },
 });

 const saveMutation = useMutation({
  mutationFn: async () => {
   if (!patientId) throw new Error("Selecciona un paciente");
   const gases: Record<string, string> = {};
   if (ph) gases.ph = ph;
   if (pao2) gases.pao2 = pao2;
   if (paco2) gases.paco2 = paco2;
   if (hco3) gases.hco3 = hco3;

   const { error } = await supabase.from("ventilation_records").insert({
    patient_id: patientId,
    ventilation_mode: mode || null,
    fio2: fio2 ? parseFloat(fio2) : null,
    peep: peep ? parseFloat(peep) : null,
    tidal_volume: vt ? parseFloat(vt) : null,
    respiratory_rate: rrVal ? parseFloat(rrVal) : null,
    peak_pressure: ppeak ? parseFloat(ppeak) : null,
    plateau_pressure: pplat ? parseFloat(pplat) : null,
    driving_pressure: dp ? parseFloat(dp) : null,
    compliance: compliance ? parseFloat(compliance) : null,
    resistance: resistance ? parseFloat(resistance) : null,
    spo2: spo2 ? parseFloat(spo2) : null,
    arterial_gases: Object.keys(gases).length > 0 ? gases : {},
    notes: notes || null,
   });
   if (error) throw error;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["ventilation-records"] });
   toast.success("Registro ventilatorio guardado");
   clearForm();
  },
  onError: (err: Error) => toast.error(err.message),
 });

 const clearForm = () => {
  setMode("");
  setFio2("");
  setPeep("");
  setVt("");
  setRrVal("");
  setPpeak("");
  setPplat("");
  setDp("");
  setCompliance("");
  setResistance("");
  setSpo2("");
  setPh("");
  setPao2("");
  setPaco2("");
  setHco3("");
  setNotes("");
  setPreviewUrl(null);
 };

 const handleImageCapture = async (file: File) => {
  setIsRecognizing(true);
  const url = URL.createObjectURL(file);
  setPreviewUrl(url);

  try {
   const base64 = await fileToBase64(file);

   const { data, error } = await supabase.functions.invoke(
    "recognize-ventilator-params",
    {
     body: { image_base64: base64 },
    }
   );

   if (error) throw new Error(error.message || "Error al analizar imagen");
   if (!data?.success)
    throw new Error(data?.error || "No se pudieron extraer parámetros");

   const p = data.params;

   // Auto-fill fields with recognized values
   if (p.ventilation_mode) {
    const modeMap: Record<string, string> = {
     VCV: "VCV",
     PCV: "PCV",
     PSV: "PSV",
     SIMV: "SIMV",
     CPAP: "CPAP",
     APRV: "APRV",
    };
    const normalized = p.ventilation_mode.toUpperCase();
    if (modeMap[normalized]) setMode(modeMap[normalized]);
   }
   if (p.fio2 != null) setFio2(String(p.fio2));
   if (p.peep != null) setPeep(String(p.peep));
   if (p.tidal_volume != null) setVt(String(p.tidal_volume));
   if (p.respiratory_rate != null) setRrVal(String(p.respiratory_rate));
   if (p.peak_pressure != null) setPpeak(String(p.peak_pressure));
   if (p.plateau_pressure != null) setPplat(String(p.plateau_pressure));
   if (p.driving_pressure != null) setDp(String(p.driving_pressure));
   if (p.compliance != null) setCompliance(String(p.compliance));
   if (p.resistance != null) setResistance(String(p.resistance));
   if (p.spo2 != null) setSpo2(String(p.spo2));
   if (p.ph != null) setPh(String(p.ph));
   if (p.pao2 != null) setPao2(String(p.pao2));
   if (p.paco2 != null) setPaco2(String(p.paco2));
   if (p.hco3 != null) setHco3(String(p.hco3));

   const confidenceMsg =
    p.confidence === "alta"
     ? "Alta"
     : p.confidence === "moderada"
      ? "Moderada"
      : "Baja";
   toast.success(
    `Parámetros extraídos (confianza: ${confidenceMsg}). Revisa y ajusta antes de guardar.`
   );

   if (p.notes) {
    setNotes(prev => (prev ? `${prev}\n${p.notes}` : p.notes));
   }
  } catch (err: any) {
   console.error("Recognition error:", err);
   toast.error(err.message || "Error al reconocer parámetros");
  } finally {
   setIsRecognizing(false);
  }
 };

 const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.onload = () => {
    const result = reader.result as string;
    resolve(result.split(",")[1]);
   };
   reader.onerror = reject;
   reader.readAsDataURL(file);
  });
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) handleImageCapture(file);
  e.target.value = "";
 };

 const formFields = [
  { label: "FiO₂ (%)", value: fio2, set: setFio2 },
  { label: "PEEP (cmH₂O)", value: peep, set: setPeep },
  { label: "Vt (mL)", value: vt, set: setVt },
  { label: "FR (rpm)", value: rrVal, set: setRrVal },
  { label: "P. Pico", value: ppeak, set: setPpeak },
  { label: "P. Plateau", value: pplat, set: setPplat },
  { label: "Driving P.", value: dp, set: setDp },
  { label: "Compliance", value: compliance, set: setCompliance },
  { label: "Resistencia", value: resistance, set: setResistance },
  { label: "SpO₂ (%)", value: spo2, set: setSpo2 },
 ];

 const gasFields = [
  { label: "pH", value: ph, set: setPh },
  { label: "PaO₂", value: pao2, set: setPao2 },
  { label: "PaCO₂", value: paco2, set: setPaco2 },
  { label: "HCO₃⁻", value: hco3, set: setHco3 },
 ];

 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-5xl">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
        <Activity className="h-5 w-5 text-accent-foreground" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Registro de Ventilación Mecánica Invasiva (VMI)
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Registra parámetros ventilatorios y gases arteriales por paciente.
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-5xl px-6 py-8">
    <div className="grid gap-6 lg:grid-cols-2">
     <Card>
      <CardHeader>
       <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-sans">
         Nuevo Registro
        </CardTitle>
        <div className="flex gap-1">
         <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
         />
         <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
         />
         <Button
          variant="outline"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isRecognizing}
          className="gap-1.5 text-xs"
         >
          {isRecognizing ? (
           <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
           <Camera className="h-3.5 w-3.5" />
          )}
          Foto
         </Button>
         <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecognizing}
          className="gap-1.5 text-xs"
         >
          <ImageIcon className="h-3.5 w-3.5" />
          Imagen
         </Button>
        </div>
       </div>
      </CardHeader>
      <CardContent className="space-y-4">
       {previewUrl && (
        <div className="relative rounded-lg overflow-hidden border bg-muted/30">
         <img
          src={previewUrl}
          alt="Ventilador"
          className="w-full max-h-48 object-contain"
         />
         {isRecognizing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analizando imagen...
           </div>
          </div>
         )}
        </div>
       )}

       <div>
        <Label className="text-xs">Paciente</Label>
        <Select value={patientId} onValueChange={setPatientId}>
         <SelectTrigger className="h-8 text-xs mt-1">
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
       </div>
       <div>
        <Label className="text-xs">Modo Ventilatorio</Label>
        <Select value={mode} onValueChange={setMode}>
         <SelectTrigger className="h-8 text-xs mt-1">
          <SelectValue placeholder="Seleccionar" />
         </SelectTrigger>
         <SelectContent>
          {["VCV", "PCV", "PSV", "SIMV", "CPAP", "APRV"].map(m => (
           <SelectItem key={m} value={m}>
            {m}
           </SelectItem>
          ))}
         </SelectContent>
        </Select>
       </div>
       <div className="grid grid-cols-3 gap-2">
        {formFields.map(f => (
         <div key={f.label}>
          <Label className="text-[10px]">{f.label}</Label>
          <Input
           value={f.value}
           onChange={e => f.set(e.target.value)}
           className="h-7 text-xs mt-0.5"
           type="number"
          />
         </div>
        ))}
       </div>
       <div>
        <p className="text-xs font-semibold mb-2">Gases Arteriales</p>
        <div className="grid grid-cols-4 gap-2">
         {gasFields.map(f => (
          <div key={f.label}>
           <Label className="text-[10px]">{f.label}</Label>
           <Input
            value={f.value}
            onChange={e => f.set(e.target.value)}
            className="h-7 text-xs mt-0.5"
           />
          </div>
         ))}
        </div>
       </div>
       <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notas..."
        className="text-xs min-h-[60px]"
       />
       <Button
        onClick={() => saveMutation.mutate()}
        disabled={!patientId || saveMutation.isPending}
        className="w-full gap-2"
       >
        {saveMutation.isPending ? (
         <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
         <Save className="h-4 w-4" />
        )}
        Guardar Registro
       </Button>
      </CardContent>
     </Card>

     <Card>
      <CardHeader>
       <CardTitle className="text-sm font-sans">
        Registros Recientes
       </CardTitle>
      </CardHeader>
      <CardContent>
       {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
       ) : records.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
         Sin registros aún
        </p>
       ) : (
        <div className="space-y-2 max-h-[500px] overflow-auto">
         {records.map((r: any) => (
          <div
           key={r.id}
           className="p-3 rounded-lg border text-xs space-y-1"
          >
           <div className="flex items-center justify-between">
            <span className="font-semibold">
             {r.patients?.name || "—"}
            </span>
            <span className="text-muted-foreground">
             {r.record_date}
            </span>
           </div>
           <div className="flex flex-wrap gap-1">
            {r.ventilation_mode && (
             <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {r.ventilation_mode}
             </span>
            )}
            {r.fio2 && <span>FiO₂: {r.fio2}%</span>}
            {r.peep && <span>PEEP: {r.peep}</span>}
            {r.tidal_volume && <span>Vt: {r.tidal_volume}</span>}
            {r.driving_pressure && (
             <span>DP: {r.driving_pressure}</span>
            )}
            {r.spo2 && <span>SpO₂: {r.spo2}%</span>}
           </div>
          </div>
         ))}
        </div>
       )}
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 );
}
