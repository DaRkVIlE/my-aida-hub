import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Brain,
  Target,
  BookOpen,
  Sparkles,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: "ritual" | "raid" | "arena" | "lab" | "study" | "sanctuary";
  xpReward: number;
}

interface DaySchedule {
  date: Date;
  events: ScheduleEvent[];
}

const categoryConfig = {
  ritual: { icon: Coffee, color: "text-neon-orange", bg: "bg-neon-orange/10", border: "border-neon-orange/30", label: "Ritual" },
  raid: { icon: Target, color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30", label: "Raid" },
  arena: { icon: Zap, color: "text-neon-magenta", bg: "bg-neon-magenta/10", border: "border-neon-magenta/30", label: "Arena" },
  lab: { icon: Brain, color: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30", label: "Lab" },
  study: { icon: BookOpen, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30", label: "Study" },
  sanctuary: { icon: Sparkles, color: "text-gold", bg: "bg-gold/10", border: "border-gold/30", label: "Santuário" },
};

const defaultRoutine: ScheduleEvent[] = [
  { id: "1", title: "🔮 Ritual do Despertar & Santa Tríade (Oração, Gratidão, Banho Gelado)", startTime: "08:00", endTime: "09:30", category: "ritual", xpReward: 60 },
  { id: "2", title: "⚡ Bloco de Genialidade: IA Ops, Portfólio Experia & Aulas AIDA", startTime: "09:30", endTime: "12:50", category: "raid", xpReward: 150 },
  { id: "3", title: "🚇 Deslocamento Inteligente (Estudo Ativo no Transporte Público)", startTime: "13:20", endTime: "15:00", category: "study", xpReward: 50 },
  { id: "4", title: "🍳 Turno de Excelência Gastronômica (Auxiliar de Cozinha - SP)", startTime: "15:00", endTime: "23:30", category: "arena", xpReward: 250 },
  { id: "5", title: "🌙 Retorno, Santuário & Night Check-in (Fechamento do Dia)", startTime: "00:50", endTime: "01:20", category: "sanctuary", xpReward: 70 },
];

export function AgendaCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [schedules, setSchedules] = useState<Record<string, ScheduleEvent[]>>({
    default: defaultRoutine,
  });
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(false);

  const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");
  
  const getEventsForDate = (date: Date): ScheduleEvent[] => {
    const key = getDateKey(date);
    return schedules[key] || schedules.default;
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: "prev" | "next") => {
    const days = direction === "prev" ? -7 : 7;
    setWeekStart(addDays(weekStart, days));
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setEditingEvent({ ...event });
    setIsNewEvent(false);
    setIsDialogOpen(true);
  };

  const handleAddEvent = () => {
    setEditingEvent({
      id: Date.now().toString(),
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      category: "raid",
      xpReward: 50,
    });
    setIsNewEvent(true);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;
    
    const dateKey = getDateKey(selectedDate);
    const currentEvents = schedules[dateKey] || [...schedules.default];
    
    if (isNewEvent) {
      setSchedules({
        ...schedules,
        [dateKey]: [...currentEvents, editingEvent],
      });
    } else {
      setSchedules({
        ...schedules,
        [dateKey]: currentEvents.map(e => e.id === editingEvent.id ? editingEvent : e),
      });
    }
    
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    
    const dateKey = getDateKey(selectedDate);
    const currentEvents = schedules[dateKey] || [...schedules.default];
    
    setSchedules({
      ...schedules,
      [dateKey]: currentEvents.filter(e => e.id !== editingEvent.id),
    });
    
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const currentDayEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-primary glow-cyan uppercase tracking-wider">
            Agenda Neural
          </h2>
          <p className="text-muted-foreground font-mono mt-1">
            <span className="text-neon-magenta">◆</span> SCHEDULE_OPTIMIZER.exe
          </p>
        </div>
        
        <button 
          onClick={handleAddEvent}
          className="cyber-btn flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="glass-card p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="pointer-events-auto"
            locale={ptBR}
          />
        </div>

        {/* Week View */}
        <div className="col-span-2 glass-card p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigateWeek("prev")}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="font-display text-lg text-primary">
              {format(weekStart, "MMMM yyyy", { locale: ptBR })}
            </h3>
            
            <button 
              onClick={() => navigateWeek("next")}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const dayEvents = getEventsForDate(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "p-3 rounded-lg border transition-all text-center",
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50 bg-muted/20",
                    isToday && !isSelected && "border-neon-magenta/50"
                  )}
                >
                  <p className="text-xs text-muted-foreground font-mono uppercase">
                    {format(day, "EEE", { locale: ptBR })}
                  </p>
                  <p className={cn(
                    "text-xl font-display mt-1",
                    isSelected ? "text-primary" : isToday ? "text-neon-magenta" : "text-foreground"
                  )}>
                    {format(day, "dd")}
                  </p>
                  <div className="flex justify-center gap-1 mt-2">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Schedule */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-primary">
            {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Clock className="w-4 h-4" />
            <span>{currentDayEvents.length} eventos</span>
            <span className="text-neon-purple">
              +{currentDayEvents.reduce((acc, e) => acc + e.xpReward, 0)} XP
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {currentDayEvents
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((event) => {
              const config = categoryConfig[event.category];
              const Icon = config.icon;
              
              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]",
                    config.bg,
                    config.border
                  )}
                >
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={cn("font-semibold", config.color)}>{event.title}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={cn("text-sm font-mono", config.color)}>
                      +{event.xpReward} XP
                    </span>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                  
                  <Edit3 className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </div>
              );
            })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-primary">
              {isNewEvent ? "Novo Evento" : "Editar Evento"}
            </DialogTitle>
          </DialogHeader>
          
          {editingEvent && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Título</label>
                <Input
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="cyber-input"
                  placeholder="Nome do evento..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Início</label>
                  <Input
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    className="cyber-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Fim</label>
                  <Input
                    type="time"
                    value={editingEvent.endTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    className="cyber-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setEditingEvent({ ...editingEvent, category: key as ScheduleEvent["category"] })}
                        className={cn(
                          "p-3 rounded-lg border flex items-center gap-2 transition-all",
                          editingEvent.category === key
                            ? `${config.bg} ${config.border}`
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", config.color)} />
                        <span className="text-sm">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">XP Reward</label>
                <Input
                  type="number"
                  value={editingEvent.xpReward}
                  onChange={(e) => setEditingEvent({ ...editingEvent, xpReward: parseInt(e.target.value) || 0 })}
                  className="cyber-input"
                  min={0}
                  step={10}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            {!isNewEvent && (
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent} className="cyber-btn">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}