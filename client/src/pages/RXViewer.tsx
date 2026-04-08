import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { rxQualityCriteria } from "@/data/radiology";
import {
 FileImage,
 ZoomIn,
 ZoomOut,
 RotateCw,
 Sun,
 Contrast,
 Upload,
 Download,
 Maximize2,
 Crosshair,
 Save,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Marker {
 x: number;
 y: number;
 label: string;
}

export default function RXViewer() {
 const [imageUrl, setImageUrl] = useState<string | null>(null);
 const [zoom, setZoom] = useState(100);
 const [brightness, setBrightness] = useState(100);
 const [contrast, setContrast] = useState(100);
 const [rotation, setRotation] = useState(0);
 const [invert, setInvert] = useState(false);
 const [markers, setMarkers] = useState<Marker[]>([]);
 const [markMode, setMarkMode] = useState(false);
 const [markerLabel, setMarkerLabel] = useState("");
 const [uploading, setUploading] = useState(false);
 const [xrayType, setXrayType] = useState("ap");
 const [notes, setNotes] = useState("");
 const imgContainerRef = useRef<HTMLDivElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleFileUpload = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

   if (!file.type.startsWith("image/")) {
    toast.error("Solo se permiten archivos de imagen");
    return;
   }

   setUploading(true);
   try {
    const ext = file.name.split(".").pop();
    const path = `xray/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
     .from("ultrasound-images")
     .upload(path, file);
    if (error) throw error;

    const { data: signedData } = await supabase.storage
     .from("ultrasound-images")
     .createSignedUrl(path, 3600);
    if (!signedData?.signedUrl)
     throw new Error("Could not generate signed URL");
    setImageUrl(signedData.signedUrl);
    setZoom(100);
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setInvert(false);
    setMarkers([]);
    toast.success("Radiografía cargada correctamente");
   } catch (err: any) {
    toast.error("Error al cargar imagen: " + err.message);
   } finally {
    setUploading(false);
   }
  },
  []
 );

 const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!markMode || !imageUrl) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  const label = markerLabel || `Hallazgo ${markers.length + 1}`;
  setMarkers(prev => [...prev, { x, y, label }]);
  setMarkerLabel("");
 };

 const resetControls = () => {
  setZoom(100);
  setBrightness(100);
  setContrast(100);
  setRotation(0);
  setInvert(false);
 };

 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-6xl">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
        <FileImage className="h-5 w-5 text-accent-foreground" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Visor Radiográfico
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Carga, visualiza y analiza radiografías de tórax con controles de
       imagen y marcación de hallazgos.
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-6 py-8">
    <div className="grid gap-6 lg:grid-cols-4">
     {/* Controls */}
     <Card className="lg:col-span-1">
      <CardHeader className="pb-3">
       <CardTitle className="text-sm font-display">
        Controles de Imagen
       </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
       <div>
        <Button
         onClick={() => fileInputRef.current?.click()}
         className="w-full gap-2"
         disabled={uploading}
        >
         <Upload className="h-4 w-4" />
         {uploading ? "Cargando..." : "Cargar Radiografía"}
        </Button>
        <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         className="hidden"
         onChange={handleFileUpload}
        />
       </div>

       <div>
        <Label className="text-xs">Tipo de Proyección</Label>
        <Select value={xrayType} onValueChange={setXrayType}>
         <SelectTrigger className="h-8 text-xs mt-1">
          <SelectValue />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="pa">PA (Posteroanterior)</SelectItem>
          <SelectItem value="ap">AP (Anteroposterior)</SelectItem>
          <SelectItem value="lateral">Lateral</SelectItem>
         </SelectContent>
        </Select>
       </div>

       {[
        {
         label: "Zoom",
         value: zoom,
         set: setZoom,
         min: 25,
         max: 400,
         unit: "%",
         icon: ZoomIn,
        },
        {
         label: "Brillo",
         value: brightness,
         set: setBrightness,
         min: 0,
         max: 200,
         unit: "%",
         icon: Sun,
        },
        {
         label: "Contraste",
         value: contrast,
         set: setContrast,
         min: 0,
         max: 200,
         unit: "%",
         icon: Contrast,
        },
       ].map(ctrl => (
        <div key={ctrl.label}>
         <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium flex items-center gap-1">
           <ctrl.icon className="h-3 w-3" /> {ctrl.label}
          </span>
          <Badge variant="outline" className="text-[10px]">
           {ctrl.value}
           {ctrl.unit}
          </Badge>
         </div>
         <Slider
          value={[ctrl.value]}
          onValueChange={([v]) => ctrl.set(v)}
          min={ctrl.min}
          max={ctrl.max}
         />
        </div>
       ))}

       <div className="flex gap-2">
        <Button
         variant="outline"
         size="sm"
         className="flex-1 gap-1 text-xs"
         onClick={() => setRotation(r => (r + 90) % 360)}
        >
         <RotateCw className="h-3 w-3" /> Rotar
        </Button>
        <Button
         variant={invert ? "default" : "outline"}
         size="sm"
         className="flex-1 text-xs"
         onClick={() => setInvert(!invert)}
        >
         {invert ? "Normal" : "Invertir"}
        </Button>
       </div>

       <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs"
        onClick={resetControls}
       >
        Restablecer controles
       </Button>

       <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
         <span className="text-xs font-semibold">Marcación</span>
         <Button
          variant={markMode ? "default" : "outline"}
          size="sm"
          className="gap-1 text-xs h-7"
          onClick={() => setMarkMode(!markMode)}
         >
          <Crosshair className="h-3 w-3" />
          {markMode ? "Activo" : "Marcar"}
         </Button>
        </div>
        {markMode && (
         <Input
          value={markerLabel}
          onChange={e => setMarkerLabel(e.target.value)}
          placeholder="Etiqueta del hallazgo"
          className="h-8 text-xs"
         />
        )}
        {markers.length > 0 && (
         <div className="mt-2 space-y-1">
          {markers.map((m, i) => (
           <div
            key={i}
            className="flex items-center justify-between text-xs"
           >
            <span className="text-muted-foreground">
             {i + 1}. {m.label}
            </span>
            <button
             onClick={() =>
              setMarkers(prev => prev.filter((_, j) => j !== i))
             }
             className="text-destructive hover:underline text-[10px]"
            >
             ×
            </button>
           </div>
          ))}
         </div>
        )}
       </div>

       <div className="border-t pt-3">
        <Label className="text-xs">Notas clínicas</Label>
        <Textarea
         value={notes}
         onChange={e => setNotes(e.target.value)}
         placeholder="Observaciones sobre la radiografía..."
         className="mt-1 text-xs min-h-[80px]"
        />
       </div>
      </CardContent>
     </Card>

     {/* Viewer */}
     <div className="lg:col-span-3">
      <Card className="overflow-hidden">
       <CardContent className="p-0">
        {imageUrl ? (
         <div
          ref={imgContainerRef}
          className="relative overflow-auto bg-black min-h-[500px] flex items-center justify-center cursor-crosshair"
          onClick={handleImageClick}
         >
          <img
           src={imageUrl}
           alt="Radiografía de tórax"
           className="max-w-none transition-all duration-200"
           style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? "invert(1)" : ""}`,
           }}
           draggable={false}
          />
          {markers.map((m, i) => (
           <div
            key={i}
            className="absolute pointer-events-none"
            style={{
             left: `${m.x}%`,
             top: `${m.y}%`,
             transform: "translate(-50%, -50%)",
            }}
           >
            <div className="w-5 h-5 rounded-full border-2 border-destructive bg-destructive/20 flex items-center justify-center">
             <span className="text-[8px] font-bold text-destructive">
              {i + 1}
             </span>
            </div>
            <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-background/90 px-1.5 py-0.5 rounded text-foreground border">
             {m.label}
            </span>
           </div>
          ))}
         </div>
        ) : (
         <div
          className="flex flex-col items-center justify-center min-h-[500px] bg-muted/30 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
         >
          <FileImage className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">
           Haz clic para cargar una radiografía
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
           Formatos: JPG, PNG, DICOM
          </p>
         </div>
        )}
       </CardContent>
      </Card>
     </div>
    </div>
   </div>
  </div>
 );
}
