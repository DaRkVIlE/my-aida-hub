import { useState } from "react";
import { HubHeader } from "@/components/hub/HubHeader";
import { PortalHub3D } from "@/components/hub/PortalHub3D";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DailyQuestTracker } from "@/components/quests/DailyQuestTracker";
import { BossRoom } from "@/components/bosses/BossRoom";
import { LootShop } from "@/components/loot/LootShop";
import { Sanctuary } from "@/components/sanctuary/Sanctuary";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { SkillsPage } from "@/components/skills/SkillsPage";
import { QuestlinesPage } from "@/components/questlines/QuestlinesPage";
import { Sidebar } from "@/components/layout/Sidebar";
import { FinancesPage } from "@/components/finances/FinancesPage";
import { CharSheetPage } from "@/components/charsheet/CharSheetPage";
import { BattlePassPage } from "@/components/battlepass/BattlePassPage";
import { AdminStudio } from "@/components/studio/AdminStudio";
import { SkyrosFloatingSystem } from "@/components/skyros/SkyrosFloatingSystem";
import { cn } from "@/lib/utils";

const sectionLabels: Record<string, string> = {
  hub: "Gate Map // Sistema de Portais 3D",
  dashboard: "Command Center",
  quests: "Daily Quests",
  questlines: "Questlines",
  skills: "Skill Tree",
  bosses: "Boss Room",
  loot: "Arsenal de Recompensas",
  sanctuary: "Santuário",
  agenda: "Agenda",
  finances: "Finances & Treasury",
  charsheet: "Character Sheet",
  battlepass: "Battle Pass",
  studio: "Mechanics Studio",
};

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedQuestline, setExpandedQuestline] = useState<string | null>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection("dashboard");
  };

  const handleQuestlineClick = (questlineId: string) => {
    setExpandedQuestline(questlineId);
    setActiveSection("questlines");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "hub":
        return <PortalHub3D onNavigate={handleNavigate} />;
      case "dashboard":
        return <Dashboard onQuestlineClick={handleQuestlineClick} />;
      case "agenda":
        return <AgendaCalendar />;
      case "quests":
        return <DailyQuestTracker />;
      case "questlines":
        return <QuestlinesPage expandedId={expandedQuestline} />;
      case "skills":
        return <SkillsPage />;
      case "bosses":
        return <BossRoom />;
      case "loot":
        return <LootShop />;
      case "sanctuary":
        return <Sanctuary />;
      case "finances":
        return <FinancesPage />;
      case "charsheet":
        return <CharSheetPage />;
      case "battlepass":
        return <BattlePassPage />;
      case "studio":
        return <AdminStudio />;
      default:
        return <Dashboard onQuestlineClick={handleQuestlineClick} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={handleNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <HubHeader
          activeSection={activeSection}
          onBack={handleBack}
          sectionLabel={sectionLabels[activeSection]}
        />

        <main className={cn("flex-1 overflow-auto", activeSection === "hub" ? "p-0 overflow-hidden" : "p-6")}>
          {renderSection()}
        </main>
      </div>

      {/* ══ SOLO LEVELING FLOATING HUD // SKYROS SYSTEM ══ */}
      <SkyrosFloatingSystem />
    </div>
  );
};

export default Index;
