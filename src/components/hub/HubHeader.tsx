/**
 * HubHeader — Header do AIDA Hub
 * Barra superior com avatar, MANA compacto e botão "Ir ao Chat"
 */

import { Zap, LogOut } from "lucide-react";
import { AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

interface HubHeaderProps {
  player: AidaPlayerState;
  sectionLabel: string;
}

export function HubHeader({ player, sectionLabel }: HubHeaderProps) {
  const { displayName, avatarInitial, playerRank, rankConfig, currentMana, maxMana, manaPercent, streakDays } = player;

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-md border-b border-white/6">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Section label */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate">{sectionLabel}</h2>
        </div>

        {/* Compact player stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* MANA mini bar */}
          <div className="hidden sm:flex items-center gap-2">
            <Zap size={12} className="text-emerald-400 flex-shrink-0" />
            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  manaPercent > 50 ? "bg-emerald-400" : manaPercent > 20 ? "bg-amber-400" : "bg-red-500"
                )}
                style={{ width: `${manaPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-mono">{currentMana}/{maxMana}</span>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 font-bold">
            {streakDays}🔥
          </div>

          {/* Rank badge */}
          <span className="text-base">{rankConfig.emoji}</span>

          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-black text-black">
            {avatarInitial}
          </div>

          {/* Go to chat */}
          <a
            href={AIDA_CHAT_URL}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            💬 Chat
          </a>
        </div>
      </div>
    </header>
  );
}
