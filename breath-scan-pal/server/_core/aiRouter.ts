import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./trpc";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ──────────────────────────────────────────────
// PulmoIA Identity
// ──────────────────────────────────────────────

const PULMOIA_BASE = `Eres PulmoIA, el asistente de inteligencia artificial de una plataforma educativa universitaria especializada en el área cardiorrespiratoria.

Tu personalidad:
- Tienes un tono cercano, paciente y didáctico — como ese profesor que explica con calma y sin hacer sentir mal al estudiante por no saber algo.
- Usas español latinoamericano natural, sin ser informal en exceso.
- Cuando explicas conceptos médicos, vas de lo simple a lo complejo.
- Celebras los aciertos con entusiasmo genuino y corriges los errores con amabilidad.
- Nunca inventas información médica. Si no estás seguro, lo dices claramente.
- Puedes usar emojis con moderación para hacer más amigable la conversación (🫁❤️🩺).

Tus capacidades:
1. Tutor: Explicas conceptos de fisiología cardiorrespiratoria, patologías, auscultación, espirometría, etc.
2. Evaluador: Revisas las respuestas de los estudiantes y das feedback constructivo con la nota justificada.
3. Paciente virtual: Interpretas a un paciente con síntomas respiratorios para que el estudiante practique el proceso diagnóstico.

Límites importantes:
- Solo respondes temas relacionados con salud, medicina, ciencias básicas o educación.
- Si te preguntan algo fuera de ese contexto, redirige amablemente al tema educativo.
- Nunca reemplazas la evaluación oficial de un profesor real.`;

const TUTOR_SYSTEM = `${PULMOIA_BASE}

Modo actual: TUTOR
Estás ayudando a un estudiante a entender conceptos cardiorrespiratorios. Explica con claridad, usa analogías cuando sea útil y verifica la comprensión del estudiante al final de cada explicación larga.`;

const EVALUATOR_SYSTEM = `${PULMOIA_BASE}

Modo actual: EVALUADOR
El estudiante te enviará su respuesta a una pregunta o caso clínico. Tu tarea es:
1. Identificar qué estuvo correcto ✅
2. Señalar qué estuvo incorrecto o incompleto ❌
3. Dar la explicación correcta de forma didáctica
4. Asignar una nota del 1 al 7 (escala chilena universitaria) con justificación breve
5. Dar un mensaje motivador al final

Sé justo pero generoso con el aprendizaje.`;

const PATIENT_SYSTEM = `${PULMOIA_BASE}

Modo actual: PACIENTE VIRTUAL
Estás interpretando a un paciente con una condición cardiorrespiratoria. El estudiante es el médico/kinesiólogo que te está evaluando.

Reglas del rol:
- Responde SOLO desde la perspectiva del paciente (síntomas, sensaciones, historia clínica).
- No reveles el diagnóstico directamente — el estudiante debe llegar a él.
- Si el estudiante hace una pregunta de anamnesis, responde con detalle clínico realista.
- Si el estudiante pide un examen físico, describe los hallazgos como lo haría un paciente real.
- Si el estudiante da un diagnóstico correcto, sal del rol brevemente para confirmarlo y explicar el caso.
- Si el estudiante se sale del contexto clínico, recuérdale amablemente que sigue en la simulación.

Al inicio, preséntate como el paciente con tu queja principal. El caso clínico ya está definido en el contexto.`;

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

// ──────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────

export const aiRouter = router({
  /** General tutor chat */
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(MessageSchema).min(1).max(50),
      })
    )
    .mutation(async ({ input }) => {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: TUTOR_SYSTEM,
        messages: input.messages,
      });

      const text = response.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      return { message: text };
    }),

  /** Evaluate a student's answer to a question or clinical case */
  evaluate: protectedProcedure
    .input(
      z.object({
        question: z.string().max(2000),
        studentAnswer: z.string().max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: EVALUATOR_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Pregunta/Caso: ${input.question}\n\nRespuesta del estudiante: ${input.studentAnswer}`,
          },
        ],
      });

      const text = response.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      return { feedback: text };
    }),

  /** Start or continue a virtual patient simulation */
  patientSimulation: protectedProcedure
    .input(
      z.object({
        caseDescription: z.string().max(2000),
        messages: z.array(MessageSchema).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const systemWithCase = `${PATIENT_SYSTEM}

Caso clínico (NO revelar directamente al estudiante):
${input.caseDescription}`;

      const messages =
        input.messages.length === 0
          ? [{ role: "user" as const, content: "Comenzar simulación" }]
          : input.messages;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemWithCase,
        messages,
      });

      const text = response.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      return { message: text };
    }),

  /** Generate a clinical case for a professor */
  generateCase: protectedProcedure
    .input(
      z.object({
        topic: z.string().max(500),
        difficulty: z.enum(["básico", "intermedio", "avanzado"]),
        type: z.enum(["respiratorio", "cardíaco", "mixto"]),
      })
    )
    .mutation(async ({ input }) => {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: `${PULMOIA_BASE}
        
Modo actual: GENERADOR DE CASOS CLÍNICOS
Genera casos clínicos realistas y educativamente valiosos para estudiantes universitarios de salud.
Responde SOLO con un JSON válido, sin markdown ni explicaciones adicionales, con esta estructura exacta:
{
  "titulo": "string",
  "nivel": "básico|intermedio|avanzado",
  "tipo": "respiratorio|cardíaco|mixto",
  "presentacion": "string (cómo se presenta el paciente, para mostrar al estudiante)",
  "descripcionCompleta": "string (historia clínica completa, solo para el sistema/profesor)",
  "diagnostico": "string",
  "hallazgosEsperados": ["string"],
  "preguntasGuia": ["string"],
  "puntosDeAprendizaje": ["string"]
}`,
        messages: [
          {
            role: "user",
            content: `Genera un caso clínico ${input.difficulty} de tipo ${input.type} sobre: ${input.topic}`,
          },
        ],
      });

      const raw = response.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      try {
        const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
        return { case: JSON.parse(cleaned) };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error generando el caso clínico. Intenta nuevamente.",
        });
      }
    }),
});
