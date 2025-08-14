export interface Coordinates {
    lat: number;
    lng: number;
}
export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number];
}
export interface GeoJSONLineString {
    type: 'LineString';
    coordinates: [number, number][];
}
export interface Pipeline {
    id: number;
    name: string;
    geometry: GeoJSONLineString;
    diameter: number;
    material: string;
    installation_date: Date;
    pressure_rating: number;
    status: 'active' | 'inactive' | 'maintenance';
    created_at: Date;
    updated_at: Date;
}
export interface RiskFactor {
    id: number;
    pipeline_id: number;
    factor_type: 'corrosion' | 'depth' | 'soil' | 'pressure' | 'age' | 'temperature';
    value: number;
    severity_level: 1 | 2 | 3 | 4 | 5;
    location?: GeoJSONPoint;
    recorded_date: Date;
}
export interface RiskAssessment {
    id: number;
    pipeline_id: number;
    overall_risk_score: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    assessment_date: Date;
    factors_considered: Record<string, any>;
    recommendations: string;
}
export interface Prediction {
    id: number;
    pipeline_id: number;
    failure_probability: number;
    confidence_score: number;
    predicted_failure_date: Date;
    prediction_model: string;
    input_parameters: Record<string, any>;
    recommendation: string;
    created_at: Date;
}
export interface Incident {
    id: number;
    pipeline_id: number;
    incident_type: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    location: GeoJSONPoint;
    incident_date: Date;
    description: string;
    cause: string;
    cost_estimate: number;
}
export interface DashboardMetrics {
    totalPipelines: number;
    activePipelines: number;
    highRiskPipelines: number;
    criticalAlerts: number;
    averageRiskScore: number;
    predictedFailures: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export interface QueryParams {
    page?: string;
    limit?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: string;
}
export interface SpatialQuery {
    lat: number;
    lng: number;
    radius: number;
}
export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}
export interface WebSocketEvents {
    'pipeline:updated': Pipeline;
    'risk:calculated': RiskAssessment;
    'incident:created': Incident;
    'alert:critical': {
        pipelineId: number;
        message: string;
    };
}
export interface AuthenticatedUser {
    id: number;
    email: string;
    role: 'admin' | 'engineer' | 'viewer';
}
export interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
//# sourceMappingURL=index.d.ts.map