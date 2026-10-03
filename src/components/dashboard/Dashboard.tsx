import { useState, useEffect } from "react";
import { CurrentQuestPanel } from "./CurrentQuestPanel";
import { DataMatrix } from "./DataMatrix";
import { useKAIROS } from "@/hooks/useKAIROS";
import { useSharedBrain } from "@/hooks/useSharedBrain";
import { systemAudio } from "@/lib/systemAudio";
import {
  Cpu, Activity, Flame, Target, Zap, TrendingUp,
  AlertCircle, ChevronRight, Calendar, Bot, Loader2,
  Wifi, WifiOff, Skull, Shield, RotateCcw, Trophy, Clock, Sun, Moon, Swords
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onQuestlineClick?: (questlineId: string) => void;
}

// Daily blocks for 07h-23h routine
const DAILY_SCHEDULE = [
  { time: "07:00 - 08:30", name: "Ritual Matinal & Ativação", type: "ritual", icon: Sun },
  { time: "09:00 - 13:00", name: "Raid 1: AI Ops & Expéria MVP", type: "deepwork", icon: Zap },
  { time: "14:00 - 18:00", name: "Raid 2: Outreach Orgânico & Aulas", type: "deepwork", icon: Swords },
  { time: "19:00 - 21:00", name: "Arena: Treino de Força & Recuperação", type: "arena", icon: Shield },
  { time: "22:00 - 23:00", name: "Santuário: Check-in Noturno & Reset", type: "sanctuary", icon: Moon },
];

export function Dashboard({ onQuestlineClick }: DashboardProps = {}) {
  const brain = useSharedBrain();
  const {
    xp, focoGems, streak, realCoins, availableAttributePoints, level, growSeeds,
    skyrosScore, skyrosScoreColor, skyrosScoreBorderColor, streakBroken,
    revenueProgress, revenueGoal, questsCompletedToday, bossesCompleted, bossesTotal,
  } = brain;
  const kairos = useKAIROS(30000);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const seasonStart = new Date("2026-04-10");
  const seasonDay = Math.max(1, Math.floor((Date.now() - seasonStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  // Bosses from roadmap.md via API
  const activeBosses = kairos.bosses.filter(b => !b.status.includes("✅"));
  const completedBosses = kairos.bosses.filter(b => b.status.includes("✅"));

  // ── BADGES ──
  const badges = [
    { id: "first-blood", emoji: "🔥", name: "First Blood", desc: "Completou ≥1 quest", unlocked: xp > 0 },
    { id: "deep-worker", emoji: "⚡", name: "Deep Worker", desc: "Streak ≥ 3 dias", unlocked: streak >= 3 },
    { id: "boss-slayer", emoji: "💀", name: "Boss Slayer", desc: "≥1 P0 eliminado", unlocked: completedBosses.length > 0 || bossesCompleted > 0 },
    { id: "first-coin", emoji: "💰", name: "First Coin", desc: "Primeiro R$ faturado", unlocked: realCoins > 0 },
    { id: "war-machine", emoji: "🏆", name: "War Machine", desc: "Streak ≥ 7 dias", unlocked: streak >= 7 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'text-red-400 border-red-500/40 bg-red-500/5';
      case 'P1': return 'text-orange-400 border-orange-500/40 bg-orange-500/5';
      case 'P2': return 'text-yellow-400 border-yellow-500/40 bg-yellow-500/5';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getStatusEmoji = (status: string) => {
    if (status.includes('🔥')) return '🔥';
    if (status.includes('✅')) return '✅';
    if (status.includes('🧊')) return '🧊';
    if (status.includes('🔧')) return '🔧';
    return '📋';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ══ LOSS AVERSION ALERT ══ */}
      {streakBroken && (
        <div className="system-window p-4 border-2 border-red-500/60 bg-red-500/10 animate-pulse">
          <div className="flex items-center gap-3">
            <Skull className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-mono text-sm text-red-400 font-bold uppercase tracking-wider">[ALERTA DO SISTEMA] 💀 STREAK QUEBRADO · -50 XP</p>
              <p className="text-xs text-red-400/80 font-mono">Consistência perdida. Reconstrua imediatamente hoje ou afunde.</p>
            </div>
          </div>
        </div>
      )}

      {/* ══ SOLO LEVELING WAR BANNER / COMMAND CENTER ══ */}
      <div className="system-window p-6 border-system-cyan/40 relative overflow-hidden">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest text-system-cyan uppercase px-2 py-0.5 border border-system-cyan/40 bg-system-cyan/10 rounded">
                [SISTEMA DE COMANDO // PROTOCOLO S-RANK]
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                DIA {seasonDay} DA TEMPORADA
              </span>
              <Activity className="w-4 h-4 text-system-cyan animate-pulse" />
              {kairos.backendOnline ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-system-cyan">
                  <Wifi className="w-3 h-3" /> NEURAL LINK ONLINE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <WifiOff className="w-3 h-3" /> STANDALONE LOCAL
                </span>
              )}
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-system text-white tracking-widest uppercase glow-hunter">
                SHADOW MONARCH GABRIEL
              </h2>
              <p className="text-muted-foreground font-rajdhani text-sm mt-0.5">
                Arquiteto de Inteligência Artificial · Nível {level} · Sincronia Neural 99.4%
              </p>
            </div>

            {/* Badges de Estado */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-system-crimson/15 border border-system-crimson/50 shadow-[0_0_12px_rgba(255,0,51,0.3)] animate-pulse">
                <Flame className="w-4 h-4 text-system-crimson" />
                <span className="text-xs font-system text-system-crimson tracking-wider">
                  ⚡ MODO MONEY RUSH ATIVO
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-system-purple/15 border border-system-purple/40 text-system-purple">
                <Target className="w-4 h-4" />
                <span className="text-xs font-mono">
                  {kairos.isolationActive ? '🔴 DEEP WORK / ISOLATION' : 'ALVO: 1º CLIENTE AI OPS ESTE MÊS'}
                </span>
              </div>
            </div>

            {/* Stat Pills */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <StatPill icon={Flame} value={`${streak}d`} label="streak" color={streakBroken ? "text-red-400" : "text-system-gold"} borderColor="border-system-gold/30" bgColor="bg-system-gold/10" />
              <StatPill icon={Zap} value={`${focoGems} GEMS`} label="mana" color="text-system-cyan" borderColor="border-system-cyan/30" bgColor="bg-system-cyan/10" />
              <StatPill icon={Target} value={`R$ ${realCoins.toLocaleString("pt-BR")}`} label="faturado" color="text-green-400" borderColor="border-green-500/30" bgColor="bg-green-500/10" />
              {availableAttributePoints > 0 && (
                <StatPill icon={TrendingUp} value={`${availableAttributePoints} pts`} label="skill pts" color="text-system-purple" borderColor="border-system-purple/30" bgColor="bg-system-purple/10" />
              )}
            </div>

            {/* ══ REVENUE PROGRESS BAR (Meta R$ 40k) ══ */}
            <div className="pt-2 w-full max-w-lg">
              <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-muted-foreground uppercase text-[10px]">META DA SEASON: R$ 40.000</span>
                <span className="text-system-cyan font-bold">
                  R$ {realCoins.toLocaleString("pt-BR")} / R$ {revenueGoal.toLocaleString("pt-BR")} ({Math.round(revenueProgress)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-system-void rounded-full overflow-hidden border border-system-cyan/30 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-system-cyan via-system-purple to-system-gold rounded-full transition-all duration-1000 shadow-[0_0_10px_#00f0ff]"
                  style={{ width: `${revenueProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* ══ SKYROS SCORE ORB ══ */}
          <div className="hidden xl:flex flex-col items-center justify-center flex-shrink-0">
            <div className={cn(
              "w-32 h-32 border-2 rounded-full flex items-center justify-center relative transition-all duration-500 shadow-[0_0_20px_rgba(0,240,255,0.15)]",
              skyrosScoreBorderColor,
              skyrosScore <= 30 && "animate-pulse"
            )}>
              <div className="text-center z-10">
                <span className={cn("font-system text-3xl block font-bold", skyrosScoreColor)}>{skyrosScore}</span>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">SKYROS</div>
                <div className={cn("text-[9px] font-mono font-bold uppercase", skyrosScoreColor)}>
                  {skyrosScore >= 80 ? "ELITE RANK" : skyrosScore >= 50 ? "EM RISCO" : "CRÍTICO"}
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-system-void/80" />
                <circle
                  cx="64" cy="64" r="58"
                  stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * (skyrosScore / 100))}
                  className={cn("transition-all duration-1000", skyrosScoreColor)}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ══ PROTOCOLO DO DIA: TIMELINE 07H - 23H ══ */}
      <div className="system-window p-4 border-system-border/60">
        <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-system-cyan" />
            <span className="text-xs font-system text-white tracking-wider uppercase">
              PROTOCOLO DIÁRIO DE COMBATE (07H — 23H)
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">
            HORÁRIO ATUAL: {String(currentHour).padStart(2, '0')}:00
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {DAILY_SCHEDULE.map((slot) => {
            const Icon = slot.icon;
            return (
              <div
                key={slot.time}
                className={cn(
                  "p-3 rounded border transition-all text-left",
                  slot.type === "deepwork"
                    ? "bg-system-cyan/10 border-system-cyan/30 text-white"
                    : slot.type === "sanctuary"
                    ? "bg-system-purple/10 border-system-purple/30 text-white"
                    : "bg-system-void/60 border-system-border/40 text-muted-foreground"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-system-cyan">{slot.time}</span>
                  <Icon className="w-3.5 h-3.5 text-system-cyan" />
                </div>
                <div className="text-xs font-rajdhani font-bold leading-tight">{slot.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ SPRINT / OPERAÇÕES ATIVAS ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OP 1 */}
        <div
          className="system-window p-4 border-system-cyan/30 hover:border-system-cyan transition-all cursor-pointer group"
          onClick={() => {
            systemAudio.playHover();
            onQuestlineClick?.("experia");
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-system-cyan" />
              <span className="font-system text-xs uppercase tracking-wide text-white group-hover:text-system-cyan transition-colors">
                OP1: Experia MVP (AI Ops)
              </span>
            </div>
            <span className="font-mono text-xs text-system-cyan font-bold">EM ANDAMENTO</span>
          </div>
          <div className="h-1.5 w-full bg-system-void rounded-full overflow-hidden border border-system-cyan/30">
            <div className="h-full bg-system-cyan rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-2">
            Foco: Outreach online + Tráfego orgânico BR · 1º Cliente AI Ops este mês (sem cold calls)
          </p>
        </div>

        {/* OP 2 */}
        <div
          className="system-window p-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer group"
          onClick={() => {
            systemAudio.playHover();
            onQuestlineClick?.("english");
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="font-system text-xs uppercase tracking-wide text-white group-hover:text-green-400 transition-colors">
                OP2: Aulas de Inglês AIDA
              </span>
            </div>
            <span className="font-mono text-xs text-green-400 font-bold">CAIXA RÁPIDO</span>
          </div>
          <div className="h-1.5 w-full bg-system-void rounded-full overflow-hidden border border-green-500/30">
            <div className="h-full bg-green-400 rounded-full" style={{ width: "30%" }} />
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-2">
            Meta: R$ 3.000 / mês · Alunos particulares com método de IA
          </p>
        </div>
      </div>

      {/* ══ BOSS FIGHTS — Dynamic from roadmap.md ══ */}
      <div className="system-window p-6 border-system-crimson/30 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skull className="w-5 h-5 text-system-crimson animate-pulse" />
            <div>
              <h3 className="font-system text-base text-white uppercase tracking-wider">
                Boss Fights Ativas (P0)
              </h3>
              <p className="text-xs text-muted-foreground font-rajdhani">
                {kairos.backendOnline
                  ? `${activeBosses.length} chefões sincronizados com o roadmap`
                  : 'Sincronizado via memória local'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                systemAudio.playHover();
                kairos.refetch();
              }}
              className="p-1.5 rounded border border-system-border hover:border-system-cyan text-muted-foreground hover:text-system-cyan transition-colors"
              title="Sincronizar roadmap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {kairos.loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 text-system-cyan animate-spin mr-2" />
            <span className="text-xs text-muted-foreground font-mono">Consultando base neural...</span>
          </div>
        ) : activeBosses.length === 0 ? (
          <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-system-cyan" />
            <span className="font-mono text-xs">Área limpa de ameaças críticas imediatas! 🏆</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeBosses.map((boss, i) => (
              <div
                key={boss.id}
                className="flex items-center gap-4 p-3.5 rounded border border-system-crimson/20 bg-system-crimson/5 hover:border-system-crimson/40 transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 text-xl">{getStatusEmoji(boss.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-[10px] font-mono font-bold px-2 py-0.2 rounded border', getPriorityColor(boss.priority))}>
                      {boss.priority}
                    </span>
                    <span className="text-xs text-white font-mono">{boss.project}</span>
                  </div>
                  <p className="text-sm text-foreground leading-tight font-rajdhani">{boss.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ DATA MATRIX ══ */}
      <DataMatrix
        skyrosScore={skyrosScore}
        streak={streak}
        xp={xp}
        realCoins={realCoins}
        focoGems={focoGems}
        growSeeds={growSeeds}
        questsCompletedToday={questsCompletedToday}
        bossesCompleted={bossesCompleted}
        bossesTotal={bossesTotal}
        revenueGoal={revenueGoal}
      />

      {/* Main Content Quest Panel */}
      <div className="w-full">
        <CurrentQuestPanel />
      </div>

      {/* ══ BADGES / CONQUISTAS ══ */}
      <div className="system-window p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-system-gold" />
          <div>
            <h3 className="font-system text-base text-white uppercase tracking-wider">Conquistas do Caçador</h3>
            <p className="text-xs text-muted-foreground font-mono">{badges.filter(b => b.unlocked).length}/{badges.length} desbloqueadas</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded border transition-all",
                badge.unlocked
                  ? "bg-system-gold/10 border-system-gold/40 shadow-[0_0_12px_rgba(255,183,3,0.15)]"
                  : "bg-muted/5 border-border/30 opacity-30 grayscale"
              )}
            >
              <span className="text-lg">{badge.emoji}</span>
              <div>
                <p className={cn("text-xs font-mono font-bold", badge.unlocked ? "text-system-gold" : "text-muted-foreground")}>
                  {badge.name}
                </p>
                <p className="text-[9px] text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon, value, label, color, borderColor, bgColor
}: {
  icon: any;
  value: string;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded border", borderColor, bgColor)}>
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <span className={cn("text-xs font-mono font-bold", color)}>{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    </div>
  );
}
