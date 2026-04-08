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
import { Card, CardContent } from "@/components/ui/card";

export interface ExamData {
  exam_date: string;
  lung_side: string;
  zone: string;
  intercostal_space: string;
  anatomical_line: string;
  patient_position: string;
  transducer_type: string;
  frequency: string;
  imaging_mode: string;
  examiner: string;
  notes: string;
}

export const defaultExamData: ExamData = {
  exam_date: new Date().toISOString().split("T")[0],
  lung_side: "",
  zone: "",
  intercostal_space: "",
  anatomical_line: "",
  patient_position: "",
  transducer_type: "",
  frequency: "",
  imaging_mode: "",
  examiner: "",
  notes: "",
};

interface Props {
  data: ExamData;
  onChange: (data: ExamData) => void;
}

export default function ExamForm({ data, onChange }: Props) {
  const set = (key: keyof ExamData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Datos del examen
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Fecha</Label>
            <Input
              type="date"
              value={data.exam_date}
              onChange={e => set("exam_date", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Pulmón evaluado</Label>
            <Select
              value={data.lung_side}
              onValueChange={v => set("lung_side", v)}
            >
              <SelectTrigger>
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
            <Label className="text-xs">Zona explorada</Label>
            <Select value={data.zone} onValueChange={v => set("zone", v)}>
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anterior">Anterior</SelectItem>
                <SelectItem value="lateral">Lateral</SelectItem>
                <SelectItem value="posterior">Posterior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Espacio intercostal</Label>
            <Input
              value={data.intercostal_space}
              onChange={e => set("intercostal_space", e.target.value)}
              placeholder="Ej: 4to EIC"
              maxLength={20}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Línea anatómica</Label>
            <Select
              value={data.anatomical_line}
              onValueChange={v => set("anatomical_line", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medio-clavicular">
                  Medio clavicular
                </SelectItem>
                <SelectItem value="axilar-anterior">Axilar anterior</SelectItem>
                <SelectItem value="axilar-media">Axilar media</SelectItem>
                <SelectItem value="axilar-posterior">
                  Axilar posterior
                </SelectItem>
                <SelectItem value="escapular">Escapular</SelectItem>
                <SelectItem value="paravertebral">Paravertebral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Posición del paciente</Label>
            <Select
              value={data.patient_position}
              onValueChange={v => set("patient_position", v)}
            >
              <SelectTrigger>
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
          <div className="space-y-1">
            <Label className="text-xs">Transductor</Label>
            <Input
              value={data.transducer_type}
              onChange={e => set("transducer_type", e.target.value)}
              placeholder="Ej: Convex, lineal"
              maxLength={30}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Frecuencia</Label>
            <Input
              value={data.frequency}
              onChange={e => set("frequency", e.target.value)}
              placeholder="Ej: 3.5 MHz"
              maxLength={20}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Modo</Label>
            <Select
              value={data.imaging_mode}
              onValueChange={v => set("imaging_mode", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B-mode">B-mode</SelectItem>
                <SelectItem value="M-mode">M-mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Examinador</Label>
            <Input
              value={data.examiner}
              onChange={e => set("examiner", e.target.value)}
              placeholder="Nombre del profesional"
              maxLength={100}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-xs">Observaciones</Label>
            <Textarea
              value={data.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Notas adicionales..."
              rows={2}
              maxLength={500}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
