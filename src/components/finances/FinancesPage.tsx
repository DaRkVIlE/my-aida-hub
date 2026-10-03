import { Wallet, TrendingUp, TrendingDown, Target, Skull, CheckCircle2, Shield, Flame } from "lucide-react";
import { useSharedBrain } from "@/hooks/useSharedBrain";
import { cn } from "@/lib/utils";

// Real debts of Gabriel's operation (Total R$ 38.000, no Banco do Brasil)
const debts = [
  { id: 1, name: "IPTU Acumulado (+1 ano)", amount: 12000, priority: "P0", status: "pending", discountTarget: "Acordo c/ 70% off" },
  { id: 2, name: "Serasa: Bancos & Credores", amount: 17800, priority: "P0", status: "pending", discountTarget: "Feirão Limpa Nome (R$ 4k-5k)" },
  { id: 3, name: "Sabesp & Enel (+1 ano)", amount: 3200, priority: "P0", status: "pending", discountTarget: "Parcelamento entrada simbólica" },
  { id: 4, name: "Financiamento Habitacional CDHU", amount: 5000, priority: "P1", status: "pending", discountTarget: "Quitação definitiva à vista" },
  { id: 5, name: "Cartão Nubank Físico", amount: 0, priority: "P0", status: "paid", discountTarget: "Conquistado e Desbloqueado! ✅" },
];

export function FinancesPage() {
  const brain = useSharedBrain();
  const { realCoins, revenueGoal, revenueProgress } = brain;
  
  const pendingDebts = debts.filter(d => d.status === "pending");
  const totalDebt = pendingDebts.reduce((acc, d) => acc + d.amount, 0);

  const WAR_CHEST_GOAL = 15000;
  const warChestProgress = Math.min((realCoins / WAR_CHEST_GOAL) * 100, 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* ══ HEADER ══ */}
      <div className="system-window p-6 border-green-500/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-green-500/10 border border-green-500/40 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
              [SISTEMA FINANCEIRO // COFRE DA SEASON]
            </div>
            <h2 className="text-3xl font-system text-white uppercase tracking-wider glow-cyan">
              Finances & War Chest
            </h2>
            <p className="text-muted-foreground font-rajdhani text-sm">
              Fluxo de Caixa Real, Extinção de Dívidas e Acúmulo de Reserva Estratégica.
            </p>
          </div>
        </div>
      </div>

      {/* ══ TOP METRICS ══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="system-window p-5 border-green-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400 uppercase">Faturamento Líquido</span>
          </div>
          <div className="text-3xl font-system text-white font-bold">
            R$ {realCoins.toLocaleString("pt-BR")}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">Foco: Expéria AI Ops + Aulas</p>
        </div>

        <div className="system-window p-5 border-red-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <Skull className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono text-red-400 uppercase">Dívida Mensal Ativa</span>
          </div>
          <div className="text-3xl font-system text-red-400 font-bold">
            R$ {totalDebt.toLocaleString("pt-BR")}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">Alvo de Liquidação Simultânea</p>
        </div>

        <div className="system-window p-5 border-system-cyan/30">
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="w-4 h-4 text-system-cyan" />
            <span className="text-xs font-mono text-system-cyan uppercase">Meta da Season</span>
          </div>
          <div className="text-3xl font-system text-system-cyan font-bold">
            R$ {revenueGoal.toLocaleString("pt-BR")}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">Temporada 1 — Fundação</p>
        </div>
      </div>

      {/* ══ REVENUE PROGRESS (R$ 40K) ══ */}
      <div className="system-window p-6 border-system-cyan/30">
        <div className="flex justify-between items-center mb-2 font-mono text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">
            Progresso da Meta da Season (R$ 40.000)
          </span>
          <span className="text-system-cyan font-bold">
            R$ {realCoins.toLocaleString("pt-BR")} / R$ 40.000 ({Math.round(revenueProgress)}%)
          </span>
        </div>
        <div className="h-3 w-full bg-system-void rounded-full overflow-hidden border border-system-cyan/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-system-cyan to-system-gold rounded-full transition-all duration-1000 shadow-[0_0_12px_#00f0ff]"
            style={{ width: `${revenueProgress}%` }}
          />
        </div>
      </div>

      {/* ══ WAR CHEST ATTACK PLAN (R$ 15K) ══ */}
      <div className="system-window p-6 border-system-gold/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-system-gold" />
            <span className="text-xs font-system text-system-gold uppercase tracking-wider">
              ESTRATÉGIA DO SISTEMA: RESERVA DE ATAQUE (WAR CHEST R$ 15.000)
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(warChestProgress)}% Concluído
          </span>
        </div>

        <div className="h-3 w-full bg-system-void rounded-full overflow-hidden border border-system-gold/30 p-0.5 mb-3">
          <div
            className="h-full bg-gradient-to-r from-system-gold to-yellow-300 rounded-full transition-all duration-1000 shadow-[0_0_12px_#ffb703]"
            style={{ width: `${warChestProgress}%` }}
          />
        </div>

        <p className="text-xs font-rajdhani text-muted-foreground">
          Ao invés de pagar parcelas pequenas que somem nos juros, acumulamos R$ 15.000 no War Chest para quitar os acordos Serasa, IPTU e Sabesp/Enel de uma só vez com <strong>60% a 80% de desconto à vista</strong>.
        </p>
      </div>

      {/* ══ DEBT BURN TRACKER ══ */}
      <div className="system-window p-6 border-red-500/20">
        <div className="flex items-center gap-2 mb-6">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <h3 className="font-system text-base text-white uppercase tracking-wider">
            Debt Burn Tracker — Dívidas Reais da Masmorra
          </h3>
        </div>

        <div className="space-y-3">
          {debts.map(debt => (
            <div 
              key={debt.id}
              className={cn(
                "flex items-center justify-between p-4 rounded border transition-all",
                debt.status === "paid" 
                  ? "bg-green-500/5 border-green-500/30 opacity-70" 
                  : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
              )}
            >
              <div className="flex items-center gap-4">
                {debt.status === "paid" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.2 rounded border",
                      debt.priority === "P0" ? "text-red-400 border-red-500/40 bg-red-500/10" :
                      "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
                    )}>
                      {debt.priority}
                    </span>
                    <span className={cn("font-rajdhani text-sm font-bold", debt.status === "paid" ? "line-through text-muted-foreground" : "text-white")}>
                      {debt.name}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    🎯 Estratégia: {debt.discountTarget}
                  </p>
                </div>
              </div>
              <div className={cn("font-mono font-bold text-sm", debt.status === "paid" ? "text-green-400" : "text-red-400")}>
                {debt.amount > 0 ? `R$ ${debt.amount.toLocaleString("pt-BR")}` : "QUITADO ✅"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
