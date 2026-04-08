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
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SPECIALTY_OPTIONS = [
  { value: "critical_care", label: "Cuidados Críticos" },
  { value: "lus", label: "Ecografía Pulmonar" },
  { value: "vm", label: "Ventilación Mecánica" },
  { value: "rx", label: "Radiología Torácica" },
  { value: "ards", label: "ARDS" },
  { value: "weaning", label: "Destete VM" },
  { value: "mixed", label: "General" },
];

const RELEVANCE_TAGS = [
  "Cochrane",
  "Revisión Sistemática",
  "LUS",
  "VM",
  "RX",
  "Evidencia",
];

const BULK_TOPICS = [
  {
    id: "vm",
    label: "Ventilación Mecánica",
    specialty: "vm",
    tags: ["Cochrane", "VM"],
    queries: [
      "mechanical ventilation critically ill",
      "protective ventilation ARDS",
      "PEEP titration acute respiratory",
      "prone positioning ventilation",
      "non-invasive ventilation respiratory failure",
    ],
  },
  {
    id: "lus",
    label: "Ultrasonido Pulmonar",
    specialty: "lus",
    tags: ["Cochrane", "LUS"],
    queries: [
      "lung ultrasound point-of-care",
      "lung ultrasound intensive care unit",
      "lung ultrasound pneumonia diagnosis",
      "lung ultrasound pleural effusion",
      "diaphragm ultrasound weaning",
    ],
  },
  {
    id: "rx",
    label: "Radiografía de Tórax",
    specialty: "rx",
    tags: ["Cochrane", "RX"],
    queries: [
      "chest X-ray radiography diagnosis",
      "chest radiograph intensive care pneumonia",
      "portable chest radiograph ICU",
      "chest x-ray ARDS acute respiratory",
      "chest radiograph pulmonary edema",
    ],
  },
  {
    id: "weaning",
    label: "Destete Ventilatorio",
    specialty: "weaning",
    tags: ["Cochrane", "VM", "Destete"],
    queries: [
      "weaning mechanical ventilation liberation",
      "spontaneous breathing trial",
      "extubation failure prediction",
      "ventilator weaning protocol",
    ],
  },
];

type CochraneResult = {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi?: string;
  abstract?: string;
  url: string;
  type: string;
};

type BulkLog = {
  topic: string;
  query: string;
  status: "pending" | "searching" | "importing" | "done" | "error";
  found: number;
  imported: number;
  error?: string;
};

export default function CochraneSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CochraneResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [specialty, setSpecialty] = useState("critical_care");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Cochrane",
    "Revisión Sistemática",
  ]);
  const [importedDocs, setImportedDocs] = useState<any[]>([]);
  const [tab, setTab] = useState("search");

  const [filterDateFrom, setFilterDateFrom] = useState("2015");
  const [filterDateTo, setFilterDateTo] = useState("2025");
  const [showFilters, setShowFilters] = useState(false);

  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkLogs, setBulkLogs] = useState<BulkLog[]>([]);
  const [bulkTopics, setBulkTopics] = useState<Set<string>>(
    new Set(BULK_TOPICS.map(t => t.id))
  );
  const [bulkLimit, setBulkLimit] = useState(30);
  const cancelRef = useRef(false);

  useEffect(() => {
    loadImported();
  }, []);

  const loadImported = async () => {
    const { data } = await supabase
      .from("knowledge_documents")
      .select("*")
      .eq("source", "Cochrane Library")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setImportedDocs(data);
  };

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const { data, error } = await supabase.functions.invoke(
        "cochrane-search",
        {
          body: {
            queries: [query.trim()],
            maxResults: 50,
            autoImport: false,
            dateFrom: filterDateFrom,
            dateTo: filterDateTo,
          },
        }
      );

      if (error) throw error;

      if (data.success) {
        setResults(data.results || []);
        setTotal(data.total_found || 0);
        setSelected(new Set());
      } else {
        throw new Error(data.error || "Error en búsqueda");
      }
    } catch (e: any) {
      toast.error(e.message || "Error buscando en Cochrane");
    } finally {
      setLoading(false);
    }
  };

  const importSelected = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const selectedResults = results.filter(r => selected.has(r.id));

      let importedCount = 0;
      for (const result of selectedResults) {
        // Check if already exists
        const { data: existing } = await supabase
          .from("knowledge_documents")
          .select("id")
          .or(
            `title.ilike.%${result.title.substring(0, 50)}%,doi.eq.${result.doi || "none"}`
          )
          .limit(1);

        if (existing && existing.length > 0) continue;

        // Insert document
        const { error: insertError } = await supabase
          .from("knowledge_documents")
          .insert({
            title: result.title,
            authors: result.authors.join(", "),
            doi: result.doi || null,
            abstract: result.abstract || null,
            summary: result.abstract || null,
            publication_date: result.publicationDate || null,
            publication_year: result.publicationDate
              ? parseInt(result.publicationDate.split("-")[0])
              : null,
            document_type: "guideline",
            specialty_area: specialty,
            source: "Cochrane Library",
            import_source: "cochrane_manual",
            article_type: result.type,
            tags: selectedTags,
            file_url: result.url || null,
          });

        if (!insertError) importedCount++;
      }

      toast.success(`${importedCount} documentos importados`);
      setSelected(new Set());
      loadImported();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setImporting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    selected.size === results.length
      ? setSelected(new Set())
      : setSelected(new Set(results.map(r => r.id)));
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
        const { data, error } = await supabase.functions.invoke(
          "cochrane-search",
          {
            body: {
              queries: [log.query],
              maxResults: bulkLimit,
              autoImport: true,
            },
          }
        );

        if (error) throw error;

        log.found = data.total_found || 0;
        log.imported = data.imported_count || 0;
        totalImported += log.imported;
        log.status = "done";
      } catch (e: any) {
        log.status = "error";
        log.error = e.message;
      }
      setBulkLogs([...allLogs]);
      if (i < allLogs.length - 1 && !cancelRef.current)
        await new Promise(r => setTimeout(r, 600));
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

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="search" className="gap-1.5">
            <Search className="h-3.5 w-3.5" /> Buscar
          </TabsTrigger>
          <TabsTrigger value="bulk" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Recopilación Masiva
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
                  search();
                }}
                className="flex gap-2"
              >
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder='Ej: "mechanical ventilation ARDS"'
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Desde (año)
                    </label>
                    <Input
                      value={filterDateFrom}
                      onChange={e => setFilterDateFrom(e.target.value)}
                      placeholder="2015"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Hasta (año)
                    </label>
                    <Input
                      value={filterDateTo}
                      onChange={e => setFilterDateTo(e.target.value)}
                      placeholder="2025"
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
              {total.toLocaleString()} resultados encontrados
            </p>
          )}

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2">
              {results.map(r => (
                <Card
                  key={r.id}
                  className={`transition-colors ${selected.has(r.id) ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-3 flex gap-3">
                    <Checkbox
                      checked={selected.has(r.id)}
                      onCheckedChange={() => toggleSelect(r.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-medium leading-snug line-clamp-2">
                        {r.title}
                      </h3>
                      {r.authors?.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {r.authors.slice(0, 3).join(", ")}
                          {r.authors.length > 3 ? " et al." : ""}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        <span>Cochrane Library</span>
                        {r.publicationDate && (
                          <>
                            <span>·</span>
                            <span>{r.publicationDate}</span>
                          </>
                        )}
                        {r.doi && (
                          <>
                            <span>·</span>
                            <span>DOI: {r.doi}</span>
                          </>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {r.type || "Cochrane Review"}
                      </Badge>
                    </div>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* BULK TAB */}
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Recopilación Masiva Cochrane
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Importa automáticamente revisiones sistemáticas de Cochrane
                sobre los temas seleccionados
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BULK_TOPICS.map(t => (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      bulkTopics.has(t.id)
                        ? "bg-primary/10 border-primary/30"
                        : "bg-background border-border hover:border-primary/20"
                    }`}
                  >
                    <Checkbox
                      checked={bulkTopics.has(t.id)}
                      onCheckedChange={() => toggleBulkTopic(t.id)}
                      disabled={bulkRunning}
                    />
                    <span className="text-xs font-medium">{t.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Papers por consulta
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
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={runBulkImport}
                  disabled={bulkRunning || bulkTopics.size === 0}
                  className="ml-auto"
                >
                  {bulkRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Iniciar Recopilación
                    </>
                  )}
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
                <>
                  <Progress value={bulkProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {bulkDone}/{bulkLogs.length} consultas
                    </span>
                    <span>
                      {bulkTotalFound} encontrados · {bulkTotalImported}{" "}
                      importados
                    </span>
                  </div>
                  <ScrollArea className="h-48 border border-border rounded-lg">
                    <div className="p-2 space-y-1">
                      {bulkLogs.map((log, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-muted/30"
                        >
                          {log.status === "pending" && (
                            <div className="h-3 w-3 rounded-full bg-muted" />
                          )}
                          {log.status === "searching" && (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          )}
                          {log.status === "importing" && (
                            <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                          )}
                          {log.status === "done" && (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          )}
                          {log.status === "error" && (
                            <XCircle className="h-3 w-3 text-destructive" />
                          )}
                          <span className="font-medium text-muted-foreground">
                            [{log.topic}]
                          </span>
                          <span className="flex-1 truncate">{log.query}</span>
                          {log.status === "done" && (
                            <span className="text-muted-foreground">
                              +{log.imported}
                            </span>
                          )}
                          {log.status === "error" && (
                            <span className="text-destructive truncate max-w-32">
                              {log.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMPORTED TAB */}
        <TabsContent value="imported" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Documentos Cochrane Importados ({importedDocs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2">
                  {importedDocs.map(doc => (
                    <Card key={doc.id} className="bg-muted/30">
                      <CardContent className="p-3 space-y-1">
                        <h4 className="text-sm font-medium line-clamp-2">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {doc.authors}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{doc.source}</span>
                          {doc.publication_year && (
                            <>
                              <span>·</span>
                              <span>{doc.publication_year}</span>
                            </>
                          )}
                          {doc.doi && (
                            <a
                              href={`https://doi.org/${doc.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              DOI
                            </a>
                          )}
                        </div>
                        <div className="flex gap-1 pt-1">
                          {((doc.tags as string[]) || [])
                            .slice(0, 4)
                            .map((t: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-[9px]"
                              >
                                {t}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {importedDocs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay documentos Cochrane importados aún
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
