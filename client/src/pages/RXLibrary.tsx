import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 rxTechniques,
 rxPathologies,
 rxQualityCriteria,
 rxABCDE,
} from "@/data/radiology";
import { rxGalleryItems, rxGalleryCategories } from "@/data/rxGallery";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";
import {
 FileImage,
 BookOpen,
 CheckCircle,
 Stethoscope,
 ImageIcon,
 X,
 Maximize2,
 Info,
 ChevronRight,
 TrendingUp,
 FileText,
 Zap,
 Bot,
 ListChecks,
 AlertCircle,
 Activity,
} from "lucide-react";
import { PDFPageViewer } from "@/components/radiology/PDFPageViewer";
import { rxPdfItems } from "@/data/pdfLibrary";
import { PulmoIAWidget } from "@/components/PulmoIAWidget";

export default function RXLibrary() {
 const [selectedPath, setSelectedPath] = useState(rxPathologies[0].id);
 const [selectedGalleryCat, setSelectedGalleryCat] = useState("all");
 const [selectedImage, setSelectedImage] = useState<any>(null);
 const [selectedPdf, setSelectedPdf] = useState<any>(null);

 const activePathology = useMemo(
  () => rxPathologies.find(p => p.id === selectedPath) || rxPathologies[0],
  [selectedPath]
 );

 const filteredGallery = useMemo(() => {
  if (selectedGalleryCat === "all") return rxGalleryItems;
  return rxGalleryItems.filter(item => item.category === selectedGalleryCat);
 }, [selectedGalleryCat]);

 return (
  <div className="min-h-full bg-slate-50/30 flex flex-col font-sans">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/20 text-white border-2 border-white/20">
       <FileImage className="h-8 w-8" />
      </div>
      <div>
       <h1 className="text-2xl font-display font-bold text-primary-foreground tracking-tighter uppercase leading-none">
        Biblioteca <span className="text-blue-400">Radiológica</span>
       </h1>
       <p className="text-primary-foreground/60 font-sans font-bold text-xs uppercase tracking-[0.3em] mt-2">
        Atlas de Patrones Torácicos UCI y Referencia Avanzada
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
    <Tabs defaultValue="pathologies" className="space-y-10">
     <div className="flex justify-center">
      <TabsList className="bg-white border-2 border-slate-100 p-1.5 rounded-xl h-auto shadow-sm">
       {[
        {
         value: "pathologies",
         icon: Stethoscope,
         label: "Patologías",
        },
        { value: "systematic", icon: ListChecks, label: "ABCDE" },
        { value: "gallery", icon: ImageIcon, label: "Galería & PDF" },
        { value: "techniques", icon: Zap, label: "Técnicas" },
        { value: "quality", icon: CheckCircle, label: "Calidad" },
       ].map(tab => (
        <TabsTrigger
         key={tab.value}
         value={tab.value}
         className="rounded-xl px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-sans font-bold text-[10px] uppercase tracking-widest flex items-center gap-3"
        >
         <tab.icon className="w-3.5 h-3.5" />
         <span className="hidden sm:inline">{tab.label}</span>
        </TabsTrigger>
       ))}
      </TabsList>
     </div>

     <TabsContent value="systematic">
      <div className="grid md:grid-cols-5 gap-4 mb-8">
       {rxABCDE.map(step => (
        <Card
         key={step.id}
         className="border-muted bg-white/50 hover:border-primary/50 transition-all cursor-default"
        >
         <CardHeader className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
           <Badge className="bg-primary font-sans font-bold text-[10px]">
            {step.id}
           </Badge>
           <ListChecks className="w-3 h-3 text-muted-foreground" />
          </div>
          <CardTitle className="text-xs font-sans font-bold mt-2 uppercase tracking-tighter">
           {step.title.split(" - ")[1]}
          </CardTitle>
         </CardHeader>
         <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
           {step.items.map((item, i) => (
            <p
             key={i}
             className="text-[10px] font-medium text-muted-foreground leading-tight"
            >
             • {item}
            </p>
           ))}
          </div>
          <div className="pt-3 border-t space-y-1.5">
           <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" /> Check-list
           </p>
           {step.checks.map((check, i) => (
            <div
             key={i}
             className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 "
            >
             <div className="w-1 h-1 rounded-full bg-emerald-500" />
             {check}
            </div>
           ))}
          </div>
         </CardContent>
        </Card>
       ))}
      </div>

      <div className="p-10 bg-indigo-900 rounded-xl text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group border-b-8 border-b-indigo-500 transition-all hover:scale-[1.01]">
       <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Bot className="w-48 h-48" />
       </div>
       <div className="p-6 rounded-xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 shrink-0 relative z-10 transition-transform group-hover:rotate-12">
        <Bot className="w-12 h-12" />
       </div>
       <div className="space-y-4 relative z-10">
        <h3 className="text-3xl font-sans font-bold tracking-tighter text-indigo-400 uppercase">
         Interpretación Estructurada
        </h3>
        <p className="text-[11px] text-slate-300 font-bold leading-relaxed max-w-2xl ">
         "La lectura sistemática de una radiografía de tórax previene
         el 'sesgo de satisfacción', donde el clínico deja de buscar
         tras encontrar el primer hallazgo. Siga siempre el orden{" "}
         <span className="text-white font-black underline decoration-indigo-500 underline-offset-4">
          A → B → C → D → E
         </span>{" "}
         para una evaluación exhaustiva."
        </p>
        <div className="flex gap-3">
         <Badge className="bg-indigo-600 text-white font-sans font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-lg">
          TÉCNICA ABCDE
         </Badge>
         <Badge className="bg-emerald-600 text-white font-sans font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-lg">
          GOLD STANDARD
         </Badge>
        </div>
       </div>
      </div>
     </TabsContent>

     <TabsContent value="pathologies">
      <div className="grid lg:grid-cols-12 gap-10">
       <div className="lg:col-span-4 space-y-4">
        <div className="px-2 mb-4">
         <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500 ">
          Atlas de Patologías
         </p>
        </div>
        <div className="grid gap-4">
         {rxPathologies.map(path => (
          <button
           key={path.id}
           className={cn(
            "group flex items-center justify-between p-6 rounded-xl border-2 transition-all relative overflow-hidden text-left",
            selectedPath === path.id
             ? "bg-white border-indigo-600 shadow-2xl scale-[1.03] ring-4 ring-indigo-500/5"
             : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm"
           )}
           onClick={() => setSelectedPath(path.id)}
          >
           <div className="flex items-center gap-4 relative z-10">
            <div
             className={cn(
              "w-2 h-10 rounded-full transition-all",
              selectedPath === path.id
               ? "bg-indigo-600"
               : "bg-slate-200"
             )}
            />
            <span className="font-sans font-bold text-sm tracking-tighter uppercase">
             {path.name}
            </span>
           </div>
           <ChevronRight
            className={cn(
             "w-5 h-5 transition-transform",
             selectedPath === path.id
              ? "text-indigo-600 translate-x-1"
              : "text-slate-300"
            )}
           />
           {selectedPath !== path.id && (
            <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
           )}
          </button>
         ))}
        </div>
       </div>

       <div className="lg:col-span-8">
        <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden relative border-t-8 border-t-indigo-600">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Activity className="w-64 h-64" />
         </div>

         <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="space-y-4">
           <Badge className="bg-indigo-600 text-white px-4 py-1.5 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest border-none shadow-lg">
            HALLAZGOS PATOLÓGICOS
           </Badge>
           <h2 className="text-5xl font-sans font-bold tracking-tighter uppercase text-slate-900 leading-none">
            {activePathology.name}
           </h2>
          </div>
         </CardHeader>
         <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
           <div className="p-10 space-y-12">
            <div className="space-y-6">
             <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
               <Info className="h-4 w-4" />
              </div>
              <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-slate-900 ">
               Definición Clínica
              </h3>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed font-bold ">
              "{activePathology.definition}"
             </p>
            </div>

            <div className="space-y-6">
             <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
               <CheckCircle className="h-4 w-4" />
              </div>
              <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-slate-900 ">
               Signos Radiológicos
              </h3>
             </div>
             <div className="grid gap-3">
              {activePathology.rxFindings.map((sign, i) => (
               <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-xl bg-emerald-50/30 border-2 border-emerald-100/50 text-emerald-950 transition-all hover:bg-white hover:shadow-xl hover:border-emerald-300 group"
               >
                <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                 <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs font-sans font-bold tracking-tight">
                 {sign}
                </p>
               </div>
              ))}
             </div>
            </div>
           </div>
           <div className="bg-slate-900 flex items-center justify-center p-6 min-h-[500px] relative group overflow-hidden">
            {activePathology.imageUrl ? (
             <>
              <img
               src={activePathology.imageUrl}
               alt={activePathology.name}
               className="w-full h-full object-contain rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-10 right-10">
               <Button
                variant="secondary"
                size="lg"
                className="rounded-xl font-sans font-bold text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
                onClick={() =>
                 setSelectedImage({
                  url: activePathology.imageUrl,
                  title: activePathology.name,
                 })
                }
               >
                <Maximize2 className="h-4 w-4 mr-3" /> Expandir
                Detalle
               </Button>
              </div>
             </>
            ) : (
             <div className="text-slate-700 text-center space-y-4">
              <ImageIcon className="h-16 w-16 mx-auto stroke-1 opacity-20" />
              <p className="text-[10px] uppercase font-sans font-bold tracking-widest opacity-30">
               Imagen no disponible para {activePathology.name}
              </p>
             </div>
            )}
           </div>
          </div>
         </CardContent>
        </Card>
       </div>
      </div>
     </TabsContent>

     <TabsContent value="gallery" className="space-y-10">
      <div className="grid md:grid-cols-3 gap-8">
       {rxPdfItems.map(item => (
        <Card
         key={item.id}
         className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all rounded-xl border-2 border-slate-100 bg-white border-t-8 border-t-indigo-600"
         onClick={() => setSelectedPdf(item)}
        >
         <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
          <PDFPageViewer url={item.url} page={1} width={400} />
          <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
         <CardContent className="p-8 space-y-4">
          <div className="flex justify-between items-center">
           <Badge className="bg-slate-100 text-slate-500 border-none font-sans font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
            {item.category}
           </Badge>
          </div>
          <h4 className="font-sans font-bold text-xl line-clamp-2 tracking-tighter text-slate-900 uppercase">
           {item.title}
          </h4>
          <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed">
           "{item.description}"
          </p>
          <Button
           variant="ghost"
           size="sm"
           className="w-full mt-4 h-12 text-[10px] font-sans font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all"
          >
           Ver Documento Clínico{" "}
           <FileText className="w-4 h-4 ml-2" />
          </Button>
         </CardContent>
        </Card>
       ))}
      </div>

      <Dialog
       open={!!selectedPdf}
       onOpenChange={() => setSelectedPdf(null)}
      >
       <DialogContent className="max-w-6xl h-[95vh] p-0 overflow-hidden rounded-xl">
        {selectedPdf && (
         <div className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b bg-muted/10">
           <div className="flex justify-between items-center">
            <div>
             <DialogTitle className="text-2xl font-sans font-bold tracking-tighter uppercase text-slate-800">
              {selectedPdf.title}
             </DialogTitle>
             <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
              {selectedPdf.category}
             </p>
            </div>
            <Button
             variant="ghost"
             size="icon"
             onClick={() => setSelectedPdf(null)}
             className="rounded-full"
            >
             <X className="w-5 h-5" />
            </Button>
           </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-slate-100 p-8">
           <div className="max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-200">
            <PDFPageViewer
             url={selectedPdf.url}
             width={1200}
             page={1}
            />
           </div>
          </div>
         </div>
        )}
       </DialogContent>
      </Dialog>
     </TabsContent>

     <TabsContent value="techniques" className="space-y-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
       {rxTechniques.map((tech, i) => (
        <Card
         key={i}
         className="group rounded-xl border-2 border-slate-100 bg-white hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl relative overflow-hidden border-t-4 border-t-indigo-600"
        >
         <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
           <div className="p-3 rounded-2xl bg-white shadow-xl shadow-amber-500/5 border border-amber-100">
            <Zap className="h-5 w-5 text-amber-500" />
           </div>
           <CardTitle className="text-sm font-sans font-bold uppercase tracking-tighter text-slate-900">
            {tech.name}
           </CardTitle>
          </div>
         </CardHeader>
         <CardContent className="p-8 space-y-6">
          <p className="text-xs font-bold text-slate-500 leading-relaxed ">
           "{tech.description}"
          </p>
          <div className="space-y-4">
           <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-indigo-600 ">
            Indicaciones Principales
           </p>
           <div className="flex flex-wrap gap-2">
            {tech.indications.map((ind, j) => (
             <Badge
              key={j}
              variant="outline"
              className="text-[9px] font-sans font-bold border-slate-200 px-4 py-1 rounded-full text-slate-600 uppercase tracking-tighter"
             >
              {ind}
             </Badge>
            ))}
           </div>
          </div>
         </CardContent>
        </Card>
       ))}
      </div>
     </TabsContent>

     <TabsContent value="quality" className="space-y-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
       {rxQualityCriteria.map((criterion, i) => (
        <Card
         key={i}
         className="group rounded-xl border-2 border-slate-100 bg-white hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-xl overflow-hidden flex flex-col"
        >
         <CardHeader className="p-8 flex flex-row items-center gap-5 space-y-0 border-b bg-slate-50/30">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white font-sans font-bold text-xl border-2 border-white/20">
           {i + 1}
          </div>
          <div>
           <CardTitle className="text-sm font-sans font-bold uppercase tracking-widest text-slate-900 ">
            {criterion.name}
           </CardTitle>
           <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-sans font-bold text-[9px] uppercase px-3 py-1 rounded-full mt-1">
            Control de Calidad
           </Badge>
          </div>
         </CardHeader>
         <CardContent className="p-8 space-y-8 flex-1">
          <div className="space-y-4">
           <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-3 ">
            <CheckCircle className="w-4 h-4" /> Criterio Óptimo
           </p>
           <p className="text-xs text-slate-700 font-bold leading-relaxed border-l-4 border-emerald-500/20 pl-4">
            "{criterion.adequate}"
           </p>
          </div>
          <div className="space-y-4 pt-8 border-t border-slate-50">
           <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500 flex items-center gap-3 ">
            <AlertCircle className="w-4 h-4" /> Signo Deficiente
           </p>
           <p className="text-xs text-slate-500 font-bold leading-relaxed border-l-4 border-red-500/20 pl-4">
            "{criterion.inadequate}"
           </p>
          </div>
         </CardContent>
        </Card>
       ))}
      </div>
     </TabsContent>
    </Tabs>

    <Dialog
     open={!!selectedImage}
     onOpenChange={() => setSelectedImage(null)}
    >
     <DialogContent className="max-w-4xl bg-slate-950 border-none p-0 overflow-hidden rounded-3xl">
      {selectedImage && (
       <div className="relative">
        <Button
         variant="ghost"
         size="icon"
         className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
         onClick={() => setSelectedImage(null)}
        >
         <X className="h-5 w-5" />
        </Button>
        <img
         src={selectedImage.url}
         alt={selectedImage.title}
         className="w-full h-auto"
        />
        <div className="p-6 bg-black/60 backdrop-blur-md absolute bottom-0 inset-x-0">
         <h4 className="text-white font-sans font-bold uppercase tracking-tighter text-xl">
          {selectedImage.title}
         </h4>
         <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
          Referencia Radiológica Avanzada
         </p>
        </div>
       </div>
      )}
     </DialogContent>
    </Dialog>
    <PulmoIAWidget context="rx_library" />
   </div>
  </div>
 );
}

function cn(...classes: string[]) {
 return classes.filter(Boolean).join(" ");
}
