import { useState, useMemo, useCallback } from "react";
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
  Shuffle,
  ListChecks,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import {
  type QuizModuleId,
  type UnifiedQuizQuestion,
  quizModules,
  getQuestionsByModule,
  getRandomMixedQuiz,
} from "@/data/quizUnified";

type QuizState = "menu" | "playing" | "results";

export default function UnifiedQuiz() {
  const [state, setState] = useState<QuizState>("menu");
  const [selectedModule, setSelectedModule] = useState<
    QuizModuleId | "mixed" | null
  >(null);
  const [questions, setQuestions] = useState<UnifiedQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);

  const startQuiz = useCallback((moduleId: QuizModuleId | "mixed") => {
    const qs =
      moduleId === "mixed"
        ? getRandomMixedQuiz(20)
        : getQuestionsByModule(moduleId).sort(() => Math.random() - 0.5);
    setSelectedModule(moduleId);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setAnswers(qs.map(() => null));
    setState("playing");
  }, []);

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const correct = idx === questions[currentIdx].correctIndex;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => {
      const next = [...prev];
      next[currentIdx] = correct;
      return next;
    });
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      setState("results");
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const backToMenu = () => {
    setState("menu");
    setSelectedModule(null);
  };

  if (state === "menu") return <QuizMenu onStart={startQuiz} />;
  if (state === "results") {
    const pct = Math.round((score / questions.length) * 100);
    const moduleLabel =
      selectedModule === "mixed"
        ? "Quiz Mixto"
        : quizModules.find(m => m.id === selectedModule)?.label || "";
    return (
      <QuizResults
        score={score}
        total={questions.length}
        pct={pct}
        label={moduleLabel}
        answers={answers}
        questions={questions}
        onRestart={() => startQuiz(selectedModule!)}
        onMenu={backToMenu}
      />
    );
  }

  const q = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;
  const moduleInfo = quizModules.find(m => m.id === q.module);

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-primary-foreground">
                  {selectedModule === "mixed"
                    ? "Quiz Mixto Global"
                    : moduleInfo?.label}
                </h1>
                <p className="text-xs text-primary-foreground/60">
                  Pregunta {currentIdx + 1} de {questions.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-6">
        <div className="mb-4 flex items-center gap-3">
          <Progress value={progress} className="flex-1 h-2" />
          <Badge variant="outline" className="text-xs">
            {score} ✓
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={backToMenu}
            className="text-xs text-muted-foreground"
          >
            Salir
          </Button>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={moduleInfo?.color}>
                    {moduleInfo?.icon} {moduleInfo?.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {q.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {q.difficulty}
                  </Badge>
                  {q.clinicalCase && (
                    <Badge variant="secondary" className="text-xs">
                      <Stethoscope className="h-3 w-3 mr-1" /> Caso clínico
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {q.image && (
                  <div className="rounded-lg overflow-hidden bg-muted/50 flex justify-center">
                    <img
                      src={q.image}
                      alt="Clinical image"
                      className="max-h-64 object-contain"
                    />
                  </div>
                )}

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
                        <span className="font-mono mr-2 shrink-0 text-xs">
                          {String.fromCharCode(65 + i)}.
                        </span>
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
                    <div
                      className={`rounded-lg border p-4 ${
                        selected === q.correctIndex
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                        {selected === q.correctIndex ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400" />{" "}
                            ¡Correcto!
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-400" />{" "}
                            Incorrecto
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {q.explanation}
                      </p>
                    </div>
                    <Button className="w-full mt-3" onClick={next}>
                      {currentIdx + 1 < questions.length ? (
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
      </div>
    </div>
  );
}

function QuizMenu({
  onStart,
}: {
  onStart: (id: QuizModuleId | "mixed") => void;
}) {
  const moduleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    quizModules.forEach(m => {
      counts[m.id] = getQuestionsByModule(m.id).length;
    });
    return counts;
  }, []);

  const totalQuestions = Object.values(moduleCounts).reduce((a, b) => a + b, 0);

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
              <div>
                <h1 className="font-display text-2xl font-bold text-primary-foreground">
                  Centro de Evaluación
                </h1>
                <p className="text-sm text-primary-foreground/60">
                  {totalQuestions} preguntas · 8 módulos · Imágenes, teoría y
                  casos clínicos
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Mixed quiz card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors border-dashed border-2"
            onClick={() => onStart("mixed")}
          >
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shuffle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm">
                  Examen Mixto Global
                </h3>
                <p className="text-xs text-muted-foreground">
                  20 preguntas aleatorias de todos los módulos — imágenes,
                  teoría y casos clínicos
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Module grid */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Por categoría
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizModules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => onStart(mod.id)}
                >
                  <CardContent className="flex items-center gap-3 py-4">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm truncate">
                        {mod.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {moduleCounts[mod.id]} preguntas
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizResults({
  score,
  total,
  pct,
  label,
  answers,
  questions,
  onRestart,
  onMenu,
}: {
  score: number;
  total: number;
  pct: number;
  label: string;
  answers: (boolean | null)[];
  questions: UnifiedQuizQuestion[];
  onRestart: () => void;
  onMenu: () => void;
}) {
  const byModule = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!map[q.module]) map[q.module] = { correct: 0, total: 0 };
      map[q.module].total++;
      if (answers[i]) map[q.module].correct++;
    });
    return map;
  }, [questions, answers]);

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Trophy
              className={`h-16 w-16 mx-auto mb-4 ${pct >= 70 ? "text-yellow-400" : "text-muted-foreground"}`}
            />
            <h1 className="font-display text-2xl font-bold text-primary-foreground mb-1">
              {label}
            </h1>
            <p className="text-4xl font-bold text-primary-foreground">{pct}%</p>
            <p className="text-sm text-primary-foreground/60 mt-1">
              {score} de {total} correctas
            </p>
            <Badge
              variant={pct >= 70 ? "default" : "destructive"}
              className="mt-3 text-sm px-4 py-1"
            >
              {pct >= 90
                ? "Excelente"
                : pct >= 70
                  ? "Aprobado"
                  : pct >= 50
                    ? "Necesita refuerzo"
                    : "Revisar material"}
            </Badge>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Module breakdown */}
        {Object.keys(byModule).length > 1 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-display">
                Desglose por módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(byModule).map(([modId, data]) => {
                const mod = quizModules.find(m => m.id === modId);
                const modPct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={modId} className="flex items-center gap-3">
                    <span className="text-lg">{mod?.icon}</span>
                    <span className="text-xs font-medium flex-1">
                      {mod?.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {data.correct}/{data.total}
                    </span>
                    <div className="w-20">
                      <Progress value={modPct} className="h-1.5" />
                    </div>
                    <span className="text-xs font-bold w-10 text-right">
                      {modPct}%
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button onClick={onRestart} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" /> Reintentar
          </Button>
          <Button variant="outline" onClick={onMenu} className="flex-1">
            Volver al menú
          </Button>
        </div>
      </div>
    </div>
  );
}
