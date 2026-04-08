import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Pencil,
  AlertTriangle,
  Image as ImageIcon,
  History,
  Sparkles,
} from "lucide-react";
import SignedImage from "@/components/ui/signed-image";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { uploadAndSign, getSignedStorageUrl } from "@/lib/storage";

interface AIAnalysis {
  findings: Record<string, boolean>;
  pattern: string;
  interpretation: string;
  confidence: string;
  zone_score: number;
}

const findingLabels: Record<string, string> = {
  a_lines: "Líneas A",
  b_lines_isolated: "Líneas B aisladas",
  b_lines_multiple: "Líneas B múltiples",
  b_lines_confluent: "Líneas B confluyentes",
  irregular_pleural_line: "Línea pleural irregular",
  subpleural_consolidation: "Consolidación subpleural",
  extensive_consolidation: "Consolidación extensa",
  static_air_bronchogram: "Broncograma aéreo estático",
  pleural_effusion: "Derrame pleural",
  septa: "Septos",
  sinusoid_sign: "Signo del sinusoide",
  quadrilateral_sign: "Signo del cuadrilátero",
  jellyfish_sign: "Signo de la medusa",
  barcode_sign: "Signo del código de barras",
  seashore_sign: "Signo de la playa",
  lung_point: "Punto pulmonar",
};

const confidenceColor: Record<string, string> = {
  alta: "bg-green-500/10 text-green-700 border-green-200",
  moderada: "bg-amber-500/10 text-amber-700 border-amber-200",
  baja: "bg-red-500/10 text-red-700 border-red-200",
};

export default function AIModule() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [operator, setOperator] = useState("");
  const [editedInterpretation, setEditedInterpretation] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch prediction history
  const { data: history = [] } = useQuery({
    queryKey: ["ai-predictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setIsEditing(false);
  };

  // Analyze image
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No hay imagen seleccionada");

      // Upload to storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { path, signedUrl } = await uploadAndSign(
        "ultrasound-images",
        fileName,
        selectedFile
      );

      // Convert to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>(resolve => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(selectedFile);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke(
        "analyze-ultrasound",
        {
          body: { image_base64: base64, image_url: signedUrl },
        }
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return { analysis: data.analysis as AIAnalysis, imageUrl: path };
    },
    onSuccess: ({ analysis: result, imageUrl }) => {
      setAnalysis(result);
      setEditedInterpretation(result.interpretation);

      // Save prediction as pending
      supabase
        .from("ai_predictions")
        .insert([
          {
            image_url: imageUrl,
            model_used: "google/gemini-2.5-pro",
            suggested_findings: JSON.parse(JSON.stringify(result.findings)),
            suggested_pattern: result.pattern,
            suggested_interpretation: result.interpretation,
            confidence_level: result.confidence,
            suggested_zone_score: result.zone_score,
            status: "pending",
            operator: operator || null,
          },
        ])
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["ai-predictions"] });
        });

      toast({
        title: "Análisis completado",
        description: `Patrón: ${result.pattern}`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error en análisis",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Update prediction status
  const updateStatus = async (
    id: string,
    status: string,
    finalData?: { findings?: unknown; interpretation?: string }
  ) => {
    const updateObj: Record<string, unknown> = { status };
    if (finalData?.findings)
      updateObj.final_findings = JSON.parse(JSON.stringify(finalData.findings));
    if (finalData?.interpretation)
      updateObj.final_interpretation = finalData.interpretation;

    await supabase.from("ai_predictions").update(updateObj).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["ai-predictions"] });
    toast({
      title: `Predicción ${status === "accepted" ? "aceptada" : status === "rejected" ? "rechazada" : "editada"}`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">
              IA — Interpretación Asistida
            </h1>
            <p className="text-sm text-muted-foreground">
              Análisis de imágenes ecográficas pulmonares con inteligencia
              artificial
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-200">
          <p className="text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Herramienta de apoyo clínico.</strong> Los resultados de
              la IA son orientativos y no reemplazan el juicio del profesional
              de salud. Toda interpretación debe ser validada clínicamente.
            </span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload & Analysis */}
        <div className="space-y-4">
          {/* Upload */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Upload className="h-4 w-4" /> Cargar imagen ecográfica
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Operador</Label>
                  <Input
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                    placeholder="Nombre del profesional"
                    maxLength={100}
                  />
                </div>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() =>
                    document.getElementById("lus-image-input")?.click()
                  }
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Ecografía"
                      className="max-h-64 mx-auto rounded"
                    />
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        Haz clic o arrastra una imagen ecográfica
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        JPG, PNG — máx 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="lus-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => analyzeMutation.mutate()}
                  disabled={!selectedFile || analyzeMutation.isPending}
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Analizar con IA
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/20">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" /> Resultado del
                        análisis
                      </h3>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={confidenceColor[analysis.confidence] || ""}
                        >
                          {analysis.confidence}
                        </Badge>
                        <Badge variant="secondary">
                          Score: {analysis.zone_score}/3
                        </Badge>
                      </div>
                    </div>

                    {/* Pattern */}
                    <div className="p-3 rounded-lg bg-primary/5">
                      <p className="text-xs text-muted-foreground mb-1">
                        Patrón sugerido
                      </p>
                      <p className="font-semibold">{analysis.pattern}</p>
                    </div>

                    {/* Findings */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Hallazgos detectados
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(analysis.findings)
                          .filter(([, v]) => v)
                          .map(([key]) => (
                            <Badge
                              key={key}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {findingLabels[key] || key}
                            </Badge>
                          ))}
                        {Object.values(analysis.findings).every(v => !v) && (
                          <p className="text-xs text-muted-foreground">
                            Sin hallazgos positivos
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Interpretación
                      </p>
                      {isEditing ? (
                        <Textarea
                          value={editedInterpretation}
                          onChange={e =>
                            setEditedInterpretation(e.target.value)
                          }
                          rows={3}
                          maxLength={1000}
                        />
                      ) : (
                        <p className="text-sm">{analysis.interpretation}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          toast({
                            title: "Sugerencia aceptada",
                            description: "Hallazgos guardados.",
                          })
                        }
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />{" "}
                        {isEditing ? "Guardar edición" : "Editar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast({ title: "Sugerencia rechazada" })}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: History */}
        <div>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <History className="h-4 w-4" /> Historial de análisis
              </h3>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Sin análisis previos
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-auto">
                  {history.map(pred => (
                    <div
                      key={pred.id}
                      className="p-3 rounded-lg border text-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Badge
                            variant={
                              pred.status === "accepted"
                                ? "default"
                                : pred.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {pred.status}
                          </Badge>
                          {pred.confidence_level && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${confidenceColor[pred.confidence_level] || ""}`}
                            >
                              {pred.confidence_level}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(pred.created_at).toLocaleDateString(
                            "es-CL"
                          )}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <SignedImage
                          bucket="ultrasound-images"
                          path={pred.image_url}
                          alt="Ecografía"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs">
                            {pred.suggested_pattern}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {pred.final_interpretation ||
                              pred.suggested_interpretation}
                          </p>
                          {pred.operator && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Operador: {pred.operator}
                            </p>
                          )}
                        </div>
                      </div>
                      {pred.status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => updateStatus(pred.id, "accepted")}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => updateStatus(pred.id, "rejected")}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Rechazar
                          </Button>
                        </div>
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
