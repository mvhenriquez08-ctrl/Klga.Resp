// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
// @ts-ignore
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
// @ts-ignore
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error("La variable de entorno GEMINI_API_KEY no está configurada.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        });
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

// @ts-ignore
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const body = await req.json();
        const { action } = body;

        if (action === 'chat') {
            const { messages } = body;
            const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || "";

            // === FLUJO RAG: BÚSQUEDA DE DOCUMENTOS ===
            let contextStr = "";
            try {
                if (lastUserMessage) {
                    const embedResult = await embedModel.embedContent(lastUserMessage);
                    const query_embedding = embedResult.embedding.values;

                    const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
                        query_embedding,
                        match_threshold: 0.2,
                        match_count: 5
                    });

                    if (rpcError) console.error("RPC Error:", rpcError);

                    if (chunks && chunks.length > 0) {
                        contextStr = chunks.map((c: any) => `[Fuente: ${c.document_name || 'Academia'}]: ${c.content}`).join('\n\n');
                    }
                }
            } catch (e) {
                console.error("Error en búsqueda semántica:", e);
            }

            const systemInstruction = `Eres PulmoIA, el asistente experto de Resp Academy.
            
REGLAS CRÍTICAS:
1. Utiliza la sección "CONTEXTO DE LA ACADEMIA" para fundamentar tus respuestas. Es información oficial.
2. Si el contexto no contiene la respuesta exacta, utiliza tu conocimiento clínico general pero aclara que no hay registros específicos de la academia sobre ese punto preciso.
3. Mantén un tono profesional, didáctico y alentador.
4. Responde siempre en español.

--- CONTEXTO DE LA ACADEMIA ---
${contextStr || "No hay fragmentos específicos disponibles para esta consulta en los documentos cargados."}
--- FIN DEL CONTEXTO ---

Historial de conversación:
${messages.map((m: any) => `${m.role === 'user' ? 'Estudiante' : 'PulmoIA'}: ${m.content}`).join('\n')}
PulmoIA:`;

            const result = await model.generateContent(systemInstruction);
            return new Response(JSON.stringify({ message: result.response.text() }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'evaluate') {
            const { question, studentAnswer } = body;
            const prompt = `Evalúa la siguiente respuesta de un estudiante de medicina/kinesiología:
Caso: ${question}
Respuesta: ${studentAnswer}

Proporciona feedback constructivo, resalta lo correcto y corrige los errores con base científica.`;

            const result = await model.generateContent(prompt);
            return new Response(JSON.stringify({ feedback: result.response.text() }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'analyze-ultrasound') {
            const { image_base64 } = body;
            const prompt = `Analiza esta ecografía pulmonar (LUS).
Identifica patrones (Líneas A, Líneas B, Consolidación, Derrame) y proporciona una interpretación clínica estructurada.
Devuelve EXCLUSIVAMENTE un objeto JSON con: pattern, interpretation, confidence (0-1), zone_score (0-3), findings (array), detectedSigns (array).`;

            const imagePart = { inlineData: { data: image_base64, mimeType: "image/jpeg" } };
            const result = await model.generateContent([prompt, imagePart]);

            let responseText = result.response.text();
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            return new Response(JSON.stringify({ analysis: JSON.parse(responseText) }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'patientSimulation') {
            const { caseDescription, messages } = body;
            const history = messages.map((m: any) => `${m.role === 'user' ? 'Doctor' : 'Paciente'}: ${m.content}`).join('\n');
            const prompt = `Estás simulando ser un paciente en una consulta de urgencias respiratorias.
Descripción del caso: ${caseDescription}
No rompas el personaje. Eres el paciente. Responde de forma natural y breve.

Historial:
${history}
Paciente:`;

            const result = await model.generateContent(prompt);
            return new Response(JSON.stringify({ message: result.response.text() }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        throw new Error("Acción no reconocida.");
    } catch (error: any) {
        console.error("Error General:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        });
    }
});
