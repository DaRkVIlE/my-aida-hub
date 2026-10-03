/**
 * AidaCharSheet — Ficha do Aluno AIDA
 * Mostra o perfil completo: dados, habilidades por persona, radar chart de progresso.
 */

import { BookOpen, Zap, Flame, Trophy, Target, TrendingUp, Star } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { PERSONAS, RANK_CONFIG, type PersonaId } from "@/lib/manaApi";
import { AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

const NIVEL_LABELS: Record<string, string> = {
  P1: 'P1 — Iniciante Absoluto (A1)',
  P2: 'P2 — Elementar (A2)',
  P3: 'P3 — Intermediário (B1)',
  P4: 'P4 — Intermediário-Superior (B2)',
  P5: 'P5 — Avançado (C1+)',
};

// Habilidades passivas desbloqueadas por persona e nível
const PASSIVE_SKILLS = [
  { persona: 'jordan',    name: 'Listening Nativo',     desc: 'Decodifica expressões do inglês americano coloquial sem esforço',    icon: '🎬', minRank: 'E' },
  { persona: 'zack',      name: 'Internet Fluency',      desc: 'Entende memes, callouts e slang de gaming sem tradução',              icon: '🎮', minRank: 'E' },
  { persona: 'alexandra', name: 'Business Voice',        desc: 'Apresenta e negocia em inglês com postura executiva',                 icon: '💼', minRank: 'D' },
  { persona: 'miles',     name: 'Travel Survival',       desc: 'Resolve qualquer situação no exterior com confiança',                 icon: '✈️', minRank: 'D' },
  { persona: 'hayes',     name: 'Lexical Density',       desc: 'Usa vocabulário rico e variado naturalmente',                        icon: '📚', minRank: 'C' },
  { persona: null,        name: 'Streak Warrior',        desc: 'Mantém consistência mesmo em dias difíceis',                         icon: '🔥', minRank: 'D' },
  { persona: null,        name: 'MANA Efficiency',       desc: 'Extrai o máximo de aprendizado de cada sessão',                      icon: '⚡', minRank: 'C' },
  { persona: null,        name: 'Soberano da Fluência',  desc: 'Pensa diretamente em inglês sem camada de tradução',                 icon: '👑', minRank: 'S' },
];

const RANK_ORDER = ['E', 'D', 'C', 'B', 'A', 'S'];

function isRankUnlocked(playerRank: string, minRank: string): boolean {
  return RANK_ORDER.indexOf(playerRank) >= RANK_ORDER.indexOf(minRank);
}

export function AidaCharSheet({ player }: { player: AidaPlayerState }) {
  const {
    displayName, avatarInitial, totalXp, playerRank, rankConfig,
    streakDays, currentMana, maxMana, tier, personaIdeal, nivelDiagnosticado,
    isPro,
  } = player;

  const personaObj = personaIdeal ? PERSONAS[personaIdeal as PersonaId] : null;

  // Radar chart data — baseado nos portais acessados e rank
  const radarData = [
    { subject: 'Conversação',    value: Math.min(100, totalXp / 10),       fullMark: 100 },
    { subject: 'Vocabulário',    value: Math.min(100, streakDays * 5),     fullMark: 100 },
    { subject: 'Listening',      value: Math.min(100, totalXp / 15),       fullMark: 100 },
    { subject: 'Escrita',        value: Math.min(100, totalXp / 20),       fullMark: 100 },
    { subject: 'Confiança',      value: Math.min(100, streakDays * 4 + 20), fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── HERO DA FICHA ── */}
      <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              {avatarInitial}
            </div>
            <div className="absolute -bottom-2 -right-2 text-xl">{rankConfig.emoji}</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-white">{displayName}</h1>
              {tier === 'pro' && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">PRO ✨</span>
              )}
            </div>
            <p className={cn("text-sm font-semibold mt-1", rankConfig.color)}>{rankConfig.label}</p>
            {nivelDiagnosticado && (
              <p className="text-xs text-gray-500 mt-1">{NIVEL_LABELS[nivelDiagnosticado] || nivelDiagnosticado}</p>
            )}
            {personaObj && (
              <p className="text-xs text-gray-500 mt-0.5">Persona ideal: {personaObj.emoji} {personaObj.fullName}</p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="text-center">
                <div className="text-base font-black text-emerald-400">{totalXp.toLocaleString('pt-BR')}</div>
                <div className="text-[10px] text-gray-600">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-amber-400">{streakDays}🔥</div>
                <div className="text-[10px] text-gray-600">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-purple-400">{currentMana}/{maxMana}</div>
                <div className="text-[10px] text-gray-600">MANA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RADAR CHART ── */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
          <Star size={14} /> Mapa de Habilidades
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Radar
                name="Aluno"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">Baseado no seu XP e streak acumulados</p>
      </div>

      {/* ── HABILIDADES PASSIVAS ── */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
          <Zap size={14} /> Habilidades Passivas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PASSIVE_SKILLS.map((skill, i) => {
            const unlocked = isRankUnlocked(playerRank, skill.minRank);
            const lockedByPro = skill.persona && ['alexandra', 'miles', 'hayes'].includes(skill.persona) && !isPro;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border",
                  unlocked && !lockedByPro
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "opacity-35 border-white/5 bg-gray-800/30"
                )}
              >
                <span className="text-xl flex-shrink-0">{skill.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {skill.name}
                    {!unlocked && <span className="text-[9px] text-gray-600 font-normal">Rank {skill.minRank}+</span>}
                    {lockedByPro && <span className="text-[9px] text-amber-600 font-bold">PRO</span>}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{skill.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="text-center py-2">
        <a
          href={AIDA_CHAT_URL}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-xl transition-colors text-sm"
        >
          💬 Evoluir agora no Chat
        </a>
      </div>
    </div>
  );
}
