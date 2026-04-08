import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { atlasCases, atlasCategories, type AtlasCase } from "@/data/atlas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Eye, Stethoscope, CheckCircle2 } from "lucide-react";

function AtlasDetail({ c, onClose }: { c: AtlasCase; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-card rounded-xl shadow-2xl max-w-3xl w-full mb-20"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-start justify-between">
          <div>
            <Badge className="mb-2 text-xs">{c.category}</Badge>
            <h2 className="font-display text-xl font-bold">{c.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" /> Descripción
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">
              Hallazgos ecográficos
            </h4>
            <div className="space-y-2">
              {c.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
            <h4 className="text-sm font-semibold mb-1 text-primary">
              Explicación
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.explanation}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Diagnóstico probable</h4>
            <Badge className="text-sm">{c.diagnosis}</Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Hallazgos clave</h4>
            <div className="flex flex-wrap gap-1.5">
              {c.keyFeatures.map(f => (
                <Badge key={f} variant="outline" className="text-xs">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Atlas() {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<AtlasCase | null>(null);

  const filtered =
    category === "all"
      ? atlasCases
      : atlasCases.filter(c => c.category === category);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Atlas Ecográfico
        </h1>
        <p className="text-muted-foreground">
          Atlas visual de patologías pulmonares con hallazgos, explicaciones y
          diagnósticos
        </p>
      </div>

      <div className="flex gap-1.5 mb-6">
        {atlasCategories.map(cat => (
          <Button
            key={cat.id}
            variant={category === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(cat.id)}
            className="text-xs"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer group hover:shadow-md transition-all hover:-translate-y-0.5 h-full border-border/50"
              onClick={() => setSelected(c)}
            >
              <CardContent className="p-0">
                <div
                  className="h-40 rounded-t-lg flex items-center justify-center overflow-hidden"
                  style={{ background: c.color + "15" }}
                >
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Eye
                      className="h-10 w-10"
                      style={{ color: c.color, opacity: 0.4 }}
                    />
                  )}
                </div>
                <div className="p-5">
                  <Badge variant="secondary" className="text-[10px] mb-2">
                    {c.category}
                  </Badge>
                  <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {c.keyFeatures.slice(0, 3).map(f => (
                      <Badge key={f} variant="outline" className="text-[10px]">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <AtlasDetail c={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
