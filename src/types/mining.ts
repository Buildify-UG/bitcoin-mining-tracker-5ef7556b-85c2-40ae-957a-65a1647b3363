export type MiningAlgorithm = 'SHA-256' | 'Scrypt' | 'X11' | 'Ethash' | 'RandomX';

export interface MiningPool {
  id: string;
  name: string;
  url: string;
  port: number;
  username: string;
  password: string;
  fee: number;
}

export interface Worker {
  id: string;
  name: string;
  algorithm: MiningAlgorithm;
  poolId: string;
  enabled: boolean;
  intensity: number;
  createdAt: number;
}

export interface HistoricalData {
  timestamp: number;
  hashrate: number;
  temperature: number;
  earnings: number;
  power: number;
}

export interface AlertSetting {
  id: string;
  type: 'temperature' | 'hashrate' | 'offline';
  threshold: number;
  enabled: boolean;
}

export interface MiningConfig {
  pools: MiningPool[];
  workers: Worker[];
  alerts: AlertSetting[];
  selectedAlgorithm: MiningAlgorithm;
  lastUpdated: number;
}
