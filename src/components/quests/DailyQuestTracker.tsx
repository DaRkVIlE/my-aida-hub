import { useState, useEffect } from "react";
import { Sun, Flame, Zap, BookOpen, Moon, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSharedBrain } from "../../hooks/useSharedBrain";

import * as api from "@/lib/gameApi";
import type { RpgDailyQuest } from "@/lib/gameApi";

interface LocalQuest extends RpgDailyQuest {
  completed: boolean;
}

interface QuestBlock {
  id: string;
  name: string;
  time: string;
  icon: any;
  quests: LocalQuest[];
}

const TIMEZONE_CONFIGS: Record<string, { name: string, time: string, icon: any }> = {
  raid: { name: "RAID ⚔️ (Bloco de Guerra)", time: "Manhã", icon: Flame },
  arena: { name: "ARENA 🏟️ (Competitivo)", time: "Tarde", icon: Zap },
  santuario: { name: "SANTUÁRIO 🧘 (Recuperação)", time: "Noite", icon: Moon },
  ritual: { name: "RITUAL 🔮 (Fechamento)", time: "Geral", icon: BookOpen },
};

export function DailyQuestTracker() {
  const { completeQuest, xp, focoGems, streak } = useSharedBrain();
  const [blocks, setBlocks] = useState<QuestBlock[]>([]);
  const [localStreak, setLocalStreak] = useState(streak);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuests() {
      setLoading(true);
      const data = await api.getDailyQuests();
      const activeQuests = data.filter(q => q.is_active);
      
      const grouped = activeQuests.reduce((acc, quest) => {
        const tz = quest.time_zone || "ritual";
        if (!acc[tz]) acc[tz] = [];
        acc[tz].push({ ...quest, completed: false });
        return acc;
      }, {} as Record<string, LocalQuest[]>);

      const newBlocks: QuestBlock[] = Object.keys(grouped).map(tz => {
        const cfg = TIMEZONE_CONFIGS[tz] || TIMEZONE_CONFIGS.ritual;
        return {
          id: tz,
          name: cfg.name,
          time: cfg.time,
          icon: cfg.icon,
          quests: grouped[tz]
        };
      });

      setBlocks(newBlocks);
      setLoading(false);
    }
    fetchQuests();
  }, []);

  useEffect(() => {
    // Sync streak when loaded from brain
    if (streak > 0) setLocalStreak(streak);
  }, [streak]);

  const toggleQuest = async (blockId: string, questId: string) => {
    // Find quest
    let targetQuest: LocalQuest | null = null;
    
    const newBlocks = blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          quests: block.quests.map(quest => {
            if (quest.id === questId) {
              targetQuest = quest;
              return { ...quest, completed: !quest.completed };
            }
            return quest;
          }),
        };
      }
      return block;
    });

    setBlocks(newBlocks);

    // Persist if checking (not unchecking)
    if (targetQuest !== null && !targetQuest!.completed) {
      if (targetQuest!.xp_reward > 0) await completeQuest(questId, 'XP', targetQuest!.xp_reward);
      if (targetQuest!.gem_reward > 0) await completeQuest(questId, 'GEMS', targetQuest!.gem_reward);
    }
  };

  const totalQuests = blocks.reduce((acc, block) => acc + block.quests.length, 0);
  const completedQuests = blocks.reduce((acc, block) => 
    acc + block.quests.filter(q => q.completed).length, 0);
  const dailyProgress = (completedQuests / totalQuests) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-secondary glow-gold">Rotina KAIROS</h2>
          <p className="text-muted-foreground">Sistema RPG (Pareto Cubed v3.0)</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 glass-card px-4 py-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-mono text-lg">{localStreak} dias</span>
          </div>

          <div className="flex items-center gap-2 glass-card px-4 py-2 border-green-500/30">
            <span className="font-bold text-green-400">{xp} XP</span>
          </div>
          
          <div className="w-48">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progresso Diário</span>
              <span className="text-secondary">{completedQuests}/{totalQuests}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill-gold" style={{ width: `${dailyProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quest Blocks */}
      {loading ? (
        <div className="text-muted-foreground">Carregando quests diárias...</div>
      ) : blocks.length === 0 ? (
        <div className="text-muted-foreground p-8 text-center glass-card">
          Nenhuma quest diária configurada. Acesse o <strong>Mechanics Studio</strong> para configurar seu dia.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block, blockIndex) => (
            <div 
              key={block.id} 
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${blockIndex * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <block.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg">{block.name}</h3>
                  <p className="text-xs text-muted-foreground">{block.time}</p>
                </div>
              </div>

              <div className="space-y-3">
                {block.quests.map((quest) => (
                  <button
                    key={quest.id}
                    onClick={() => toggleQuest(block.id, quest.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all duration-300",
                      quest.completed 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-muted/30 border-border hover:border-secondary/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {quest.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          quest.completed && "line-through text-muted-foreground"
                        )}>
                          {quest.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {quest.xp_reward > 0 && (
                            <span className="text-xs text-secondary-foreground">+{quest.xp_reward} XP</span>
                          )}
                          {quest.gem_reward > 0 && (
                            <span className="text-xs text-blue-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> +{quest.gem_reward}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
