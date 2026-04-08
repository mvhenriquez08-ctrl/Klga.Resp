import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
 Database,
 Tag,
 CheckCircle2,
 Clock,
 Search,
 Filter,
 FileImage,
 Activity,
 Plus,
 ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ClinicalDataset() {
 const [files, setFiles] = useState<any[]>([]);
 const [labels, setLabels] = useState<any[]>([]);
 const [queue, setQueue] = useState<any[]>([]);
 const [validations, setValidations] = useState<any[]>([]);
 const [search, setSearch] = useState("");
 const [filterType, setFilterType] = useState("all");
 const [loading, setLoading] = useState(true);

 // Label dialog
 const [showLabel, setShowLabel] = useState(false);
 const [labelFileId, setLabelFileId] = useState<string | null>(null);
 const [labelForm, setLabelForm] = useState({
  category: "finding",
  name: "",
  value: "",
 });

 // Validation dialog
 const [showValidation, setShowValidation] = useState(false);
 const [valFile, setValFile] = useState<any>(null);
 const [valForm, setValForm] = useState({
  interpretation: "",
  diagnosis: "",
  severity: "",
  notes: "",
 });

 useEffect(() => {
  loadAll();
 }, []);

 const loadAll = async () => {
  setLoading(true);
  const [f, l, q, v] = await Promise.all([
   supabase
    .from("study_files")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200),
   supabase
    .from("clinical_labels")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200),
   supabase
    .from("ai_training_queue")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100),
   supabase
    .from("validated_findings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100),
  ]);
  if (f.data) setFiles(f.data);
  if (l.data) setLabels(l.data);
  if (q.data) setQueue(q.data);
  if (v.data) setValidations(v.data);
  setLoading(false);
 };

 const filtered = files.filter(f => {
  const ms =
   !search ||
   f.original_filename?.toLowerCase().includes(search.toLowerCase());
  const mt = filterType === "all" || f.file_type === filterType;
  return ms && mt;
 });

 const stats = {
  files: files.length,
  labels: labels.length,
  validated: validations.length,
  ready: queue.filter(t => t.ready_for_training).length,
 };

 const saveLabel = async () => {
  if (!labelForm.name.trim()) {
   toast.error("Nombre requerido");
   return;
  }
  const file = files.find(f => f.id === labelFileId);
  const { error } = await supabase.from("clinical_labels").insert({
   patient_id: file?.patient_id || null,
   source_type: file?.file_type?.includes("xray")
    ? "xray"
    : file?.file_type?.includes("ultrasound")
     ? "ultrasound"
     : "mixed",
   source_record_id: file?.related_id || null,
   file_id: labelFileId,
   label_category: labelForm.category,
   label_name: labelForm.name,
   label_value: labelForm.value || null,
   validation_status: "draft",
  });
  if (error) toast.error("Error");
  else {
   toast.success("Etiqueta guardada");
   setShowLabel(false);
   setLabelForm({ category: "finding", name: "", value: "" });
   loadAll();
  }
 };

 const saveValidation = async () => {
  if (!valForm.interpretation.trim() && !valForm.diagnosis.trim()) {
   toast.error("Completa interpretación o diagnóstico");
   return;
  }
  const { error } = await supabase.from("validated_findings").insert({
   patient_id: valFile?.patient_id || null,
   source_type: valFile?.file_type?.includes("xray")
    ? "xray"
    : valFile?.file_type?.includes("ultrasound")
     ? "ultrasound"
     : "mixed",
   source_record_id: valFile?.related_id || null,
   final_interpretation: valForm.interpretation || null,
   final_diagnosis: valForm.diagnosis || null,
   severity_level: valForm.severity || null,
   validation_notes: valForm.notes || null,
  });
  if (error) toast.error("Error");
  else {
   // Also enqueue for training
   await supabase.from("ai_training_queue").insert({
    source_type: valFile?.file_type?.includes("xray") ? "xray" : "mixed",
    source_record_id: valFile?.related_id || null,
    file_id: valFile?.id || null,
    label_status: "validated",
    ready_for_training: true,
   });
   toast.success("Hallazgo validado y agregado a cola ML");
   setShowValidation(false);
   setValForm({
    interpretation: "",
    diagnosis: "",
    severity: "",
    notes: "",
   });
   loadAll();
  }
 };

 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
     <Database className="h-6 w-6 text-primary" /> Dataset Clínico
    </h1>
    <p className="text-muted-foreground mt-1">
     Archivos, etiquetas, validaciones y cola ML
    </p>
   </div>

   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[
     { l: "Archivos", v: stats.files, i: FileImage },
     { l: "Etiquetas", v: stats.labels, i: Tag },
     { l: "Validados", v: stats.validated, i: ShieldCheck },
     { l: "Listas ML", v: stats.ready, i: Activity },
    ].map(s => (
     <Card key={s.l} className="bg-card border-border">
      <CardContent className="p-4 flex items-center gap-3">
       <s.i className="h-5 w-5 text-primary" />
       <div>
        <p className="text-2xl font-bold text-foreground">{s.v}</p>
        <p className="text-xs text-muted-foreground">{s.l}</p>
       </div>
      </CardContent>
     </Card>
    ))}
   </div>

   <Tabs defaultValue="files">
    <TabsList>
     <TabsTrigger value="files">Archivos</TabsTrigger>
     <TabsTrigger value="labels">Etiquetas</TabsTrigger>
     <TabsTrigger value="validations">Validaciones</TabsTrigger>
     <TabsTrigger value="queue">Cola ML</TabsTrigger>
    </TabsList>

    {/* FILES TAB */}
    <TabsContent value="files" className="space-y-4">
     <div className="flex gap-2">
      <div className="relative flex-1">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
       <Input
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="pl-9"
       />
      </div>
      <Select value={filterType} onValueChange={setFilterType}>
       <SelectTrigger className="w-44">
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue />
       </SelectTrigger>
       <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="ultrasound_image">Ecografía</SelectItem>
        <SelectItem value="xray_image">Radiografía</SelectItem>
        <SelectItem value="ventilator_curve_photo">
         Curvas VM
        </SelectItem>
        <SelectItem value="pdf">PDF</SelectItem>
       </SelectContent>
      </Select>
     </div>
     {loading ? (
      <p className="text-muted-foreground text-center py-8">
       Cargando...
      </p>
     ) : filtered.length === 0 ? (
      <Card className="bg-card border-border">
       <CardContent className="p-8 text-center">
        <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
         Sin archivos. Sube una radiografía desde el Registro RX para
         comenzar.
        </p>
       </CardContent>
      </Card>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Archivo</TableHead>
         <TableHead>Tipo</TableHead>
         <TableHead>Modalidad</TableHead>
         <TableHead>Fecha</TableHead>
         <TableHead>Acciones</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {filtered.map(f => (
         <TableRow key={f.id}>
          <TableCell className="font-medium text-sm">
           {f.original_filename || "—"}
          </TableCell>
          <TableCell>
           <Badge variant="outline" className="text-xs">
            {f.file_type}
           </Badge>
          </TableCell>
          <TableCell className="text-sm">{f.related_type}</TableCell>
          <TableCell className="text-muted-foreground text-sm">
           {new Date(f.created_at).toLocaleDateString()}
          </TableCell>
          <TableCell>
           <div className="flex gap-1">
            <Button
             variant="ghost"
             size="sm"
             className="h-7 text-xs"
             onClick={() => {
              setLabelFileId(f.id);
              setShowLabel(true);
             }}
            >
             <Tag className="h-3 w-3 mr-1" />
             Etiquetar
            </Button>
            <Button
             variant="ghost"
             size="sm"
             className="h-7 text-xs"
             onClick={() => {
              setValFile(f);
              setShowValidation(true);
             }}
            >
             <ShieldCheck className="h-3 w-3 mr-1" />
             Validar
            </Button>
           </div>
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </TabsContent>

    {/* LABELS TAB */}
    <TabsContent value="labels">
     {labels.length === 0 ? (
      <Card className="bg-card border-border">
       <CardContent className="p-8 text-center">
        <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
         Sin etiquetas. Etiqueta archivos desde la pestaña Archivos.
        </p>
       </CardContent>
      </Card>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Etiqueta</TableHead>
         <TableHead>Categoría</TableHead>
         <TableHead>Valor</TableHead>
         <TableHead>Estado</TableHead>
         <TableHead>Fecha</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {labels.map(l => (
         <TableRow key={l.id}>
          <TableCell className="font-medium">
           {l.label_name}
          </TableCell>
          <TableCell>
           <Badge variant="outline">{l.label_category}</Badge>
          </TableCell>
          <TableCell>{l.label_value || "—"}</TableCell>
          <TableCell>
           <Badge
            variant={
             l.validation_status === "validated"
              ? "default"
              : "secondary"
            }
           >
            {l.validation_status}
           </Badge>
          </TableCell>
          <TableCell className="text-muted-foreground">
           {new Date(l.created_at).toLocaleDateString()}
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </TabsContent>

    {/* VALIDATIONS TAB */}
    <TabsContent value="validations">
     {validations.length === 0 ? (
      <Card className="bg-card border-border">
       <CardContent className="p-8 text-center">
        <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
         Sin validaciones. Valida archivos desde la pestaña Archivos.
        </p>
       </CardContent>
      </Card>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Fuente</TableHead>
         <TableHead>Diagnóstico</TableHead>
         <TableHead>Interpretación</TableHead>
         <TableHead>Severidad</TableHead>
         <TableHead>Fecha</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {validations.map(v => (
         <TableRow key={v.id}>
          <TableCell>{v.source_type}</TableCell>
          <TableCell className="font-medium">
           {v.final_diagnosis || "—"}
          </TableCell>
          <TableCell className="max-w-[200px] truncate">
           {v.final_interpretation || "—"}
          </TableCell>
          <TableCell>
           {v.severity_level ? (
            <Badge variant="outline">{v.severity_level}</Badge>
           ) : (
            "—"
           )}
          </TableCell>
          <TableCell className="text-muted-foreground">
           {new Date(v.created_at).toLocaleDateString()}
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </TabsContent>

    {/* QUEUE TAB */}
    <TabsContent value="queue">
     {queue.length === 0 ? (
      <Card className="bg-card border-border">
       <CardContent className="p-8 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
         Cola vacía. Los archivos validados se agregan automáticamente.
        </p>
       </CardContent>
      </Card>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Fuente</TableHead>
         <TableHead>Estado</TableHead>
         <TableHead>Listo</TableHead>
         <TableHead>Usado</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {queue.map(t => (
         <TableRow key={t.id}>
          <TableCell>{t.source_type}</TableCell>
          <TableCell>
           <Badge variant="outline">{t.label_status}</Badge>
          </TableCell>
          <TableCell>
           {t.ready_for_training ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
           ) : (
            "—"
           )}
          </TableCell>
          <TableCell>
           {t.used_for_training ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
           ) : (
            "—"
           )}
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </TabsContent>
   </Tabs>

   {/* Label Dialog */}
   <Dialog open={showLabel} onOpenChange={setShowLabel}>
    <DialogContent className="max-w-sm">
     <DialogHeader>
      <DialogTitle>Agregar Etiqueta</DialogTitle>
     </DialogHeader>
     <div className="space-y-3">
      <div>
       <Label className="text-xs">Categoría</Label>
       <Select
        value={labelForm.category}
        onValueChange={v => setLabelForm({ ...labelForm, category: v })}
       >
        <SelectTrigger className="h-8 text-xs mt-1">
         <SelectValue />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="finding">Hallazgo</SelectItem>
         <SelectItem value="diagnosis">Diagnóstico</SelectItem>
         <SelectItem value="severity">Severidad</SelectItem>
         <SelectItem value="pattern">Patrón</SelectItem>
         <SelectItem value="quality">Calidad</SelectItem>
         <SelectItem value="artifact">Artefacto</SelectItem>
         <SelectItem value="other">Otro</SelectItem>
        </SelectContent>
       </Select>
      </div>
      <div>
       <Label className="text-xs">Nombre *</Label>
       <Input
        className="h-8 text-xs mt-1"
        value={labelForm.name}
        onChange={e =>
         setLabelForm({ ...labelForm, name: e.target.value })
        }
        placeholder="ej: consolidación basal derecha"
       />
      </div>
      <div>
       <Label className="text-xs">Valor</Label>
       <Input
        className="h-8 text-xs mt-1"
        value={labelForm.value}
        onChange={e =>
         setLabelForm({ ...labelForm, value: e.target.value })
        }
        placeholder="ej: presente, leve, bilateral"
       />
      </div>
      <Button className="w-full" size="sm" onClick={saveLabel}>
       Guardar Etiqueta
      </Button>
     </div>
    </DialogContent>
   </Dialog>

   {/* Validation Dialog */}
   <Dialog open={showValidation} onOpenChange={setShowValidation}>
    <DialogContent className="max-w-md">
     <DialogHeader>
      <DialogTitle>Validar Hallazgo</DialogTitle>
     </DialogHeader>
     <div className="space-y-3">
      <div>
       <Label className="text-xs">Interpretación Final</Label>
       <Textarea
        className="text-xs mt-1 min-h-[60px]"
        value={valForm.interpretation}
        onChange={e =>
         setValForm({ ...valForm, interpretation: e.target.value })
        }
        placeholder="Descripción de los hallazgos..."
       />
      </div>
      <div>
       <Label className="text-xs">Diagnóstico Final</Label>
       <Input
        className="h-8 text-xs mt-1"
        value={valForm.diagnosis}
        onChange={e =>
         setValForm({ ...valForm, diagnosis: e.target.value })
        }
        placeholder="ej: Neumonía basal derecha"
       />
      </div>
      <div>
       <Label className="text-xs">Severidad</Label>
       <Select
        value={valForm.severity}
        onValueChange={v => setValForm({ ...valForm, severity: v })}
       >
        <SelectTrigger className="h-8 text-xs mt-1">
         <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="leve">Leve</SelectItem>
         <SelectItem value="moderado">Moderado</SelectItem>
         <SelectItem value="severo">Severo</SelectItem>
         <SelectItem value="crítico">Crítico</SelectItem>
        </SelectContent>
       </Select>
      </div>
      <div>
       <Label className="text-xs">Notas</Label>
       <Textarea
        className="text-xs mt-1 min-h-[40px]"
        value={valForm.notes}
        onChange={e =>
         setValForm({ ...valForm, notes: e.target.value })
        }
       />
      </div>
      <Button className="w-full" size="sm" onClick={saveValidation}>
       <ShieldCheck className="h-3.5 w-3.5 mr-2" />
       Validar y Agregar a Cola ML
      </Button>
     </div>
    </DialogContent>
   </Dialog>
  </div>
 );
}
