import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
  PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";

interface DataMatrixProps {
  skyrosScore: number;
  streak: number;
  xp: number;
  realCoins: number;
  focoGems: number;
  growSeeds: number;
  questsCompletedToday: number;
  bossesCompleted: number;
  bossesTotal: number;
  revenueGoal: number;
}

const COLORS = {
  primary: "#C9A84C",
  cyan: "#00F0FF",
  magenta: "#FF0088",
  green: "#22C55E",
  orange: "#F59E0B",
  purple: "#A855F7",
  red: "#EF4444",
  blue: "#3B82F6",
};

export function DataMatrix({
  skyrosScore,
  streak,
  xp,
  realCoins,
  focoGems,
  growSeeds,
  questsCompletedToday,
  bossesCompleted,
  bossesTotal,
  revenueGoal,
}: DataMatrixProps) {
  // ── RADAR: SKYROS Score by dimension ──
  const radarData = [
    { dimension: "Execução", value: Math.min(questsCompletedToday * 10, 100), fullMark: 100 },
    { dimension: "Finanças", value: Math.min((realCoins / revenueGoal) * 100, 100), fullMark: 100 },
    { dimension: "Consistência", value: Math.min(streak * 7, 100), fullMark: 100 },
    { dimension: "Foco", value: Math.min(focoGems / 5, 100), fullMark: 100 },
    { dimension: "Crescimento", value: Math.min(growSeeds / 3, 100), fullMark: 100 },
  ];

  // ── BAR: Quests per period (simulated from today's data) ──
  const barData = [
    { period: "Ritual", quests: 0, max: 5 },
    { period: "Raid I", quests: 0, max: 3 },
    { period: "Raid II", quests: 0, max: 3 },
    { period: "Academia", quests: 0, max: 1 },
    { period: "Santuário", quests: 0, max: 3 },
  ];

  // ── LINE: XP trend (last 7 days — simulated progression) ──
  const today = new Date();
  const lineData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    // Simulated: ramp up to current XP
    const simulatedXp = Math.round((xp / 7) * (i + 1) * (0.7 + Math.random() * 0.6));
    return { day: dayLabel, xp: i === 6 ? xp : Math.min(simulatedXp, xp) };
  });

  // ── PIE: Reward distribution ──
  const totalRewards = xp + focoGems + growSeeds;
  const pieData = [
    { name: "XP", value: xp || 1, color: COLORS.green },
    { name: "GEMS", value: focoGems || 1, color: COLORS.blue },
    { name: "SEEDS", value: growSeeds || 1, color: COLORS.purple },
  ];

  const chartLabelStyle = "text-[10px] font-space text-white/30 uppercase tracking-[0.3em] mb-4 block";

  return (
    <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-space text-white/30 uppercase tracking-[0.4em]">Performance Analytics</span>
          <div className="h-1 w-16 bg-primary/40 rounded-full" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-space text-white/40 uppercase tracking-widest">Live Data</span>
        </div>
      </div>

      {/* Grid: 2x2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Radar — SKYROS Dimensions */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
          <span className={chartLabelStyle}>SKYROS Score Dimensions</span>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Space Grotesk" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-primary font-outfit">{skyrosScore}</span>
            <span className="text-xs text-white/30 ml-1">/100</span>
          </div>
        </div>

        {/* 2. Bar — Quests por Período */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
          <span className={chartLabelStyle}>Quests por Período (Hoje)</span>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="period"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "Space Grotesk" }}
                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontFamily: "Space Grotesk",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              />
              <Bar dataKey="max" fill="rgba(255,255,255,0.03)" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="quests" fill={COLORS.primary} radius={[6, 6, 0, 0]} name="Feitas" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-xs text-white/30 font-space">{questsCompletedToday} quests hoje</span>
          </div>
        </div>

        {/* 3. Line — XP Trend */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
          <span className={chartLabelStyle}>XP Trend Semanal</span>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "Space Grotesk" }}
                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke={COLORS.cyan}
                strokeWidth={2}
                dot={{ fill: COLORS.cyan, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: COLORS.cyan }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-xs text-white/30 font-space">{xp} XP total acumulado</span>
          </div>
        </div>

        {/* 4. Pie — Distribuição de Recompensas */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
          <span className={chartLabelStyle}>Distribuição de Recompensas</span>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[9px] font-space text-white/40 uppercase tracking-wider">{entry.name}</span>
                <span className="text-[9px] font-space text-white/60 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Boss Kill Rate */}
      <div className="mt-6 p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">💀</span>
          <div>
            <span className="text-[10px] font-space text-white/30 uppercase tracking-widest block">Boss Kill Rate</span>
            <span className="text-sm font-bold text-white/80 font-outfit">{bossesCompleted} / {bossesTotal} bosses eliminados</span>
          </div>
        </div>
        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000 rounded-full"
            style={{ width: `${bossesTotal > 0 ? (bossesCompleted / bossesTotal) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
