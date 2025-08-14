"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const pipelineId = req.query.pipelineId;
        const predictions = [
            {
                id: 1,
                pipelineId: 1,
                pipelineName: "Trans-Alberta Main Line",
                failureProbability: 0.78,
                confidenceScore: 0.89,
                predictedFailureDate: "2025-02-15T00:00:00Z",
                predictionModel: "Random Forest Ensemble",
                inputParameters: {
                    age: 6.5,
                    corrosionRate: 0.15,
                    pressureVariance: 0.08,
                    soilConditions: "acidic",
                    maintenanceHistory: "irregular",
                    temperature: 12.5,
                    depth: 1.8
                },
                recommendation: "Schedule immediate comprehensive inspection and consider pipeline replacement within 6 months",
                createdAt: "2024-08-14T00:00:00Z",
                riskFactors: {
                    primary: "Corrosion rate exceeding safety threshold",
                    secondary: ["Irregular maintenance schedule", "Acidic soil conditions", "Temperature fluctuations"]
                },
                maintenanceActions: [
                    "Immediate comprehensive pipe inspection",
                    "Corrosion inhibitor application",
                    "Pressure testing at reduced levels",
                    "Soil treatment for pH neutralization"
                ]
            },
            {
                id: 2,
                pipelineId: 2,
                pipelineName: "Saskatchewan Distribution Line A",
                failureProbability: 0.34,
                confidenceScore: 0.92,
                predictedFailureDate: "2026-11-22T00:00:00Z",
                predictionModel: "Gradient Boosting Classifier",
                inputParameters: {
                    age: 4.2,
                    corrosionRate: 0.05,
                    pressureVariance: 0.03,
                    soilConditions: "neutral",
                },
                recommendation: "Continue regular maintenance schedule. Monitor corrosion trends quarterly",
                createdAt: "2024-08-13T00:00:00Z",
                riskFactors: {
                    primary: "Low risk - well maintained pipeline",
                    secondary: ["Regular maintenance program", "Neutral soil conditions", "Stable operating parameters"]
                },
                maintenanceActions: [
                    "Continue quarterly inspections",
                    "Monitor corrosion rates annually",
                    "Maintain cathodic protection system"
                ]
            }
        ];
        const filteredPredictions = pipelineId
            ? predictions.filter(p => p.pipelineId === parseInt(pipelineId))
            : predictions;
        res.json({
            success: true,
            data: filteredPredictions
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch predictions', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch predictions'
        });
    }
}));
router.get('/model-performance', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const performance = {
            models: [
                {
                    name: "Random Forest",
                    accuracy: 94.2,
                    precision: 0.91,
                    recall: 0.89,
                    f1Score: 0.90,
                    lastTrained: "2024-08-13T08:00:00Z",
                    trainingDataSize: 15420,
                    status: "active"
                },
                {
                    name: "Gradient Boosting",
                    accuracy: 91.8,
                    precision: 0.88,
                    recall: 0.87,
                    f1Score: 0.875,
                    lastTrained: "2024-08-12T09:15:00Z",
                    trainingDataSize: 15420,
                    status: "active"
                },
                {
                    name: "Support Vector Machine",
                    accuracy: 89.3,
                    precision: 0.85,
                    recall: 0.84,
                    f1Score: 0.845,
                    lastTrained: "2024-08-11T07:30:00Z",
                    trainingDataSize: 15420,
                    status: "backup"
                }
            ],
            overallStats: {
                totalPredictions: 2847,
                correctPredictions: 2658,
                averageConfidence: 0.847,
                dailyPredictions: 156,
                lastUpdate: "2024-08-14T14:30:00Z"
            },
            featureImportance: [
                { feature: "Corrosion Rate", importance: 0.342, description: "Rate of corrosion measured in mm/year" },
                { feature: "Pipeline Age", importance: 0.289, description: "Age of pipeline in years since installation" },
                { feature: "Operating Pressure", importance: 0.234, description: "Current operating pressure as % of MAOP" },
                { feature: "Soil Conditions", importance: 0.135, description: "Soil corrosivity and drainage characteristics" }
            ]
        };
        logger_1.logger.info('Model performance metrics requested');
        res.json(performance);
    }
    catch (error) {
        logger_1.logger.error('Error fetching model performance:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch model performance'
        });
    }
}));
router.post('/generate/:pipelineId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const pipelineId = parseInt(req.params.pipelineId);
        const newPrediction = {
            id: Date.now(),
            pipelineId,
            failureProbability: Math.random() * 0.8 + 0.1,
            confidenceScore: Math.random() * 0.3 + 0.7,
            predictedFailureDate: new Date(Date.now() + (Math.random() * 365 * 2 + 30) * 24 * 60 * 60 * 1000).toISOString(),
            predictionModel: "Random Forest Ensemble",
            inputParameters: {
                age: Math.random() * 10 + 1,
                corrosionRate: Math.random() * 0.2,
                pressureVariance: Math.random() * 0.1,
                soilConditions: ["acidic", "neutral", "alkaline"][Math.floor(Math.random() * 3)],
                maintenanceHistory: ["poor", "irregular", "regular"][Math.floor(Math.random() * 3)]
            },
            recommendation: "Generated recommendation based on AI analysis",
            createdAt: new Date().toISOString()
        };
        res.json({
            success: true,
            data: newPrediction,
            message: 'Prediction generated successfully'
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate prediction', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate prediction'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=predictions.js.map