import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Activity,
  FileImage,
  Stethoscope,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function PatientDashboard() {
  const [selectedPatient, setSelectedPatient] = useState("");

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: lusRecords = [] } = useQuery({
    queryKey: ["lus-records", selectedPatient],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lung_examinations")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("exam_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: vmRecords = [] } = useQuery({
    queryKey: ["vm-records", selectedPatient],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ventilation_records")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("record_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: rxRecords = [] } = useQuery({
    queryKey: ["rx-records", selectedPatient],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xray_examinations")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("exam_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const patient = patients.find(p => p.id === selectedPatient);

  const lusEvolution = lusRecords
    .filter(r => r.lus_total != null)
    .map(r => ({ date: r.exam_date, score: r.lus_total }));

  const vmEvolution = vmRecords.map((r: any) => ({
    date: r.record_date,
    dp: r.driving_pressure,
    compliance: r.compliance,
    peep: r.peep,
    fio2: r.fio2,
  }));

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <BarChart3 className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Dashboard Multimodal
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Vista integrada de ultrasonido, ventilación mecánica y radiografía
              por paciente.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Seleccionar paciente" />
            </SelectTrigger>
            <SelectContent>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedPatient ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              Selecciona un paciente para ver su dashboard
            </p>
          </div>
        ) : (
          <>
            {/* Patient info + stats */}
            {patient && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Paciente</p>
                    <p className="font-semibold text-sm">{patient.name}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Edad</p>
                    <p className="font-semibold text-sm">
                      {patient.age || "—"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <Stethoscope className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{lusRecords.length}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Ecografías
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <Activity className="h-4 w-4 mx-auto mb-1 text-accent" />
                    <p className="text-lg font-bold">{vmRecords.length}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Registros VM
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <FileImage className="h-4 w-4 mx-auto mb-1 text-info" />
                    <p className="text-lg font-bold">{rxRecords.length}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Radiografías
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="evolution">
              <TabsList>
                <TabsTrigger value="evolution" className="gap-1">
                  <TrendingUp className="h-3 w-3" /> Evolución
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-1">
                  <BarChart3 className="h-3 w-3" /> Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evolution" className="space-y-4">
                {lusEvolution.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-display">
                        LUS Score — Evolución
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={lusEvolution}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ fontSize: 12 }} />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {vmEvolution.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-display">
                        Mecánica Ventilatoria — Evolución
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={vmEvolution}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ fontSize: 12 }} />
                          <Line
                            type="monotone"
                            dataKey="dp"
                            stroke="hsl(var(--destructive))"
                            name="Driving P."
                            strokeWidth={2}
                            dot
                          />
                          <Line
                            type="monotone"
                            dataKey="compliance"
                            stroke="hsl(var(--accent))"
                            name="Compliance"
                            strokeWidth={2}
                            dot
                          />
                          <Line
                            type="monotone"
                            dataKey="peep"
                            stroke="hsl(var(--warning))"
                            name="PEEP"
                            strokeWidth={1.5}
                            dot
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-display">
                      Timeline de Exámenes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {[
                      ...lusRecords.map(r => ({
                        type: "LUS",
                        date: r.exam_date,
                        detail: `Zona: ${r.zone || "—"} | Score: ${r.lus_total ?? "—"}`,
                        icon: Stethoscope,
                      })),
                      ...vmRecords.map((r: any) => ({
                        type: "VM",
                        date: r.record_date,
                        detail: `${r.ventilation_mode || "—"} | PEEP: ${r.peep ?? "—"} | DP: ${r.driving_pressure ?? "—"}`,
                        icon: Activity,
                      })),
                      ...rxRecords.map((r: any) => ({
                        type: "RX",
                        date: r.exam_date,
                        detail: `${(r.xray_type || "").toUpperCase()} | ${r.technical_quality || "—"}`,
                        icon: FileImage,
                      })),
                    ]
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 py-2 border-b last:border-0"
                        >
                          <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    {lusRecords.length === 0 &&
                      vmRecords.length === 0 &&
                      rxRecords.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Sin exámenes registrados
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
