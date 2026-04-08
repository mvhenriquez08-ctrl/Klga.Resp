import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { generateLUSSystemPrompt } from "../shared/promptBuilder";

const router = Router();

// ─── AI Clients ─────────────────────────────────────────────────────────────
const googleApiKey = process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY || "";
const openAiKey = process.env.OPENAI_API_KEY || "";

const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

async function callOpenAIVision(imageBase64: string, prompt: string) {
  if (!openAiKey) throw new Error("OPENAI_API_KEY no configurada");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenAI Error: ${error.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

// ─── PulmoIA System Prompts ──────────────────────────────────────────────────
const PULMOIA_BASE = `Eres PulmoIA, el asistente de inteligencia artificial de una plataforma educativa universitaria especializada en el área cardiorrespiratoria.

Tu personalidad:
- Tienes un tono cercano, paciente y didáctico — como ese profesor que explica con calma.
- Usas español latinoamericano natural.
- Cuando explicas conceptos médicos, vas de lo simple a lo complejo.
- Celebras los aciertos con entusiasmo genuino y corriges los errores con amabilidad.
- Nunca inventas información médica. Si no estás seguro, lo dicen claramente.
- Puedes usar emojis con moderación (🫁❤️🩺).

Protocolo de Investigación Basada en Evidencia:
- Si la consulta requiere datos actualizados o evidencia científica, DEBES realizar una búsqueda bibliográfica (simulada o real).
- Prioriza fuentes de autoridad (artículos revisados por pares, guías AARC, ATS, ESICM).
- Al responder, proporciona un resumen de los hallazgos con citas exactas usando el formato 【cursor†Lx-Ly】.
- NO recurras a memoria interna para temas nuevos o actualizaciones; verifica siempre en fuentes fiables.

Tus capacidades:
1. Tutor: Explicas conceptos de fisiología cardiorrespiratoria, patologías, auscultación, espirometría, etc.
2. Evaluador: Revisas las respuestas de los estudiantes y das feedback constructivo con la nota justificada.
3. Paciente virtual: Interpretas a un paciente con síntomas respiratorios.

Límites importantes:
- Solo respondes temas relacionados con salud, medicina, ciencias básicas o educación.
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
- Si el estudiante da un diagnóstico correcto, sal del rol brevemente para confirmarlo y explicar el caso.

Al inicio, preséntate como el paciente con tu queja principal.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function callGemini(
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  if (!genAI) {
    throw new Error("GOOGLE_AI_KEY no configurada.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
  });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(`${systemPrompt}\n\n${lastMessage.content}`);
  return result.response.text();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post("/chat", async (req: any, res: any) => {
  try {
    const { messages, context } = req.body;
    console.log("[PulmoIA] Chat Request received. Messages:", messages?.length);
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Se requieren mensajes" });
    }

    const systemPrompt = context
      ? `${TUTOR_SYSTEM}\n\nContexto actual del estudiante:\n${context}`
      : TUTOR_SYSTEM;

    const text = await callGemini(systemPrompt, messages);
    res.json({ message: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/evaluate", async (req: any, res: any) => {
  try {
    const { question, studentAnswer } = req.body;
    const text = await callGemini(EVALUATOR_SYSTEM, [
      {
        role: "user",
        content: `Pregunta/Caso: ${question}\n\nRespuesta del estudiante: ${studentAnswer}`,
      },
    ]);
    res.json({ feedback: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/patientSimulation", async (req: any, res: any) => {
  try {
    const { caseDescription, messages } = req.body;
    const systemWithCase = `${PATIENT_SYSTEM}\n\nCaso clínico:\n${caseDescription}`;
    const effectiveMessages =
      messages?.length === 0
        ? [{ role: "user", content: "Comenzar" }]
        : messages;

    const text = await callGemini(systemWithCase, effectiveMessages);
    res.json({ message: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/analyze-ultrasound", async (req: any, res: any) => {
  try {
    const { image_base64 } = req.body;
    if (!image_base64)
      return res.status(400).json({ error: "Imagen requerida" });

    const prompt = generateLUSSystemPrompt();

    // Prioridad 1: OpenAI GPT-4o
    if (openAiKey) {
      console.log("[PulmoIA] Analizando con GPT-4o...");
      const analysis = await callOpenAIVision(image_base64, prompt);
      return res.json({ analysis });
    }

    // Prioridad 2: Gemini Fallback
    if (genAI) {
      console.log("[PulmoIA] Analizando con Gemini (Fallback)...");
      const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: image_base64, mimeType: "image/jpeg" } },
      ]);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { error: "Formato IA inválido" };
      return res.json({ analysis });
    }

    throw new Error("No hay proveedores de IA configurados (OpenAI/Google)");
  } catch (error: any) {
    console.error("[PulmoIA] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as aiExpressRouter };
