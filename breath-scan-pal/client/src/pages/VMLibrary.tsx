import { useState } from "react";
import { motion } from "framer-motion";
import { ventilationModes, ventilationParameters } from "@/data/ventilation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity, BookOpen, Settings, Wind } from "lucide-react";
import { NIVSection } from "@/data/NIVSection";

const categoryLabels: Record<string, string> = {
  controlled: "Controlado",
  assisted: "Asistido",
  spontaneous: "Espontáneo",
  hybrid: "Híbrido",
};

const categoryColors: Record<string, string> = {
  controlled: "bg-destructive/10 text-destructive",
  assisted: "bg-warning/10 text-warning",
  spontaneous: "bg-success/10 text-success",
  hybrid: "bg-info/10 text-info",
};

export default function VMLibrary() {
  const [selectedMode, setSelectedMode] = useState(ventilationModes[0].id);
  const mode = ventilationModes.find(m => m.id === selectedMode)!;

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Activity className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Biblioteca de Ventilación Mecánica Invasiva (VMI)
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60 max-w-2xl">
              Modos ventilatorios, parámetros respiratorios y conceptos
              fundamentales de ventilación mecánica invasiva.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <Tabs defaultValue="modes">
          <TabsList className="mb-6">
            <TabsTrigger value="modes" className="gap-2">
              <BookOpen className="h-4 w-4" /> Modos Ventilatorios
            </TabsTrigger>
            <TabsTrigger value="parameters" className="gap-2">
              <Settings className="h-4 w-4" /> Parámetros
            </TabsTrigger>
            <TabsTrigger value="niv" className="gap-2">
              <Wind className="h-4 w-4" /> VNI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modes">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                {ventilationModes.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedMode === m.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{m.icon}</span>
                      <span className="font-display font-semibold text-sm">
                        {m.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${categoryColors[m.category]}`}
                      >
                        {categoryLabels[m.category]}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {m.fullName}
                    </p>
                  </button>
                ))}
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <CardTitle className="font-display">
                          {mode.name} — {mode.fullName}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={`mt-1 ${categoryColors[mode.category]}`}
                        >
                          {categoryLabels[mode.category]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Descripción
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {mode.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Mecanismo</h4>
                      <p className="text-sm text-muted-foreground">
                        {mode.mechanism}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Indicaciones
                        </h4>
                        <ul className="space-y-1">
                          {mode.indications.map(i => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-success mt-0.5">•</span> {i}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Parámetros Clave
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {mode.keyParameters.map(p => (
                            <Badge
                              key={p}
                              variant="outline"
                              className="text-xs"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-success">
                          Ventajas
                        </h4>
                        <ul className="space-y-1">
                          {mode.advantages.map(a => (
                            <li
                              key={a}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-success mt-0.5">✓</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-destructive">
                          Desventajas
                        </h4>
                        <ul className="space-y-1">
                          {mode.disadvantages.map(d => (
                            <li
                              key={d}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-destructive mt-0.5">✗</span>{" "}
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ventilationParameters.map(param => (
                <Card key={param.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base flex items-center justify-between">
                      {param.name}
                      <Badge variant="outline" className="text-[10px]">
                        {param.unit}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {param.definition}
                    </p>
                    <div className="bg-muted/50 rounded-md p-2">
                      <p className="text-xs font-medium">
                        Rango normal: {param.normalRange}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {param.clinicalRelevance}
                    </p>
                    {param.formula && (
                      <div className="bg-primary/5 rounded-md p-2 border border-primary/10">
                        <p className="text-xs font-mono whitespace-pre-line">
                          {param.formula}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="niv">
            <div id="vni" className="scroll-mt-24">
              <NIVSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
