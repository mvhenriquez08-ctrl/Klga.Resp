import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Stethoscope,
  Wind,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PatientData {
  name: string;
  initials: string;
  sex: string;
  age: string;
  height: string;
  weight: string;
  external_id: string;
  hospital_id: string;
  visibility_type: string;
  rut: string;
  phone: string;
  email: string;
  address: string;
  commune: string;
  prevision: string;
  bed_number: string;
  service_unit: string;
  establishment: string;
  responsible_professional: string;
  primary_diagnosis: string;
  admission_reason: string;
  icu_admission_date: string;
  comorbidities: string;
  respiratory_phenotype: string;
  clinical_notes: string;
  respiratory_support: string;
  ventilation_mode: string;
  respiratory_rate: string;
  spo2: string;
  heart_rate: string;
  blood_pressure: string;
  recent_abg_ph: string;
  recent_abg_pao2: string;
  recent_abg_paco2: string;
  recent_abg_hco3: string;
  patient_position: string;
}

export const defaultPatientData: PatientData = {
  name: "",
  initials: "",
  sex: "",
  age: "",
  height: "",
  weight: "",
  external_id: "",
  hospital_id: "",
  visibility_type: "identificado",
  rut: "",
  phone: "",
  email: "",
  address: "",
  commune: "",
  prevision: "",
  bed_number: "",
  service_unit: "",
  establishment: "",
  responsible_professional: "",
  primary_diagnosis: "",
  admission_reason: "",
  icu_admission_date: "",
  comorbidities: "",
  respiratory_phenotype: "",
  clinical_notes: "",
  respiratory_support: "",
  ventilation_mode: "",
  respiratory_rate: "",
  spo2: "",
  heart_rate: "",
  blood_pressure: "",
  recent_abg_ph: "",
  recent_abg_pao2: "",
  recent_abg_paco2: "",
  recent_abg_hco3: "",
  patient_position: "",
};

interface Props {
  data: PatientData;
  onChange: (data: PatientData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const STEPS = [
  { key: "identification", label: "Identificación", icon: User },
  { key: "clinical", label: "Contexto clínico", icon: Stethoscope },
  { key: "respiratory", label: "Estado respiratorio", icon: Wind },
] as const;

const DIAGNOSIS_OPTIONS = [
  "SDRA",
  "Neumonía",
  "EPOC",
  "Edema pulmonar",
  "Derrame pleural",
  "Neumotórax",
  "Atelectasia",
  "Trauma torácico",
  "Postoperatorio",
  "Insuficiencia respiratoria",
  "Otro",
];

const ADMISSION_REASONS = [
  "Insuficiencia respiratoria hipoxémica",
  "Insuficiencia respiratoria hipercápnica",
  "Protección de vía aérea",
  "Postoperatorio",
  "Shock",
  "Control evolutivo",
  "Otro",
];

const PHENOTYPE_OPTIONS = [
  "SDRA",
  "Edema pulmonar",
  "Neumonía",
  "Atelectasia",
  "Derrame pleural",
  "Neumotórax",
  "EPOC",
  "Mixto",
];

const SUPPORT_OPTIONS = [
  { value: "espontanea", label: "Respiración espontánea" },
  { value: "oxigenoterapia", label: "Oxigenoterapia convencional" },
  { value: "cnaf", label: "Cánula nasal de alto flujo" },
  { value: "vni", label: "Ventilación mecánica no invasiva" },
  { value: "vmi", label: "Ventilación mecánica invasiva" },
];

const VM_MODES = ["VCV", "PCV", "PSV", "SIMV", "APRV", "CPAP", "Otro"];
const POSITION_OPTIONS = [
  "Supino",
  "Semisentado",
  "Prono",
  "Sedente",
  "Lateral",
];
const PREVISION_OPTIONS = [
  "Fonasa A",
  "Fonasa B",
  "Fonasa C",
  "Fonasa D",
  "Isapre",
  "Particular",
  "Prais",
  "Otro",
];

function RequiredMark() {
  return <span className="text-destructive ml-0.5">*</span>;
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label className="text-xs font-medium text-foreground">
      {children}
      {required && <RequiredMark />}
    </Label>
  );
}

export default function PatientForm({
  data,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const [step, setStep] = useState(0);

  const set = (key: keyof PatientData, value: string) =>
    onChange({ ...data, [key]: value });

  const canAdvanceStep0 = data.initials.trim() && data.age && data.sex;
  const canAdvanceStep1 = data.primary_diagnosis && data.admission_reason;
  const canAdvanceStep2 = data.respiratory_support;

  const canAdvance =
    step === 0
      ? canAdvanceStep0
      : step === 1
        ? canAdvanceStep1
        : canAdvanceStep2;

  const next = () => {
    if (step < 2 && canAdvance) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={s.key} className="flex items-center gap-1">
              {i > 0 && (
                <div
                  className={cn(
                    "w-8 h-px",
                    isDone ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <button
                onClick={() => {
                  if (isDone) setStep(i);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isDone && "bg-primary/10 text-primary cursor-pointer",
                  !isActive && !isDone && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            </div>
          );
        })}
      </div>

      <Card className="border-border/60">
        <CardContent className="p-5">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">
                  Identificación del paciente
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <FieldLabel required>Iniciales</FieldLabel>
                  <Input
                    value={data.initials}
                    onChange={e =>
                      set("initials", e.target.value.toUpperCase())
                    }
                    placeholder="ABC"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel required>Edad</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={150}
                    value={data.age}
                    onChange={e => set("age", e.target.value)}
                    placeholder="Años"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel required>Sexo</FieldLabel>
                  <Select value={data.sex} onValueChange={v => set("sex", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Peso (kg)</FieldLabel>
                  <Input
                    type="number"
                    value={data.weight}
                    onChange={e => set("weight", e.target.value)}
                    placeholder="kg"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Talla (cm)</FieldLabel>
                  <Input
                    type="number"
                    value={data.height}
                    onChange={e => set("height", e.target.value)}
                    placeholder="cm"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>RUT / Documento</FieldLabel>
                  <Input
                    value={data.rut}
                    onChange={e => set("rut", e.target.value)}
                    placeholder="12.345.678-9"
                    maxLength={15}
                  />
                </div>
              </div>

              <Separator />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Datos de contacto e institucional
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <FieldLabel>Nombre completo</FieldLabel>
                  <Input
                    value={data.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Nombre completo"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input
                    value={data.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="+56912345678"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="paciente@email.com"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Dirección</FieldLabel>
                  <Input
                    value={data.address}
                    onChange={e => set("address", e.target.value)}
                    placeholder="Dirección"
                    maxLength={200}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Comuna / Ciudad</FieldLabel>
                  <Input
                    value={data.commune}
                    onChange={e => set("commune", e.target.value)}
                    placeholder="Santiago"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Previsión</FieldLabel>
                  <Select
                    value={data.prevision}
                    onValueChange={v => set("prevision", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREVISION_OPTIONS.map(p => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Datos institucionales
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <FieldLabel>ID hospitalario / Ficha</FieldLabel>
                  <Input
                    value={data.hospital_id}
                    onChange={e => set("hospital_id", e.target.value)}
                    placeholder="Ficha clínica"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>ID externo</FieldLabel>
                  <Input
                    value={data.external_id}
                    onChange={e => set("external_id", e.target.value)}
                    placeholder="ID externo"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Establecimiento</FieldLabel>
                  <Input
                    value={data.establishment}
                    onChange={e => set("establishment", e.target.value)}
                    placeholder="Hospital Base"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Servicio / Unidad</FieldLabel>
                  <Input
                    value={data.service_unit}
                    onChange={e => set("service_unit", e.target.value)}
                    placeholder="UCI Adultos"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>N° Cama</FieldLabel>
                  <Input
                    value={data.bed_number}
                    onChange={e => set("bed_number", e.target.value)}
                    placeholder="12"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Profesional responsable</FieldLabel>
                  <Input
                    value={data.responsible_professional}
                    onChange={e =>
                      set("responsible_professional", e.target.value)
                    }
                    placeholder="Dr. García"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Visibilidad</FieldLabel>
                  <Select
                    value={data.visibility_type}
                    onValueChange={v => set("visibility_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="identificado">Identificado</SelectItem>
                      <SelectItem value="anonimizado">Anonimizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Contexto clínico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <FieldLabel required>Diagnóstico principal</FieldLabel>
                  <Select
                    value={data.primary_diagnosis}
                    onValueChange={v => set("primary_diagnosis", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar diagnóstico" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIAGNOSIS_OPTIONS.map(d => (
                        <SelectItem key={d} value={d.toLowerCase()}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <FieldLabel required>
                    Motivo de ingreso / evaluación
                  </FieldLabel>
                  <Select
                    value={data.admission_reason}
                    onValueChange={v => set("admission_reason", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMISSION_REASONS.map(r => (
                        <SelectItem key={r} value={r.toLowerCase()}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Campos opcionales
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <FieldLabel>Fecha ingreso UCI / hospitalización</FieldLabel>
                  <Input
                    type="date"
                    value={data.icu_admission_date}
                    onChange={e => set("icu_admission_date", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Fenotipo respiratorio</FieldLabel>
                  <Select
                    value={data.respiratory_phenotype}
                    onValueChange={v => set("respiratory_phenotype", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {PHENOTYPE_OPTIONS.map(p => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <FieldLabel>Comorbilidades relevantes</FieldLabel>
                  <Textarea
                    value={data.comorbidities}
                    onChange={e => set("comorbidities", e.target.value)}
                    placeholder="Ej: DM2, HTA, EPOC, obesidad..."
                    className="min-h-[56px]"
                    maxLength={500}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <FieldLabel>Notas clínicas generales</FieldLabel>
                  <Textarea
                    value={data.clinical_notes}
                    onChange={e => set("clinical_notes", e.target.value)}
                    placeholder="Observaciones clínicas relevantes..."
                    className="min-h-[56px]"
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">
                  Estado respiratorio actual
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <FieldLabel required>Soporte respiratorio actual</FieldLabel>
                  <Select
                    value={data.respiratory_support}
                    onValueChange={v => set("respiratory_support", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar soporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {data.respiratory_support === "vmi" && (
                  <div className="space-y-1">
                    <FieldLabel>Modo ventilatorio actual</FieldLabel>
                    <Select
                      value={data.ventilation_mode}
                      onValueChange={v => set("ventilation_mode", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modo" />
                      </SelectTrigger>
                      <SelectContent>
                        {VM_MODES.map(m => (
                          <SelectItem key={m} value={m.toLowerCase()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Signos vitales (opcional)
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <FieldLabel>FR (rpm)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={80}
                    value={data.respiratory_rate}
                    onChange={e => set("respiratory_rate", e.target.value)}
                    placeholder="rpm"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>SpO₂ (%)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={data.spo2}
                    onChange={e => set("spo2", e.target.value)}
                    placeholder="%"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>FC (lpm)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    value={data.heart_rate}
                    onChange={e => set("heart_rate", e.target.value)}
                    placeholder="lpm"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Presión arterial</FieldLabel>
                  <Input
                    value={data.blood_pressure}
                    onChange={e => set("blood_pressure", e.target.value)}
                    placeholder="120/80"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <FieldLabel>Posición del paciente</FieldLabel>
                  <Select
                    value={data.patient_position}
                    onValueChange={v => set("patient_position", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITION_OPTIONS.map(p => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Gasometría arterial reciente
                </p>
                <Badge variant="outline" className="text-[9px]">
                  Opcional
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <FieldLabel>pH</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.recent_abg_ph}
                    onChange={e => set("recent_abg_ph", e.target.value)}
                    placeholder="7.40"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>PaO₂ (mmHg)</FieldLabel>
                  <Input
                    type="number"
                    value={data.recent_abg_pao2}
                    onChange={e => set("recent_abg_pao2", e.target.value)}
                    placeholder="mmHg"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>PaCO₂ (mmHg)</FieldLabel>
                  <Input
                    type="number"
                    value={data.recent_abg_paco2}
                    onChange={e => set("recent_abg_paco2", e.target.value)}
                    placeholder="mmHg"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>HCO₃⁻ (mEq/L)</FieldLabel>
                  <Input
                    type="number"
                    value={data.recent_abg_hco3}
                    onChange={e => set("recent_abg_hco3", e.target.value)}
                    placeholder="mEq/L"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={step === 0 ? onCancel : prev}
        >
          {step === 0 ? (
            "Cancelar"
          ) : (
            <>
              <ChevronLeft className="h-3 w-3 mr-1" />
              Anterior
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          Paso {step + 1} de 3
        </span>
        {step < 2 ? (
          <Button size="sm" onClick={next} disabled={!canAdvance}>
            Siguiente <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        ) : (
          <Button size="sm" onClick={onSave} disabled={!canAdvance || isSaving}>
            {isSaving ? "Guardando..." : "Guardar paciente"}
          </Button>
        )}
      </div>
    </div>
  );
}
