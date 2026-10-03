import { useState } from "react";
import { TrendingUp, Target, Flame, X, Zap, DollarSign, User, Building, Phone, Mail, Clock, Play, Pause, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function QuickActions() {
  const [closingDialogOpen, setClosingDialogOpen] = useState(false);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [deepWorkDialogOpen, setDeepWorkDialogOpen] = useState(false);
  
  // Deep Work Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Closing Form State
  const [closingData, setClosingData] = useState({
    clientName: "",
    value: "",
    type: "setup",
  });

  // Lead Form State
  const [leadData, setLeadData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    source: "instagram",
  });

  const handleClosingSubmit = () => {
    if (!closingData.clientName || !closingData.value) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const xpGained = closingData.type === "setup" ? 500 : 200;
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-neon-green">+{xpGained} XP</span>
        <span>Fechamento registrado: {closingData.clientName}</span>
        <span className="text-sm text-muted-foreground">R$ {closingData.value}</span>
      </div>
    );
    
    setClosingData({ clientName: "", value: "", type: "setup" });
    setClosingDialogOpen(false);
  };

  const handleLeadSubmit = () => {
    if (!leadData.name || !leadData.phone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-primary">+50 XP</span>
        <span>Lead adicionado: {leadData.name}</span>
        <span className="text-sm text-muted-foreground">{leadData.company || "Sem empresa"}</span>
      </div>
    );
    
    setLeadData({ name: "", company: "", phone: "", email: "", source: "instagram" });
    setLeadDialogOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-neon-orange">+100 XP</span>
              <span>Sessão Deep Work concluída!</span>
            </div>
          );
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(25 * 60);
  };

  const handleDeepWorkClose = () => {
    if (timerRunning) {
      pauseTimer();
    }
    setDeepWorkDialogOpen(false);
  };

  return (
    <>
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="font-display text-lg mb-4 uppercase tracking-wide">Ações Rápidas</h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => setClosingDialogOpen(true)}
            className="w-full py-3 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all text-left flex items-center gap-3 group hover:border-primary/50"
          >
            <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-mono text-sm">Registrar Fechamento</span>
          </button>
          
          <button 
            onClick={() => setLeadDialogOpen(true)}
            className="w-full py-3 px-4 bg-neon-magenta/10 hover:bg-neon-magenta/20 border border-neon-magenta/30 rounded-lg transition-all text-left flex items-center gap-3 group hover:border-neon-magenta/50"
          >
            <Target className="w-5 h-5 text-neon-magenta group-hover:scale-110 transition-transform" />
            <span className="font-mono text-sm">Adicionar Lead</span>
          </button>
          
          <button 
            onClick={() => setDeepWorkDialogOpen(true)}
            className="w-full py-3 px-4 bg-neon-orange/10 hover:bg-neon-orange/20 border border-neon-orange/30 rounded-lg transition-all text-left flex items-center gap-3 group hover:border-neon-orange/50"
          >
            <Flame className="w-5 h-5 text-neon-orange group-hover:scale-110 transition-transform" />
            <span className="font-mono text-sm">Modo Deep Work</span>
          </button>
        </div>
      </div>

      {/* Registrar Fechamento Dialog */}
      <Dialog open={closingDialogOpen} onOpenChange={setClosingDialogOpen}>
        <DialogContent className="glass-card border-primary/30 bg-background/95 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              REGISTRAR_FECHAMENTO
            </DialogTitle>
            <DialogDescription className="font-mono text-muted-foreground">
              Registre um novo contrato fechado para ganhar XP e Gold.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-mono text-sm text-primary">CLIENTE_NAME *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={closingData.clientName}
                  onChange={(e) => setClosingData({...closingData, clientName: e.target.value})}
                  placeholder="Nome do cliente"
                  className="cyber-input pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-mono text-sm text-primary">VALOR_CONTRATO *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="number"
                  value={closingData.value}
                  onChange={(e) => setClosingData({...closingData, value: e.target.value})}
                  placeholder="5900.00"
                  className="cyber-input pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-mono text-sm text-primary">TIPO_CONTRATO</Label>
              <Select value={closingData.type} onValueChange={(value) => setClosingData({...closingData, type: value})}>
                <SelectTrigger className="cyber-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30">
                  <SelectItem value="setup">Setup Experia (R$ 5.900)</SelectItem>
                  <SelectItem value="recorrencia">Recorrência Mensal</SelectItem>
                  <SelectItem value="consultoria">Consultoria Avulsa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
              <div className="flex items-center gap-2 text-neon-green">
                <Zap className="w-5 h-5" />
                <span className="font-mono text-sm">RECOMPENSA: +{closingData.type === "setup" ? "500" : "200"} XP | +R$ {closingData.value || "0"} Gold</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setClosingDialogOpen(false)}
                className="flex-1 border-muted-foreground/30"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleClosingSubmit}
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adicionar Lead Dialog */}
      <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
        <DialogContent className="glass-card border-neon-magenta/30 bg-background/95 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-neon-magenta flex items-center gap-3">
              <Target className="w-6 h-6" />
              ADICIONAR_LEAD
            </DialogTitle>
            <DialogDescription className="font-mono text-muted-foreground">
              Adicione um novo lead qualificado ao funil de vendas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-mono text-sm text-neon-magenta">NOME *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={leadData.name}
                  onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                  placeholder="Nome do lead"
                  className="cyber-input pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-mono text-sm text-neon-magenta">EMPRESA</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={leadData.company}
                  onChange={(e) => setLeadData({...leadData, company: e.target.value})}
                  placeholder="Nome da empresa"
                  className="cyber-input pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-mono text-sm text-neon-magenta">TELEFONE *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={leadData.phone}
                    onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    className="cyber-input pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-mono text-sm text-neon-magenta">EMAIL</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={leadData.email}
                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                    placeholder="email@empresa.com"
                    className="cyber-input pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-mono text-sm text-neon-magenta">FONTE</Label>
              <Select value={leadData.source} onValueChange={(value) => setLeadData({...leadData, source: value})}>
                <SelectTrigger className="cyber-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-neon-magenta/30">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                <span className="font-mono text-sm">RECOMPENSA: +50 XP | Lead adicionado ao funil</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setLeadDialogOpen(false)}
                className="flex-1 border-muted-foreground/30"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleLeadSubmit}
                className="flex-1 bg-neon-magenta hover:bg-neon-magenta/80 text-white"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deep Work Mode Dialog */}
      <Dialog open={deepWorkDialogOpen} onOpenChange={handleDeepWorkClose}>
        <DialogContent className="glass-card border-neon-orange/30 bg-background/95 backdrop-blur-xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-neon-orange flex items-center gap-3">
              <Flame className="w-6 h-6" />
              DEEP_WORK_MODE
            </DialogTitle>
            <DialogDescription className="font-mono text-muted-foreground">
              Foco total. Sem distrações. Apenas produtividade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-8">
            {/* Timer Display */}
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-neon-orange/30 flex items-center justify-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-b from-neon-orange/10 to-transparent" />
                
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="hsl(var(--neon-orange))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - timeLeft / (25 * 60))}
                    className="transition-all duration-1000"
                  />
                </svg>
                
                <div className="relative z-10 text-center">
                  <span className="font-mono text-5xl text-neon-orange glow-text">
                    {formatTime(timeLeft)}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2 font-mono">
                    {timerRunning ? "FOCUSING..." : "READY"}
                  </p>
                </div>
              </div>
              
              {/* Pulse effect when running */}
              {timerRunning && (
                <div className="absolute inset-0 rounded-full border-2 border-neon-orange/50 animate-ping" />
              )}
            </div>
            
            {/* Timer Controls */}
            <div className="flex items-center gap-4 mt-8">
              {!timerRunning ? (
                <Button 
                  onClick={startTimer}
                  className="bg-neon-orange hover:bg-neon-orange/80 text-white px-8 py-6"
                >
                  <Play className="w-6 h-6 mr-2" />
                  <span className="font-mono">INICIAR</span>
                </Button>
              ) : (
                <Button 
                  onClick={pauseTimer}
                  variant="outline"
                  className="border-neon-orange/50 text-neon-orange hover:bg-neon-orange/20 px-8 py-6"
                >
                  <Pause className="w-6 h-6 mr-2" />
                  <span className="font-mono">PAUSAR</span>
                </Button>
              )}
              
              <Button 
                onClick={resetTimer}
                variant="outline"
                className="border-muted-foreground/30 hover:bg-muted/20 px-4 py-6"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Info */}
            <div className="mt-6 p-4 bg-neon-orange/10 border border-neon-orange/30 rounded-lg w-full">
              <div className="flex items-center gap-2 text-neon-orange">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">Sessão Pomodoro: 25 minutos</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Complete a sessão para ganhar +100 XP
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
