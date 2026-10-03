/**
 * LoginGate v2 — Tela de Login Nativa do AIDA Hub
 * ─────────────────────────────────────────────────────────────────────────────
 * v2: Login direto no Hub via POST /api/auth/hub-login.
 * Não depende mais de cookies cross-domain nem de redirecionamento para o Chat.
 * 
 * Fluxo:
 *   1. Aluno digita email + senha
 *   2. Hub chama POST /api/auth/hub-login → recebe { token, user }
 *   3. Token salvo no localStorage
 *   4. Hook useAidaPlayer detecta o token e carrega o Hub automaticamente
 */

import { useState } from 'react';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { hubLogin } from '../lib/manaApi';

export function LoginGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await hubLogin(email.trim(), password);
      // Sucesso: o token foi salvo no localStorage pelo hubLogin().
      // O useAidaPlayer em AidaHubLayout vai detectar o token no próximo render
      // e chamar refetch() automaticamente, transitando de 'unauthenticated' → 'ready'.
      // Forçamos um reload limpo para garantir o ciclo de vida correto.
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            ⚡
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">AIDA Hub</h1>
            <p className="text-gray-400 text-sm mt-1">Seu Cockpit de Imersão em Inglês</p>
          </div>
        </div>

        {/* Card de Login */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4"
        >
          <p className="text-gray-300 text-sm text-center font-medium">
            Entre com suas credenciais para acessar seu painel de progresso
          </p>

          {/* Campo Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium" htmlFor="aida-email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="aida-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-gray-950/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium" htmlFor="aida-password">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="aida-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-950/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar no AIDA Hub →'
            )}
          </button>

          {/* Link para criar conta no Chat */}
          <p className="text-center text-xs text-gray-600">
            Ainda não tem conta?{' '}
            <a
              href={`${(import.meta.env.VITE_AIDA_CHAT_URL as string) || 'https://aida.experiasolutions.com.br'}/register`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
            >
              Cadastre-se no AIDA Chat
            </a>
          </p>
        </form>

        <p className="text-center text-gray-700 text-xs">
          AIDA — Imersão Ativa em Inglês com IA
        </p>
      </div>
    </div>
  );
}
