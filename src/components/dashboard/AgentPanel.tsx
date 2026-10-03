import { Bot, MessageSquare, BarChart3, Truck, Brain } from "lucide-react";

const agents = [
  {
    name: "Prospector",
    role: "Lead Generation",
    status: "active",
    task: "Scraping 50 leads...",
    progress: 68,
    icon: MessageSquare,
  },
  {
    name: "Closer",
    role: "Sales Conversion",
    status: "idle",
    task: "Aguardando leads",
    progress: 0,
    icon: BarChart3,
  },
  {
    name: "Deliverer",
    role: "Client Onboarding",
    status: "active",
    task: "Setup Cliente #3",
    progress: 45,
    icon: Truck,
  },
  {
    name: "Analyst",
    role: "Data & Reports",
    status: "active",
    task: "Gerando relatório",
    progress: 90,
    icon: Brain,
  },
];

export function AgentPanel() {
  return (
    <div className="glass-card-purple p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-purple-glow" />
        <h2 className="font-serif text-xl">Experia Command</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent, index) => (
          <div 
            key={index} 
            className="agent-card animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-glow/20 flex items-center justify-center">
                  <agent.icon className="w-5 h-5 text-purple-glow" />
                </div>
                <div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <div className={agent.status === "active" ? "agent-status-active" : "agent-status-idle"} />
            </div>

            <p className="text-sm text-muted-foreground mb-2">{agent.task}</p>
            
            {agent.progress > 0 && (
              <div className="progress-bar h-2">
                <div 
                  className="progress-fill-purple" 
                  style={{ width: `${agent.progress}%` }} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
