import { Trophy, Target, Zap, Rocket, Star, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SPRINT_MISSIONS = [
  {
    id: "experia-mvp",
    title: "OP 1: Experia MVP",
    description: "Consolidar 3 cases locais via Free Trial de automação com N8N.",
    progress: 33, // 1/3 trials done
    goal: "3 Free Trials Entregues",
    color: "blue",
    icon: Rocket,
    subtasks: [
      { id: "e1", title: "Mapeamento de 10 Alvos Locais", done: true },
      { id: "e2", title: "Diagnóstico Técnico de Informática (Alvo 1)", done: true },
      { id: "e3", title: "Entrega do Chatbot N8N (Alvo 1)", done: false },
      { id: "e4", title: "Coleta do Depoimento em Vídeo", done: false },
      { id: "e5", title: "Abordagem Alvos 2 e 3", done: false },
    ]
  },
  {
    id: "english-classes",
    title: "OP 2: English AI Classes",
    description: "Levantar caixa rápido retomando aulas de inglês com suporte de IA.",
    progress: 0,
    goal: "R$ 3.000 em Contratos",
    color: "green",
    icon: Zap,
    subtasks: [
      { id: "i1", title: "Estruturação do Material / Prompt IA", done: true },
      { id: "i2", title: "Lista de Ex-alunos / Prospecção Quente", done: false },
      { id: "i3", title: "Fechamento do 1º Pacote", done: false },
      { id: "i4", title: "Fechamento do 2º Pacote", done: false },
    ]
  }
];

const BATTLE_PASS_TIERS = [
  { level: 1, xpReq: 0, reward: "Acesso Liberado", unlocked: true },
  { level: 2, xpReq: 500, reward: "Equipamento Upgrade", unlocked: true },
  { level: 3, xpReq: 1200, reward: "Jantar de Comemoração", unlocked: false },
  { level: 4, xpReq: 2500, reward: "Investimento em Ads", unlocked: false },
  { level: 5, xpReq: 5000, reward: "Day Off Premium", unlocked: false },
];

export function BattlePassPage() {
  const currentXP = 850;
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h2 className="font-serif text-3xl text-primary glow-cyan flex items-center gap-3 uppercase tracking-wider">
            <Trophy className="w-8 h-8" />
            Season 1: First Blood
          </h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Sprint Focus: 24 Maio - 31 Maio 2026
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            XP Sazonal
          </div>
          <div className="text-5xl font-display text-primary glow-cyan flex items-baseline gap-2">
            {currentXP} <span className="text-lg text-muted-foreground">/ 5000</span>
          </div>
        </div>
      </div>

      {/* War Room: Sprints */}
      <div>
        <h3 className="font-serif text-2xl mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-red-400" />
          War Room (Operações Ativas)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SPRINT_MISSIONS.map(mission => (
            <div key={mission.id} className={cn(
              "glass-card p-6 border-t-4",
              mission.color === "blue" ? "border-t-blue-500 bg-blue-500/5" : "border-t-green-500 bg-green-500/5"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className={cn(
                    "p-3 rounded-xl",
                    mission.color === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                  )}>
                    <mission.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-display text-xl uppercase tracking-wide",
                      mission.color === "blue" ? "text-blue-400" : "text-green-400"
                    )}>{mission.title}</h4>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono uppercase mb-2">
                  <span className="text-muted-foreground">Meta: {mission.goal}</span>
                  <span className={mission.color === "blue" ? "text-blue-400" : "text-green-400"}>{mission.progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      mission.color === "blue" ? "bg-blue-500" : "bg-green-500"
                    )}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                {mission.subtasks.map(task => (
                  <div key={task.id} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-sm transition-all",
                    task.done 
                      ? "bg-foreground/5 border-foreground/10 text-muted-foreground" 
                      : "bg-background border-border hover:border-foreground/30 text-foreground"
                  )}>
                    {task.done ? (
                      <CheckCircle2 className="w-5 h-5 text-primary opacity-70" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/50" />
                    )}
                    <span className={cn(task.done && "line-through opacity-70")}>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Pass Tiers */}
      <div className="mt-12">
        <h3 className="font-serif text-2xl mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          Battle Pass Tiers
        </h3>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-muted/20 rounded-full z-0" />
          <div 
            className="absolute left-8 top-8 w-1 bg-primary rounded-full z-0 transition-all duration-1000"
            style={{ height: '35%' }} // Visual approximation of progress
          />

          <div className="space-y-6 relative z-10">
            {BATTLE_PASS_TIERS.map((tier, index) => (
              <div key={tier.level} className="flex items-center gap-6">
                {/* Node */}
                <div className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-2xl border-2 font-display text-2xl shrink-0 transition-all",
                  tier.unlocked 
                    ? "bg-primary/20 border-primary text-primary glow-cyan shadow-[0_0_15px_rgba(201,168,76,0.4)]" 
                    : "bg-muted/30 border-muted text-muted-foreground"
                )}>
                  {tier.level}
                </div>
                
                {/* Info Card */}
                <div className={cn(
                  "flex-1 p-5 rounded-xl border flex items-center justify-between transition-all",
                  tier.unlocked 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-muted/10 border-border/50"
                )}>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {tier.xpReq} XP Requerido
                    </div>
                    <div className={cn(
                      "font-serif text-lg",
                      tier.unlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {tier.reward}
                    </div>
                  </div>
                  
                  {tier.unlocked ? (
                     <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase">
                       Desbloqueado <CheckCircle2 className="w-4 h-4" />
                     </div>
                  ) : (
                    <div className="text-muted-foreground opacity-50">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
