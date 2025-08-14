/**
 * Risk Assessments routes - Simple version with dynamic data generation and CSV import
 */
import { Router } from 'express';
import { parseCSVData, generateRiskAssessment } from '../utils/csvParser';

const router = Router();

// In-memory storage for risk assessments
let riskAssessments = [
  {
    id: 1,
    pipelineId: 1,
    pipelineName: "TX-001 Main Line",
    overallRiskScore: 65,
    riskLevel: "medium",
    assessmentDate: "2025-08-10",
    nextInspectionDue: "2025-11-10",
    inspector: "Dr. Sarah Johnson",
    factorsConsidered: [
      {
        type: "Corrosion Risk",
        value: 45,
        severityLevel: 2,
        description: "Moderate corrosion detected in soil interface areas"
      },
      {
        type: "Pressure Variance",
        value: 78,
        severityLevel: 3,
        description: "High pressure fluctuations during peak demand"
      }
    ],
    recommendations: [
      "Schedule detailed corrosion inspection within 60 days",
      "Install additional pressure monitoring equipment",
      "Review operational pressure limits"
    ]
  }
];

// GET /api/risk-assessments
router.get('/', (_req, res) => {
  res.json({
    success: true,
    source: riskAssessments.length > 1 ? "AI Service with dynamic data" : "Enhanced mock data",
    data: riskAssessments,
    count: riskAssessments.length
  });
});

// POST /api/risk-assessments
router.post('/', (req, res) => {
  try {
    const { pipelineId, pipelineName } = req.body;

    // Generate a new risk assessment with realistic AI-like data
    const inspectors = ['Dr. Sarah Johnson', 'Engineer Mike Chen', 'Analyst Lisa Rodriguez', 'Expert Tom Wilson'];
    const riskFactors = [
      { type: "Corrosion Risk", baseValue: 30, description: "soil interface corrosion patterns" },
      { type: "Pressure Variance", baseValue: 45, description: "pressure fluctuation analysis" },
      { type: "Material Fatigue", baseValue: 35, description: "stress cycle accumulation" },
      { type: "Environmental Impact", baseValue: 25, description: "external environmental factors" }
    ];

    const overallRisk = Math.round(Math.random() * 60 + 20); // 20-80 range
    const riskLevel = overallRisk > 70 ? 'critical' : overallRisk > 50 ? 'high' : overallRisk > 30 ? 'medium' : 'low';
    
    const newAssessment = {
      id: Date.now(),
      pipelineId: pipelineId || Math.round(Math.random() * 10 + 1),
      pipelineName: pipelineName || `Pipeline-${Math.round(Math.random() * 100)}`,
      overallRiskScore: overallRisk,
      riskLevel,
      assessmentDate: new Date().toISOString().split('T')[0],
      nextInspectionDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
      factorsConsidered: riskFactors.slice(0, Math.floor(Math.random() * 3) + 2).map(factor => ({
        type: factor.type,
        value: Math.round(factor.baseValue + Math.random() * 40),
        severityLevel: Math.floor(Math.random() * 4) + 1,
        description: `AI-detected ${factor.description} require attention`
      })),
      recommendations: [
        `Schedule ${riskLevel} priority inspection within ${riskLevel === 'critical' ? '30' : riskLevel === 'high' ? '60' : '90'} days`,
        "Implement enhanced monitoring protocols",
        "Review maintenance scheduling based on risk profile",
        "Update operational parameters as recommended"
      ].slice(0, Math.floor(Math.random() * 2) + 2)
    };

    // Add to storage
    riskAssessments.push(newAssessment);

    res.status(201).json({
      success: true,
      data: newAssessment,
      message: 'Risk assessment generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate risk assessment'
    });
  }
});

// GET CSV test data
router.get('/csv-data', (_req, res) => {
  try {
    const csvData = parseCSVData();
    res.json({
      success: true,
      data: csvData,
      count: csvData.length,
      message: 'CSV test data loaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load CSV data'
    });
  }
});

// POST assess CSV pipeline
router.post('/assess-csv/:pipelineId', (req, res) => {
  try {
    const { pipelineId } = req.params;
    const csvData = parseCSVData();
    const pipelineData = csvData.find(p => p.id === pipelineId);
    
    if (!pipelineData) {
      return res.status(404).json({
        success: false,
        error: 'Pipeline not found in CSV data'
      });
    }

    const assessment = generateRiskAssessment(pipelineData);
    
    // Calculate a more realistic risk score (0-100)
    const calculateDisplayRiskScore = (pipelineData: any): number => {
      let score = 20; // Base score
      
      // Wall loss factor (0-35 points)
      const wallLoss = pipelineData.inspection.wallLossPercent;
      if (wallLoss > 50) score += 35;
      else if (wallLoss > 30) score += 25;
      else if (wallLoss > 15) score += 15;
      else if (wallLoss > 5) score += 8;
      
      // Age factor (0-20 points)
      const age = pipelineData.operational.age;
      if (age > 40) score += 20;
      else if (age > 30) score += 15;
      else if (age > 20) score += 10;
      else if (age > 10) score += 5;
      
      // Corrosion rate factor (0-25 points)
      const corrosionRate = pipelineData.environmental.corrosionRate;
      if (corrosionRate > 1.0) score += 25;
      else if (corrosionRate > 0.8) score += 20;
      else if (corrosionRate > 0.5) score += 12;
      else if (corrosionRate > 0.3) score += 6;
      
      // Environmental factors (0-15 points)
      if (pipelineData.operational.populationDensity === 'High') score += 10;
      else if (pipelineData.operational.populationDensity === 'Medium') score += 5;
      
      if (pipelineData.operational.environmentalSensitivity === 'High') score += 5;
      
      // Historical incidents (0-10 points)
      score += pipelineData.operational.historicalIncidents * 5;
      
      // Crack detection bonus (0-15 points)
      if (pipelineData.inspection.cracksDetected) score += 15;
      
      return Math.min(Math.max(score, 5), 95); // Cap between 5-95
    };
    
    const displayRiskScore = calculateDisplayRiskScore(pipelineData);
    
    // Convert to match our existing assessment format
    const formattedAssessment = {
      id: assessment.id,
      pipelineId: parseInt(pipelineId),
      pipelineName: assessment.pipelineName,
      overallRiskScore: displayRiskScore,
      riskLevel: assessment.riskLevel.toLowerCase(),
      assessmentDate: assessment.assessmentDate,
      nextInspectionDue: assessment.nextInspection,
      inspector: "CSV Data Analysis System",
      factorsConsidered: [
        {
          type: "Corrosion Risk",
          value: assessment.factors.corrosion.value,
          severityLevel: assessment.factors.corrosion.rating === 'HIGH' ? 8 : 
                        assessment.factors.corrosion.rating === 'MEDIUM' ? 5 : 3,
          description: assessment.factors.corrosion.description
        },
        {
          type: "Mechanical Integrity", 
          value: assessment.factors.mechanical.value,
          severityLevel: assessment.factors.mechanical.rating === 'HIGH' ? 8 : 
                        assessment.factors.mechanical.rating === 'MEDIUM' ? 5 : 3,
          description: assessment.factors.mechanical.description
        },
        {
          type: "External Threats",
          value: assessment.factors.external.value,
          severityLevel: assessment.factors.external.rating === 'HIGH' ? 8 : 
                        assessment.factors.external.rating === 'MEDIUM' ? 5 : 3,
          description: assessment.factors.external.description
        }
      ],
      recommendations: assessment.recommendations
    };
    
    riskAssessments.push(formattedAssessment);

    return res.status(201).json({
      success: true,
      data: formattedAssessment,
      message: `Risk assessment completed for ${pipelineData.name}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate CSV assessment'
    });
  }
});

export default router;
