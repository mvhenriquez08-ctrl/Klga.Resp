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
  const hasSliding = findings.pleural_sliding !== false;

  // --- PERFIL A (Normalidad o TEP/Asma/EPOC) ---
  if (hasSliding && findings.a_lines && !findings.b_lines_multiple) {
    if (findings.pleural_effusion || findings.extensive_consolidation) {
      results.push({
        pattern: "Perfil A + PLAPS",
        confidence: "alta",
        description:
          "Líneas A con deslizamiento pero con hallazgos posterolaterales (PLAPS). Altamente sugerente de Neumonía o TEP.",
        icon: "warning",
      });
    } else {
      results.push({
        pattern: "Perfil A",
        confidence: "alta",
        description:
          "Patrón de aireación normal (Líneas A + Deslizamiento). En paciente disneico, considerar TEP (si hay TVP), Asma o EPOC.",
        icon: "normal",
      });
    }
  }

  // --- PERFIL B (Edema Pulmonar) ---
  if (hasSliding && findings.b_lines_multiple) {
    results.push({
      pattern: "Perfil B",
      confidence: "alta",
      description:
        "Líneas B difusas y bilaterales con deslizamiento conservado. Sugiere Edema Pulmonar Cardiogénico.",
      icon: "warning",
    });
  }

  // --- PERFIL B' (Neumonía) ---
  if (
    !hasSliding &&
    (findings.b_lines_multiple || findings.b_lines_confluent)
  ) {
    results.push({
      pattern: "Perfil B'",
      confidence: "moderada",
      description:
        "Líneas B con ausencia de deslizamiento pleural. Sugiere Neumonía.",
      icon: "warning",
    });
  }

  // --- PERFIL A/B (Neumonía / Asimetría) ---
  if (findings.b_lines_multiple && findings.a_lines) {
    results.push({
      pattern: "Perfil A/B",
      confidence: "moderada",
      description:
        "Hallazgos asimétricos (Líneas B en un pulmón y A en otro). Altamente sugerente de Neumonía.",
      icon: "warning",
    });
  }

  // --- PERFIL C (Consolidación / Neumonía) ---
  if (findings.extensive_consolidation || findings.subpleural_consolidation) {
    results.push({
      pattern: "Perfil C",
      confidence: "alta",
      description: findings.dynamic_air_bronchogram
        ? "Consolidación anterior (Perfil C) con broncograma dinámico. Diagnóstico de Neumonía."
        : "Presencia de consolidación subpleural o extensa. Sugiere Neumonía o Atelectasia.",
      icon: "warning",
    });
  }

  // --- PERFIL NEUMOTÓRAX ---
  if (!hasSliding && findings.barcode_sign) {
    if (findings.lung_point) {
      results.push({
        pattern: "Neumotórax Confirmado",
        confidence: "alta",
        description:
          "Punto Pulmonar identificado (especificidad 100%). Neumotórax presente.",
        icon: "warning",
      });
    } else {
      results.push({
        pattern: "Sospecha de Neumotórax",
        confidence: "moderada",
        description:
          "Ausencia de deslizamiento y Signo del Código de Barras (M-mode). Buscar Punto Pulmonar para confirmar.",
        icon: "warning",
      });
    }
  }

  // Derrame Complejo
  if (findings.pleural_effusion && findings.septa) {
    results.push({
      pattern: "Derrame Complejo",
      confidence: "alta",
      description:
        "Presencia de septos en espacio anecoico. Sugiere empiema o exudado organizado.",
      icon: "warning",
    });
  }

  if (results.length === 0) {
    results.push({
      pattern: "Evaluación Incompleta",
      confidence: "baja",
      description:
        "Complete el checklist para correlacionar con perfiles diagnósticos (BLUE Protocol).",
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
