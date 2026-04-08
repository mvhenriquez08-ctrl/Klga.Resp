import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { asynchronies } from "@/data/ventilation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
 AlertTriangle,
 CheckCircle,
 XCircle,
 RotateCcw,
 Trophy,
 ArrowRight,
} from "lucide-react";

const TOTAL_QUESTIONS = 7;

function shuffleArray<T>(arr: T[]): T[] {
 const a = [...arr];
 for (let i = a.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [a[i], a[j]] = [a[j], a[i]];
 }
 return a;
}

interface Question {
 asynchrony: (typeof asynchronies)[0];
 options: string[];
 correctIndex: number;
}

function generateQuestions(): Question[] {
 const withImage = asynchronies.filter(a => a.image);
 const shuffled = shuffleArray(withImage).slice(
  0,
  Math.min(TOTAL_QUESTIONS, withImage.length)
 );

 return shuffled.map(correct => {
  const others = shuffleArray(
   asynchronies.filter(a => a.id !== correct.id)
  ).slice(0, 3);
  const allOptions = shuffleArray([correct, ...others]);
  return {
   asynchrony: correct,
   options: allOptions.map(o => o.name),
   correctIndex: allOptions.findIndex(o => o.id === correct.id),
  };
 });
}

const QUIZ_STATE_KEY = "vmi-quiz-state";

export default function VMAsynchroniesQuiz() {
 const loadState = () => {
  const saved = localStorage.getItem(QUIZ_STATE_KEY);
  if (saved) {
   try {
    return JSON.parse(saved);
   } catch (e) {}
  }
  return null;
 };

 const initialState = loadState();

 const [questions, setQuestions] = useState<Question[]>(
  () => initialState?.questions || generateQuestions()
 );
 const [current, setCurrent] = useState(initialState?.current ?? 0);
 const [selected, setSelected] = useState<number | null>(
  initialState?.selected ?? null
 );
 const [score, setScore] = useState(initialState?.score ?? 0);
 const [answered, setAnswered] = useState(initialState?.answered ?? false);
 const [finished, setFinished] = useState(initialState?.finished ?? false);

 useEffect(() => {
  localStorage.setItem(
   QUIZ_STATE_KEY,
   JSON.stringify({
    questions,
    current,
    selected,
    score,
    answered,
    finished,
   })
  );
 }, [questions, current, selected, score, answered, finished]);

 const q = questions[current];

 const handleSelect = useCallback(
  (idx: number) => {
   if (answered) return;
   setSelected(idx);
   setAnswered(true);
   if (idx === q.correctIndex) setScore((s: number) => s + 1);
  },
  [answered, q]
 );

 const handleNext = () => {
  if (current + 1 >= questions.length) {
   setFinished(true);
  } else {
   setCurrent((c: number) => c + 1);
   setSelected(null);
   setAnswered(false);
  }
 };

 const restart = () => {
  setQuestions(generateQuestions());
  setCurrent(0);
  setSelected(null);
  setScore(0);
  setAnswered(false);
  setFinished(false);
  localStorage.removeItem(QUIZ_STATE_KEY);
 };

 const progress = ((current + (answered ? 1 : 0)) / questions.length) * 100;

 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-3xl">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
        <AlertTriangle className="h-5 w-5 text-warning" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Quiz: Asincronías
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Identifica la asincronía a partir de la curva ventilatoria real.
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-3xl px-6 py-8">
    <Progress value={progress} className="mb-6 h-2" />

    {finished ? (
     <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
     >
      <Card>
       <CardContent className="p-8 text-center space-y-4">
        <Trophy className="h-12 w-12 mx-auto text-warning" />
        <h2 className="font-display text-2xl font-bold">Resultado</h2>
        <p className="text-4xl font-bold text-primary">
         {score}/{questions.length}
        </p>
        <p className="text-sm text-muted-foreground">
         {score === questions.length
          ? "¡Perfecto! Dominas la identificación de asincronías."
          : score >= questions.length * 0.7
           ? "¡Muy bien! Buen dominio de asincronías."
           : "Sigue practicando. Revisa el módulo de asincronías para reforzar."}
        </p>
        <Button onClick={restart} className="mt-4">
         <RotateCcw className="h-4 w-4 mr-2" /> Reintentar
        </Button>
       </CardContent>
      </Card>
     </motion.div>
    ) : (
     <AnimatePresence mode="wait">
      <motion.div
       key={current}
       initial={{ opacity: 0, x: 30 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -30 }}
       transition={{ duration: 0.3 }}
      >
       <Card>
        <CardHeader>
         <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">
           Pregunta {current + 1} de {questions.length}
          </CardTitle>
          <Badge variant="secondary">{score} correctas</Badge>
         </div>
        </CardHeader>
        <CardContent className="space-y-5">
         <p className="text-sm font-medium">
          ¿Qué asincronía muestra esta curva?
         </p>

         {q.asynchrony.image && (
          <div className="rounded-lg overflow-hidden border bg-muted/20">
           <img
            src={q.asynchrony.image}
            alt="Curva ventilatoria"
            className="w-full h-auto object-contain max-h-64"
           />
          </div>
         )}

         <div className="grid gap-2">
          {q.options.map((opt, idx) => {
           let variant: "outline" | "default" | "destructive" =
            "outline";
           let extraClass =
            "hover:border-primary/50 hover:bg-muted/50";

           if (answered) {
            if (idx === q.correctIndex) {
             variant = "default";
             extraClass =
              "bg-success/10 border-success text-success-foreground";
            } else if (idx === selected) {
             variant = "destructive";
             extraClass = "";
            } else {
             extraClass = "opacity-50";
            }
           }

           return (
            <button
             key={idx}
             onClick={() => handleSelect(idx)}
             disabled={answered}
             className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 text-sm ${extraClass} ${
              !answered && "cursor-pointer"
             }`}
            >
             <span className="font-mono text-xs text-muted-foreground w-5">
              {String.fromCharCode(65 + idx)}.
             </span>
             <span className="flex-1 font-medium">{opt}</span>
             {answered && idx === q.correctIndex && (
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
             )}
             {answered &&
              idx === selected &&
              idx !== q.correctIndex && (
               <XCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
            </button>
           );
          })}
         </div>

         {answered && (
          <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-3"
          >
           <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-semibold mb-1">
             {q.asynchrony.name}
            </p>
            <p className="text-xs text-muted-foreground">
             {q.asynchrony.curvePattern}
            </p>
           </div>
           <div className="flex justify-end">
            <Button onClick={handleNext} size="sm">
             {current + 1 >= questions.length
              ? "Ver resultado"
              : "Siguiente"}
             <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
           </div>
          </motion.div>
         )}
        </CardContent>
       </Card>
      </motion.div>
     </AnimatePresence>
    )}
   </div>
  </div>
 );
}
