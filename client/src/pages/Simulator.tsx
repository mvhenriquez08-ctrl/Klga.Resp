import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { simulatorCases, type SimulatorCase } from "@/data/simulator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Brain, Lightbulb, RotateCcw } from "lucide-react";

function CaseSimulator({ c, onBack }: { c: SimulatorCase; onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(c.questions.map(() => null));
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = c.questions[currentQ];
  const answered = answers[currentQ] !== null;
  const correct = answered && answers[currentQ] === q.correctAnswer;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const next = () => {
    setShowResult(false);
    if (currentQ < c.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers(c.questions.map(() => null));
    setShowResult(false);
    setFinished(false);
  };

  const score = answers.filter((a, i) => a === c.questions[i].correctAnswer).length;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">
                {score === c.questions.length ? "🎉" : score >= c.questions.length / 2 ? "👍" : "📚"}
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                {score}/{c.questions.length} respuestas correctas
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {score === c.questions.length
                  ? "¡Excelente! Dominas este caso."
                  : "Revisa los puntos de enseñanza para mejorar."}
              </p>

              <div className="text-left rounded-lg bg-primary/5 border border-primary/10 p-5 mb-6">
                <h3 className="font-semibold text-sm mb-1 text-primary">
                  Diagnóstico Final: {c.finalDiagnosis}
                </h3>
                <p className="text-sm text-muted-foreground">{c.explanation}</p>
              </div>

              <div className="text-left mb-6">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" /> Puntos de enseñanza
                </h4>
                <ul className="space-y-2">
                  {c.teachingPoints.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Repetir
                </Button>
                <Button onClick={onBack}>Ver otros casos</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
      </Button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Badge>{c.difficulty}</Badge>
          <span className="text-xs text-muted-foreground">
            Pregunta {currentQ + 1} de {c.questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + (answered ? 1 : 0)) / c.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-5">
          <h3 className="font-display font-semibold mb-1">{c.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{c.clinicalContext}</p>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-4">{q.question}</h4>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = answers[currentQ] === i;
                  const isCorrect = i === q.correctAnswer;
                  let className =
                    "w-full text-left p-3 rounded-lg border text-sm transition-all ";
                  if (answered) {
                    if (isCorrect) className += "border-success bg-success/10 text-success";
                    else if (isSelected) className += "border-destructive bg-destructive/10 text-destructive";
                    else className += "border-border opacity-50";
                  } else {
                    className += "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                  }

                  return (
                    <button key={i} className={className} onClick={() => handleAnswer(i)}>
                      <div className="flex items-center gap-2">
                        {answered && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                        {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-3 rounded-lg bg-muted/50 border"
                  >
                    <p className="text-sm text-muted-foreground">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answered && (
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={next}>
                    {currentQ < c.questions.length - 1 ? (
                      <>Siguiente <ArrowRight className="h-4 w-4 ml-1" /></>
                    ) : (
                      "Ver resultado"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Simulator() {
  const [selectedCase, setSelectedCase] = useState<SimulatorCase | null>(null);

  if (selectedCase) {
    return (
      <div className="p-6">
        <CaseSimulator c={selectedCase} onBack={() => setSelectedCase(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Simulador de Interpretación</h1>
        <p className="text-muted-foreground">
          Practica tu interpretación ecográfica con casos clínicos interactivos
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulatorCases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer group hover:shadow-md transition-all hover:-translate-y-0.5 h-full border-border/50"
              onClick={() => setSelectedCase(c)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <Badge
                    variant={
                      c.difficulty === "Básico" ? "secondary" : c.difficulty === "Intermedio" ? "default" : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {c.difficulty}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{c.clinicalContext}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {c.questions.length} preguntas
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
