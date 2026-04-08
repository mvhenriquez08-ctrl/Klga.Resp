import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
 Plus,
 Users,
 Search,
 ChevronRight,
 Trash2,
 Archive,
 Upload,
 Download,
 FileSpreadsheet,
 Loader2,
 AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/audit";
import {
 exportPatientsToExcel,
 downloadTemplate,
 parseExcelFile,
 type ImportResult,
} from "@/lib/excel";
import PatientForm, {
 type PatientData,
 defaultPatientData,
} from "@/components/clinical/PatientForm";

const STATUS_OPTIONS = [
 { value: "all", label: "Todos" },
 { value: "activo", label: "Activo" },
 { value: "egresado", label: "Egresado" },
 { value: "archivado", label: "Archivado" },
 { value: "fallecido", label: "Fallecido" },
 { value: "en_seguimiento", label: "En seguimiento" },
];

export default function PatientRegistry() {
 const queryClient = useQueryClient();
 const [, setLocation] = useLocation();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [showForm, setShowForm] = useState(false);
 const [patientData, setPatientData] =
  useState<PatientData>(defaultPatientData);
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [deleteTarget, setDeleteTarget] = useState<{
  id: string;
  name: string;
  hasRecords: boolean;
 } | null>(null);
 const [importing, setImporting] = useState(false);
 const [importPreview, setImportPreview] = useState<ImportResult | null>(null);
 const [exporting, setExporting] = useState(false);

 const { data: patients = [], isLoading } = useQuery({
  queryKey: ["patients-list"],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("patients")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
   if (error) throw error;
   return data;
  },
 });

 const saveMutation = useMutation({
  mutationFn: async () => {
   if (!patientData.initials.trim()) throw new Error("Iniciales requeridas");
   if (!patientData.age) throw new Error("Edad requerida");
   if (!patientData.sex) throw new Error("Sexo requerido");
   if (!patientData.primary_diagnosis)
    throw new Error("Diagnóstico requerido");
   if (!patientData.admission_reason)
    throw new Error("Motivo de ingreso requerido");
   if (!patientData.respiratory_support)
    throw new Error("Soporte respiratorio requerido");

   const abg: Record<string, number> = {};
   if (patientData.recent_abg_ph)
    abg.ph = parseFloat(patientData.recent_abg_ph);
   if (patientData.recent_abg_pao2)
    abg.pao2 = parseFloat(patientData.recent_abg_pao2);
   if (patientData.recent_abg_paco2)
    abg.paco2 = parseFloat(patientData.recent_abg_paco2);
   if (patientData.recent_abg_hco3)
    abg.hco3 = parseFloat(patientData.recent_abg_hco3);

   const { data, error } = await supabase
    .from("patients")
    .insert({
     name: patientData.name.trim() || patientData.initials.trim(),
     initials: patientData.initials.trim(),
     sex: patientData.sex,
     age: parseInt(patientData.age),
     height: patientData.height ? parseFloat(patientData.height) : null,
     weight: patientData.weight ? parseFloat(patientData.weight) : null,
     external_id: patientData.external_id || null,
     hospital_id: patientData.hospital_id || null,
     visibility_type: patientData.visibility_type || "identificado",
     primary_diagnosis: patientData.primary_diagnosis,
     admission_reason: patientData.admission_reason,
     icu_admission_date: patientData.icu_admission_date || null,
     comorbidities: patientData.comorbidities || null,
     respiratory_phenotype: patientData.respiratory_phenotype || null,
     clinical_notes: patientData.clinical_notes || null,
     respiratory_support: patientData.respiratory_support,
     ventilation_mode: patientData.ventilation_mode || null,
     respiratory_rate: patientData.respiratory_rate
      ? parseFloat(patientData.respiratory_rate)
      : null,
     spo2: patientData.spo2 ? parseFloat(patientData.spo2) : null,
     heart_rate: patientData.heart_rate
      ? parseFloat(patientData.heart_rate)
      : null,
     blood_pressure: patientData.blood_pressure || null,
     recent_abg: Object.keys(abg).length > 0 ? abg : null,
     patient_position: patientData.patient_position || null,
     rut: patientData.rut || null,
     phone: patientData.phone || null,
     email: patientData.email || null,
     address: patientData.address || null,
     commune: patientData.commune || null,
     prevision: patientData.prevision || null,
     bed_number: patientData.bed_number || null,
     service_unit: patientData.service_unit || null,
     establishment: patientData.establishment || null,
     responsible_professional:
      patientData.responsible_professional || null,
     patient_status: "activo",
    } as any)
    .select()
    .single();
   if (error) throw error;
   return data;
  },
  onSuccess: data => {
   queryClient.invalidateQueries({ queryKey: ["patients-list"] });
   setPatientData(defaultPatientData);
   setShowForm(false);
   logAudit("create_patient", "patient", data?.id);
   toast({
    title: "Paciente registrado",
    description: "Registro almacenado correctamente.",
   });
  },
  onError: (err: Error) => {
   toast({
    title: "Error",
    description: err.message,
    variant: "destructive",
   });
  },
 });

 // Check if patient has related records
 const checkRelatedRecords = async (patientId: string) => {
  const checks = await Promise.all([
   supabase
    .from("lung_examinations")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId),
   supabase
    .from("ventilation_records")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId),
   supabase
    .from("xray_examinations")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId),
   supabase
    .from("abg_records")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId),
   supabase
    .from("study_files")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId),
  ]);
  return checks.some(c => (c.count || 0) > 0);
 };

 const handleDeleteClick = async (e: React.MouseEvent, patient: any) => {
  e.stopPropagation();
  const hasRecords = await checkRelatedRecords(patient.id);
  const displayName =
   patient.visibility_type === "anonimizado"
    ? patient.initials || "—"
    : patient.name || patient.initials || "—";
  setDeleteTarget({ id: patient.id, name: displayName, hasRecords });
 };

 const deleteMutation = useMutation({
  mutationFn: async ({ id, archive }: { id: string; archive: boolean }) => {
   const {
    data: { user },
   } = await supabase.auth.getUser();
   if (archive) {
    const { error } = await supabase
     .from("patients")
     .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user?.id || null,
      patient_status: "archivado",
     } as any)
     .eq("id", id);
    if (error) throw error;
   } else {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) throw error;
   }
   return { id, archive };
  },
  onSuccess: ({ id, archive }) => {
   queryClient.invalidateQueries({ queryKey: ["patients-list"] });
   setDeleteTarget(null);
   logAudit(archive ? "archive_patient" : "delete_patient", "patient", id);
   toast({
    title: archive ? "Paciente archivado" : "Paciente eliminado",
    description: archive
     ? "El paciente fue archivado correctamente."
     : "Paciente eliminado correctamente.",
   });
  },
  onError: () => {
   toast({
    title: "Error",
    description: "No se pudo procesar la solicitud.",
    variant: "destructive",
   });
  },
 });

 // Import Excel
 const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImporting(true);
  try {
   const result = await parseExcelFile(file);
   setImportPreview(result);
  } catch {
   toast({
    title: "Error",
    description: "No se pudo leer el archivo Excel.",
    variant: "destructive",
   });
  } finally {
   setImporting(false);
   if (fileInputRef.current) fileInputRef.current.value = "";
  }
 };

 const confirmImport = async () => {
  if (!importPreview) return;
  setImporting(true);
  let imported = 0;
  let failed = 0;

  for (const row of importPreview.valid) {
   const d = row.data;
   const { error } = await supabase.from("patients").insert({
    name: d.name || d.initials || "Sin nombre",
    initials:
     d.initials ||
     (d.name
      ? d.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3)
      : "NN"),
    rut: d.rut || null,
    age: d.age ? parseInt(d.age) : null,
    sex: d.sex?.toLowerCase() || null,
    phone: d.phone || null,
    email: d.email || null,
    address: d.address || null,
    commune: d.commune || null,
    primary_diagnosis: d.primary_diagnosis || null,
    responsible_professional: d.responsible_professional || null,
    patient_status: d.patient_status?.toLowerCase() || "activo",
    icu_admission_date: d.icu_admission_date || null,
    clinical_notes: d.clinical_notes || null,
    weight: d.weight ? parseFloat(d.weight) : null,
    height: d.height ? parseFloat(d.height) : null,
    prevision: d.prevision || null,
    service_unit: d.service_unit || null,
    bed_number: d.bed_number || null,
    establishment: d.establishment || null,
   } as any);
   if (error) failed++;
   else imported++;
  }

  queryClient.invalidateQueries({ queryKey: ["patients-list"] });
  logAudit("import_patients", "patient", undefined, { imported, failed });
  setImportPreview(null);
  setImporting(false);
  toast({
   title: "Importación completada",
   description: `Se importaron ${imported} pacientes.${failed > 0 ? ` ${failed} registros presentaron errores.` : ""}`,
  });
 };

 // Export
 const handleExport = () => {
  if (filtered.length === 0) {
   toast({
    title: "Sin datos",
    description: "No hay pacientes disponibles para exportar.",
    variant: "destructive",
   });
   return;
  }
  setExporting(true);
  try {
   exportPatientsToExcel(filtered);
   logAudit("export_patients", "patient", undefined, {
    count: filtered.length,
   });
  } catch {
   toast({
    title: "Error",
    description: "No se pudo exportar la lista de pacientes.",
    variant: "destructive",
   });
  } finally {
   setExporting(false);
  }
 };

 const filtered = patients.filter((p: any) => {
  if (
   statusFilter !== "all" &&
   (p.patient_status || "activo") !== statusFilter
  )
   return false;
  if (!search) return true;
  const s = search.toLowerCase();
  const name = String(p.name || "").toLowerCase();
  const initials = String(p.initials || "").toLowerCase();
  const dx = String(p.primary_diagnosis || "").toLowerCase();
  const rut = String(p.rut || "").toLowerCase();
  return (
   name.includes(s) ||
   initials.includes(s) ||
   dx.includes(s) ||
   rut.includes(s)
  );
 });

 return (
  <div className="p-6 max-w-5xl mx-auto">
   <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
    <div>
     <h1 className="font-display text-2xl font-bold mb-1">Pacientes</h1>
     <p className="text-muted-foreground text-sm">
      Registro clínico estructurado
     </p>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
     <Button variant="outline" size="sm" onClick={downloadTemplate}>
      <FileSpreadsheet className="h-4 w-4 mr-1" /> Plantilla
     </Button>
     <Button
      variant="outline"
      size="sm"
      onClick={() => fileInputRef.current?.click()}
      disabled={importing}
     >
      {importing ? (
       <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
       <Upload className="h-4 w-4 mr-1" />
      )}
      Importar
     </Button>
     <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting || filtered.length === 0}
     >
      {exporting ? (
       <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
       <Download className="h-4 w-4 mr-1" />
      )}
      Exportar
     </Button>
     <Button onClick={() => setShowForm(!showForm)} size="sm">
      <Plus className="h-4 w-4 mr-1" /> Nuevo
     </Button>
    </div>
   </div>

   <input
    ref={fileInputRef}
    type="file"
    accept=".xlsx,.xls,.csv"
    className="hidden"
    onChange={handleFileSelect}
   />

   {showForm && (
    <motion.div
     initial={{ opacity: 0, y: -10 }}
     animate={{ opacity: 1, y: 0 }}
     className="mb-8"
    >
     <PatientForm
      data={patientData}
      onChange={setPatientData}
      onSave={() => saveMutation.mutate()}
      onCancel={() => {
       setShowForm(false);
       setPatientData(defaultPatientData);
      }}
      isSaving={saveMutation.isPending}
     />
    </motion.div>
   )}

   {/* Search & Filters */}
   {!showForm && patients.length > 0 && (
    <div className="mb-4 flex gap-2">
     <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
       value={search}
       onChange={e => setSearch(e.target.value)}
       placeholder="Buscar por nombre, RUT, iniciales o diagnóstico..."
       className="pl-9"
      />
     </div>
     <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[160px]">
       <SelectValue />
      </SelectTrigger>
      <SelectContent>
       {STATUS_OPTIONS.map(s => (
        <SelectItem key={s.value} value={s.value}>
         {s.label}
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
    </div>
   )}

   {/* Stats */}
   {!showForm && patients.length > 0 && (
    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
     <span className="flex items-center gap-1">
      <Users className="h-3 w-3" /> {filtered.length} de {patients.length}{" "}
      pacientes
     </span>
    </div>
   )}

   {/* List */}
   {isLoading ? (
    <div className="text-center py-16 text-muted-foreground">
     Cargando...
    </div>
   ) : filtered.length === 0 && !showForm ? (
    <div className="text-center py-16">
     <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
     <h3 className="font-display font-semibold text-muted-foreground mb-1">
      {search || statusFilter !== "all"
       ? "Sin resultados"
       : "Sin pacientes registrados"}
     </h3>
     <p className="text-sm text-muted-foreground">
      {search
       ? "Intenta con otro término"
       : "Registra tu primer paciente"}
     </p>
    </div>
   ) : (
    <div className="space-y-2">
     {filtered.map((pt: any) => {
      const displayName =
       pt.visibility_type === "anonimizado"
        ? String(pt.initials || "—")
        : String(pt.name || pt.initials || "—");
      const status = pt.patient_status || "activo";

      return (
       <motion.div
        key={pt.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
       >
        <Card
         className="border-border/50 hover:border-primary/20 transition-colors cursor-pointer"
         onClick={() => setLocation(`/pacientes/${pt.id}`)}
        >
         {" "}
         <CardContent className="p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
           <span className="text-xs font-bold text-primary">
            {String(pt.initials || "?").slice(0, 2)}
           </span>
          </div>
          <div className="flex-1 min-w-0">
           <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold truncate">
             {displayName}
            </h4>
            {pt.age && (
             <span className="text-xs text-muted-foreground">
              {pt.age}a
             </span>
            )}
            {pt.sex && (
             <span className="text-xs text-muted-foreground capitalize">
              {String(pt.sex).charAt(0).toUpperCase()}
             </span>
            )}
            {pt.rut && (
             <span className="text-xs text-muted-foreground">
              {pt.rut}
             </span>
            )}
           </div>
           <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {pt.primary_diagnosis && (
             <Badge
              variant="secondary"
              className="text-[10px] capitalize"
             >
              {pt.primary_diagnosis}
             </Badge>
            )}
            {pt.respiratory_support && (
             <Badge variant="outline" className="text-[10px]">
              {pt.respiratory_support}
             </Badge>
            )}
            {status !== "activo" && (
             <Badge
              variant={
               status === "fallecido" ? "destructive" : "outline"
              }
              className="text-[10px] capitalize"
             >
              {status}
             </Badge>
            )}
           </div>
          </div>
          <Button
           variant="ghost"
           size="icon"
           className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
           onClick={e => handleDeleteClick(e, pt)}
          >
           <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
         </CardContent>
        </Card>
       </motion.div>
      );
     })}
    </div>
   )}

   {/* Delete / Archive Dialog */}
   <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
       <AlertTriangle className="h-5 w-5 text-destructive" />
       {deleteTarget?.hasRecords
        ? "Archivar paciente"
        : "Eliminar paciente"}
      </DialogTitle>
      <DialogDescription>
       {deleteTarget?.hasRecords
        ? `"${deleteTarget.name}" tiene registros clínicos asociados (ecografías, ventilación, radiografías o archivos). Solo puede archivarse para mantener la trazabilidad.`
        : `¿Estás seguro de eliminar a "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
      </DialogDescription>
     </DialogHeader>
     <DialogFooter className="gap-2">
      <Button variant="outline" onClick={() => setDeleteTarget(null)}>
       Cancelar
      </Button>
      {deleteTarget?.hasRecords ? (
       <Button
        variant="secondary"
        onClick={() =>
         deleteMutation.mutate({ id: deleteTarget.id, archive: true })
        }
        disabled={deleteMutation.isPending}
       >
        <Archive className="h-4 w-4 mr-1" /> Archivar paciente
       </Button>
      ) : (
       <>
        <Button
         variant="secondary"
         onClick={() =>
          deleteTarget &&
          deleteMutation.mutate({
           id: deleteTarget.id,
           archive: true,
          })
         }
         disabled={deleteMutation.isPending}
        >
         <Archive className="h-4 w-4 mr-1" /> Archivar
        </Button>
        <Button
         variant="destructive"
         onClick={() =>
          deleteTarget &&
          deleteMutation.mutate({
           id: deleteTarget.id,
           archive: false,
          })
         }
         disabled={deleteMutation.isPending}
        >
         <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
       </>
      )}
     </DialogFooter>
    </DialogContent>
   </Dialog>

   {/* Import Preview Dialog */}
   <Dialog
    open={!!importPreview}
    onOpenChange={() => setImportPreview(null)}
   >
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
     <DialogHeader>
      <DialogTitle>Vista previa de importación</DialogTitle>
      <DialogDescription>
       Revisa los datos antes de confirmar.
      </DialogDescription>
     </DialogHeader>

     <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-center">
       <div className="p-3 rounded-lg bg-primary/10">
        <p className="text-lg font-bold text-primary">
         {importPreview?.valid.length || 0}
        </p>
        <p className="text-[10px] text-muted-foreground">Válidos</p>
       </div>
       <div className="p-3 rounded-lg bg-destructive/10">
        <p className="text-lg font-bold text-destructive">
         {importPreview?.errors.length || 0}
        </p>
        <p className="text-[10px] text-muted-foreground">Con errores</p>
       </div>
       <div className="p-3 rounded-lg bg-warning/10">
        <p className="text-lg font-bold text-warning">
         {importPreview?.duplicates.length || 0}
        </p>
        <p className="text-[10px] text-muted-foreground">Duplicados</p>
       </div>
      </div>

      {(importPreview?.errors.length || 0) > 0 && (
       <div className="space-y-1">
        <p className="text-xs font-semibold text-destructive">
         Errores:
        </p>
        {importPreview?.errors.slice(0, 10).map((e, i) => (
         <p key={i} className="text-xs text-muted-foreground">
          Fila {e.rowIndex}: {e.message} ({e.field})
         </p>
        ))}
       </div>
      )}

      {(importPreview?.valid.length || 0) > 0 && (
       <div className="space-y-1">
        <p className="text-xs font-semibold">
         Registros válidos (primeros 5):
        </p>
        {importPreview?.valid.slice(0, 5).map((r, i) => (
         <p key={i} className="text-xs text-muted-foreground truncate">
          {r.data.name || r.data.initials} — {r.data.rut || "Sin RUT"}{" "}
          — {r.data.primary_diagnosis || "Sin Dx"}
         </p>
        ))}
       </div>
      )}
     </div>

     <DialogFooter>
      <Button variant="outline" onClick={() => setImportPreview(null)}>
       Cancelar
      </Button>
      <Button
       onClick={confirmImport}
       disabled={importing || (importPreview?.valid.length || 0) === 0}
      >
       {importing ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
       ) : (
        <Upload className="h-4 w-4 mr-1" />
       )}
       Importar {importPreview?.valid.length || 0} pacientes
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </div>
 );
}
