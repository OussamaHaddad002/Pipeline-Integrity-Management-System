/**
 * API service for communicating with the backend
 * @fileoverview Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Pipeline, 
  RiskAssessment, 
  Prediction, 
  Incident, 
  DashboardMetrics,
  ApiResponse,
  PaginatedResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // In development, directly connect to backend port 3001
    // In production, use relative path which will work with proxy
    const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';
    
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Pipeline endpoints
  async getPipelines(params?: { 
    page?: number; 
    limit?: number; 
    status?: string 
  }): Promise<PaginatedResponse<Pipeline>> {
    const response: AxiosResponse<PaginatedResponse<Pipeline>> = await this.api.get('/pipelines', { params });
    return response.data;
  }

  async getPipeline(id: number): Promise<Pipeline> {
    const response: AxiosResponse<ApiResponse<Pipeline>> = await this.api.get(`/pipelines/${id}`);
    return response.data.data;
  }

  async createPipeline(pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pipeline> {
    const response: AxiosResponse<ApiResponse<Pipeline>> = await this.api.post('/pipelines', pipeline);
    return response.data.data;
  }

  async updatePipeline(id: number, pipeline: Partial<Pipeline>): Promise<Pipeline> {
    const response: AxiosResponse<ApiResponse<Pipeline>> = await this.api.put(`/pipelines/${id}`, pipeline);
    return response.data.data;
  }

  async deletePipeline(id: number): Promise<void> {
    await this.api.delete(`/pipelines/${id}`);
  }

  // Risk assessment endpoints
  async getRiskAssessments(params?: { 
    pipelineId?: number; 
    page?: number; 
    limit?: number 
  }): Promise<{ assessments: RiskAssessment[]; count: number }> {
    const response = await this.api.get('/risk-assessments', { params });
    // Handle actual backend response format: {success: true, data: [...], count: ...}
    return {
      assessments: response.data.data || [],
      count: response.data.count || 0
    };
  }

  async createRiskAssessment(assessment: Omit<RiskAssessment, 'id' | 'assessmentDate'>): Promise<RiskAssessment> {
    const response: AxiosResponse<ApiResponse<RiskAssessment>> = await this.api.post('/risk-assessments', assessment);
    return response.data.data;
  }

  async getPipelineRiskHistory(pipelineId: number): Promise<RiskAssessment[]> {
    const response: AxiosResponse<ApiResponse<RiskAssessment[]>> = await this.api.get(`/risk-assessments/pipeline/${pipelineId}`);
    return response.data.data;
  }

  // Prediction endpoints
  async getPredictions(params?: { pipelineId?: number }): Promise<{ success: boolean; data: Prediction[] }> {
    const response = await this.api.get('/predictions', { params });
    // Handle actual backend response format: {success: true, data: [...], count: ...}
    return {
      success: response.data.success || true,
      data: response.data.data || []
    };
  }

  async getModelPerformance(): Promise<any> {
    const response = await this.api.get('/predictions/model-performance');
    return response.data;
  }

  async createPrediction(predictionData: { pipelineId: number; pipelineName: string }): Promise<any> {
    const response = await this.api.post('/predictions', predictionData);
    return response.data;
  }

  async calculatePrediction(pipelineId: number): Promise<Prediction> {
    const response: AxiosResponse<ApiResponse<Prediction>> = await this.api.post('/predictions/calculate', { pipelineId });
    return response.data.data;
  }

  async getPipelinePredictions(pipelineId: number): Promise<Prediction[]> {
    const response: AxiosResponse<ApiResponse<Prediction[]>> = await this.api.get(`/predictions/pipeline/${pipelineId}`);
    return response.data.data;
  }

  // Spatial queries
  async getNearbyPipelines(lat: number, lng: number, radius: number): Promise<Pipeline[]> {
    const response: AxiosResponse<ApiResponse<Pipeline[]>> = await this.api.get(`/spatial/nearby/${lat}/${lng}/${radius}`);
    return response.data.data;
  }

  async getIntersectingFeatures(bounds: { 
    north: number; 
    south: number; 
    east: number; 
    west: number 
  }): Promise<{ pipelines: Pipeline[]; incidents: Incident[] }> {
    const response = await this.api.get('/spatial/intersects', { params: bounds });
    return response.data.data;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response: AxiosResponse<ApiResponse<DashboardMetrics>> = await this.api.get('/dashboard/metrics');
    return response.data.data;
  }

  // Data import/export
  async importData(file: File, type: 'pipelines' | 'incidents'): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/data/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }

  async exportData(type: 'pipelines' | 'risk-assessments' | 'incidents', format: 'csv' | 'geojson' = 'csv'): Promise<Blob> {
    const response = await this.api.get(`/data/export`, {
      params: { type, format },
      responseType: 'blob'
    });
    return response.data;
  }
}

export const apiService = new ApiService();
