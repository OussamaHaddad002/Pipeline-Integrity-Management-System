/**
 * Spatial routes
 * @fileoverview API endpoints for spatial/geographic queries
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/spatial/nearby
 * Get nearby pipelines within specified radius
 */
router.get('/nearby', asyncHandler(async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 1000; // Default 1km

    if (!lat || !lng) {
      res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
      return;
    }

    // Mock spatial query results
    const nearbyPipelines = [
      {
        id: 1,
        name: "TX-001 Main Line",
        distance: 250, // meters
        bearing: "NE",
        coordinates: [-95.3698, 29.7604]
      },
      {
        id: 3,
        name: "TX-003 Branch",
        distance: 750, // meters
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
  } catch (error) {
    logger.error('Failed to fetch nearby pipelines', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby pipelines'
    });
  }
}));

/**
 * GET /api/spatial/intersect
 * Get pipelines that intersect with a given area
 */
router.get('/intersect', asyncHandler(async (_req: Request, res: Response) => {
  try {
    // Mock intersection query
    const intersectingPipelines = [
      {
        id: 2,
        name: "CA-205 Distribution",
        intersectionLength: 1.2, // km
        intersectionType: "crossing"
      }
    ];

    res.json({
      success: true,
      data: intersectingPipelines
    });
  } catch (error) {
    logger.error('Failed to fetch intersecting pipelines', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch intersecting pipelines'
    });
  }
}));

export default router;
