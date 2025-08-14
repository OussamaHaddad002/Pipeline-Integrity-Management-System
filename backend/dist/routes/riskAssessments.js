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
        corrosionRate: pipeline.corrosionRate || 0.1 + Math.random() * 0.1,
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
                id: 1,
                name: "Trans-Alberta Main Line",
                diameter: 36,
                material: "Carbon Steel",
                installationDate: "2018-03-15",
                pressureRating: 1440,
                length: 25.5,
                depth: 2.1,
                soilConditions: "acidic"
            },
            {
                id: 2,
                name: "Saskatchewan Distribution Line A",
                diameter: 24,
                material: "Stainless Steel",
                installationDate: "2020-07-22",
                pressureRating: 1200,
                length: 15.2,
                depth: 1.8,
                soilConditions: "neutral"
            },
            {
                id: 3,
                name: "Manitoba Transmission Pipeline",
                diameter: 30,
                material: "Carbon Steel",
                installationDate: "2015-11-10",
                pressureRating: 1600,
                length: 35.7,
                depth: 2.5,
                soilConditions: "alkaline"
            }
        ];
        try {
            if (await aiService_1.aiService.isServiceAvailable()) {
                logger_1.logger.info('Using real AI service for risk assessments');
                const pipelineData = mockPipelines.map(transformPipelineData);
                const aiAssessments = await aiService_1.aiService.generateRiskAssessments(pipelineData);
                const filteredAssessments = pipelineId
                    ? aiAssessments.filter(a => a.pipelineId === parseInt(pipelineId))
                    : aiAssessments;
                return res.json({
                    success: true,
                    data: filteredAssessments,
                    source: 'ai',
                    message: 'Risk assessments generated using AI models'
                });
            }
        }
        catch (aiError) {
            logger_1.logger.warn('AI service failed, using enhanced mock data:', aiError);
        }
        logger_1.logger.info('Using enhanced mock data for risk assessments');
        const enhancedMockAssessments = [
            {
                id: 1,
                pipelineId: 1,
                pipelineName: "Trans-Alberta Main Line",
                overallRiskScore: 78,
                riskLevel: "high",
                assessmentDate: new Date().toISOString(),
                nextInspectionDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                inspector: "Dr. Sarah Mitchell, P.Eng",
                factorsConsidered: [
                    { type: "corrosion", value: 8.2, severityLevel: 4, description: "Advanced corrosion detected at multiple joints" },
                    { type: "pressure", value: 6.8, severityLevel: 3, description: "Pressure variations exceeding normal range" },
                    { type: "age", value: 12.5, severityLevel: 4, description: "Pipeline operational for 6+ years, approaching critical maintenance period" },
                    { type: "soil", value: 7.1, severityLevel: 3, description: "Acidic soil conditions accelerating corrosion process" },
                    { type: "temperature", value: 5.4, severityLevel: 2, description: "Temperature fluctuations within acceptable range" }
                ],
                recommendations: [
                    "Schedule comprehensive inspection within 15 days",
                    "Consider pressure reduction to 75% of MAOP temporarily",
                    "Implement daily corrosion monitoring protocol",
                    "Evaluate soil treatment options for pH neutralization",
                    "Review and update maintenance schedule"
                ]
            },
            {
                id: 2,
                pipelineId: 2,
                pipelineName: "Saskatchewan Distribution Line A",
                overallRiskScore: 45,
                riskLevel: "medium",
                assessmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                nextInspectionDue: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                inspector: "Mike Chen, P.Eng",
                factorsConsidered: [
                    { type: "corrosion", value: 4.1, severityLevel: 2, description: "Minor corrosion detected, within acceptable limits" },
                    { type: "pressure", value: 3.2, severityLevel: 2, description: "Stable pressure readings" },
                    { type: "age", value: 6.8, severityLevel: 2, description: "Relatively new pipeline, 4 years in operation" },
                    { type: "soil", value: 2.9, severityLevel: 1, description: "Neutral soil conditions, no significant corrosion risk" },
                    { type: "maintenance", value: 4.5, severityLevel: 2, description: "Regular maintenance schedule being followed" }
                ],
                recommendations: [
                    "Continue regular inspection schedule",
                    "Monitor corrosion progression quarterly",
                    "Maintain current operating parameters",
                    "Schedule routine maintenance in 3 months"
                ]
            },
            {
                id: 3,
                pipelineId: 3,
                pipelineName: "Manitoba Transmission Pipeline",
                overallRiskScore: 65,
                riskLevel: "high",
                assessmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                nextInspectionDue: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
                inspector: "Dr. Maria Rodriguez, P.Eng",
                factorsConsidered: [
                    { type: "corrosion", value: 7.3, severityLevel: 3, description: "Moderate corrosion progression detected" },
                    { type: "pressure", value: 6.1, severityLevel: 3, description: "Some pressure fluctuations observed" },
                    { type: "age", value: 15.2, severityLevel: 4, description: "Pipeline operational for 9+ years, requiring enhanced monitoring" },
                    { type: "soil", value: 6.8, severityLevel: 3, description: "Alkaline soil conditions affecting material integrity" },
                    { type: "flow", value: 4.7, severityLevel: 2, description: "Flow rates within normal operational parameters" }
                ],
                recommendations: [
                    "Schedule detailed inspection within 21 days",
                    "Implement enhanced monitoring protocol",
                    "Consider cathodic protection system upgrade",
                    "Review operating pressure limits",
                    "Plan preventive maintenance activities"
                ]
            }
        ];
        const filteredAssessments = pipelineId
            ? enhancedMockAssessments.filter(a => a.pipelineId === parseInt(pipelineId))
            : enhancedMockAssessments;
        res.json({
            success: true,
            data: filteredAssessments,
            source: 'mock',
            message: 'Risk assessments from enhanced simulation data'
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch risk assessments', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch risk assessments'
        });
    }
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const mockAssessment = {
            id: parseInt(id),
            pipelineId: 1,
            pipelineName: "Trans-Alberta Main Line",
            overallRiskScore: 75,
            riskLevel: "high",
            assessmentDate: "2024-08-14T00:00:00Z",
            nextInspectionDue: "2024-09-15T00:00:00Z",
            inspector: "John Smith, P.Eng",
            factorsConsidered: [
                { type: "corrosion", value: 8, severityLevel: 4, description: "Moderate corrosion detected at pipe joints" },
                { type: "pressure", value: 6, severityLevel: 3, description: "Operating at 85% of maximum allowable pressure" },
                { type: "age", value: 7, severityLevel: 4, description: "25-year-old pipeline approaching maintenance cycle" }
            ],
            recommendations: [
                "Schedule immediate inspection",
                "Consider pressure reduction",
                "Monitor corrosion levels weekly"
            ]
        };
        logger_1.logger.info(`Risk assessment requested for ID: ${id}`);
        res.json(mockAssessment);
    }
    catch (error) {
        logger_1.logger.error(`Error fetching risk assessment ${req.params.id}:`, error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch risk assessment'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=riskAssessments.js.map