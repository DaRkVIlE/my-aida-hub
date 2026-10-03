import { 
  LayoutDashboard, 
  Swords, 
  ShoppingBag, 
  Sparkles,
  Hexagon,
  Calendar,
  TrendingUp,
  Scroll,
  Wallet,
  UserCircle,
  Home,
  Trophy,
  Settings,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "hub", icon: Compass, label: "Gate Map 3D" },
  { id: "dashboard", icon: Home, label: "Command Center" },
  { id: "battlepass", icon: Trophy, label: "Season Pass" },
  { id: "charsheet", icon: UserCircle, label: "Char Sheet" },
  { id: "agenda", icon: Calendar, label: "Agenda" },
  { id: "quests", icon: Scroll, label: "Daily Quests" },
  { id: "questlines", icon: LayoutDashboard, label: "Questlines" },
  { id: "skills", icon: TrendingUp, label: "Skill Tree" },
  { id: "bosses", icon: Swords, label: "Boss Room" },
  { id: "finances", icon: Wallet, label: "Finances" },
  { id: "loot", icon: ShoppingBag, label: "Arsenal" },
  { id: "sanctuary", icon: Sparkles, label: "Santuário" },
  { id: "studio", icon: Settings, label: "Mechanics Studio" },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-20 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-2 relative">
      {/* Decorative line */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary/50 via-transparent to-primary/50" />
      
      {/* Logo */}
      <button 
        onClick={() => onSectionChange("hub")} 
        className="mb-8 p-3 relative group transition-transform hover:scale-110"
        title="Retornar ao Gate Map 3D"
      >
        <Hexagon className="w-10 h-10 text-primary glow-cyan transition-colors group-hover:text-system-cyan" />
        <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-system-cyan/20 transition-colors" />
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "icon-btn group relative",
              activeSection === item.id && "icon-btn-active"
            )}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-3 py-2 bg-card/95 backdrop-blur-xl rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-primary/30 z-50 text-primary">
              {item.label}
            </span>

            {/* Active indicator */}
            {activeSection === item.id && (
              <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Version Badge */}
      <div className="text-xs text-primary/60 font-mono">
        v5.0
      </div>
    </aside>
  );
}
