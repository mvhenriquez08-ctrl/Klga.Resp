import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Stethoscope,
  GraduationCap,
  ClipboardCheck,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "../lib/utils";

type Mode = "tutor" | "evaluador" | "paciente";
type Message = { role: "user" | "assistant"; content: string };

const MODES = [
  {
    id: "tutor" as Mode,
    label: "Tutor",
    icon: GraduationCap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    activeBg: "bg-cyan-500/20 border-cyan-500/40",
    description: "Explica conceptos y responde tus dudas",
  },
  {
    id: "evaluador" as Mode,
    label: "Evaluador",
    icon: ClipboardCheck,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    activeBg: "bg-violet-500/20 border-violet-500/40",
    description: "Corrige tu respuesta y te da nota",
  },
  {
    id: "paciente" as Mode,
    label: "Paciente Virtual",
    icon: Stethoscope,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    activeBg: "bg-emerald-500/20 border-emerald-500/40",
    description: "Practica diagnóstico con un paciente simulado",
  },
];

const SUGGESTED_QUESTIONS = [
  "¿Cómo funciona el ciclo respiratorio?",
  "Explícame la diferencia entre EPOC y asma",
  "¿Qué son los ruidos adventicios en la auscultación?",
  "¿Cómo interpreto una espirometría?",
];

const DEFAULT_CASES = [
  {
    label: "EPOC moderado",
    description: `Paciente masculino, 62 años, ex fumador (40 paquetes/año). Consulta por disnea progresiva de 2 años de evolución, tos productiva matutina con expectoración blanquecina, y episodios frecuentes de infecciones respiratorias. Últimamente nota que se fatiga al subir escaleras. No tiene fiebre. Diagnóstico: EPOC GOLD II.`,
  },
  {
    label: "Asma bronquial",
    description: `Paciente femenina, 24 años, con historia de rinitis alérgica. Consulta por episodios recurrentes de sibilancias, opresión torácica y tos seca nocturna, especialmente en primavera. Los síntomas mejoran con broncodilatadores. Diagnóstico: Asma bronquial intermitente.`,
  },
  {
    label: "Neumonía",
    description: `Paciente masculino, 45 años. Consulta por fiebre de 38.8°C de 3 días, tos productiva con expectoración verdosa, dolor pleurítico en hemitórax derecho y fatiga intensa. A la auscultación hay crépitos en base derecha. Diagnóstico: Neumonía lobar derecha.`,
  },
];

function ModeCard({
  mode,
  active,
  onClick,
}: {
  mode: (typeof MODES)[0];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = mode.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center",
        active
          ? cn("border", mode.activeBg)
          : "border-gray-800 bg-gray-900 hover:border-gray-700"
      )}
    >
      <div className={cn("p-2 rounded-lg", mode.bg)}>
        <Icon className={cn("w-5 h-5", mode.color)} />
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            active ? mode.color : "text-white"
          )}
        >
          {mode.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{mode.description}</p>
      </div>
    </button>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-gray-700" : "bg-cyan-500/20"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-gray-300" />
        ) : (
          <Bot className="w-4 h-4 text-cyan-400" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-cyan-500/20 text-white rounded-tr-sm"
            : "bg-gray-800 text-gray-100 rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

// ── Evaluator sub-component ──
function EvaluatorMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const evaluate = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/pulmoia/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, studentAnswer: answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <label className="text-sm font-medium text-gray-300">
          Pregunta o caso clínico
        </label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Pega aquí la pregunta o el enunciado del caso…"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
        />
        <label className="text-sm font-medium text-gray-300">
          Tu respuesta
        </label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Escribe tu respuesta aquí…"
          rows={5}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
        />
        <button
          onClick={evaluate}
          disabled={!question.trim() || !answer.trim() || isPending}
          className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Evaluando…
            </>
          ) : (
            <>
              <ClipboardCheck className="w-4 h-4" /> Evaluar mi respuesta
            </>
          )}
        </button>
      </div>

      {feedback && (
        <div className="flex-1 bg-gray-900 border border-violet-500/20 rounded-xl p-5 overflow-auto">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-400">
              Feedback de PulmoIA
            </span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Patient simulation sub-component ──
function PatientMode() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const simulate = async (caseDesc: string, msgList: Message[]) => {
    setIsPending(true);
    try {
      const res = await fetch("/api/pulmoia/patientSimulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseDescription: caseDesc, messages: msgList }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startCase = (caseDesc: string) => {
    setSelectedCase(caseDesc);
    setMessages([]);
    simulate(caseDesc, []);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedCase) return;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    simulate(selectedCase, newMessages);
  };

  if (!selectedCase) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Elige un caso clínico para comenzar la simulación:
        </p>
        <div className="grid gap-3">
          {DEFAULT_CASES.map(c => (
            <button
              key={c.label}
              onClick={() => startCase(c.description)}
              className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 hover:border-emerald-500/40 rounded-xl text-left transition-colors group"
            >
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {c.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Haz clic para iniciar la simulación
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-emerald-400 font-medium">
          🩺 Simulación activa
        </span>
        <button
          onClick={() => {
            setSelectedCase(null);
            setMessages([]);
          }}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Cambiar caso
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4 min-h-0">
        {isPending && messages.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {isPending && messages.length > 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
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
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Hazle una pregunta al paciente…"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isPending}
          className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main PulmoIA page ──
export function PulmoIA() {
  const [mode, setMode] = useState<Mode>("tutor");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chat = async (msgList: Message[]) => {
    setIsPending(true);
    try {
      const res = await fetch("/api/pulmoia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgList }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    chat(newMessages);
  };

  const resetChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-full p-6 max-w-4xl mx-auto gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/15 rounded-xl">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              PulmoIA
              <span className="text-xs font-normal bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full">
                Powered by Claude
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Tu tutor de cardiorrespiratoria
            </p>
          </div>
        </div>
        {mode === "tutor" && messages.length > 0 && (
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Nueva conversación
          </button>
        )}
      </div>

      {/* Mode selector */}
      <div className="flex gap-3">
        {MODES.map(m => (
          <ModeCard
            key={m.id}
            mode={m}
            active={mode === m.id}
            onClick={() => {
              setMode(m.id);
              resetChat();
            }}
          />
        ))}
      </div>

      {/* Content area */}
      {mode === "evaluador" ? (
        <div className="flex-1 min-h-0">
          <EvaluatorMode />
        </div>
      ) : mode === "paciente" ? (
        <div className="flex-1 min-h-0">
          <PatientMode />
        </div>
      ) : (
        // Tutor chat
        <>
          <div className="flex-1 min-h-0 overflow-auto bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 text-center py-8">
                <div className="p-4 bg-cyan-500/10 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Hola, soy PulmoIA 🫁
                  </p>
                  <p className="text-gray-400 text-sm mt-1 max-w-sm">
                    Estoy aquí para ayudarte a entender el área
                    cardiorrespiratoria. ¿Por dónde empezamos?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs text-left px-3 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/40 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <MessageBubble key={i} message={m} />
                ))}
                {isPending && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
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

          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Pregúntale algo a PulmoIA…"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isPending}
              className="p-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PulmoIA;
