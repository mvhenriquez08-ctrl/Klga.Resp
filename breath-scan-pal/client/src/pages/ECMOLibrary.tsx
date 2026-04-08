import { useState } from "react";
import {
  ecmoTopics,
  categoryLabels,
  categoryColors,
  sdraAlgorithm,
  type ECMOCategory,
  type ECMOTopic,
} from "@/data/ecmo";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Heart,
  Wind,
  Cpu,
  Settings,
  AlertTriangle,
  Shield,
  ArrowDown,
  ChevronRight,
  BookOpen,
  Lightbulb,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: Record<ECMOCategory, React.ElementType> = {
  fundamentals: BookOpen,
  vv: Wind,
  va: Heart,
  components: Cpu,
  management: Settings,
  complications: AlertTriangle,
  covid: Shield,
  weaning: ArrowDown,
};

const allCategories: ECMOCategory[] = [
  "fundamentals",
  "vv",
  "va",
  "components",
  "management",
  "complications",
  "covid",
  "weaning",
];

export default function ECMOLibrary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ECMOCategory | "all"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<ECMOTopic | null>(null);
  const [activeTab, setActiveTab] = useState("library");

  const filtered = ecmoTopics.filter(t => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" /> Módulo ECMO
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Oxigenación por Membrana Extracorpórea — Soporte Vital Extracorpóreo
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="library">Biblioteca</TabsTrigger>
          <TabsTrigger value="algorithm">Algoritmo SDRA</TabsTrigger>
          <TabsTrigger value="save">SAVE Score</TabsTrigger>
        </TabsList>

        {/* ===== BIBLIOTECA ===== */}
        <TabsContent value="library" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar temas ECMO..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              Todos ({ecmoTopics.length})
            </Badge>
            {allCategories.map(cat => {
              const Icon = categoryIcons[cat];
              const count = ecmoTopics.filter(t => t.category === cat).length;
              return (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`cursor-pointer gap-1 ${selectedCategory === cat ? "" : categoryColors[cat]}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <Icon className="h-3 w-3" />
                  {categoryLabels[cat]} ({count})
                </Badge>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(topic => {
                const Icon = categoryIcons[topic.category];
                return (
                  <motion.div
                    key={topic.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card
                      className="cursor-pointer hover:border-primary/50 transition-all h-full"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic.image && (
                        <div className="h-40 overflow-hidden rounded-t-lg">
                          <img
                            src={topic.image}
                            alt={topic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm leading-tight">
                            {topic.title}
                          </CardTitle>
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] w-fit ${categoryColors[topic.category]}`}
                        >
                          {categoryLabels[topic.category]}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {topic.summary}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron temas con esos criterios</p>
            </div>
          )}
        </TabsContent>

        {/* ===== ALGORITMO SDRA ===== */}
        <TabsContent value="algorithm" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{sdraAlgorithm.title}</CardTitle>
              <CardDescription>
                Basado en estudios EOLIA y guías ELSO. Flujo de decisión para
                escalar a ECMO VV en SDRA severo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {sdraAlgorithm.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {idx + 1}
                      </div>
                      {idx < sdraAlgorithm.steps.length - 1 && (
                        <div className="w-0.5 h-8 bg-border" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">
                      Recomendación clave:
                    </p>
                    <p>
                      Activar la logística del ECMO team desde PaO₂/FiO₂ ≈ 100
                      mmHg o al indicar posición prono. El uso temprano y la
                      activación temprana dan mejores resultados que la
                      aplicación tardía.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SAVE SCORE ===== */}
        <TabsContent value="save" className="mt-4">
          <SAVEScoreCalculator />
        </TabsContent>
      </Tabs>

      {/* ===== DETAIL MODAL ===== */}
      <Dialog
        open={!!selectedTopic}
        onOpenChange={() => setSelectedTopic(null)}
      >
        {selectedTopic && (
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg pr-6">
                {(() => {
                  const Icon = categoryIcons[selectedTopic.category];
                  return <Icon className="h-5 w-5 text-primary shrink-0" />;
                })()}
                {selectedTopic.title}
              </DialogTitle>
              <Badge
                variant="outline"
                className={`w-fit text-[10px] ${categoryColors[selectedTopic.category]}`}
              >
                {categoryLabels[selectedTopic.category]}
              </Badge>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-4">
              <div className="space-y-4">
                {selectedTopic.image && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={selectedTopic.image}
                      alt={selectedTopic.title}
                      className="w-full object-contain max-h-64"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {selectedTopic.content.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: p
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-foreground">$1</strong>'
                          )
                          .replace(
                            /^• /gm,
                            '<span class="text-primary mr-1">•</span> '
                          ),
                      }}
                    />
                  ))}
                </div>

                {selectedTopic.keyPoints &&
                  selectedTopic.keyPoints.length > 0 && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <p className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-primary" /> Puntos
                        Clave
                      </p>
                      <ul className="space-y-1">
                        {selectedTopic.keyPoints.map((kp, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                          >
                            <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                            {kp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {selectedTopic.references &&
                  selectedTopic.references.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Referencias:
                      </p>
                      {selectedTopic.references.map((ref, i) => (
                        <p
                          key={i}
                          className="text-[10px] text-muted-foreground"
                        >
                          {ref}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

/* ===== SAVE SCORE CALCULATOR ===== */
function SAVEScoreCalculator() {
  const [values, setValues] = useState({
    diagnosis: 0,
    age: 0,
    weight: 0,
    liverFailure: false,
    cnsFailure: false,
    renalFailure: false,
    ckd: false,
    intubationHours: 0,
    pip: false,
    priorArrest: false,
    dbp: false,
    hco3Low: false,
  });

  const score =
    values.diagnosis +
    values.age +
    values.weight +
    (values.liverFailure ? -3 : 0) +
    (values.cnsFailure ? -3 : 0) +
    (values.renalFailure ? -3 : 0) +
    (values.ckd ? -6 : 0) +
    values.intubationHours +
    (values.pip ? 3 : 0) +
    (values.priorArrest ? -2 : 0) +
    (values.dbp ? 3 : 0) +
    (values.hco3Low ? -3 : 0) +
    -6; // constant

  const getClass = () => {
    if (score > 5) return { cls: "I", surv: "75%", color: "text-green-400" };
    if (score >= 1) return { cls: "II", surv: "58%", color: "text-green-300" };
    if (score >= -4)
      return { cls: "III", surv: "42%", color: "text-yellow-400" };
    if (score >= -9)
      return { cls: "IV", surv: "30%", color: "text-orange-400" };
    return { cls: "V", surv: "18%", color: "text-red-400" };
  };

  const result = getClass();

  const SelectGroup = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    options: { label: string; value: number }[];
  }) => (
    <div className="space-y-1">
      <p className="text-xs font-medium">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <Button
            key={opt.label}
            size="sm"
            variant={value === opt.value ? "default" : "outline"}
            className="text-xs h-7"
            onClick={() => onChange(opt.value)}
          >
            {opt.label} ({opt.value > 0 ? "+" : ""}
            {opt.value})
          </Button>
        ))}
      </div>
    </div>
  );

  const CheckItem = ({
    label,
    checked,
    onChange,
    points,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    points: number;
  }) => (
    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="rounded border-border"
      />
      {label}{" "}
      <span className="text-muted-foreground">
        ({points > 0 ? "+" : ""}
        {points})
      </span>
    </label>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SAVE Score — Calculadora</CardTitle>
        <CardDescription>
          Predictor de supervivencia hospitalaria en shock cardiogénico
          refractario con ECMO VA (Schmidt et al.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectGroup
          label="Diagnóstico"
          value={values.diagnosis}
          onChange={v => setValues({ ...values, diagnosis: v })}
          options={[
            { label: "Miocarditis", value: 3 },
            { label: "FV/TV refractaria", value: 2 },
            { label: "Post-trasplante", value: 3 },
            { label: "Congénita", value: -3 },
            { label: "Otro", value: 0 },
          ]}
        />

        <SelectGroup
          label="Edad"
          value={values.age}
          onChange={v => setValues({ ...values, age: v })}
          options={[
            { label: "18-38", value: 7 },
            { label: "39-52", value: 4 },
            { label: "53-62", value: 3 },
            { label: "> 63", value: 0 },
          ]}
        />

        <SelectGroup
          label="Peso (kg)"
          value={values.weight}
          onChange={v => setValues({ ...values, weight: v })}
          options={[
            { label: "< 65", value: 1 },
            { label: "65-89", value: 2 },
            { label: "> 90", value: 0 },
          ]}
        />

        <div className="space-y-1">
          <p className="text-xs font-medium">Falla orgánica preECMO</p>
          <div className="space-y-1.5">
            <CheckItem
              label="Falla hepática"
              checked={values.liverFailure}
              onChange={v => setValues({ ...values, liverFailure: v })}
              points={-3}
            />
            <CheckItem
              label="Disfunción SNC"
              checked={values.cnsFailure}
              onChange={v => setValues({ ...values, cnsFailure: v })}
              points={-3}
            />
            <CheckItem
              label="Falla renal aguda"
              checked={values.renalFailure}
              onChange={v => setValues({ ...values, renalFailure: v })}
              points={-3}
            />
            <CheckItem
              label="ERC (TFG < 60 por > 3 meses)"
              checked={values.ckd}
              onChange={v => setValues({ ...values, ckd: v })}
              points={-6}
            />
          </div>
        </div>

        <SelectGroup
          label="Duración intubación preECMO"
          value={values.intubationHours}
          onChange={v => setValues({ ...values, intubationHours: v })}
          options={[
            { label: "< 10h", value: 0 },
            { label: "11-29h", value: -2 },
            { label: "> 30h", value: -4 },
          ]}
        />

        <div className="space-y-1.5">
          <CheckItem
            label="PIP < 20 cmH₂O"
            checked={values.pip}
            onChange={v => setValues({ ...values, pip: v })}
            points={3}
          />
          <CheckItem
            label="Paro cardíaco preECMO"
            checked={values.priorArrest}
            onChange={v => setValues({ ...values, priorArrest: v })}
            points={-2}
          />
          <CheckItem
            label="PAD preECMO > 40 mmHg"
            checked={values.dbp}
            onChange={v => setValues({ ...values, dbp: v })}
            points={3}
          />
          <CheckItem
            label="HCO₃ preECMO < 15 mmol/L"
            checked={values.hco3Low}
            onChange={v => setValues({ ...values, hco3Low: v })}
            points={-3}
          />
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 text-center space-y-1">
          <p className="text-xs text-muted-foreground">SAVE Score</p>
          <p className="text-4xl font-bold">{score}</p>
          <p className={`text-lg font-semibold ${result.color}`}>
            Clase {result.cls} — Supervivencia {result.surv}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Rango: -35 a +17 | Constante: -6
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
