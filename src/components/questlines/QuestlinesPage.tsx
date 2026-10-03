import { useState, useEffect } from "react";
import {
  Scroll, CheckCircle2, Circle, ChevronDown, Trophy,
  Sparkles, Swords, Crown, Home, FileText, Dumbbell,
  Mic, Globe, Store, Smartphone, AlertCircle, LayoutGrid, Compass, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { systemAudio } from "@/lib/systemAudio";

interface Step {
  id: string;
  title: string;
  xpReward: number;
  done: boolean;
  deadline?: string;
  isHabit?: boolean;
}

export type QuestRank = "E" | "D" | "C" | "B" | "A" | "S";

interface Questline {
  id: string;
  name: string;
  rank: QuestRank;
  description: string;
  lore: string;
  category: "main" | "side" | "castle" | "life";
  priority: "P0" | "P1" | "P2";
  progress: number;
  totalSteps: number;
  icon: any;
  active: boolean;
  reward: string;
  deadline?: string;
  steps: Step[];
}

const allQuestlines: Questline[] = [
  {
    id: "experia",
    name: "⚔️ Experia Empire (AI Ops)",
    rank: "S",
    description: "Conquistar clientes de automação & IA Ops via tráfego orgânico e outreach online (sem cold calls)",
    lore: "A máquina de guerra comercial. O primeiro cliente pago de AI Ops este mês abre as portas da liberdade financeira.",
    category: "main",
    priority: "P0",
    progress: 2,
    totalSteps: 6,
    icon: Trophy,
    active: true,
    reward: "MRR R$ 3k-5k · Boss do IPTU e Contas começam a sangrar",
    deadline: "Temporada 1 — Fundação",
    steps: [
      { id: "e1", title: "📄 PRD & Arquitetura da Experia — documento fundador", xpReward: 100, done: true },
      { id: "e2", title: "🎨 Design System & Identidade Visual de Elite", xpReward: 80, done: true },
      { id: "e3", title: "🌐 Landing Page de Alta Conversão da Experia", xpReward: 120, done: false },
      { id: "e4", title: "📸 Sites Plin e Muli estruturados como portfólio de cases", xpReward: 150, done: false },
      { id: "e5", title: "🚀 Campanha de Outreach Online & Tráfego Orgânico BR", xpReward: 120, done: false },
      { id: "e6", title: "💰 Primeiro contrato pago assinado (R$ 1.500 - R$ 3.000)", xpReward: 500, done: false },
    ],
  },
  {
    id: "social-proof",
    name: "📸 Portfólio & Prova Social (Plin & Muli)",
    rank: "A",
    description: "Estruturar vitrines e cases de impacto antes da prospecção em massa",
    lore: "Com vitrines impecáveis (Plin e Muli), a autoridade se impõe antes mesmo da proposta.",
    category: "side",
    priority: "P0",
    progress: 1,
    totalSteps: 3,
    icon: Sparkles,
    active: true,
    reward: "Autoridade inquestionável para conversão de leads",
    steps: [
      { id: "sp1", title: "Desenvolvimento do site / vitrine Plin", xpReward: 80, done: true },
      { id: "sp2", title: "Desenvolvimento do site / vitrine Muli", xpReward: 80, done: false },
      { id: "sp3", title: "Empacotamento dos 2 cases em PDF de apresentação comercial", xpReward: 100, done: false },
    ],
  },
  {
    id: "masterpumps",
    name: "🏭 Operação Master Pumps",
    rank: "S",
    description: "Cunhado → RH → proposta formal de Avaliação de Desempenho",
    lore: "A porta para o contrato corporativo industrial. Um único contrato de 80 a 150 colaboradores muda tudo.",
    category: "side",
    priority: "P1",
    progress: 1,
    totalSteps: 4,
    icon: Swords,
    active: true,
    reward: "R$ 10k-18k enterprise · Infraestrutura e servidores da Experia",
    steps: [
      { id: "mp1", title: "Alinhamento com o cunhado sobre o modelo de RH da fábrica", xpReward: 30, done: true },
      { id: "mp2", title: "Elaborar proposta de Avaliação de Desempenho automatizada", xpReward: 60, done: false },
      { id: "mp3", title: "Reunião de apresentação com a Diretoria / RH", xpReward: 100, done: false },
      { id: "mp4", title: "Contrato enterprise fechado", xpReward: 500, done: false },
    ],
  },
  {
    id: "credito",
    name: "🧹 Resgate do Crédito & Limpa-Nome",
    rank: "A",
    description: "Cartão físico liberado → Acordo Serasa via War Chest 15k",
    lore: "O Dragão do Limpa-Nome perde força a cada vitória.",
    category: "castle",
    priority: "P0",
    progress: 1,
    totalSteps: 3,
    icon: Crown,
    active: true,
    reward: "Acesso a limites altos e contas empresariais",
    steps: [
      { id: "cr1", title: "Cartão Nubank físico solicitado e conquistado", xpReward: 50, done: true },
      { id: "cr2", title: "War Chest R$ 15k acumulado para entrada simultânea", xpReward: 150, done: false },
      { id: "cr3", title: "Feirão Limpa Nome (acordo de 60-80% off quitado)", xpReward: 300, done: false },
    ],
  },
  {
    id: "casa",
    name: "🪣 Operação Base Limpa (Castelo)",
    rank: "B",
    description: "Ordem absoluta no ambiente: doações feitas, guarda-roupa ok, manutenção pendente",
    lore: "Um monarca não governa em meio ao caos. O ambiente externo reflete a clareza do intelecto.",
    category: "life",
    priority: "P1",
    progress: 3,
    totalSteps: 4,
    icon: Home,
    active: true,
    reward: "Mente desobstruída · Castelo 100% operacional",
    steps: [
      { id: "ca1", title: "Doação das roupas da mãe para brechós concluída", xpReward: 40, done: true },
      { id: "ca2", title: "Descarte do guarda-roupa amarelo e alinhamento do marrom", xpReward: 40, done: true },
      { id: "ca3", title: "Conserto do registro do chuveiro", xpReward: 30, done: true },
      { id: "ca4", title: "Conserto da bomba da caixa acoplada + Faxina profunda (R$ 250)", xpReward: 50, done: false },
    ],
  },
  {
    id: "documentos",
    name: "📄 Missão: Documentação & Mauá",
    rank: "B",
    description: "Poupatempo Mauá agendado → certidões e mapeamento habitacional",
    lore: "Autonomia burocrática necessária para contratos, viagens e bancos.",
    category: "life",
    priority: "P1",
    progress: 1,
    totalSteps: 3,
    icon: FileText,
    active: true,
    reward: "Documentação regularizada para abertura de CNPJ e contas",
    steps: [
      { id: "do1", title: "2ª via do RG agendada no Poupatempo Mauá", xpReward: 40, done: true },
      { id: "do2", title: "Mapear certidões e pasta física do apartamento", xpReward: 30, done: false },
      { id: "do3", title: "Pasta digital de documentos pessoais e societários", xpReward: 50, done: false },
    ],
  },
  {
    id: "comunicacao",
    name: "🎙️ Comunicação & Vitrine Instagram",
    rank: "B",
    description: "Reorganizar o Instagram atual como vitrine de IA Ops e automação",
    lore: "Posicionamento digital atrai os clientes que o outreach convida.",
    category: "side",
    priority: "P2",
    progress: 0,
    totalSteps: 3,
    icon: Mic,
    active: true,
    reward: "Presença digital alinhada com autoridade em IA",
    steps: [
      { id: "vz1", title: "Bio e destaques do Instagram atual reorganizados", xpReward: 30, done: false },
      { id: "vz2", title: "Post carrossel explicativo sobre IA Ops para negócios", xpReward: 40, done: false },
      { id: "vz3", title: "Gravação de vídeo demonstrando automação na prática", xpReward: 80, done: false },
    ],
  },
  {
    id: "saude",
    name: "💪 Fisiologia do Monarca",
    rank: "A",
    description: "Musculação diária, escápulas, postura ereta (1,92m · 102kg) e saúde bucal",
    lore: "A mente mais afiada é inútil sem uma carcaça capaz de suportar a intensidade.",
    category: "life",
    priority: "P1",
    progress: 1,
    totalSteps: 4,
    icon: Dumbbell,
    active: true,
    reward: "+40% de estâmina diária · Alinhamento postural",
    steps: [
      { id: "sa1", title: "Treino de força diário (foco em escápulas e mobilidade)", xpReward: 40, done: false, isHabit: true },
      { id: "sa2", title: "Consistência de sono e hidratação (3.5L água/dia)", xpReward: 30, done: false, isHabit: true },
      { id: "sa3", title: "Consulta odontológica para extração do dente podre", xpReward: 80, done: false },
      { id: "sa4", title: "30 dias consecutivos de consistência física", xpReward: 200, done: false },
    ],
  },
];

export function QuestlinesPage({ expandedId }: { expandedId?: string | null }) {
  const [questlines, setQuestlines] = useState<Questline[]>(allQuestlines);
  const [expanded, setExpanded] = useState<string | null>(expandedId ?? "experia");
  const [viewMode, setViewMode] = useState<"list" | "galaxy">("list");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (expandedId) setExpanded(expandedId);
  }, [expandedId]);

  const toggleStep = (questlineId: string, stepId: string) => {
    systemAudio.playHover();
    setQuestlines(prev => prev.map(q => {
      if (q.id !== questlineId) return q;
      const newSteps = q.steps.map(s => {
        if (s.id === stepId) {
          const nextState = !s.done;
          if (nextState) systemAudio.playLevelUp();
          return { ...s, done: nextState };
        }
        return s;
      });
      const progress = newSteps.filter(s => s.done).length;
      return { ...q, steps: newSteps, progress };
    }));
  };

  const filtered = questlines.filter(q => q.active && (filter === "all" || q.category === filter));

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* ══ HEADER ══ */}
      <div className="system-window p-6 border-system-purple/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-system-purple uppercase tracking-widest mb-1">
              <Scroll className="w-4 h-4 text-system-purple" />
              <span>[SISTEMA DE QUESTLINES // ARCO PRINCIPAL DA VIDA]</span>
            </div>
            <h2 className="text-3xl font-system text-white uppercase tracking-wider glow-shadow">
              Questlines & Galáxias
            </h2>
            <p className="text-muted-foreground font-rajdhani text-sm">
              Trilhas estratégicas de ascensão: Expéria Empire, Base Limpa, Crédito e Fisiologia.
            </p>
          </div>

          {/* Alternador de Modo: Lista vs Galáxia */}
          <div className="flex items-center gap-1.5 p-1 bg-system-void/80 border border-system-border rounded">
            <button
              onClick={() => {
                systemAudio.playHover();
                setViewMode("list");
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all",
                viewMode === "list"
                  ? "bg-system-cyan/20 border border-system-cyan text-system-cyan font-bold"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>LISTA TÁTICA</span>
            </button>
            <button
              onClick={() => {
                systemAudio.playHover();
                setViewMode("galaxy");
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all",
                viewMode === "galaxy"
                  ? "bg-system-purple/20 border border-system-purple text-system-purple font-bold shadow-[0_0_10px_rgba(138,43,226,0.3)]"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>MODO GALÁXIA 🌌</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ MODO GALÁXIA (VISUAL DE CONSTELAÇÕES) ══ */}
      {viewMode === "galaxy" && (
        <div className="system-window p-6 border-system-purple/50 bg-system-void/90 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-system-purple/30 pb-3">
            <div className="flex items-center gap-2 text-system-purple text-xs font-system tracking-wider uppercase">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>MAPA DE CONSTELAÇÕES DIMENSIONAIS</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              8 CONSTELAÇÕES ATIVAS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questlines.map((ql) => {
              const pct = Math.round((ql.progress / ql.totalSteps) * 100);
              return (
                <div
                  key={ql.id}
                  onClick={() => {
                    systemAudio.playHover();
                    setExpanded(ql.id);
                    setViewMode("list");
                  }}
                  className={cn(
                    "p-4 rounded border cursor-pointer transition-all hover:scale-[1.02]",
                    ql.rank === "S" ? "system-rank-s" : "border-system-border/60 bg-system-void/60"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-system text-sm text-white">{ql.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-system-cyan/40 text-system-cyan">
                      RANK {ql.rank}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
                    <span>{ql.progress}/{ql.totalSteps} Nódulos Iluminados</span>
                    <span className="text-system-cyan font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-system-void rounded-full overflow-hidden border border-system-border">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        ql.rank === "S" ? "bg-system-purple shadow-[0_0_8px_#8a2be2]" : "bg-system-cyan"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">
                    Clique para abrir os nódulos desta constelação →
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ MODO LISTA TÁTICA ══ */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filtered.map((questline) => {
            const isExpanded = expanded === questline.id;
            const pct = Math.round((questline.progress / questline.totalSteps) * 100);

            return (
              <div
                key={questline.id}
                className={cn(
                  "system-window transition-all duration-300 border overflow-hidden",
                  questline.rank === "S" ? "system-rank-s" : "border-system-border"
                )}
              >
                {/* Header da Questline */}
                <div
                  onClick={() => {
                    systemAudio.playHover();
                    setExpanded(isExpanded ? null : questline.id);
                  }}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded flex items-center justify-center border",
                      questline.rank === "S"
                        ? "bg-system-purple/20 border-system-purple text-system-purple"
                        : "bg-system-cyan/15 border-system-cyan/40 text-system-cyan"
                    )}>
                      <questline.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-system-cyan/40 text-system-cyan">
                          RANK {questline.rank}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {questline.priority}
                        </span>
                      </div>
                      <h3 className="font-system text-base text-white tracking-wider mt-0.5">
                        {questline.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-rajdhani">{questline.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono text-system-cyan font-bold">{pct}% Concluído</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {questline.progress}/{questline.totalSteps} etapas
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                  </div>
                </div>

                {/* Corpo Expandido com os Passos */}
                {isExpanded && (
                  <div className="p-5 border-t border-system-border/60 bg-system-void/80 space-y-3 animate-fade-in">
                    <p className="text-xs font-rajdhani text-muted-foreground italic border-l-2 border-system-cyan/40 pl-2.5">
                      {questline.lore}
                    </p>

                    <div className="space-y-2 pt-2">
                      {questline.steps.map((step) => (
                        <div
                          key={step.id}
                          onClick={() => toggleStep(questline.id, step.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded border cursor-pointer transition-all",
                            step.done
                              ? "bg-system-cyan/10 border-system-cyan/40 text-white"
                              : "bg-system-void/60 border-system-border/40 text-muted-foreground hover:border-system-cyan/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {step.done ? (
                              <CheckCircle2 className="w-4 h-4 text-system-cyan" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className={cn("text-xs font-rajdhani font-semibold", step.done && "line-through text-system-cyan")}>
                              {step.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            {step.isHabit && (
                              <span className="px-1.5 py-0.2 rounded border border-system-gold/40 text-system-gold bg-system-gold/10">
                                🔁 HÁBITO
                              </span>
                            )}
                            <span className="text-system-cyan">+{step.xpReward} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                      <span>🏆 Recompensa: {questline.reward}</span>
                      {questline.deadline && <span className="text-system-gold">{questline.deadline}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
