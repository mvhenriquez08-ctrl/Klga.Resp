import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { protocols, type Protocol } from "@/data/protocols";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, MapPin, ChevronRight } from "lucide-react";

function ProtocolDetail({ p, onBack }: { p: Protocol; onBack: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
      </Button>

      <div className="mb-8">
        <Badge className="mb-2">{p.name}</Badge>
        <h2 className="font-display text-2xl font-bold">{p.fullName}</h2>
        <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
        <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-xs font-medium text-warning">
            Indicación: {p.indication}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Zonas de exploración
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {p.zones.map(z => (
            <Badge key={z} variant="outline" className="text-xs">
              {z}
            </Badge>
          ))}
        </div>
      </div>

      {/* Step navigation */}
      <div className="flex gap-2 mb-6">
        {p.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`flex-1 p-3 rounded-lg border text-left transition-all text-xs ${
              activeStep === i
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/30"
            }`}
          >
            <span className="font-semibold block">Paso {s.step}</span>
            <span className="text-muted-foreground line-clamp-1">
              {s.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold">
                  {p.steps[activeStep].step}
                </div>
                <h3 className="font-display font-semibold">
                  {p.steps[activeStep].title}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {p.steps[activeStep].description}
              </p>

              <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium text-muted-foreground">
                  Acción: {p.steps[activeStep].action}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Hallazgos posibles
                </h4>
                <div className="space-y-1.5">
                  {p.steps[activeStep].findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                <h4 className="text-xs font-semibold text-primary mb-1">
                  Interpretación
                </h4>
                <p className="text-sm text-muted-foreground">
                  {p.steps[activeStep].interpretation}
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  disabled={activeStep === p.steps.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Protocols() {
  const [selected, setSelected] = useState<Protocol | null>(null);

  if (selected) {
    return (
      <div className="p-6">
        <ProtocolDetail p={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Protocolos Clínicos
        </h1>
        <p className="text-muted-foreground">
          Guías paso a paso para el diagnóstico ecográfico pulmonar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {protocols.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className="cursor-pointer group hover:shadow-md transition-all hover:-translate-y-0.5 h-full border-border/50"
              onClick={() => setSelected(p)}
            >
              <CardContent className="p-6">
                <div
                  className="h-2 w-16 rounded-full mb-4"
                  style={{ background: p.color }}
                />
                <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {p.fullName}
                </p>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span>{p.steps.length} pasos</span>
                  <span>{p.zones.length} zonas</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
