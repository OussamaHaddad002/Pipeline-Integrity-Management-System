"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const pipelines = [
            {
                id: 1,
                name: "TX-001 Main Line",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-95.3698, 29.7604],
                        [-95.3798, 29.7704],
                        [-95.3898, 29.7804]
                    ]
                },
                diameter: 36,
                material: "Carbon Steel",
                installationDate: "2018-03-15",
                pressureRating: 1440,
                status: "active",
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: "2024-08-01T00:00:00Z"
            },
            {
                id: 2,
                name: "CA-205 Distribution",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-118.2437, 34.0522],
                        [-118.2537, 34.0622],
                        [-118.2637, 34.0722]
                    ]
                },
                diameter: 24,
                material: "Stainless Steel",
                installationDate: "2020-07-22",
                pressureRating: 1200,
                status: "maintenance",
                createdAt: "2023-02-01T00:00:00Z",
                updatedAt: "2024-08-14T00:00:00Z"
            }
        ];
        res.json({
            success: true,
            data: pipelines,
            pagination: {
                page,
                limit,
                total: pipelines.length,
                hasMore: false
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch pipelines', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pipelines'
        });
    }
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (id === 1) {
            const pipeline = {
                id: 1,
                name: "TX-001 Main Line",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-95.3698, 29.7604],
                        [-95.3798, 29.7704],
                        [-95.3898, 29.7804]
                    ]
                },
                diameter: 36,
                material: "Carbon Steel",
                installationDate: "2018-03-15",
                pressureRating: 1440,
                status: "active",
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: "2024-08-01T00:00:00Z"
            };
            res.json({
                success: true,
                data: pipeline
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Pipeline not found'
            });
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch pipeline', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pipeline'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=pipelines.js.map