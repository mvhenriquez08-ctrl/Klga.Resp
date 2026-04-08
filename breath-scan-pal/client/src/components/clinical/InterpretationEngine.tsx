import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { ClinicalFindings } from "./FindingsChecklist";

interface Interpretation {
  pattern: string;
  confidence: "alta" | "moderada" | "baja";
  description: string;
  icon: "normal" | "warning" | "info";
}

export function interpretFindings(
  findings: ClinicalFindings
): Interpretation[] {
  const results: Interpretation[] = [];

  // Normal pattern
  if (
    findings.pleural_sliding === true &&
    findings.a_lines &&
    !findings.b_lines_multiple &&
    !findings.b_lines_confluent &&
    !findings.pleural_effusion &&
    !findings.extensive_consolidation &&
    !findings.subpleural_consolidation
  ) {
    results.push({
      pattern: "Patrón normal",
      confidence: "alta",
      description:
        "Deslizamiento pleural presente con líneas A. Patrón de aireación normal.",
      icon: "normal",
    });
  }

  // Interstitial syndrome
  if (findings.b_lines_multiple || findings.b_lines_confluent) {
    results.push({
      pattern: "Síndrome intersticial",
      confidence: findings.b_lines_confluent ? "alta" : "moderada",
      description: findings.b_lines_confluent
        ? "Líneas B confluyentes sugieren edema pulmonar o síndrome intersticial severo."
        : "Líneas B múltiples sugieren compromiso intersticial. Evaluar contexto clínico.",
      icon: "warning",
    });
  }

  // Consolidation
  if (findings.extensive_consolidation || findings.subpleural_consolidation) {
    results.push({
      pattern: "Consolidación pulmonar",
      confidence: findings.dynamic_air_bronchogram ? "alta" : "moderada",
      description: findings.dynamic_air_bronchogram
        ? "Consolidación con broncograma aéreo dinámico sugiere neumonía."
        : "Consolidación identificada. Correlacionar con clínica para diferenciar neumonía, atelectasia u otra etiología.",
      icon: "warning",
    });
  }

  // Atelectasis
  if (
    (findings.extensive_consolidation || findings.subpleural_consolidation) &&
    findings.static_air_bronchogram &&
    !findings.dynamic_air_bronchogram
  ) {
    results.push({
      pattern: "Atelectasia",
      confidence: "moderada",
      description:
        "Consolidación con broncograma aéreo estático sugiere atelectasia.",
      icon: "info",
    });
  }

  // Pleural effusion
  if (findings.pleural_effusion) {
    results.push({
      pattern: "Derrame pleural",
      confidence: "alta",
      description: findings.septa
        ? "Derrame pleural con septos. Considerar derrame complejo o exudado."
        : "Derrame pleural identificado. Evaluar cuantía y características.",
      icon: "warning",
    });
  }

  // Pneumothorax
  if (findings.pleural_sliding === false && findings.barcode_sign) {
    results.push({
      pattern: "Neumotórax",
      confidence: findings.lung_point ? "alta" : "moderada",
      description: findings.lung_point
        ? "Ausencia de deslizamiento pleural + código de barras + punto pulmonar. Alta sospecha de neumotórax."
        : "Ausencia de deslizamiento pleural + código de barras. Sospecha de neumotórax. Buscar punto pulmonar para confirmar.",
      icon: "warning",
    });
  }

  if (results.length === 0) {
    results.push({
      pattern: "Evaluación incompleta",
      confidence: "baja",
      description:
        "Complete el checklist de hallazgos para obtener una interpretación orientativa.",
      icon: "info",
    });
  }

  return results;
}

interface Props {
  findings: ClinicalFindings;
}

export default function InterpretationPanel({ findings }: Props) {
  const interpretations = interpretFindings(findings);

  const iconMap = {
    normal: <CheckCircle className="h-4 w-4 text-green-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
  };

  const confidenceColor = {
    alta: "bg-green-500/10 text-green-700 border-green-200",
    moderada: "bg-amber-500/10 text-amber-700 border-amber-200",
    baja: "bg-muted text-muted-foreground",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Interpretación asistida
        </h4>
        <p className="text-[10px] text-muted-foreground mb-3">
          ⚠️ Orientativo — no reemplaza el juicio clínico
        </p>
        <div className="space-y-3">
          {interpretations.map((interp, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="mt-0.5">{iconMap[interp.icon]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {interp.pattern}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${confidenceColor[interp.confidence]}`}
                  >
                    {interp.confidence}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {interp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
