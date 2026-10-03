import { useState, useEffect } from "react";
import { Users, Sparkles, ShieldCheck, Search, RefreshCw, Trophy } from "lucide-react";
import { getStudents, upgradeStudent, type ManaProfile, RANK_CONFIG } from "@/lib/manaApi";
import { cn } from "@/lib/utils";

export function AdminStudio() {
  const [students, setStudents] = useState<ManaProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [search, setSearch] = useState("");
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const fetchStudents = async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const data = await getStudents(adminKey);
      setStudents(data);
      setActionStatus(null);
    } catch (err: any) {
      setActionStatus(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (userId: string) => {
    if (!adminKey) return;
    try {
      await upgradeStudent(userId, adminKey);
      setActionStatus(`Aluno ${userId} promovido a PRO com sucesso!`);
      fetchStudents();
    } catch (err: any) {
      setActionStatus(`Erro ao promover: ${err.message}`);
    }
  };

  const filtered = students.filter(s => 
    s.user.toLowerCase().includes(search.toLowerCase()) || 
    (s.personaIdeal && s.personaIdeal.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          AIDA Cockpit do Gestor
        </div>
        <h2 className="text-2xl font-black text-white mt-1">Gestão de Alunos & Planos PRO</h2>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie o avanço de tier, diagnostique níveis e acompanhe o crescimento dos alunos.
        </p>

        {/* Admin Key input */}
        <div className="mt-5 flex gap-3 max-w-md">
          <input
            type="password"
            placeholder="Chave Admin (JWT Secret)"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={fetchStudents}
            disabled={loading || !adminKey}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Carregar
          </button>
        </div>

        {actionStatus && (
          <div className="mt-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            {actionStatus}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por ID ou Persona..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-xs text-gray-500 font-semibold">
              Total de Alunos: <span className="text-white font-bold">{students.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((st) => {
              const rankCfg = RANK_CONFIG[st.playerRank] || RANK_CONFIG.E;
              return (
                <div
                  key={st._id}
                  className="bg-gray-900/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{rankCfg.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{st.user.slice(0, 10)}...</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          st.tier === "pro" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-white/5 text-gray-400 border-white/10"
                        )}>
                          {st.tier.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {rankCfg.label} • {st.totalXp} XP • Streak: {st.streakDays}d • Nível: {st.nivelDiagnosticado || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {st.tier !== "pro" ? (
                      <button
                        onClick={() => handleUpgrade(st.user)}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Tornar PRO
                      </button>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold">✨ Aluno PRO</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
