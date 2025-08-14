/**
 * AI Service - Integration with Python ML API
 * @fileoverview Service for communicating with the Python Flask ML API server
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export interface PipelineData {
  id: number;
  name: string;
  diameter: number;
  material: string;
  installationDate: string;
  pressureRating: number;
  age: number;
  length: number;
  depth: number;
  corrosionRate: number;
  pressureVariance: number;
  soilConditions: string;
  maintenanceHistory: string;
  temperature: number;
  operatingPressure: number;
  flowRate: number;
}

export interface RiskPrediction {
  pipelineId: number;
  pipelineName: string;
  failureProbability: number;
  confidenceScore: number;
  predictedFailureDate: string | null;
  predictionModel: string;
  inputParameters: Record<string, any>;
  recommendation: string;
  createdAt: string;
  riskFactors: {
    primary: string;
    secondary: string[];
  };
  maintenanceActions: string[];
}

export interface RiskAssessment {
  id: number;
  pipelineId: number;
  pipelineName: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessmentDate: string;
  nextInspectionDue: string;
  inspector: string;
  factorsConsidered: Array<{
    type: string;
    value: number;
    severityLevel: number;
    description: string;
  }>;
  recommendations: string[];
}

export interface ModelPerformance {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingSamples: number;
  lastTrained: string;
  features: string[];
}

class AIService {
  private api: AxiosInstance;
  private readonly aiServerUrl: string;
  private isConnected: boolean = false;

  constructor() {
    this.aiServerUrl = process.env.AI_API_URL || 'http://localhost:5000';
    this.api = axios.create({
      baseURL: this.aiServerUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.checkConnection();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        logger.info(`AI API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('AI API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        logger.info(`AI API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('AI API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await this.api.get('/health');
      this.isConnected = response.status === 200;
      logger.info('AI Service connected successfully');
    } catch (error) {
      this.isConnected = false;
      logger.warn('AI Service not available, will use fallback data');
    }
  }

  public async isServiceAvailable(): Promise<boolean> {
    if (!this.isConnected) {
      await this.checkConnection();
    }
    return this.isConnected;
  }

  /**
   * Generate risk predictions for pipelines
   */
  public async generatePredictions(pipelinesData: PipelineData[]): Promise<RiskPrediction[]> {
    try {
      if (!await this.isServiceAvailable()) {
        throw new Error('AI service not available');
      }

      const response = await this.api.post('/predict', {
        pipelines: pipelinesData
      });

      return response.data.predictions;
    } catch (error) {
      logger.error('Failed to generate predictions:', error);
      throw error;
    }
  }

  /**
   * Generate risk assessments for pipelines
   */
  public async generateRiskAssessments(pipelinesData: PipelineData[]): Promise<RiskAssessment[]> {
    try {
      if (!await this.isServiceAvailable()) {
        throw new Error('AI service not available');
      }

      const response = await this.api.post('/assess-risk', {
        pipelines: pipelinesData
      });

      return response.data.assessments;
    } catch (error) {
      logger.error('Failed to generate risk assessments:', error);
      throw error;
    }
  }

  /**
   * Get model performance metrics
   */
  public async getModelPerformance(): Promise<ModelPerformance[]> {
    try {
      if (!await this.isServiceAvailable()) {
        throw new Error('AI service not available');
      }

      const response = await this.api.get('/model-performance');
      return response.data.performance;
    } catch (error) {
      logger.error('Failed to get model performance:', error);
      throw error;
    }
  }

  /**
   * Train models with new data
   */
  public async trainModels(trainingData: PipelineData[]): Promise<{ success: boolean; message: string }> {
    try {
      if (!await this.isServiceAvailable()) {
        throw new Error('AI service not available');
      }

      const response = await this.api.post('/train', {
        data: trainingData
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to train models:', error);
      throw error;
    }
  }

  /**
   * Get feature importance for interpretability
   */
  public async getFeatureImportance(): Promise<Record<string, number>> {
    try {
      if (!await this.isServiceAvailable()) {
        throw new Error('AI service not available');
      }

      const response = await this.api.get('/feature-importance');
      return response.data.importance;
    } catch (error) {
      logger.error('Failed to get feature importance:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
