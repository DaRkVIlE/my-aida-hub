/**
 * AIDA Hub — MANA API Client
 * Consome os endpoints /api/mana/* e /api/user do LibreChat (my-aida-agents-hub).
 * Substitui completamente o gameApi.ts baseado em Supabase.
 *
 * BASE_URL: configurado via VITE_AIDA_API_URL (env var)
 * Default: https://aida.experiasolutions.com.br
 */

const BASE_URL = (import.meta.env.VITE_AIDA_API_URL as string) || 'https://aida.experiasolutions.com.br';

// ─── Tipos (mapeados do Gamification.js do LibreChat) ─────────────────────────

export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type PlayerTier = 'free' | 'pro';
export type NivelDiagnosticado = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type PersonaId = 'jordan' | 'alexandra' | 'miles' | 'zack' | 'hayes';

export interface ManaProfile {
  _id: string;
  user: string;
  totalXp: number;
  currentXp: number;
  playerRank: PlayerRank;
  currentMana: number;
  maxMana: number;
  tier: PlayerTier;
  streakDays: number;
  nivelDiagnosticado: NivelDiagnosticado | null;
  personaIdeal: PersonaId | null;
  createdAt: string;
  updatedAt: string;
}

export interface LibreChatUser {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  username?: string;
  totalXp: number;
  playerRank: PlayerRank;
  streakDays: number;
  tier: PlayerTier;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // envia cookies de sessão do LibreChat
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[manaApi] ${res.status} ${res.statusText} — ${path}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Retorna o usuário logado via cookie de sessão do LibreChat */
export async function getCurrentUser(): Promise<LibreChatUser> {
  return apiFetch<LibreChatUser>('/api/user');
}

// ─── Perfil MANA ──────────────────────────────────────────────────────────────

/** Retorna o perfil MANA completo de um aluno */
export async function getManaProfile(userId: string): Promise<ManaProfile> {
  return apiFetch<ManaProfile>(`/api/mana/profile/${userId}`);
}

/** Retorna o ranking global dos alunos */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>('/api/mana/leaderboard');
}

/** Lista todos os alunos (requer ADMIN ou x-admin-key) */
export async function getStudents(adminKey?: string): Promise<ManaProfile[]> {
  return apiFetch<ManaProfile[]>('/api/mana/students', {
    headers: {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
    },
  });
}

/** Promove aluno de Free → Pro (requer ADMIN) */
export async function upgradeStudent(userId: string, adminKey: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/mana/upgrade', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify({ userId }),
  });
}

// ─── Helpers de Rank ─────────────────────────────────────────────────────────

export const RANK_CONFIG: Record<PlayerRank, {
  emoji: string;
  label: string;
  color: string;
  borderColor: string;
  xpThreshold: number;
  xpNext: number | null;
}> = {
  E: { emoji: '⚪', label: 'Rank E — Iniciante',    color: 'text-gray-400',   borderColor: 'border-gray-500/30',   xpThreshold: 0,     xpNext: 500    },
  D: { emoji: '🟢', label: 'Rank D — Dedicado',     color: 'text-mana-400',   borderColor: 'border-mana-500/30',   xpThreshold: 500,   xpNext: 1500   },
  C: { emoji: '🔵', label: 'Rank C — Consistente',  color: 'text-blue-400',   borderColor: 'border-blue-500/30',   xpThreshold: 1500,  xpNext: 4000   },
  B: { emoji: '🟣', label: 'Rank B — Breakout',     color: 'text-purple-400', borderColor: 'border-purple-500/30', xpThreshold: 4000,  xpNext: 10000  },
  A: { emoji: '🟠', label: 'Rank A — Avançado',     color: 'text-amber-400',  borderColor: 'border-amber-500/30',  xpThreshold: 10000, xpNext: 25000  },
  S: { emoji: '🔴', label: 'Rank S — Soberano',     color: 'text-red-400',    borderColor: 'border-red-500/30',    xpThreshold: 25000, xpNext: null   },
};

export const PERSONAS: Record<PersonaId, {
  emoji: string;
  name: string;
  fullName: string;
  desc: string;
  color: string;
  glowColor: string;
  chatPath: string;
}> = {
  jordan:    { emoji: '🎬', name: 'Jordan',    fullName: 'Jordan — NYC',          desc: 'Conversas do dia a dia & cultura americana', color: 'text-emerald-400', glowColor: 'rgba(16,185,129,0.3)',  chatPath: '/?model=jordan'    },
  alexandra: { emoji: '💼', name: 'Alexandra', fullName: 'Alexandra — Business',  desc: 'Inglês corporativo & negociações reais',      color: 'text-blue-400',    glowColor: 'rgba(59,130,246,0.3)', chatPath: '/?model=alexandra' },
  miles:     { emoji: '✈️', name: 'Miles',     fullName: 'Miles — Viagens',       desc: 'Sobrevivência no exterior & viagens',        color: 'text-amber-400',   glowColor: 'rgba(245,158,11,0.3)', chatPath: '/?model=miles'     },
  zack:      { emoji: '🎮', name: 'Zack',      fullName: 'Zack — Gaming',         desc: 'Games, streaming & cultura da internet',     color: 'text-purple-400',  glowColor: 'rgba(139,92,246,0.3)', chatPath: '/?model=zack'      },
  hayes:     { emoji: '📚', name: 'Prof. Hayes', fullName: 'Prof. Hayes',         desc: 'Vocabulário avançado & fluência real',        color: 'text-cyan-400',    glowColor: 'rgba(6,182,212,0.3)',  chatPath: '/?model=hayes'     },
};

export function getXpProgress(totalXp: number, rank: PlayerRank): number {
  const cfg = RANK_CONFIG[rank];
  if (!cfg.xpNext) return 100;
  const xpInRank = totalXp - cfg.xpThreshold;
  const xpRange = cfg.xpNext - cfg.xpThreshold;
  return Math.min(100, Math.max(0, (xpInRank / xpRange) * 100));
}
