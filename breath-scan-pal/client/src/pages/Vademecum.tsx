import { useState, useMemo } from "react";
import {
  drugs,
  categoryLabels,
  categoryColors,
  type Drug,
  type DrugCategory,
} from "@/data/vademecum";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Pill,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const allCategories: DrugCategory[] = [
  "vasopressor",
  "inotrope",
  "sedation",
  "analgesic",
  "nmb",
  "other",
];

export default function Vademecum() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<DrugCategory | "all">("all");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [weight, setWeight] = useState<number>(70);

  const filtered = useMemo(
    () =>
      drugs.filter(d => {
        const matchSearch =
          !search ||
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.indication.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === "all" || d.category === selectedCat;
        return matchSearch && matchCat;
      }),
    [search, selectedCat]
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" /> Farmacología UCI
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fármacos críticos con calculadora de dosis ajustada por peso
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar fármaco..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            className="w-20"
            min={1}
            max={300}
          />
          <span className="text-xs text-muted-foreground">kg</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge
          variant={selectedCat === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCat("all")}
        >
          Todos ({drugs.length})
        </Badge>
        {allCategories.map(cat => {
          const count = drugs.filter(d => d.category === cat).length;
          return (
            <Badge
              key={cat}
              variant={selectedCat === cat ? "default" : "outline"}
              className={`cursor-pointer ${selectedCat === cat ? "" : categoryColors[cat]}`}
              onClick={() => setSelectedCat(cat)}
            >
              {categoryLabels[cat]} ({count})
            </Badge>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(drug => (
            <motion.div
              key={drug.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/50 transition-all h-full"
                onClick={() => setSelectedDrug(drug)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{drug.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${categoryColors[drug.category]}`}
                    >
                      {categoryLabels[drug.category]}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {drug.indication}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">
                      <span className="font-medium">Rango:</span>{" "}
                      {drug.doseRange.min}-{drug.doseRange.max}{" "}
                      {drug.doseRange.unit}
                    </p>
                    {drug.doseRange.perKg && (
                      <p className="text-xs font-mono text-primary">
                        {(drug.doseRange.min * weight).toFixed(1)} –{" "}
                        {(drug.doseRange.max * weight).toFixed(1)}{" "}
                        {drug.doseRange.unit
                          .replace("/kg", "")
                          .replace("kg/", "")}{" "}
                        ({weight}kg)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedDrug} onOpenChange={() => setSelectedDrug(null)}>
        {selectedDrug && (
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg">{selectedDrug.name}</DialogTitle>
              <Badge
                variant="outline"
                className={`w-fit text-[10px] ${categoryColors[selectedDrug.category]}`}
              >
                {categoryLabels[selectedDrug.category]}
              </Badge>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-4">
              <div className="space-y-4">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-semibold mb-1">Indicación</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDrug.indication}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Presentación"
                    value={selectedDrug.presentation}
                  />
                  <InfoItem label="Dilución" value={selectedDrug.dilution} />
                  <InfoItem
                    label="Inicio de acción"
                    value={selectedDrug.onset}
                  />
                  <InfoItem label="Vida media" value={selectedDrug.halfLife} />
                </div>

                <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Dosis para {weight} kg
                  </p>
                  <p className="text-sm font-medium">
                    Rango: {selectedDrug.doseRange.min} –{" "}
                    {selectedDrug.doseRange.max} {selectedDrug.doseRange.unit}
                  </p>
                  {selectedDrug.doseRange.perKg && (
                    <p className="text-lg font-bold text-primary">
                      {(selectedDrug.doseRange.min * weight).toFixed(1)} –{" "}
                      {(selectedDrug.doseRange.max * weight).toFixed(1)}{" "}
                      {selectedDrug.doseRange.unit
                        .replace("/kg", "")
                        .replace("kg/", "")}
                    </p>
                  )}
                  {selectedDrug.bolus && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Bolo: {selectedDrug.bolus}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-orange-400" />{" "}
                    Efectos Adversos
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDrug.sideEffects.map(se => (
                      <Badge
                        key={se}
                        variant="outline"
                        className="text-[10px] text-orange-400 border-orange-500/30"
                      >
                        {se}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-primary" /> Notas
                    Clínicas
                  </p>
                  {selectedDrug.notes.map((n, i) => (
                    <p
                      key={i}
                      className="text-[10px] text-muted-foreground flex items-start gap-1"
                    >
                      <ChevronRight className="h-3 w-3 text-primary mt-0 shrink-0" />{" "}
                      {n}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-xs">{value}</p>
    </div>
  );
}
