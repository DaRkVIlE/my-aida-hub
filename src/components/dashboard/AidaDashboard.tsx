/**
 * AidaDashboard — Command Center do aluno AIDA.
 * Exibe XP, MANA, Streak, Rank e métricas de progresso.
 * Versão AIDA do Dashboard.tsx do GABLAB OS.
 */

import { Zap, Flame, Trophy, Target, TrendingUp, ChevronRight, BookOpen } from "lucide-react";
import { RANK_CONFIG, PERSONAS, type PersonaId } from "@/lib/manaApi";
import { AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

const RANK_ORDER: Array<{ rank: string; label: string; xp: number }> = [
  { rank: 'E', label: 'Iniciante',    xp: 0      },
  { rank: 'D', label: 'Dedicado',     xp: 500    },
  { rank: 'C', label: 'Consistente',  xp: 1500   },
  { rank: 'B', label: 'Breakout',     xp: 4000   },
  { rank: 'A', label: 'Avançado',     xp: 10000  },
  { rank: 'S', label: 'Soberano',     xp: 25000  },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

function StatCard({ icon, label, value, sub, accent = 'text-emerald-400' }: StatCardProps) {
  return (
    <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500">{icon}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</span>
      </div>
      <div className={cn("text-2xl font-black", accent)}>{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

export function AidaDashboard({ player }: { player: AidaPlayerState }) {
  const {
    displayName, totalXp, playerRank, rankConfig, xpProgress,
    currentMana, maxMana, manaPercent, streakDays, tier, personaIdeal,
    nivelDiagnosticado,
  } = player;

  const persona = personaIdeal ? PERSONAS[personaIdeal as PersonaId] : null;
  const currentRankIdx = RANK_ORDER.findIndex(r => r.rank === playerRank);
  const nextRank = RANK_ORDER[currentRankIdx + 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── HERO ── */}
      <div className="bg-gray-900/70 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-white">{displayName}</h1>
              <span className="text-xl">{rankConfig.emoji}</span>
              {tier === 'pro' && <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">PRO ✨</span>}
            </div>
            <p className={cn("text-sm font-semibold mt-0.5", rankConfig.color)}>{rankConfig.label}</p>
            {nivelDiagnosticado && (
              <p className="text-xs text-gray-500 mt-0.5">Nível CEFR diagnóstico: {nivelDiagnosticado}</p>
            )}
          </div>
        </div>

        {/* XP Progress to next rank */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{rankConfig.label}</span>
            {nextRank ? (
              <span>Rank {nextRank.rank}: {nextRank.xp.toLocaleString('pt-BR')} XP</span>
            ) : (
              <span>🔴 Rank máximo!</span>
            )}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">{totalXp.toLocaleString('pt-BR')} XP acumulados</div>
        </div>
      </div>

      {/* ── STAT GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap size={14} />}
          label="MANA"
          value={`${currentMana}/${maxMana}`}
          sub={currentMana > 0 ? "Energia disponível" : "Recarregue praticando"}
          accent="text-emerald-400"
        />
        <StatCard
          icon={<Flame size={14} />}
          label="Streak"
          value={`${streakDays}🔥`}
          sub={streakDays >= 7 ? "Em chamas!" : streakDays >= 3 ? "Ótimo ritmo" : "Não quebre!"}
          accent="text-amber-400"
        />
        <StatCard
          icon={<Trophy size={14} />}
          label="XP Total"
          value={totalXp.toLocaleString('pt-BR')}
          sub="pontos de experiência"
          accent="text-purple-400"
        />
        <StatCard
          icon={<Target size={14} />}
          label="Rank"
          value={`${rankConfig.emoji} ${playerRank}`}
          sub={rankConfig.label}
          accent={rankConfig.color}
        />
      </div>

      {/* MANA bar explícita */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-300">⚡ Barra de Energia MANA</span>
          <span className="text-xs text-emerald-400 font-mono">{currentMana} / {maxMana}</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              manaPercent > 50 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
              manaPercent > 20 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
              "bg-gradient-to-r from-red-600 to-red-400"
            )}
            style={{ width: `${manaPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {currentMana === maxMana
            ? "🔋 MANA cheio — ótimo momento para praticar!"
            : currentMana === 0
            ? "❌ MANA esgotado — pratique para recarregar"
            : `🔋 ${maxMana - currentMana} pontos usados`}
        </p>
      </div>

      {/* ── Persona Ideal & CTA ── */}
      {persona && (
        <div
          className="bg-gray-900/60 border rounded-2xl p-5 backdrop-blur-sm"
          style={{ borderColor: persona.glowColor.replace('0.3', '0.3') }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{persona.emoji}</span>
              <div>
                <div className="font-bold text-white text-sm">Persona Ideal: {persona.fullName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{persona.desc}</div>
              </div>
            </div>
            <a
              href={`${AIDA_CHAT_URL}${persona.chatPath}`}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0"
            >
              💬 Praticar agora
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ── Roadmap de Ranks ── */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
          <TrendingUp size={14} /> Trilha de Evolução
        </h3>
        <div className="space-y-2">
          {RANK_ORDER.map((r, i) => {
            const cfg = RANK_CONFIG[r.rank as keyof typeof RANK_CONFIG];
            const isCurrent = r.rank === playerRank;
            const isCompleted = i < currentRankIdx;

            return (
              <div
                key={r.rank}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors",
                  isCurrent ? "bg-emerald-500/10 border border-emerald-500/30" :
                  isCompleted ? "opacity-50" : "opacity-30"
                )}
              >
                <span className="text-lg">{cfg.emoji}</span>
                <div className="flex-1">
                  <div className={cn("text-xs font-bold", isCurrent ? cfg.color : "text-gray-500")}>
                    Rank {r.rank} — {r.label}
                  </div>
                  <div className="text-[10px] text-gray-700">{r.xp.toLocaleString('pt-BR')} XP</div>
                </div>
                {isCurrent && <span className="text-[10px] text-emerald-400 font-bold">← VOCÊ</span>}
                {isCompleted && <span className="text-[10px] text-gray-600">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
