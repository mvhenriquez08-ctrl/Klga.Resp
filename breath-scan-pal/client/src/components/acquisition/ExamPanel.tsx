import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Save } from "lucide-react";
import FindingsChecklist, {
  type ClinicalFindings,
  defaultFindings,
} from "@/components/clinical/FindingsChecklist";
import InterpretationPanel from "@/components/clinical/InterpretationEngine";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  capturedFrameUrl: string | null;
  onAIAnalyze: (imageUrl: string) => void;
  isAnalyzing: boolean;
  aiFindings: Record<string, boolean> | null;
  aiPattern: string | null;
  aiInterpretation: string | null;
  aiConfidence: string | null;
  aiZoneScore: number | null;
}

const zones = [
  "R1 - Anterior superior derecho",
  "R2 - Anterior inferior derecho",
  "R3 - Lateral superior derecho",
  "R4 - Lateral inferior derecho",
  "R5 - Posterior superior derecho",
  "R6 - Posterior inferior derecho",
  "L1 - Anterior superior izquierdo",
  "L2 - Anterior inferior izquierdo",
  "L3 - Lateral superior izquierdo",
  "L4 - Lateral inferior izquierdo",
  "L5 - Posterior superior izquierdo",
  "L6 - Posterior inferior izquierdo",
];

export default function ExamPanel({
  capturedFrameUrl,
  onAIAnalyze,
  isAnalyzing,
  aiFindings,
  aiPattern,
  aiInterpretation,
  aiConfidence,
  aiZoneScore,
}: Props) {
  const [patientName, setPatientName] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [lungSide, setLungSide] = useState("");
  const [position, setPosition] = useState("");
  const [examiner, setExaminer] = useState("");
  const [findings, setFindings] = useState<ClinicalFindings>(defaultFindings);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Merge AI findings into manual findings
  const applyAIFindings = () => {
    if (!aiFindings) return;
    const merged = { ...findings };
    for (const [key, value] of Object.entries(aiFindings)) {
      if (value && key in merged) {
        (merged as Record<string, unknown>)[key] = true;
      }
    }
    setFindings(merged);
    toast({
      title: "Hallazgos de IA aplicados",
      description: "Puedes editar manualmente.",
    });
  };

  const saveExam = async () => {
    if (!patientName.trim()) {
      toast({ title: "Ingresa nombre del paciente", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { data: patient, error: pErr } = await supabase
        .from("patients")
        .insert({ name: patientName.trim() })
        .select()
        .single();
      if (pErr) throw pErr;

      const { error: eErr } = await supabase.from("lung_examinations").insert([
        {
          patient_id: patient.id,
          lung_side: lungSide || null,
          zone: selectedZone || null,
          patient_position: position || null,
          examiner: examiner || null,
          findings: JSON.parse(JSON.stringify(findings)),
          interpretation: aiInterpretation || null,
          notes: notes || null,
          lus_total: aiZoneScore || 0,
        },
      ]);
      if (eErr) throw eErr;

      toast({ title: "Examen guardado" });
      setPatientName("");
      setFindings(defaultFindings);
      setNotes("");
    } catch (err) {
      toast({
        title: "Error",
        description: String(err),
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-3 overflow-auto max-h-[calc(100vh-200px)]">
      {/* Patient quick data */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Datos rápidos
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Paciente</Label>
              <Input
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="Nombre"
                maxLength={100}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Pulmón</Label>
              <Select value={lungSide} onValueChange={setLungSide}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="derecho">Derecho</SelectItem>
                  <SelectItem value="izquierdo">Izquierdo</SelectItem>
                  <SelectItem value="bilateral">Bilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Posición</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supino">Supino</SelectItem>
                  <SelectItem value="semisentado">Semisentado</SelectItem>
                  <SelectItem value="sedente">Sedente</SelectItem>
                  <SelectItem value="lateral">Lateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Zona</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(z => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Examinador</Label>
              <Input
                value={examiner}
                onChange={e => setExaminer(e.target.value)}
                placeholder="Profesional"
                maxLength={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis trigger */}
      {capturedFrameUrl && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-3 items-center">
              <img
                src={capturedFrameUrl}
                alt="Frame"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-xs font-medium mb-1">Frame capturado</p>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onAIAnalyze(capturedFrameUrl)}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />{" "}
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" /> Analizar con IA
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* AI results */}
            {aiPattern && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {aiPattern}
                  </Badge>
                  {aiConfidence && (
                    <Badge variant="outline" className="text-[10px]">
                      {aiConfidence}
                    </Badge>
                  )}
                  {aiZoneScore !== null && (
                    <Badge variant="outline" className="text-[10px]">
                      Score: {aiZoneScore}/3
                    </Badge>
                  )}
                </div>
                {aiInterpretation && (
                  <p className="text-xs text-muted-foreground">
                    {aiInterpretation}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={applyAIFindings}
                >
                  Aplicar hallazgos de IA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Findings checklist */}
      <FindingsChecklist findings={findings} onChange={setFindings} />

      {/* Interpretation */}
      <InterpretationPanel findings={findings} />

      {/* Notes */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <Label className="text-xs">Observaciones</Label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Notas..."
          />
        </CardContent>
      </Card>

      {/* Save */}
      <Button
        className="w-full"
        onClick={saveExam}
        disabled={isSaving || !patientName.trim()}
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Guardando..." : "Guardar examen"}
      </Button>
    </div>
  );
}
