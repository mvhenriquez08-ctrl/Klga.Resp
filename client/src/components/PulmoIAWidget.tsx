import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  Send,
  User,
  X,
  Sparkles,
  Loader2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

interface PulmoIAWidgetProps {
  /** Contextual description of what the student is currently viewing */
  context: string;
}

export function PulmoIAWidget({ context }: PulmoIAWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const chat = useCallback(
    async (msgList: Message[]) => {
      setIsPending(true);
      try {
        const res = await fetch("/api/pulmoia/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: msgList, context }),
        });
        const data = await res.json();
        if (data.error) {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: `⚠️ Error: ${data.error}` },
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: data.message },
          ]);
        }
      } catch (err: any) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ No se pudo conectar con PulmoIA: ${err.message}`,
          },
        ]);
      } finally {
        setIsPending(false);
      }
    },
    [context]
  );

  const sendMessage = (text?: string) => {
    const content = text ?? input.trim();
    if (!content || isPending) return;
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    chat(newMessages);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2.5",
            "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
            "text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-cyan-500/25",
            "transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30",
            "group"
          )}
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm">PulmoIA</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-[400px] h-[560px] max-h-[calc(100vh-48px)]",
            "bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50",
            "flex flex-col overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in duration-300"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-500/15 rounded-lg">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">PulmoIA</p>
                <p className="text-[10px] text-gray-500">
                  Asistente contextual
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Limpiar chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context badge */}
          <div className="px-4 py-2 border-b border-gray-800/50">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span className="truncate">
                Contexto: {context.slice(0, 80)}
                {context.length > 80 ? "…" : ""}
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-auto px-4 py-3 space-y-3 min-h-0">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    ¿Necesitas ayuda? 🫁
                  </p>
                  <p className="text-gray-500 text-xs mt-1 max-w-[260px]">
                    Pregúntame sobre lo que estás viendo. Tengo contexto de tu
                    página actual.
                  </p>
                </div>
                <div className="grid gap-1.5 w-full max-w-[280px]">
                  {[
                    "¿Puedes explicarme esto?",
                    "¿Qué debo observar aquí?",
                    "¿Cuál es la relevancia clínica?",
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs text-left px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/30 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2.5",
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                        m.role === "user" ? "bg-gray-700" : "bg-cyan-500/20"
                      )}
                    >
                      {m.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-gray-300" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "bg-cyan-500/20 text-white rounded-tr-sm"
                          : "bg-gray-800 text-gray-200 rounded-tl-sm"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isPending && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="bg-gray-800 px-3 py-2 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="px-3 py-3 border-t border-gray-800 bg-gray-900/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Pregúntale a PulmoIA…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                disabled={isPending}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isPending}
                className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 rounded-xl transition-colors"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
