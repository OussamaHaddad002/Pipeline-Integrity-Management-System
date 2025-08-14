/**
 * Dashboard routes
 * @fileoverview API endpoints for dashboard metrics and overview data
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/dashboard/metrics
 * Get key dashboard metrics
 */
router.get('/metrics', asyncHandler(async (_req: Request, res: Response) => {
  try {
    // For now, returning mock data until database is fully set up
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
  } catch (error) {
    logger.error('Failed to fetch dashboard metrics', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard metrics'
    });
  }
}));

/**
 * GET /api/dashboard/recent-activity
 * Get recent system activity
 */
router.get('/recent-activity', asyncHandler(async (_req: Request, res: Response) => {
  try {
    // Mock data for recent activity
    const activities = [
      {
        id: 1,
        type: 'risk_assessment',
        message: 'High risk detected on Pipeline TX-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        severity: 'high'
      },
      {
        id: 2,
        type: 'maintenance',
        message: 'Scheduled maintenance completed on Pipeline CA-205',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        severity: 'info'
      },
      {
        id: 3,
        type: 'prediction',
        message: 'AI model predicted potential failure on Pipeline NY-102',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        severity: 'warning'
      }
    ];

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    logger.error('Failed to fetch recent activity', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity'
    });
  }
}));

export default router;
