import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Wind, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type NIVMode = "CPAP" | "BiPAP" | "BiPAP-ST" | "AVAPS";

export default function NIVRegistry() {
 const queryClient = useQueryClient();
 const [patientId, setPatientId] = useState("");
 const [mode, setMode] = useState<NIVMode>("CPAP");

 // Parametros comunes
 const [fio2, setFio2] = useState("");
 const [spo2, setSpo2] = useState("");
 const [epap, setEpap] = useState("");

 // Parametros especificos
 const [ipap, setIpap] = useState("");
 const [ipapMin, setIpapMin] = useState("");
 const [ipapMax, setIpapMax] = useState("");
 const [rrEspontanea, setRrEspontanea] = useState("");
 const [rrRespaldo, setRrRespaldo] = useState("");
 const [ti, setTi] = useState("");
 const [vtObjetivo, setVtObjetivo] = useState("");

 // Gases arteriales
 const [ph, setPh] = useState("");
 const [pao2, setPao2] = useState("");
 const [paco2, setPaco2] = useState("");
 const [hco3, setHco3] = useState("");

 const [notes, setNotes] = useState("");

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
  queryKey: ["niv-records"],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("ventilation_records")
    .select("*, patients(name)")
    .eq("is_niv", true)
    .order("created_at", { ascending: false })
    .limit(10);
   if (error) throw error;
   return data;
  },
 });

 const saveMutation = useMutation({
  mutationFn: async () => {
   if (!patientId) throw new Error("Selecciona un paciente");

   const gases = { ph, pao2, paco2, hco3 };

   // Construir metadatos segun el modo
   const metadata: any = { mode };
   if (mode === "CPAP") {
    metadata.rr_espontanea = rrEspontanea;
   } else if (mode === "BiPAP" || mode === "BiPAP-ST") {
    metadata.ipap = ipap;
    metadata.rr_respaldo = rrRespaldo;
    metadata.ti = ti;
   } else if (mode === "AVAPS") {
    metadata.ipap_min = ipapMin;
    metadata.ipap_max = ipapMax;
    metadata.vt_objetivo = vtObjetivo;
   }

   const { error } = await supabase.from("ventilation_records").insert({
    patient_id: patientId,
    ventilation_mode: mode,
    is_niv: true,
    fio2: fio2 ? parseFloat(fio2) : null,
    peep: epap ? parseFloat(epap) : null, // Mapeamos EPAP a PEEP para compatibilidad
    spo2: spo2 ? parseFloat(spo2) : null,
    arterial_gases: gases,
    notes: notes || null,
    metadata: metadata,
   });
   if (error) throw error;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["niv-records"] });
   toast.success("Registro guardado");
   clearForm();
  },
  onError: (err: Error) => toast.error(err.message),
 });

 const clearForm = () => {
  setFio2("");
  setSpo2("");
  setEpap("");
  setIpap("");
  setIpapMin("");
  setIpapMax("");
  setRrEspontanea("");
  setRrRespaldo("");
  setTi("");
  setVtObjetivo("");
  setPh("");
  setPao2("");
  setPaco2("");
  setHco3("");
  setNotes("");
 };

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
        <Wind className="h-5 w-5 text-accent-foreground" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Registro de Ventilación No Invasiva (VMNI)
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Registra parámetros de ventilación no invasiva (CPAP, BiPAP,
       AVAPS).
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-5xl px-6 py-8">
    <div className="grid gap-6 lg:grid-cols-2">
     <Card>
      <CardHeader>
       <CardTitle className="text-sm font-sans">
        Nuevo Registro
       </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
        <div>
         <Label className="text-xs text-muted-foreground mb-1 block">
          Paciente
         </Label>
         <Select value={patientId} onValueChange={setPatientId}>
          <SelectTrigger className="h-9 text-xs">
           <SelectValue placeholder="Seleccionar" />
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
         <Label className="text-xs text-muted-foreground mb-1 block">
          Modo VMNI
         </Label>
         <Select
          value={mode}
          onValueChange={(v: NIVMode) => setMode(v)}
         >
          <SelectTrigger className="h-9 text-xs font-semibold">
           <SelectValue placeholder="Modo" />
          </SelectTrigger>
          <SelectContent>
           {["CPAP", "BiPAP", "BiPAP-ST", "AVAPS"].map(m => (
            <SelectItem key={m} value={m}>
             {m}
            </SelectItem>
           ))}
          </SelectContent>
         </Select>
        </div>
       </div>

       <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="space-y-1">
         <Label className="text-[10px] uppercase text-muted-foreground">
          FiO₂ (%)
         </Label>
         <Input
          value={fio2}
          onChange={e => setFio2(e.target.value)}
          type="number"
          className="h-8 text-xs"
         />
        </div>
        <div className="space-y-1">
         <Label className="text-[10px] uppercase text-muted-foreground">
          EPAP (cmH₂O)
         </Label>
         <Input
          value={epap}
          onChange={e => setEpap(e.target.value)}
          type="number"
          className="h-8 text-xs font-bold text-primary"
         />
        </div>
        <div className="space-y-1">
         <Label className="text-[10px] uppercase text-muted-foreground">
          SpO₂ (%)
         </Label>
         <Input
          value={spo2}
          onChange={e => setSpo2(e.target.value)}
          type="number"
          className="h-8 text-xs"
         />
        </div>
       </div>

       {/* Campos Dinámicos */}
       <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/20">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3 px-1">
         Parámetros de {mode}
        </p>
        <div className="grid grid-cols-2 gap-3">
         {mode === "CPAP" && (
          <div className="space-y-1">
           <Label className="text-[10px] uppercase text-muted-foreground">
            FR espontánea (rpm)
           </Label>
           <Input
            value={rrEspontanea}
            onChange={e => setRrEspontanea(e.target.value)}
            type="number"
            className="h-8 text-xs"
           />
          </div>
         )}

         {(mode === "BiPAP" || mode === "BiPAP-ST") && (
          <>
           <div className="space-y-1">
            <Label className="text-[10px] uppercase text-muted-foreground">
             IPAP (cmH₂O)
            </Label>
            <Input
             value={ipap}
             onChange={e => setIpap(e.target.value)}
             type="number"
             className="h-8 text-xs font-bold text-accent"
            />
           </div>
           <div className="space-y-1">
            <Label className="text-[10px] uppercase text-muted-foreground">
             FR de respaldo (rpm)
            </Label>
            <Input
             value={rrRespaldo}
             onChange={e => setRrRespaldo(e.target.value)}
             type="number"
             className="h-8 text-xs"
            />
           </div>
           <div className="space-y-1">
            <Label className="text-[10px] uppercase text-muted-foreground">
             Ti (s)
            </Label>
            <Input
             value={ti}
             onChange={e => setTi(e.target.value)}
             type="number"
             step="0.1"
             className="h-8 text-xs"
            />
           </div>
          </>
         )}

         {mode === "AVAPS" && (
          <>
           <div className="space-y-1">
            <Label className="text-[10px] uppercase text-muted-foreground">
             IPAP mín (cmH₂O)
            </Label>
            <Input
             value={ipapMin}
             onChange={e => setIpapMin(e.target.value)}
             type="number"
             className="h-8 text-xs"
            />
           </div>
           <div className="space-y-1">
            <Label className="text-[10px] uppercase text-muted-foreground">
             IPAP máx (cmH₂O)
            </Label>
            <Input
             value={ipapMax}
             onChange={e => setIpapMax(e.target.value)}
             type="number"
             className="h-8 text-xs"
            />
           </div>
           <div className="space-y-1 col-span-2">
            <Label className="text-[10px] uppercase text-muted-foreground">
             Vt objetivo (mL)
            </Label>
            <Input
             value={vtObjetivo}
             onChange={e => setVtObjetivo(e.target.value)}
             type="number"
             className="h-8 text-xs"
            />
           </div>
          </>
         )}
        </div>
       </div>

       <div className="space-y-2">
        <Label className="text-xs font-semibold">
         Gases Arteriales (ABG)
        </Label>
        <div className="grid grid-cols-4 gap-2">
         <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           pH
          </Label>
          <Input
           value={ph}
           onChange={e => setPh(e.target.value)}
           className="h-8 text-xs"
           placeholder="7.40"
          />
         </div>
         <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           PaO₂
          </Label>
          <Input
           value={pao2}
           onChange={e => setPao2(e.target.value)}
           className="h-8 text-xs"
           placeholder="80"
          />
         </div>
         <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           PaCO₂
          </Label>
          <Input
           value={paco2}
           onChange={e => setPaco2(e.target.value)}
           className="h-8 text-xs"
           placeholder="40"
          />
         </div>
         <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">
           HCO₃⁻
          </Label>
          <Input
           value={hco3}
           onChange={e => setHco3(e.target.value)}
           className="h-8 text-xs"
           placeholder="24"
          />
         </div>
        </div>
       </div>

       <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notas adicionales y evolución..."
        className="text-xs min-h-[80px]"
       />

       <Button
        onClick={() => saveMutation.mutate()}
        disabled={!patientId || saveMutation.isPending}
        className="w-full gap-2 bg-gradient-primary"
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
        <div className="flex justify-center py-8">
         <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
       ) : records.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 ">
         Sin registros de VMNI aún
        </p>
       ) : (
        <div className="space-y-3 max-h-[600px] overflow-auto pr-2">
         {records.map((r: any) => (
          <div
           key={r.id}
           className="p-3 rounded-lg border bg-muted/10 text-xs space-y-2 hover:border-primary/30 transition-colors"
          >
           <div className="flex items-center justify-between">
            <span className="font-bold text-primary">
             {r.patients?.name || "—"}
            </span>
            <span className="text-[10px] text-muted-foreground">
             {new Date(r.created_at).toLocaleString()}
            </span>
           </div>
           <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge
             variant="outline"
             className="bg-primary/5 text-primary border-primary/20"
            >
             {r.ventilation_mode}
            </Badge>
            {r.fio2 && (
             <span className="text-muted-foreground">
              FiO₂: {r.fio2}%
             </span>
            )}
            {r.peep && (
             <span className="text-muted-foreground">
              EPAP: {r.peep}
             </span>
            )}
            {r.spo2 && (
             <span className="text-muted-foreground">
              SpO₂: {r.spo2}%
             </span>
            )}
           </div>
           {r.notes && (
            <p className="text-[10px] text-muted-foreground line-clamp-2  border-t pt-1">
             "{r.notes}"
            </p>
           )}
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
