import { Brain, Zap, Target, Users, Mic, Lightbulb, TrendingUp, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  icon: typeof Brain;
  color: string;
  zone: "genius" | "excellence" | "impact";
}

// v4.0 — Skills baseadas nas 4 Zonas e Anamnesis
const skills: Skill[] = [
  {
    id: "voice",
    name: "Voz & Comunicação",
    description: "Narração, hipnose, oratória (Zona 🔵 Primária)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 500,
    icon: Mic,
    color: "text-blue-400",
    zone: "genius",
  },
  {
    id: "architecture",
    name: "Arquitetura de Sistemas",
    description: "Ponte IA↔negócios reais (Zona 🔵 Primária)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 600,
    icon: Lightbulb,
    color: "text-blue-400",
    zone: "genius",
  },
  {
    id: "agentification",
    name: "Agentificação",
    description: "KAIROS, AIOX, fluxos multi-agente (Zona 🟢)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 500,
    icon: Bot,
    color: "text-green-400",
    zone: "excellence",
  },
  {
    id: "sales",
    name: "Vendas & Fechamento",
    description: "Cold approach, pitch, proposta, fechar (Zona 🟢)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 500,
    icon: Target,
    color: "text-green-400",
    zone: "excellence",
  },
  {
    id: "productivity",
    name: "Execução Disciplinada",
    description: "Streak, anti-procrastinação, Pareto Score (Zona 🟡)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 400,
    icon: Zap,
    color: "text-yellow-400",
    zone: "impact",
  },
  {
    id: "mindset",
    name: "Domínio do Subconsciente",
    description: "Auto-hipnose, mindset, presença (Zona 🔵 Latente)",
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNext: 700,
    icon: Brain,
    color: "text-purple-400",
    zone: "genius",
  },
];

const zoneLabels: Record<string, { label: string; bgColor: string }> = {
  genius: { label: "🔵", bgColor: "bg-blue-500/10" },
  excellence: { label: "🟢", bgColor: "bg-green-500/10" },
  impact: { label: "🟡", bgColor: "bg-yellow-500/10" },
};

export function SkillsPanel() {
  const totalLevel = skills.reduce((acc, skill) => acc + skill.level, 0);
  const maxTotalLevel = skills.reduce((acc, skill) => acc + skill.maxLevel, 0);

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-neon-green" />
          <h3 className="font-display text-lg uppercase tracking-wide">Skills</h3>
        </div>

        <div className="px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
          <span className="text-xs font-mono text-neon-green">
            LVL {totalLevel}/{maxTotalLevel}
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-2">
        {skills.map(skill => {
          const Icon = skill.icon;
          const xpProgress = (skill.xp / skill.xpToNext) * 100;
          const zoneInfo = zoneLabels[skill.zone];

          return (
            <div
              key={skill.id}
              className={cn(
                "p-3 rounded-lg border border-border hover:border-primary/30 transition-all",
                zoneInfo.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Icon className={cn("w-4 h-4", skill.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{zoneInfo.label}</span>
                    <h4 className="text-xs font-medium truncate">{skill.name}</h4>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Nível {skill.level}</span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      skill.level > 0 ? "bg-gradient-to-r from-primary to-neon-cyan" : "bg-muted-foreground/30"
                    )}
                    style={{ width: `${Math.max(xpProgress, 2)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>{skill.xp} XP</span>
                  <span>{skill.xpToNext} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center font-mono">
          Complete quests de Genialidade → XP nas skills 🔵
        </p>
      </div>
    </div>
  );
}
