import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LungZone {
  id: string;
  name: string;
  view: string;
  position: { top: string; left: string; width: string; height: string };
  patterns: string[];
  clinicalExamples: string[];
}

const zones8: LungZone[] = [
  {
    id: "ra-sup",
    name: "Anterior Superior Derecho",
    view: "anterior",
    position: { top: "15%", left: "10%", width: "35%", height: "30%" },
    patterns: [
      "Líneas A (normal)",
      "Líneas B (edema)",
      "Ausencia de sliding (neumotórax)",
    ],
    clinicalExamples: [
      "Neumotórax: primer punto a evaluar",
      "Edema pulmonar: líneas B bilaterales",
    ],
  },
  {
    id: "la-sup",
    name: "Anterior Superior Izquierdo",
    view: "anterior",
    position: { top: "15%", left: "55%", width: "35%", height: "30%" },
    patterns: [
      "Líneas A (normal)",
      "Líneas B (edema)",
      "Deslizamiento pleural",
    ],
    clinicalExamples: [
      "BLUE protocol: punto anterior superior",
      "Evaluación simétrica bilateral",
    ],
  },
  {
    id: "ra-inf",
    name: "Anterior Inferior Derecho",
    view: "anterior",
    position: { top: "50%", left: "10%", width: "35%", height: "30%" },
    patterns: ["Líneas B (bases)", "Consolidación", "Derrame"],
    clinicalExamples: ["Neumonía basal", "Derrame pleural pequeño"],
  },
  {
    id: "la-inf",
    name: "Anterior Inferior Izquierdo",
    view: "anterior",
    position: { top: "50%", left: "55%", width: "35%", height: "30%" },
    patterns: ["Líneas B", "Consolidación basal", "Signo del cuadrilátero"],
    clinicalExamples: ["Edema pulmonar gravitacional", "Atelectasia basal"],
  },
  {
    id: "rl",
    name: "Lateral Derecho",
    view: "lateral",
    position: { top: "25%", left: "10%", width: "35%", height: "50%" },
    patterns: ["Punto PLAPS", "Derrame pleural", "Consolidación"],
    clinicalExamples: [
      "PLAPS point del protocolo BLUE",
      "Derrame paraneumónico",
    ],
  },
  {
    id: "ll",
    name: "Lateral Izquierdo",
    view: "lateral",
    position: { top: "25%", left: "55%", width: "35%", height: "50%" },
    patterns: ["Punto PLAPS", "Derrame pleural", "Consolidación"],
    clinicalExamples: ["Evaluación PLAPS bilateral", "Hemotórax post-trauma"],
  },
  {
    id: "rp",
    name: "Posterior Derecho",
    view: "posterior",
    position: { top: "20%", left: "10%", width: "35%", height: "60%" },
    patterns: [
      "Derrame pleural",
      "Consolidación basal",
      "Atelectasia",
      "Signo de la medusa",
    ],
    clinicalExamples: ["Derrame pleural masivo", "Neumonía lobar posterior"],
  },
  {
    id: "lp",
    name: "Posterior Izquierdo",
    view: "posterior",
    position: { top: "20%", left: "55%", width: "35%", height: "60%" },
    patterns: ["Derrame pleural", "Consolidación", "Broncograma aéreo"],
    clinicalExamples: ["NAV zona dependiente", "Atelectasia compresiva"],
  },
];

const views = ["anterior", "lateral", "posterior"] as const;

export default function LungMap() {
  const [activeView, setActiveView] = useState<string>("anterior");
  const [selectedZone, setSelectedZone] = useState<LungZone | null>(null);
  const [zoneConfig, setZoneConfig] = useState<"8" | "12">("8");

  const currentZones = zones8.filter(z => z.view === activeView);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Mapa de Exploración Pulmonar
        </h1>
        <p className="text-muted-foreground">
          Modelo visual interactivo del tórax dividido en zonas de exploración
          ecográfica
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1.5">
          {views.map(v => (
            <Button
              key={v}
              variant={activeView === v ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView(v)}
              className="capitalize text-xs"
            >
              {v}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-auto">
          <Button
            variant={zoneConfig === "8" ? "default" : "outline"}
            size="sm"
            onClick={() => setZoneConfig("8")}
            className="text-xs"
          >
            8 zonas
          </Button>
          <Button
            variant={zoneConfig === "12" ? "default" : "outline"}
            size="sm"
            onClick={() => setZoneConfig("12")}
            className="text-xs"
          >
            12 zonas
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Thorax visual */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold mb-4 text-center capitalize">
              Vista {activeView}
            </h3>
            <div
              className="relative bg-muted/30 rounded-xl border-2 border-dashed border-border"
              style={{ paddingBottom: "120%" }}
            >
              {/* Thorax outline */}
              <div className="absolute inset-4 rounded-[40%] border-2 border-muted-foreground/20" />
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[20%] h-[8%] rounded-b-full border-2 border-muted-foreground/20 border-t-0" />

              {/* Lung areas */}
              <div className="absolute inset-[15%] top-[18%]">
                {/* Left lung */}
                <div className="absolute left-[5%] top-[5%] w-[40%] h-[80%] rounded-[30%] bg-primary/5 border border-primary/20" />
                {/* Right lung */}
                <div className="absolute right-[5%] top-[5%] w-[40%] h-[80%] rounded-[30%] bg-primary/5 border border-primary/20" />
              </div>

              {/* Clickable zones */}
              {currentZones.map(zone => (
                <button
                  key={zone.id}
                  className={`absolute rounded-lg border-2 transition-all hover:bg-accent/20 hover:border-accent flex items-center justify-center text-[10px] font-medium ${
                    selectedZone?.id === zone.id
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-primary/5 border-primary/20 text-muted-foreground"
                  }`}
                  style={zone.position}
                  onClick={() => setSelectedZone(zone)}
                >
                  <span className="px-1 text-center leading-tight">
                    {zone.name.split(" ").slice(-2).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone details */}
        <div>
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className="mb-2 text-xs capitalize">
                          {selectedZone.view}
                        </Badge>
                        <h3 className="font-display font-semibold">
                          {selectedZone.name}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedZone(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Patrones ecográficos
                        </h4>
                        <div className="space-y-1.5">
                          {selectedZone.patterns.map((p, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Ejemplos clínicos
                        </h4>
                        <div className="space-y-2">
                          {selectedZone.clinicalExamples.map((e, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-muted/50 border text-sm text-muted-foreground"
                            >
                              {e}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-64"
              >
                <p className="text-sm text-muted-foreground text-center">
                  Haz clic en una zona del tórax para ver los patrones
                  ecográficos y ejemplos clínicos
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
