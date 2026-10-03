import { Lock, Unlock, ShoppingBag, Gem, Calculator, RefreshCw, Flame, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as api from "@/lib/gameApi";
import type { RpgLootItem } from "@/lib/gameApi";
import * as LucideIcons from "lucide-react";
import { systemAudio } from "@/lib/systemAudio";

const IconMap: Record<string, any> = LucideIcons as any;
function DynIcon({ name, className }: { name: string; className?: string }) {
  const Icon = IconMap[name] || LucideIcons.Gem;
  return <Icon className={className} />;
}

// Fallback conscious dopamine items if DB is empty
const fallbackLootItems: RpgLootItem[] = [
  {
    id: "weed-conscious",
    name: "🌿 Baseado Consciente",
    description: "Sessão de relaxamento noturno profundo após vitória tática do dia.",
    cost: 500,
    currency: "GEMS",
    category: "dopamine",
    tier: 3,
    unlocked: false,
    requirement: "Requer Streak ≥ 5 dias consecutivos + Quests do dia 100%",
    icon: "Flame"
  },
  {
    id: "master-bation",
    name: "🔞 Master Bation Consciente",
    description: "Liberação fisiológica regulada e deliberada, sem culpa.",
    cost: 200,
    currency: "GEMS",
    category: "dopamine",
    tier: 2,
    unlocked: false,
    requirement: "Requer bloco de Deep Work concluído + Foco matinal 100%",
    icon: "Heart"
  },
  {
    id: "snack-especial",
    name: "🍿 Snack Especial da Noite",
    description: "Refeição ou doce diferenciado para celebrar metas semanais.",
    cost: 150,
    currency: "GEMS",
    category: "dopamine",
    tier: 1,
    unlocked: true,
    requirement: "Consumo moderado após o jantar",
    icon: "ShoppingBag"
  },
  {
    id: "youtube-break",
    name: "▶️ YouTube / Podcast (45 min)",
    description: "Consumo livre de vídeos e entretenimento sem pressa.",
    cost: 100,
    currency: "GEMS",
    category: "dopamine",
    tier: 1,
    unlocked: true,
    requirement: "Após as 20:00",
    icon: "Tv"
  },
  {
    id: "insta-scroll",
    name: "📱 Instagram Livre (20 min)",
    description: "Explorar stories e feeds sem dispersar o dia produtivo.",
    cost: 75,
    currency: "GEMS",
    category: "dopamine",
    tier: 1,
    unlocked: true,
    requirement: "Apenas no bloco Santuário (noite)",
    icon: "Smartphone"
  },
];

const categoryLabels: Record<string, string> = {
  all: "Todos",
  dopamine: "🔥 Dopamina Consciente",
  work: "⚙️ Trabalho",
  castle: "🏠 Castelo",
  personal: "🧍 Pessoal",
  utility: "🔧 Utilidade",
};

const currencyColors: Record<string, string> = {
  REAL: "text-green-400", GEMS: "text-system-cyan", SEEDS: "text-system-gold", XP: "text-system-purple",
};

type FilterCat = "all" | "dopamine" | "work" | "castle" | "personal" | "utility";

export function LootShop() {
  const [items, setItems] = useState<RpgLootItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCat>("all");
  const [unlocking, setUnlocking] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getLootItems();
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems(fallbackLootItems);
      }
    } catch {
      setItems(fallbackLootItems);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggleUnlock = async (item: RpgLootItem) => {
    systemAudio.playHover();
    setUnlocking(item.id);
    const nextState = !item.unlocked;
    if (nextState) systemAudio.playLevelUp();
    try {
      await api.updateLootItem(item.id, { unlocked: nextState });
    } catch {
      // offline fallback toggle
    }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, unlocked: nextState } : i));
    setUnlocking(null);
  };

  const filtered = items.filter(i => filter === "all" || i.category === filter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* ══ HEADER ══ */}
      <div className="system-window p-6 border-system-gold/40">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-system-gold uppercase tracking-widest mb-1">
              <ShoppingBag className="w-4 h-4 text-system-gold" />
              <span>[SISTEMA DE ARSENAL // RECOMPENSAS & DOPAMINA]</span>
            </div>
            <h2 className="text-3xl font-system text-white uppercase tracking-wider glow-hunter">
              Arsenal & Loot Shop
            </h2>
            <p className="text-muted-foreground font-rajdhani text-sm mt-1">
              Dopamina Consciente: Recompensas compradas com disciplina real (Gemas e Streaks).
            </p>
            <div className="flex gap-4 flex-wrap mt-3">
              {Object.entries(currencyColors).map(([cur, color]) => (
                <div key={cur} className="flex items-center gap-1.5 text-xs font-mono">
                  <Gem className={cn("w-3.5 h-3.5", color)} />
                  <span className={cn("font-bold", color)}>{cur}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CATEGORY TABS ══ */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "dopamine", "work", "castle", "personal", "utility"] as FilterCat[]).map(f => (
          <button
            key={f}
            onClick={() => {
              systemAudio.playHover();
              setFilter(f);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded text-xs font-mono transition-all",
              filter === f
                ? "bg-system-cyan/20 border border-system-cyan text-system-cyan font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                : "bg-system-void/80 border border-system-border/60 hover:border-system-cyan/40 text-muted-foreground"
            )}
          >
            {categoryLabels[f]}
          </button>
        ))}
      </div>

      {/* ══ ITEMS GRID ══ */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground font-mono text-xs">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-system-cyan" />
          Acessando o Arsenal do Sistema...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 && (
            <p className="text-xs font-mono text-muted-foreground col-span-3">Nenhum item nesta categoria.</p>
          )}
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "system-window p-5 transition-all duration-300 border relative overflow-hidden",
                item.unlocked ? "border-system-cyan/50 hover:border-system-cyan" : "border-system-border/60 opacity-60 grayscale-[40%]"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-system-gold/40 text-system-gold bg-system-gold/10">
                  TIER {item.tier}
                </span>
                <div>
                  {item.unlocked ? (
                    <Unlock className="w-4 h-4 text-system-cyan" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="w-12 h-12 rounded bg-system-void/90 border border-system-border flex items-center justify-center mb-3 mx-auto">
                <DynIcon name={item.icon} className={cn("w-6 h-6", item.unlocked ? "text-system-cyan" : "text-muted-foreground")} />
              </div>

              <h3 className={cn("font-system text-sm text-center mb-1", item.unlocked ? "text-white" : "text-muted-foreground")}>
                {item.name}
              </h3>
              <p className="text-xs font-rajdhani text-muted-foreground text-center mb-3 leading-relaxed">
                {item.description}
              </p>

              <div className="text-center mb-3">
                <span className={cn("font-mono text-base font-bold", currencyColors[item.currency] || "text-system-cyan")}>
                  {item.cost.toLocaleString("pt-BR")} {item.currency}
                </span>
              </div>

              {item.requirement && (
                <div className="px-3 py-2 bg-system-void/80 border border-system-border/60 rounded mb-3">
                  <p className="text-[11px] font-rajdhani text-muted-foreground text-center">
                    <span className="text-system-gold font-bold">REQUISITO:</span> {item.requirement}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleToggleUnlock(item)}
                disabled={unlocking === item.id}
                className={cn(
                  "w-full py-2 rounded text-xs font-system tracking-wider transition-all",
                  item.unlocked
                    ? "bg-system-cyan/20 border border-system-cyan text-system-cyan hover:bg-system-cyan/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "bg-system-void/80 border border-border text-muted-foreground hover:text-white"
                )}
              >
                {unlocking === item.id
                  ? <RefreshCw className="w-4 h-4 animate-spin mx-auto text-system-cyan" />
                  : item.unlocked ? "✅ RESGATAR RECOMPENSA" : "🔒 BLOQUEADO"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
