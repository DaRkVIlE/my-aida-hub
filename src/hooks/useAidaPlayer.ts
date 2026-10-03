/**
 * AIDA Hub — useAidaPlayer Hook v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Gerencia o estado central do jogador/aluno no Hub.
 * 
 * v2: Usa Bearer token (localStorage) em vez de cookies cross-domain.
 * Detecta autenticação lendo o token local — sem chamada de rede para verificar.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  getManaProfile,
  getLeaderboard,
  getStoredToken,
  getStoredUser,
  clearAuthSession,
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

  // Dados do usuário
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
  logout: () => void;
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
      // 1. Verificação rápida: há token no localStorage?
      const token = getStoredToken();
      if (!token) {
        setHubState('unauthenticated');
        return;
      }

      // 2. Tenta pegar usuário do cache local primeiro (sem rede)
      const cachedUser = getStoredUser();
      let userData: LibreChatUser;

      if (cachedUser) {
        userData = cachedUser;
        setUser(userData);
      } else {
        // Fallback: busca via API com Bearer token
        userData = await getCurrentUser();
        setUser(userData);
      }

      const userId = userData._id || userData.id;
      if (!userId) throw new Error('User ID not found');

      // 3. Perfil MANA + Leaderboard em paralelo (não bloqueantes)
      const [manaData, lbData] = await Promise.allSettled([
        getManaProfile(userId),
        getLeaderboard(),
      ]);

      if (manaData.status === 'fulfilled') {
        setProfile(manaData.value);
      } else {
        console.warn('[useAidaPlayer] MANA profile not found — may be first session');
      }

      if (lbData.status === 'fulfilled') {
        setLeaderboard(lbData.value);
      }

      setHubState('ready');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Token inválido ou expirado → limpa sessão local
      if (msg.includes('401') || msg.includes('403') || msg.includes('not_logged')) {
        clearAuthSession();
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

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    setProfile(null);
    setLeaderboard([]);
    setHubState('unauthenticated');
  }, []);

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
    logout,
  };
}

export { AIDA_CHAT_URL };
