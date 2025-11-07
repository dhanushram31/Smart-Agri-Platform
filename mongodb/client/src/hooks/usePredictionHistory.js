/**
 * Custom Hook: usePredictionHistory
 * Manages prediction history CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getPredictionHistory,
  updatePrediction,
  deletePrediction,
  getPredictionStats,
} from '../services/historyService';

export const usePredictionHistory = (userId) => {
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch predictions
  const fetchPredictions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPredictionHistory(userId, filters);

      if (result.success) {
        setPredictions(result.predictions);
      } else {
        throw new Error('Failed to fetch predictions');
      }
    } catch (err) {
      setError(err.message);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      const result = await getPredictionStats(userId);

      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [userId]);

  // Update prediction
  const updatePredictionStatus = async (predictionId, updates) => {
    try {
      const result = await updatePrediction(predictionId, updates);

      if (result.success) {
        // Update local state
        setPredictions((prev) =>
          prev.map((p) =>
            p._id === predictionId ? { ...p, ...updates } : p
          )
        );

        // Refresh stats
        fetchStats();

        return { success: true };
      } else {
        throw new Error('Failed to update prediction');
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete prediction
  const removePrediction = async (predictionId) => {
    try {
      const result = await deletePrediction(predictionId);

      if (result.success) {
        // Remove from local state
        setPredictions((prev) => prev.filter((p) => p._id !== predictionId));

        // Refresh stats
        fetchStats();

        return { success: true };
      } else {
        throw new Error('Failed to delete prediction');
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    predictions,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    updatePredictionStatus,
    removePrediction,
    refetch: fetchPredictions,
  };
};
