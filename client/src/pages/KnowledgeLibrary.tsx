import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadAndSign, getSignedStorageUrl } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
 DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
 BookOpen,
 Upload,
 Search,
 Plus,
 ExternalLink,
 Calendar,
 Link,
 Loader2,
 Sparkles,
 FileText,
 Library,
} from "lucide-react";
import { toast } from "sonner";
import PubMedLibrary from "./PubMedLibrary";
import CochraneSearch from "@/components/knowledge/CochraneSearch";
import ScieloSearch from "@/components/knowledge/ScieloSearch";
import EmbaseSearch from "@/components/knowledge/EmbaseSearch";
import TripSearch from "@/components/knowledge/TripSearch";

const typeLabels: Record<string, string> = {
 paper: "Paper",
 guideline: "Guía",
 protocol: "Protocolo",
 educational: "Educativo",
 internal_case: "Caso",
 review: "Revisión",
 thesis: "Tesis",
 other: "Otro",
};
const specLabels: Record<string, string> = {
 lung_ultrasound: "Eco Pulmonar",
 ventilation: "Ventilación",
 radiology: "Radiología",
 critical_care: "Cuidados Críticos",
 respiratory_physiotherapy: "Kinesiología",
 mixed: "Mixto",
};

export default function KnowledgeLibrary() {
 const [docs, setDocs] = useState<any[]>([]);
 const [search, setSearch] = useState("");
 const [filterType, setFilterType] = useState("all");
 const [loading, setLoading] = useState(true);
 const [showAdd, setShowAdd] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [file, setFile] = useState<File | null>(null);
 const [processing, setProcessing] = useState(false);
 const fileRef = useRef<HTMLInputElement>(null);
 const [form, setForm] = useState({
  title: "",
  document_type: "paper",
  specialty_area: "mixed",
  summary: "",
  authors: "",
  publication_year: new Date().getFullYear(),
  source: "",
  tags: "",
 });

 // URL ingestion
 const [urlInput, setUrlInput] = useState("");
 const [ingesting, setIngesting] = useState(false);

 // Stats
 const [chunkCount, setChunkCount] = useState(0);

 useEffect(() => {
  load();
 }, []);

 const load = async () => {
  setLoading(true);
  const [docsRes, chunksRes] = await Promise.all([
   supabase
    .from("knowledge_documents")
    .select("*")
    .order("created_at", { ascending: false }),
   supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true }),
  ]);
  if (docsRes.data) setDocs(docsRes.data);
  setChunkCount(chunksRes.count || 0);
  setLoading(false);
 };

 const save = async () => {
  if (!form.title.trim()) {
   toast.error("Título requerido");
   return;
  }
  setUploading(true);
  let file_url: string | null = null;
  let storagePath: string | null = null;
  if (file) {
   storagePath = `docs/${Date.now()}.${file.name.split(".").pop()}`;
   try {
    await uploadAndSign("library-documents", storagePath, file);
    file_url = storagePath; // Store path, not URL
   } catch {
    toast.error("Error subiendo");
    setUploading(false);
    return;
   }
  }
  const tags = form.tags
   .split(",")
   .map(t => t.trim())
   .filter(Boolean);
  const { data: doc, error } = await supabase
   .from("knowledge_documents")
   .insert({
    title: form.title,
    document_type: form.document_type,
    specialty_area: form.specialty_area,
    summary: form.summary || null,
    authors: form.authors || null,
    publication_year: form.publication_year || null,
    source: form.source || null,
    tags,
    file_url,
   })
   .select("id")
   .single();

  if (error) {
   toast.error("Error guardando");
   setUploading(false);
   return;
  }

  // Register in study_files
  if (file && file_url && storagePath) {
   await supabase.from("study_files").insert({
    related_type: "knowledge_document",
    related_id: doc.id,
    file_type: file.type === "application/pdf" ? "pdf" : "other",
    bucket_name: "library-documents",
    file_path: storagePath,
    file_url,
    mime_type: file.type,
    original_filename: file.name,
   });
  }

  setUploading(false);
  toast.success("Documento guardado. Procesando con IA...");
  setShowAdd(false);
  setForm({
   title: "",
   document_type: "paper",
   specialty_area: "mixed",
   summary: "",
   authors: "",
   publication_year: new Date().getFullYear(),
   source: "",
   tags: "",
  });
  setFile(null);

  // Auto-process with AI
  processDocument(doc.id, form.title, file_url, form.summary);
  load();
 };

 const processDocument = async (
  docId: string,
  title: string,
  fileUrl: string | null,
  contentText: string | null
 ) => {
  try {
   setProcessing(true);
   const { data, error } = await supabase.functions.invoke(
    "process-document",
    {
     body: {
      document_id: docId,
      file_url: fileUrl,
      title,
      content_text: contentText,
     },
    }
   );
   if (error) throw error;
   toast.success(
    `Procesado: ${data?.chunks_created || 0} fragmentos creados`
   );
   load();
  } catch (e: any) {
   console.error("Process error:", e);
   toast.error("Error procesando documento con IA");
  } finally {
   setProcessing(false);
  }
 };

 const ingestUrl = async () => {
  if (!urlInput.trim()) {
   toast.error("Ingresa una URL");
   return;
  }
  setIngesting(true);
  try {
   const { data, error } = await supabase.functions.invoke("ingest-url", {
    body: { url: urlInput.trim() },
   });
   if (error) throw error;
   toast.success(
    `Ingesta exitosa: "${data?.metadata?.title}" — ${data?.chunks_created} fragmentos`
   );
   setUrlInput("");
   load();
  } catch (e: any) {
   console.error("Ingest error:", e);
   toast.error(e.message || "Error ingiriendo URL");
  } finally {
   setIngesting(false);
  }
 };

 const filtered = docs.filter(d => {
  const ms =
   !search ||
   d.title.toLowerCase().includes(search.toLowerCase()) ||
   d.authors?.toLowerCase().includes(search.toLowerCase());
  const mt = filterType === "all" || d.document_type === filterType;
  return ms && mt;
 });

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between flex-wrap gap-2">
    <div>
     <h1 className="text-2xl font-sans font-bold text-foreground flex items-center gap-2">
      <BookOpen className="h-6 w-6 text-primary" /> Biblioteca Inteligente
     </h1>
     <p className="text-muted-foreground mt-1 text-sm">
      {docs.length} documentos · {chunkCount} fragmentos indexados
      {processing && (
       <span className="ml-2 text-primary">
        <Loader2 className="inline h-3 w-3 animate-spin" />{" "}
        Procesando...
       </span>
      )}
     </p>
    </div>
   </div>

   <Tabs defaultValue="local" className="w-full">
    <TabsList className="mb-4 flex-wrap">
     <TabsTrigger value="local" className="gap-2">
      <FileText className="h-4 w-4" /> Locales
     </TabsTrigger>
     <TabsTrigger value="pubmed" className="gap-2">
      <Search className="h-4 w-4" /> PubMed
     </TabsTrigger>
     <TabsTrigger value="cochrane" className="gap-2">
      <Library className="h-4 w-4" /> Cochrane
     </TabsTrigger>
     <TabsTrigger value="scielo" className="gap-2">
      <Library className="h-4 w-4" /> SciELO
     </TabsTrigger>
     <TabsTrigger value="embase" className="gap-2">
      <Library className="h-4 w-4" /> Embase
     </TabsTrigger>
     <TabsTrigger value="trip" className="gap-2">
      <Library className="h-4 w-4" /> Trip
     </TabsTrigger>
    </TabsList>

    <TabsContent value="local" className="space-y-6">
     {/* URL Ingestion */}
     <Card className="bg-card border-border">
      <CardContent className="p-4">
       <div className="flex items-center gap-2">
        <Link className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-medium text-foreground shrink-0">
         Ingestar desde URL
        </p>
        <Input
         value={urlInput}
         onChange={e => setUrlInput(e.target.value)}
         placeholder="https://pubmed.ncbi.nlm.nih.gov/... o cualquier URL de paper/guía"
         className="flex-1"
         onKeyDown={e => e.key === "Enter" && ingestUrl()}
        />
        <Button
         onClick={ingestUrl}
         disabled={ingesting || !urlInput.trim()}
         size="sm"
        >
         {ingesting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
          <>
           <Sparkles className="h-3.5 w-3.5 mr-1" />
           Ingestar
          </>
         )}
        </Button>
       </div>
       <p className="text-[10px] text-muted-foreground mt-1 ml-6">
        La IA extraerá título, autores, resumen, tags y creará
        fragmentos indexables automáticamente.
       </p>
      </CardContent>
     </Card>
     <Dialog open={showAdd} onOpenChange={setShowAdd}>
      <DialogTrigger asChild>
       <Button>
        <Plus className="h-4 w-4 mr-2" />
        Agregar
       </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
       <DialogHeader>
        <DialogTitle>Nuevo Documento</DialogTitle>
       </DialogHeader>
       <div className="space-y-3">
        <div>
         <Label>Título *</Label>
         <Input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
         />
        </div>
        <div className="grid grid-cols-2 gap-3">
         <div>
          <Label>Tipo</Label>
          <Select
           value={form.document_type}
           onValueChange={v =>
            setForm({ ...form, document_type: v })
           }
          >
           <SelectTrigger>
            <SelectValue />
           </SelectTrigger>
           <SelectContent>
            {Object.entries(typeLabels).map(([k, v]) => (
             <SelectItem key={k} value={k}>
              {v}
             </SelectItem>
            ))}
           </SelectContent>
          </Select>
         </div>
         <div>
          <Label>Especialidad</Label>
          <Select
           value={form.specialty_area}
           onValueChange={v =>
            setForm({ ...form, specialty_area: v })
           }
          >
           <SelectTrigger>
            <SelectValue />
           </SelectTrigger>
           <SelectContent>
            {Object.entries(specLabels).map(([k, v]) => (
             <SelectItem key={k} value={k}>
              {v}
             </SelectItem>
            ))}
           </SelectContent>
          </Select>
         </div>
        </div>
        <div>
         <Label>Autores</Label>
         <Input
          value={form.authors}
          onChange={e =>
           setForm({ ...form, authors: e.target.value })
          }
         />
        </div>
        <div className="grid grid-cols-2 gap-3">
         <div>
          <Label>Año</Label>
          <Input
           type="number"
           value={form.publication_year}
           onChange={e =>
            setForm({
             ...form,
             publication_year: parseInt(e.target.value),
            })
           }
          />
         </div>
         <div>
          <Label>Fuente</Label>
          <Input
           value={form.source}
           onChange={e =>
            setForm({ ...form, source: e.target.value })
           }
           placeholder="PubMed..."
          />
         </div>
        </div>
        <div>
         <Label>Resumen / Contenido</Label>
         <Textarea
          value={form.summary}
          onChange={e =>
           setForm({ ...form, summary: e.target.value })
          }
          rows={3}
          placeholder="Pega el resumen o texto completo del paper..."
         />
        </div>
        <div>
         <Label>Tags (coma)</Label>
         <Input
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          placeholder="ARDS, ecografía"
         />
        </div>
        <div>
         <Label>Archivo (PDF, DOCX)</Label>
         <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] || null)}
         />
         <Button
          variant="outline"
          className="w-full mt-1"
          onClick={() => fileRef.current?.click()}
         >
          <Upload className="h-4 w-4 mr-2" />
          {file ? file.name : "Seleccionar"}
         </Button>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-2">
         <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
         <p className="text-xs text-muted-foreground">
          Al guardar, la IA generará automáticamente resumen, tags y
          fragmentos indexables para el chat clínico.
         </p>
        </div>
        <Button className="w-full" onClick={save} disabled={uploading}>
         {uploading ? "Guardando..." : "Guardar y Procesar"}
        </Button>
       </div>
      </DialogContent>
     </Dialog>

     {/* Filters */}
     <div className="flex gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
       <Input
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="pl-9"
       />
      </div>
      <Select value={filterType} onValueChange={setFilterType}>
       <SelectTrigger className="w-36">
        <SelectValue placeholder="Tipo" />
       </SelectTrigger>
       <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        {Object.entries(typeLabels).map(([k, v]) => (
         <SelectItem key={k} value={k}>
          {v}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>
     </div>

     {/* Documents */}
     {loading ? (
      <p className="text-center text-muted-foreground py-8">
       Cargando...
      </p>
     ) : filtered.length === 0 ? (
      <Card className="bg-card border-border">
       <CardContent className="p-8 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
         Sin documentos. Agrega papers, pega URLs o sube archivos.
        </p>
       </CardContent>
      </Card>
     ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
       {filtered.map(doc => (
        <Card
         key={doc.id}
         className="bg-card border-border hover:border-primary/30 transition-colors"
        >
         <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
           <CardTitle className="text-sm font-medium leading-tight">
            {doc.title}
           </CardTitle>
           <Badge
            variant="outline"
            className="text-[10px] shrink-0 ml-2"
           >
            {typeLabels[doc.document_type] || doc.document_type}
           </Badge>
          </div>
         </CardHeader>
         <CardContent className="space-y-2">
          {doc.authors && (
           <p className="text-xs text-muted-foreground">
            {doc.authors}
           </p>
          )}
          {doc.summary && (
           <p className="text-xs text-muted-foreground line-clamp-3">
            {doc.summary}
           </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
           <Badge variant="secondary" className="text-[10px]">
            {specLabels[doc.specialty_area] || doc.specialty_area}
           </Badge>
           {doc.publication_year && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
             <Calendar className="h-3 w-3" />
             {doc.publication_year}
            </span>
           )}
          </div>
          {Array.isArray(doc.tags) && doc.tags.length > 0 && (
           <div className="flex gap-1 flex-wrap">
            {doc.tags.slice(0, 5).map((t: string, i: number) => (
             <Badge
              key={i}
              variant="outline"
              className="text-[9px]"
             >
              {t}
             </Badge>
            ))}
           </div>
          )}
          <div className="flex gap-1 pt-1">
           {doc.file_url && (
            <Button
             variant="ghost"
             size="sm"
             className="h-6 text-[10px]"
             onClick={async () => {
              const url = await getSignedStorageUrl(
               "library-documents",
               doc.file_url
              );
              if (url) window.open(url, "_blank");
              else toast.error("No se pudo abrir el archivo");
             }}
            >
             <ExternalLink className="h-3 w-3 mr-1" />
             Ver
            </Button>
           )}
           <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px]"
            onClick={() =>
             processDocument(
              doc.id,
              doc.title,
              doc.file_url,
              doc.summary
             )
            }
           >
            <Sparkles className="h-3 w-3 mr-1" />
            Reprocesar
           </Button>
          </div>
         </CardContent>
        </Card>
       ))}
      </div>
     )}
    </TabsContent>

    <TabsContent value="pubmed">
     <PubMedLibrary hideHeader />
    </TabsContent>

    <TabsContent value="cochrane">
     <CochraneSearch />
    </TabsContent>

    <TabsContent value="scielo">
     <ScieloSearch />
    </TabsContent>

    <TabsContent value="embase">
     <EmbaseSearch />
    </TabsContent>

    <TabsContent value="trip">
     <TripSearch />
    </TabsContent>
   </Tabs>
  </div>
 );
}
