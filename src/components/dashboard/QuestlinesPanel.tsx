import { useState } from "react";
import { Scroll, ChevronRight, Trophy, Swords, Sparkles, Crown, Home, FileText, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Questline {
  id: string;
  name: string;
  description: string;
  category: "main" | "side" | "castle" | "life";
  progress: number;
  totalSteps: number;
  icon: typeof Trophy;
  active: boolean;
  priority: "P0" | "P1" | "P2";
}

const iconMap = {
  trophy: Trophy,
  swords: Swords,
  sparkles: Sparkles,
  crown: Crown,
  home: Home,
  file: FileText,
  phone: Smartphone,
};

// Gabriel OS v4.0 — Questlines reais (Experia Empire + Caos Terreno)
const initialQuestlines: Questline[] = [
  // MAIN QUESTLINE
  {
    id: "experia",
    name: "⚔️ Experia Empire",
    description: "Fechar 4-5 clientes locais com free tier → MRR R$3K (T1)",
    category: "main",
    progress: 0,
    totalSteps: 7,
    icon: Trophy,
    active: true,
    priority: "P0",
  },
  // SIDE QUESTS (Suporte à Experia)
  {
    id: "cases",
    name: "📸 Operação Prova Social",
    description: "Documentar 3+ cases locais antes das cold calls (15 dias)",
    category: "side",
    progress: 0,
    totalSteps: 3,
    icon: Sparkles,
    active: true,
    priority: "P0",
  },
  {
    id: "masterpumps",
    name: "🏭 Operação Master Pumps",
    description: "Após 1 case: cunhado → RH → proposta formal (R$10K+)",
    category: "side",
    progress: 0,
    totalSteps: 4,
    icon: Swords,
    active: true,
    priority: "P1",
  },
  {
    id: "credito",
    name: "🧹 O Resgate do Crédito",
    description: "Limpar Serasa (<R$5K). Cartão físico = mobilidade financeira",
    category: "castle",
    progress: 0,
    totalSteps: 3,
    icon: Crown,
    active: true,
    priority: "P1",
  },
  // CASTLE QUESTS (Vida real — desbloqueadas com R$)
  {
    id: "apartamento",
    name: "🏠 Quitar o Castelo",
    description: "IPTU (>R$12K) + Financiamento (~R$5K) + Água/Luz (>R$3K)",
    category: "castle",
    progress: 0,
    totalSteps: 3,
    icon: Home,
    active: true,
    priority: "P2",
  },
  // LIFE SIDE QUESTS (Sem custo — só disposição)
  {
    id: "casa",
    name: "🪣 Dedetização e Faxina",
    description: "Cozinha (baratas), embaixo da pia, guarda-roupa amarelo",
    category: "life",
    progress: 0,
    totalSteps: 3,
    icon: Home,
    active: true,
    priority: "P1",
  },
  {
    id: "documentos",
    name: "📄 Missão: Documentação",
    description: "2ª via docs pessoais, certidão, mapear docs do apartamento",
    category: "life",
    progress: 0,
    totalSteps: 4,
    icon: FileText,
    active: true,
    priority: "P1",
  },
  {
    id: "celular",
    name: "📱 Consertar Celular",
    description: "Display quebrado — deixar na casa do avô para o tio levar",
    category: "life",
    progress: 0,
    totalSteps: 2,
    icon: Smartphone,
    active: true,
    priority: "P1",
  },
];

const categoryColors: Record<string, string> = {
  main: "border-yellow-500/50 bg-yellow-500/5",
  side: "border-blue-500/30 bg-blue-500/5",
  castle: "border-orange-500/30 bg-orange-500/5",
  life: "border-gray-500/30 bg-gray-500/5",
};

const categoryLabels: Record<string, string> = {
  main: "MAIN",
  side: "SIDE",
  castle: "CASTELO",
  life: "VIDA",
};

const priorityColors: Record<string, string> = {
  P0: "text-red-400",
  P1: "text-yellow-400",
  P2: "text-blue-400",
};

type FilterType = "all" | "main" | "side" | "castle" | "life";

export function QuestlinesPanel() {
  const [questlines] = useState<Questline[]>(initialQuestlines);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = questlines.filter(q => q.active && (filter === "all" || q.category === filter));

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Scroll className="w-5 h-5 text-secondary" />
          <h3 className="font-display text-lg uppercase tracking-wide">Questlines</h3>
        </div>
        <div className="text-xs font-mono text-yellow-400">T1-2026 FUNDAÇÃO</div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {(["all", "main", "side", "castle", "life"] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2 py-1 rounded text-xs font-mono uppercase transition-all",
              filter === f
                ? "bg-primary/20 border border-primary/50 text-primary"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? "Todos" : categoryLabels[f]}
          </button>
        ))}
      </div>

      {/* Questlines List */}
      <div className="space-y-2">
        {filtered.map(questline => {
          const Icon = questline.icon;
          const progressPercent = questline.totalSteps > 0
            ? (questline.progress / questline.totalSteps) * 100
            : 0;

          return (
            <div
              key={questline.id}
              className={cn(
                "p-3 rounded-lg border transition-all group cursor-pointer",
                categoryColors[questline.category]
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-secondary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm truncate">{questline.name}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={cn("text-xs font-mono", priorityColors[questline.priority])}>
                        {questline.priority}
                      </span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground truncate mt-0.5">{questline.description}</p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {questline.progress}/{questline.totalSteps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Scroll className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-mono">Nenhuma questline nesta categoria</p>
        </div>
      )}
    </div>
  );
}
