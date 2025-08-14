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
declare class AIService {
    private api;
    private readonly aiServerUrl;
    private isConnected;
    constructor();
    private setupInterceptors;
    private checkConnection;
    isServiceAvailable(): Promise<boolean>;
    generatePredictions(pipelinesData: PipelineData[]): Promise<RiskPrediction[]>;
    generateRiskAssessments(pipelinesData: PipelineData[]): Promise<RiskAssessment[]>;
    getModelPerformance(): Promise<ModelPerformance[]>;
    trainModels(trainingData: PipelineData[]): Promise<{
        success: boolean;
        message: string;
    }>;
    getFeatureImportance(): Promise<Record<string, number>>;
}
export declare const aiService: AIService;
export {};
//# sourceMappingURL=aiService.d.ts.map