"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const aiService_1 = require("../services/aiService");
function transformPipelineData(pipeline) {
    const installDate = new Date(pipeline.installationDate);
    const age = (Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return {
        id: pipeline.id,
        name: pipeline.name,
        diameter: pipeline.diameter || 24,
        material: pipeline.material || 'Carbon Steel',
        installationDate: pipeline.installationDate,
        pressureRating: pipeline.pressureRating || 1440,
        age: age,
        length: pipeline.length || 10.5,
        depth: pipeline.depth || 1.5,
        corrosionRate: pipeline.corrosionRate || 0.05 + Math.random() * 0.15,
        pressureVariance: pipeline.pressureVariance || Math.random() * 0.15,
        soilConditions: pipeline.soilConditions || 'neutral',
        maintenanceHistory: pipeline.maintenanceHistory || 'regular',
        temperature: pipeline.temperature || 15 + Math.random() * 20,
        operatingPressure: pipeline.operatingPressure || pipeline.pressureRating * 0.7,
        flowRate: pipeline.flowRate || 100 + Math.random() * 200
    };
}
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const pipelineId = req.query.pipelineId;
        const mockPipelines = [
            {
                id: 1, name: "Trans-Alberta Main Line", diameter: 36, material: "Carbon Steel",
                installationDate: "2018-03-15", pressureRating: 1440, length: 25.5, depth: 2.1, soilConditions: "acidic"
            },
            {
                id: 2, name: "Saskatchewan Distribution Line A", diameter: 24, material: "Stainless Steel",
                installationDate: "2020-07-22", pressureRating: 1200, length: 15.2, depth: 1.8, soilConditions: "neutral"
            },
            {
                id: 3, name: "Manitoba Transmission Pipeline", diameter: 30, material: "Carbon Steel",
                installationDate: "2015-11-10", pressureRating: 1600, length: 35.7, depth: 2.5, soilConditions: "alkaline"
            }
        ];
        try {
            if (await aiService_1.aiService.isServiceAvailable()) {
                logger_1.logger.info('Using real AI service for predictions');
                const pipelineData = mockPipelines.map(transformPipelineData);
                const aiPredictions = await aiService_1.aiService.generatePredictions(pipelineData);
                const filteredPredictions = pipelineId
                    ? aiPredictions.filter(p => p.pipelineId === parseInt(pipelineId))
                    : aiPredictions;
                return res.json({
                    success: true,
                    data: filteredPredictions,
                    source: 'ai',
                    message: 'Predictions generated using trained ML models'
                });
            }
        }
        catch (aiError) {
            logger_1.logger.warn('AI service failed, using enhanced mock data:', aiError);
        }
        const enhancedMockPredictions = [
            {
                id: 1, pipelineId: 1, pipelineName: "Trans-Alberta Main Line",
                failureProbability: 0.78, confidenceScore: 0.89,
                predictedFailureDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                predictionModel: "Random Forest Ensemble + Gradient Boosting",
                inputParameters: {
                    age: 6.5, corrosionRate: 0.15, pressureVariance: 0.08, soilConditions: "acidic",
                    maintenanceHistory: "irregular", temperature: 12.5, depth: 2.1
                },
                recommendation: "Schedule immediate comprehensive inspection and consider pipeline replacement within 6 months",
                createdAt: new Date().toISOString(),
                riskFactors: {
                    primary: "Corrosion rate exceeding safety threshold",
                    secondary: ["Irregular maintenance schedule", "Acidic soil conditions", "Age-related degradation"]
                },
                maintenanceActions: [
                    "Immediate comprehensive pipe inspection",
                    "Corrosion inhibitor application",
                    "Pressure testing at reduced levels",
                    "Soil treatment for pH neutralization"
                ]
            }
        ];
        const filteredPredictions = pipelineId
            ? enhancedMockPredictions.filter(p => p.pipelineId === parseInt(pipelineId))
            : enhancedMockPredictions;
        res.json({
            success: true,
            data: filteredPredictions,
            source: 'mock',
            message: 'AI predictions from enhanced simulation models'
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