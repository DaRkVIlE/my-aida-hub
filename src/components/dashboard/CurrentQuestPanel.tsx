import { useState, useEffect } from "react";
import { Sun, Zap, Moon, CheckCircle2, Clock, Target, Flame, BookOpen, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface Quest {
  id: string;
  title: string;
  zone: "genius" | "excellence" | "impact" | "vortex";
  rewardType: "XP" | "GEMS" | "SEEDS";
  rewardAmount: number;
  completed: boolean;
  resources: string[]; // 🛠️ Tools/items needed
}

interface TimePeriod {
  id: string;
  name: string;
  emoji: string;
  timeRange: string;
  icon: typeof Sun;
  zoneColor: string;
  quests: Quest[];
}

const timePeriods: TimePeriod[] = [
  {
    id: "ritual",
    name: "RITUAL",
    emoji: "🌅",
    timeRange: "07:00 - 09:00",
    icon: Sun,
    zoneColor: "text-yellow-400",
    quests: [
      { id: "r1", title: "Higiene básica (Escovar os dentes)", zone: "impact", rewardType: "XP", rewardAmount: 10, completed: false, resources: [] },
      { id: "r2", title: "Alongamento (5-10 min)", zone: "impact", rewardType: "XP", rewardAmount: 10, completed: false, resources: ["Timer"] },
      { id: "r3", title: "Arrumar-se / Se vestir", zone: "impact", rewardType: "XP", rewardAmount: 5, completed: false, resources: [] },
      { id: "r4", title: "Tapa na casa (1 tarefa doméstica)", zone: "impact", rewardType: "XP", rewardAmount: 10, completed: false, resources: [] },
      { id: "r5", title: "Sentar no computador e abrir o plano do dia", zone: "impact", rewardType: "XP", rewardAmount: 5, completed: false, resources: ["Antigravity", "KAIROS MCP"] },
    ],
  },
  {
    id: "raid1",
    name: "RAID I — GENIALIDADE",
    emoji: "⚔️",
    timeRange: "09:00 - 12:30",
    icon: Flame,
    zoneColor: "text-blue-400",
    quests: [
      { id: "g1", title: "🔵 Terminar OS pessoal/profissional — gamificação plena", zone: "genius", rewardType: "GEMS", rewardAmount: 80, completed: false, resources: ["Antigravity", "React/Vite", "Recharts", "Supabase"] },
      { id: "g2", title: "Deep Work ≥90min sem interrupção (telefone fora de alcance)", zone: "genius", rewardType: "GEMS", rewardAmount: 30, completed: false, resources: ["Isolation Mode", "Fones"] },
      { id: "g3", title: "Consolidar KAIROX: Skyros + Skydra + Skortex c/ OpenClaw", zone: "genius", rewardType: "GEMS", rewardAmount: 60, completed: false, resources: ["Antigravity", "KAIROS MCP", "Node.js", "Supabase"] },
    ],
  },
  {
    id: "raid2",
    name: "RAID II — EXCELÊNCIA",
    emoji: "⚡",
    timeRange: "13:30 - 17:30",
    icon: Zap,
    zoneColor: "text-green-400",
    quests: [
      { id: "e1", title: "PRD Experia extenso, inestimável e definitivo", zone: "excellence", rewardType: "GEMS", rewardAmount: 50, completed: false, resources: ["Antigravity", "Obsidian", "PRD Template"] },
      { id: "e2", title: "Design System robusto e detalhado c/ Brandbook", zone: "excellence", rewardType: "GEMS", rewardAmount: 40, completed: false, resources: ["Figma", "Canva", "Design Tokens"] },
      { id: "e3", title: "Presença digital: Instagram, Facebook, WhatsApp", zone: "excellence", rewardType: "GEMS", rewardAmount: 30, completed: false, resources: ["Canva", "Meta Business", "WhatsApp Business"] },
    ],
  },
  {
    id: "academia",
    name: "ACADEMIA",
    emoji: "📚",
    timeRange: "17:30 - 19:00",
    icon: BookOpen,
    zoneColor: "text-purple-400",
    quests: [
      { id: "a1", title: "Landing Page + Website + Quiz gamificado (topo de funil)", zone: "impact", rewardType: "SEEDS", rewardAmount: 40, completed: false, resources: ["Vercel", "Vite", "React", "Supabase"] },
    ],
  },
  {
    id: "santuario",
    name: "SANTUÁRIO",
    emoji: "🌙",
    timeRange: "20:30 - 22:30",
    icon: Moon,
    zoneColor: "text-indigo-400",
    quests: [
      { id: "s1", title: "Recap do dia — Nota (A-F) + o que travou + 1 coisa boa", zone: "impact", rewardType: "XP", rewardAmount: 15, completed: false, resources: ["Obsidian", "Journaling"] },
      { id: "s2", title: "Missão 🔵 de amanhã definida (1 frase clara)", zone: "impact", rewardType: "XP", rewardAmount: 10, completed: false, resources: ["roadmap.md"] },
      { id: "s3", title: "Plano das 3 missões do dia seguinte", zone: "impact", rewardType: "XP", rewardAmount: 10, completed: false, resources: ["roadmap.md", "KAIROS MCP"] },
    ],
  },
];

const zoneLabels: Record<string, { label: string; color: string }> = {
  genius: { label: "🔵 Genialidade", color: "text-blue-400" },
  excellence: { label: "🟢 Excelência", color: "text-green-400" },
  impact: { label: "🟡 Impacto", color: "text-yellow-400" },
  vortex: { label: "🔴 Vórtex", color: "text-red-400" },
};

function getCurrentPeriod(): string {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 9) return "ritual";
  if (hour >= 9 && hour < 13) return "raid1";
  if (hour >= 13 && hour < 18) return "raid2";
  if (hour >= 17 && hour < 19) return "academia";
  if (hour >= 20 || hour < 7) return "santuario";
  return "raid1";
}

export function CurrentQuestPanel() {
  const [periods, setPeriods] = useState<TimePeriod[]>(timePeriods);
  const [currentPeriodId, setCurrentPeriodId] = useState(getCurrentPeriod());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPeriodId(getCurrentPeriod());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentPeriod = periods.find(p => p.id === currentPeriodId) || periods[0];
  const completedCount = currentPeriod.quests.filter(q => q.completed).length;
  const totalXp = currentPeriod.quests.reduce((acc, q) => acc + (q.completed ? q.rewardAmount : 0), 0);
  const maxXp = currentPeriod.quests.reduce((acc, q) => acc + q.rewardAmount, 0);

  // Global daily stats
  const allQuests = periods.flatMap(p => p.quests);
  const globalCompleted = allQuests.filter(q => q.completed).length;
  const globalTotal = allQuests.length;

  const toggleQuest = async (questId: string) => {
    let quest: Quest | null = null;
    let nowCompleted = false;

    const newPeriods = periods.map(period => {
      if (period.id === currentPeriodId) {
        return {
          ...period,
          quests: period.quests.map(q => {
            if (q.id === questId) {
              quest = q;
              nowCompleted = !q.completed;
              return { ...q, completed: nowCompleted };
            }
            return q;
          }),
        };
      }
      return period;
    });

    setPeriods(newPeriods);

    if (quest && nowCompleted) {
      await supabase.from("kairos_events").insert({
        event_type: "quest_completed",
        agent_id: "gabriel-os",
        machine: "pgt-ui",
        payload: {
          questId,
          period: currentPeriodId,
          zone: (quest as Quest).zone,
          rewardType: (quest as Quest).rewardType,
          amount: (quest as Quest).rewardAmount,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  const PeriodIcon = currentPeriod.icon;

  return (
    <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl animate-fade-in font-outfit">
      {/* Alpha Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#ff0088] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,1)]">
              <PeriodIcon className={cn("w-8 h-8 transition-transform group-hover:scale-110", currentPeriod.zoneColor)} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
              <span className="text-[10px] font-space font-bold text-primary/70 uppercase tracking-[0.3em]">
                System Operation Mode
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase font-outfit">
              {currentPeriod.name} <span className="opacity-40 ml-2">{currentPeriod.emoji}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <div className="text-right">
            <p className="text-[10px] font-space text-white/30 uppercase tracking-[0.2em] mb-1">Window</p>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4 text-primary opacity-70" />
              <span className="font-space font-medium text-sm">{currentPeriod.timeRange}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] font-space text-white/30 uppercase tracking-[0.2em] mb-1">Yield</p>
            <div className="flex items-center gap-2 text-primary font-bold font-space text-lg">
              <Zap className="w-4 h-4" />
              <span>{totalXp}/{maxXp}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] font-space text-white/30 uppercase tracking-[0.2em] mb-1">Global</p>
            <div className="flex items-center gap-2 text-white/60 font-bold font-space text-sm">
              <Target className="w-3.5 h-3.5" />
              <span>{globalCompleted}/{globalTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Progress */}
      <div className="mb-10 bg-white/[0.01] p-6 rounded-2xl border border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-space text-white/40 uppercase tracking-widest">Efficiency Matrix</span>
            <span className="text-xl font-bold text-white uppercase tracking-tighter">
              {Math.round((completedCount / currentPeriod.quests.length) * 100)}% Synchronized
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-space text-white/40 uppercase tracking-widest">Status</span>
            <span className="text-xs font-bold text-primary/80 font-space">{completedCount} / {currentPeriod.quests.length} Objectives</span>
          </div>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/40 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(201,168,76,0.5)]"
            style={{ width: `${(completedCount / currentPeriod.quests.length) * 100}%` }}
          />
        </div>
      </div>

      {/* High-Status Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentPeriod.quests.map((quest, index) => {
          const zone = zoneLabels[quest.zone];
          return (
            <button
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={cn(
                "group relative w-full text-left p-6 rounded-2xl border transition-all duration-500 overflow-hidden",
                quest.completed
                  ? "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                  : "bg-black border-white/10 hover:border-primary/50 hover:bg-white/[0.02] hover:shadow-[0_0_40px_rgba(201,168,76,0.05)]"
              )}
            >
              {/* Hover Glow Edge */}
              {!quest.completed && (
                <div className="absolute top-0 left-0 w-[2px] h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              <div className="flex items-start gap-5">
                <div className={cn(
                  "w-6 h-6 rounded-lg border flex items-center justify-center transition-all mt-0.5 flex-shrink-0",
                  quest.completed
                    ? "bg-primary border-primary"
                    : "border-white/20 group-hover:border-primary/50 group-hover:bg-primary/5"
                )}>
                  {quest.completed && <CheckCircle2 className="w-4 h-4 text-black font-bold" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-bold text-sm md:text-base transition-all text-white/90 leading-tight font-outfit",
                    quest.completed && "line-through text-white/30"
                  )}>
                    {quest.title}
                  </p>

                  {/* 🛠️ Resources / Items */}
                  {quest.resources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Wrench className="w-3 h-3 text-white/20" />
                      {quest.resources.map((res) => (
                        <span
                          key={res}
                          className="text-[8px] font-space font-bold text-white/25 bg-white/[0.03] border border-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                       <span className={cn("w-1.5 h-1.5 rounded-full", zone.color.replace('text-', 'bg-'))} />
                       <span className={cn("text-[9px] font-space font-bold uppercase tracking-[0.1em]", zone.color)}>
                         {zone.label.split(' ')[1]}
                       </span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-white/30 font-space uppercase tracking-widest font-medium">Value: +{quest.rewardAmount} {quest.rewardType}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-1">
                   <span className={cn(
                     "text-[9px] font-space font-bold px-2 py-1 rounded-md border",
                     quest.completed ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/5 text-white/20"
                   )}>
                     {quest.completed ? "SYNCHRONIZED" : `OBJ_${index + 1}`}
                   </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Period Timeline Selector */}
      <div className="mt-16 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-space text-white/30 uppercase tracking-[0.4em]">Operational Timeline</span>
            <div className="h-1 w-12 bg-primary/40 rounded-full" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {periods.map(period => {
            const isActive = period.id === currentPeriodId;
            const done = period.quests.filter(q => q.completed).length;

            return (
              <button
                key={period.id}
                onClick={() => setCurrentPeriodId(period.id)}
                className={cn(
                  "group flex flex-col gap-3 p-5 min-w-[130px] rounded-2xl border transition-all duration-500",
                  isActive
                    ? "bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(201,168,76,0.1)]"
                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{period.emoji}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    isActive ? "bg-primary shadow-[0_0_12px_rgba(201,168,76,1)] scale-110" : "bg-white/5"
                  )} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn(
                    "text-[11px] font-bold font-space uppercase tracking-tight transition-colors",
                    isActive ? "text-primary" : "text-white/30 group-hover:text-white/50"
                  )}>
                    {period.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={cn("h-full transition-all", isActive ? "bg-primary/50" : "bg-white/10")} style={{width: `${(done/period.quests.length)*100}%`}} />
                    </div>
                    <span className="text-[9px] font-space text-white/20 font-bold">
                      {done}/{period.quests.length}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
