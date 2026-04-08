import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
 MessageCircle,
 Send,
 Loader2,
 User,
 Brain,
 Trash2,
 Stethoscope,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Eres un asistente clínico especializado en medicina intensiva y respiratoria para la plataforma PulmoLab / Resp Academy. Tu especialidad incluye ecografía pulmonar (LUS), ventilación mecánica, radiología torácica, TC de tórax, gasometría arterial, ECMO, arritmias, scores UCI, hemodinámica y farmacología UCI. Responde siempre en español con precisión clínica. Recuerda que eres una herramienta de apoyo y no reemplazas el juicio clínico.`;

const SUGGESTIONS = [
 "¿Cuáles son los criterios ecográficos para ARDS?",
 "¿Cómo interpreto líneas B confluentes bilaterales?",
 "¿Cuándo considerar el destete de ventilación mecánica?",
 "¿Qué indica un broncograma aéreo dinámico en ecografía?",
 "Explica el protocolo BLUE para disnea aguda",
 "¿Cómo calculo el LUS Score?",
];

export default function ClinicalChat() {
 const [messages, setMessages] = useState<Msg[]>([]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 const scrollRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [messages]);

 const send = async (text?: string) => {
  const query = text || input.trim();
  if (!query || loading) return;
  const userMsg: Msg = { role: "user", content: query };
  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  setInput("");
  setLoading(true);
  let assistantText = "";

  const updateAssistant = (chunk: string) => {
   assistantText += chunk;
   setMessages(prev => {
    const last = prev[prev.length - 1];
    if (last?.role === "assistant") {
     return prev.map((m, i) =>
      i === prev.length - 1 ? { ...m, content: assistantText } : m
     );
    }
    return [...prev, { role: "assistant", content: assistantText }];
   });
  };

  try {
   const { data, error } = await supabase.functions.invoke("pulmoia", {
    body: {
     action: "chat",
     messages: newMessages.map(m => ({
      role: m.role,
      content: m.content,
     })),
    },
   });
   if (error) throw error;

   const text = data.message || "Sin respuesta";
   updateAssistant(text);
  } catch (e: any) {
   toast.error(e.message || "Error en el chat");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex flex-col h-[calc(100vh-4rem)]">
   <div className="border-b px-6 py-4 bg-card/50">
    <div className="flex items-center justify-between max-w-4xl mx-auto">
     <div>
      <h1 className="text-xl font-bold flex items-center gap-2">
       <MessageCircle className="h-5 w-5 text-primary" /> Chat Clínico
      </h1>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
       <Stethoscope className="h-3 w-3" /> Impulsado por Claude ·
       Especializado en UCI y Medicina Respiratoria
      </p>
     </div>
     {messages.length > 0 && (
      <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
       <Trash2 className="h-3.5 w-3.5 mr-1" />
       <span className="text-xs">Limpiar</span>
      </Button>
     )}
    </div>
   </div>

   <ScrollArea className="flex-1 px-4 py-6">
    {messages.length === 0 ? (
     <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 max-w-2xl mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
       <Brain className="h-10 w-10 text-primary" />
      </div>
      <div>
       <p className="text-xl font-semibold">
        Asistente Clínico PulmoLab
       </p>
       <p className="text-sm text-muted-foreground mt-2 max-w-md">
        Especializado en ecografía pulmonar, ventilación mecánica,
        radiología torácica y medicina intensiva. Impulsado por Claude
        de Anthropic.
       </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
       {SUGGESTIONS.map(q => (
        <Button
         key={q}
         variant="outline"
         className="text-xs text-left h-auto p-3 whitespace-normal hover:border-primary/40"
         onClick={() => send(q)}
        >
         {q}
        </Button>
       ))}
      </div>
     </div>
    ) : (
     <div className="space-y-6 max-w-3xl mx-auto">
      {messages.map((m, i) => (
       <div
        key={i}
        className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
       >
        {m.role === "assistant" && (
         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Brain className="h-4 w-4 text-primary" />
         </div>
        )}
        <div
         className={`rounded-xl px-4 py-3 max-w-[85%] shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}
        >
         {m.role === "assistant" ? (
          <div className="prose prose-sm max-w-none dark:prose-invert text-foreground">
           <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
         ) : (
          <p className="text-sm">{m.content}</p>
         )}
        </div>
        {m.role === "user" && (
         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
         </div>
        )}
       </div>
      ))}
      {loading && (
       <div className="flex gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
         <Brain className="h-4 w-4 text-primary" />
        </div>
        <div className="bg-card border rounded-xl px-4 py-3">
         <div className="flex gap-1 items-center">
          {[0, 150, 300].map(d => (
           <div
            key={d}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${d}ms` }}
           />
          ))}
         </div>
        </div>
       </div>
      )}
      <div ref={scrollRef} />
     </div>
    )}
   </ScrollArea>

   <div className="border-t px-4 py-4 bg-card/50">
    <form
     onSubmit={e => {
      e.preventDefault();
      send();
     }}
     className="flex gap-2 max-w-3xl mx-auto"
    >
     <Input
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder="Pregunta clínica sobre ecografía, VM, radiología..."
      disabled={loading}
      className="flex-1"
     />
     <Button type="submit" disabled={loading || !input.trim()}>
      {loading ? (
       <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
       <Send className="h-4 w-4" />
      )}
     </Button>
    </form>
    <p className="text-[10px] text-muted-foreground text-center mt-2">
     Herramienta de apoyo clínico · No reemplaza el juicio médico
     profesional
    </p>
   </div>
  </div>
 );
}
