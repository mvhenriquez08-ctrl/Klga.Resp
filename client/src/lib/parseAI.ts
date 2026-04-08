import { z, ZodIssue } from "zod";

// 1. Definimos el esquema estricto esperado de la IA
export const aiResponseSchema = z.object({
  detectedSigns: z
    .array(z.string())
    .describe("Lista de IDs de los signos detectados"),
  diagnosis: z.string().describe("Diagnóstico principal sugerido"),
  description: z.string().describe("Explicación clínica detallada"),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Nivel de confianza del 0 al 100"),
});

// Inferimos el tipo de TypeScript automáticamente a partir del esquema Zod
export type AIResponse = z.infer<typeof aiResponseSchema>;

export function parseAIResponse(responseText: string): AIResponse {
  try {
    // 2. Extraer solo el contenido JSON (ignora saludos o bloques markdown de la IA)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(
        "No se encontró una estructura JSON válida en la respuesta."
      );
    }

    // 3. Convertir el texto a objeto
    const rawJson = JSON.parse(jsonMatch[0]);

    // 4. Pasar el objeto por el embudo de Zod (lanza error si no cumple el esquema)
    return aiResponseSchema.parse(rawJson);
  } catch (error) {
    console.error("Error validando la respuesta de la IA:", error);

    if (error instanceof z.ZodError) {
      throw new Error(
        "La IA generó un formato inválido. Detalles: " +
          error.issues
            .map((e: ZodIssue) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")
      );
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Error desconocido al procesar la IA."
    );
  }
}
