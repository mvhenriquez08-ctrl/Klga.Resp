import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FlaskConical,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
} from "lucide-react";
import ABGTrends from "./ABGTrends";

interface ABGResult {
  primaryDisorder: string;
  compensation: string;
  oxygenation: string;
  anionGap: number;
  pfRatio: number;
  severity: "normal" | "mild" | "moderate" | "severe";
  details: string[];
}

function interpretABG(
  ph: number,
  paco2: number,
  hco3: number,
  pao2: number,
  fio2: number,
  lactate: number
): ABGResult {
  const details: string[] = [];
  let primaryDisorder = "";
  let compensation = "";
  let severity: ABGResult["severity"] = "normal";

  // Anion Gap
  const na = 140; // assumed
  const cl = 104; // assumed
  const anionGap = na - (cl + hco3);
  const pfRatio = fio2 > 0 ? pao2 / (fio2 / 100) : 0;

  // Primary disorder
  if (ph < 7.35) {
    if (paco2 > 45) {
      primaryDisorder = "Acidosis Respiratoria";
      const expectedHCO3 = 24 + (paco2 - 40) * 0.1;
      if (hco3 > expectedHCO3 + 2) {
        compensation = "Compensación metabólica presente (crónica)";
      } else {
        compensation = "Sin compensación metabólica adecuada (aguda)";
      }
    } else {
      primaryDisorder = "Acidosis Metabólica";
      const expectedPaCO2 = 1.5 * hco3 + 8;
      if (Math.abs(paco2 - expectedPaCO2) <= 2) {
        compensation = "Compensación respiratoria adecuada (Winter)";
      } else if (paco2 < expectedPaCO2) {
        compensation = "Alcalosis respiratoria sobreañadida";
      } else {
        compensation = "Acidosis respiratoria sobreañadida";
      }
      if (anionGap > 12) {
        details.push(
          `Anion Gap elevado (${anionGap.toFixed(1)}) → Acidosis metabólica con AG aumentado`
        );
        const deltaGap = anionGap - 12;
        const deltaHCO3 = 24 - hco3;
        const ratio = deltaHCO3 > 0 ? deltaGap / deltaHCO3 : 0;
        if (ratio < 0.8)
          details.push(
            "Delta/Delta < 0.8: acidosis metabólica hiperclorémica coexistente"
          );
        else if (ratio > 1.2)
          details.push("Delta/Delta > 1.2: alcalosis metabólica coexistente");
      } else {
        details.push("Anion Gap normal → Acidosis metabólica hiperclorémica");
      }
    }
    severity = ph < 7.2 ? "severe" : ph < 7.3 ? "moderate" : "mild";
  } else if (ph > 7.45) {
    if (paco2 < 35) {
      primaryDisorder = "Alcalosis Respiratoria";
      const expectedHCO3 = 24 - (40 - paco2) * 0.2;
      if (hco3 < expectedHCO3 - 2) {
        compensation = "Compensación metabólica presente (crónica)";
      } else {
        compensation = "Sin compensación metabólica (aguda)";
      }
    } else {
      primaryDisorder = "Alcalosis Metabólica";
      const expectedPaCO2 = 40 + 0.7 * (hco3 - 24);
      if (Math.abs(paco2 - expectedPaCO2) <= 2) {
        compensation = "Compensación respiratoria adecuada";
      } else {
        compensation = "Compensación respiratoria inadecuada";
      }
    }
    severity = ph > 7.6 ? "severe" : ph > 7.5 ? "moderate" : "mild";
  } else {
    primaryDisorder = "Equilibrio ácido-base normal";
    compensation = "No requiere compensación";
    severity = "normal";
  }

  // Oxygenation
  let oxygenation = "";
  if (pfRatio > 0) {
    if (pfRatio >= 400) oxygenation = "Oxigenación normal";
    else if (pfRatio >= 300) oxygenation = "Deterioro leve de oxigenación";
    else if (pfRatio >= 200) oxygenation = "SDRA leve (PaFi 200-300)";
    else if (pfRatio >= 100) oxygenation = "SDRA moderado (PaFi 100-200)";
    else oxygenation = "SDRA severo (PaFi < 100)";
  }

  if (pao2 < 60) details.push("⚠️ Hipoxemia severa (PaO2 < 60 mmHg)");
  if (lactate > 2)
    details.push(
      `⚠️ Lactato elevado (${lactate} mmol/L) — considerar hipoperfusión`
    );

  return {
    primaryDisorder,
    compensation,
    oxygenation,
    anionGap,
    pfRatio,
    severity,
    details,
  };
}

const severityColor = {
  normal: "bg-success/10 text-success border-success/20",
  mild: "bg-warning/10 text-warning border-warning/20",
  moderate: "bg-destructive/10 text-destructive border-destructive/20",
  severe: "bg-destructive/20 text-destructive border-destructive/40",
};

export default function ABGModule() {
  const [values, setValues] = useState({
    ph: "",
    paco2: "",
    hco3: "",
    pao2: "",
    fio2: "",
    lactate: "",
    sao2: "",
    be: "",
  });
  const [result, setResult] = useState<ABGResult | null>(null);

  const update = (key: string, val: string) =>
    setValues(v => ({ ...v, [key]: val }));

  const calculate = () => {
    const ph = parseFloat(values.ph);
    const paco2 = parseFloat(values.paco2);
    const hco3 = parseFloat(values.hco3);
    const pao2 = parseFloat(values.pao2) || 0;
    const fio2 = parseFloat(values.fio2) || 21;
    const lactate = parseFloat(values.lactate) || 0;
    if (isNaN(ph) || isNaN(paco2) || isNaN(hco3)) return;
    setResult(interpretABG(ph, paco2, hco3, pao2, fio2, lactate));
  };

  const fields = [
    { key: "ph", label: "pH", placeholder: "7.40", unit: "" },
    { key: "paco2", label: "PaCO₂", placeholder: "40", unit: "mmHg" },
    { key: "hco3", label: "HCO₃⁻", placeholder: "24", unit: "mEq/L" },
    { key: "pao2", label: "PaO₂", placeholder: "90", unit: "mmHg" },
    { key: "fio2", label: "FiO₂", placeholder: "21", unit: "%" },
    { key: "lactate", label: "Lactato", placeholder: "1.0", unit: "mmol/L" },
    { key: "sao2", label: "SaO₂", placeholder: "98", unit: "%" },
    { key: "be", label: "Base Excess", placeholder: "0", unit: "mEq/L" },
  ];

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <FlaskConical className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Gasometría Arterial
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Interpretación automatizada y tendencias temporales de gases
              arteriales.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">
        <Tabs defaultValue="interpreter" className="space-y-6">
          <TabsList>
            <TabsTrigger value="interpreter" className="gap-1.5">
              <Calculator className="h-3.5 w-3.5" /> Interpretación
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Tendencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interpreter">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-display flex items-center gap-2">
                    <Calculator className="h-4 w-4" /> Valores de Gasometría
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {fields.map(f => (
                      <div key={f.key} className="space-y-1">
                        <Label className="text-xs">
                          {f.label}{" "}
                          {f.unit && (
                            <span className="text-muted-foreground">
                              ({f.unit})
                            </span>
                          )}
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder={f.placeholder}
                          value={values[f.key as keyof typeof values]}
                          onChange={e => update(f.key, e.target.value)}
                          className="h-9"
                        />
                      </div>
                    ))}
                  </div>
                  <Button onClick={calculate} className="w-full mt-2">
                    <FlaskConical className="h-4 w-4" /> Interpretar
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {result ? (
                  <>
                    <Card
                      className={`border ${severityColor[result.severity]}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {result.severity === "normal" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5" />
                          )}
                          <h3 className="font-display font-bold">
                            {result.primaryDisorder}
                          </h3>
                        </div>
                        <p className="text-sm">{result.compensation}</p>
                      </CardContent>
                    </Card>

                    {result.oxygenation && (
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-display font-semibold mb-1">
                            Oxigenación
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.oxygenation}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <Badge variant="outline">
                              PaFi: {result.pfRatio.toFixed(0)}
                            </Badge>
                            <Badge variant="outline">
                              AG: {result.anionGap.toFixed(1)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result.details.length > 0 && (
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <h4 className="text-sm font-display font-semibold flex items-center gap-1">
                            <Info className="h-4 w-4" /> Análisis detallado
                          </h4>
                          {result.details.map((d, i) => (
                            <p
                              key={i}
                              className="text-xs text-muted-foreground"
                            >
                              {d}
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">
                      Ingresa los valores para ver la interpretación
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <ABGTrends embedded />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
