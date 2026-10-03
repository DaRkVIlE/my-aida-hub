import { 
  Compass, 
  Home, 
  UserCircle, 
  Scroll, 
  Trophy, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIDA_CHAT_URL } from "@/hooks/useAidaPlayer";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "hub",         icon: Compass,       label: "Portais" },
  { id: "dashboard",   icon: Home,          label: "Dashboard" },
  { id: "charsheet",   icon: UserCircle,    label: "Ficha" },
  { id: "quests",      icon: Scroll,        label: "Quests" },
  { id: "leaderboard", icon: Trophy,        label: "Ranking" },
  { id: "battlepass",  icon: Sparkles,      label: "Season" },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="w-16 md:w-20 min-h-screen bg-[#070b14] border-r border-white/10 flex flex-col items-center py-5 gap-3 relative z-30 select-none">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-emerald-500/40 via-transparent to-emerald-500/40" />

      {/* Brand Icon */}
      <button 
        onClick={() => onNavigate("hub")} 
        className="mb-6 p-2 relative group transition-transform hover:scale-105"
        title="AIDA — Portais da Fluência"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          ⚡
        </div>
      </button>

      {/* Navigation list */}
      <nav className="flex flex-col gap-2 flex-1 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 relative group",
                isActive 
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-emerald-400")} />
              <span className="text-[10px] font-medium tracking-tight truncate max-w-full px-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick link to AIDA Chat at bottom */}
      <div className="w-full px-2 pt-2 border-t border-white/5">
        <a
          href={AIDA_CHAT_URL}
          target="_blank"
          rel="noreferrer"
          className="w-full h-12 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          title="Abrir Chat da AIDA"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] font-bold text-gray-500">Chat</span>
        </a>
      </div>
    </aside>
  );
}
