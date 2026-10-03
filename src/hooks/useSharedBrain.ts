import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Quest {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
}

export interface QuestBlock {
  id: string;
  name: string;
  time: string;
  icon: any;
  quests: Quest[];
}

// ── SKYROS Score constants ──
const REVENUE_GOAL = 40000; // R$ 40k meta Season
const MAX_STREAK_FOR_SCORE = 14; // 14 days = full streak score

export function useSharedBrain() {
  const [xp, setXp] = useState(0);
  const [focoGems, setFocoGems] = useState(0);
  const [streak, setStreak] = useState(0);
  const [realCoins, setRealCoins] = useState(0); // R$ faturado real
  const [growSeeds, setGrowSeeds] = useState(0);
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({}); // skill_id -> level
  const [availableAttributePoints, setAvailableAttributePoints] = useState(0);
  const [streakBroken, setStreakBroken] = useState(false);
  const [bossesCompleted, setBossesCompleted] = useState(0);
  const [bossesTotal, setBossesTotal] = useState(0);
  const [questsCompletedToday, setQuestsCompletedToday] = useState(0);

  const level = Math.floor(xp / 100);

  // Calculate used attribute points from skill levels
  const usedPoints = Object.values(skillPoints).reduce((a, b) => a + b, 0);

  // ── SKYROS SCORE (0-100) ──
  // Formula: streak_weight(30) + bosses_%(40) + faturamento_%(30)
  const streakScore = Math.min(streak / MAX_STREAK_FOR_SCORE, 1) * 30;
  const bossScore = bossesTotal > 0 ? (bossesCompleted / bossesTotal) * 40 : 0;
  const revenueScore = Math.min(realCoins / REVENUE_GOAL, 1) * 30;
  const skyrosScore = Math.round(streakScore + bossScore + revenueScore);

  const skyrosScoreColor =
    skyrosScore >= 80 ? "text-green-400" :
    skyrosScore >= 50 ? "text-yellow-400" :
    "text-red-400";

  const skyrosScoreBorderColor =
    skyrosScore >= 80 ? "border-green-500/30" :
    skyrosScore >= 50 ? "border-yellow-500/30" :
    "border-red-500/30";

  // Revenue progress
  const revenueProgress = Math.min((realCoins / REVENUE_GOAL) * 100, 100);

  useEffect(() => {
    async function loadState() {
      // Load quest completions
      const { data: questEvents } = await supabase
        .from("kairos_events")
        .select("*")
        .eq("event_type", "quest_completed");

      if (questEvents) {
        let totalXp = 0;
        let totalFoco = 0;
        let totalSeeds = 0;

        questEvents.forEach((evt) => {
          const { rewardType, amount } = evt.payload ?? {};
          if (rewardType === "XP") totalXp += amount;
          if (rewardType === "GEMS") totalFoco += amount;
          if (rewardType === "SEEDS") totalSeeds += amount;
        });

        setXp(totalXp);
        setFocoGems(totalFoco);
        setGrowSeeds(totalSeeds);

        // Count today's completions
        const todayStr = new Date().toISOString().split("T")[0];
        const todayCount = questEvents.filter(
          (e) => e.payload?.timestamp?.startsWith(todayStr)
        ).length;
        setQuestsCompletedToday(todayCount);

        // Available attribute points = level - usedPoints (calculated after state updates)
        const currentLevel = Math.floor(totalXp / 100);
        const currentUsed = Object.values(skillPoints).reduce((a, b) => a + b, 0);
        setAvailableAttributePoints(Math.max(0, currentLevel - currentUsed));
      }

      // Load real coins (R$ faturado)
      const { data: coinEvents } = await supabase
        .from("kairos_events")
        .select("*")
        .eq("event_type", "real_coin_earned");

      if (coinEvents) {
        const total = coinEvents.reduce((acc, e) => acc + (e.payload?.amount ?? 0), 0);
        setRealCoins(total);
      }

      // Load skill allocations
      const { data: skillEvents } = await supabase
        .from("kairos_events")
        .select("*")
        .eq("event_type", "skill_point_allocated");

      if (skillEvents) {
        const points: Record<string, number> = {};
        skillEvents.forEach((e) => {
          const sid = e.payload?.skillId;
          if (sid) points[sid] = (points[sid] ?? 0) + 1;
        });
        setSkillPoints(points);
      }

      // Load streak from last consecutive days + LOSS AVERSION
      const { data: streakEvents } = await supabase
        .from("kairos_events")
        .select("*")
        .eq("event_type", "night_checkin")
        .order("created_at", { ascending: false })
        .limit(30);

      if (streakEvents && streakEvents.length > 0) {
        let s = 0;
        const today = new Date();
        for (let i = 0; i < streakEvents.length; i++) {
          const d = new Date(streakEvents[i].created_at);
          const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === i) s++;
          else break;
        }
        setStreak(s);

        // ── LOSS AVERSION: Check if streak was broken ──
        const lastCheckin = new Date(streakEvents[0].created_at);
        const daysSinceLastCheckin = Math.floor(
          (today.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastCheckin > 1) {
          setStreakBroken(true);
          setStreak(0);

          // Check if penalty was already applied today
          const todayStr = today.toISOString().split("T")[0];
          const { data: penaltyCheck } = await supabase
            .from("kairos_events")
            .select("id")
            .eq("event_type", "streak_broken")
            .gte("created_at", todayStr)
            .limit(1);

          if (!penaltyCheck || penaltyCheck.length === 0) {
            // Apply penalty once
            await supabase.from("kairos_events").insert({
              event_type: "streak_broken",
              agent_id: "gabriel-os",
              machine: "pgt-ui",
              payload: {
                penalty: -50,
                lastCheckin: lastCheckin.toISOString(),
                gap: daysSinceLastCheckin,
                timestamp: new Date().toISOString(),
              },
            });
            setXp((prev) => Math.max(0, prev - 50));
          }
        }
      } else {
        // No checkins at all = new user, no penalty
        setStreak(0);
      }

      // Load boss completion data (from roadmap events or manual tracking)
      const { data: bossEvents } = await supabase
        .from("kairos_events")
        .select("*")
        .eq("event_type", "boss_completed");

      setBossesCompleted(bossEvents?.length ?? 0);
      // Total bosses from roadmap — using a reasonable default
      setBossesTotal(7); // matches roadmap.md 7 active tasks
    }

    loadState();
  }, []);

  const completeQuest = async (questId: string, rewardType: string, amount: number) => {
    if (rewardType === "XP") setXp((prev) => prev + amount);
    if (rewardType === "GEMS") setFocoGems((prev) => prev + amount);
    if (rewardType === "SEEDS") setGrowSeeds((prev) => prev + amount);
    setQuestsCompletedToday((prev) => prev + 1);

    await supabase.from("kairos_events").insert({
      event_type: "quest_completed",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: { questId, rewardType, amount, timestamp: new Date().toISOString() },
    });
  };

  const addRealCoin = async (amount: number, source: string) => {
    setRealCoins((prev) => prev + amount);
    await supabase.from("kairos_events").insert({
      event_type: "real_coin_earned",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: { amount, source, timestamp: new Date().toISOString() },
    });
  };

  const allocateSkillPoint = async (skillId: string) => {
    const currentLevel = Math.floor(xp / 100);
    const currentUsed = Object.values(skillPoints).reduce((a, b) => a + b, 0);
    if (currentUsed >= currentLevel) return; // no points available

    setSkillPoints((prev) => ({ ...prev, [skillId]: (prev[skillId] ?? 0) + 1 }));
    setAvailableAttributePoints((prev) => Math.max(0, prev - 1));

    await supabase.from("kairos_events").insert({
      event_type: "skill_point_allocated",
      agent_id: "gabriel-os",
      machine: "pgt-ui",
      payload: { skillId, timestamp: new Date().toISOString() },
    });
  };

  return {
    xp,
    level,
    focoGems,
    streak,
    realCoins,
    growSeeds,
    skillPoints,
    availableAttributePoints: Math.max(0, level - usedPoints),
    paretoDecisions: { genialidade: 0, excelencia: 0, impacto: 0, vortex: 0 },
    // ── AlphaLab injections ──
    skyrosScore,
    skyrosScoreColor,
    skyrosScoreBorderColor,
    streakBroken,
    revenueProgress,
    revenueGoal: REVENUE_GOAL,
    questsCompletedToday,
    bossesCompleted,
    bossesTotal,
    completeQuest,
    addRealCoin,
    allocateSkillPoint,
  };
}
