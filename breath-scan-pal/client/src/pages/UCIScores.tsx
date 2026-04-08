import { useState } from "react";
import { allScores, type UCIScore } from "@/data/uciScores";
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
import { Calculator, RotateCcw, AlertTriangle } from "lucide-react";

export default function UCIScores() {
  const [activeTab, setActiveTab] = useState("sofa");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" /> Scores de UCI
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          SOFA, qSOFA, APACHE II y Murray Score con interpretación automática
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          {allScores.map(s => (
            <TabsTrigger key={s.id} value={s.id}>
              {s.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {allScores.map(score => (
          <TabsContent key={score.id} value={score.id} className="mt-4">
            <ScoreCalculator score={score} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ScoreCalculator({ score }: { score: UCIScore }) {
  const [values, setValues] = useState<Record<string, number>>({});

  const totalScore =
    score.id === "murray"
      ? (() => {
          const filled = score.fields.filter(f => values[f.id] !== undefined);
          if (filled.length === 0) return 0;
          const sum = filled.reduce((acc, f) => acc + (values[f.id] || 0), 0);
          return Math.round((sum / filled.length) * 10) / 10;
        })()
      : score.fields.reduce((acc, f) => acc + (values[f.id] || 0), 0);

  const result = score.interpret(totalScore);

  const reset = () => setValues({});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{score.fullName}</CardTitle>
            <CardDescription className="mt-1">
              {score.description}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {score.fields.map(field => (
          <div key={field.id} className="space-y-1.5">
            <p className="text-xs font-medium text-foreground">{field.label}</p>
            {field.type === "select" && field.options && (
              <div className="flex flex-wrap gap-1.5">
                {field.options.map(opt => (
                  <Button
                    key={opt.label}
                    size="sm"
                    variant={
                      values[field.id] === opt.value ? "default" : "outline"
                    }
                    className="text-xs h-7"
                    onClick={() =>
                      setValues({ ...values, [field.id]: opt.value })
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            )}
            {field.type === "checkbox" && (
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={values[field.id] === 1}
                  onChange={e =>
                    setValues({
                      ...values,
                      [field.id]: e.target.checked ? 1 : 0,
                    })
                  }
                  className="rounded border-border"
                />
                Presente (+1)
              </label>
            )}
          </div>
        ))}

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 text-center space-y-1">
          <p className="text-xs text-muted-foreground">{score.name} Score</p>
          <p className="text-4xl font-bold">{totalScore}</p>
          <p className={`text-lg font-semibold ${result.color}`}>
            {result.label}
          </p>
          <p className="text-sm text-muted-foreground">{result.detail}</p>
        </div>

        <div className="border-t pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">
            Referencias:
          </p>
          {score.references.map((ref, i) => (
            <p key={i} className="text-[10px] text-muted-foreground">
              {ref}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
