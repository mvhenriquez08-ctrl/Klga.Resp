import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Film, Monitor, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import VideoAnalysis from "@/components/acquisition/VideoAnalysis";
import LiveFeed from "@/components/acquisition/LiveFeed";
import ExamPanel from "@/components/acquisition/ExamPanel";

type Mode = null | "video" | "live";

export default function Acquisition() {
  const [mode, setMode] = useState<Mode>(null);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFindings, setAiFindings] = useState<Record<string, boolean> | null>(
    null
  );
  const [aiPattern, setAiPattern] = useState<string | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<string | null>(null);
  const [aiZoneScore, setAiZoneScore] = useState<number | null>(null);

  const analyzeWithAI = async (imageUrl: string) => {
    setIsAnalyzing(true);
    setAiFindings(null);
    setAiPattern(null);
    setAiInterpretation(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-ultrasound",
        {
          body: { image_url: imageUrl },
        }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const a = data.analysis;
      setAiFindings(a.findings);
      setAiPattern(a.pattern);
      setAiInterpretation(a.interpretation);
      setAiConfidence(a.confidence);
      setAiZoneScore(a.zone_score);
      toast({
        title: "Análisis IA completado",
        description: `Patrón: ${a.pattern}`,
      });
    } catch (err) {
      toast({
        title: "Error en análisis",
        description: String(err),
        variant: "destructive",
      });
    }
    setIsAnalyzing(false);
  };

  const handleFrameCapture = (url: string) => {
    setCapturedFrame(url);
  };

  const resetAI = () => {
    setAiFindings(null);
    setAiPattern(null);
    setAiInterpretation(null);
    setAiConfidence(null);
    setAiZoneScore(null);
  };

  // Mode selection screen
  if (!mode) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Adquisición Ecográfica
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecciona el modo de adquisición para iniciar el examen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors h-full"
              onClick={() => setMode("video")}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                  <Film className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold mb-2">
                    Video Exportado
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Carga videos, clips o imágenes ecográficas previamente
                    exportadas desde el ecógrafo
                  </p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground text-left">
                  <p>✓ Análisis retrospectivo</p>
                  <p>✓ Control frame a frame</p>
                  <p>✓ Docencia y revisión de casos</p>
                  <p>✓ Interpretación asistida por IA</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors h-full"
              onClick={() => setMode("live")}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                  <Monitor className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold mb-2">
                    Ecógrafo en Vivo
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Conecta un ecógrafo o fuente de video para exploración en
                    tiempo real
                  </p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground text-left">
                  <p>✓ Streaming en tiempo real</p>
                  <p>✓ Congelar imagen y capturar</p>
                  <p>✓ Grabar clips cortos</p>
                  <p>✓ Score en tiempo real</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-6 p-3 rounded-lg bg-amber-500/10 border border-amber-200">
          <p className="text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Herramienta de apoyo clínico.</strong> La interpretación
              asistida no reemplaza el juicio del profesional. Todos los
              hallazgos deben ser validados clínicamente.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Exam interface (both modes)
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b bg-card/50 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMode(null);
            resetAI();
            setCapturedFrame(null);
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <div className="flex items-center gap-2">
          {mode === "video" ? (
            <Film className="h-4 w-4 text-primary" />
          ) : (
            <Monitor className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-semibold">
            {mode === "video"
              ? "Análisis de Video Exportado"
              : "Ecógrafo en Tiempo Real"}
          </span>
        </div>
      </div>

      {/* Main content: 2 panels */}
      <div className="flex-1 grid lg:grid-cols-[1fr_380px] overflow-hidden">
        {/* Left: Video/Live */}
        <div className="p-4 overflow-auto">
          <AnimatePresence mode="wait">
            {mode === "video" ? (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <VideoAnalysis
                  onFrameCapture={handleFrameCapture}
                  onVideoLoaded={() => {}}
                />
                {/* Captured frames */}
                {capturedFrame && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Último frame capturado
                    </p>
                    <img
                      src={capturedFrame}
                      alt="Frame"
                      className="rounded-lg max-h-48 border"
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <LiveFeed onFrameCapture={handleFrameCapture} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Exam panel */}
        <div className="border-l bg-card/30 p-4 overflow-auto">
          <ExamPanel
            capturedFrameUrl={capturedFrame}
            onAIAnalyze={analyzeWithAI}
            isAnalyzing={isAnalyzing}
            aiFindings={aiFindings}
            aiPattern={aiPattern}
            aiInterpretation={aiInterpretation}
            aiConfidence={aiConfidence}
            aiZoneScore={aiZoneScore}
          />
        </div>
      </div>
    </div>
  );
}
