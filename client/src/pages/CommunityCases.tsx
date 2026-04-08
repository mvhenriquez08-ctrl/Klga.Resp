import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
 CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Users,
 MessageSquare,
 Share2,
 Heart,
 Bot,
 Search,
 Filter,
 PlusCircle,
 TrendingUp,
 Stethoscope,
 Activity,
 FileImage,
 ChevronRight,
 MoreVertical,
 ThumbsUp,
 Plus,
 ArrowUpRight,
 Loader2,
 X,
 Image,
 AlertCircle,
 Check,
} from "lucide-react";

import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Case = {
 id: string;
 author: string;
 specialty: string;
 date: string;
 title: string;
 description: string;
 findings: string[];
 ai_summary: string;
 imageUrl?: string;
 category: "LUS" | "VMI" | "RX" | "ECG";
 likes: number;
 comments: number;
};

export default function CommunityCases() {
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState("all");
 const [cases, setCases] = useState<Case[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchCases();
 }, []);

 const fetchCases = async () => {
  try {
   setLoading(true);
   const { data, error } = await supabase
    .from("community_cases")
    .select("*")
    .order("created_at", { ascending: false });

   if (error) {
    console.error("Error fetching cases:", error);
    return;
   }

   if (data) {
    const formattedData = data.map((item: any) => ({
     ...item,
     date: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : "Reciente",
     findings: Array.isArray(item.findings)
      ? item.findings
      : JSON.parse(item.findings || "[]"),
    }));
    setCases(formattedData as Case[]);
   }
  } catch (error) {
   console.error("Fetch error:", error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
        <Users className="h-5 w-5 text-blue-400" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        CASOS COMUNITARIOS
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60 max-w-lg">
       Intercambio de conocimiento clínico avanzado potenciado por IA.
      </p>
     </motion.div>
     <Dialog>
      <DialogTrigger asChild>
       <Button className="bg-white/10 hover:bg-white/20 text-white font-display font-bold h-12 px-6 rounded-2xl border border-white/20 backdrop-blur-sm transition-all shadow-xl">
        <PlusCircle className="w-5 h-5 mr-2" /> Compartir Hallazgo
       </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl rounded-[2.5rem] p-8">
       <DialogHeader>
        <DialogTitle className="text-2xl font-display font-bold tracking-tighter uppercase">
         Nuevo Caso Clínico
        </DialogTitle>
        <CardDescription className="text-slate-400">
         Comparte tu hallazgo con la comunidad Resp Academy.
        </CardDescription>
       </DialogHeader>
       <CaseForm onComplete={() => fetchCases()} />
      </DialogContent>
     </Dialog>
    </div>
   </div>

   <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
    <div className="grid lg:grid-cols-12 gap-8">
     {/* Left Sidebar - Filters */}
     <aside className="lg:col-span-3 space-y-6">
      <div className="space-y-2">
       <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <Filter className="w-3 h-3" /> Filtrar Especialidad
       </h3>
       <nav className="space-y-1">
        {["all", "LUS", "VMI", "RX", "ECG"].map(cat => (
         <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${filter === cat ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
         >
          <span className="flex items-center gap-2 capitalize">
           {cat === "all" ? (
            <Activity className="w-4 h-4" />
           ) : cat === "LUS" ? (
            <Stethoscope className="w-4 h-4" />
           ) : cat === "VMI" ? (
            <TrendingUp className="w-4 h-4" />
           ) : (
            <FileImage className="w-4 h-4" />
           )}
           {cat === "all" ? "Todos los casos" : cat}
          </span>
          {filter === cat && <ChevronRight className="w-3 h-3" />}
         </button>
        ))}
       </nav>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-4">
       <h3 className="text-sm font-bold text-white mb-3">
        Trending Topics
       </h3>
       <div className="space-y-4">
        <div className="flex items-center gap-3 group cursor-pointer">
         <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-1.5 py-0.5 text-[8px] font-display font-bold uppercase">
          HOT
         </Badge>
         <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
          #SDRA_PEEP
         </span>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
         <Badge className="bg-blue-500/10 text-blue-400 border-none px-1.5 py-0.5 text-[8px] font-display font-bold uppercase">
          NEW
         </Badge>
         <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
          #BLUE_Protocol_Z4
         </span>
        </div>
       </div>
      </Card>
     </aside>

     {/* Main Feed */}
     <main className="lg:col-span-9 space-y-6">
      {/* Search Bar */}
      <div className="relative group">
       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
       <Input
        placeholder="Buscar casos por patología, autor o hallazgo..."
        className="h-14 pl-12 bg-slate-900 border-slate-800 rounded-2xl focus:ring-blue-500/50"
        value={search}
        onChange={e => setSearch(e.target.value)}
       />
      </div>

      {/* Feed List */}
      <div className="space-y-6">
       {loading ? (
        <div className="flex justify-center items-center py-12">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
       ) : cases.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
         No hay casos registrados aún. ¡Sé el primero en compartir!
        </div>
       ) : (
        cases
         .filter(c => filter === "all" || c.category === filter)
         .map(c => (
          <motion.div
           key={c.id}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
          >
           <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all overflow-hidden group">
            <div className="p-6">
             <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white">
                {c.author.split(" ")[0][0]}
                {c.author.split(" ")[1]?.[0] || ""}
               </div>
               <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                 {c.author}
                </h4>
                <p className="text-[10px] text-slate-500">
                 {c.specialty} · {c.date}
                </p>
               </div>
              </div>
              <Button
               size="icon"
               variant="ghost"
               className="text-slate-500"
              >
               <MoreVertical className="w-4 h-4" />
              </Button>
             </div>

             <div className="space-y-4">
              <div>
               <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600/20 text-blue-400 border-none text-[9px] font-display font-bold uppercase tracking-widest">
                 {c.category}
                </Badge>
                <h2 className="text-xl font-bold text-white tracking-tight">
                 {c.title}
                </h2>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                {c.description}
               </p>
              </div>

              {c.imageUrl && (
               <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-black">
                <img
                 src={c.imageUrl}
                 alt="Case study"
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
               </div>
              )}

              <div className="flex flex-wrap gap-2">
               {c.findings.map(f => (
                <Badge
                 key={f}
                 variant="outline"
                 className="text-[10px] border-white/5 text-slate-400"
                >
                 {f}
                </Badge>
               ))}
              </div>

              {/* AI Insight Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 backdrop-blur-sm">
               <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                 <Bot className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-[10px] font-display font-bold uppercase tracking-widest text-blue-400">
                 PulmoIA Insight
                </h5>
               </div>
               <p className="text-[11px] text-slate-300 leading-normal ">
                "{c.ai_summary}"
               </p>
              </div>
             </div>
            </div>

            <CardFooter className="bg-white/[0.02] border-t border-white/5 px-6 py-4 flex justify-between">
             <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors">
               <Heart className="w-4 h-4" /> {c.likes}
              </button>
              <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors">
               <MessageSquare className="w-4 h-4" /> {c.comments}
              </button>
             </div>
             <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-500 hover:text-white font-bold"
             >
              Detalles del Caso{" "}
              <ChevronRight className="w-4 h-4 ml-1" />
             </Button>
            </CardFooter>
           </Card>
          </motion.div>
         ))
       )}
      </div>
     </main>
    </div>
   </div>
  </div>
 );
}

function CaseForm({ onComplete }: { onComplete: () => void }) {
 const [loading, setLoading] = useState(false);
 const [form, setForm] = useState({
  title: "",
  description: "",
  category: "LUS",
  findings: "",
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
   const { error } = await supabase.from("community_cases").insert([
    {
     ...form,
     findings: form.findings.split(",").map(f => f.trim()),
     author: "Dr. Usuario",
     specialty: "Residente UCI",
     likes: 0,
     comments: 0,
     ai_summary: "Análisis pendiente por PulmoIA",
    },
   ]);

   if (error) throw error;
   toast.success("¡Caso compartido con éxito!");
   onComplete();
   // Cerrar el diálogo es automático si el trigger está fuera, pero aquí necesitamos una forma de cerrarlo si es interno.
   // Shadcn Dialog suele manejarlo bien con el estado o simplemente recargando.
  } catch (err: any) {
   toast.error("Error al compartir: " + err.message);
  } finally {
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
   <div className="space-y-2">
    <Label className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
     Título del Hallazgo
    </Label>
    <Input
     required
     className="bg-slate-800 border-white/5 rounded-xl h-12 text-sm"
     placeholder="Ej: Neumotórax a tensión en Z2"
     value={form.title}
     onChange={e => setForm({ ...form, title: e.target.value })}
    />
   </div>
   <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
     <Label className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
      Categoría
     </Label>
     <Select
      value={form.category}
      onValueChange={v => setForm({ ...form, category: v })}
     >
      <SelectTrigger className="bg-slate-800 border-white/5 rounded-xl h-12">
       <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800 text-white">
       <SelectItem value="LUS">Ecografía (LUS)</SelectItem>
       <SelectItem value="VMI">Ventilación (VMI)</SelectItem>
       <SelectItem value="RX">Radiología (RX)</SelectItem>
       <SelectItem value="ECG">Arritmias (ECG)</SelectItem>
      </SelectContent>
     </Select>
    </div>
    <div className="space-y-2">
     <Label className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
      Hallazgos (separados por coma)
     </Label>
     <Input
      className="bg-slate-800 border-white/5 rounded-xl h-12 text-sm"
      placeholder="Línea pleural, A-lines..."
      value={form.findings}
      onChange={e => setForm({ ...form, findings: e.target.value })}
     />
    </div>
   </div>
   <div className="space-y-2">
    <Label className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
     Descripción Clínica
    </Label>
    <Textarea
     required
     className="bg-slate-800 border-white/5 rounded-2xl min-h-[120px] text-sm"
     placeholder="Describe los detalles relevantes del caso..."
     value={form.description}
     onChange={e => setForm({ ...form, description: e.target.value })}
    />
   </div>
   <Button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 h-14 rounded-2xl font-black uppercase tracking-widest "
   >
    {loading ? (
     <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
     "Publicar Caso Clínico"
    )}
   </Button>
  </form>
 );
}
