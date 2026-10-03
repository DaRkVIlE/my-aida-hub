import { useState, useEffect } from "react";
import { Flame, Zap, CheckCircle2, Circle, Mic, Headphones, BookOpen, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAidaPlayer, AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";

interface DailyQuestItem {
  id: string;
  title: string;
  desc: string;
  xpReward: number;
  icon: any;
  category: "speaking" | "listening" | "chunks" | "mastery";
  personaTarget: string;
}

const AIDA_DAILY_QUESTS: DailyQuestItem[] = [
  {
    id: "q-speaking-warmup",
    title: "Aquecimento de Mandíbula",
    desc: "Mandar 3 áudios em inglês sem travar e sem traduzir antes de falar.",
    xpReward: 35,
    icon: Mic,
    category: "speaking",
    personaTarget: "jordan"
  },
  {
    id: "q-chunk-catcher",
    title: "Caçador de Chunks",
    desc: "Identificar e usar 2 collocations naturais durante uma conversa fluida.",
    xpReward: 40,
    icon: BookOpen,
    category: "chunks",
    personaTarget: "hayes"
  },
  {
    id: "q-listening-ear",
    title: "Ear Training Nativo",
    desc: "Escutar e responder uma situação rápida com sotaque americano real.",
    xpReward: 30,
    icon: Headphones,
    category: "listening",
    personaTarget: "miles"
  },
  {
    id: "q-pure-run",
    title: "Pure Run Imersivo",
    desc: "5 minutos ininterruptos de diálogo no AIDA Chat sem NENHUMA palavra em português.",
    xpReward: 60,
    icon: ShieldAlert,
    category: "mastery",
    personaTarget: "alexandra"
  }
];

export function DailyQuestTracker() {
  const { totalXp, streakDays } = useAidaPlayer();
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`aida_quests_${today}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleQuest = (id: string) => {
    setCompletedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`aida_quests_${today}`, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / AIDA_DAILY_QUESTS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Quests */}
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Quests Diárias de Imersão</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Treinos curtos de alta intensidade. Conquiste XP e fortaleça sua fluência diária.
          </p>
        </div>

        {/* Progress Circle & Counter */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-4 py-3 rounded-xl">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-semibold uppercase">Progresso do Dia</div>
            <div className="text-lg font-black text-emerald-400">{completedCount} / {AIDA_DAILY_QUESTS.length} Feitas</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-black text-xs text-white bg-emerald-500/10">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AIDA_DAILY_QUESTS.map((quest) => {
          const isDone = completedIds.includes(quest.id);
          const Icon = quest.icon;

          return (
            <div
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={cn(
                "rounded-2xl border p-5 cursor-pointer transition-all duration-200 backdrop-blur-sm flex flex-col justify-between select-none relative overflow-hidden group",
                isDone 
                  ? "bg-emerald-950/20 border-emerald-500/40 opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                  : "bg-gray-900/50 border-white/10 hover:border-white/20 hover:bg-gray-900/70"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                      isDone ? "bg-emerald-500 text-black font-black" : "bg-white/5 text-gray-400 group-hover:text-emerald-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{quest.category}</span>
                  </div>

                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    +{quest.xpReward} XP
                  </span>
                </div>

                <h3 className={cn("text-base font-bold", isDone ? "text-emerald-300 line-through decoration-emerald-500/50" : "text-white")}>
                  {quest.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {quest.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                  )}
                  <span>{isDone ? "Concluída!" : "Marcar como feita"}</span>
                </div>

                <a
                  href={`${AIDA_CHAT_URL}/?model=${quest.personaTarget}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Treinar no Chat →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
