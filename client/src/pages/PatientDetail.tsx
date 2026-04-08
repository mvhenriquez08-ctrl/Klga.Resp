import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
 ArrowLeft,
 User,
 Wind,
 Activity,
 Stethoscope,
 FileText,
 Image,
 BarChart3,
} from "lucide-react";

export default function PatientDetail() {
 const [, params] = useRoute("/pacientes/:id");
 const [, setLocation] = useLocation();
 const id = params?.id;

 const { data: patient, isLoading } = useQuery({
  queryKey: ["patient", id],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id!)
    .single();
   if (error) throw error;
   return data;
  },
  enabled: !!id,
 });

 const { data: lusExams = [] } = useQuery({
  queryKey: ["patient-lus", id],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("lung_examinations")
    .select("*")
    .eq("patient_id", id!)
    .order("exam_date", { ascending: false })
    .limit(5);
   if (error) throw error;
   return data;
  },
  enabled: !!id,
 });

 const { data: vmRecords = [] } = useQuery({
  queryKey: ["patient-vm", id],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("ventilation_records")
    .select("*")
    .eq("patient_id", id!)
    .order("record_date", { ascending: false })
    .limit(5);
   if (error) throw error;
   return data;
  },
  enabled: !!id,
 });

 const { data: rxExams = [] } = useQuery({
  queryKey: ["patient-rx", id],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("xray_examinations")
    .select("*")
    .eq("patient_id", id!)
    .order("exam_date", { ascending: false })
    .limit(5);
   if (error) throw error;
   return data;
  },
  enabled: !!id,
 });

 const { data: abgRecords = [] } = useQuery({
  queryKey: ["patient-abg", id],
  queryFn: async () => {
   const { data, error } = await supabase
    .from("abg_records")
    .select("*")
    .eq("patient_id", id!)
    .order("record_date", { ascending: false })
    .limit(5);
   if (error) throw error;
   return data;
  },
  enabled: !!id,
 });

 if (isLoading) {
  return (
   <div className="flex items-center justify-center py-20">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
   </div>
  );
 }

 if (!patient) {
  return (
   <div className="p-6 text-center">
    <p className="text-muted-foreground">Paciente no encontrado</p>
    <Button
     variant="outline"
     className="mt-4"
     onClick={() => setLocation("/pacientes")}
    >
     <ArrowLeft className="h-4 w-4 mr-1" /> Volver
    </Button>
   </div>
  );
 }

 const p = patient as Record<string, unknown>;
 const lastAbg = p.recent_abg as Record<string, number> | null;

 return (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
   {/* Header */}
   <div className="flex items-start gap-4">
    <Button
     variant="ghost"
     size="icon"
     onClick={() => setLocation("/pacientes")}
    >
     <ArrowLeft className="h-4 w-4" />
    </Button>
    <div className="flex-1">
     <div className="flex items-center gap-2 flex-wrap mb-1">
      <h1 className="font-display text-2xl font-bold">
       {p.visibility_type === "anonimizado"
        ? String(p.initials || "—")
        : String(p.name || p.initials || "—")}
      </h1>
      {!!p.primary_diagnosis && (
       <Badge className="text-xs">{String(p.primary_diagnosis)}</Badge>
      )}
      {!!p.respiratory_support && (
       <Badge variant="outline" className="text-xs">
        {String(p.respiratory_support)}
       </Badge>
      )}
     </div>
     <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
      {!!p.age && <span>{String(p.age)} años</span>}
      {!!p.sex && <span>• {String(p.sex)}</span>}
      {!!p.weight && <span>• {String(p.weight)} kg</span>}
      {!!p.height && <span>• {String(p.height)} cm</span>}
      {!!p.hospital_id && <span>• HC: {String(p.hospital_id)}</span>}
     </div>
    </div>
   </div>

   {/* Summary Cards */}
   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <SummaryCard
     icon={<Activity className="h-4 w-4 text-primary" />}
     label="Ecografías LUS"
     value={lusExams.length}
     sub={
      lusExams[0] ? `Último: ${lusExams[0].exam_date}` : "Sin registros"
     }
    />
    <SummaryCard
     icon={<Wind className="h-4 w-4 text-accent" />}
     label="Registros VM"
     value={vmRecords.length}
     sub={
      vmRecords[0]
       ? `Último: ${vmRecords[0].record_date}`
       : "Sin registros"
     }
    />
    <SummaryCard
     icon={<Image className="h-4 w-4 text-primary" />}
     label="Radiografías"
     value={rxExams.length}
     sub={rxExams[0] ? `Último: ${rxExams[0].exam_date}` : "Sin registros"}
    />
    <SummaryCard
     icon={<BarChart3 className="h-4 w-4 text-accent" />}
     label="Gasometrías"
     value={abgRecords.length}
     sub={
      abgRecords[0] ? `pH: ${abgRecords[0].ph ?? "—"}` : "Sin registros"
     }
    />
   </div>

   {/* Tabs */}
   <Tabs defaultValue="resumen" className="space-y-4">
    <TabsList className="flex flex-wrap h-auto gap-1">
     <TabsTrigger value="resumen" className="text-xs">
      Resumen
     </TabsTrigger>
     <TabsTrigger value="ecografias" className="text-xs">
      Ecografías pulmonares
     </TabsTrigger>
     <TabsTrigger value="vm" className="text-xs">
      Ventilación mecánica
     </TabsTrigger>
     <TabsTrigger value="rx" className="text-xs">
      Radiografías
     </TabsTrigger>
     <TabsTrigger value="archivos" className="text-xs">
      Archivos clínicos
     </TabsTrigger>
     <TabsTrigger value="informes" className="text-xs">
      Informes
     </TabsTrigger>
    </TabsList>

    <TabsContent value="resumen">
     <div className="grid md:grid-cols-2 gap-4">
      {/* Clinical Context */}
      <Card>
       <CardContent className="p-4 space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
         <Stethoscope className="h-3 w-3" /> Contexto clínico
        </h4>
        <InfoRow label="Diagnóstico" value={p.primary_diagnosis} />
        <InfoRow label="Motivo ingreso" value={p.admission_reason} />
        <InfoRow label="Fenotipo" value={p.respiratory_phenotype} />
        <InfoRow label="Comorbilidades" value={p.comorbidities} />
        <InfoRow
         label="Ingreso UCI"
         value={p.icu_admission_date || p.admission_date}
        />
        {!!p.clinical_notes && (
         <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
           {String(p.clinical_notes)}
          </p>
         </div>
        )}
       </CardContent>
      </Card>

      {/* Respiratory Status */}
      <Card>
       <CardContent className="p-4 space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
         <Wind className="h-3 w-3" /> Estado respiratorio
        </h4>
        <InfoRow label="Soporte" value={p.respiratory_support} />
        {!!p.ventilation_mode && (
         <InfoRow label="Modo VM" value={p.ventilation_mode} />
        )}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
         <VitalItem label="FR" value={p.respiratory_rate} unit="rpm" />
         <VitalItem label="SpO₂" value={p.spo2} unit="%" />
         <VitalItem label="FC" value={p.heart_rate} unit="lpm" />
         <VitalItem label="PA" value={p.blood_pressure} />
         <VitalItem label="Posición" value={p.patient_position} />
        </div>
        {lastAbg && Object.keys(lastAbg).length > 0 && (
         <div className="pt-2 border-t">
          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">
           Gasometría
          </p>
          <div className="grid grid-cols-4 gap-2">
           <VitalItem label="pH" value={lastAbg.ph} />
           <VitalItem label="PaO₂" value={lastAbg.pao2} />
           <VitalItem label="PaCO₂" value={lastAbg.paco2} />
           <VitalItem label="HCO₃⁻" value={lastAbg.hco3} />
          </div>
         </div>
        )}
       </CardContent>
      </Card>
     </div>
    </TabsContent>

    <TabsContent value="ecografias">
     <RecordList
      records={lusExams}
      emptyText="Sin ecografías registradas"
      renderItem={r => (
       <div className="flex items-center justify-between">
        <div>
         <p className="text-sm font-medium">{r.exam_date}</p>
         <p className="text-xs text-muted-foreground">
          {[r.lung_side, r.zone].filter(Boolean).join(" · ") ||
           "Sin detalle"}
         </p>
        </div>
        {r.lus_total != null && (
         <Badge variant="outline">LUS: {r.lus_total}</Badge>
        )}
       </div>
      )}
     />
    </TabsContent>

    <TabsContent value="vm">
     <RecordList
      records={vmRecords}
      emptyText="Sin registros de ventilación"
      renderItem={r => (
       <div className="flex items-center justify-between">
        <div>
         <p className="text-sm font-medium">{r.record_date}</p>
         <p className="text-xs text-muted-foreground">
          {r.ventilation_mode || "—"} · PEEP: {r.peep ?? "—"} · FiO₂:{" "}
          {r.fio2 ?? "—"}%
         </p>
        </div>
        {r.driving_pressure && (
         <Badge variant="outline">ΔP: {r.driving_pressure}</Badge>
        )}
       </div>
      )}
     />
    </TabsContent>

    <TabsContent value="rx">
     <RecordList
      records={rxExams}
      emptyText="Sin radiografías registradas"
      renderItem={r => (
       <div>
        <p className="text-sm font-medium">{r.exam_date}</p>
        <p className="text-xs text-muted-foreground">
         {r.xray_type || "Rx tórax"}
        </p>
       </div>
      )}
     />
    </TabsContent>

    <TabsContent value="archivos">
     <EmptyState text="Sin archivos clínicos asociados" />
    </TabsContent>

    <TabsContent value="informes">
     <EmptyState text="Sin informes generados" />
    </TabsContent>
   </Tabs>
  </div>
 );
}

function SummaryCard({
 icon,
 label,
 value,
 sub,
}: {
 icon: React.ReactNode;
 label: string;
 value: number;
 sub: string;
}) {
 return (
  <Card>
   <CardContent className="p-3 text-center space-y-1">
    <div className="flex justify-center">{icon}</div>
    <p className="text-xl font-display font-bold">{value}</p>
    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    <p className="text-[9px] text-muted-foreground">{sub}</p>
   </CardContent>
  </Card>
 );
}

function InfoRow({ label, value }: { label: string; value: unknown }) {
 if (!value) return null;
 return (
  <div className="flex justify-between text-xs">
   <span className="text-muted-foreground">{label}</span>
   <span className="font-medium capitalize">{String(value)}</span>
  </div>
 );
}

function VitalItem({
 label,
 value,
 unit,
}: {
 label: string;
 value: unknown;
 unit?: string;
}) {
 return (
  <div className="text-center">
   <p className="text-[10px] text-muted-foreground">{label}</p>
   <p className="text-sm font-semibold">
    {value != null ? `${value}${unit ? ` ${unit}` : ""}` : "—"}
   </p>
  </div>
 );
}

function RecordList<T extends { id: string }>({
 records,
 emptyText,
 renderItem,
}: {
 records: T[];
 emptyText: string;
 renderItem: (r: T) => React.ReactNode;
}) {
 if (records.length === 0) return <EmptyState text={emptyText} />;
 return (
  <div className="space-y-2">
   {records.map(r => (
    <Card key={r.id}>
     <CardContent className="p-3">{renderItem(r)}</CardContent>
    </Card>
   ))}
  </div>
 );
}

function EmptyState({ text }: { text: string }) {
 return (
  <div className="text-center py-12">
   <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
   <p className="text-sm text-muted-foreground">{text}</p>
  </div>
 );
}
