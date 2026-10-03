/**
 * AidaLeaderboard — Ranking Global dos Alunos AIDA
 */

import { Trophy, TrendingUp } from "lucide-react";
import { RANK_CONFIG, type PlayerRank } from "@/lib/manaApi";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

const MEDALS = ['🥇', '🥈', '🥉'];

export function AidaLeaderboard({ player }: { player: AidaPlayerState }) {
  const { leaderboard, user } = player;
  const myUserId = user?._id || user?.id;

  if (!leaderboard.length) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-gray-500">Nenhum aluno no ranking ainda.</p>
        <p className="text-gray-600 text-sm mt-2">Seja o primeiro a praticar!</p>
      </div>
    );
  }

  const myPosition = leaderboard.findIndex(e => e.userId === myUserId);

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" /> Ranking Global
        </h2>
        {myPosition >= 0 && (
          <div className="text-xs text-gray-500">
            Sua posição: <span className="text-emerald-400 font-bold">#{myPosition + 1}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 20).map((entry, i) => {
          const rankCfg = RANK_CONFIG[entry.playerRank as PlayerRank] || RANK_CONFIG.E;
          const isMe = entry.userId === myUserId;
          const medal = MEDALS[i];

          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors",
                isMe
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : i < 3
                  ? "bg-gray-800/60 border-white/8"
                  : "bg-gray-900/40 border-white/5"
              )}
            >
              {/* Position */}
              <span className="text-lg w-7 text-center flex-shrink-0">
                {medal || <span className="text-gray-500 text-sm font-mono">#{i + 1}</span>}
              </span>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-black text-black flex-shrink-0">
                {(entry.name || 'A').charAt(0).toUpperCase()}
              </div>

              {/* Name & Rank */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-sm font-bold truncate", isMe ? "text-emerald-300" : "text-white")}>
                    {entry.name || entry.username || 'Aluno'}
                    {isMe && <span className="text-[10px] text-emerald-500 font-normal ml-1">(você)</span>}
                  </span>
                  {entry.tier === 'pro' && (
                    <span className="text-[9px] text-amber-400 border border-amber-500/30 px-1 rounded font-bold flex-shrink-0">PRO</span>
                  )}
                </div>
                <div className={cn("text-[11px] mt-0.5", rankCfg.color)}>{rankCfg.label}</div>
              </div>

              {/* XP & Streak */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-black text-emerald-400">{(entry.totalXp || 0).toLocaleString('pt-BR')}</div>
                <div className="text-[10px] text-gray-600">{entry.streakDays}🔥 {rankCfg.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length > 20 && (
        <p className="text-center text-xs text-gray-600">Mostrando top 20 de {leaderboard.length} alunos</p>
      )}
    </div>
  );
}
