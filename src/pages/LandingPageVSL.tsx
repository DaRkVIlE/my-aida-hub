import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldAlert, Zap, Compass, CheckCircle2, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPageVSL() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      {/* Glow de Fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-emerald-600/20 via-teal-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[600px] -left-40 w-[400px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Header Fixo Mínimo */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#030712]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              M
            </div>
            <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              MANA <span className="text-emerald-400">3.0</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-white text-xs font-semibold"
            >
              Já sou aluno
            </Button>
            <Button
              onClick={() => navigate("/triagem")}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
            >
              Fazer Triagem
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Método de Aquisição Natural Acelerada
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6">
          “Você não estuda para falar. <br className="hidden md:block" />
          Você fala — <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">do jeito que der</span> — para aprender.”
        </h1>

        <p className="text-sm md:text-base text-gray-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          — <strong className="text-gray-200">Gabriel Lima (Gabe)</strong>. Cursos tradicionais foram desenhados para você estudar por anos sem nunca ter coragem de abrir a boca. O MANA destrava sua fala em dias através de imersão ativa com IA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/triagem")}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm px-8 py-6 rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Descobrir Meu Rank Inicial</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-gray-300 font-bold text-sm px-7 py-6 rounded-2xl"
          >
            Entrar no AIDA Hub
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Triagem de 3 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sem regras gramaticais
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Diagnóstico imediato
          </span>
        </div>
      </section>

      {/* O Modelo do Aluno Eterno */}
      <section className="py-20 px-6 border-t border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-bold tracking-wider uppercase mb-2">
              <ShieldAlert className="w-4 h-4" /> A Verdade Inconveniente
            </div>
            <h2 className="text-3xl font-black">Por que você ainda não fala inglês fluentemente?</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
              A culpa não é da sua memória nem da sua dedicação. O sistema escolar foi desenhado para criar alunos eternos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-rose-500/30 transition-all">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="font-bold text-base mb-2 text-rose-300">O Negócio das Mensalidades</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cursos tradicionais lucram quanto mais tempo você demorar. 5 anos de gramática fria garantem 60 mensalidades pagas sem nunca te colocar numa conversa real.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="font-bold text-base mb-2 text-amber-300">A Ilusão da Tradução</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Você pensa a frase em português, traduz regra por regra e, quando abre a boca, a língua trava. Falar requer reflexo direto, não tradução mecânica.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="text-3xl mb-4">🤐</div>
              <h3 className="font-bold text-base mb-2 text-purple-300">O Medo do Ridículo</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                A sala de aula pune o erro com vergonha. No MANA, o erro não é pecado — é apenas um dado de calibração para a IA modelar sua pronúncia de forma natural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Montanha B2 (Os 5 Portais) */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-2">
              <Compass className="w-4 h-4" /> A Rota Visível
            </div>
            <h2 className="text-3xl font-black">A Montanha B2: Um Cume com Fim Visível</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
              O MANA não é infinito. São 5 Platôs, 2.500 chunks nucleares e guardiões de IA dedicados a cada estágio da sua fluência.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                portal: "Portal 1: O Descongelamento",
                level: "Rank E → D (CEFR A1/A2)",
                guardian: "🎬 Jordan — Nova York",
                desc: "Destravar a fala, papo solto de rua, cultura pop e eliminar de vez a vergonha de falar.",
                tag: "Destravamento Imediato",
                color: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400"
              },
              {
                portal: "Portal 2: O Motor do BICS",
                level: "Rank D → C (CEFR B1)",
                guardian: "✈️ Miles — Viagens & Vivência",
                desc: "Sobrevivência no exterior, alfândega, restaurantes, perrengues reais e autonomia em viagens.",
                tag: "Sobrevivência Real",
                color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400"
              },
              {
                portal: "Portal 3: A Tração Conversacional",
                level: "Rank C → B (CEFR B1+)",
                guardian: "💻 Zack — Tech & Opiniões",
                desc: "Debates rápidos, velocidade de raciocínio, hobbies, games e fluência sem gaguejar.",
                tag: "Velocidade de Pensamento",
                color: "from-teal-500/20 to-teal-500/5 border-teal-500/30 text-teal-400"
              },
              {
                portal: "Portal 4: A Fronteira Executiva",
                level: "Rank B → A (CEFR B2)",
                guardian: "👔 Alexandra — Alta Liderança",
                desc: "Reuniões corporativas, liderança, negociação salarial, apresentações e vocabulário CALP executivo.",
                tag: "Mercado Corporativo",
                color: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400"
              },
              {
                portal: "Portal 5: O Trono da Soberania",
                level: "Rank A → S (CEFR C1/C2)",
                guardian: "📚 Prof. Hayes — Mestre da Retórica",
                desc: "Nuance, ironia fina, humor seco, sofisticação intelectual e lapidação quase nativa.",
                tag: "Maestria Suprema",
                color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-r border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-gray-300">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-extrabold text-base text-white">{item.portal}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 max-w-xl">{item.desc}</p>
                    <div className="text-xs font-semibold text-emerald-400 mt-1">Guardião: {item.guardian}</div>
                  </div>
                </div>

                <div className="self-end md:self-center">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r ${item.color}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-emerald-950/20 relative">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            ⚡
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Pronto para subir a montanha?</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Faça a triagem de 3 minutos, descubra seu Rank inicial, seu primeiro Guardião e desbloqueie seu acesso no AIDA Hub.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/triagem")}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm px-10 py-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all hover:scale-105"
          >
            Iniciar Minha Triagem Gratuita →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        <p>© 2026 MANA 3.0 — Gabriel Lima & Experia Solutions. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
