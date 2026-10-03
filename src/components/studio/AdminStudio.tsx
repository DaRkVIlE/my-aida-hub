import { useState, useEffect, useCallback } from "react";
import {
  Sword, Scroll, Clock, TrendingUp, Trophy, Skull, Star,
  Plus, Trash2, Save, Edit2, X, Check, RefreshCw, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as api from "@/lib/gameApi";
import type {
  RpgAttribute, RpgSkill, RpgDailyQuest, RpgQuestline,
  RpgBoss, RpgSeasonPass, RpgSeasonReward
} from "@/lib/gameApi";

// ─── Tab Config ────────────────────────────────────────────

const TABS = [
  { id: "quests", label: "Daily Quests", icon: Sword },
  { id: "questlines", label: "Questlines", icon: Scroll },
  { id: "timezones", label: "Time Zones", icon: Clock },
  { id: "skills", label: "Skills", icon: TrendingUp },
  { id: "season", label: "Season Pass", icon: Trophy },
  { id: "bosses", label: "Bosses", icon: Skull },
  { id: "attributes", label: "Atributos", icon: Star },
];

const TIME_ZONES = [
  { id: "raid", label: "⚔️ Raid", description: "Bloco de guerra e execução profunda", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/5" },
  { id: "arena", label: "🏟️ Arena", description: "Bloco competitivo e vendas", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/5" },
  { id: "santuario", label: "🧘 Santuário", description: "Recuperação, reflexão, saúde", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  { id: "ritual", label: "🔮 Ritual", description: "Abertura e fechamento do dia", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5" },
];

// ─── Shared: small helpers ─────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={cn("text-xs font-mono px-2 py-0.5 rounded uppercase", color)}>
      {label}
    </span>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={cn("inline-block w-2 h-2 rounded-full", ok ? "bg-green-400" : "bg-red-400")} />;
}

// ─── Section: Daily Quests ─────────────────────────────────

function calculateXP(diff: number, urg: number, fear: number) {
  const sum10 = (diff / 10) + (urg / 10) + (fear / 10);
  const sum100 = diff + urg + fear;
  // Algoritmo LifeRPG Exponencial:
  return Math.max(10, Math.floor(sum10 * sum100 * 0.5));
}

function DailyQuestsTab() {
  const [quests, setQuests] = useState<RpgDailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // LifeRPG Mechanics State
  const [diff, setDiff] = useState(10);
  const [urg, setUrg] = useState(10);
  const [fear, setFear] = useState(10);

  const [form, setForm] = useState<Partial<RpgDailyQuest>>({
    title: "", time_zone: "raid", xp_reward: 15, gem_reward: 1, is_active: true
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-calculate XP when sliders change
  useEffect(() => {
    setForm(f => ({
      ...f,
      xp_reward: calculateXP(diff, urg, fear),
      gem_reward: 1 // LifeRPG Rule: Daily missions ALWAYS yield 1 RP
    }));
  }, [diff, urg, fear]);

  const load = useCallback(async () => {
    setLoading(true);
    setQuests(await api.getDailyQuests());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.title?.trim()) return;
    setSaving(true);
    if (editId) {
      await api.updateDailyQuest(editId, form);
    } else {
      await api.createDailyQuest(form as Omit<RpgDailyQuest, "id" | "created_at">);
    }
    setForm({ title: "", time_zone: "raid", xp_reward: 15, gem_reward: 0, is_active: true });
    setEditId(null);
    await load();
    setSaving(false);
  };

  const handleEdit = (q: RpgDailyQuest) => {
    setEditId(q.id);
    setForm({ title: q.title, description: q.description, time_zone: q.time_zone, xp_reward: q.xp_reward, gem_reward: q.gem_reward, is_active: q.is_active });
  };

  const handleDelete = async (id: string) => {
    await api.deleteDailyQuest(id);
    await load();
  };

  const grouped = TIME_ZONES.reduce((acc, tz) => {
    acc[tz.id] = quests.filter(q => q.time_zone === tz.id);
    return acc;
  }, {} as Record<string, RpgDailyQuest[]>);

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          {editId ? "✏️ Editando Quest" : "➕ Nova Daily Quest"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Título *</label>
            <input
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.title || ""}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Completar 1 módulo MANA"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Descrição</label>
            <input
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.description || ""}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Time Zone</label>
            <select
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.time_zone || "raid"}
              onChange={e => setForm(f => ({ ...f, time_zone: e.target.value as any }))}
            >
              {TIME_ZONES.map(tz => <option key={tz.id} value={tz.id}>{tz.label}</option>)}
            </select>
          </div>
          <div className="col-span-full border-t border-border/50 pt-4 mt-2">
            <h4 className="text-xs font-mono text-primary mb-3">🎲 LifeRPG Engine: Avaliação da Quest</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Difficulty */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Dificuldade</span>
                  <span>{diff}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" 
                  className="w-full accent-primary" value={diff} onChange={e => setDiff(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Trivial</span><span>Transformational</span>
                </div>
              </div>
              {/* Urgency */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Urgência</span>
                  <span>{urg}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" 
                  className="w-full accent-primary" value={urg} onChange={e => setUrg(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Optional</span><span>Critical</span>
                </div>
              </div>
              {/* Fear */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Medo / Desconforto</span>
                  <span>{fear}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" 
                  className="w-full accent-primary" value={fear} onChange={e => setFear(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Negligible</span><span>Mortal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full bg-muted/20 border border-border/50 rounded-lg p-3 flex justify-around">
            <div className="text-center">
              <span className="block text-[10px] uppercase text-muted-foreground font-mono mb-1">XP Calculado</span>
              <span className="font-bold text-lg text-purple-400">{form.xp_reward} XP</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase text-muted-foreground font-mono mb-1">Gems Geradas</span>
              <span className="font-bold text-lg text-cyan-400">{form.gem_reward} 💎</span>
              <span className="block text-[9px] text-muted-foreground mt-0.5">(Hardcapped: Regra Daily RP)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 col-span-full">
            <input type="checkbox" id="q-active" checked={form.is_active ?? true}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="accent-primary"
            />
            <label htmlFor="q-active" className="text-sm">Ativa</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={saving || !form.title?.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? "Salvar" : "Adicionar"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ title: "", time_zone: "raid", xp_reward: 15, gem_reward: 0, is_active: true }); }}
              className="px-4 py-2 border rounded text-sm hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List by Time Zone */}
      {loading ? <div className="text-muted-foreground text-sm">Carregando...</div> : (
        <div className="space-y-4">
          {TIME_ZONES.map(tz => (
            <div key={tz.id} className={cn("rounded-lg border p-4", tz.border, tz.bg)}>
              <h4 className={cn("font-semibold mb-3", tz.color)}>{tz.label}</h4>
              {grouped[tz.id]?.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma quest neste bloco.</p>
              ) : (
                <div className="space-y-2">
                  {grouped[tz.id].map(q => (
                    <div key={q.id} className="flex items-center justify-between bg-background/50 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <StatusDot ok={q.is_active} />
                        <span className="text-sm">{q.title}</span>
                        <span className="text-xs text-muted-foreground">+{q.xp_reward} XP</span>
                        {q.gem_reward > 0 && <span className="text-xs text-cyan-400">+{q.gem_reward} 💎</span>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(q)} className="p-1.5 hover:text-primary rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(q.id)} className="p-1.5 hover:text-red-400 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Questlines ───────────────────────────────────

function QuestlinesTab() {
  const [items, setItems] = useState<RpgQuestline[]>([]);
  const [loading, setLoading] = useState(true);

  // LifeRPG Mechanics State
  const [diff, setDiff] = useState(10);
  const [urg, setUrg] = useState(10);
  const [fear, setFear] = useState(10);

  const [form, setForm] = useState<Partial<RpgQuestline>>({ title: "", status: "active", progress: 0, total_steps: 5, reward_xp: 100 });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-calculate XP and equivalent RP when sliders change
  useEffect(() => {
    const xp = calculateXP(diff, urg, fear);
    setForm(f => ({ ...f, reward_xp: xp }));
  }, [diff, urg, fear]);

  // Helper to determine RP from XP (Child Missions)
  const getChildMissionRP = (xp: number) => {
    if (xp <= 1000) return 5;
    if (xp <= 10000) return 10;
    if (xp <= 100000) return 25;
    if (xp <= 1000000) return 50;
    return 75;
  };

  const load = useCallback(async () => { setLoading(true); setItems(await api.getQuestlines()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.title?.trim()) return;
    setSaving(true);
    if (editId) await api.updateQuestline(editId, form);
    else await api.createQuestline(form as Omit<RpgQuestline, "id" | "created_at">);
    setForm({ title: "", status: "active", progress: 0, total_steps: 5, reward_xp: 100 });
    setDiff(10); setUrg(10); setFear(10);
    setEditId(null);
    await load();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          {editId ? "✏️ Editando Questline" : "➕ Nova Questline"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Título *</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Lançar MANA MVP" />
          </div>
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Descrição</label>
            <textarea className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none" rows={2}
              value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Opcional" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="active">Ativa</option>
              <option value="paused">Pausada</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Total de Etapas</label>
            <input type="number" min={1} className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.total_steps || 5} onChange={e => setForm(f => ({ ...f, total_steps: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Progresso Atual</label>
            <input type="number" min={0} className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.progress || 0} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} />
          </div>

          {/* LifeRPG Sliders */}
          <div className="col-span-full border-t border-border/50 pt-4 mt-2">
            <h4 className="text-xs font-mono text-primary mb-3">🎲 LifeRPG Engine: Avaliação da Questline</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Dificuldade</span><span>{diff}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" className="w-full accent-primary" value={diff} onChange={e => setDiff(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Trivial</span><span>Transformational</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Urgência</span><span>{urg}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" className="w-full accent-primary" value={urg} onChange={e => setUrg(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Optional</span><span>Critical</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Medo / Desconforto</span><span>{fear}%</span>
                </div>
                <input type="range" min="10" max="100" step="10" className="w-full accent-primary" value={fear} onChange={e => setFear(Number(e.target.value))} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                  <span>Negligible</span><span>Mortal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full bg-muted/20 border border-border/50 rounded-lg p-3 flex justify-around">
            <div className="text-center">
              <span className="block text-[10px] uppercase text-muted-foreground font-mono mb-1">XP Calculado</span>
              <span className="font-bold text-lg text-purple-400">{form.reward_xp} XP</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase text-muted-foreground font-mono mb-1">RP Equivalente</span>
              <span className="font-bold text-lg text-cyan-400">{getChildMissionRP(form.reward_xp || 0)} 💎</span>
              <span className="block text-[9px] text-muted-foreground mt-0.5">(Child Mission RP Rule)</span>
            </div>
          </div>

        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={saving || !form.title?.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? "Salvar" : "Criar Questline"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: "", status: "active", progress: 0, total_steps: 5, reward_xp: 100 }); }}
            className="px-4 py-2 border rounded text-sm hover:bg-muted"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Carregando...</div> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma questline criada ainda.</p>}
          {items.map(q => (
            <div key={q.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{q.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {q.progress}/{q.total_steps} etapas · {q.reward_xp} XP ·
                  <span className={cn("ml-1", q.status === "active" ? "text-green-400" : q.status === "completed" ? "text-primary" : "text-muted-foreground")}>
                    {q.status === "active" ? "Ativa" : q.status === "completed" ? "Concluída" : "Pausada"}
                  </span>
                </div>
                <div className="h-1 w-48 bg-muted/30 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(q.progress / q.total_steps) * 100}%` }} />
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditId(q.id); setForm(q); }} className="p-1.5 hover:text-primary rounded"><Edit2 className="w-4 h-4" /></button>
                <button onClick={async () => { await api.deleteQuestline(q.id); load(); }} className="p-1.5 hover:text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Time Zones ───────────────────────────────────

function TimeZonesTab() {
  const [questsByZone, setQuestsByZone] = useState<Record<string, RpgDailyQuest[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await api.getDailyQuests();
      const grouped: Record<string, RpgDailyQuest[]> = {};
      TIME_ZONES.forEach(tz => { grouped[tz.id] = all.filter(q => q.time_zone === tz.id); });
      setQuestsByZone(grouped);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm">Carregando...</div>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Os 4 blocos de tempo da sua OS. Quests são atribuídas a blocos na aba Daily Quests.
        Aqui você visualiza o que está programado em cada janela do dia.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIME_ZONES.map(tz => (
          <div key={tz.id} className={cn("rounded-xl border p-5", tz.border, tz.bg)}>
            <div className={cn("text-xl font-bold mb-1", tz.color)}>{tz.label}</div>
            <p className="text-xs text-muted-foreground mb-4">{tz.description}</p>
            <div className="space-y-2">
              {(questsByZone[tz.id] || []).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhuma quest neste bloco ainda.</p>
              ) : (
                (questsByZone[tz.id] || []).map(q => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <StatusDot ok={q.is_active} />
                    <span>{q.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">+{q.xp_reward} XP</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        💡 Para adicionar quests a cada bloco, use a aba <strong>Daily Quests</strong>.
      </p>
    </div>
  );
}

// ─── Section: Skills ───────────────────────────────────────

function SkillsTab() {
  const [skills, setSkills] = useState<RpgSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<RpgSkill>>({ name: "", zone: "genius", max_level: 5, emoji: "⚡", icon: "Zap", color: "text-cyan-400", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); setSkills(await api.getSkills()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    const payload = { ...form, level: 0, xp: 0, xp_next_level: 100, sort_order: 0 };
    if (editId) await api.updateSkill(editId, payload);
    else await api.createSkill(payload as Omit<RpgSkill, "id" | "created_at">);
    setForm({ name: "", zone: "genius", max_level: 5, emoji: "⚡", icon: "Zap", color: "text-cyan-400", description: "" });
    setEditId(null);
    await load();
    setSaving(false);
  };

  const zoneColor: Record<string, string> = { genius: "text-blue-400", excellence: "text-green-400", impact: "text-yellow-400" };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          {editId ? "✏️ Editando Skill" : "➕ Nova Skill"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Nome *</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Programação" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Descrição</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Opcional" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Zona</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.zone || "genius"} onChange={e => setForm(f => ({ ...f, zone: e.target.value as any }))}>
              <option value="genius">🔵 Genialidade</option>
              <option value="excellence">🟢 Excelência</option>
              <option value="impact">🟡 Impacto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Nível Máximo</label>
            <input type="number" min={1} max={10} className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.max_level || 5} onChange={e => setForm(f => ({ ...f, max_level: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Emoji</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={form.emoji || "⚡"} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="⚡" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={saving || !form.name?.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? "Salvar" : "Criar Skill"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ name: "", zone: "genius", max_level: 5, emoji: "⚡" }); }}
            className="px-4 py-2 border rounded text-sm hover:bg-muted"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Carregando...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Nenhuma skill criada ainda.</p>}
          {skills.map(s => (
            <div key={s.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <div className={cn("font-semibold", zoneColor[s.zone])}>{s.name}</div>
                  <div className="text-xs text-muted-foreground">Nível {s.level}/{s.max_level} · {s.zone}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditId(s.id); setForm(s); }} className="p-1.5 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                <button onClick={async () => { await api.deleteSkill(s.id); load(); }} className="p-1.5 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Season Pass ──────────────────────────────────

function SeasonPassTab() {
  const [season, setSeason] = useState<RpgSeasonPass | null>(null);
  const [rewards, setRewards] = useState<RpgSeasonReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rewardForm, setRewardForm] = useState({ required_level: 10, reward_type: "loot", reward_name: "", reward_value: "", is_premium: false });

  const load = useCallback(async () => {
    setLoading(true);
    const s = await api.getActiveSeason();
    setSeason(s);
    if (s) setRewards(await api.getSeasonRewards(s.id));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSeasonSave = async () => {
    if (!season) return;
    setSaving(true);
    await api.updateSeason(season.id, season);
    setSaving(false);
  };

  const handleCreateSeason = async () => {
    setSaving(true);
    await api.createSeason({ season_name: "Nova Season", level: 1, max_level: 100, current_xp: 0, started_at: new Date().toISOString(), is_active: true });
    await load();
    setSaving(false);
  };

  const handleAddReward = async () => {
    if (!season || !rewardForm.reward_name) return;
    setSaving(true);
    await api.createSeasonReward({ ...rewardForm, season_id: season.id });
    setRewardForm({ required_level: 10, reward_type: "loot", reward_name: "", reward_value: "", is_premium: false });
    await load();
    setSaving(false);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Carregando...</div>;

  if (!season) return (
    <div className="text-center py-12">
      <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">Nenhuma season ativa.</p>
      <button onClick={handleCreateSeason} className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium">
        <Plus className="w-4 h-4 inline mr-1" /> Criar Season
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Season info edit */}
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Configurar Season Ativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Nome da Season</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={season.season_name} onChange={e => setSeason(s => s ? { ...s, season_name: e.target.value } : s)} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Nível Máximo</label>
            <input type="number" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={season.max_level} onChange={e => setSeason(s => s ? { ...s, max_level: Number(e.target.value) } : s)} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Data de Término</label>
            <input type="date" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={season.ends_at?.split("T")[0] || ""}
              onChange={e => setSeason(s => s ? { ...s, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null } : s)} />
          </div>
        </div>
        <button onClick={handleSeasonSave} disabled={saving}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Season
        </button>
      </div>

      {/* Rewards */}
      <div className="glass-card p-5 border-yellow-500/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Recompensas por Nível</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Nível Req.</label>
            <input type="number" className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={rewardForm.required_level} onChange={e => setRewardForm(f => ({ ...f, required_level: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Tipo</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={rewardForm.reward_type} onChange={e => setRewardForm(f => ({ ...f, reward_type: e.target.value }))}>
              <option value="loot">Loot</option>
              <option value="xp_boost">XP Boost</option>
              <option value="cosmetic">Cosmético</option>
              <option value="title">Título</option>
              <option value="currency">Moeda</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Nome da Recompensa *</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={rewardForm.reward_name} onChange={e => setRewardForm(f => ({ ...f, reward_name: e.target.value }))} placeholder="Ex: Título Lendário" />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" id="r-premium" checked={rewardForm.is_premium} onChange={e => setRewardForm(f => ({ ...f, is_premium: e.target.checked }))} className="accent-primary" />
            <label htmlFor="r-premium" className="text-xs">Premium</label>
          </div>
        </div>
        <button onClick={handleAddReward} disabled={saving || !rewardForm.reward_name}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded text-sm hover:bg-yellow-500/30 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Adicionar Recompensa
        </button>

        <div className="mt-4 space-y-2">
          {rewards.map(r => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">Nível {r.required_level}</span>
                <span className="text-sm">{r.reward_name}</span>
                {r.is_premium && <Badge label="Premium" color="text-yellow-400 bg-yellow-500/10" />}
                <Badge label={r.reward_type} color="text-muted-foreground bg-muted" />
              </div>
              <button onClick={async () => { await api.deleteSeasonReward(r.id); load(); }} className="p-1 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Bosses ───────────────────────────────────────

function BossesTab() {
  const [bosses, setBosses] = useState<RpgBoss[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<RpgBoss>>({ name: "", status: "active", priority: "medium", total_hp: 100, current_hp: 100, monthly_cost: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); setBosses(await api.getBosses()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    if (editId) await api.updateBoss(editId, form);
    else await api.createBoss(form as Omit<RpgBoss, "id" | "created_at">);
    setForm({ name: "", status: "active", priority: "medium", total_hp: 100, current_hp: 100, monthly_cost: 0 });
    setEditId(null);
    await load();
    setSaving(false);
  };

  const priorityColor: Record<string, string> = { critical: "text-red-400", high: "text-orange-400", medium: "text-yellow-400", low: "text-muted-foreground" };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border-red-500/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          {editId ? "✏️ Editando Boss" : "💀 Criar Novo Boss"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Nome do Boss *</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-red-500/50 outline-none"
              value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Dívida Master Pumps" />
          </div>
          <div className="col-span-full">
            <label className="block text-xs text-muted-foreground mb-1">Descrição / Estratégia</label>
            <textarea rows={2} className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-red-500/50 outline-none"
              value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Como derrotar este boss..." />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Prioridade</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.priority || "medium"} onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="active">Ativo</option>
              <option value="paused">Pausado</option>
              <option value="defeated">Derrotado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">HP Total</label>
            <input type="number" min={1} className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.total_hp || 100} onChange={e => setForm(f => ({ ...f, total_hp: Number(e.target.value), current_hp: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">HP Atual</label>
            <input type="number" min={0} className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.current_hp ?? 100} onChange={e => setForm(f => ({ ...f, current_hp: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Custo Mensal (R$)</label>
            <input type="number" min={0} className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.monthly_cost || 0} onChange={e => setForm(f => ({ ...f, monthly_cost: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={saving || !form.name?.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded text-sm hover:bg-red-500/30 disabled:opacity-50">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Skull className="w-4 h-4" />}
            {editId ? "Salvar" : "Invocar Boss"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ name: "", status: "active", priority: "medium", total_hp: 100, current_hp: 100, monthly_cost: 0 }); }}
            className="px-4 py-2 border rounded text-sm hover:bg-muted"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Carregando...</div> : (
        <div className="space-y-3">
          {bosses.length === 0 && <p className="text-sm text-muted-foreground">Nenhum boss ativo.</p>}
          {bosses.map(b => (
            <div key={b.id} className="glass-card p-4 border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold", priorityColor[b.priority])}>💀 {b.name}</span>
                  <Badge label={b.priority} color={cn("bg-red-500/10", priorityColor[b.priority])} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditId(b.id); setForm(b); }} className="p-1.5 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={async () => { await api.deleteBoss(b.id); load(); }} className="p-1.5 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {b.description && <p className="text-xs text-muted-foreground mb-2">{b.description}</p>}
              <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(b.current_hp / b.total_hp) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>HP: {b.current_hp}/{b.total_hp}</span>
                {b.monthly_cost > 0 && <span>R$ {b.monthly_cost}/mês</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Attributes ───────────────────────────────────

function AttributesTab() {
  const [attrs, setAttrs] = useState<RpgAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<RpgAttribute>>({ name: "", type: "stat", value: 0, icon: "Star", color: "text-blue-400" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); setAttrs(await api.getAttributes()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    const payload = { ...form, sort_order: attrs.length };
    if (editId) await api.updateAttribute(editId, payload);
    else await api.createAttribute(payload as Omit<RpgAttribute, "id" | "created_at">);
    setForm({ name: "", type: "stat", value: 0, icon: "Star", color: "text-blue-400" });
    setEditId(null);
    await load();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          {editId ? "✏️ Editando Atributo" : "⭐ Criar Atributo"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-full md:col-span-1">
            <label className="block text-xs text-muted-foreground mb-1">Nome *</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Ouro, Foco, Mana" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Tipo</label>
            <select className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.type || "stat"} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
              <option value="stat">📈 Stat (cumulativo)</option>
              <option value="currency">💰 Moeda (gastável)</option>
              <option value="pool">🔋 Pool (ex: 50/100)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Valor Inicial</label>
            <input type="number" className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.value || 0} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} />
          </div>
          {form.type === "pool" && (
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Máximo</label>
              <input type="number" className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
                value={form.max_value ?? 100} onChange={e => setForm(f => ({ ...f, max_value: Number(e.target.value) }))} />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Cor CSS</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.color || "text-blue-400"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="text-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Ícone (lucide)</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
              value={form.icon || "Star"} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Star, Zap, Brain..." />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={saving || !form.name?.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? "Salvar" : "Criar Atributo"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ name: "", type: "stat", value: 0, icon: "Star", color: "text-blue-400" }); }}
            className="px-4 py-2 border rounded text-sm hover:bg-muted"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Carregando...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {attrs.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Nenhum atributo criado ainda.</p>}
          {attrs.map(a => (
            <div key={a.id} className="glass-card p-4 relative">
              <div className={cn("font-semibold mb-1", a.color)}>{a.name}</div>
              <div className="text-xs text-muted-foreground uppercase">{a.type}</div>
              <div className="text-lg font-bold mt-1">{a.value}{a.max_value ? ` / ${a.max_value}` : ""}</div>
              {a.type === "pool" && a.max_value && (
                <div className="h-1 w-full bg-muted/30 rounded-full mt-2 overflow-hidden">
                  <div className={cn("h-full rounded-full", a.color.replace("text-", "bg-"))} style={{ width: `${(a.value / a.max_value) * 100}%` }} />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => { setEditId(a.id); setForm(a); }} className="p-1 hover:text-primary"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={async () => { await api.deleteAttribute(a.id); load(); }} className="p-1 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main: AdminStudio ─────────────────────────────────────

export function AdminStudio() {
  const [activeTab, setActiveTab] = useState("quests");

  const renderTab = () => {
    switch (activeTab) {
      case "quests": return <DailyQuestsTab />;
      case "questlines": return <QuestlinesTab />;
      case "timezones": return <TimeZonesTab />;
      case "skills": return <SkillsTab />;
      case "season": return <SeasonPassTab />;
      case "bosses": return <BossesTab />;
      case "attributes": return <AttributesTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">⚙️ Admin Studio</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Personalize todas as mecânicas da sua OS — sem código.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-lg">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              activeTab === tab.id
                ? "bg-background shadow text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {renderTab()}
      </div>
    </div>
  );
}
