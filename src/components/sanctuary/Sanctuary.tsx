import { useState } from "react";
import { Moon, Send, Star, CheckSquare, Calendar, ChevronDown, ChevronUp, Sun, Activity, Coffee } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

type Grade = "A" | "B" | "C" | "D" | "F" | null;

const gradeConfig: Record<string, { label: string; color: string; description: string }> = {
  A: { label: "A", color: "text-green-400 border-green-400", description: "Missão 🔵 concluída + pelo menos 2 do RAID" },
  B: { label: "B", color: "text-blue-400 border-blue-400", description: "Sem missão 🔵, mas boas entregas" },
  C: { label: "C", color: "text-yellow-400 border-yellow-400", description: "Parcial — mais da metade feito" },
  D: { label: "D", color: "text-orange-400 border-orange-400", description: "Pouco executado — mas apareceu" },
  F: { label: "F", color: "text-red-400 border-red-400", description: "Não entrei no jogo hoje" },
};

interface JournalEntry {
  id: string;
  date: string;
  grade: Grade;
  recap: string;
  blocker: string;
  oneThing: string;
  tomorrowMission: string;
  saved: boolean;
}

const HABITS = [
  { id: "water", name: "Hidratação (3L)", icon: "💧" },
  { id: "workout", name: "Treino / Movimento", icon: "🏋️" },
  { id: "meditation", name: "Mindfulness (10m)", icon: "🧘" },
  { id: "deepwork", name: "Deep Work (2h+)", icon: "⚡" },
  { id: "reading", name: "Leitura (15m)", icon: "📚" }
];

export function Sanctuary() {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const todayKey = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState<"morning" | "night" | "habits">("night");

  // Night State
  const [grade, setGrade] = useState<Grade>(null);
  const [recap, setRecap] = useState("");
  const [blocker, setBlocker] = useState("");
  const [oneThing, setOneThing] = useState("");
  const [tomorrowMission, setTomorrowMission] = useState("");
  const [savedNight, setSavedNight] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<JournalEntry[]>([]);

  // Morning State
  const [morningIntention, setMorningIntention] = useState("");
  const [savedMorning, setSavedMorning] = useState(false);

  // Habits State
  const [habitsCompleted, setHabitsCompleted] = useState<Record<string, boolean>>({});

  const toggleHabit = (id: string) => {
    setHabitsCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNight = async () => {
    if (!grade || !recap || !oneThing || !tomorrowMission) return;

    const entry = {
      event_type: "night_checkin",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: {
        date: todayKey,
        grade,
        recap,
        blocker,
        oneThing,
        tomorrowMission,
        habits: habitsCompleted,
        timestamp: new Date().toISOString(),
      },
    };

    const { error } = await supabase.from("kairos_events").insert(entry);
    if (!error) {
      setSavedNight(true);
      setHistory(prev => [{
        id: Date.now().toString(),
        date: todayKey,
        grade,
        recap,
        blocker,
        oneThing,
        tomorrowMission,
        saved: true,
      }, ...prev]);
    }
  };

  const handleSaveMorning = async () => {
    if (!morningIntention) return;
    
    const { error } = await supabase.from("kairos_events").insert({
      event_type: "morning_brief",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: {
        date: todayKey,
        intention: morningIntention,
        timestamp: new Date().toISOString(),
      },
    });

    if (!error) setSavedMorning(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl text-primary glow-cyan flex items-center gap-3 uppercase tracking-wide">
          <Star className="w-8 h-8" />
          Self-Tracking & Rituals
        </h2>
        <p className="text-muted-foreground text-sm font-mono mt-1">{today} · Governança Diária</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted/20 rounded-xl w-fit border border-border/50">
        <button
          onClick={() => setActiveTab("morning")}
          className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all", activeTab === "morning" ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(201,168,76,0.2)]" : "text-muted-foreground hover:text-foreground")}
        >
          <Sun className="w-4 h-4" />
          Morning Briefing
        </button>
        <button
          onClick={() => setActiveTab("habits")}
          className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all", activeTab === "habits" ? "bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]" : "text-muted-foreground hover:text-foreground")}
        >
          <Activity className="w-4 h-4" />
          Habit Tracker
        </button>
        <button
          onClick={() => setActiveTab("night")}
          className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all", activeTab === "night" ? "bg-secondary/20 text-secondary shadow-[0_0_10px_rgba(168,85,247,0.2)]" : "text-muted-foreground hover:text-foreground")}
        >
          <Moon className="w-4 h-4" />
          Night Check-in
        </button>
      </div>

      {/* Morning Briefing Tab */}
      {activeTab === "morning" && (
        <div className="glass-card p-8 border-primary/20 animate-fade-in">
          {savedMorning ? (
             <div className="text-center py-10">
               <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
               <h3 className="font-serif text-xl text-primary">Dia Iniciado com Foco!</h3>
               <p className="text-muted-foreground mt-2">Sua intenção: <span className="text-foreground italic">"{morningIntention}"</span></p>
             </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-serif text-xl flex items-center gap-2 text-primary">
                <Sun className="w-6 h-6" />
                Intenção do Dia
              </h3>
              <p className="text-sm text-muted-foreground">Qual é a atitude mental e o principal objetivo para navegar no caos hoje?</p>
              <textarea
                value={morningIntention}
                onChange={e => setMorningIntention(e.target.value)}
                placeholder="Ex: Hoje o foco é ser inabalável e concluir o setup do MVP..."
                rows={4}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-primary/50 transition-colors resize-none text-sm"
              />
              <button
                onClick={handleSaveMorning}
                disabled={!morningIntention}
                className="w-full py-4 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <Send className="w-5 h-5" />
                Iniciar Dia (Commit)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Habit Tracker Tab */}
      {activeTab === "habits" && (
        <div className="glass-card p-8 border-green-500/20 animate-fade-in">
          <h3 className="font-serif text-xl flex items-center gap-2 text-green-400 mb-6">
            <Activity className="w-6 h-6" />
            Checklist de Hábitos Diários
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HABITS.map(habit => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                  habitsCompleted[habit.id] 
                    ? "bg-green-500/10 border-green-500/40 text-green-400" 
                    : "bg-muted/10 border-border/50 text-muted-foreground hover:border-border"
                )}
              >
                <span className="text-2xl">{habit.icon}</span>
                <span className="font-medium font-mono text-sm">{habit.name}</span>
                {habitsCompleted[habit.id] && <CheckSquare className="w-5 h-5 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Night Check-in Tab */}
      {activeTab === "night" && (
        <div className="space-y-6">
          {savedNight ? (
            <div className="glass-card p-8 text-center animate-fade-in border-secondary/20 bg-secondary/5">
              <Star className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-serif text-xl text-secondary">Dia Encerrado.</h3>
              <p className="text-muted-foreground mt-2">Nota do dia: <span className="font-mono text-2xl text-secondary">{grade}</span></p>
              <p className="text-muted-foreground text-sm mt-2">Missão de amanhã: <span className="text-foreground">{tomorrowMission}</span></p>
              <p className="text-xs text-muted-foreground mt-4 font-mono">KAIROS recebeu os dados. Boa noite.</p>
            </div>
          ) : (
            <>
              {/* Grade do Dia */}
              <div className="glass-card p-6 animate-fade-in border-secondary/20">
                <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-secondary" />
                  1. Nota do Dia
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {(Object.keys(gradeConfig) as Grade[]).map(g => {
                    const cfg = gradeConfig[g as string];
                    return (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          grade === g
                            ? cfg.color + " bg-muted/30"
                            : "border-border text-muted-foreground hover:border-muted-foreground"
                        }`}
                      >
                        <div className="text-2xl font-mono font-bold">{cfg.label}</div>
                        <div className="text-xs mt-1 leading-tight">{cfg.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recap do Dia */}
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h3 className="font-serif text-lg mb-4 text-secondary">2. Recap do Dia</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      O que aconteceu? O que executei?
                    </label>
                    <textarea
                      value={recap}
                      onChange={e => setRecap(e.target.value)}
                      placeholder="Resumo honesto do dia — sem filtro..."
                      rows={3}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-secondary/50 transition-colors resize-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      O que travou? (1 palavra ou frase curta)
                    </label>
                    <input
                      type="text"
                      value={blocker}
                      onChange={e => setBlocker(e.target.value)}
                      placeholder="Ex: dopamina, cansaço, travei no início..."
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-secondary/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      ⭐ 1 coisa boa do dia (obrigatório — sempre tem uma)
                    </label>
                    <input
                      type="text"
                      value={oneThing}
                      onChange={e => setOneThing(e.target.value)}
                      placeholder="Pode ser pequena. Mas foi boa."
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-yellow-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Missão de Amanhã */}
              <div className="glass-card p-6 animate-fade-in border-blue-500/20" style={{ animationDelay: "200ms" }}>
                <h3 className="font-serif text-lg mb-4 flex items-center gap-2 text-blue-400">
                  <Calendar className="w-5 h-5" />
                  3. 🔵 Missão de Amanhã (Pareto 0.8%)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Se você só pudesse fazer UMA coisa amanhã que move o jogo permanentemente — qual seria?
                </p>
                <input
                  type="text"
                  value={tomorrowMission}
                  onChange={e => setTomorrowMission(e.target.value)}
                  placeholder="1 frase. Específica. Concreta. Só você pode fazer desse jeito."
                  className="w-full px-4 py-3 bg-muted/50 border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-400/70 transition-colors text-sm"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSaveNight}
                disabled={!grade || !recap || !oneThing || !tomorrowMission}
                className="w-full py-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 text-secondary font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Salvar Recap — Fechar o Dia
              </button>
            </>
          )}

          {/* Histórico */}
          {history.length > 0 && (
            <div className="glass-card p-6 mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 w-full text-left"
              >
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">Histórico ({history.length})</span>
                {showHistory ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </button>
              {showHistory && (
                <div className="mt-4 space-y-3">
                  {history.map(entry => (
                    <div key={entry.id} className="p-3 bg-muted/20 rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-muted-foreground">{entry.date}</span>
                        <span className={`font-mono font-bold ${gradeConfig[entry.grade as string]?.color ?? ""}`}>
                          {entry.grade}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{entry.recap}</p>
                      <p className="text-blue-400 text-xs mt-1">→ {entry.tomorrowMission}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
