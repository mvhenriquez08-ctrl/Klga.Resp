import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Calculator,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function classify(value: number, ranges: [number, string, string][]) {
  for (const [threshold, label, color] of ranges) {
    if (value <= threshold) return { label, color };
  }
  return {
    label: ranges[ranges.length - 1][1],
    color: ranges[ranges.length - 1][2],
  };
}

export default function VMIndices() {
  const [v, setV] = useState({
    pao2: "",
    fio2: "",
    paco2: "",
    vt: "",
    rr: "",
    weight: "",
    peep: "",
    pplat: "",
    ppeak: "",
    flow: "",
  });

  const update = (k: string, val: string) => setV(p => ({ ...p, [k]: val }));

  const indices = useMemo(() => {
    const pao2 = parseFloat(v.pao2);
    const fio2 = parseFloat(v.fio2);
    const paco2 = parseFloat(v.paco2);
    const vt = parseFloat(v.vt);
    const rr = parseFloat(v.rr);
    const weight = parseFloat(v.weight);
    const peep = parseFloat(v.peep);
    const pplat = parseFloat(v.pplat);
    const ppeak = parseFloat(v.ppeak);

    const results: {
      name: string;
      value: string;
      unit: string;
      status: { label: string; color: string };
      info: string;
    }[] = [];

    // P/F ratio
    if (!isNaN(pao2) && !isNaN(fio2) && fio2 > 0) {
      const pf = pao2 / (fio2 / 100);
      results.push({
        name: "PaFi (P/F Ratio)",
        value: pf.toFixed(0),
        unit: "mmHg",
        status: classify(pf, [
          [100, "SDRA Severo", "destructive"],
          [200, "SDRA Moderado", "destructive"],
          [300, "SDRA Leve", "warning"],
          [Infinity, "Normal", "success"],
        ]),
        info: "PaO₂ / FiO₂ — evalúa gravedad de hipoxemia.",
      });
    }

    // IOx (Oxygenation Index)
    if (
      !isNaN(fio2) &&
      !isNaN(pao2) &&
      pao2 > 0 &&
      !isNaN(peep) &&
      !isNaN(pplat)
    ) {
      const map = (fio2 / 100) * (pplat || peep);
      const iox = (map / pao2) * 100;
      results.push({
        name: "Índice de Oxigenación (IOx)",
        value: iox.toFixed(1),
        unit: "",
        status: classify(iox, [
          [5, "Normal", "success"],
          [15, "Leve", "warning"],
          [25, "Moderado", "destructive"],
          [Infinity, "Severo", "destructive"],
        ]),
        info: "(FiO₂ × Pmean / PaO₂) × 100",
      });
    }

    // Ventilatory Ratio
    if (
      !isNaN(vt) &&
      !isNaN(rr) &&
      !isNaN(paco2) &&
      !isNaN(weight) &&
      weight > 0
    ) {
      const ve = (vt * rr) / 1000;
      const vePredicted = (weight * 100) / 1000;
      if (vePredicted > 0) {
        const vr = (ve * paco2) / (vePredicted * 37.5);
        results.push({
          name: "Ventilatory Ratio",
          value: vr.toFixed(2),
          unit: "",
          status: classify(vr, [
            [1, "Normal", "success"],
            [1.5, "Leve ↑", "warning"],
            [2, "Moderado ↑", "destructive"],
            [Infinity, "Severo ↑", "destructive"],
          ]),
          info: "(VE real × PaCO₂) / (VE predicho × 37.5) — Espacio muerto estimado.",
        });
      }
    }

    // Driving Pressure
    if (!isNaN(pplat) && !isNaN(peep)) {
      const dp = pplat - peep;
      results.push({
        name: "Driving Pressure (ΔP)",
        value: dp.toFixed(0),
        unit: "cmH₂O",
        status: classify(dp, [
          [13, "Protectivo", "success"],
          [15, "Límite", "warning"],
          [Infinity, "Elevado", "destructive"],
        ]),
        info: "Pplat − PEEP — objetivo < 15 cmH₂O.",
      });
    }

    // Compliance
    if (!isNaN(vt) && !isNaN(pplat) && !isNaN(peep) && pplat - peep > 0) {
      const crs = vt / (pplat - peep);
      results.push({
        name: "Compliance Estática (Crs)",
        value: crs.toFixed(0),
        unit: "mL/cmH₂O",
        status: classify(crs, [
          [20, "Severamente reducida", "destructive"],
          [30, "Reducida", "warning"],
          [Infinity, "Normal", "success"],
        ]),
        info: "VT / (Pplat − PEEP)",
      });
    }

    // Mechanical Power
    if (
      !isNaN(vt) &&
      !isNaN(rr) &&
      !isNaN(ppeak) &&
      !isNaN(pplat) &&
      !isNaN(peep)
    ) {
      const mp = ((0.098 * rr * vt) / 1000) * (ppeak - 0.5 * (pplat - peep));
      results.push({
        name: "Mechanical Power",
        value: mp.toFixed(1),
        unit: "J/min",
        status: classify(mp, [
          [12, "Seguro", "success"],
          [17, "Precaución", "warning"],
          [Infinity, "Riesgo VILI", "destructive"],
        ]),
        info: "0.098 × RR × VT × (Ppeak − ½ΔP) — objetivo < 17 J/min.",
      });
    }

    // Resistance
    if (!isNaN(ppeak) && !isNaN(pplat) && !isNaN(vt) && vt > 0) {
      const flow = parseFloat(v.flow) || 60;
      const raw = (ppeak - pplat) / (flow / 60);
      results.push({
        name: "Resistencia Vía Aérea",
        value: raw.toFixed(1),
        unit: "cmH₂O/L/s",
        status: classify(raw, [
          [10, "Normal", "success"],
          [15, "Elevada", "warning"],
          [Infinity, "Muy elevada", "destructive"],
        ]),
        info: "(Ppeak − Pplat) / Flow",
      });
    }

    return results;
  }, [v]);

  const inputFields = [
    { key: "pao2", label: "PaO₂", unit: "mmHg", placeholder: "90" },
    { key: "fio2", label: "FiO₂", unit: "%", placeholder: "40" },
    { key: "paco2", label: "PaCO₂", unit: "mmHg", placeholder: "40" },
    { key: "vt", label: "Vol. Tidal", unit: "mL", placeholder: "420" },
    { key: "rr", label: "Frec. Resp.", unit: "rpm", placeholder: "18" },
    { key: "weight", label: "Peso ideal", unit: "kg", placeholder: "70" },
    { key: "peep", label: "PEEP", unit: "cmH₂O", placeholder: "10" },
    { key: "pplat", label: "Pplat", unit: "cmH₂O", placeholder: "25" },
    { key: "ppeak", label: "Ppeak", unit: "cmH₂O", placeholder: "30" },
    { key: "flow", label: "Flujo", unit: "L/min", placeholder: "60" },
  ];

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
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Índices Ventilatorios
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              P/F ratio, IOx, Ventilatory Ratio, Mechanical Power y más —
              cálculo automático en tiempo real.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 grid md:grid-cols-5 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Parámetros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {inputFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-[11px]">
                    {f.label}{" "}
                    <span className="text-muted-foreground">({f.unit})</span>
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder={f.placeholder}
                    value={v[f.key as keyof typeof v]}
                    onChange={e => update(f.key, e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-3">
          {indices.length > 0 ? (
            indices.map(idx => (
              <motion.div
                key={idx.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-display font-semibold">
                          {idx.name}
                        </h4>
                        <Badge
                          variant={
                            idx.status.color === "success"
                              ? "default"
                              : idx.status.color === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {idx.status.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {idx.info}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold">
                        {idx.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {idx.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                Ingresa parámetros para calcular los índices
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
