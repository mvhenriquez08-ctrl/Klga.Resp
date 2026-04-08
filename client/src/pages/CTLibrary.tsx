import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scan, BookOpen, CheckSquare, Search } from "lucide-react";
import { ctPatterns, ctCategories, interpretationSteps, type CTPattern } from "@/data/ctLibrary";
import { PDFPageViewer } from "@/components/radiology/PDFPageViewer";
import { CT_PDF_URL, CT_PDF_PAGES } from "@/data/pdfPageMap";

export default function CTLibrary() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<CTPattern | null>(null);

  const filtered = filter === "all" ? ctPatterns : ctPatterns.filter((p) => p.category === filter);

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Scan className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">Tomografía de Tórax</h1>
            </div>
            <p className="text-sm text-primary-foreground/60">Biblioteca de patrones TC, interpretación sistemática y casos clínicos.</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="patterns">
          <TabsList>
            <TabsTrigger value="patterns" className="gap-1"><BookOpen className="h-3 w-3" /> Patrones TC</TabsTrigger>
            <TabsTrigger value="interpretation" className="gap-1"><CheckSquare className="h-3 w-3" /> Interpretación</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="mt-4">
            <div className="flex flex-wrap gap-2 mb-6">
              {ctCategories.map((cat) =>
              <Badge
                key={cat.id}
                variant={filter === cat.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter(cat.id)}>
                
                  {cat.label}
                </Badge>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((pattern) =>
              <motion.div key={pattern.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
                  <Card className="cursor-pointer hover:border-primary/30 transition-all overflow-hidden" onClick={() => setSelected(pattern)}>
                    

                  
                    <div className="aspect-video bg-black overflow-hidden flex items-center justify-center border-b">
                      <img 
                        src={pattern.image || pattern.imageUrl} 
                        alt={pattern.name} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-display font-semibold">{pattern.name}</h3>
                        <Badge variant="secondary" className="text-[10px] shrink-0">{pattern.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{pattern.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="interpretation" className="mt-4">
            <Card className="mb-6">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <Search className="h-4 w-4" /> Lectura Sistemática de TC de Tórax
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  La interpretación de la TC de tórax debe ser sistemática, evaluando todas las estructuras en diferentes ventanas de atenuación.
                  Se recomienda seguir siempre el mismo orden para no omitir hallazgos.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {interpretationSteps.map((step) =>
              <Card key={step.order}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm shrink-0">
                        {step.order}
                      </div>
                      <div>
                        <h4 className="text-sm font-display font-semibold">{step.title}</h4>
                        <Badge variant="outline" className="text-[10px] mt-0.5">{step.window}</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 ml-11">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Estructuras a evaluar:</p>
                        <ul className="space-y-1">
                          {step.structures.map((s, i) =>
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                              {s}
                            </li>
                        )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Tips clínicos:</p>
                        <ul className="space-y-1">
                          {step.tips.map((t, i) =>
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-accent mt-0.5">💡</span>
                              {t}
                            </li>
                        )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected &&
          <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  {selected.name}
                  <Badge variant="secondary" className="text-[10px]">{selected.category}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-lg overflow-hidden bg-muted/50 mb-4 flex justify-center">
                <img src={selected.image || selected.imageUrl} alt={selected.name} className="max-w-full max-h-[400px] object-contain" />
              </div>

              <Accordion type="multiple" defaultValue={["desc", "findings", "ddx"]} className="space-y-1">
                <AccordionItem value="desc">
                  <AccordionTrigger className="text-sm font-semibold">Descripción</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-muted-foreground">{selected.description}</p>
                    <p className="text-xs text-muted-foreground mt-2"><strong>Mecanismo:</strong> {selected.mechanism}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="findings">
                  <AccordionTrigger className="text-sm font-semibold">Hallazgos Clave</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1">
                      {selected.keyFindings.map((f, i) =>
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> {f}
                        </li>
                    )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ddx">
                  <AccordionTrigger className="text-sm font-semibold">Diagnóstico Diferencial</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.differentialDx.map((dx, i) =>
                    <Badge key={i} variant="outline" className="text-[10px]">{dx}</Badge>
                    )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="context">
                  <AccordionTrigger className="text-sm font-semibold">Contexto Clínico</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-muted-foreground">{selected.clinicalContext}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          }
        </DialogContent>
      </Dialog>
    </div>);

}