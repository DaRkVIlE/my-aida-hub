import { useSharedBrain } from "@/hooks/useSharedBrain";
import { useKAIROS } from "@/hooks/useKAIROS";
import {
  LayoutDashboard, Scroll, TrendingUp, Swords,
  ShoppingBag, Sparkles, Calendar, Hexagon, Flame,
  Zap, Target, Cpu, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StellarHubProps {
  onNavigate: (section: string) => void;
}

interface OrbitalNode {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  emoji: string;
  angle: number; // degrees around the circle
  hasP0?: boolean;
  badge?: string;
}

const NODES: OrbitalNode[] = [
  { id: "dashboard", label: "Command", icon: LayoutDashboard, emoji: "⚡", angle: 0 },
  { id: "quests", label: "Quests", icon: Scroll, emoji: "📜", angle: 45 },
  { id: "questlines", label: "Questlines", icon: Hexagon, emoji: "🗺️", angle: 90, hasP0: true },
  { id: "skills", label: "Skill Tree", icon: TrendingUp, emoji: "🌳", angle: 135 },
  { id: "bosses", label: "Bosses", icon: Swords, emoji: "💀", angle: 180, hasP0: true },
  { id: "loot", label: "Arsenal", icon: ShoppingBag, emoji: "🏆", angle: 225 },
  { id: "sanctuary", label: "Santuário", icon: Sparkles, emoji: "🕯️", angle: 270 },
  { id: "agenda", label: "Agenda", icon: Calendar, emoji: "📅", angle: 315 },
];

// Orbital radius in pixels (from center)
const ORBIT_RADIUS = 220;
const CENTER_X = 400;
const CENTER_Y = 350;

function getNodePosition(angle: number) {
  const rad = (angle - 90) * (Math.PI / 180); // -90 so 0° is top
  return {
    x: CENTER_X + ORBIT_RADIUS * Math.cos(rad),
    y: CENTER_Y + ORBIT_RADIUS * Math.sin(rad),
  };
}

export function StellarHub({ onNavigate }: StellarHubProps) {
  const brain = useSharedBrain();
  const kairos = useKAIROS(30000);
  const { level, skyrosScore, skyrosScoreColor, streak, focoGems, realCoins, xp } = brain;

  const activeBosses = kairos.bosses.filter(b => !b.status.includes("✅")).length;

  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: "700px" }}>
      {/* SVG layer: connection lines + rings */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${CENTER_X * 2} ${CENTER_Y * 2}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Mandala rings */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={100} className="stellar-line" strokeDasharray="4 6" />
        <circle cx={CENTER_X} cy={CENTER_Y} r={ORBIT_RADIUS} className="stellar-line" />
        <circle cx={CENTER_X} cy={CENTER_Y} r={ORBIT_RADIUS + 60} className="stellar-line" style={{ strokeOpacity: 0.06 }} />

        {/* Rune marks on outer rings (subtle decorative dashes) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
          const rad = (a - 90) * (Math.PI / 180);
          const r1 = ORBIT_RADIUS - 10;
          const r2 = ORBIT_RADIUS + 10;
          return (
            <line
              key={a}
              x1={CENTER_X + r1 * Math.cos(rad)}
              y1={CENTER_Y + r1 * Math.sin(rad)}
              x2={CENTER_X + r2 * Math.cos(rad)}
              y2={CENTER_Y + r2 * Math.sin(rad)}
              className="stellar-line"
              style={{ strokeOpacity: 0.08 }}
            />
          );
        })}

        {/* Connection lines: center → each node */}
        {NODES.map(node => {
          const pos = getNodePosition(node.angle);
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={pos.x}
              y2={pos.y}
              className={cn("stellar-line", node.hasP0 && "stellar-line--active")}
            />
          );
        })}
      </svg>

      {/* Center Core Orb */}
      <div
        className="stellar-core"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        onClick={() => onNavigate("dashboard")}
      >
        <Cpu className="w-5 h-5 text-primary mb-1" />
        <span className="font-display text-lg text-primary glow-gold">
          {skyrosScore}
        </span>
        <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
          SKYROS
        </span>
        <span className={cn("text-[8px] font-mono", skyrosScoreColor)}>
          LVL {level}
        </span>
      </div>

      {/* Orbital Nodes */}
      {NODES.map(node => {
        const pos = getNodePosition(node.angle);
        const Icon = node.icon;

        // Calculate badge text
        let badgeText = "";
        if (node.id === "bosses") badgeText = activeBosses > 0 ? `${activeBosses}` : "";
        if (node.id === "quests") badgeText = brain.questsCompletedToday > 0 ? `${brain.questsCompletedToday}` : "";

        return (
          <button
            key={node.id}
            className={cn(
              "stellar-node",
              node.hasP0 && "stellar-node--p0"
            )}
            style={{
              top: "50%",
              left: "50%",
              // Position relative to center using the calculated offset
              marginLeft: `${pos.x - CENTER_X - 40}px`,
              marginTop: `${pos.y - CENTER_Y - 40}px`,
            }}
            onClick={() => onNavigate(node.id)}
            title={node.label}
          >
            <span className="text-xl mb-0.5">{node.emoji}</span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider leading-tight text-center">
              {node.label}
            </span>

            {/* Badge */}
            {badgeText && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center z-30">
                {badgeText}
              </span>
            )}
          </button>
        );
      })}

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/80 border border-neon-orange/20">
          <Flame className="w-3.5 h-3.5 text-neon-orange" />
          <span className="text-xs font-mono text-neon-orange">{streak}d</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/80 border border-blue-400/20">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-mono text-blue-400">{focoGems}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/80 border border-green-400/20">
          <Target className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-mono text-green-400">R$ {realCoins.toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/80 border border-primary/20">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-primary">{xp} XP</span>
        </div>
      </div>
    </div>
  );
}
