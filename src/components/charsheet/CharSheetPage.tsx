import { useState, useEffect } from "react";
import { Shield, Brain, Heart, Wallet, Target, Activity, Zap, Coins, Star, Swords, Flame, Droplet, Sparkles, Compass, Eye, CheckCircle2, Quote, UserCheck } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useSharedBrain } from "@/hooks/useSharedBrain";
import { cn } from "@/lib/utils";
import * as api from "@/lib/gameApi";
import type { RpgAttribute } from "@/lib/gameApi";

const IconMap: Record<string, any> = {
  Brain, Heart, Wallet, Target, Activity, Zap, Coins, Star, Shield, Swords, Flame, Sparkles, Drop: Droplet
};

// Radar data for the Santa Tríade & Core Pillars
const radarData = [
  { subject: "Corpo (Físico)", value: 85, fullMark: 100 },
  { subject: "Mente (Autocontrole)", value: 88, fullMark: 100 },
  { subject: "Espírito (Alinhamento)", value: 90, fullMark: 100 },
  { subject: "Finanças (War Chest)", value: 72, fullMark: 100 },
  { subject: "Estratégia (AI Ops)", value: 92, fullMark: 100 },
];

// Solo Leveling Passive Skills of the Player
const passiveSkills = [
  { name: "Autocontrole do Monarca", rank: "Lv. 3", desc: "Resistência a impulsos dopaminérgicos baratos e gratificação imediata +45%.", icon: "🛡️" },
  { name: "Foco Laser Dimensional", rank: "Lv. 3", desc: "Imunidade absoluta a distrações externas em blocos de Deep Work (90-120 min).", icon: "⚡" },
  { name: "Metacognição Ativa", rank: "Lv. 2", desc: "Auto-observação em tempo real. Identifica e interrompe padrões de sabotagem.", icon: "🧠" },
  { name: "Disciplina Inabalável", rank: "Lv. 3", desc: "Execução fria e deliberada independente do estado emocional ou motivação.", icon: "⚔️" },
  { name: "Presença de Predador", rank: "Lv. 2", desc: "Consciência corporal ereta (1,92m · 102kg). Presença marcante e olhar firme.", icon: "👁️" },
  { name: "Engenharia de Expansão", rank: "Lv. 3", desc: "Capacidade de orquestrar ecossistemas de agentes de IA para criar riqueza real.", icon: "🌌" },
  { name: "Intenção Cirúrgica", rank: "Lv. 2", desc: "Todo ato diário é precedido de intenção clara. Zero movimento desperdiçado.", icon: "🎯" },
  { name: "Purificação da Base", rank: "Lv. 2", desc: "Ordem absoluta no ambiente (Castelo limpo, sem entulho, mesa minimalista).", icon: "📐" },
];

export function CharSheetPage() {
  const { skyrosScore, level, xp, streak, focoGems, realCoins } = useSharedBrain();
  const [attributes, setAttributes] = useState<RpgAttribute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttrs() {
      setLoading(true);
      const data = await api.getAttributes();
      setAttributes(data);
      setLoading(false);
    }
    fetchAttrs();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* ══ HEADER DO PROTAGONISTA ══ */}
      <div className="system-window p-6 border-system-cyan/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar / Photo Spot com Aura Neon */}
            <div className="relative">
              <div className="w-24 h-24 rounded border-2 border-system-cyan bg-system-void/80 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <Shield className="w-12 h-12 text-system-cyan animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-system-cyan/15 via-transparent to-system-purple/20" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-system-void border border-system-cyan text-system-cyan font-mono font-bold text-xs px-2 py-0.5 rounded shadow-[0_0_8px_#00f0ff]">
                RANK S
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-system-cyan uppercase px-2 py-0.2 border border-system-cyan/40 bg-system-cyan/10 rounded">
                  [IDENTIFICAÇÃO BIOMÉTRICA]
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  NÍVEL {level} · {xp} XP TOTAIS
                </span>
              </div>
              <h2 className="text-3xl font-system text-white uppercase tracking-wider glow-hunter">
                GABRIEL // PROTAGONISTA
              </h2>
              <div className="text-xs font-rajdhani text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                <span className="text-white font-bold">1,92m · 102kg</span>
                <span>•</span>
                <span>27 anos</span>
                <span>•</span>
                <span>3 gatos no Castelo</span>
                <span>•</span>
                <span className="text-system-cyan">Perfil Reservado & Alta Disciplina</span>
              </div>
            </div>
          </div>

          {/* Life Score & Mana */}
          <div className="flex md:flex-col justify-between items-start md:items-end">
            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                SINCRONIA SKYROS GLOBAL
              </div>
              <div className="text-4xl font-system text-system-cyan glow-hunter">
                {skyrosScore}
                <span className="text-xs font-mono text-muted-foreground ml-1">/100</span>
              </div>
            </div>
            <div className="text-xs font-mono text-system-gold mt-1">
              {focoGems} 💎 Gemas de Foco Acumuladas
            </div>
          </div>
        </div>
      </div>

      {/* ══ AFIRMAÇÃO DO SISTEMA ══ */}
      <div className="system-window p-5 border-system-purple/40 bg-system-purple/5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded bg-system-purple/20 text-system-purple border border-system-purple/40">
            <Quote className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-system-purple/20 text-system-purple uppercase border border-system-purple/30 font-bold">
                DIRETRIZ MATRIZ DO SISTEMA
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Alter Ego Ativo · Metacognição Fria · Inevitabilidade
              </span>
            </div>
            <p className="text-white font-rajdhani text-sm sm:text-base leading-relaxed italic">
              "Você não tem permissão para falhar. Sua mente governa a biologia, sua disciplina molda o dinheiro e seu foco silencia o mundo. O mundo é um Dungeon, e você é o Player que ascende."
            </p>
          </div>
        </div>
      </div>

      {/* ══ GRID: RADAR CHART DA SANTA TRÍADE + ATRIBUTOS SUPABASE ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar da Santa Tríade */}
        <div className="system-window p-6 border-system-cyan/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-system-cyan" />
              <h3 className="font-system text-base text-white uppercase tracking-wider">
                Pentagrama de Maestria (Santa Tríade)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-system-cyan">EQUILÍBRIO BIO-COGNITIVO</span>
          </div>
          <p className="text-xs text-muted-foreground font-rajdhani mb-4">
            Relação matemática entre físico, domínio mental, espírito, finanças e tecnologia.
          </p>

          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(0, 240, 255, 0.2)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#00f0ff", fontSize: 11, fontFamily: "Rajdhani" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }}
                />
                <Radar
                  name="Player Gabe"
                  dataKey="value"
                  stroke="#00f0ff"
                  fill="#00f0ff"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Atributos Dinâmicos Supabase */}
        <div className="system-window p-6 border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              <h3 className="font-system text-base text-white uppercase tracking-wider">
                Pools de Atributos em Tempo Real
              </h3>
            </div>
            <span className="text-[10px] font-mono text-blue-400">SUPABASE SYNC</span>
          </div>
          <p className="text-xs text-muted-foreground font-rajdhani mb-4">
            Métricas ativas alimentadas pela base de dados do RPG.
          </p>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-muted-foreground text-xs font-mono py-8 text-center">Consultando atributos neurais...</div>
            ) : attributes.length === 0 ? (
              <div className="text-muted-foreground text-xs font-mono py-8 text-center italic">
                Nenhum atributo ativo registrado no banco.
              </div>
            ) : (
              attributes.map(attr => {
                const IconComponent = IconMap[attr.icon] || Star;
                return (
                  <div key={attr.id} className="p-3 rounded border border-system-border/60 bg-system-void/70">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("font-rajdhani font-bold text-sm flex items-center gap-2 text-white")}>
                        <IconComponent className="w-4 h-4 text-system-cyan" />
                        {attr.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-system-cyan">
                        {attr.value}{attr.max_value ? ` / ${attr.max_value}` : ""}
                      </span>
                    </div>
                    {attr.type === "pool" && attr.max_value && (
                      <div className="h-1.5 w-full bg-system-void rounded-full overflow-hidden mt-1.5 border border-system-cyan/20">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-system-cyan shadow-[0_0_8px_#00f0ff]"
                          style={{ width: `${(attr.value / attr.max_value) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ══ HABILIDADES PASSIVAS DO MONARCA (8 PASSIVAS) ══ */}
      <div className="system-window p-6 border-system-border/60">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-system-gold" />
          <h3 className="font-system text-base text-white uppercase tracking-wider">
            Habilidades Passivas Desbloqueadas
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-rajdhani mb-6">
          Traços de maestria convertidos em buffs passivos permanentes que governam a rotina.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {passiveSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded border border-system-border/50 bg-system-void/60 hover:border-system-cyan/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{skill.icon}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-system-cyan/40 text-system-cyan bg-system-cyan/10">
                  {skill.rank}
                </span>
              </div>
              <h4 className="font-system text-xs text-white group-hover:text-system-cyan transition-colors mb-1">
                {skill.name}
              </h4>
              <p className="text-[11px] font-rajdhani text-muted-foreground leading-relaxed">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
