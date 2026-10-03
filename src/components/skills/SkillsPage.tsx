import { useState, useEffect } from "react";
import { TrendingUp, Plus, Lock, Star, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSharedBrain } from "../../hooks/useSharedBrain";
import * as api from "@/lib/gameApi";
import type { RpgSkill } from "@/lib/gameApi";

const zoneColors = {
  genius: { stroke: "#60a5fa", bg: "rgba(59,130,246,0.1)", label: "🔵 Genialidade" },
  excellence: { stroke: "#4ade80", bg: "rgba(34,197,94,0.1)", label: "🟢 Excelência" },
  impact: { stroke: "#facc15", bg: "rgba(234,179,8,0.1)", label: "🟡 Impacto" },
};

export function SkillsPage() {
  const { skillPoints, availableAttributePoints, allocateSkillPoint } = useSharedBrain();
  const [skills, setSkills] = useState<RpgSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<RpgSkill | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getSkills();
      setSkills(data);
      setLoading(false);
    }
    load();
  }, []);

  const getSkillLevel = (id: string) => {
    // If the skill has a base level in DB + any points allocated in current session/brain
    const base = skills.find(s => s.id === id)?.level || 0;
    const allocated = skillPoints[id] || 0;
    return base + allocated;
  };

  const isLocked = (skill: RpgSkill) => {
    return skill.requires_skill_id ? getSkillLevel(skill.requires_skill_id) < 1 : false;
  };

  const canAllocate = (skill: RpgSkill) => {
    if (availableAttributePoints <= 0) return false;
    if (getSkillLevel(skill.id) >= skill.max_level) return false;
    if (isLocked(skill)) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary glow-gold flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Skill Tree — Árvore de Habilidades
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Zona de Genialidade · Dinâmica
          </p>
        </div>

        {/* Points counter */}
        <div className={cn(
          "glass-card px-5 py-3 text-center border",
          availableAttributePoints > 0 ? "border-yellow-400/50 bg-yellow-500/10" : "border-border"
        )}>
          <div className={cn(
            "font-display text-2xl",
            availableAttributePoints > 0 ? "text-yellow-400 glow-gold" : "text-muted-foreground"
          )}>
            {availableAttributePoints}
          </div>
          <div className="text-[9px] text-muted-foreground font-mono">PONTOS</div>
        </div>
      </div>

      {/* Zone legend */}
      <div className="flex gap-4">
        {Object.entries(zoneColors).map(([z, cfg]) => (
          <div key={z} className="px-3 py-1.5 rounded-lg text-xs font-mono border" style={{
            background: cfg.bg,
            borderColor: cfg.stroke + "44",
            color: cfg.stroke,
          }}>
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Dynamic Grid Layout */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Carregando Árvore de Habilidades...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          Nenhuma habilidade cadastrada. Vá até o <strong>Mechanics Studio</strong> para criar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => {
            const currentLevel = getSkillLevel(skill.id);
            const locked = isLocked(skill);
            const zc = zoneColors[skill.zone] || zoneColors.genius;
            const selected = selectedSkill?.id === skill.id;
            const progressPct = currentLevel / skill.max_level;

            return (
              <div 
                key={skill.id}
                onClick={() => setSelectedSkill(selected ? null : skill)}
                className={cn(
                  "glass-card p-4 flex flex-col gap-3 relative transition-all cursor-pointer",
                  selected && "ring-2",
                  locked && "opacity-50 grayscale"
                )}
                style={{
                  borderColor: selected ? zc.stroke : zc.stroke + "44",
                  backgroundColor: zc.bg,
                  boxShadow: selected ? `0 0 15px ${zc.stroke}44` : "none"
                }}
              >
                {locked && (
                  <div className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full text-xs">
                    🔒
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{skill.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight" style={{ color: zc.stroke }}>
                      {skill.name}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      Nível {currentLevel} / {skill.max_level}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${progressPct * 100}%`,
                      backgroundColor: zc.stroke
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selectedSkill && (
        <div className="glass-card p-6 border-2 animate-fade-in" style={{
          borderColor: zoneColors[selectedSkill.zone]?.stroke + "66",
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedSkill.emoji}</span>
              <div>
                <h3 className="font-display text-xl" style={{ color: zoneColors[selectedSkill.zone]?.stroke }}>
                  {selectedSkill.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedSkill.description}</p>
              </div>
            </div>

            {/* Allocate button */}
            {canAllocate(selectedSkill) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  allocateSkillPoint(selectedSkill.id);
                }}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50 text-yellow-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                Alocar Ponto
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: selectedSkill.max_level }).map((_, i) => {
              const thisLevel = i + 1;
              const currentLevel = getSkillLevel(selectedSkill.id);
              const isAchieved = currentLevel >= thisLevel;

              return (
                <div key={i} className={cn(
                  "p-3 rounded-lg border text-center transition-all",
                  isAchieved
                    ? "bg-muted/20"
                    : "border-border bg-muted/5 opacity-50"
                )} style={{
                  borderColor: isAchieved ? zoneColors[selectedSkill.zone]?.stroke + "55" : undefined,
                }}>
                  <Star
                    className="w-4 h-4 mx-auto mb-1"
                    style={{ color: isAchieved ? zoneColors[selectedSkill.zone]?.stroke : "#444" }}
                    fill={isAchieved ? "currentColor" : "none"}
                  />
                  <div className="text-[10px] font-mono mb-1" style={{
                    color: isAchieved ? zoneColors[selectedSkill.zone]?.stroke : "#666"
                  }}>
                    NÍVEL {thisLevel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Requires info */}
          {selectedSkill.requires_skill_id && (
            <div className="mt-4 text-xs text-muted-foreground font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Requer: {skills.find(s => s.id === selectedSkill.requires_skill_id)?.name} (nível 1+)
            </div>
          )}
        </div>
      )}

      {/* Audit Note */}
      <div className="glass-card p-4 border border-blue-500/20 bg-blue-500/5 mt-8">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-blue-400 font-mono">AUDITORIA GAMIFICAÇÃO:</span>{" "}
            Árvore agora é 100% dinâmica. Você pode criar novas ramificações no Mechanics Studio (Admin).
          </div>
        </div>
      </div>
    </div>
  );
}
