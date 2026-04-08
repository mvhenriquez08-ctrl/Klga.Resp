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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Columns2, Stethoscope, FileImage } from "lucide-react";

export default function EcoRxComparator() {
  const [selectedPatient, setSelectedPatient] = useState("");

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: lusRecords = [] } = useQuery({
    queryKey: ["lus-compare", selectedPatient],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lung_examinations")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("exam_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: rxRecords = [] } = useQuery({
    queryKey: ["rx-compare", selectedPatient],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xray_examinations")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("exam_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const findingsStr = (findings: Record<string, boolean | null> | null) => {
    if (!findings) return [];
    return Object.entries(findings)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/_/g, " "));
  };

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
                <Columns2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Comparador ECO vs RX
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Compara hallazgos ecográficos y radiográficos del mismo paciente.
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
            <Columns2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              Selecciona un paciente para comparar hallazgos
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* LUS Column */}
            <div>
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" /> Ultrasonido
                Pulmonar
              </h2>
              {lusRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Sin evaluaciones ecográficas
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {lusRecords.map(r => (
                    <Card key={r.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            {r.exam_date}
                          </Badge>
                          {r.lus_total != null && (
                            <Badge className="text-[10px]">
                              Score: {r.lus_total}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs">
                          {r.lung_side && (
                            <span className="text-muted-foreground">
                              Pulmón: {r.lung_side}
                            </span>
                          )}
                          {r.zone && (
                            <span className="text-muted-foreground">
                              Zona: {r.zone}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {findingsStr(r.findings as any).map(f => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                        {r.interpretation && (
                          <p className="text-xs text-muted-foreground">
                            {r.interpretation}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* RX Column */}
            <div>
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <FileImage className="h-4 w-4 text-info" /> Radiografía de Tórax
              </h2>
              {rxRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Sin estudios radiográficos
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {rxRecords.map((r: any) => (
                    <Card key={r.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            {r.exam_date}
                          </Badge>
                          {r.xray_type && (
                            <Badge className="text-[10px]">
                              {r.xray_type.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        {r.technical_quality && (
                          <p className="text-xs text-muted-foreground">
                            Calidad: {r.technical_quality}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {findingsStr(r.findings).map(f => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                        {r.notes && (
                          <p className="text-xs text-muted-foreground">
                            {r.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
