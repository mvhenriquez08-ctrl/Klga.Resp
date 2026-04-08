import { useState, useMemo } from "react";
import {
  arrhythmias,
  categoryLabels,
  severityLabels,
  type Arrhythmia,
} from "@/data/arrhythmias";
import { ECGTracing } from "@/components/ecg/ECGTracing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuiz(count: number = 10) {
  const pool = arrhythmias.filter(a => a.id !== "normal-sinus");
  const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
  return selected.map(correct => {
    const wrongOptions = shuffleArray(
      pool.filter(a => a.id !== correct.id)
    ).slice(0, 3);
    const options = shuffleArray([correct, ...wrongOptions]);
    return { correct, options };
  });
}

interface QuizQuestion {
  correct: Arrhythmia;
  options: Arrhythmia[];
}

export default function ArrhythmiasQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuiz(10)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = questions[currentIdx];
  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === current?.correct.id;
  const finished =
    answers.length === questions.length && answers.every(a => a !== null);

  const score = useMemo(() => answers.filter(Boolean).length, [answers]);
  const progress =
    ((currentIdx + (isAnswered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = id === current.correct.id;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedId(null);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setQuestions(generateQuiz(10));
    setCurrentIdx(0);
    setSelectedId(null);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Quiz de Arritmias —
          Resultado
        </h1>
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <Trophy
              className={`h-16 w-16 mx-auto ${pct >= 70 ? "text-yellow-400" : "text-muted-foreground"}`}
            />
            <h2 className="text-3xl font-bold">
              {score}/{questions.length}
            </h2>
            <p className="text-muted-foreground">{pct}% de aciertos</p>
            <Progress value={pct} className="h-3" />
            <p className="text-sm">
              {pct >= 90
                ? "¡Excelente! Dominio avanzado de arritmias."
                : pct >= 70
                  ? "¡Buen trabajo! Sigue practicando los casos complejos."
                  : pct >= 50
                    ? "Bien, pero hay margen de mejora. Revisa la biblioteca."
                    : "Necesitas repasar. Te recomendamos estudiar la biblioteca primero."}
            </p>
            <Button onClick={restart} className="mt-4">
              <RotateCcw className="h-4 w-4 mr-2" /> Nuevo Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Quiz de Arritmias
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Identifica la arritmia a partir del trazado ECG
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm text-muted-foreground font-medium">
          {currentIdx + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                ¿Qué arritmia muestra este ECG?
              </CardTitle>
              <CardDescription>
                Pregunta {currentIdx + 1} de {questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg overflow-hidden border bg-muted">
                <ECGTracing arrhythmiaId={current.correct.id} height={160} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map(opt => {
                  const isThis = selectedId === opt.id;
                  const isRight = opt.id === current.correct.id;
                  let borderClass = "border-border hover:border-primary/50";
                  if (isAnswered) {
                    if (isRight)
                      borderClass = "border-green-500 bg-green-500/5";
                    else if (isThis && !isRight)
                      borderClass = "border-red-500 bg-red-500/5";
                    else borderClass = "border-border opacity-50";
                  }
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={isAnswered}
                      className={`border rounded-lg p-3 text-left transition-all ${borderClass} ${!isAnswered ? "cursor-pointer" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {isAnswered && isRight && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        )}
                        {isAnswered && isThis && !isRight && (
                          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{opt.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {categoryLabels[opt.category]}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div
                    className={`rounded-lg p-3 text-sm ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
                  >
                    <p className="font-semibold mb-1">
                      {isCorrect
                        ? "✅ ¡Correcto!"
                        : `❌ Incorrecto — La respuesta es: ${current.correct.name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {current.correct.keyFact}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNext} size="sm">
                      {currentIdx < questions.length - 1 ? (
                        <>
                          Siguiente <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        "Ver Resultado"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
