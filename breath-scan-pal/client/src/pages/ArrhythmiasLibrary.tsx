import { useState } from "react";
import {
  arrhythmias,
  categoryLabels,
  severityLabels,
  ecgInterpretationSteps,
  type ArrhythmiaCategory,
  type Severity,
  type Arrhythmia,
} from "@/data/arrhythmias";
import { ECGTracing } from "@/components/ecg/ECGTracing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const severityColors: Record<Severity, string> = {
  benigna: "bg-green-500/10 text-green-400 border-green-500/30",
  moderada: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  critica: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function ArrhythmiasLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<
    ArrhythmiaCategory | "all"
  >("all");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "all">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [selectedArrhythmia, setSelectedArrhythmia] = useState<
    (typeof arrhythmias)[0] | null
  >(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const filtered = arrhythmias.filter(a => {
    if (selectedCategory !== "all" && a.category !== selectedCategory)
      return false;
    if (selectedSeverity !== "all" && a.severity !== selectedSeverity)
      return false;
    if (
      search &&
      !a.name.toLowerCase().includes(search.toLowerCase()) &&
      !a.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const toggleCheck = (key: string) =>
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-400" />
          Biblioteca de Arritmias
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Atlas completo de arritmias con criterios ECG, contexto UCI y manejo
        </p>
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Biblioteca ECG</TabsTrigger>
          <TabsTrigger value="interpretation">
            Interpretación Sistemática
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar arritmia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
              >
                Todas
              </Button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(key as ArrhythmiaCategory)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedSeverity === "all" ? "default" : "outline"}
                onClick={() => setSelectedSeverity("all")}
              >
                <Filter className="h-3 w-3 mr-1" /> Severidad
              </Button>
              {Object.entries(severityLabels).map(([key, label]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={selectedSeverity === key ? "default" : "outline"}
                  onClick={() => setSelectedSeverity(key as Severity)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {filtered.length} arritmias encontradas
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-colors h-full"
                  onClick={() => setSelectedArrhythmia(a)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {a.name}
                      </CardTitle>
                      <Badge
                        className={severityColors[a.severity]}
                        variant="outline"
                      >
                        {severityLabels[a.severity]}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="w-fit text-[10px]">
                      {categoryLabels[a.category]}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-[16/9] rounded-md overflow-hidden bg-muted">
                      <img
                        src={a.image || a.imageUrl}
                        alt={a.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {a.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {a.ecgCriteria.slice(0, 2).map((c, j) => (
                        <span
                          key={j}
                          className="text-[10px] bg-muted px-2 py-0.5 rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                      {a.ecgCriteria.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{a.ecgCriteria.length - 2} más
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interpretation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Interpretación Sistemática del ECG
              </CardTitle>
              <CardDescription>
                Checklist paso a paso para la lectura ordenada del
                electrocardiograma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ecgInterpretationSteps.map(step => (
                  <div
                    key={step.step}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {step.checkpoints.map((cp, j) => {
                        const key = `${step.step}-${j}`;
                        return (
                          <label
                            key={j}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                          >
                            <Checkbox
                              checked={!!checkedSteps[key]}
                              onCheckedChange={() => toggleCheck(key)}
                            />
                            <span
                              className={
                                checkedSteps[key]
                                  ? "text-foreground line-through opacity-60"
                                  : ""
                              }
                            >
                              {cp}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCheckedSteps({})}
                >
                  Reiniciar Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedArrhythmia}
        onOpenChange={() => setSelectedArrhythmia(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedArrhythmia && (
            <ScrollArea className="max-h-[80vh] pr-4">
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-lg">
                    {selectedArrhythmia.name}
                  </DialogTitle>
                  <Badge
                    className={severityColors[selectedArrhythmia.severity]}
                    variant="outline"
                  >
                    {severityLabels[selectedArrhythmia.severity]}
                  </Badge>
                  <Badge variant="secondary">
                    {categoryLabels[selectedArrhythmia.category]}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img
                    src={
                      selectedArrhythmia.image || selectedArrhythmia.imageUrl
                    }
                    alt={selectedArrhythmia.name}
                    className="w-full max-h-[250px] object-contain"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedArrhythmia.description}
                </p>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Activity className="h-4 w-4" /> Criterios ECG
                  </h4>
                  <ul className="space-y-1">
                    {selectedArrhythmia.ecgCriteria.map((c, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />{" "}
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3 space-y-1">
                    <h4 className="text-xs font-semibold text-primary">
                      Mecanismo
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedArrhythmia.mechanism}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3 space-y-1">
                    <h4 className="text-xs font-semibold text-primary">
                      Impacto Hemodinámico
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedArrhythmia.hemodynamicImpact}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-3 space-y-1 bg-orange-500/5 border-orange-500/20">
                  <h4 className="text-xs font-semibold text-orange-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Contexto UCI
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedArrhythmia.icuContext}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Manejo</h4>
                  <ul className="space-y-1">
                    {selectedArrhythmia.management.map((m, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary font-bold">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Diagnóstico Diferencial
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedArrhythmia.differentialDx.map((d, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-3 bg-primary/5 border-primary/20">
                  <h4 className="text-xs font-semibold text-primary mb-1">
                    💡 Dato Clave
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedArrhythmia.keyFact}
                  </p>
                </div>

                {selectedArrhythmia.electrophysiology && (
                  <div className="border rounded-lg p-3 space-y-1 bg-blue-500/5 border-blue-500/20">
                    <h4 className="text-xs font-semibold text-blue-400">
                      ⚡ Electrofisiología
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedArrhythmia.electrophysiology}
                    </p>
                  </div>
                )}

                {selectedArrhythmia.pharmacology && (
                  <div className="border rounded-lg p-3 space-y-1 bg-purple-500/5 border-purple-500/20">
                    <h4 className="text-xs font-semibold text-purple-400">
                      💊 Farmacología
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedArrhythmia.pharmacology}
                    </p>
                  </div>
                )}

                {selectedArrhythmia.escGuideline && (
                  <div className="border rounded-lg p-3 space-y-1 bg-green-500/5 border-green-500/20">
                    <h4 className="text-xs font-semibold text-green-400">
                      📋 Guía ESC 2022
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedArrhythmia.escGuideline}
                    </p>
                  </div>
                )}

                {selectedArrhythmia.references &&
                  selectedArrhythmia.references.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <h4 className="text-[10px] font-semibold text-muted-foreground mb-1">
                        Referencias
                      </h4>
                      <ul className="space-y-0.5">
                        {selectedArrhythmia.references.map((ref, i) => (
                          <li
                            key={i}
                            className="text-[10px] text-muted-foreground/70"
                          >
                            {i + 1}. {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
