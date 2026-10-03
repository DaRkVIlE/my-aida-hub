/**
 * AidaPortalHub — Os 5 Portais da Fluência (Metodologia MANA)
 * 
 * Cada portal representa uma dimensão de maestria na Montanha B2,
 * habitado por um Guardião nativo para treino conversacional de alto impacto.
 * Superior ao Duolingo: sem exercícios mecânicos, apenas imersão contextual ativa.
 */

import { useState } from "react";
import { 
  Mic, 
  Compass, 
  Gamepad2, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Flame, 
  CheckCircle2 
} from "lucide-react";
import { RANK_CONFIG, buildPortalUrl } from "@/lib/manaApi";
import type { AidaPlayerState } from "@/hooks/useAidaPlayer";
import { cn } from "@/lib/utils";

export interface FluencyPortal {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  cefrLevel: string;
  focus: string;
  guardianName: string;
  guardianRole: string;
  guardianEmoji: string;
  guardianModel: string;
  accentColor: string;
  borderGlow: string;
  bgGradient: string;
  isProOnly: boolean;
  xpRewardPerSession: number;
  mechanics: string[];
}

export const FLUENCY_PORTALS: FluencyPortal[] = [
  {
    id: "portal-1-unfreeze",
    number: 1,
    title: "Descongelamento & Oralidade",
    subtitle: "Destrave a boca e mate o filtro de tradução",
    cefrLevel: "A1 → A2",
    focus: "Fluência reativa, ritmo de fala diário e superação do medo de errar.",
    guardianName: "Jordan",
    guardianRole: "Amigo de NYC & Parça de Séries",
    guardianEmoji: "🎬",
    guardianModel: "jordan",
    accentColor: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]",
    bgGradient: "from-emerald-950/20 via-gray-900/60 to-gray-950/80",
    isProOnly: false,
    xpRewardPerSession: 30,
    mechanics: ["Baby Mode Adaptativo", "Recasting Natural", "Sem Julgamento"]
  },
  {
    id: "portal-2-digital-speed",
    number: 2,
    title: "Velocidade & Cultura Digital",
    subtitle: "Raciocínio instantâneo sem parar para pensar",
    cefrLevel: "A2 → B1",
    focus: "Callouts rápidos, streams, gírias da internet e respostas reflexas.",
    guardianName: "Zack",
    guardianRole: "Streamer & E-sports Coach",
    guardianEmoji: "🎮",
    guardianModel: "zack",
    accentColor: "text-purple-400",
    borderGlow: "hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.2)]",
    bgGradient: "from-purple-950/20 via-gray-900/60 to-gray-950/80",
    isProOnly: false,
    xpRewardPerSession: 35,
    mechanics: ["Reflex Action", "Internet Slang", "Discord DM Energy"]
  },
  {
    id: "portal-3-survival-travel",
    number: 3,
    title: "Sobrevivência & Viagem Real",
    subtitle: "Não passe aperto em nenhum lugar do mundo",
    cefrLevel: "B1 → B2",
    focus: "Imigração, hotéis, restaurantes, aeroportos e resolução de perrengues.",
    guardianName: "Miles",
    guardianRole: "Viajante Global & Survival Guide",
    guardianEmoji: "✈️",
    guardianModel: "miles",
    accentColor: "text-amber-400",
    borderGlow: "hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]",
    bgGradient: "from-amber-950/20 via-gray-900/60 to-gray-950/80",
    isProOnly: true,
    xpRewardPerSession: 45,
    mechanics: ["Simulações Situacionais", "Cenários de Pressão", "Roleplay Imersivo"]
  },
  {
    id: "portal-4-business-voice",
    number: 4,
    title: "Voz Executiva & Negócios",
    subtitle: "Postura e autoridade para o mercado global",
    cefrLevel: "B2 Pleno",
    focus: "Reuniões em call, negociações com gringos, e-mails executivos e pitches.",
    guardianName: "Alexandra",
    guardianRole: "Senior Business English Coach",
    guardianEmoji: "💼",
    guardianModel: "alexandra",
    accentColor: "text-blue-400",
    borderGlow: "hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]",
    bgGradient: "from-blue-950/20 via-gray-900/60 to-gray-950/80",
    isProOnly: true,
    xpRewardPerSession: 50,
    mechanics: ["Corporate Recasting", "Micro-Cenários de Negócios", "Vocabulário de Liderança"]
  },
  {
    id: "portal-5-mastery-intellect",
    number: 5,
    title: "Densidade Lexical & Fluência Nativa",
    subtitle: "Expressão sofisticada e profundidade de ideias",
    cefrLevel: "B2+ → C1",
    focus: "Debate de ideias complexas, filosofia, livros e argumentação refinada.",
    guardianName: "Prof. Hayes",
    guardianRole: "Linguista & Master Conversationalist",
    guardianEmoji: "📚",
    guardianModel: "hayes",
    accentColor: "text-cyan-400",
    borderGlow: "hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]",
    bgGradient: "from-cyan-950/20 via-gray-900/60 to-gray-950/80",
    isProOnly: true,
    xpRewardPerSession: 60,
    mechanics: ["Elevação Lexical", "Expansão de Repertório", "Conexão Lógica Fina"]
  }
];

export function AidaPortalHub({ player }: { player: AidaPlayerState }) {
  const { displayName, avatarInitial, totalXp, playerRank, rankConfig, xpProgress, currentMana, maxMana, streakDays, isPro, personaIdeal } = player;

  const handleEnterPortal = (portal: FluencyPortal) => {
    if (portal.isProOnly && !isPro) {
      // Redireciona para a triagem/upgrade (dentro do Chat)
      const AIDA_CHAT_URL = (import.meta.env.VITE_AIDA_CHAT_URL as string) || 'https://aida.experiasolutions.com.br';
      window.location.href = `${AIDA_CHAT_URL}/triagem`;
      return;
    }
    // SSO Handoff: abre o Chat já logado e com a persona selecionada
    window.location.href = buildPortalUrl(portal.guardianModel);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* ══ HERO DO JOGADOR ══ */}
      <div className="bg-gray-900/70 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-2xl text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] flex-shrink-0">
              {avatarInitial}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">{displayName}</h1>
                <span className="text-xl">{rankConfig.emoji}</span>
                <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full border bg-white/5", rankConfig.color, rankConfig.borderColor)}>
                  {rankConfig.label}
                </span>
                {isPro && (
                  <span className="text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    PRO ✨
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Jornada ativa na <span className="text-emerald-400 font-semibold">Montanha B2</span> • {totalXp.toLocaleString('pt-BR')} XP acumulados
              </p>
            </div>
          </div>

          {/* Quick HUD Counters */}
          <div className="flex items-center gap-6 bg-black/40 border border-white/5 px-5 py-3 rounded-2xl self-start md:self-auto">
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Energia MANA</div>
              <div className="text-lg font-black text-emerald-400 flex items-center gap-1">
                ⚡ {currentMana}<span className="text-xs text-gray-600">/{maxMana}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Streak Ativo</div>
              <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                🔥 {streakDays}d
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar to next rank */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5 font-medium">
            <span>Evolução de Rank</span>
            <span>{Math.round(xpProgress)}% concluído</span>
          </div>
          <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ══ TÍTULO DOS PORTAIS ══ */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Sistema de Imersão AIDA
        </div>
        <h2 className="text-2xl font-black text-white mt-1">Os 5 Portais da Fluência</h2>
        <p className="text-gray-400 text-sm mt-1 max-w-2xl">
          Ao invés de exercícios mecânicos de tradução, cada portal treina uma engrenagem neurocognitiva diferente do seu inglês.
        </p>
      </div>

      {/* ══ GRID DOS PORTAIS DA FLUÊNCIA ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FLUENCY_PORTALS.map((portal) => {
          const isLocked = portal.isProOnly && !isPro;
          const isIdeal = portal.guardianModel === personaIdeal;

          return (
            <div
              key={portal.id}
              onClick={() => handleEnterPortal(portal)}
              className={cn(
                "rounded-3xl border p-6 transition-all duration-300 backdrop-blur-md cursor-pointer relative overflow-hidden flex flex-col justify-between group",
                `bg-gradient-to-br ${portal.bgGradient}`,
                isLocked 
                  ? "border-white/5 opacity-60 hover:opacity-85" 
                  : `border-white/10 ${portal.borderGlow}`
              )}
            >
              {/* Badges superiores */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                    PORTAL {portal.number}
                  </span>
                  <span className={cn("text-xs font-bold font-mono", portal.accentColor)}>
                    {portal.cefrLevel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isIdeal && (
                    <span className="text-[10px] font-black bg-emerald-500 text-black px-2.5 py-0.5 rounded-full">
                      ⭐ RECOMENDADO
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> PRO
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-500">
                    +{portal.xpRewardPerSession} XP
                  </span>
                </div>
              </div>

              {/* Informações Principais */}
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  {portal.subtitle}
                </p>
                <p className="text-xs text-gray-400/80 mt-3 leading-relaxed">
                  {portal.focus}
                </p>

                {/* Tags de Mecânica */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {portal.mechanics.map((m, idx) => (
                    <span key={idx} className="text-[10px] bg-black/40 text-gray-400 border border-white/5 px-2 py-0.5 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guardião & Ação */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                    {portal.guardianEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      Guardião: {portal.guardianName}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {portal.guardianRole}
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-transform group-hover:translate-x-1",
                  isLocked ? "text-amber-400" : portal.accentColor
                )}>
                  <span>{isLocked ? "Desbloquear" : "Entrar"}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
