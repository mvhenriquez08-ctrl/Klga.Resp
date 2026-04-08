import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";

// CDN asset URLs
const bLines =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/few-b-lines_4b55481e.gif";
const aLines =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/a-lines_d1e2f3.gif";
const consolidation =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/consolidation_93984838.gif";
const pleuralEffusion =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion_77d5e6e4.png";
const lungSliding =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lung-sliding_877f00a8.gif";
const pneumothoraxGif =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pneumothorax_f3a7b2c1.gif";
const normalPA =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/normal-pa_88be26cc.jpg";
const lobarPneumonia =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/lobar-pneumonia_ba1ed9e2.jpg";
const pleuralEffusionRx =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/pleural-effusion-large_2199541e.jpg";
const tensionPneumothorax =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663463206971/QXZuwAxYMsqEZh9kyxLcbg/tension-pneumothorax_a71f032a.jpg";

interface QuizQuestion {
  id: number;
  image: string;
  modality: "ECO" | "RX";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    image: bLines,
    modality: "ECO",
    question: "¿Qué artefacto ecográfico se observa en esta imagen?",
    options: ["Líneas A", "Líneas B", "Consolidación", "Derrame pleural"],
    correctIndex: 1,
    explanation:
      "Se observan líneas B: artefactos verticales hiperecogénicos que parten de la línea pleural y se extienden hasta el fondo de la imagen sin atenuarse. Indican edema intersticial o patología intersticial.",
  },
  {
    id: 2,
    image: aLines,
    modality: "ECO",
    question: "¿Qué hallazgo ecográfico se identifica?",
    options: [
      "Líneas B confluentes",
      "Consolidación subpleural",
      "Líneas A (pulmón normal)",
      "Signo de la medusa",
    ],
    correctIndex: 2,
    explanation:
      "Se observan líneas A: artefactos horizontales de reverberación paralelos a la línea pleural, indicativos de pulmón normal aireado.",
  },
  {
    id: 3,
    image: consolidation,
    modality: "ECO",
    question: "¿Qué patrón ecográfico se observa?",
    options: [
      "Pulmón normal",
      "Derrame pleural",
      "Consolidación pulmonar",
      "Neumotórax",
    ],
    correctIndex: 2,
    explanation:
      "Se observa consolidación: tejido pulmonar hepatizado con broncograma aéreo dinámico, indicativo de neumonía o atelectasia.",
  },
  {
    id: 4,
    image: pleuralEffusion,
    modality: "ECO",
    question: "¿Qué se visualiza en esta ecografía pulmonar?",
    options: ["Neumotórax", "Derrame pleural", "Líneas B", "Consolidación"],
    correctIndex: 1,
    explanation:
      "Se identifica derrame pleural: colección anecoica entre la pleura visceral y parietal con signo del cuadrilátero y signo del sinusoide.",
  },
  {
    id: 5,
    image: pneumothoraxGif,
    modality: "ECO",
    question: "¿Qué hallazgo sugiere esta imagen?",
    options: [
      "Deslizamiento pleural normal",
      "Neumotórax",
      "Líneas B patológicas",
      "Derrame tabicado",
    ],
    correctIndex: 1,
    explanation:
      "Se observa ausencia de deslizamiento pleural y presencia del signo del código de barras en modo M, hallazgos compatibles con neumotórax.",
  },
  {
    id: 6,
    image: normalPA,
    modality: "RX",
    question: "¿Cómo se describe esta radiografía de tórax?",
    options: [
      "Derrame pleural bilateral",
      "Neumonía lobar",
      "Radiografía de tórax normal",
      "Cardiomegalia",
    ],
    correctIndex: 2,
    explanation:
      "Radiografía PA de tórax normal: silueta cardíaca de tamaño normal, campos pulmonares claros, senos costofrénicos libres.",
  },
  {
    id: 7,
    image: lobarPneumonia,
    modality: "RX",
    question: "¿Qué hallazgo radiográfico se identifica?",
    options: [
      "Neumotórax a tensión",
      "Consolidación lobar (neumonía)",
      "Edema pulmonar",
      "Atelectasia",
    ],
    correctIndex: 1,
    explanation:
      "Se observa consolidación lobar con broncograma aéreo, compatible con neumonía bacteriana.",
  },
  {
    id: 8,
    image: pleuralEffusionRx,
    modality: "RX",
    question: "¿Qué se observa en esta radiografía?",
    options: ["Cardiomegalia", "Derrame pleural", "SDRA", "Masa pulmonar"],
    correctIndex: 1,
    explanation:
      "Derrame pleural con opacidad homogénea que borra el seno costofrénico y presenta menisco de Damoiseau.",
  },
  {
    id: 9,
    image: tensionPneumothorax,
    modality: "RX",
    question: "¿Qué hallazgo radiográfico de emergencia se identifica?",
    options: [
      "Hemotórax masivo",
      "Neumotórax a tensión",
      "Derrame pericárdico",
      "Atelectasia masiva",
    ],
    correctIndex: 1,
    explanation:
      "Neumotórax a tensión: hiperclaridad unilateral, colapso pulmonar completo, desviación mediastínica contralateral. Requiere descompresión inmediata.",
  },
  {
    id: 10,
    image: lungSliding,
    modality: "ECO",
    question: "¿Qué signo ecográfico se observa?",
    options: [
      "Lung point",
      "Lung sliding (deslizamiento pleural)",
      "Signo de la estratosfera",
      "Consolidación",
    ],
    correctIndex: 1,
    explanation:
      "Se observa deslizamiento pleural normal (lung sliding): movimiento de la pleura visceral sobre la parietal con el signo de la playa en modo M.",
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[currentQ];
  const progress = (currentQ / quizQuestions.length) * 100;

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setAnswered(a => a + 1);
    if (idx === q.correctIndex) setScore(s => s + 1);
  };

  const next = () => {
    if (currentQ + 1 >= quizQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentQ(c => c + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setAnswered(0);
    setFinished(false);
  };

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Quiz Interactivo
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Identifica hallazgos patológicos en ecografía y radiografía de
              tórax.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {finished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
                <h2 className="font-display text-2xl font-bold mb-2">
                  ¡Quiz completado!
                </h2>
                <p className="text-lg mb-4">
                  Puntuación:{" "}
                  <span className="font-bold text-primary">
                    {score}/{quizQuestions.length}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {score === quizQuestions.length
                    ? "¡Perfecto! Dominas la evaluación respiratoria."
                    : score >= 7
                      ? "¡Excelente! Muy buen conocimiento."
                      : score >= 5
                        ? "Buen trabajo, sigue practicando."
                        : "Revisa los módulos de biblioteca para mejorar."}
                </p>
                <Button onClick={restart}>
                  <RotateCcw className="h-4 w-4" /> Reintentar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={progress} className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium">
                {currentQ + 1}/{quizQuestions.length}
              </span>
              <Badge variant="outline">{score} ✓</Badge>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={q.modality === "ECO" ? "default" : "secondary"}
                      >
                        {q.modality}
                      </Badge>
                      <CardTitle className="text-sm font-display">
                        Pregunta {currentQ + 1}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg overflow-hidden bg-muted/50 flex justify-center">
                      <img
                        src={q.image}
                        alt="Clinical image"
                        className="max-h-64 object-contain"
                      />
                    </div>

                    <p className="font-medium text-sm">{q.question}</p>

                    <div className="grid gap-2">
                      {q.options.map((opt, i) => {
                        let variant:
                          | "outline"
                          | "default"
                          | "destructive"
                          | "secondary" = "outline";
                        if (showAnswer) {
                          if (i === q.correctIndex) variant = "default";
                          else if (i === selected) variant = "destructive";
                        }
                        return (
                          <Button
                            key={i}
                            variant={variant}
                            className="justify-start text-left h-auto py-3 px-4"
                            onClick={() => handleSelect(i)}
                            disabled={showAnswer}
                          >
                            {showAnswer && i === q.correctIndex && (
                              <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
                            )}
                            {showAnswer &&
                              i === selected &&
                              i !== q.correctIndex && (
                                <XCircle className="h-4 w-4 mr-2 shrink-0" />
                              )}
                            <span className="text-sm">{opt}</span>
                          </Button>
                        );
                      })}
                    </div>

                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="rounded-lg bg-muted/50 border p-4">
                          <p className="text-xs font-semibold mb-1">
                            Explicación:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {q.explanation}
                          </p>
                        </div>
                        <Button className="w-full mt-3" onClick={next}>
                          {currentQ + 1 < quizQuestions.length ? (
                            <>
                              Siguiente <ArrowRight className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Ver resultado <Trophy className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
