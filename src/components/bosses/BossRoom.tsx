import { useState } from "react";
import { Skull, Swords, Shield, Crown, ChevronDown, Plus, Minus, Flame, Heart, Brain, Wallet, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useSharedBrain } from "@/hooks/useSharedBrain";
import { systemAudio } from "@/lib/systemAudio";

export type DungeonCategory = "all" | "financial" | "physical" | "mental";

interface Boss {
  id: string;
  category: "financial" | "physical" | "mental";
  name: string;
  rank: "E" | "D" | "C" | "B" | "A" | "S";
  description: string;
  lore: string;
  totalHp: number;
  currentHp: number;
  unit: "R$" | "PTS";
  priority: "critical" | "high" | "medium" | "low";
  defeated: boolean;
  strategy: string;
}

const initialBosses: Boss[] = [
  // ── MASMORRA FINANCEIRA (Total R$ 38.000) ──
  {
    id: "iptu",
    category: "financial",
    name: "GOLEM DO IPTU",
    rank: "S",
    description: "Impostos municipais em aberto (+1 ano)",
    lore: "O Golem mais denso do castelo. Ignorá-lo virou rotina, mas a dívida ativa cobra seu preço.",
    totalHp: 12000,
    currentHp: 12000,
    unit: "R$",
    priority: "critical",
    defeated: false,
    strategy: "Acordo municipal com entrada mínima assim que entrar o primeiro caixa forte.",
  },
  {
    id: "serasa",
    category: "financial",
    name: "DRAGÃO DO LIMPA-NOME",
    rank: "S",
    description: "Serasa: Bancos e credores acumulados (R$ 17.8k)",
    lore: "Bloqueia cartões de alto limite e crédito empresarial. Derrota via Feirão com 60% a 80% de desconto.",
    totalHp: 17800,
    currentHp: 17800,
    unit: "R$",
    priority: "critical",
    defeated: false,
    strategy: "Atacar com o War Chest de R$ 15k para fechar acordo global à vista.",
  },
  {
    id: "aguaeluz",
    category: "financial",
    name: "SENHOR DAS CONTAS",
    rank: "A",
    description: "Sabesp + Enel acumuladas (+1 ano)",
    lore: "Água e luz ainda fluem por milagre. O Senhor é paciente, mas os juros continuam ativos.",
    totalHp: 3200,
    currentHp: 3200,
    unit: "R$",
    priority: "high",
    defeated: false,
    strategy: "Parcelamento com entrada simbólica após fechar os primeiros contratos de AI Ops.",
  },
  {
    id: "financiamento",
    category: "financial",
    name: "ESPECTRO DO CDHU",
    rank: "B",
    description: "Financiamento habitacional restante",
    lore: "O Castelo não é 100% liberto enquanto este espectro habitar os registros.",
    totalHp: 5000,
    currentHp: 5000,
    unit: "R$",
    priority: "medium",
    defeated: false,
    strategy: "Quitação definitiva à vista com sobra de caixa para liberação total da escritura.",
  },

  // ── MASMORRA FÍSICA ──
  {
    id: "odonto",
    category: "physical",
    name: "GOLEM ODONTOLÓGICO",
    rank: "A",
    description: "Extração do dente podre & restauração bucal",
    lore: "Infecção ou desconforto drena Mana silenciosamente. O Player precisa de dentes de titânio.",
    totalHp: 100,
    currentHp: 100,
    unit: "PTS",
    priority: "critical",
    defeated: false,
    strategy: "Agendar dentista imediatamente na primeira folga de caixa do mês.",
  },
  {
    id: "postura",
    category: "physical",
    name: "TITÃ POSTURAL & ESCÁPULAS",
    rank: "B",
    description: "Alinhamento da coluna (1,92m · 102kg) & fortalecimento",
    lore: "Um caçador de quase dois metros não pode ter postura curvada. O corpo precisa sustentar a presença.",
    totalHp: 100,
    currentHp: 65,
    unit: "PTS",
    priority: "high",
    defeated: false,
    strategy: "Treino diário de mobilidade, puxadas para escápulas e postura ereta em frente à tela.",
  },

  // ── MASMORRA MENTAL ──
  {
    id: "dopamina",
    category: "mental",
    name: "LORDE DA FALSA RECOMPENSA",
    rank: "S",
    description: "Impulsos dopaminérgicos autojustificativos",
    lore: "O sussurro insidioso que diz: 'Você produziu muito hoje, merece se afundar em distração'.",
    totalHp: 100,
    currentHp: 75,
    unit: "PTS",
    priority: "critical",
    defeated: false,
    strategy: "Gratificação adiada. Recompensas (weed, snack, tela) só são desbloqueadas via Arsenal por Gems.",
  },
];

const priorityConfig: Record<string, { color: string; label: string; hpColor: string }> = {
  critical: { color: "text-red-400", label: "CRÍTICO (RANK S)", hpColor: "bg-red-500 shadow-[0_0_10px_#ff0033]" },
  high: { color: "text-orange-400", label: "ALTO (RANK A)", hpColor: "bg-orange-400 shadow-[0_0_8px_#fb923c]" },
  medium: { color: "text-yellow-400", label: "MÉDIO (RANK B)", hpColor: "bg-yellow-400" },
  low: { color: "text-blue-400", label: "BAIXO (RANK C)", hpColor: "bg-blue-400" },
};

export function BossRoom() {
  const { realCoins } = useSharedBrain();
  const [bosses, setBosses] = useState<Boss[]>(initialBosses);
  const [activeCategory, setActiveCategory] = useState<DungeonCategory>("all");
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null);
  const [attackAmount, setAttackAmount] = useState(500);

  // Financial debts calculation (R$ 38k pool)
  const financialBosses = bosses.filter(b => b.category === "financial");
  const totalDebt = financialBosses.reduce((acc, b) => acc + b.currentHp, 0);
  const totalDebtOriginal = financialBosses.reduce((acc, b) => acc + b.totalHp, 0);
  const totalPaid = totalDebtOriginal - totalDebt;

  // War Chest 15k Attack Plan progress
  const WAR_CHEST_GOAL = 15000;
  const warChestProgress = Math.min((realCoins / WAR_CHEST_GOAL) * 100, 100);

  const filteredBosses = activeCategory === "all"
    ? bosses
    : bosses.filter(b => b.category === activeCategory);

  const attackBoss = async (bossId: string, amount: number) => {
    let bossName = "";
    let isDefeated = false;

    setBosses(prev => prev.map(boss => {
      if (boss.id === bossId) {
        const newHp = Math.max(0, boss.currentHp - amount);
        bossName = boss.name;
        isDefeated = newHp === 0;
        return { ...boss, currentHp: newHp, defeated: isDefeated };
      }
      return boss;
    }));

    if (isDefeated) {
      systemAudio.playLevelUp();
    } else {
      systemAudio.playPortalEnter();
    }

    // Persist payment/damage event
    await supabase.from("kairos_events").insert({
      event_type: "boss_attacked",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: { bossId, bossName, amount, timestamp: new Date().toISOString() },
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* ══ HEADER DO SISTEMA ══ */}
      <div className="system-window p-6 border-system-crimson/50 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-system-crimson uppercase tracking-widest mb-1">
              <Skull className="w-4 h-4 animate-pulse" />
              <span>[SISTEMA DE MASMORRAS // INSTÂNCIAS DE COMBATE]</span>
            </div>
            <h2 className="text-3xl font-system text-white tracking-wider glow-crimson uppercase">
              The Boss Room
            </h2>
            <p className="text-muted-foreground font-rajdhani text-sm mt-1">
              Masmorras da Vida Real: Financeira (38k em aberto), Física e Mental. Cada golpe é um avanço concreto.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-card/90 border border-system-crimson/40 px-4 py-2.5 rounded text-center">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">Dívida Total em Aberto</p>
              <p className="font-mono text-2xl text-system-crimson font-bold">
                R$ {totalDebt.toLocaleString("pt-BR")}
              </p>
            </div>
            {totalPaid > 0 && (
              <div className="bg-card/90 border border-system-gold/40 px-4 py-2.5 rounded text-center">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Dano Causado (Pago)</p>
                <p className="font-mono text-2xl text-system-gold font-bold">
                  R$ {totalPaid.toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ══ PLANO DE ATAQUE: WAR CHEST R$ 15.000 ══ */}
        <div className="mt-6 pt-5 border-t border-system-crimson/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-system-cyan" />
              <span className="text-xs font-system text-system-cyan tracking-wider uppercase">
                ESTRATÉGIA DO SISTEMA: WAR CHEST DE R$ 15.000
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              R$ {realCoins.toLocaleString("pt-BR")} acumulados de R$ 15.000 ({Math.round(warChestProgress)}%)
            </span>
          </div>

          <div className="h-3 w-full bg-system-void/80 rounded-full overflow-hidden border border-system-cyan/30 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-system-cyan via-system-purple to-system-gold rounded-full transition-all duration-1000 shadow-[0_0_12px_#00f0ff]"
              style={{ width: `${warChestProgress}%` }}
            />
          </div>

          <p className="text-[11px] font-mono text-muted-foreground mt-2">
            💡 <strong className="text-white">Plano Tático:</strong> Ao acumular R$ 15.000 líquidos, lançar ataque conjunto nos acordos Serasa, IPTU e concessionárias à vista (descontos de 60% a 80%), quitando os R$ 38k de uma vez só sem refinanciamentos longos.
          </p>
        </div>
      </div>

      {/* ══ CATEGORY TABS ══ */}
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-system-border p-1.5 rounded">
        {[
          { id: "all", label: "TODOS OS CHEFÕES", icon: Swords },
          { id: "financial", label: "💰 MASMORRA FINANCEIRA (R$ 38k)", icon: Wallet },
          { id: "physical", label: "⚔️ MASMORRA FÍSICA", icon: Heart },
          { id: "mental", label: "🧠 MASMORRA MENTAL", icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                systemAudio.playHover();
                setActiveCategory(tab.id as DungeonCategory);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-mono rounded transition-all",
                isActive
                  ? "bg-system-cyan/20 border border-system-cyan text-system-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══ BOSS GRID ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBosses.map((boss, index) => {
          const hpPercentage = (boss.currentHp / boss.totalHp) * 100;
          const isExpanded = expandedBoss === boss.id;
          const prio = priorityConfig[boss.priority];

          return (
            <div
              key={boss.id}
              className={cn(
                "system-window p-5 transition-all duration-300 animate-fade-in border",
                boss.rank === "S" ? "system-rank-s" : "border-system-border",
                boss.defeated && "opacity-50 grayscale border-muted"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded flex items-center justify-center border",
                    boss.defeated
                      ? "bg-system-gold/20 border-system-gold text-system-gold"
                      : boss.rank === "S"
                      ? "bg-system-purple/20 border-system-purple text-system-purple"
                      : "bg-system-crimson/20 border-system-crimson text-system-crimson"
                  )}>
                    {boss.defeated ? (
                      <Crown className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Skull className={cn("w-6 h-6", prio.color)} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 border border-system-cyan/40 text-system-cyan rounded">
                        RANK {boss.rank}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {boss.category === "financial" ? "FINANCEIRO" : boss.category === "physical" ? "FÍSICO" : "MENTAL"}
                      </span>
                    </div>
                    <h3 className={cn(
                      "font-system text-base tracking-wider mt-0.5",
                      boss.defeated ? "text-system-gold line-through" : "text-white"
                    )}>
                      {boss.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-rajdhani">{boss.description}</p>
                  </div>
                </div>

                <span className={cn("text-[10px] font-mono uppercase font-bold", prio.color)}>
                  {prio.label}
                </span>
              </div>

              {/* Lore / Descrição */}
              <p className="text-xs text-muted-foreground italic mb-4 border-l-2 border-system-cyan/40 pl-2.5 py-0.5 font-rajdhani">
                {boss.lore}
              </p>

              {/* Barra de Vida (HP) */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-muted-foreground uppercase text-[10px]">HP DA MASMORRA</span>
                  <span className={cn("font-bold", boss.defeated ? "text-system-gold" : "text-system-crimson")}>
                    {boss.unit === "R$" ? `R$ ${boss.currentHp.toLocaleString("pt-BR")}` : `${boss.currentHp} PTS`} / {boss.unit === "R$" ? `R$ ${boss.totalHp.toLocaleString("pt-BR")}` : `${boss.totalHp} PTS`}
                  </span>
                </div>
                <div className="h-3 w-full bg-system-void rounded-full overflow-hidden border border-border/50">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      boss.defeated ? "bg-system-gold" : prio.hpColor
                    )}
                    style={{ width: `${hpPercentage}%` }}
                  />
                </div>
              </div>

              {/* Estratégia de Combate */}
              <div className="mb-4 px-3 py-2 bg-system-void/80 border border-system-border/60 rounded">
                <p className="text-xs text-muted-foreground font-rajdhani">
                  <span className="text-system-cyan font-mono font-bold">ESTRATÉGIA:</span> {boss.strategy}
                </p>
              </div>

              {/* Ações de Ataque */}
              {!boss.defeated && (
                <div>
                  <button
                    onClick={() => {
                      systemAudio.playHover();
                      setExpandedBoss(isExpanded ? null : boss.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-system-cyan hover:text-white bg-system-cyan/10 border border-system-cyan/30 rounded transition-all"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>{boss.unit === "R$" ? "REGISTRAR PAGAMENTO / DANO" : "REGISTRAR EVOLUÇÃO"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-3 bg-system-void/90 border border-system-border rounded animate-fade-in">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAttackAmount(a => Math.max(boss.unit === "R$" ? 50 : 10, a - (boss.unit === "R$" ? 50 : 10)))}
                          className="p-1.5 rounded bg-muted hover:bg-muted/80 text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 text-center font-mono text-lg text-white font-bold">
                          {boss.unit === "R$" ? `R$ ${attackAmount.toLocaleString("pt-BR")}` : `${attackAmount} PTS`}
                        </div>
                        <button
                          onClick={() => setAttackAmount(a => a + (boss.unit === "R$" ? 50 : 10))}
                          className="p-1.5 rounded bg-muted hover:bg-muted/80 text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => attackBoss(boss.id, attackAmount)}
                        className="w-full mt-3 py-2.5 rounded bg-system-crimson hover:bg-system-crimson/80 text-white font-system text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_#ff0033]"
                      >
                        <Swords className="w-4 h-4" />
                        EXECUTAR ATAQUE! (-{boss.unit === "R$" ? `R$ ${attackAmount.toLocaleString("pt-BR")}` : `${attackAmount} PTS`})
                      </button>
                    </div>
                  )}
                </div>
              )}

              {boss.defeated && (
                <div className="text-center py-2 bg-system-gold/10 border border-system-gold/30 rounded">
                  <p className="text-system-gold font-system text-xs tracking-widest">✦ INIMIGO DERROTADO ✦</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
