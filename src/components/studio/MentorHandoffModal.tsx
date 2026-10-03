import { useState, useEffect } from "react";
import { X, FileText, CheckCircle2, AlertTriangle, Target, Swords, Loader2, Sparkles } from "lucide-react";
import { getMentorHandoff, type MentorHandoffDossier } from "@/lib/manaApi";
import { cn } from "@/lib/utils";

interface MentorHandoffModalProps {
  userId: string;
  adminKey: string;
  onClose: () => void;
}

export function MentorHandoffModal({ userId, adminKey, onClose }: MentorHandoffModalProps) {
  const [dossier, setDossier] = useState<MentorHandoffDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMentorHandoff(userId, adminKey);
        setDossier(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar o dossiê.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, adminKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b101e] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-white/10 bg-gray-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Dossiê Pedagógico AIDA
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Aula Presencial
                </span>
              </h3>
              <p className="text-xs text-gray-400">Pauta cirúrgica individual para o mentor Gabe</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Sintetizando histórico neurocognitivo do aluno...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-xs text-red-300">
              {error}
            </div>
          )}

          {dossier && (
            <>
              {/* Resumo do Aluno */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Nível CEFR</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">{dossier.diagnosedLevel || "Em Diagnóstico"}</div>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Rank Atual</div>
                  <div className="text-base font-black text-white mt-0.5">Rank {dossier.rank}</div>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Streak</div>
                  <div className="text-base font-black text-amber-400 mt-0.5">{dossier.streak} dias 🔥</div>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">XP Total</div>
                  <div className="text-base font-black text-cyan-400 mt-0.5">{dossier.totalXp.toLocaleString('pt-BR')}</div>
                </div>
              </div>

              {/* Chunks Ativos & Dominados */}
              <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chunks Ativos Fixados
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dossier.activeChunks && dossier.activeChunks.length > 0 ? (
                    dossier.activeChunks.map((c, i) => (
                      <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">Nenhum chunk consolidado registrado ainda.</span>
                  )}
                </div>
              </div>

              {/* Gaps e Pontos de Atenção (Para Gabe atacar na aula) */}
              <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Gargalos Detectados (Atacar no Presencial)
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {dossier.weaknesses && dossier.weaknesses.length > 0 ? (
                    dossier.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>{w}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Sem padrões severos de bloqueio detectados até o momento.</li>
                  )}
                </ul>
              </div>

              {/* Pauta Sugerida de Aula (30-40 min com Gabe) */}
              <div className="bg-gray-900/60 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Roteiro Tático para Gabe (Aula de 40 min)
                </div>
                
                {dossier.recommendedBossRaid && (
                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
                    <span className="text-gray-500 font-bold">Boss Raid Recomendada:</span>{" "}
                    <span className="text-amber-400 font-bold">{dossier.recommendedBossRaid}</span>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {dossier.suggestedSessionAgenda && dossier.suggestedSessionAgenda.length > 0 ? (
                    dossier.suggestedSessionAgenda.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">1. Aquecimento 5 min em inglês com Jordan. 2. Desafio situacional de viagem com Miles. 3. Feedback e consolidação.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-gray-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors"
          >
            Fechar Dossiê
          </button>
        </div>

      </div>
    </div>
  );
}
