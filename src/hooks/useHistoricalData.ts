import { useState, useEffect, useCallback } from 'react';
import { HistoricalData } from '@/types/mining';

const STORAGE_KEY = 'mining_history';
const MAX_DATA_POINTS = 1440; // 24 hours of data at 1-minute intervals

export const useHistoricalData = () => {
  const [history, setHistory] = useState<HistoricalData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addDataPoint = useCallback((data: HistoricalData) => {
    setHistory((prev) => {
      const updated = [...prev, data];
      // Keep only the most recent MAX_DATA_POINTS
      if (updated.length > MAX_DATA_POINTS) {
        return updated.slice(updated.length - MAX_DATA_POINTS);
      }
      return updated;
    });
  }, []);

  const getAverages = useCallback(() => {
    if (history.length === 0) {
      return { avgHashrate: 0, avgTemp: 0, avgPower: 0, totalEarnings: 0 };
    }

    const avgHashrate = history.reduce((sum, d) => sum + d.hashrate, 0) / history.length;
    const avgTemp = history.reduce((sum, d) => sum + d.temperature, 0) / history.length;
    const avgPower = history.reduce((sum, d) => sum + d.power, 0) / history.length;
    const totalEarnings = history.reduce((sum, d) => sum + d.earnings, 0, 0);

    return { avgHashrate, avgTemp, avgPower, totalEarnings };
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addDataPoint,
    getAverages,
    clearHistory,
    isLoaded,
  };
};
