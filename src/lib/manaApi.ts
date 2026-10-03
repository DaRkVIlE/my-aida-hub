/**
 * AIDA Hub — MANA API Client v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Consome os endpoints /api/mana/* e /api/user do LibreChat (my-aida-agents-hub).
 * 
 * ESTRATÉGIA DE AUTH (v2 — cross-domain safe):
 *   - Ao invés de cookies (bloqueados por Third-Party Cookie Policy),
 *     usa `Authorization: Bearer <token>` guardado no localStorage.
 *   - O Hub faz login direto via POST /api/auth/hub-login e guarda o JWT.
 *   - Todas as requisições subsequentes enviam o header Authorization.
 *   - Para entrar no Chat, usa o SSO redirect /start/:persona?t=<token>.
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

// ─── Token Storage (localStorage — cross-domain safe) ────────────────────────

const TOKEN_KEY = 'aida_hub_token';
const USER_KEY = 'aida_hub_user';

export function saveAuthSession(token: string, user: LibreChatUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): LibreChatUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Bearer token — cross-domain safe, imune a Third-Party Cookie Policy
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[manaApi] ${res.status} ${res.statusText} — ${path}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface HubLoginResponse {
  token: string;
  user: LibreChatUser;
}

/**
 * Login direto do Hub — sem cookie, sem cross-domain.
 * Guarda o JWT e o usuário no localStorage.
 */
export async function hubLogin(email: string, password: string): Promise<HubLoginResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/hub-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Credenciais inválidas.');
  }

  const data: HubLoginResponse = await res.json();
  saveAuthSession(data.token, data.user);
  return data;
}

/** Retorna o usuário da sessão ativa (localStorage). Não faz chamada à API. */
export async function getCurrentUser(): Promise<LibreChatUser> {
  const stored = getStoredUser();
  if (stored) return stored;
  // Fallback: tentar via Bearer se tiver token mas não user no cache
  return apiFetch<LibreChatUser>('/api/user');
}

/**
 * Constrói a URL SSO para entrar no Chat com uma persona já selecionada.
 * O Chat valida o token, seta cookies de sessão e redireciona para /c/new.
 */
export function buildPortalUrl(persona: string): string {
  const token = getStoredToken();
  const base = (import.meta.env.VITE_AIDA_CHAT_URL as string) || 'https://aida.experiasolutions.com.br';
  if (!token) return `${base}/login`;
  return `${base}/start/${persona}?t=${encodeURIComponent(token)}`;
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

/** Lista todos os alunos (requer ADMIN) */
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

// ─── Meta Agente AIDA (Tutora & Mentora Mestra) ───────────────────────────────

export interface TutorChatResponse {
  reply: string;
}

export interface TutorRecommendation {
  recommendedPortal: string;
  guardian: string;
  rationale: string;
  dailyAction: string;
}

export interface MentorHandoffDossier {
  studentId: string;
  studentName?: string;
  tier: string;
  rank: string;
  streak: number;
  totalXp: number;
  diagnosedLevel?: string;
  activeChunks?: string[];
  weaknesses?: string[];
  recommendedBossRaid?: string;
  suggestedSessionAgenda?: string[];
}

/** Conversa em tempo real com o Meta Agente AIDA (Tutora Mestra) */
export async function sendTutorMessage(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  userId?: string
): Promise<TutorChatResponse> {
  return apiFetch<TutorChatResponse>('/api/mana/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history, userId }),
  });
}

/** Retorna a recomendação diária da Tutora AIDA para o aluno */
export async function getTutorRecommendation(userId: string): Promise<TutorRecommendation> {
  return apiFetch<TutorRecommendation>(`/api/mana/tutor/recommendation/${userId}`);
}

/** Retorna o Dossiê Pedagógico para a aula presencial individual com Gabe */
export async function getMentorHandoff(userId: string, adminKey?: string): Promise<MentorHandoffDossier> {
  return apiFetch<MentorHandoffDossier>(`/api/mana/mentor-handoff/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
    },
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
}> = {
  jordan:    { emoji: '🎬', name: 'Jordan',    fullName: 'Jordan — NYC',          desc: 'Conversas do dia a dia & cultura americana', color: 'text-emerald-400', glowColor: 'rgba(16,185,129,0.3)'  },
  alexandra: { emoji: '💼', name: 'Alexandra', fullName: 'Alexandra — Business',  desc: 'Inglês corporativo & negociações reais',      color: 'text-blue-400',    glowColor: 'rgba(59,130,246,0.3)'  },
  miles:     { emoji: '✈️', name: 'Miles',     fullName: 'Miles — Viagens',       desc: 'Sobrevivência no exterior & viagens',        color: 'text-amber-400',   glowColor: 'rgba(245,158,11,0.3)'  },
  zack:      { emoji: '🎮', name: 'Zack',      fullName: 'Zack — Gaming',         desc: 'Games, streaming & cultura da internet',     color: 'text-purple-400',  glowColor: 'rgba(139,92,246,0.3)'  },
  hayes:     { emoji: '📚', name: 'Prof. Hayes', fullName: 'Prof. Hayes',         desc: 'Vocabulário avançado & fluência real',        color: 'text-cyan-400',    glowColor: 'rgba(6,182,212,0.3)'   },
};

export function getXpProgress(totalXp: number, rank: PlayerRank): number {
  const cfg = RANK_CONFIG[rank];
  if (!cfg.xpNext) return 100;
  const xpInRank = totalXp - cfg.xpThreshold;
  const xpRange = cfg.xpNext - cfg.xpThreshold;
  return Math.min(100, Math.max(0, (xpInRank / xpRange) * 100));
}
