"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const pipelineId = req.query.pipelineId;
        const assessments = [
            {
                id: 1,
                pipelineId: 1,
                pipelineName: "Trans-Alberta Main Line",
                overallRiskScore: 78,
                riskLevel: "high",
                assessmentDate: "2024-08-14T00:00:00Z",
                nextInspectionDue: "2024-09-15T00:00:00Z",
                inspector: "John Smith, P.Eng",
                factorsConsidered: [
                    { type: "corrosion", value: 8.2, severityLevel: 4, description: "Advanced corrosion detected at multiple joints" },
                    { type: "pressure", value: 6.8, severityLevel: 3, description: "Pressure variations exceeding normal range" },
                    { type: "age", value: 12.5, severityLevel: 4, description: "Pipeline operational for 25+ years" },
                    { type: "soil", value: 7.1, severityLevel: 3, description: "Acidic soil conditions accelerating corrosion" }
                ],
                recommendations: [
                    "Schedule immediate comprehensive inspection within 30 days",
                    "Consider pressure reduction to 80% of MAOP",
                    "Implement weekly corrosion monitoring protocol",
                    "Evaluate soil treatment options for corrosion prevention"
                ]
            },
            {
                id: 2,
                pipelineId: 2,
                pipelineName: "Saskatchewan Distribution Line A",
                overallRiskScore: 45,
                riskLevel: "medium",
                assessmentDate: "2024-08-13T00:00:00Z",
                nextInspectionDue: "2024-11-20T00:00:00Z",
                inspector: "Maria Rodriguez, P.Eng",
                factorsConsidered: [
                    { type: "depth", value: 3.2, severityLevel: 2, description: "Pipeline buried at adequate depth" },
                    { type: "soil", value: 4.1, severityLevel: 2, description: "Neutral soil conditions" },
                    { type: "temperature", value: 5.8, severityLevel: 3, description: "Temperature fluctuations within acceptable range" },
                    { type: "traffic", value: 2.9, severityLevel: 2, description: "Low traffic load above pipeline" }
                ],
                recommendations: [
                    "Continue regular inspection schedule",
                    "Monitor temperature variations during winter months",
                    "Maintain current cathodic protection levels"
                ]
            },
            {
                id: 3,
                pipelineId: 3,
                pipelineName: "Edmonton Feeder Line B",
                overallRiskScore: 92,
                riskLevel: "critical",
                assessmentDate: "2024-08-12T00:00:00Z",
                nextInspectionDue: "2024-08-20T00:00:00Z",
                inspector: "David Chen, P.Eng",
                factorsConsidered: [
                    { type: "corrosion", value: 9.5, severityLevel: 5, description: "Severe external corrosion with metal loss >40%" },
                    { type: "pressure", value: 8.9, severityLevel: 4, description: "Operating near maximum allowable pressure" },
                    { type: "age", value: 8.7, severityLevel: 4, description: "35-year-old pipeline with limited maintenance history" },
                    { type: "weather", value: 7.3, severityLevel: 3, description: "Recent freeze-thaw cycles causing stress" }
                ],
                recommendations: [
                    "IMMEDIATE SHUTDOWN RECOMMENDED - Safety risk identified",
                    "Emergency repair/replacement within 48 hours",
                    "Reroute gas flow through backup systems",
                    "Full section replacement required before resuming operation"
                ]
            },
            {
                id: 4,
                pipelineId: 4,
                pipelineName: "Calgary Cross-town Connector",
                overallRiskScore: 28,
                riskLevel: "low",
                assessmentDate: "2024-08-11T00:00:00Z",
                nextInspectionDue: "2025-02-15T00:00:00Z",
                inspector: "Sarah Wilson, P.Eng",
                factorsConsidered: [
                    { type: "age", value: 2.1, severityLevel: 1, description: "Recently installed - 3 years old" },
                    { type: "corrosion", value: 1.8, severityLevel: 1, description: "Minimal corrosion detected" },
                    { type: "pressure", value: 3.5, severityLevel: 2, description: "Operating well below MAOP" },
                    { type: "soil", value: 2.9, severityLevel: 1, description: "Well-draining, non-corrosive soil" }
                ],
                recommendations: [
                    "Continue standard inspection schedule",
                    "Maintain current operating parameters",
                    "Monitor for any changes in soil conditions"
                ]
            }
        ];
        const filteredAssessments = pipelineId
            ? assessments.filter(a => a.pipelineId === parseInt(pipelineId))
            : assessments;
        logger_1.logger.info(`Risk assessments requested. Pipeline ID: ${pipelineId || 'all'}, Count: ${filteredAssessments.length}`);
        res.json({
            assessments: filteredAssessments,
            count: filteredAssessments.length
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching risk assessments:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch risk assessments'
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