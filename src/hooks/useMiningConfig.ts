import { useState, useEffect, useCallback } from 'react';
import { MiningConfig, MiningPool, Worker, AlertSetting, MiningAlgorithm } from '@/types/mining';

const STORAGE_KEY = 'mining_config';

const defaultConfig: MiningConfig = {
  pools: [
    {
      id: '1',
      name: 'Stratum Mining Pool',
      url: 'stratum.mining.com',
      port: 3333,
      username: 'your_username',
      password: 'x',
      fee: 1.0,
    },
  ],
  workers: [
    {
      id: '1',
      name: 'GPU-1',
      algorithm: 'SHA-256',
      poolId: '1',
      enabled: false,
      intensity: 100,
      createdAt: Date.now(),
    },
  ],
  alerts: [
    {
      id: '1',
      type: 'temperature',
      threshold: 80,
      enabled: true,
    },
    {
      id: '2',
      type: 'hashrate',
      threshold: 50,
      enabled: true,
    },
  ],
  selectedAlgorithm: 'SHA-256',
  lastUpdated: Date.now(),
};

export const useMiningConfig = () => {
  const [config, setConfig] = useState<MiningConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load mining config:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const addPool = useCallback((pool: Omit<MiningPool, 'id'>) => {
    setConfig((prev) => ({
      ...prev,
      pools: [...prev.pools, { ...pool, id: Date.now().toString() }],
      lastUpdated: Date.now(),
    }));
  }, []);

  const updatePool = useCallback((id: string, pool: Partial<MiningPool>) => {
    setConfig((prev) => ({
      ...prev,
      pools: prev.pools.map((p) => (p.id === id ? { ...p, ...pool } : p)),
      lastUpdated: Date.now(),
    }));
  }, []);

  const deletePool = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      pools: prev.pools.filter((p) => p.id !== id),
      lastUpdated: Date.now(),
    }));
  }, []);

  const addWorker = useCallback((worker: Omit<Worker, 'id' | 'createdAt'>) => {
    setConfig((prev) => ({
      ...prev,
      workers: [
        ...prev.workers,
        { ...worker, id: Date.now().toString(), createdAt: Date.now() },
      ],
      lastUpdated: Date.now(),
    }));
  }, []);

  const updateWorker = useCallback((id: string, worker: Partial<Worker>) => {
    setConfig((prev) => ({
      ...prev,
      workers: prev.workers.map((w) => (w.id === id ? { ...w, ...worker } : w)),
      lastUpdated: Date.now(),
    }));
  }, []);

  const deleteWorker = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      workers: prev.workers.filter((w) => w.id !== id),
      lastUpdated: Date.now(),
    }));
  }, []);

  const updateAlert = useCallback((id: string, alert: Partial<AlertSetting>) => {
    setConfig((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, ...alert } : a)),
      lastUpdated: Date.now(),
    }));
  }, []);

  const setAlgorithm = useCallback((algorithm: MiningAlgorithm) => {
    setConfig((prev) => ({
      ...prev,
      selectedAlgorithm: algorithm,
      lastUpdated: Date.now(),
    }));
  }, []);

  return {
    config,
    addPool,
    updatePool,
    deletePool,
    addWorker,
    updateWorker,
    deleteWorker,
    updateAlert,
    setAlgorithm,
    isLoaded,
  };
};
