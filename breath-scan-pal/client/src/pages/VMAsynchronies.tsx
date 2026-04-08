import { useState } from "react";
import { motion } from "framer-motion";
import { asynchronies } from "@/data/ventilation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function VMAsynchronies() {
  const [selected, setSelected] = useState(asynchronies[0].id);
  const item = asynchronies.find(a => a.id === selected)!;

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Asincronías Paciente-Ventilador
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Identificación, mecanismo y manejo de las principales asincronías
              en ventilación mecánica.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            {asynchronies.map(a => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected === a.id
                    ? "border-warning bg-warning/5 shadow-sm"
                    : "border-border hover:border-warning/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{a.icon}</span>
                  <span className="font-display font-semibold text-sm">
                    {a.name}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {a.definition}
                </p>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <CardTitle className="font-display">{item.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Definición</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.definition}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Mecanismo</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.mechanism}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Identificación en Curvas
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.identification}
                  </p>
                </div>
                {item.image && (
                  <div className="rounded-lg overflow-hidden border bg-muted/20">
                    <img
                      src={item.image}
                      alt={`Curvas ventilatorias reales de ${item.name}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                    <p className="text-[10px] text-muted-foreground px-3 py-2 italic">
                      {item.image.includes("deharo-thesis")
                        ? "Fuente: de Haro C. Tesis Doctoral UAB 2019. Asincronías paciente-ventilador."
                        : item.image.includes("mallat")
                          ? "Fuente: Mallat J et al. J Clin Med 2021;10(19):4550. CC BY 4.0"
                          : "Fuente: Gallardo A et al. Acute Crit Care 2022;37(4):491-501. CC BY-NC 4.0"}
                    </p>
                  </div>
                )}
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-1">
                    Patrón en Curvas
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.curvePattern}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Manejo</h4>
                  <ul className="space-y-1">
                    {item.management.map(m => (
                      <li
                        key={m}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-success mt-0.5">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-1 text-destructive">
                    Impacto Clínico
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.clinicalImpact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
