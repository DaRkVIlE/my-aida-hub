import { Trophy, Star, CheckCircle2, Lock, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAidaPlayer } from "@/hooks/useAidaPlayer";

interface SeasonTier {
  level: number;
  xpReq: number;
  title: string;
  reward: string;
  badge: string;
  portalUnlock?: string;
}

const SEASON_TIERS: SeasonTier[] = [
  { level: 1, xpReq: 0,     title: "Descongelamento",      reward: "Acesso Imediato ao Portal Jordan", badge: "🎬", portalUnlock: "Jordan" },
  { level: 2, xpReq: 500,   title: "Aceleração Auditiva",  reward: "Acesso ao Portal Gaming Zack",     badge: "🎮", portalUnlock: "Zack" },
  { level: 3, xpReq: 1500,  title: "Ponte Internacional",  reward: "Acesso ao Portal Miles Viagens",   badge: "✈️", portalUnlock: "Miles" },
  { level: 4, xpReq: 4000,  title: "Voz Executiva",        reward: "Acesso ao Portal Alexandra (Business)", badge: "💼", portalUnlock: "Alexandra" },
  { level: 5, xpReq: 10000, title: "Imersão Acadêmica",    reward: "Acesso ao Prof. Hayes (Fluência)", badge: "📚", portalUnlock: "Hayes" },
  { level: 6, xpReq: 25000, title: "Soberania B2/C1",      reward: "Certificação AIDA & Rank Soberano", badge: "👑" },
];

export function BattlePassPage() {
  const { totalXp, playerRank, rankConfig } = useAidaPlayer();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Season 1 — A Montanha B2
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Trilha do Season Pass</h2>
          <p className="text-gray-400 text-sm mt-1">
            Cada conversa destrava novos níveis de fluência, personas e recompensas exclusivas.
          </p>
        </div>

        {/* Current XP & Rank */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-xl">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-semibold uppercase">Seu Progresso</div>
            <div className="text-lg font-black text-emerald-400">{totalXp.toLocaleString('pt-BR')} XP</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-lg text-black shadow-lg">
            {rankConfig.emoji}
          </div>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-3">
        {SEASON_TIERS.map((tier) => {
          const isUnlocked = totalXp >= tier.xpReq;
          const progressToTier = Math.min(100, Math.max(0, (totalXp / (tier.xpReq || 1)) * 100));

          return (
            <div
              key={tier.level}
              className={cn(
                "rounded-2xl border p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm",
                isUnlocked 
                  ? "bg-gray-900/60 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                  : "bg-gray-950/40 border-white/5 opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
                  isUnlocked ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-white/5 border border-white/5 grayscale"
                )}>
                  {tier.badge}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tier {tier.level}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-emerald-400 font-bold">{tier.xpReq.toLocaleString('pt-BR')} XP</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{tier.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{tier.reward}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Desbloqueado
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
                    <Lock className="w-3.5 h-3.5" /> Bloqueado ({tier.xpReq - totalXp} XP faltam)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
