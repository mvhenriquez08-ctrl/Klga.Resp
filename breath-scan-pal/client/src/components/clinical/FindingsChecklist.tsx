import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface ClinicalFindings {
  pleural_sliding: boolean | null; // true=present, false=absent, null=not evaluated
  lung_pulse: boolean;
  a_lines: boolean;
  b_lines_isolated: boolean;
  b_lines_multiple: boolean;
  b_lines_confluent: boolean;
  irregular_pleural_line: boolean;
  subpleural_consolidation: boolean;
  extensive_consolidation: boolean;
  dynamic_air_bronchogram: boolean;
  static_air_bronchogram: boolean;
  pleural_effusion: boolean;
  septa: boolean;
  sinusoid_sign: boolean;
  quadrilateral_sign: boolean;
  jellyfish_sign: boolean;
  barcode_sign: boolean;
  seashore_sign: boolean;
  lung_point: boolean;
}

export const defaultFindings: ClinicalFindings = {
  pleural_sliding: null,
  lung_pulse: false,
  a_lines: false,
  b_lines_isolated: false,
  b_lines_multiple: false,
  b_lines_confluent: false,
  irregular_pleural_line: false,
  subpleural_consolidation: false,
  extensive_consolidation: false,
  dynamic_air_bronchogram: false,
  static_air_bronchogram: false,
  pleural_effusion: false,
  septa: false,
  sinusoid_sign: false,
  quadrilateral_sign: false,
  jellyfish_sign: false,
  barcode_sign: false,
  seashore_sign: false,
  lung_point: false,
};

const findingsGroups = [
  {
    title: "Deslizamiento y líneas",
    items: [
      { key: "a_lines", label: "Líneas A" },
      { key: "b_lines_isolated", label: "Líneas B aisladas" },
      { key: "b_lines_multiple", label: "Líneas B múltiples" },
      { key: "b_lines_confluent", label: "Líneas B confluyentes" },
      { key: "irregular_pleural_line", label: "Línea pleural irregular" },
      { key: "lung_pulse", label: "Pulso pulmonar" },
    ],
  },
  {
    title: "Consolidación",
    items: [
      { key: "subpleural_consolidation", label: "Consolidación subpleural" },
      { key: "extensive_consolidation", label: "Consolidación extensa" },
      { key: "dynamic_air_bronchogram", label: "Broncograma aéreo dinámico" },
      { key: "static_air_bronchogram", label: "Broncograma aéreo estático" },
    ],
  },
  {
    title: "Derrame y signos",
    items: [
      { key: "pleural_effusion", label: "Derrame pleural" },
      { key: "septa", label: "Septos" },
      { key: "sinusoid_sign", label: "Signo del sinusoide" },
      { key: "quadrilateral_sign", label: "Signo del cuadrilátero" },
      { key: "jellyfish_sign", label: "Signo de la medusa" },
    ],
  },
  {
    title: "Modo M y neumotórax",
    items: [
      { key: "barcode_sign", label: "Signo del código de barras" },
      { key: "seashore_sign", label: "Signo de la playa" },
      { key: "lung_point", label: "Punto pulmonar" },
    ],
  },
];

interface Props {
  findings: ClinicalFindings;
  onChange: (findings: ClinicalFindings) => void;
}

export default function FindingsChecklist({ findings, onChange }: Props) {
  const toggleFinding = (key: string) => {
    onChange({ ...findings, [key]: !findings[key as keyof ClinicalFindings] });
  };

  return (
    <div className="space-y-4">
      {/* Pleural sliding special control */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Deslizamiento pleural
          </h4>
          <div className="flex gap-4">
            {[
              { value: true, label: "Presente" },
              { value: false, label: "Ausente" },
              { value: null, label: "No evaluado" },
            ].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() =>
                  onChange({
                    ...findings,
                    pleural_sliding: opt.value as boolean | null,
                  })
                }
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  findings.pleural_sliding === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grouped checkboxes */}
      {findingsGroups.map(group => (
        <Card key={group.title}>
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.title}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <Checkbox
                    id={item.key}
                    checked={!!findings[item.key as keyof ClinicalFindings]}
                    onCheckedChange={() => toggleFinding(item.key)}
                  />
                  <Label htmlFor={item.key} className="text-xs cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
