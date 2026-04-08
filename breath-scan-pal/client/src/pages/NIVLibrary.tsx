import { motion } from "framer-motion";
import { Wind, Info } from "lucide-react";
import { NIVSection } from "../data/NIVSection";
import { Card, CardContent } from "@/components/ui/card";

export default function NIVLibrary() {
  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Wind className="h-5 w-5 text-cyan-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Ventilación No Invasiva (VNI)
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60 max-w-2xl">
              Fundamentos, interfaces, modos y criterios de aplicación de
              soporte ventilatorio no invasivo en entorno crítico.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <Card className="mb-8 border-cyan-500/20 bg-cyan-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-cyan-400 shrink-0" />
              <p className="text-sm text-cyan-100/80">
                La VNI es una herramienta fundamental para evitar la intubación
                orotraqueal en patologías específicas como el EPOC exacerbado y
                el Edema Agudo de Pulmón. Su éxito depende críticamente de la
                selección de la interfaz y la colaboración del paciente.
              </p>
            </div>
          </CardContent>
        </Card>

        <NIVSection />
      </div>
    </div>
  );
}
