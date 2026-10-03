/**
 * useKAIROS — Hook que conecta o PGT-UI ao backend dashboard.js
 * Faz fetch do /api/quests e /api/skyros periodicamente.
 * O frontend passa a ser 100% dinâmico, lendo do roadmap.md via API.
 */
import { useState, useEffect, useCallback } from 'react';

export interface BossTask {
  id: number;
  project: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: string;
  owner: string;
}

export interface KAIROSState {
  bosses: BossTask[];
  quests: BossTask[];
  isolationActive: boolean;
  operationalState: string;
  syncLevel: number;
  activeBosses: number;
  backendOnline: boolean;
}

const DEFAULT_STATE: KAIROSState = {
  bosses: [],
  quests: [],
  isolationActive: false,
  operationalState: 'UNKNOWN',
  syncLevel: 0,
  activeBosses: 0,
  backendOnline: false,
};

export function useKAIROS(pollIntervalMs = 30000) {
  const [state, setState] = useState<KAIROSState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [questsRes, skyrosRes] = await Promise.all([
        fetch('/api/quests'),
        fetch('/api/skyros'),
      ]);

      if (!questsRes.ok || !skyrosRes.ok) throw new Error('API offline');

      const quests = await questsRes.json();
      const skyros = await skyrosRes.json();

      setState({
        bosses: quests.bosses ?? [],
        quests: quests.quests ?? [],
        isolationActive: skyros.isolationActive ?? false,
        operationalState: skyros.operationalState ?? 'OPERATIONAL',
        syncLevel: skyros.syncLevel ?? 0,
        activeBosses: skyros.activeBosses ?? 0,
        backendOnline: true,
      });
    } catch {
      setState(prev => ({ ...prev, backendOnline: false }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchData, pollIntervalMs]);

  return { ...state, loading, refetch: fetchData };
}
