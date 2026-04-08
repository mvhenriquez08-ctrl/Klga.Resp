import { motion } from "framer-motion";
import { weaningData } from "@/data/ventilation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { HeartPulse } from "lucide-react";

export default function VMWeaning() {
 return (
  <div className="min-h-full">
   <div className="bg-gradient-hero px-6 py-10">
    <div className="mx-auto max-w-5xl">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     >
      <div className="flex items-center gap-3 mb-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
        <HeartPulse className="h-5 w-5 text-success" />
       </div>
       <h1 className="font-display text-2xl font-bold text-primary-foreground">
        Weaning y Destete Ventilatorio
       </h1>
      </div>
      <p className="text-sm text-primary-foreground/60">
       Criterios de preparación, prueba de ventilación espontánea, índice
       de Tobin y relación con ecografía.
      </p>
     </motion.div>
    </div>
   </div>

   <div className="mx-auto max-w-5xl px-6 py-8">
    <div className="space-y-6">
     {weaningData.map(section => (
      <Card key={section.id}>
       <CardHeader>
        <CardTitle className="font-display text-lg">
         {section.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
         {section.description}
        </p>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <h4 className="text-sm font-semibold mb-2">
          Criterios / Puntos Clave
         </h4>
         <ul className="space-y-1.5">
          {section.criteria.map(c => (
           <li
            key={c}
            className="text-sm text-muted-foreground flex items-start gap-2"
           >
            <span className="text-primary mt-0.5 shrink-0">•</span>{" "}
            {c}
           </li>
          ))}
         </ul>
        </div>

        {section.formula && (
         <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <h4 className="text-sm font-semibold mb-1">Fórmula</h4>
          <p className="text-sm font-mono">{section.formula}</p>
         </div>
        )}

        {section.method && (
         <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="text-sm font-semibold mb-1">Método</h4>
          <p className="text-sm text-muted-foreground">
           {section.method}
          </p>
         </div>
        )}
       </CardContent>
      </Card>
     ))}
    </div>

    <div className="mt-8 rounded-lg bg-warning/5 border border-warning/20 p-4">
     <p className="text-xs text-muted-foreground">
      <strong className="text-warning">⚠️ Nota clínica:</strong> La
      decisión de extubación debe integrar múltiples variables clínicas y
      no basarse en un único parámetro o herramienta. La información
      proporcionada es de apoyo educativo y no reemplaza el juicio clínico
      del profesional.
     </p>
    </div>
   </div>
  </div>
 );
}
