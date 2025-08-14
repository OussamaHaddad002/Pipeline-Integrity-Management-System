/**
 * CSV Data Parser for Pipeline Test Data
 */
import * as fs from 'fs';
import * as path from 'path';

export interface PipelineTestData {
  id: string;
  name: string;
  operator: string;
  specifications: {
    diameter: number;
    materialGrade: string;
    wallThickness: number;
    installationDate: string;
    designPressure: number;
    operatingPressure: number;
    length: number;
    productType: string;
  };
  environmental: {
    soilType: string;
    phLevel: number;
    corrosionRate: number;
    coatingType: string;
    cathodicProtection: boolean;
    depthCover: number;
    temperatureRange: [number, number];
  };
  inspection: {
    lastInspectionDate: string;
    inspectionMethod: string;
    wallLossPercent: number;
    dentsCount: number;
    cracksDetected: boolean;
  };
  operational: {
    operatingHours: number;
    flowRate: number;
    fatalityRadius: number;
    populationDensity: string;
    environmentalSensitivity: string;
    historicalIncidents: number;
    age: number;
  };
  riskFactors: {
    currentRiskLevel: string;
    failureProbability: number;
    consequenceScore: number;
    riskScore: number;
  };
}

export function parseCSVData(): PipelineTestData[] {
  try {
    const csvPath = path.join(__dirname, '../data/pipeline_test_data.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim().replace(/\r$/, ''));
    
    return lines.slice(1).map((line, lineIndex) => {
      const values = line.split(',').map(v => v.trim().replace(/\r$/, ''));
      const row = Object.fromEntries(headers.map((header, i) => [header, values[i]]));
      
      // Debug the first row in detail
      if (lineIndex === 0) {
        console.log(`Debug line: "${line}"`);
        console.log(`Headers (${headers.length}):`, headers);
        console.log(`Values (${values.length}):`, values);
        console.log(`Row object:`, row);
      }
      
      // Calculate risk factors based on inspection data
      const wallLoss = parseFloat(row.Wall_Loss_percent);
      const age = parseInt(row.Age_years);
      const corrosionRate = parseFloat(row.Corrosion_Rate_mils_per_year);
      const incidents = parseInt(row.Historical_Incidents);
      
      console.log(`Debug CSV parsing for ${row.Pipeline_ID}: wallLoss=${wallLoss}, age=${age} (raw: "${row.Age_years}"), corrosionRate=${corrosionRate}, incidents=${incidents}`);
      
      // Risk Assessment Calculations
      const failureProbability = calculateFailureProbability(wallLoss, age, corrosionRate, incidents);
      const consequenceScore = calculateConsequenceScore(
        parseFloat(row.Diameter_inches),
        row.Population_Density,
        row.Environmental_Sensitivity
      );
      const riskScore = failureProbability * consequenceScore;
      const riskLevel = getRiskLevel(riskScore);
      
      return {
        id: row.Pipeline_ID,
        name: row.Pipeline_Name,
        operator: row.Operator,
        specifications: {
          diameter: parseFloat(row.Diameter_inches),
          materialGrade: row.Material_Grade,
          wallThickness: parseFloat(row.Wall_Thickness_inches),
          installationDate: row.Installation_Date,
          designPressure: parseInt(row.Design_Pressure_PSI),
          operatingPressure: parseInt(row.Operating_Pressure_PSI),
          length: parseFloat(row.Length_miles),
          productType: row.Product_Type
        },
        environmental: {
          soilType: row.Soil_Type,
          phLevel: parseFloat(row.pH_Level),
          corrosionRate: parseFloat(row.Corrosion_Rate_mils_per_year),
          coatingType: row.Coating_Type,
          cathodicProtection: row.Cathodic_Protection === 'Yes',
          depthCover: parseFloat(row.Depth_Cover_feet),
          temperatureRange: [parseInt(row.Temperature_Min_F), parseInt(row.Temperature_Max_F)]
        },
        inspection: {
          lastInspectionDate: row.Last_Inspection_Date,
          inspectionMethod: row.Inspection_Method,
          wallLossPercent: wallLoss,
          dentsCount: parseInt(row.Dents_count),
          cracksDetected: row.Cracks_detected === 'Yes'
        },
        operational: {
          operatingHours: parseInt(row.Operating_Hours_per_year),
          flowRate: parseInt(row.Flow_Rate_MCF_per_day),
          fatalityRadius: parseInt(row.Fatality_Radius_feet),
          populationDensity: row.Population_Density,
          environmentalSensitivity: row.Environmental_Sensitivity,
          historicalIncidents: incidents,
          age: age
        },
        riskFactors: {
          currentRiskLevel: riskLevel,
          failureProbability: failureProbability,
          consequenceScore: consequenceScore,
          riskScore: riskScore
        }
      };
    });
    
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
}

function calculateFailureProbability(wallLoss: number, age: number, corrosionRate: number, incidents: number): number {
  // Industry-standard probability calculation
  let probability = 0.001; // Base probability
  
  console.log(`Calculating failure probability for: wallLoss=${wallLoss}, age=${age}, corrosionRate=${corrosionRate}, incidents=${incidents}`);
  console.log(`Starting with base probability: ${probability}`);
  
  // Wall loss factor (critical above 80%)
  if (wallLoss > 80) {
    probability *= 10;
    console.log(`Wall loss > 80%, multiplying by 10: ${probability}`);
  } else if (wallLoss > 60) {
    probability *= 5;
    console.log(`Wall loss > 60%, multiplying by 5: ${probability}`);
  } else if (wallLoss > 40) {
    probability *= 3;
    console.log(`Wall loss > 40%, multiplying by 3: ${probability}`);
  } else if (wallLoss > 20) {
    probability *= 2;
    console.log(`Wall loss > 20%, multiplying by 2: ${probability}`);
  } else {
    console.log(`Wall loss <= 20%, no multiplier applied`);
  }
  
  // Age factor
  const ageMultiplier = (1 + age * 0.02);
  probability *= ageMultiplier;
  console.log(`Age factor (1 + ${age} * 0.02) = ${ageMultiplier}, new probability: ${probability}`);
  
  // Corrosion rate factor
  if (corrosionRate > 1.0) {
    probability *= 3;
    console.log(`Corrosion rate > 1.0, multiplying by 3: ${probability}`);
  } else if (corrosionRate > 0.5) {
    probability *= 2;
    console.log(`Corrosion rate > 0.5, multiplying by 2: ${probability}`);
  } else {
    console.log(`Corrosion rate <= 0.5, no multiplier applied`);
  }
  
  // Historical incidents factor
  const incidentMultiplier = (1 + incidents * 0.5);
  probability *= incidentMultiplier;
  console.log(`Incidents factor (1 + ${incidents} * 0.5) = ${incidentMultiplier}, new probability: ${probability}`);

  const finalProbability = Math.min(probability, 1.0); // Cap at 100%
  console.log(`Final probability (capped at 1.0): ${finalProbability}`);
  
  return finalProbability;
}

function calculateConsequenceScore(diameter: number, populationDensity: string, environmentalSensitivity: string): number {
  let score = 1;
  
  // Diameter factor (larger = more consequence)
  score *= Math.sqrt(diameter / 12);
  
  // Population density factor
  switch (populationDensity) {
    case 'High': score *= 4; break;
    case 'Medium': score *= 2; break;
    case 'Low': score *= 1; break;
  }
  
  // Environmental sensitivity factor
  switch (environmentalSensitivity) {
    case 'High': score *= 3; break;
    case 'Medium': score *= 2; break;
    case 'Low': score *= 1; break;
  }
  
  return Math.min(score, 10); // Cap at 10
}

function getRiskLevel(riskScore: number): string {
  if (riskScore > 0.1) return 'HIGH';
  if (riskScore > 0.05) return 'MEDIUM';
  if (riskScore > 0.01) return 'LOW';
  return 'VERY LOW';
}

export function generateRiskAssessment(pipelineData: PipelineTestData) {
  return {
    id: Date.now(),
    pipelineId: pipelineData.id,
    pipelineName: pipelineData.name,
    assessmentDate: new Date().toISOString().split('T')[0],
    riskLevel: pipelineData.riskFactors.currentRiskLevel,
    riskScore: pipelineData.riskFactors.riskScore,
    failureProbability: pipelineData.riskFactors.failureProbability,
    consequenceScore: pipelineData.riskFactors.consequenceScore,
    factors: {
      corrosion: {
        rating: pipelineData.environmental.corrosionRate > 0.8 ? 'HIGH' : 
                pipelineData.environmental.corrosionRate > 0.5 ? 'MEDIUM' : 'LOW',
        value: pipelineData.environmental.corrosionRate,
        description: `Corrosion rate of ${pipelineData.environmental.corrosionRate} mils/year in ${pipelineData.environmental.soilType} soil`
      },
      mechanical: {
        rating: pipelineData.inspection.wallLossPercent > 20 ? 'HIGH' : 
                pipelineData.inspection.wallLossPercent > 10 ? 'MEDIUM' : 'LOW',
        value: pipelineData.inspection.wallLossPercent,
        description: `${pipelineData.inspection.wallLossPercent}% wall loss, ${pipelineData.inspection.dentsCount} dents detected`
      },
      external: {
        rating: pipelineData.operational.populationDensity === 'High' ? 'HIGH' : 'MEDIUM',
        value: pipelineData.operational.fatalityRadius,
        description: `${pipelineData.operational.populationDensity} population density, ${pipelineData.operational.fatalityRadius}ft fatality radius`
      }
    },
    recommendations: generateRecommendations(pipelineData),
    nextInspection: calculateNextInspection(pipelineData),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function generateAIPrediction(pipelineData: PipelineTestData, modelConfig: any) {
  // Simulate ML prediction based on historical patterns
  const baseFailureProbability = pipelineData.riskFactors.failureProbability;
  
  // Time-based degradation modeling
  const years = modelConfig.timeHorizon || 5;
  const degradationRate = pipelineData.environmental.corrosionRate * 0.1;
  const futureFailureProbability = Math.min(
    baseFailureProbability * (1 + degradationRate * years), 
    0.95
  );
  
  // Confidence based on data quality and model type
  const dataQuality = calculateDataQuality(pipelineData);
  const modelConfidenceMap: { [key: string]: number } = {
    'ensemble': 0.92,
    'random-forest': 0.88,
    'neural-network': 0.85
  };
  const modelConfidence = modelConfidenceMap[modelConfig.modelType] || 0.80;
  
  const confidence = Math.min(dataQuality * modelConfidence, 0.98);
  
  return {
    id: Date.now(),
    pipelineId: pipelineData.id,
    pipelineName: pipelineData.name,
    modelType: modelConfig.modelType,
    predictionDate: new Date().toISOString(),
    timeHorizon: years,
    failureProbability: futureFailureProbability,
    confidence: confidence,
    riskFactors: [
      {
        factor: 'Corrosion Progression',
        contribution: 0.45,
        trend: 'Increasing',
        description: `Projected corrosion rate of ${(pipelineData.environmental.corrosionRate * 1.2).toFixed(2)} mils/year`
      },
      {
        factor: 'Age-Related Degradation',
        contribution: 0.30,
        trend: 'Increasing', 
        description: `Pipeline will be ${pipelineData.operational.age + years} years old`
      },
      {
        factor: 'Operating Conditions',
        contribution: 0.15,
        trend: 'Stable',
        description: `Consistent operating pressure at ${pipelineData.specifications.operatingPressure} PSI`
      },
      {
        factor: 'Environmental Factors',
        contribution: 0.10,
        trend: 'Stable',
        description: `${pipelineData.environmental.soilType} soil with pH ${pipelineData.environmental.phLevel}`
      }
    ],
    predictions: {
      mostLikelyFailureMode: determineMostLikelyFailureMode(pipelineData),
      timeToFailure: futureFailureProbability > 0 ? Math.max(Math.min(1 / (futureFailureProbability * 12), 240), 6) : 120, // months, bounded between 6-240 months
      maintenanceWindow: calculateOptimalMaintenance(pipelineData, years)
    },
    recommendations: generatePredictionRecommendations(pipelineData, futureFailureProbability),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function calculateDataQuality(data: PipelineTestData): number {
  let quality = 1.0;
  
  // Recent inspection data is higher quality
  const inspectionAge = (Date.now() - new Date(data.inspection.lastInspectionDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (inspectionAge > 5) quality *= 0.7;
  else if (inspectionAge > 2) quality *= 0.9;
  
  // ILI data is higher quality than hydrostatic testing
  if (data.inspection.inspectionMethod.includes('ILI')) quality *= 1.0;
  else quality *= 0.85;
  
  return quality;
}

function determineMostLikelyFailureMode(data: PipelineTestData): string {
  if (data.environmental.corrosionRate > 0.8) return 'External Corrosion';
  if (data.inspection.cracksDetected) return 'Stress Corrosion Cracking';
  if (data.inspection.dentsCount > 2) return 'Mechanical Damage';
  if (data.operational.age > 40) return 'Material Degradation';
  return 'General Corrosion';
}

function calculateOptimalMaintenance(data: PipelineTestData, years: number): string {
  const riskIncrease = data.riskFactors.failureProbability * years * 0.5;
  
  if (riskIncrease > 0.1) {
    return `Immediate inspection recommended`;
  } else if (riskIncrease > 0.05) {
    const months = Math.max(Math.floor(6 / Math.max(riskIncrease, 0.001)), 1);
    return `Inspection within ${months} months`;
  } else {
    const yearInterval = Math.max(Math.floor(1 / Math.max(riskIncrease, 0.001)), 1);
    return `Standard ${Math.min(yearInterval, 10)} year inspection cycle`;
  }
}

function generateRecommendations(data: PipelineTestData): string[] {
  const recommendations: string[] = [];
  
  if (data.inspection.wallLossPercent > 20) {
    recommendations.push('Immediate detailed inspection required - wall loss exceeds 20%');
  }
  
  if (data.environmental.corrosionRate > 1.0) {
    recommendations.push('Enhanced cathodic protection system evaluation needed');
    recommendations.push('Consider coating repair or replacement in high corrosion areas');
  }
  
  if (data.inspection.cracksDetected) {
    recommendations.push('Crack growth monitoring program implementation');
  }
  
  if (data.operational.age > 35) {
    recommendations.push('Comprehensive integrity assessment due to advanced age');
  }
  
  if (!data.environmental.cathodicProtection) {
    recommendations.push('Install cathodic protection system immediately');
  }
  
  if (data.inspection.dentsCount > 2) {
    recommendations.push('Evaluate mechanical damage and potential for future growth');
  }
  
  return recommendations.length > 0 ? recommendations : ['Continue standard monitoring protocol'];
}

function generatePredictionRecommendations(data: PipelineTestData, futureProbability: number): string[] {
  const recommendations: string[] = [];
  
  if (futureProbability > 0.1) {
    recommendations.push('High-priority maintenance scheduling recommended');
    recommendations.push('Consider partial pipeline replacement in critical sections');
  } else if (futureProbability > 0.05) {
    recommendations.push('Increase inspection frequency to annual');
    recommendations.push('Implement condition-based monitoring');
  } else {
    recommendations.push('Continue current maintenance schedule');
    recommendations.push('Monitor corrosion rate trends');
  }
  
  if (data.environmental.corrosionRate > 0.8) {
    recommendations.push('Prioritize corrosion mitigation strategies');
  }
  
  return recommendations;
}

function calculateNextInspection(data: PipelineTestData): string {
  const riskLevel = data.riskFactors.currentRiskLevel;
  const lastInspection = new Date(data.inspection.lastInspectionDate);
  
  let intervalMonths: number;
  switch (riskLevel) {
    case 'HIGH': intervalMonths = 12; break;
    case 'MEDIUM': intervalMonths = 24; break;
    case 'LOW': intervalMonths = 36; break;
    default: intervalMonths = 60; break;
  }
  
  const nextInspection = new Date(lastInspection);
  nextInspection.setMonth(nextInspection.getMonth() + intervalMonths);
  
  return nextInspection.toISOString().split('T')[0];
}
