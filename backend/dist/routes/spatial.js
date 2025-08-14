"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/nearby', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseFloat(req.query.radius) || 1000;
        if (!lat || !lng) {
            res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
            return;
        }
        const nearbyPipelines = [
            {
                id: 1,
                name: "TX-001 Main Line",
                distance: 250,
                bearing: "NE",
                coordinates: [-95.3698, 29.7604]
            },
            {
                id: 3,
                name: "TX-003 Branch",
                distance: 750,
                bearing: "SW",
                coordinates: [-95.3750, 29.7550]
            }
        ];
        res.json({
            success: true,
            data: nearbyPipelines,
            query: {
                center: [lng, lat],
                radius
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch nearby pipelines', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch nearby pipelines'
        });
    }
}));
router.get('/intersect', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const intersectingPipelines = [
            {
                id: 2,
                name: "CA-205 Distribution",
                intersectionLength: 1.2,
                intersectionType: "crossing"
            }
        ];
        res.json({
            success: true,
            data: intersectingPipelines
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch intersecting pipelines', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch intersecting pipelines'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=spatial.js.map