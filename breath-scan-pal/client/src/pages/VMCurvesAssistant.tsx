import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Camera,
  ZoomIn,
  Sun,
  Contrast,
  RotateCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CurveAnalysis {
  curve_types: string[];
  ventilation_mode: string;
  findings: Record<string, boolean>;
  main_finding: string;
  explanation: string;
  possible_causes: string[];
  adjustment_suggestions: string[];
  confidence: string;
}

const findingLabels: Record<string, string> = {
  trigger_inefectivo: "Trigger Inefectivo",
  auto_trigger: "Auto-trigger",
  doble_trigger: "Doble Trigger",
  ciclado_precoz: "Ciclado Precoz",
  ciclado_tardio: "Ciclado Tardío",
  flow_starvation: "Flow Starvation",
  auto_peep: "Auto-PEEP",
  sobredistension: "Sobredistensión",
  compliance_alterada: "Compliance Alterada",
  resistencia_alterada: "Resistencia Alterada",
};

export default function VMCurvesAssistant() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CurveAnalysis | null>(null);
  const [ventMode, setVentMode] = useState("");
  const [fio2, setFio2] = useState("");
  const [peep, setPeep] = useState("");
  const [vt, setVt] = useState("");
  const [rr, setRr] = useState("");
  const [ps, setPs] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImageBase64(result.split(",")[1]);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const params: Record<string, string> = {};
      if (ventMode) params.modo = ventMode;
      if (fio2) params.fio2 = fio2;
      if (peep) params.peep = peep;
      if (vt) params.vt = vt;
      if (rr) params.fr = rr;
      if (ps) params.ps = ps;

      const { data, error } = await supabase.functions.invoke(
        "analyze-curves",
        {
          body: {
            image_base64: imageBase64,
            ventilator_params:
              Object.keys(params).length > 0 ? params : undefined,
          },
        }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data.analysis);
      toast.success("Análisis completado");
    } catch (err: any) {
      toast.error(err.message || "Error en el análisis");
    } finally {
      setAnalyzing(false);
    }
  };

  const detectedFindings = analysis
    ? Object.entries(analysis.findings).filter(([, v]) => v)
    : [];

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <Camera className="h-5 w-5 text-warning" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Asistente de Curvas Ventilatorias
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Sube una foto de las curvas del ventilador y obtén interpretación
              asistida por IA.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Upload + Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display">
                Imagen de Curvas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => fileRef.current?.click()}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" /> Subir Imagen
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFile}
              />

              {imageUrl && (
                <>
                  {[
                    {
                      label: "Zoom",
                      value: zoom,
                      set: setZoom,
                      min: 25,
                      max: 400,
                      unit: "%",
                    },
                    {
                      label: "Brillo",
                      value: brightness,
                      set: setBrightness,
                      min: 0,
                      max: 200,
                      unit: "%",
                    },
                    {
                      label: "Contraste",
                      value: contrast,
                      set: setContrast,
                      min: 0,
                      max: 200,
                      unit: "%",
                    },
                  ].map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{c.label}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {c.value}
                          {c.unit}
                        </Badge>
                      </div>
                      <Slider
                        value={[c.value]}
                        onValueChange={([v]) => c.set(v)}
                        min={c.min}
                        max={c.max}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1 text-xs"
                    onClick={() => setRotation(r => (r + 90) % 360)}
                  >
                    <RotateCw className="h-3 w-3" /> Rotar
                  </Button>
                </>
              )}

              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-semibold">
                  Parámetros del paciente (opcional)
                </p>
                <div>
                  <Label className="text-xs">Modo ventilatorio</Label>
                  <Select value={ventMode} onValueChange={setVentMode}>
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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "FiO₂ (%)", value: fio2, set: setFio2 },
                    { label: "PEEP", value: peep, set: setPeep },
                    { label: "Vt (mL)", value: vt, set: setVt },
                    { label: "FR (rpm)", value: rr, set: setRr },
                    { label: "PS (cmH₂O)", value: ps, set: setPs },
                  ].map(f => (
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

              <Button
                onClick={handleAnalyze}
                disabled={!imageBase64 || analyzing}
                className="w-full gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analizando...
                  </>
                ) : (
                  "Analizar con IA"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Center: Image viewer */}
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              {imageUrl ? (
                <div className="overflow-auto bg-black min-h-[400px] flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Curvas ventilatorias"
                    className="max-w-none transition-all duration-200"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    }}
                    draggable={false}
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center min-h-[400px] bg-muted/30 cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="h-16 w-16 text-muted-foreground/20 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Toma una foto o sube una imagen
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    de las curvas del ventilador
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Results */}
          <div className="space-y-4">
            {analysis ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-display flex items-center gap-2">
                      Resultado del Análisis
                      <Badge
                        variant={
                          analysis.confidence === "alta"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        Confianza: {analysis.confidence}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {analysis.curve_types.map(t => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {t}
                        </Badge>
                      ))}
                      <Badge className="text-[10px] bg-primary/10 text-primary">
                        {analysis.ventilation_mode}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Hallazgo Principal
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.main_finding}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Explicación
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {detectedFindings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-display text-warning flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Hallazgos
                        Detectados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {detectedFindings.map(([k]) => (
                          <Badge
                            key={k}
                            variant="destructive"
                            className="text-[10px]"
                          >
                            {findingLabels[k] || k}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-display">
                      Posibles Causas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {analysis.possible_causes.map(c => (
                        <li
                          key={c}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-destructive mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-display text-success flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Sugerencias de Ajuste
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {analysis.adjustment_suggestions.map(s => (
                        <li
                          key={s}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-success mt-0.5">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-warning">⚠️</strong> Interpretación
                    orientativa. No reemplaza el juicio clínico del profesional.
                  </p>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground text-center">
                    Sube una imagen de las curvas del ventilador y presiona
                    "Analizar con IA"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
