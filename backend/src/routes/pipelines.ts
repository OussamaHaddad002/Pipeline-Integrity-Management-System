/**
 * Pipeline routes
 * @fileoverview API endpoints for pipeline management
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/pipelines
 * Get all pipelines with optional pagination
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Mock pipeline data
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
  } catch (error) {
    logger.error('Failed to fetch pipelines', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pipelines'
    });
  }
}));

/**
 * GET /api/pipelines/:id
 * Get a specific pipeline by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Mock pipeline data - in real implementation, fetch from database
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
    } else {
      res.status(404).json({
        success: false,
        error: 'Pipeline not found'
      });
    }
  } catch (error) {
    logger.error('Failed to fetch pipeline', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pipeline'
    });
  }
}));

/**
 * POST /api/pipelines
 * Create a new pipeline
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, diameter, material, installationDate, pressureRating, status, geometry } = req.body;

    // Validate required fields
    if (!name || !diameter || !material || !pressureRating) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, diameter, material, pressureRating'
      });
    } else {
      // Create new pipeline (in a real app, this would save to database)
      const newPipeline = {
        id: Date.now(), // Simple ID generation
        name,
        diameter: parseInt(diameter),
        material,
        installationDate: installationDate || new Date().toISOString().split('T')[0],
        pressureRating: parseInt(pressureRating),
        status: status || 'active',
        geometry: geometry || {
          type: "LineString",
          coordinates: [
            [-95.3698 + Math.random() * 0.1, 29.7604 + Math.random() * 0.1],
            [-95.3798 + Math.random() * 0.1, 29.7704 + Math.random() * 0.1]
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      logger.info('Pipeline created successfully', { pipelineId: newPipeline.id, name });

      res.status(201).json({
        success: true,
        data: newPipeline,
        message: 'Pipeline created successfully'
      });
    }
  } catch (error) {
    logger.error('Failed to create pipeline', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pipeline'
    });
  }
}));

export default router;
