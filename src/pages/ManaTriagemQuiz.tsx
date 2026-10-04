import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2, Trophy, Sparkles, RefreshCcw, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizAnswer {
  pain: string | null;
  situationalScore: number;
  profile: string | null;
}

export function ManaTriagemQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [selectedPain, setSelectedPain] = useState<string | null>(null);
  const [sitAnswer1, setSitAnswer1] = useState<number | null>(null);
  const [sitAnswer2, setSitAnswer2] = useState<number | null>(null);
  const [sitAnswer3, setSitAnswer3] = useState<number | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // Total de 4 etapas: 1=Dor, 2=Desafios de Intuição, 3=Perfil, 4=Resultado
  const totalSteps = 3;
  const progressPercent = Math.min(100, Math.round(((step - 1) / totalSteps) * 100));

  const handleFinishQuiz = async () => {
    setIsSubmitting(true);

    const totalScore = (sitAnswer1 || 0) + (sitAnswer2 || 0) + (sitAnswer3 || 0);
    
    // Cálculo determinístico do Rank e Guardião
    let rank = "E";
    let guardian = "Jordan";
    let portal = "Portal 1: O Descongelamento";
    let cefr = "A1/A2";

    if (selectedProfile === "P5" || totalScore >= 8) {
      rank = "S";
      guardian = "Prof. Hayes";
      portal = "Portal 5: O Trono da Soberania";
      cefr = "C1/C2";
    } else if (selectedProfile === "P4" || totalScore >= 6) {
      rank = "B";
      guardian = "Alexandra";
      portal = "Portal 4: A Fronteira Executiva";
      cefr = "B2";
    } else if (selectedProfile === "P3" || totalScore >= 4) {
      rank = "C";
      guardian = "Zack";
      portal = "Portal 3: A Tração Conversacional";
      cefr = "B1+";
    } else if (selectedProfile === "P2" || totalScore >= 2) {
      rank = "D";
      guardian = "Miles";
      portal = "Portal 2: O Motor do BICS";
      cefr = "A2/B1";
    }

    const calculatedResult = {
      rank,
      guardian,
      portal,
      cefr,
      pain: selectedPain,
      profile: selectedProfile,
      bonusXp: 50,
      timestamp: new Date().toISOString()
    };

    // Salva no localStorage para sincronizar pós-login
    try {
      localStorage.setItem("aida_triage_result", JSON.stringify(calculatedResult));
    } catch (e) {
      // ignore
    }

    // Tenta chamada no backend
    try {
      const storedToken = localStorage.getItem("aida_access_token");
      await fetch("https://my-aida-production.up.railway.app/api/mana/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify(calculatedResult)
      }).catch(() => {});
    } catch (e) {
      // offline-safe
    }

    setResult(calculatedResult);
    setStep(4);
    setIsSubmitting(false);

    // Celebração de Confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              TRIAGEM <span className="text-emerald-400">MANA</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-bold">
              {step <= 3 ? `Etapa ${step} de 3` : "Diagnóstico Concluído"}
            </span>
          </div>
        </div>
      </header>

      {/* Barra de Progresso */}
      {step <= 3 && (
        <div className="w-full bg-white/5 h-1">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center w-full">
        {/* ETAPA 1: O Espelho Mental */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Etapa 1 — O Espelho Mental
              </span>
              <h2 className="text-2xl md:text-3xl font-black">Qual é o seu travamento real com o inglês?</h2>
              <p className="text-xs md:text-sm text-gray-400">
                Seja 100% sincero. O MANA calibra seu treino de acordo com a sua trava emocional.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "D1",
                  title: "Bloqueio Oral Clássico",
                  desc: "“Eu estudo há anos, entendo quase tudo quando leio ou ouço, mas na hora de falar a mente congela.”"
                },
                {
                  id: "D2",
                  title: "Vergonha e Julgamento",
                  desc: "“Preciso do inglês no trabalho, mas morro de vergonha de errar pronúncia e parecer amador na frente dos outros.”"
                },
                {
                  id: "D3",
                  title: "Tradução Mental Esgotante",
                  desc: "“Eu até me viro, mas tenho que traduzir palavra por palavra na cabeça antes de falar. É cansativo e lento.”"
                },
                {
                  id: "D4",
                  title: "Iniciante Travado do Zero",
                  desc: "“Nunca consegui estudar sério, acho inglês difícil e sinto que não levo jeito para línguas.”"
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPain(item.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedPain === item.id
                      ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </button>
              ))}
            </div>

            <Button
              disabled={!selectedPain}
              onClick={() => setStep(2)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-6 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] mt-4"
            >
              Continuar para os Desafios de Intuição →
            </Button>
          </div>
        )}

        {/* ETAPA 2: Micro-Desafios de Intuição */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Etapa 2 — Diagnóstico de Intuição Oral
              </span>
              <h2 className="text-2xl md:text-3xl font-black">Como você reagiria nestas 3 situações?</h2>
              <p className="text-xs md:text-sm text-gray-400">
                Não pense em gramática. Escolha a resposta que sairia mais naturalmente da sua boca.
              </p>
            </div>

            {/* Pergunta 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-bold text-emerald-400">Situação 1: Você está em NY e quer um café com leite rápido.</div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { text: "Travo e aponto pro cardápio", points: 0 },
                  { text: "“Can I have a latte, please?”", points: 2 },
                  { text: "“I would like to order one coffee with milk”", points: 1 }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSitAnswer1(opt.points)}
                    className={`p-3 text-left text-xs rounded-xl border transition-all ${
                      sitAnswer1 === opt.points
                        ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-bold text-emerald-400">Situação 2: Alguém pergunta sua opinião em uma reunião e você discorda.</div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { text: "Fico em silêncio para não errar o inglês", points: 0 },
                  { text: "“I see your point, but what if we tried another angle?”", points: 3 },
                  { text: "“No, I don't agree with this idea”", points: 1 }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSitAnswer2(opt.points)}
                    className={`p-3 text-left text-xs rounded-xl border transition-all ${
                      sitAnswer2 === opt.points
                        ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-bold text-emerald-400">Situação 3: Um nativo fala muito rápido com gírias.</div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { text: "Finjo que entendi e dou um sorriso nervoso", points: 0 },
                  { text: "“Could you say that again a bit slower?”", points: 2 },
                  { text: "Pego o contexto pelo tom e continuo a conversa", points: 3 }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSitAnswer3(opt.points)}
                    className={`p-3 text-left text-xs rounded-xl border transition-all ${
                      sitAnswer3 === opt.points
                        ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-white/10 text-gray-400 hover:text-white"
              >
                Voltar
              </Button>
              <Button
                disabled={sitAnswer1 === null || sitAnswer2 === null || sitAnswer3 === null}
                onClick={() => setStep(3)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-6 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                Continuar para o Perfil MANA →
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Os 5 Perfis do MANA */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Etapa 3 — Onde você está hoje?
              </span>
              <h2 className="text-2xl md:text-3xl font-black">Escolha o seu Perfil mais honesto:</h2>
              <p className="text-xs md:text-sm text-gray-400">
                Isso define em qual dos 5 Portais você começa a sua subida na Montanha B2.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "P1",
                  icon: "🌱",
                  title: "P1: Zero / Ponto de Partida",
                  desc: "Nunca estudei sério ou tenho apenas palavras soltas na cabeça."
                },
                {
                  id: "P2",
                  icon: "😓",
                  title: "P2: Básico Traumatizado",
                  desc: "Já tentei cursinhos ou apps, aprendi pouca coisa e me sinto inseguro."
                },
                {
                  id: "P3",
                  icon: "🔇",
                  title: "P3: Intermediário Bloqueado",
                  desc: "Entendo o inglês quando leio ou vejo séries, mas na hora de falar a voz não sai."
                },
                {
                  id: "P4",
                  icon: "💼",
                  title: "P4: Profissional em Lapidação",
                  desc: "Já consigo me comunicar no trabalho, mas quero autoridade executiva e vocabulário fino."
                },
                {
                  id: "P5",
                  icon: "👑",
                  title: "P5: Rumo à Soberania",
                  desc: "Já falo muito bem. Quero a lapidação final de retórica, ironia e nuance nativa."
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedProfile(item.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    selectedProfile === item.id
                      ? "bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-sm text-white">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="border-white/10 text-gray-400 hover:text-white"
              >
                Voltar
              </Button>
              <Button
                disabled={!selectedProfile || isSubmitting}
                onClick={handleFinishQuiz}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black py-6 rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                {isSubmitting ? "Calculando seu Rank..." : "Calcular Meu Rank e Guardião →"}
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 4: Tela de Resultado Triunfante */}
        {step === 4 && result && (
          <div className="animate-fade-in text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
              Diagnóstico Concluído com Sucesso!
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black">
                Seu Ponto de Partida é o{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Rank {result.rank}
                </span>
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Identificamos o seu padrão de resposta e determinamos o portal ideal para você destravar a fala imediatamente.
              </p>
            </div>

            {/* Card Triunfante */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-emerald-500/30 text-left max-w-md mx-auto shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none">🏔️</div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Portal Recomendado</span>
                  <div className="text-lg font-black text-white">{result.portal}</div>
                  <span className="text-xs text-emerald-400 font-semibold">Equivalência CEFR: {result.cefr}</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seu Guardião de Treino</span>
                  <div className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                    <span>⚡ {result.guardian}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Treinador de IA programado para aplicar recasting natural e desarmar o seu travamento psicológico.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Recompensa de Triagem:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                    +50 XP Desbloqueado!
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3 max-w-md mx-auto">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm py-6 rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Desbloquear Meu Acesso no AIDA Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setStep(1);
                  setResult(null);
                }}
                className="text-xs text-gray-500 hover:text-white"
              >
                <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> Refazer Triagem
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Mínimo */}
      <footer className="border-t border-white/5 py-4 text-center text-[10px] text-gray-600">
        MANA 3.0 — Sistema de Triagem Diagnóstica Neurocognitiva
      </footer>
    </div>
  );
}
