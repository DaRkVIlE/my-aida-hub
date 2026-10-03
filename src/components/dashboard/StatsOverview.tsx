import { TrendingUp, Target, Zap, Trophy } from "lucide-react";

const stats = [
  {
    label: "Fechamentos do Mês",
    value: "2",
    target: "5",
    icon: Trophy,
    color: "text-secondary",
  },
  {
    label: "Leads Qualificados",
    value: "24",
    target: "80",
    icon: Target,
    color: "text-purple-glow",
  },
  {
    label: "Taxa de Conversão",
    value: "30%",
    trend: "+5%",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    label: "Stamina Atual",
    value: "78%",
    icon: Zap,
    color: "text-yellow-400",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
            {stat.trend && (
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              {stat.target && (
                <span className="text-sm text-muted-foreground">/ {stat.target}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
