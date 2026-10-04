import { useState, useEffect, useRef } from "react";
import { Sparkles, MessageCircle, X, Send, Bot, User, Compass, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
import { sendTutorMessage, getTutorRecommendation, type TutorRecommendation } from "@/lib/manaApi";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const QUICK_PROMPTS = [
  "Como paro de traduzir mentalmente?",
  "Qual portal você recomenda para mim hoje?",
  "Como tirar o máximo de proveito do Jordan?",
  "O que significa o método MANA?"
];

export function AidaTutorDrawer({ player }: { player: AidaPlayerState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá, ${player.displayName}! Eu sou a **AIDA**, sua tutora e parceira no Método MANA. ✨\n\nEstou aqui para tirar dúvidas sobre a metodologia, te ajudar a destravar a fala sem traduzir na cabeça e orientar em qual dos 5 Portais você deve focar hoje. Como posso te guiar agora?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<TutorRecommendation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = player.user?._id || player.user?.id;

  // Busca recomendação da AIDA ao abrir
  useEffect(() => {
    if (isOpen && userId && !recommendation) {
      getTutorRecommendation(userId)
        .then(rec => setRecommendation(rec))
        .catch(() => {
          // Fallback silencioso se o backend não tiver histórico
        });
    }
  }, [isOpen, userId, recommendation]);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await sendTutorMessage(text, history, userId);
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
      player.refetch();
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Tive uma oscilação momentânea na conexão, mas lembre-se: a regra de ouro do MANA é **nunca traduzir frases completas**. Tente novamente em alguns segundos!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300",
          "text-black font-black px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.35)]",
          "flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="w-7 h-7 rounded-xl bg-black/20 flex items-center justify-center text-sm">
          ⚡
        </div>
        <span className="text-xs uppercase tracking-wider font-extrabold">Tutora AIDA</span>
      </button>

      {/* Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border-l border-white/10 h-full flex flex-col shadow-2xl relative">
            
            {/* Header do Drawer */}
            <div className="p-4 border-b border-white/10 bg-gray-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    AIDA <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">Mestre</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">Tutora & Mentora do Método MANA</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner de Recomendação Diária (se houver) */}
            {recommendation && (
              <div className="p-3 bg-emerald-950/30 border-b border-emerald-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Compass className="w-3.5 h-3.5" /> Recomendação do Dia:
                </div>
                <p className="text-gray-300 mt-0.5">{recommendation.rationale}</p>
                <div className="text-[10px] text-emerald-500 mt-1 font-semibold">
                  Ação: {recommendation.dailyAction} ({recommendation.guardian})
                </div>
              </div>
            )}

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2.5",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ⚡
                    </div>
                  )}

                  <div
                    className={cn(
                      "p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-emerald-500 text-black font-medium rounded-tr-none"
                        : "bg-gray-900 border border-white/10 text-gray-200 rounded-tl-none shadow-sm"
                    )}
                  >
                    {m.content}
                  </div>

                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-lg bg-white/10 text-gray-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">
                      {player.avatarInitial}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>AIDA está formulando a orientação...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="p-2.5 border-t border-white/5 bg-gray-950/60 overflow-x-auto flex gap-1.5 no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[10px] whitespace-nowrap bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 px-2.5 py-1 rounded-full text-gray-400 hover:text-emerald-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input de Envio */}
            <div className="p-3 border-t border-white/10 bg-gray-900/90 flex gap-2">
              <input
                type="text"
                placeholder="Pergunte à Tutora AIDA..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
