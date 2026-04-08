import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lusLibrary, libraryCategories, type LUSSign } from "@/data/library";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronRight, BookOpen, AlertTriangle, Stethoscope } from "lucide-react";

function SignDetail({ sign, onClose }: { sign: LUSSign; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        className="bg-card rounded-xl shadow-2xl max-w-2xl w-full mb-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sign.icon}</span>
            <div>
              <h2 className="font-display text-xl font-bold">{sign.name}</h2>
              <Badge variant="secondary" className="mt-1 text-xs">
                {sign.category === "artifact" ? "Artefacto" : "Signo"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Section icon={<BookOpen className="h-4 w-4" />} title="Definición">
            <p className="text-sm text-muted-foreground leading-relaxed">{sign.definition}</p>
          </Section>

          <Section icon={<AlertTriangle className="h-4 w-4" />} title="Fisiopatología">
            <p className="text-sm text-muted-foreground leading-relaxed">{sign.pathophysiology}</p>
          </Section>

          {sign.imageUrl ? (
            <div className="rounded-lg overflow-hidden border bg-black">
              <img
                src={sign.imageUrl}
                alt={sign.name}
                className="w-full h-auto object-contain max-h-80"
              />
              <p className="text-[10px] text-muted-foreground text-center py-1.5 bg-muted/50">
                Fuente: {sign.imageSource || "POCUS 101"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/50 border p-4">
              <div className="flex items-center justify-center h-32 text-muted-foreground/30">
                <div className="text-center">
                  <span className="text-5xl block mb-2">{sign.icon}</span>
                  <p className="text-xs">Imagen ilustrativa</p>
                </div>
              </div>
            </div>
          )}

          <Section icon={<Stethoscope className="h-4 w-4" />} title="Ejemplo Clínico">
            <p className="text-sm text-muted-foreground leading-relaxed">{sign.clinicalExample}</p>
          </Section>

          <Section icon={<ChevronRight className="h-4 w-4" />} title="Interpretación Clínica">
            <p className="text-sm text-muted-foreground leading-relaxed">{sign.clinicalInterpretation}</p>
          </Section>

          <div>
            <h4 className="text-sm font-semibold mb-2">Diagnósticos Asociados</h4>
            <div className="flex flex-wrap gap-1.5">
              {sign.associatedDiagnosis.map((d) => (
                <Badge key={d} variant="outline" className="text-xs">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function Library() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<LUSSign | null>(null);

  const filtered = lusLibrary.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.definition.toLowerCase().includes(search.toLowerCase()) ||
      s.associatedDiagnosis.some((d) => d.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "all" || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Biblioteca de Ultrasonido Pulmonar</h1>
        <p className="text-muted-foreground">
          Fichas educativas interactivas sobre artefactos y signos ecográficos pulmonares
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar signos, diagnósticos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {libraryCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat.id)}
              className="text-xs"
            >
              {cat.label} ({cat.count})
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((sign) => (
            <motion.div
              key={sign.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="cursor-pointer group hover:shadow-md transition-all hover:-translate-y-0.5 border-border/50 h-full overflow-hidden"
                onClick={() => setSelected(sign)}
              >
                {sign.imageUrl && (
                  <div className="h-36 bg-black overflow-hidden">
                    <img
                      src={sign.imageUrl}
                      alt={sign.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{sign.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
                        {sign.name}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {sign.category === "artifact" ? "Artefacto" : "Signo"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {sign.definition}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sign.associatedDiagnosis.slice(0, 2).map((d) => (
                          <Badge key={d} variant="outline" className="text-[10px]">
                            {d}
                          </Badge>
                        ))}
                        {sign.associatedDiagnosis.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{sign.associatedDiagnosis.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && <SignDetail sign={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
