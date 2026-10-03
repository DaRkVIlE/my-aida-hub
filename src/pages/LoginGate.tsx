/**
 * LoginGate — Página intermediária quando o aluno não está autenticado no LibreChat.
 * Redireciona para o AIDA Chat para fazer login, depois volta ao Hub.
 */

const AIDA_CHAT_URL = (import.meta.env.VITE_AIDA_CHAT_URL as string) || 'https://aida.experiasolutions.com.br';

export function LoginGate() {
  const returnUrl = encodeURIComponent(window.location.origin);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            ⚡
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">AIDA Hub</h1>
          <p className="text-gray-400 text-sm mt-1">Seu Cockpit de Imersão em Inglês</p>
        </div>

        <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <p className="text-gray-300 text-sm">
            Para acessar seu painel de progresso, você precisa estar conectado ao AIDA Chat.
          </p>
          <a
            href={`${AIDA_CHAT_URL}?returnTo=${returnUrl}`}
            className="block w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-bold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            Entrar no AIDA Chat →
          </a>
          <p className="text-gray-600 text-xs">
            Após o login, você será redirecionado automaticamente de volta ao Hub.
          </p>
        </div>

        <p className="text-gray-700 text-xs">AIDA — Imersão Ativa em Inglês com IA</p>
      </div>
    </div>
  );
}
