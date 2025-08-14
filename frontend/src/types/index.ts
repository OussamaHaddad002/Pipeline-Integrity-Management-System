/**
 * Core type definitions for the Pipeline Risk Assessment Dashboard
 * @fileoverview Defines interfaces and types used throughout the application
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Pipeline {
  id: number;
  name: string;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  diameter: number;
  material: string;
  installationDate: string;
  pressureRating: number;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface RiskFactor {
  type: string;
  value: number;
  severityLevel: number;
  description: string;
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
  factorsConsidered: RiskFactor[];
  recommendations: string[];
}

export interface Prediction {
  id: number;
  pipelineId: number;
  failureProbability: number;
  confidenceScore: number;
  predictedFailureDate: string;
  predictionModel: string;
  inputParameters: Record<string, any>;
  recommendation: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  pipelineId: number;
  incidentType: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  incidentDate: string;
  description: string;
  cause: string;
  costEstimate: number;
}

export interface Alert {
  id: number;
  pipelineId: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  category: 'risk' | 'maintenance' | 'security' | 'operational';
}

export interface DashboardMetrics {
  totalPipelines: number;
  activePipelines: number;
  highRiskPipelines: number;
  criticalAlerts: number;
  averageRiskScore: number;
  predictedFailures: number;
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'pipeline' | 'risk' | 'incident' | 'prediction';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
