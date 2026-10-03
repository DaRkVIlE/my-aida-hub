/**
 * AidaPortalHub — Os 5 Portais de Imersão da AIDA
 * Versão AIDA do PortalHub3D do GABLAB OS.
 * Exibe os 5 portais de persona com estado FREE/PRO e navega para o chat.
 */

import { useState } from "react";
import { PERSONAS, type PersonaId } from "@/lib/manaApi";
import { RANK_CONFIG } from "@/lib/manaApi";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";

const FREE_PERSONAS: PersonaId[] = ['jordan', 'zack'];
const PRO_PERSONAS: PersonaId[]  = ['alexandra', 'miles', 'hayes'];

interface PortalCardProps {
  personaId: PersonaId;
  isIdeal: boolean;
  isLocked: boolean;
  onClick: () => void;
}

function PortalCard({ personaId, isIdeal, isLocked, onClick }: PortalCardProps) {
  const [hovered, setHovered] = useState(false);
  const persona = PERSONAS[personaId];

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "relative rounded-2xl border p-5 transition-all duration-300",
        "bg-gray-900/60 backdrop-blur-sm",
        isLocked
          ? "opacity-40 grayscale cursor-not-allowed border-white/5"
          : `cursor-pointer border-white/8 hover:border-opacity-60`,
        hovered && !isLocked ? "scale-[1.02]" : "scale-100",
      ].join(" ")}
      style={
        hovered && !isLocked
          ? { borderColor: persona.glowColor.replace('0.3', '0.6'), boxShadow: `0 8px 40px ${persona.glowColor}` }
          : { borderColor: 'rgba(255,255,255,0.06)' }
      }
    >
      {/* Ideal badge */}
      {isIdeal && (
        <div className="absolute -top-2.5 left-4 bg-emerald-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full">
          ⭐ IDEAL
        </div>
      )}

      {/* Lock badge */}
      {isLocked && (
        <div className="absolute -top-2.5 right-4 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          🔒 PRO
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Emoji portal */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{
            background: `radial-gradient(circle, ${persona.glowColor}, transparent)`,
            border: `1px solid ${persona.glowColor.replace('0.3', '0.4')}`,
          }}
        >
          {persona.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`font-bold text-base text-white`}>{persona.fullName}</div>
          <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{persona.desc}</div>

          {!isLocked && (
            <div className={`text-xs font-semibold mt-2 ${persona.color}`}>
              {hovered ? "Entrar no portal →" : "Disponível"}
            </div>
          )}
          {isLocked && (
            <div className="text-xs text-gray-700 mt-2">Upgrade para PRO para desbloquear</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── XP / MANA summary bar no topo ─────────────────────────────────────────────
function PlayerSummaryBar({ player }: { player: AidaPlayerState }) {
  const { displayName, avatarInitial, totalXp, playerRank, rankConfig, xpProgress, currentMana, maxMana, manaPercent, streakDays, tier } = player;

  return (
    <div className="bg-gray-900/70 border border-white/8 rounded-2xl p-4 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-lg font-black text-black flex-shrink-0">
          {avatarInitial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{displayName}</span>
            <span className="text-base">{rankConfig.emoji}</span>
            <span className={`text-xs font-semibold ${rankConfig.color}`}>{rankConfig.label}</span>
            {tier === 'pro' && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">PRO ✨</span>
            )}
          </div>

          {/* XP bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">{totalXp.toLocaleString('pt-BR')} XP</span>
          </div>
        </div>

        {/* Stats compactos */}
        <div className="flex items-center gap-4 text-center">
          <div>
            <div className="text-sm font-black text-emerald-400">{currentMana}<span className="text-gray-600 text-xs">/{maxMana}</span></div>
            <div className="text-[10px] text-gray-500">MANA</div>
          </div>
          <div>
            <div className="text-sm font-black text-amber-400">{streakDays}🔥</div>
            <div className="text-[10px] text-gray-500">Streak</div>
          </div>
          <a
            href={`${AIDA_CHAT_URL}`}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            💬 Ir ao Chat
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Portal Hub ───────────────────────────────────────────────────────────
export function AidaPortalHub({ player }: { player: AidaPlayerState }) {
  const { isPro, personaIdeal } = player;

  const handlePortalClick = (personaId: PersonaId) => {
    const persona = PERSONAS[personaId];
    window.location.href = `${AIDA_CHAT_URL}${persona.chatPath}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Barra de status do player */}
      <PlayerSummaryBar player={player} />

      {/* Header do Hub */}
      <div>
        <h2 className="text-xl font-black text-white">🌀 Portais de Imersão</h2>
        <p className="text-sm text-gray-500 mt-1">
          Escolha um portal para iniciar sua sessão de inglês. Cada portal é uma persona diferente com foco único.
        </p>
      </div>

      {/* Grid de Portais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(PERSONAS) as PersonaId[]).map((personaId) => {
          const isProPortal = PRO_PERSONAS.includes(personaId);
          const isLocked = isProPortal && !isPro;
          const isIdeal = personaId === personaIdeal;

          return (
            <PortalCard
              key={personaId}
              personaId={personaId}
              isIdeal={isIdeal}
              isLocked={isLocked}
              onClick={() => handlePortalClick(personaId)}
            />
          );
        })}
      </div>

      {/* PRO upgrade CTA para usuários free */}
      {!isPro && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center">
          <p className="text-amber-300 font-bold text-sm mb-1">🔓 Desbloqueie todos os 5 Portais com o PRO</p>
          <p className="text-gray-500 text-xs mb-4">Alexandra, Miles e Prof. Hayes estão disponíveis no plano PRO.</p>
          <a
            href={`${AIDA_CHAT_URL}/triagem`}
            className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Fazer o Diagnóstico MANA →
          </a>
        </div>
      )}
    </div>
  );
}
