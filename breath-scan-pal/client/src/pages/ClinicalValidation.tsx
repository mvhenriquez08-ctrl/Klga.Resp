import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function ClinicalValidation() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [validations, setValidations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, v] = await Promise.all([
        supabase
          .from("ai_predictions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("validated_findings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (p.data) setPredictions(p.data);
      if (v.data) setValidations(v.data);
      setLoading(false);
    })();
  }, []);

  const statusIcon = (s: string) => {
    if (s === "completed")
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
    if (s === "failed") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Validación Clínica
        </h1>
        <p className="text-muted-foreground mt-1">
          Predicciones IA, hallazgos validados y ground truth
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Predicciones", v: predictions.length, i: Brain },
          {
            l: "Completadas",
            v: predictions.filter(p => p.status === "completed").length,
            i: CheckCircle2,
          },
          { l: "Validaciones", v: validations.length, i: ShieldCheck },
          {
            l: "Tasa",
            v: predictions.length
              ? `${Math.round((validations.length / predictions.length) * 100)}%`
              : "—",
            i: AlertTriangle,
          },
        ].map(s => (
          <Card key={s.l} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.i className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="predictions">
        <TabsList>
          <TabsTrigger value="predictions">Predicciones IA</TabsTrigger>
          <TabsTrigger value="validated">Validados</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          {predictions.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Sin predicciones. Usa los módulos de análisis para generar.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Patrón</TableHead>
                  <TableHead>Interpretación</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="flex items-center gap-2">
                      {statusIcon(p.status)} {p.status}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {p.suggested_pattern || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {p.suggested_interpretation || "—"}
                    </TableCell>
                    <TableCell>{p.confidence_level || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="validated">
          {validations.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Sin hallazgos validados aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Validado por</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validations.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.source_type}</TableCell>
                    <TableCell className="font-medium">
                      {v.final_diagnosis || "—"}
                    </TableCell>
                    <TableCell>
                      {v.severity_level ? (
                        <Badge variant="outline">{v.severity_level}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {v.validated_by || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(v.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
