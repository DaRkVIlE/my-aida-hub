import { useState, useEffect, useRef } from "react";
import {
  Sparkles, X, Send, Volume2, VolumeX, Shield, Terminal,
  Zap, Brain, Skull, Target, Flame, RotateCcw, ChevronRight,
  Bot, Clock, Minimize2, Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { systemAudio } from "@/lib/systemAudio";
import { systemVoice } from "@/lib/systemVoice";
import { useSharedBrain } from "@/hooks/useSharedBrain";

interface Message {
  id: string;
  sender: "system" | "player";
  text: string;
  timestamp: string;
  category?: "status" | "alert" | "tactical" | "chat";
}

const QUICK_ACTIONS = [
  { label: "📊 Status Geral", prompt: "Qual o meu status geral de caçador hoje?" },
  { label: "⚔️ Próxima Raid", prompt: "Qual a missão prioritária do meu bloco atual de tempo?" },
  { label: "🛡️ Alerta Dopamina", prompt: "Como conter impulsos dopaminérgicos e manter a disciplina agora?" },
  { label: "💰 War Chest 15k", prompt: "Qual a estratégia para atingir a meta dos R$ 15k e liquidar as dívidas?" },
];

export function SkyrosFloatingSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [voiceActive, setVoiceActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const brain = useSharedBrain();
  const {
    level, xp, streak, realCoins, revenueGoal, skyrosScore, focoGems
  } = brain;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "system",
      text: "⚡ [SISTEMA // PROTOCOLO SOLO LEVELING INICIADO]\nBem-vindo, Player Gabriel. Conexão neural ativa. GOD POOL calibrado (5 nós operacionais). Pressione [Ctrl + Espaço] a qualquer momento para abrir este canal.",
      timestamp: "07:00",
      category: "alert",
    },
  ]);

  // Global Keyboard shortcut: Ctrl + Space & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
            systemAudio.playPortalEnter();
            systemVoice.speak("Sistema online. Player Gabriel detectado.");
          } else {
            systemAudio.playHover();
            systemVoice.stop();
          }
          return next;
        });
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        systemVoice.stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        systemAudio.playPortalEnter();
        systemVoice.speak("Sistema ativado. Ordens, Monarca?");
      } else {
        systemAudio.playHover();
        systemVoice.stop();
      }
      return next;
    });
  };

  const toggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = systemVoice.toggle();
    setVoiceActive(next);
    systemAudio.playHover();
    if (next) systemVoice.speak("Síntese de voz ativada.");
  };

  // Tactical response generator tailored to Gabriel's live state
  const generateSystemResponse = (userText: string) => {
    const textLower = userText.toLowerCase();

    if (textLower.includes("status") || textLower.includes("caçador")) {
      return `📊 [RELATÓRIO DO MONARCA]:
• Nível: ${level} (${xp} XP acumulados)
• Consistência: ${streak} dias consecutivos
• Faturamento: R$ ${realCoins.toLocaleString("pt-BR")} / R$ ${revenueGoal.toLocaleString("pt-BR")}
• Sincronia SKYROS: ${skyrosScore}/100
• Mana Disponível: ${focoGems} Gemas
Diretriz: Continue sustentando a rotina. Cada bloco de foco aproxima o primeiro contrato pago da Experia.`;
    }

    if (textLower.includes("missão") || textLower.includes("raid") || textLower.includes("bloco")) {
      const hour = new Date().getHours();
      let slot = "Raid 1: AI Ops & Expéria";
      let focus = "Fechar primeiro contrato comercial sem cold calls (tráfego orgânico + outreach direcionado).";

      if (hour < 9) {
        slot = "Ritual Matinal & Ativação";
        focus = "Organização do Castelo, água, postura e alinhamento de intenção.";
      } else if (hour >= 14 && hour < 19) {
        slot = "Raid 2: Vitrines Plin & Muli + Aulas de Inglês";
        focus = "Subir os sites vitrine para criar credencial inabalável de autoridade.";
      } else if (hour >= 19) {
        slot = "Arena & Santuário Noturno";
        focus = "Treino físico para postura (1,92m), descanso consciente e zero estímulos dopaminérgicos baratos.";
      }

      return `⚔️ [PROTOCOLO DO HORÁRIO // ${String(hour).padStart(2, "0")}:00]:
Você está no bloco: ${slot}.
Foco Primário: ${focus}`;
    }

    if (textLower.includes("dopamina") || textLower.includes("distra") || textLower.includes("preguiça")) {
      return `🛡️ [INTERVENÇÃO NEURAL DO SISTEMA]:
Impulso de gratificação rápida detectado.
Lembre-se: Você é o Monarca, não um escravo de descargas baratas de dopamina.
Regra do Arsenal: Relaxamento (baseado, telas, doces) só é liberado APÓS a vitória tática do dia e resgate via Gemas no Arsenal.
Respire fundo, endireite as escápulas e volte ao trabalho de valor real.`;
    }

    if (textLower.includes("15k") || textLower.includes("dívida") || textLower.includes("war chest")) {
      const warChestGoal = 15000;
      const pct = Math.round((realCoins / warChestGoal) * 100);
      return `💰 [PLANO DE GUERRA: WAR CHEST R$ 15.000]:
Progresso Atual: ${pct}% (R$ ${realCoins.toLocaleString("pt-BR")} / R$ 15.000).
Estratégia Imutável:
Ao acumular R$ 15.000 de caixa líquido via contratos da Experia e aulas, você liquida à vista todas as pendências (Serasa, IPTU, Contas) com 60% a 80% de desconto simultâneo.
Não disperse caixa em migalhas. Ataque de uma só vez.`;
    }

    // Default conversational response
    return `[DIRETRIZ DO SISTEMA]:
Comando recebido: "${userText}".
A matriz de IA do SKYROS está operando em alta frequência. Mantenha a clareza estratégica, proteja seu tempo e converta esforço mental em riqueza material real.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    systemAudio.playHover();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "player",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const apiUrl = import.meta.env.VITE_SKYROS_API_URL || "http://localhost:3001";
    let responseText = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`${apiUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          telemetry: {
            level,
            xp,
            streak,
            realCoins,
            revenueGoal,
            skyrosScore,
            currentHour: new Date().getHours(),
          },
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        responseText = data.reply || "";
      } else {
        responseText = generateSystemResponse(text);
      }
    } catch {
      // Local fallback if backend is offline
      responseText = generateSystemResponse(text);
    }

    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      sender: "system",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, systemMsg]);
    setIsTyping(false);
    systemAudio.playPortalEnter();

    if (voiceActive) {
      systemVoice.speak(responseText);
    }
  };

  return (
    <>
      {/* ══ TRIGGER FLUTUANTE // CRISTAL DO SISTEMA (BOTTOM-RIGHT) ══ */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          aria-label="Abrir Sistema SKYROS"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 p-1.5 rounded-full bg-system-void/90 border border-system-cyan/60 hover:border-system-cyan shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Pulsing Core */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-system-cyan/30 to-system-purple/30 flex items-center justify-center border border-system-cyan">
            <Sparkles className="w-5 h-5 text-system-cyan animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-system-cyan rounded-full border-2 border-system-void shadow-[0_0_8px_#00f0ff]" />
          </div>

          {/* Expanded Hover Pill */}
          <div className="hidden sm:flex flex-col text-left pr-3">
            <span className="text-[10px] font-mono text-system-cyan font-bold tracking-widest uppercase">
              SISTEMA SKYROS
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">
              [Ctrl + Espaço]
            </span>
          </div>
        </button>
      )}

      {/* ══ MODAL HOLOGRÁFICO SOLO LEVELING // SKYROS HUD ══ */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 ease-out",
            isMinimized
              ? "bottom-6 right-6 w-80 h-14"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[90vh]"
          )}
        >
          <div className="system-window w-full h-full border-2 border-system-cyan/70 bg-system-void/95 shadow-[0_0_40px_rgba(0,240,255,0.3)] backdrop-blur-2xl flex flex-col rounded-lg overflow-hidden relative">
            {/* Scanline overlay */}
            <div className="absolute inset-0 scanline pointer-events-none opacity-30" />

            {/* ── HEADER DA JANELA DO SISTEMA ── */}
            <div className="relative z-10 px-4 py-3 border-b border-system-cyan/40 bg-system-cyan/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-system-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
                <div>
                  <h3 className="text-xs font-system text-white tracking-widest uppercase glow-hunter">
                    [SISTEMA · SKYROS v5.0]
                  </h3>
                  <p className="text-[9px] font-mono text-system-cyan/80">
                    STATUS: S-RANK // GOD POOL: 5x GROQ ONLINE
                  </p>
                </div>
              </div>

              {/* Controles de Janela */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleVoice}
                  title={voiceActive ? "Silenciar Voz" : "Ativar Voz Sintética"}
                  className={cn(
                    "p-1.5 rounded text-xs transition-colors",
                    voiceActive ? "text-system-cyan hover:bg-system-cyan/20" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {voiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Maximizar" : "Minimizar"}
                  className="p-1.5 text-muted-foreground hover:text-white rounded hover:bg-white/5 transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleOpen}
                  title="Fechar [Esc]"
                  className="p-1.5 text-muted-foreground hover:text-system-crimson rounded hover:bg-system-crimson/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── CORPO DO CHAT & HISTÓRICO ── */}
            {!isMinimized && (
              <>
                <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-system-cyan/30">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col animate-fade-in",
                        msg.sender === "player" ? "items-end" : "items-start"
                      )}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground mb-1">
                        <span>{msg.sender === "player" ? "PLAYER GABRIEL" : "[SISTEMA]"}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={cn(
                          "p-3 rounded max-w-[90%] text-xs font-rajdhani leading-relaxed whitespace-pre-wrap border",
                          msg.sender === "player"
                            ? "bg-system-purple/20 border-system-purple/50 text-white rounded-tr-none shadow-[0_0_10px_rgba(138,43,226,0.2)]"
                            : "bg-system-cyan/10 border-system-cyan/40 text-cyan-50 rounded-tl-none shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* Indicador de Digitação do Sistema */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-system-cyan text-xs font-mono p-2">
                      <Terminal className="w-3.5 h-3.5 animate-spin" />
                      <span className="animate-pulse">SISTEMA PROCESSANDO VETORES NEURAIS...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ── CHIPS DE AÇÕES RÁPIDAS ── */}
                <div className="relative z-10 px-3 py-2 border-t border-system-border/60 bg-system-void/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {QUICK_ACTIONS.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.prompt)}
                      className="whitespace-nowrap px-2.5 py-1 rounded bg-system-cyan/10 border border-system-cyan/30 hover:border-system-cyan text-[10px] font-mono text-system-cyan hover:text-white transition-all hover:scale-105 active:scale-95"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* ── BARRA DE ENTRADA DO USUÁRIO ── */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative z-10 p-3 border-t border-system-cyan/30 bg-system-void/90 flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Instrua o Sistema ou solicite orientação..."
                    className="flex-1 bg-system-void border border-system-cyan/40 focus:border-system-cyan rounded px-3 py-2 text-xs text-white placeholder:text-muted-foreground/60 outline-none font-rajdhani"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2 rounded bg-system-cyan text-system-void hover:bg-system-cyan/80 disabled:opacity-40 disabled:hover:bg-system-cyan transition-all shadow-[0_0_10px_#00f0ff]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
