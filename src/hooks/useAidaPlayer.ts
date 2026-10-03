/**
 * AIDA Hub — useAidaPlayer Hook
 * Substitui o useSharedBrain.ts do GABLAB OS.
 * Busca o usuário logado no LibreChat e seu perfil MANA,
 * expondo todos os dados necessários para os componentes do Hub.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  getManaProfile,
  getLeaderboard,
  RANK_CONFIG,
  getXpProgress,
  type LibreChatUser,
  type ManaProfile,
  type LeaderboardEntry,
  type PlayerRank,
} from '../lib/manaApi';

export type HubState = 'loading' | 'unauthenticated' | 'ready' | 'error';

export interface AidaPlayerState {
  // Estado
  hubState: HubState;
  error: string | null;

  // Dados do usuário LibreChat
  user: LibreChatUser | null;

  // Dados MANA
  profile: ManaProfile | null;
  leaderboard: LeaderboardEntry[];

  // Derivados (computed)
  totalXp: number;
  playerRank: PlayerRank;
  rankConfig: typeof RANK_CONFIG[PlayerRank];
  xpProgress: number;          // 0-100 para a barra de XP até o próximo rank
  currentMana: number;
  maxMana: number;
  manaPercent: number;         // 0-100
  streakDays: number;
  tier: 'free' | 'pro';
  isPro: boolean;
  isAdmin: boolean;
  personaIdeal: string | null;
  nivelDiagnosticado: string | null;
  displayName: string;
  avatarInitial: string;

  // Ações
  refetch: () => Promise<void>;
}

const AIDA_CHAT_URL = (import.meta.env.VITE_AIDA_CHAT_URL as string) || 'https://aida.experiasolutions.com.br';

export function useAidaPlayer(): AidaPlayerState {
  const [hubState, setHubState] = useState<HubState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LibreChatUser | null>(null);
  const [profile, setProfile] = useState<ManaProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchAll = useCallback(async () => {
    setHubState('loading');
    setError(null);
    try {
      // 1. Autenticação via cookie de sessão
      const userData = await getCurrentUser();
      setUser(userData);

      const userId = userData._id || userData.id;
      if (!userId) throw new Error('User ID not found in session');

      // 2. Perfil MANA + Leaderboard em paralelo
      const [manaData, lbData] = await Promise.allSettled([
        getManaProfile(userId),
        getLeaderboard(),
      ]);

      if (manaData.status === 'fulfilled') setProfile(manaData.value);
      else console.warn('[useAidaPlayer] MANA profile not found — may be first session');

      if (lbData.status === 'fulfilled') setLeaderboard(lbData.value);

      setHubState('ready');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('401') || msg.includes('403') || msg.includes('not_logged')) {
        setHubState('unauthenticated');
      } else {
        setHubState('error');
        setError(msg);
      }
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Valores derivados ──
  const totalXp = profile?.totalXp ?? 0;
  const playerRank = (profile?.playerRank ?? 'E') as PlayerRank;
  const rankConfig = RANK_CONFIG[playerRank];
  const xpProgress = getXpProgress(totalXp, playerRank);
  const currentMana = profile?.currentMana ?? 0;
  const maxMana = profile?.maxMana ?? 10;
  const manaPercent = maxMana > 0 ? Math.min(100, (currentMana / maxMana) * 100) : 0;
  const streakDays = profile?.streakDays ?? 0;
  const tier = profile?.tier ?? 'free';
  const isPro = tier === 'pro';
  const isAdmin = user?.role === 'ADMIN';
  const personaIdeal = profile?.personaIdeal ?? null;
  const nivelDiagnosticado = profile?.nivelDiagnosticado ?? null;
  const displayName = user?.name || user?.username || 'Aluno';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return {
    hubState, error,
    user, profile, leaderboard,
    totalXp, playerRank, rankConfig, xpProgress,
    currentMana, maxMana, manaPercent,
    streakDays, tier, isPro, isAdmin,
    personaIdeal, nivelDiagnosticado,
    displayName, avatarInitial,
    refetch: fetchAll,
  };
}

export { AIDA_CHAT_URL };
