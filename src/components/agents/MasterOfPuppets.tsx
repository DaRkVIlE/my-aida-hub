import { useState } from "react";
import { Bot, Brain, MessageSquare, BarChart3, Truck, Zap, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "busy";
  currentTask: string;
  progress: number;
  tasksCompleted: number;
  efficiency: number;
  icon: typeof Bot;
}

const agents: Agent[] = [
  {
    id: "a1",
    name: "Prospector Prime",
    role: "Lead Generation & Scraping",
    status: "active",
    currentTask: "Scraping leads do Instagram",
    progress: 68,
    tasksCompleted: 147,
    efficiency: 92,
    icon: MessageSquare,
  },
  {
    id: "a2",
    name: "Closer Elite",
    role: "Sales Conversion & Follow-up",
    status: "idle",
    currentTask: "Aguardando novos leads qualificados",
    progress: 0,
    tasksCompleted: 23,
    efficiency: 85,
    icon: BarChart3,
  },
  {
    id: "a3",
    name: "Delivery Master",
    role: "Client Onboarding & Setup",
    status: "busy",
    currentTask: "Setup Experia - Cliente #3",
    progress: 45,
    tasksCompleted: 12,
    efficiency: 98,
    icon: Truck,
  },
  {
    id: "a4",
    name: "Analyst Oracle",
    role: "Data Analysis & Reporting",
    status: "active",
    currentTask: "Gerando relatório semanal",
    progress: 90,
    tasksCompleted: 89,
    efficiency: 95,
    icon: Brain,
  },
];

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
  time: string;
}

const notifications: Notification[] = [
  { id: "n1", type: "success", message: "Lead qualificado: Tech Solutions Ltda", time: "5 min" },
  { id: "n2", type: "warning", message: "Follow-up pendente: Cliente #2", time: "15 min" },
  { id: "n3", type: "info", message: "Relatório de performance pronto", time: "1h" },
  { id: "n4", type: "success", message: "Setup concluído: Cliente #2", time: "2h" },
];

export function MasterOfPuppets() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [directive, setDirective] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "idle": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-secondary glow-gold flex items-center gap-3">
            <Bot className="w-8 h-8" />
            Master of Puppets
          </h2>
          <p className="text-muted-foreground">Centro de Comando da Equipe Experia</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            <span className="font-mono">4 agentes online</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span className="font-mono">92% eficiência</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Agents Grid */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Equipe Ativa</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                className={cn(
                  "agent-card text-left transition-all duration-300 animate-fade-in",
                  selectedAgent === agent.id && "ring-2 ring-purple-glow/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-glow/20 flex items-center justify-center">
                      <agent.icon className="w-6 h-6 text-purple-glow" />
                    </div>
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <div className={cn("w-3 h-3 rounded-full", getStatusColor(agent.status))} 
                    style={{ boxShadow: agent.status === "active" ? "0 0 10px hsl(142 70% 45%)" : "none" }}
                  />
                </div>

                <p className="text-sm text-muted-foreground mb-3">{agent.currentTask}</p>

                {agent.progress > 0 && (
                  <div className="mb-4">
                    <div className="progress-bar h-2">
                      <div className="progress-fill-purple" style={{ width: `${agent.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {agent.tasksCompleted} tarefas
                  </span>
                  <span className="text-purple-glow">
                    {agent.efficiency}% eficiência
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Directive Input */}
          <div className="glass-card p-6 mt-6">
            <h3 className="font-serif text-lg mb-4">Enviar Diretiva</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="Digite uma diretiva para a equipe..."
                className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:border-purple-glow/50 transition-colors"
              />
              <button className="px-6 py-3 bg-purple-glow/20 hover:bg-purple-glow/30 border border-purple-glow/30 rounded-lg transition-colors font-medium">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Notificações</h3>
          
          <div className="glass-card p-4 space-y-3">
            {notifications.map((notif, index) => (
              <div 
                key={notif.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {getNotificationIcon(notif.type)}
                <div className="flex-1">
                  <p className="text-sm">{notif.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {notif.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decision Log */}
          <div className="glass-card-gold p-4">
            <h4 className="font-serif text-sm mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-secondary" />
              Log de Decisões
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Priorizar leads com faturamento +R$50k</p>
              <p>• Aumentar volume de follow-up em 20%</p>
              <p>• Otimizar tempo de resposta inicial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
