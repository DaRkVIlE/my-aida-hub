/**
 * AidaHubLayout — Shell principal do AIDA Hub.
 * Gerencia autenticação, estado do jogador e navegação entre seções.
 * Adaptado do Index.tsx do GABLAB OS / pgt-ui para o contexto AIDA.
 */

import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAidaPlayer, AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";
import { LoginGate } from "./LoginGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { HubHeader } from "@/components/hub/HubHeader";
import { AidaPortalHub } from "@/components/hub/AidaPortalHub";
import { AidaDashboard } from "@/components/dashboard/AidaDashboard";
import { AidaCharSheet } from "@/components/charsheet/AidaCharSheet";
import { AidaLeaderboard } from "@/components/leaderboard/AidaLeaderboard";
import { DailyQuestTracker } from "@/components/quests/DailyQuestTracker";
import { BattlePassPage } from "@/components/battlepass/BattlePassPage";
import { AdminStudio } from "@/components/studio/AdminStudio";

const SECTIONS: Record<string, string> = {
  hub:         "🌀 Portais de Imersão",
  dashboard:   "⚡ Command Center",
  charsheet:   "📋 Ficha do Aluno",
  quests:      "🎯 Quests Diárias",
  leaderboard: "🏆 Ranking",
  battlepass:  "🎖️ Battle Pass",
  studio:      "🔧 Admin Studio",
};

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function HubSkeleton() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl animate-pulse mx-auto">
          ⚡
        </div>
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-800 rounded-full mx-auto animate-pulse" />
          <div className="h-2 w-24 bg-gray-800/60 rounded-full mx-auto animate-pulse" />
        </div>
        <p className="text-gray-600 text-xs">Carregando seu perfil MANA...</p>
      </div>
    </div>
  );
}

// ── Error Banner ──────────────────────────────────────────────────────────────
function HubError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-white font-bold">Erro ao carregar o Hub</h2>
        <p className="text-gray-400 text-sm font-mono">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onRetry} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-5 py-2 rounded-xl text-sm transition-colors">
            Tentar novamente
          </button>
          <a href={AIDA_CHAT_URL} className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
            Ir ao Chat
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function AidaHubLayout() {
  const player = useAidaPlayer();
  const [activeSection, setActiveSection] = useState("hub");

  // Gates de estado
  if (player.hubState === 'loading') return <HubSkeleton />;
  if (player.hubState === 'unauthenticated') return <LoginGate />;
  if (player.hubState === 'error') return <HubError message={player.error!} onRetry={player.refetch} />;

  const sectionLabel = SECTIONS[activeSection] || activeSection;

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar de navegação (reutilizado do pgt-ui) */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header com dados do player */}
        <HubHeader
          player={player}
          sectionLabel={sectionLabel}
        />

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeSection === 'hub'         && <AidaPortalHub player={player} />}
          {activeSection === 'dashboard'   && <AidaDashboard player={player} />}
          {activeSection === 'charsheet'   && <AidaCharSheet player={player} />}
          {activeSection === 'quests'      && <DailyQuestTracker />}
          {activeSection === 'leaderboard' && <AidaLeaderboard player={player} />}
          {activeSection === 'battlepass'  && <BattlePassPage />}
          {activeSection === 'studio'      && player.isAdmin && <AdminStudio />}
          {activeSection === 'studio'      && !player.isAdmin && (
            <div className="flex items-center justify-center h-64 text-gray-600">
              🔒 Acesso restrito a administradores
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
