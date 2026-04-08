import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator } from "lucide-react";

const ZONE_LABELS = [
  "Anterior Superior Der.",
  "Anterior Inferior Der.",
  "Lateral Der.",
  "Posterior Superior Der.",
  "Posterior Inferior Der.",
  "Posterior Superior Izq.",
  "Posterior Inferior Izq.",
  "Lateral Izq.",
  "Anterior Inferior Izq.",
  "Anterior Superior Izq.",
  "Anterior Medio Der.",
  "Anterior Medio Izq.",
];

const SCORE_OPTIONS = [
  {
    value: 0,
    label: "Líneas A",
    description: "Aireación normal",
    color: "hsl(152, 60%, 40%)",
  },
  {
    value: 1,
    label: "Líneas B separadas",
    description: "Pérdida moderada",
    color: "hsl(38, 92%, 50%)",
  },
  {
    value: 2,
    label: "Líneas B confluentes",
    description: "Pérdida severa",
    color: "hsl(25, 80%, 50%)",
  },
  {
    value: 3,
    label: "Consolidación",
    description: "Pérdida completa",
    color: "hsl(0, 72%, 51%)",
  },
];

function getAerationLevel(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct === 0)
    return {
      level: "Normal",
      description: "Aireación pulmonar conservada",
      color: "hsl(152, 60%, 40%)",
    };
  if (pct <= 25)
    return {
      level: "Leve",
      description: "Pérdida leve de aireación",
      color: "hsl(38, 92%, 50%)",
    };
  if (pct <= 50)
    return {
      level: "Moderada",
      description: "Pérdida moderada de aireación",
      color: "hsl(25, 80%, 50%)",
    };
  if (pct <= 75)
    return {
      level: "Severa",
      description: "Pérdida severa de aireación",
      color: "hsl(0, 72%, 51%)",
    };
  return {
    level: "Crítica",
    description: "Pérdida crítica de aireación",
    color: "hsl(0, 84%, 40%)",
  };
}

export default function LUSCalculator() {
  const [zoneCount, setZoneCount] = useState<8 | 12>(12);
  const [scores, setScores] = useState<number[]>(Array(12).fill(0));

  const activeZones = ZONE_LABELS.slice(0, zoneCount);
  const activeScores = scores.slice(0, zoneCount);
  const totalScore = activeScores.reduce((a, b) => a + b, 0);
  const maxScore = zoneCount * 3;
  const aeration = getAerationLevel(totalScore, maxScore);

  const updateScore = (idx: number, value: number) => {
    const newScores = [...scores];
    newScores[idx] = value;
    setScores(newScores);
  };

  const reset = () => setScores(Array(12).fill(0));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Calculadora LUS Score
        </h1>
        <p className="text-muted-foreground">
          Calcula el Lung Ultrasound Score para evaluar la pérdida de aireación
          pulmonar
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1.5">
          <Button
            variant={zoneCount === 8 ? "default" : "outline"}
            size="sm"
            onClick={() => setZoneCount(8)}
            className="text-xs"
          >
            8 zonas
          </Button>
          <Button
            variant={zoneCount === 12 ? "default" : "outline"}
            size="sm"
            onClick={() => setZoneCount(12)}
            className="text-xs"
          >
            12 zonas
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="ml-auto text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reiniciar
        </Button>
      </div>

      {/* Score legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {SCORE_OPTIONS.map(opt => (
          <div
            key={opt.value}
            className="flex items-center gap-2 p-2 rounded-lg border bg-card"
          >
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: opt.color }}
            />
            <div>
              <p className="text-xs font-medium">
                {opt.value} – {opt.label}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {opt.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Zone inputs */}
        <div className="md:col-span-2 space-y-2">
          {activeZones.map((zone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{zone}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Zona {i + 1}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {SCORE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateScore(i, opt.value)}
                        className={`h-8 w-8 rounded-md text-xs font-bold transition-all ${
                          scores[i] === opt.value
                            ? "text-primary-foreground shadow-sm scale-110"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        style={
                          scores[i] === opt.value
                            ? { background: opt.color }
                            : {}
                        }
                        title={opt.label}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Result */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardContent className="p-6 text-center">
              <Calculator className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-display text-sm font-semibold text-muted-foreground mb-1">
                LUS Score Total
              </h3>
              <div
                className="text-5xl font-display font-bold mb-1"
                style={{ color: aeration.color }}
              >
                {totalScore}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                de {maxScore} puntos ({zoneCount} zonas)
              </p>

              {/* Progress bar */}
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: aeration.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalScore / maxScore) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <Badge
                className="text-sm px-3 py-1"
                style={{ background: aeration.color, color: "white" }}
              >
                {aeration.level}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {aeration.description}
              </p>

              <div className="mt-6 pt-4 border-t space-y-2 text-left">
                <h4 className="text-xs font-semibold text-muted-foreground">
                  Distribución
                </h4>
                {SCORE_OPTIONS.map(opt => {
                  const count = activeScores.filter(
                    s => s === opt.value
                  ).length;
                  return (
                    <div
                      key={opt.value}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground">{opt.label}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {count} zonas
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
