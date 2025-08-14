/**
 * Custom React hooks for the Pipeline Risk Dashboard
 * @fileoverview Reusable hooks for state management and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { wsService } from '../services/websocket';
import { 
  Pipeline, 
  RiskAssessment, 
  DashboardMetrics, 
  Prediction,
  PaginatedResponse 
} from '../types';

/**
 * Hook for managing pipeline data with pagination and real-time updates
 */
export const usePipelines = (page = 1, limit = 20) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPipelines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPipelines({ page, limit });
      setPipelines(response.data);
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pipelines');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  useEffect(() => {
    const handlePipelineUpdate = (updatedPipeline: Pipeline) => {
      setPipelines(prev => 
        prev.map(pipeline => 
          pipeline.id === updatedPipeline.id ? updatedPipeline : pipeline
        )
      );
    };

    wsService.on('pipeline:updated', handlePipelineUpdate);

    return () => {
      wsService.off('pipeline:updated', handlePipelineUpdate);
    };
  }, []);

  return {
    pipelines,
    loading,
    error,
    total,
    hasMore,
    refetch: fetchPipelines
  };
};

/**
 * Hook for managing dashboard metrics with real-time updates
 */
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * Hook for managing risk assessments for a specific pipeline
 */
export const usePipelineRiskHistory = (pipelineId: number) => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPipelineRiskHistory(pipelineId);
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk history');
    } finally {
      setLoading(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    if (pipelineId) {
      fetchAssessments();
    }
  }, [fetchAssessments, pipelineId]);

  useEffect(() => {
    const handleRiskUpdate = (assessment: RiskAssessment) => {
      if (assessment.pipelineId === pipelineId) {
        setAssessments(prev => [assessment, ...prev]);
      }
    };

    wsService.on('risk:calculated', handleRiskUpdate);

    return () => {
      wsService.off('risk:calculated', handleRiskUpdate);
    };
  }, [pipelineId]);

  return { assessments, loading, error, refetch: fetchAssessments };
};

/**
 * Hook for managing AI predictions for a pipeline
 */
export const usePipelinePredictions = (pipelineId: number) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPipelinePredictions(pipelineId);
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  }, [pipelineId]);

  const calculatePrediction = useCallback(async () => {
    try {
      setCalculating(true);
      setError(null);
      const prediction = await apiService.calculatePrediction(pipelineId);
      setPredictions(prev => [prediction, ...prev]);
      return prediction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate prediction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCalculating(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    if (pipelineId) {
      fetchPredictions();
    }
  }, [fetchPredictions, pipelineId]);

  return {
    predictions,
    loading,
    error,
    calculating,
    refetch: fetchPredictions,
    calculatePrediction
  };
};

/**
 * Hook for managing WebSocket connection lifecycle
 */
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    wsService.connect();
    
    const checkConnection = () => {
      setConnected(wsService.connected);
    };

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000);
    checkConnection(); // Initial check

    return () => {
      clearInterval(interval);
      wsService.disconnect();
    };
  }, []);

  return { connected };
};

/**
 * Hook for managing local storage state
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
