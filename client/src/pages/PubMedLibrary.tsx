import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
 Search,
 Download,
 ExternalLink,
 Loader2,
 BookOpen,
 History,
 ChevronLeft,
 ChevronRight,
 Filter,
 Tag,
 Clock,
 Zap,
 CheckCircle2,
 XCircle,
} from "lucide-react";

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SPECIALTY_OPTIONS = [
 { value: "lus", label: "Ecografía Pulmonar" },
 { value: "vm", label: "Ventilación Mecánica" },
 { value: "rx", label: "Radiología Torácica" },
 { value: "ards", label: "ARDS" },
 { value: "pneumothorax", label: "Neumotórax" },
 { value: "pleural_effusion", label: "Derrame Pleural" },
 { value: "pneumonia", label: "Neumonía" },
 { value: "weaning", label: "Destete VM" },
 { value: "asynchrony", label: "Asincronías" },
 { value: "atelectasis", label: "Atelectasia" },
 { value: "mixed", label: "General" },
];

const RELEVANCE_TAGS = [
 "LUS",
 "VM",
 "RX",
 "IA",
 "Docencia",
 "Protocolo clínico",
];

const BULK_TOPICS = [
 {
  id: "vm",
  label: "Ventilación Mecánica",
  specialty: "vm",
  tags: ["VM"],
  queries: [
   "mechanical ventilation critical care",
   "protective lung ventilation strategy",
   "ventilator settings ICU",
   "positive end-expiratory pressure PEEP",
   "driving pressure mechanical ventilation",
   "prone positioning ventilation",
   "high flow nasal cannula",
   "non-invasive ventilation NIV",
   "ventilator induced lung injury VILI",
   "recruitment maneuvers ARDS",
  ],
 },
 {
  id: "lus",
  label: "Ultrasonido Pulmonar",
  specialty: "lus",
  tags: ["LUS"],
  queries: [
   "lung ultrasound critical care",
   "point of care ultrasound lung",
   "B-lines lung ultrasound",
   "lung ultrasound score",
   "pleural effusion ultrasound",
   "pneumothorax ultrasound diagnosis",
   "lung ultrasound ARDS",
   "diaphragm ultrasound weaning",
   "lung ultrasound COVID pneumonia",
   "BLUE protocol lung ultrasound",
  ],
 },
 {
  id: "rx",
  label: "Radiografía de Tórax",
  specialty: "rx",
  tags: ["RX"],
  queries: [
   "chest radiograph critical care ICU",
   "portable chest x-ray interpretation",
   "chest x-ray pneumonia diagnosis",
   "chest x-ray ARDS",
   "chest radiograph pleural effusion",
   "chest x-ray pneumothorax",
   "chest x-ray atelectasis",
   "chest radiograph pulmonary edema",
   "chest x-ray endotracheal tube position",
   "chest x-ray central venous catheter",
  ],
 },
];

type PubmedResult = {
 pubmed_id: string;
 title: string;
 authors: string[];
 journal: string;
 publication_date: string;
 doi: string;
 article_type?: string;
 pubmed_url: string;
};

type SearchHistory = {
 id: string;
 query_text: string;
 total_results: number;
 searched_at: string;
};

type BulkLog = {
 topic: string;
 query: string;
 status: "pending" | "searching" | "importing" | "done" | "error";
 found: number;
 imported: number;
 error?: string;
};

export default function PubMedLibrary({
 hideHeader,
}: { hideHeader?: boolean } = {}) {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<PubmedResult[]>([]);
 const [total, setTotal] = useState(0);
 const [page, setPage] = useState(0);
 const [loading, setLoading] = useState(false);
 const [importing, setImporting] = useState(false);
 const [selected, setSelected] = useState<Set<string>>(new Set());
 const [specialty, setSpecialty] = useState("mixed");
 const [selectedTags, setSelectedTags] = useState<string[]>([]);
 const [history, setHistory] = useState<SearchHistory[]>([]);
 const [importedDocs, setImportedDocs] = useState<any[]>([]);
 const [tab, setTab] = useState("search");

 const [filterAuthor, setFilterAuthor] = useState("");
 const [filterJournal, setFilterJournal] = useState("");
 const [filterDateFrom, setFilterDateFrom] = useState("");
 const [filterDateTo, setFilterDateTo] = useState("");
 const [filterLang, setFilterLang] = useState("none");
 const [showFilters, setShowFilters] = useState(false);

 const [bulkRunning, setBulkRunning] = useState(false);
 const [bulkLogs, setBulkLogs] = useState<BulkLog[]>([]);
 const [bulkTopics, setBulkTopics] = useState<Set<string>>(
  new Set(BULK_TOPICS.map(t => t.id))
 );
 const [bulkLimit, setBulkLimit] = useState(50);
 const cancelRef = useRef(false);

 useEffect(() => {
  loadHistory();
  loadImported();
 }, []);

 const loadHistory = async () => {
  const { data } = await supabase
   .from("pubmed_searches")
   .select("*")
   .order("searched_at", { ascending: false })
   .limit(20);
  if (data) setHistory(data as any);
 };

 const loadImported = async () => {
  const { data } = await supabase
   .from("knowledge_documents")
   .select("*")
   .eq("import_source", "pubmed")
   .order("created_at", { ascending: false })
   .limit(100);
  if (data) setImportedDocs(data);
 };

 const search = async (p = 0) => {
  if (!query.trim()) return;
  setLoading(true);
  setPage(p);
  try {
   const filters: any = {};
   if (filterAuthor) filters.author = filterAuthor;
   if (filterJournal) filters.journal = filterJournal;
   if (filterDateFrom) filters.date_from = filterDateFrom;
   if (filterDateTo) filters.date_to = filterDateTo;
   if (filterLang && filterLang !== "none") filters.language = filterLang;
   const resp = await fetch(`${FUNC_URL}/pubmed-search`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify({
     query: query.trim(),
     filters,
     page: p,
     limit: 20,
    }),
   });
   const data = await resp.json();
   if (data.error) throw new Error(data.error);
   setResults(data.results || []);
   setTotal(data.total || 0);
   setSelected(new Set());
   loadHistory();
  } catch (e: any) {
   toast.error(e.message);
  } finally {
   setLoading(false);
  }
 };

 const importSelected = async () => {
  if (selected.size === 0) return;
  setImporting(true);
  try {
   const resp = await fetch(`${FUNC_URL}/pubmed-import`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify({
     pubmed_ids: Array.from(selected),
     specialty_area: specialty,
     tags: selectedTags,
    }),
   });
   const data = await resp.json();
   if (data.error) throw new Error(data.error);
   toast.success(
    `${data.imported?.length || 0} importados${data.skipped?.length ? `, ${data.skipped.length} ya existían` : ""}`
   );
   setSelected(new Set());
   loadImported();
  } catch (e: any) {
   toast.error(e.message);
  } finally {
   setImporting(false);
  }
 };

 const toggleSelect = (pmid: string) => {
  setSelected(prev => {
   const next = new Set(prev);
   next.has(pmid) ? next.delete(pmid) : next.add(pmid);
   return next;
  });
 };

 const selectAll = () => {
  selected.size === results.length
   ? setSelected(new Set())
   : setSelected(new Set(results.map(r => r.pubmed_id)));
 };

 const runBulkImport = async () => {
  cancelRef.current = false;
  setBulkRunning(true);
  const activeTopics = BULK_TOPICS.filter(t => bulkTopics.has(t.id));
  const allLogs: BulkLog[] = [];
  for (const topic of activeTopics) {
   for (const q of topic.queries) {
    allLogs.push({
     topic: topic.label,
     query: q,
     status: "pending",
     found: 0,
     imported: 0,
    });
   }
  }
  setBulkLogs([...allLogs]);
  let totalImported = 0;

  for (let i = 0; i < allLogs.length; i++) {
   if (cancelRef.current) break;
   const log = allLogs[i];
   const topic = activeTopics.find(t => t.label === log.topic)!;
   log.status = "searching";
   setBulkLogs([...allLogs]);
   try {
    const searchResp = await fetch(`${FUNC_URL}/pubmed-search`, {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON}`,
     },
     body: JSON.stringify({
      query: log.query,
      filters: {},
      page: 0,
      limit: bulkLimit,
     }),
    });
    const searchData = await searchResp.json();
    if (searchData.error) throw new Error(searchData.error);
    const ids: string[] = (searchData.results || []).map(
     (r: any) => r.pubmed_id
    );
    log.found = ids.length;
    if (ids.length === 0) {
     log.status = "done";
     setBulkLogs([...allLogs]);
     continue;
    }
    if (cancelRef.current) break;
    log.status = "importing";
    setBulkLogs([...allLogs]);
    const importResp = await fetch(`${FUNC_URL}/pubmed-import`, {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON}`,
     },
     body: JSON.stringify({
      pubmed_ids: ids,
      specialty_area: topic.specialty,
      tags: topic.tags,
     }),
    });
    const importData = await importResp.json();
    if (importData.error) throw new Error(importData.error);
    log.imported = importData.imported?.length || 0;
    totalImported += log.imported;
    log.status = "done";
   } catch (e: any) {
    log.status = "error";
    log.error = e.message;
   }
   setBulkLogs([...allLogs]);
   if (i < allLogs.length - 1 && !cancelRef.current)
    await new Promise(r => setTimeout(r, 400));
  }
  setBulkRunning(false);
  loadImported();
  toast.success(
   `Recopilación completada: ${totalImported} papers nuevos importados`
  );
 };

 const toggleBulkTopic = (id: string) => {
  setBulkTopics(prev => {
   const next = new Set(prev);
   next.has(id) ? next.delete(id) : next.add(id);
   return next;
  });
 };

 const bulkDone = bulkLogs.filter(
  l => l.status === "done" || l.status === "error"
 ).length;
 const bulkProgress =
  bulkLogs.length > 0 ? (bulkDone / bulkLogs.length) * 100 : 0;
 const bulkTotalImported = bulkLogs.reduce((s, l) => s + l.imported, 0);
 const bulkTotalFound = bulkLogs.reduce((s, l) => s + l.found, 0);
 const totalPages = Math.ceil(total / 20);

 return (
  <div className="space-y-6 p-4 md:p-6">
   {!hideHeader && (
    <div>
     <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
      <BookOpen className="h-6 w-6 text-primary" />
      Biblioteca Inteligente PubMed
     </h1>
     <p className="text-sm text-muted-foreground mt-1">
      Busca, importa y organiza papers de PubMed directamente en Resp
      Academy
     </p>
    </div>
   )}

   <Tabs value={tab} onValueChange={setTab}>
    <TabsList>
     <TabsTrigger value="search" className="gap-1.5">
      <Search className="h-3.5 w-3.5" /> Buscar
     </TabsTrigger>
     <TabsTrigger value="bulk" className="gap-1.5">
      <Zap className="h-3.5 w-3.5" /> Recopilación Masiva
     </TabsTrigger>
     <TabsTrigger value="history" className="gap-1.5">
      <History className="h-3.5 w-3.5" /> Búsquedas
     </TabsTrigger>
     <TabsTrigger value="imported" className="gap-1.5">
      <Download className="h-3.5 w-3.5" /> Importados (
      {importedDocs.length})
     </TabsTrigger>
    </TabsList>

    {/* SEARCH TAB */}
    <TabsContent value="search" className="space-y-4">
     <Card>
      <CardContent className="p-4 space-y-3">
       <form
        onSubmit={e => {
         e.preventDefault();
         search(0);
        }}
        className="flex gap-2"
       >
        <Input
         value={query}
         onChange={e => setQuery(e.target.value)}
         placeholder='Ej: "lung ultrasound ARDS"'
         className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()}>
         {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
          <Search className="h-4 w-4" />
         )}
         <span className="ml-1.5 hidden sm:inline">Buscar</span>
        </Button>
        <Button
         type="button"
         variant="outline"
         size="icon"
         onClick={() => setShowFilters(!showFilters)}
        >
         <Filter className="h-4 w-4" />
        </Button>
       </form>
       {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-border">
         <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
           Autor
          </label>
          <Input
           value={filterAuthor}
           onChange={e => setFilterAuthor(e.target.value)}
           placeholder="Apellido"
          />
         </div>
         <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
           Revista
          </label>
          <Input
           value={filterJournal}
           onChange={e => setFilterJournal(e.target.value)}
           placeholder="Journal name"
          />
         </div>
         <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
           Idioma
          </label>
          <Select value={filterLang} onValueChange={setFilterLang}>
           <SelectTrigger>
            <SelectValue placeholder="Todos" />
           </SelectTrigger>
           <SelectContent>
            <SelectItem value="none">Todos</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="french">Français</SelectItem>
            <SelectItem value="portuguese">Português</SelectItem>
           </SelectContent>
          </Select>
         </div>
         <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
           Desde (AAAA/MM)
          </label>
          <Input
           value={filterDateFrom}
           onChange={e => setFilterDateFrom(e.target.value)}
           placeholder="2020/01"
          />
         </div>
         <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
           Hasta (AAAA/MM)
          </label>
          <Input
           value={filterDateTo}
           onChange={e => setFilterDateTo(e.target.value)}
           placeholder="2025/12"
          />
         </div>
        </div>
       )}
      </CardContent>
     </Card>

     {results.length > 0 && (
      <Card>
       <CardContent className="p-3 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={selectAll}>
         {selected.size === results.length
          ? "Deseleccionar todo"
          : "Seleccionar todo"}
        </Button>
        <Select value={specialty} onValueChange={setSpecialty}>
         <SelectTrigger className="w-48 h-8 text-xs">
          <Tag className="h-3 w-3 mr-1" />
          <SelectValue />
         </SelectTrigger>
         <SelectContent>
          {SPECIALTY_OPTIONS.map(o => (
           <SelectItem key={o.value} value={o.value}>
            {o.label}
           </SelectItem>
          ))}
         </SelectContent>
        </Select>
        <div className="flex gap-1 flex-wrap">
         {RELEVANCE_TAGS.map(t => (
          <Badge
           key={t}
           variant={selectedTags.includes(t) ? "default" : "outline"}
           className="cursor-pointer text-[10px]"
           onClick={() =>
            setSelectedTags(prev =>
             prev.includes(t)
              ? prev.filter(x => x !== t)
              : [...prev, t]
            )
           }
          >
           {t}
          </Badge>
         ))}
        </div>
        <Button
         size="sm"
         disabled={selected.size === 0 || importing}
         onClick={importSelected}
         className="ml-auto"
        >
         {importing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
         ) : (
          <Download className="h-3.5 w-3.5 mr-1" />
         )}
         Importar {selected.size > 0 ? `(${selected.size})` : ""}
        </Button>
       </CardContent>
      </Card>
     )}

     {total > 0 && (
      <p className="text-xs text-muted-foreground">
       {total.toLocaleString()} resultados · Página {page + 1} de{" "}
       {totalPages}
      </p>
     )}

     <ScrollArea className="max-h-[60vh]">
      <div className="space-y-2">
       {results.map(r => (
        <Card
         key={r.pubmed_id}
         className={`transition-colors ${selected.has(r.pubmed_id) ? "border-primary/50 bg-primary/5" : ""}`}
        >
         <CardContent className="p-3 flex gap-3">
          <Checkbox
           checked={selected.has(r.pubmed_id)}
           onCheckedChange={() => toggleSelect(r.pubmed_id)}
           className="mt-1"
          />
          <div className="flex-1 min-w-0 space-y-1">
           <h3 className="text-sm font-medium leading-snug line-clamp-2">
            {r.title}
           </h3>
           <p className="text-xs text-muted-foreground line-clamp-1">
            {r.authors.slice(0, 3).join(", ")}
            {r.authors.length > 3 ? " et al." : ""}
           </p>
           <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            <span>{r.journal}</span>
            <span>·</span>
            <span>{r.publication_date}</span>
            {r.doi && (
             <>
              <span>·</span>
              <span>DOI: {r.doi}</span>
             </>
            )}
            <span>·</span>
            <span>PMID: {r.pubmed_id}</span>
           </div>
           {r.article_type && (
            <Badge variant="secondary" className="text-[10px]">
             {r.article_type}
            </Badge>
           )}
          </div>
          <a
           href={r.pubmed_url}
           target="_blank"
           rel="noopener noreferrer"
           className="shrink-0 inline-flex"
          >
           <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
         </CardContent>
        </Card>
       ))}
      </div>
     </ScrollArea>

     {totalPages > 1 && (
      <div className="flex items-center justify-center gap-2">
       <Button
        variant="outline"
        size="sm"
        disabled={page === 0 || loading}
        onClick={() => search(page - 1)}
       >
        <ChevronLeft className="h-4 w-4" />
       </Button>
       <span className="text-xs text-muted-foreground">
        Pág. {page + 1}/{totalPages}
       </span>
       <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1 || loading}
        onClick={() => search(page + 1)}
       >
        <ChevronRight className="h-4 w-4" />
       </Button>
      </div>
     )}
    </TabsContent>

    {/* BULK TAB */}
    <TabsContent value="bulk" className="space-y-4">
     <Card>
      <CardHeader className="pb-3">
       <CardTitle className="text-base flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        Recopilación Masiva de Papers
       </CardTitle>
       <p className="text-xs text-muted-foreground">
        Busca e importa automáticamente papers de PubMed sobre las áreas
        clínicas seleccionadas. Cada tema ejecuta múltiples búsquedas
        especializadas.
       </p>
      </CardHeader>
      <CardContent className="space-y-4">
       <div className="space-y-2">
        <label className="text-sm font-medium">Áreas a recopilar</label>
        <div className="flex flex-wrap gap-2">
         {BULK_TOPICS.map(t => (
          <Badge
           key={t.id}
           variant={bulkTopics.has(t.id) ? "default" : "outline"}
           className="cursor-pointer text-xs px-3 py-1"
           onClick={() => !bulkRunning && toggleBulkTopic(t.id)}
          >
           {t.label} ({t.queries.length} búsquedas)
          </Badge>
         ))}
        </div>
       </div>
       <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground whitespace-nowrap">
         Papers por búsqueda:
        </label>
        <Select
         value={String(bulkLimit)}
         onValueChange={v => setBulkLimit(Number(v))}
         disabled={bulkRunning}
        >
         <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="200">200</SelectItem>
         </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">
         Hasta{" "}
         {bulkTopics.size > 0
          ? BULK_TOPICS.filter(t => bulkTopics.has(t.id)).reduce(
            (s, t) => s + t.queries.length,
            0
           ) * bulkLimit
          : 0}{" "}
         papers potenciales
        </span>
       </div>
       <div className="flex gap-2">
        <Button
         onClick={runBulkImport}
         disabled={bulkRunning || bulkTopics.size === 0}
         className="gap-2"
        >
         {bulkRunning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
          <Zap className="h-4 w-4" />
         )}
         {bulkRunning ? "Recopilando..." : "Iniciar Recopilación"}
        </Button>
        {bulkRunning && (
         <Button
          variant="destructive"
          size="sm"
          onClick={() => {
           cancelRef.current = true;
          }}
         >
          Cancelar
         </Button>
        )}
       </div>

       {bulkLogs.length > 0 && (
        <div className="space-y-3">
         <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
           <span>
            {bulkDone}/{bulkLogs.length} búsquedas completadas
           </span>
           <span>
            {bulkTotalImported} importados / {bulkTotalFound}{" "}
            encontrados
           </span>
          </div>
          <Progress value={bulkProgress} className="h-2" />
         </div>
         <ScrollArea className="max-h-[45vh]">
          <div className="space-y-1">
           {bulkLogs.map((log, i) => (
            <div
             key={i}
             className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded ${log.status === "searching" || log.status === "importing" ? "bg-primary/10" : log.status === "error" ? "bg-destructive/10" : log.status === "done" ? "bg-muted/50" : ""}`}
            >
             {log.status === "pending" && (
              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
             )}
             {(log.status === "searching" ||
              log.status === "importing") && (
              <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
             )}
             {log.status === "done" && (
              <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
             )}
             {log.status === "error" && (
              <XCircle className="h-3 w-3 text-destructive shrink-0" />
             )}
             <Badge
              variant="outline"
              className="text-[10px] shrink-0"
             >
              {log.topic}
             </Badge>
             <span className="truncate flex-1">{log.query}</span>
             {log.status === "searching" && (
              <span className="text-muted-foreground shrink-0">
               Buscando...
              </span>
             )}
             {log.status === "importing" && (
              <span className="text-muted-foreground shrink-0">
               Importando {log.found}...
              </span>
             )}
             {log.status === "done" && (
              <span className="text-muted-foreground shrink-0">
               {log.found} encontrados · {log.imported} nuevos
              </span>
             )}
             {log.status === "error" && (
              <span className="text-destructive shrink-0">
               {log.error}
              </span>
             )}
            </div>
           ))}
          </div>
         </ScrollArea>
        </div>
       )}
      </CardContent>
     </Card>
    </TabsContent>

    {/* HISTORY TAB */}
    <TabsContent value="history" className="space-y-2">
     {history.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-8">
       No hay búsquedas recientes
      </p>
     ) : (
      history.map(h => (
       <Card key={h.id}>
        <CardContent className="p-3 flex items-center justify-between">
         <div>
          <p className="text-sm font-medium">{h.query_text}</p>
          <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
           <span>
            <Clock className="inline h-3 w-3 mr-0.5" />
            {new Date(h.searched_at).toLocaleString()}
           </span>
           <span>{h.total_results.toLocaleString()} resultados</span>
          </div>
         </div>
         <Button
          variant="ghost"
          size="sm"
          onClick={() => {
           setQuery(h.query_text);
           setTab("search");
          }}
         >
          <Search className="h-3.5 w-3.5" />
         </Button>
        </CardContent>
       </Card>
      ))
     )}
    </TabsContent>

    {/* IMPORTED TAB */}
    <TabsContent value="imported" className="space-y-2">
     {importedDocs.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center py-8">
       No hay papers importados aún
      </p>
     ) : (
      importedDocs.map((doc: any) => (
       <Card key={doc.id}>
        <CardContent className="p-3 space-y-1">
         <h3 className="text-sm font-medium leading-snug line-clamp-2">
          {doc.title}
         </h3>
         <p className="text-xs text-muted-foreground">{doc.authors}</p>
         <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          {doc.journal && <span>{doc.journal}</span>}
          {doc.publication_date && (
           <>
            <span>·</span>
            <span>{doc.publication_date}</span>
           </>
          )}
          {doc.pubmed_id && (
           <>
            <span>·</span>
            <span>PMID: {doc.pubmed_id}</span>
           </>
          )}
          {doc.doi && (
           <>
            <span>·</span>
            <span>DOI: {doc.doi}</span>
           </>
          )}
         </div>
         <div className="flex gap-1 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">
           {doc.specialty_area}
          </Badge>
          {(Array.isArray(doc.tags) ? doc.tags : []).map(
           (t: string) => (
            <Badge
             key={t}
             variant="outline"
             className="text-[10px]"
            >
             {t}
            </Badge>
           )
          )}
         </div>
         {doc.abstract && (
          <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
           {doc.abstract}
          </p>
         )}
        </CardContent>
       </Card>
      ))
     )}
    </TabsContent>
   </Tabs>
  </div>
 );
}
