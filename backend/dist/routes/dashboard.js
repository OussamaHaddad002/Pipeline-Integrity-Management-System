"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/metrics', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const metrics = {
            totalPipelines: 24,
            activePipelines: 20,
            highRiskPipelines: 3,
            criticalAlerts: 2,
            averageRiskScore: 62.5,
            predictedFailures: 1
        };
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch dashboard metrics', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard metrics'
        });
    }
}));
router.get('/recent-activity', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const activities = [
            {
                id: 1,
                type: 'risk_assessment',
                message: 'High risk detected on Pipeline TX-001',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                severity: 'high'
            },
            {
                id: 2,
                type: 'maintenance',
                message: 'Scheduled maintenance completed on Pipeline CA-205',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                severity: 'info'
            },
            {
                id: 3,
                type: 'prediction',
                message: 'AI model predicted potential failure on Pipeline NY-102',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                severity: 'warning'
            }
        ];
        res.json({
            success: true,
            data: activities
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch recent activity', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recent activity'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=dashboard.js.map