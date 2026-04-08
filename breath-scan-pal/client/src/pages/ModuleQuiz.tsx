import { useState, useMemo } from "react";
import { ecmoQuiz, ctQuiz, rxQuiz, type QuizQuestion } from "@/data/quizECMO";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GraduationCap,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modules = [
  { id: "ecmo", label: "ECMO", questions: ecmoQuiz },
  { id: "tc", label: "TC Tórax", questions: ctQuiz },
  { id: "rx", label: "RX Tórax", questions: rxQuiz },
];

export default function ModuleQuiz() {
  const [activeModule, setActiveModule] = useState("ecmo");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Quizzes por Módulo
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Evalúa tus conocimientos en ECMO, TC y Radiografía de Tórax
        </p>
      </div>

      <Tabs value={activeModule} onValueChange={setActiveModule}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          {modules.map(m => (
            <TabsTrigger key={m.id} value={m.id}>
              {m.label} ({m.questions.length})
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map(mod => (
          <TabsContent key={mod.id} value={mod.id} className="mt-4">
            <QuizRunner questions={mod.questions} moduleName={mod.label} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function QuizRunner({
  questions,
  moduleName,
}: {
  questions: QuizQuestion[];
  moduleName: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<(boolean | null)[]>(
    questions.map(() => null)
  );
  const [finished, setFinished] = useState(false);

  const current = questions[currentIdx];
  const correctCount = results.filter(r => r === true).length;
  const answeredCount = results.filter(r => r !== null).length;

  const reset = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setResults(questions.map(() => null));
    setFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const isCorrect = idx === current.correctIndex;
    const newResults = [...results];
    newResults[currentIdx] = isCorrect;
    setResults(newResults);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy
            className={`h-16 w-16 mx-auto ${pct >= 70 ? "text-yellow-400" : "text-muted-foreground"}`}
          />
          <h2 className="text-2xl font-bold">{moduleName} — Resultado</h2>
          <p className="text-4xl font-bold text-primary">{pct}%</p>
          <p className="text-muted-foreground">
            {correctCount} de {questions.length} correctas
          </p>
          <Badge
            variant={pct >= 70 ? "default" : "destructive"}
            className="text-sm px-4 py-1"
          >
            {pct >= 90
              ? "Excelente"
              : pct >= 70
                ? "Aprobado"
                : pct >= 50
                  ? "Necesita refuerzo"
                  : "Revisar material"}
          </Badge>
          <Button onClick={reset} className="mt-4">
            <RotateCcw className="h-4 w-4 mr-2" /> Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {current.category}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {currentIdx + 1} / {questions.length} · {correctCount}/{answeredCount}{" "}
          correctas
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm leading-relaxed">
            {current.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {current.options.map((opt, idx) => {
            let variant: "outline" | "default" | "destructive" = "outline";
            let icon = null;
            if (showExplanation) {
              if (idx === current.correctIndex) {
                variant = "default";
                icon = (
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                );
              } else if (idx === selectedAnswer) {
                variant = "destructive";
                icon = <XCircle className="h-4 w-4 shrink-0" />;
              }
            }

            return (
              <Button
                key={idx}
                variant={variant}
                className="w-full justify-start text-left h-auto py-3 text-xs"
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
              >
                <span className="font-mono mr-2 shrink-0">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1">{opt}</span>
                {icon}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className={`border-2 ${selectedAnswer === current.correctIndex ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
            >
              <CardContent className="p-4">
                <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                  {selectedAnswer === current.correctIndex ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />{" "}
                      ¡Correcto!
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" /> Incorrecto
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {current.explanation}
                </p>
              </CardContent>
            </Card>
            <div className="flex justify-end mt-3">
              <Button onClick={next} size="sm">
                {currentIdx < questions.length - 1
                  ? "Siguiente"
                  : "Ver resultado"}{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
