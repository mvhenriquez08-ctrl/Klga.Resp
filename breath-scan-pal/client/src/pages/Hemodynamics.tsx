import { useState } from "react";
import { shockProfiles, monitoringParameters } from "@/data/hemodynamics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Heart,
  Stethoscope,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hemodynamics() {
  const [activeTab, setActiveTab] = useState("shock");
  const [selectedShock, setSelectedShock] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" /> Hemodinamia
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Perfiles de shock, monitoreo invasivo y correlación ecográfica
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-2">
          <TabsTrigger value="shock">Perfiles de Shock</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo Invasivo</TabsTrigger>
        </TabsList>

        <TabsContent value="shock" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {shockProfiles.map(shock => (
                <motion.div
                  key={shock.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card
                    className={`cursor-pointer hover:border-primary/50 transition-all h-full ${selectedShock === shock.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() =>
                      setSelectedShock(
                        selectedShock === shock.id ? null : shock.id
                      )
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{shock.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${shock.color}`}
                        >
                          {shock.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {shock.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                          Perfil Hemodinámico
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                          {shock.hemodynamics.map(h => (
                            <div
                              key={h.parameter}
                              className="flex justify-between text-[10px]"
                            >
                              <span className="text-muted-foreground">
                                {h.parameter}
                              </span>
                              <span className="font-mono font-medium">
                                {h.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedShock === shock.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="space-y-3"
                        >
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" /> Hallazgos
                              Ecográficos
                            </p>
                            {shock.ecoFindings.map((f, i) => (
                              <p
                                key={i}
                                className="text-[10px] text-muted-foreground flex items-start gap-1"
                              >
                                <ChevronRight className="h-3 w-3 text-primary mt-0 shrink-0" />{" "}
                                {f}
                              </p>
                            ))}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                              Ejemplos
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {shock.examples.map(e => (
                                <Badge
                                  key={e}
                                  variant="outline"
                                  className="text-[9px]"
                                >
                                  {e}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
                            <p className="text-[10px] font-semibold flex items-center gap-1 mb-1">
                              <Lightbulb className="h-3 w-3 text-primary" />{" "}
                              Manejo
                            </p>
                            {shock.management.map((m, i) => (
                              <p
                                key={i}
                                className="text-[10px] text-muted-foreground"
                              >
                                • {m}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {monitoringParameters.map(param => (
              <Card key={param.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {param.abbreviation}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {param.normalRange} {param.unit}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {param.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    {param.interpretation.map(interp => (
                      <div
                        key={interp.range}
                        className="flex items-start gap-2 text-[10px]"
                      >
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">
                          {interp.range}
                        </span>
                        <span className="text-muted-foreground">
                          {interp.meaning}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground border-t pt-2 mt-2">
                    {param.clinicalUse}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
