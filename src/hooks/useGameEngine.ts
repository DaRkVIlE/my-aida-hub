import { useState, useEffect } from "react";
import { supabase, Profile, GameMechanics, DynamicAttribute, DynamicSkill } from "@/lib/supabaseClient";

export const DEFAULT_MECHANICS: GameMechanics = {
  attributes: [
    { id: "energia", name: "Energia", type: "pool", value: 50, max_value: 100, icon: "Zap", color: "text-yellow-400" },
    { id: "foco", name: "Foco", type: "stat", value: 10, icon: "Brain", color: "text-blue-400" },
    { id: "moedas", name: "Moedas", type: "currency", value: 0, icon: "Coins", color: "text-amber-500" },
  ],
  skills: [
    { id: "dev", name: "Desenvolvimento", level: 1, xp: 0, xp_next_level: 100, icon: "Code", color: "text-cyan-400", linked_attributes: ["foco"] }
  ]
};

export function useGameEngine() {
  const [mechanics, setMechanics] = useState<GameMechanics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("game_mechanics")
        .limit(1)
        .single();

      if (error) throw error;
      
      if (data?.game_mechanics) {
        setMechanics(data.game_mechanics as GameMechanics);
      } else {
        setMechanics(DEFAULT_MECHANICS);
      }
    } catch (err) {
      console.error("Erro ao carregar mecânicas", err);
      setMechanics(DEFAULT_MECHANICS);
    } finally {
      setLoading(false);
    }
  };

  const saveMechanics = async (newMechanics: GameMechanics) => {
    setMechanics(newMechanics);
    try {
      const { data: profile } = await supabase.from("profile").select("id").limit(1).single();
      if (!profile) return;
      
      const { error } = await supabase
        .from("profile")
        .update({ game_mechanics: newMechanics })
        .eq("id", profile.id);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao salvar mecânicas", err);
    }
  };

  const addAttribute = async (attr: DynamicAttribute) => {
    if (!mechanics) return;
    const newMechanics = { ...mechanics, attributes: [...mechanics.attributes, attr] };
    await saveMechanics(newMechanics);
  };

  const removeAttribute = async (id: string) => {
    if (!mechanics) return;
    const newMechanics = { ...mechanics, attributes: mechanics.attributes.filter(a => a.id !== id) };
    await saveMechanics(newMechanics);
  };

  const addSkill = async (skill: DynamicSkill) => {
    if (!mechanics) return;
    const newMechanics = { ...mechanics, skills: [...mechanics.skills, skill] };
    await saveMechanics(newMechanics);
  };

  const removeSkill = async (id: string) => {
    if (!mechanics) return;
    const newMechanics = { ...mechanics, skills: mechanics.skills.filter(s => s.id !== id) };
    await saveMechanics(newMechanics);
  };

  return {
    mechanics,
    loading,
    saveMechanics,
    addAttribute,
    removeAttribute,
    addSkill,
    removeSkill
  };
}
