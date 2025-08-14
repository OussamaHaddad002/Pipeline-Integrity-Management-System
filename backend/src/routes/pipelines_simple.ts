/**
 * Pipeline routes - Simple version for testing
 */
import { Router } from 'express';

const router = Router();

// Simple in-memory storage for pipelines
let pipelines = [
  {
    id: 1,
    name: "TX-001 Main Line",
    geometry: { type: "LineString", coordinates: [[-95.3698, 29.7604], [-95.3798, 29.7704]] },
    diameter: 36,
    material: "Carbon Steel",
    installationDate: "2018-03-15",
    pressureRating: 1440,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z"
  }
];

// GET /api/pipelines
router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: pipelines,
    count: pipelines.length,
    total: pipelines.length,
    page: 1,
    hasMore: false
  });
});

// POST /api/pipelines
router.post('/', (req, res) => {
  try {
    const { name, diameter, material, pressureRating, status } = req.body;
    
    if (!name || !diameter || !material || !pressureRating) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const newPipeline = {
      id: Date.now(),
      name,
      diameter: parseInt(diameter),
      material,
      installationDate: new Date().toISOString().split('T')[0],
      pressureRating: parseInt(pressureRating),
      status: status || 'active',
      geometry: {
        type: "LineString",
        coordinates: [[-95.3698, 29.7604], [-95.3798, 29.7704]]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to in-memory storage
    pipelines.push(newPipeline);

    return res.status(201).json({
      success: true,
      data: newPipeline,
      message: 'Pipeline created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
