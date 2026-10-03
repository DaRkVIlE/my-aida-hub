import { Zap, Coins, Clock, Cpu, Flame, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useSharedBrain } from "../../hooks/useSharedBrain";

export function Header() {
  const [time, setTime] = useState(new Date());
  const { xp, focoGems, streak, realCoins } = useSharedBrain();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const level = Math.floor(xp / 100);
  const xpInLevel = xp % 100;
  const xpToNext = 100;
  const xpPercentage = (xpInLevel / xpToNext) * 100;

  return (
    <header className="h-20 border-b border-border bg-card/80 backdrop-blur-xl px-8 flex items-center justify-between relative overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-cyber-scan" />
      </div>

      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Cpu className="w-10 h-10 text-primary glow-cyan" />
          <div className="absolute inset-0 bg-primary/20 blur-xl" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-primary glow-cyan tracking-wider uppercase">
            LIFELAB OS
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-cyan-400">◆</span> T1-2026 · EXCELÊNCIA & EXPANSÃO
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4">
        {/* Level & XP */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center bg-background relative cyber-frame">
            <span className="font-display text-xl text-primary">{level}</span>
          </div>
          <div className="w-36">
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-muted-foreground">XP.LEVEL</span>
              <span className="text-neon-purple">{xpInLevel}/{xpToNext}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill-purple"
                style={{ width: `${Math.max(xpPercentage, 2)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real Coins (R$ faturado) */}
        <div className="flex items-center gap-2 glass-card-gold px-4 py-2">
          <Coins className="w-5 h-5 text-gold" />
          <span className="font-mono text-lg text-gold">
            R$ {(realCoins ?? 0).toLocaleString("pt-BR")}
          </span>
        </div>

        {/* Foco GEMS */}
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <Zap className="w-5 h-5 text-neon-purple" />
          <span className="font-mono text-lg text-neon-purple">{focoGems} GEMS</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <Flame className="w-5 h-5 text-neon-orange" />
          <span className="font-mono text-lg text-neon-orange">{streak}d</span>
          <Shield className="w-3 h-3 text-muted-foreground" title="Streak Shield disponível" />
        </div>

        {/* Clock */}
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-mono text-xl text-primary glow-cyan">
            {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>
    </header>
  );
}
