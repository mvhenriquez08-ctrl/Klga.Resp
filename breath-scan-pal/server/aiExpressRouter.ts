import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PULMOIA_BASE = `Eres PulmoIA, el asistente de inteligencia artificial de una plataforma educativa universitaria especializada en el área cardiorrespiratoria...`;
const TUTOR_SYSTEM = `${PULMOIA_BASE}\n\nModo actual: TUTOR\nEstás ayudando a un estudiante a entender conceptos cardiorrespiratorios. Explica con claridad, usa analogías cuando sea útil y verifica la comprensión del estudiante al final de cada explicación larga.`;
const EVALUATOR_SYSTEM = `${PULMOIA_BASE}\n\nModo actual: EVALUADOR\nEl estudiante te enviará su respuesta a una pregunta o caso clínico. Tu tarea es:\n1. Identificar qué estuvo correcto ✅\n2. Señalar qué estuvo incorrecto o incompleto ❌\n3. Dar la explicación correcta de forma didáctica\n4. Asignar una nota del 1 al 7 (escala chilena universitaria) con justificación breve\n5. Dar un mensaje motivador al final\n\nSé justo pero generoso con el aprendizaje.`;
const PATIENT_SYSTEM = `${PULMOIA_BASE}\n\nModo actual: PACIENTE VIRTUAL\nEstás interpretando a un paciente con una condición cardiorrespiratoria. El estudiante es el médico/kinesiólogo que te está evaluando.\n\nReglas del rol:\n- Responde SOLO desde la perspectiva del paciente (síntomas, sensaciones, historia clínica).\n- No reveles el diagnóstico directamente — el estudiante debe llegar a él.\n- Si el estudiante hace una pregunta de anamnesis, responde con detalle clínico realista.\n- Si el estudiante pide un examen físico, describe los hallazgos como lo haría un paciente real.\n- Si el estudiante da un diagnóstico correcto, sal del rol brevemente para confirmarlo y explicar el caso.\n- Si el estudiante se sale del contexto clínico, recuérdale amablemente que sigue en la simulación.\n\nAl inicio, preséntate como el paciente con tu queja principal. El caso clínico ya está definido en el contexto.`;

router.post("/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    const systemPrompt = context
      ? `${TUTOR_SYSTEM}\n\nContexto actual del estudiante:\n${context}`
      : TUTOR_SYSTEM;
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });
    const text = response.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");
    res.json({ message: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/evaluate", async (req, res) => {
  try {
    const { question, studentAnswer } = req.body;
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: EVALUATOR_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Pregunta/Caso: ${question}\n\nRespuesta del estudiante: ${studentAnswer}`,
        },
      ],
    });
    const text = response.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");
    res.json({ feedback: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/patientSimulation", async (req, res) => {
  try {
    const { caseDescription, messages } = req.body;
    const systemWithCase = `${PATIENT_SYSTEM}\n\nCaso clínico (NO revelar directamente al estudiante):\n${caseDescription}`;
    const mappedMessages =
      messages.length === 0
        ? [{ role: "user", content: "Comenzar simulación" }]
        : messages;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemWithCase,
      messages: mappedMessages,
    });
    const text = response.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");
    res.json({ message: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as aiExpressRouter };
