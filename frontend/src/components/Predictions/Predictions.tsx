/**
 * AI Predictions component
 * @fileoverview Advanced AI predictions and machine learning insights dashboard
 */

import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { apiService } from '../../services/api';

interface PredictionInput {
  age: number;
  corrosionRate: number;
  pressureVariance: number;
  soilConditions: string;
  maintenanceHistory: string;
  temperature: number;
  depth: number;
}

interface Prediction {
  id: number;
  pipelineId: number;
  pipelineName: string;
  failureProbability: number;
  confidenceScore: number;
  predictedFailureDate: string;
  predictionModel: string;
  inputParameters: PredictionInput;
  recommendation: string;
  createdAt: string;
  riskFactors: {
    primary: string;
    secondary: string[];
  };
  maintenanceActions: string[];
}

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastUpdated: string;
}

export const Predictions: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showNewPrediction, setShowNewPrediction] = useState(false);
  
  // New prediction workflow states
  const [predictionStep, setPredictionStep] = useState<'select' | 'configure' | 'progress' | 'complete'>('select');
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | null>(null);
  const [availablePipelines, setAvailablePipelines] = useState<any[]>([]);
  const [predictionConfig, setPredictionConfig] = useState({
    modelType: 'ensemble', // ensemble, randomForest, neuralNetwork
    analysisDepth: 'comprehensive', // basic, standard, comprehensive
    confidenceThreshold: 0.8,
    includeTrends: true,
    includeEnvironmental: true,
    includeMaintenanceHistory: true
  });
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);

  const startNewPrediction = async () => {
    setShowNewPrediction(true);
    setPredictionStep('select');
    // Fetch available pipelines for selection
    try {
      const pipelineData = await apiService.getPipelines();
      setAvailablePipelines(pipelineData.data || []);
    } catch (error) {
      console.error('Failed to fetch pipelines:', error);
      setAvailablePipelines([]);
    }
  };

  const selectPipeline = (pipelineId: number) => {
    setSelectedPipelineId(pipelineId);
    setPredictionStep('configure');
  };

  const startPredictionProcess = async () => {
    setPredictionStep('progress');
    setPredictionProgress(0);
    
    // Simulate AI prediction process with progress
    const steps = [
      'Initializing ML models...',
      'Loading pipeline historical data...',
      'Analyzing corrosion patterns...',
      'Processing environmental factors...',
      'Running failure probability algorithms...',
      'Calculating confidence scores...',
      'Generating maintenance recommendations...',
      'Finalizing prediction report...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setPredictionProgress((i + 1) * 12.5); // 8 steps = 100%
        console.log(`Prediction Step ${i + 1}: ${steps[i]}`);
      }, i * 700);
    }
    
    // Complete the prediction after all steps
    setTimeout(async () => {
      try {
        const selectedPipeline = availablePipelines.find(p => p.id === selectedPipelineId);
        const newPredictionData = {
          pipelineId: selectedPipelineId!,
          pipelineName: selectedPipeline?.name || `Pipeline-${selectedPipelineId}`
        };

        const result = await apiService.createPrediction(newPredictionData);
        setCurrentPrediction(result);
        setPredictionStep('complete');
        
        // Refresh predictions list
        await fetchPredictions();
      } catch (error) {
        console.error('Error creating prediction:', error);
        alert('❌ Error generating prediction. Please try again.');
        setShowNewPrediction(false);
      }
    }, steps.length * 700 + 500);
  };

  const closePredictionModal = () => {
    setShowNewPrediction(false);
    setPredictionStep('select');
    setSelectedPipelineId(null);
    setPredictionProgress(0);
    setCurrentPrediction(null);
  };
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance | null>(null);
  const [filterProbability, setFilterProbability] = useState<string>('all');

  useEffect(() => {
    fetchPredictions();
    fetchModelPerformance();
  }, []);

  const fetchPredictions = async () => {
    try {
      const data = await apiService.getPredictions();
      setPredictions(data.data as any || []);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelPerformance = async () => {
    try {
      const data = await apiService.getModelPerformance();
      setModelPerformance(data);
    } catch (error) {
      console.error('Failed to fetch model performance:', error);
    }
  };

  // CSV Data Import Functions
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showCSVModal, setShowCSVModal] = useState(false);

  const handleImportCSVData = async () => {
    try {
      const response = await fetch('/api/predictions/csv-data');
      const result = await response.json();
      if (result.success) {
        setCsvData(result.data);
        setShowCSVModal(true);
      }
    } catch (error) {
      console.error('Failed to import CSV data:', error);
      alert('Failed to import CSV test data');
    }
  };

  const predictCSVPipeline = async (pipelineId: string, modelType = 'ensemble') => {
    try {
      const response = await fetch(`/api/predictions/predict-csv/${pipelineId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modelType, timeHorizon: 5 })
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh predictions to show the new one
        await fetchPredictions();
        alert(`AI prediction completed for ${result.data.pipelineName}`);
      } else {
        alert('Failed to generate prediction');
      }
    } catch (error) {
      console.error('Failed to predict CSV pipeline:', error);
      alert('Failed to generate prediction');
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-red-600 bg-red-50 border-red-200';
    if (probability >= 0.6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 0.8) return '🚨';
    if (probability >= 0.6) return '⚠️';
    if (probability >= 0.4) return '⚡';
    return '✅';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return '💎';
    if (confidence >= 0.8) return '🎯';
    if (confidence >= 0.7) return '📈';
    return '📊';
  };

  const getDaysUntilFailure = (failureDate: string) => {
    const today = new Date();
    const failure = new Date(failureDate);
    const diffTime = failure.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredPredictions = predictions.filter(prediction => {
    if (filterProbability === 'all') return true;
    const prob = prediction.failureProbability;
    switch (filterProbability) {
      case 'critical': return prob >= 0.8;
      case 'high': return prob >= 0.6 && prob < 0.8;
      case 'medium': return prob >= 0.4 && prob < 0.6;
      case 'low': return prob < 0.4;
      default: return true;
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Model Performance */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow text-white p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">🤖 AI Predictions</h1>
            <p className="text-purple-100 mt-2">Machine learning insights for predictive maintenance</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleImportCSVData()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📊 Import CSV Test Data
            </button>
            <button 
              onClick={() => startNewPrediction()}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Generate Prediction
            </button>
          </div>
        </div>

        {/* Model Performance Stats */}
        {modelPerformance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{(modelPerformance.accuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-purple-100">Accuracy</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{(modelPerformance.precision * 100).toFixed(1)}%</div>
              <div className="text-sm text-purple-100">Precision</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{(modelPerformance.recall * 100).toFixed(1)}%</div>
              <div className="text-sm text-purple-100">Recall</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{(modelPerformance.f1Score * 100).toFixed(1)}%</div>
              <div className="text-sm text-purple-100">F1-Score</div>
            </div>
          </div>
        )}
      </div>

      {/* Summary and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Prediction Dashboard</h2>
            <p className="text-gray-600">AI-powered failure probability analysis</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={filterProbability} 
              onChange={(e) => setFilterProbability(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Probabilities</option>
              <option value="critical">Critical (80%+)</option>
              <option value="high">High (60-80%)</option>
              <option value="medium">Medium (40-60%)</option>
              <option value="low">Low (&lt;40%)</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: 'Total Predictions', 
              value: predictions.length, 
              
              color: 'text-blue-600' 
            },
            { 
              label: 'Critical Risk', 
              value: predictions.filter(p => p.failureProbability >= 0.8).length, 
              
              color: 'text-red-600' 
            },
            { 
              label: 'High Confidence', 
              value: predictions.filter(p => p.confidenceScore >= 0.9).length, 
              
              color: 'text-purple-600' 
            },
            { 
              label: 'Urgent Actions', 
              value: predictions.filter(p => getDaysUntilFailure(p.predictedFailureDate) < 90).length, 
              
              color: 'text-orange-600' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPredictions.map((prediction) => (
          <div 
            key={prediction.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border-l-4 border-purple-500"
            onClick={() => setSelectedPrediction(prediction)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    {getProbabilityIcon(prediction.failureProbability)}
                    {prediction.pipelineName}
                  </h3>
                  <p className="text-sm text-gray-600">Pipeline ID: {prediction.pipelineId}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Model</div>
                  <div className="text-sm font-medium">{prediction.predictionModel.split(' ')[0]}</div>
                </div>
              </div>

              {/* Failure Probability */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Failure Probability</span>
                  <span className={`text-lg font-bold px-2 py-1 rounded border ${getProbabilityColor(prediction.failureProbability)}`}>
                    {prediction.failureProbability < 0.01 
                      ? (prediction.failureProbability * 100).toFixed(3) + '%'
                      : (prediction.failureProbability * 100).toFixed(1) + '%'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      prediction.failureProbability >= 0.8 ? 'bg-red-500' :
                      prediction.failureProbability >= 0.6 ? 'bg-orange-500' :
                      prediction.failureProbability >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${prediction.failureProbability * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className="flex items-center gap-1">
                    {getConfidenceIcon(prediction.confidenceScore)}
                    <span className="font-semibold">{(prediction.confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Days Until Failure</div>
                  <div className="font-semibold text-orange-600">
                    {getDaysUntilFailure(prediction.predictedFailureDate)} days
                  </div>
                </div>
              </div>

              {/* Primary Risk Factor */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Primary Risk Factor</div>
                <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  🔥 {prediction.riskFactors && Array.isArray(prediction.riskFactors) 
                    ? prediction.riskFactors.reduce((max, factor) => 
                        factor.contribution > max.contribution ? factor : max, 
                        prediction.riskFactors[0]
                      )?.factor || 'Unknown'
                    : prediction.riskFactors?.primary || 'Unknown'}
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>📅 Predicted: {new Date(prediction.createdAt).toLocaleDateString()}</p>
                <p>🎯 Failure Date: {new Date(prediction.predictedFailureDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    🤖 AI Prediction Analysis - {selectedPrediction.pipelineName}
                  </h2>
                  <p className="text-gray-600">Pipeline ID: {selectedPrediction.pipelineId}</p>
                </div>
                <button 
                  onClick={() => setSelectedPrediction(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Prediction Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🚨 Failure Probability</h3>
                  <div className="text-3xl font-bold">{(selectedPrediction.failureProbability * 100).toFixed(1)}%</div>
                  <div className="text-sm opacity-90">Risk Level: {
                    selectedPrediction.failureProbability >= 0.8 ? 'CRITICAL' :
                    selectedPrediction.failureProbability >= 0.6 ? 'HIGH' :
                    selectedPrediction.failureProbability >= 0.4 ? 'MEDIUM' : 'LOW'
                  }</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4">
                  <h3 className="font-semibold mb-2">💎 Confidence Score</h3>
                  <div className="text-3xl font-bold">{(selectedPrediction.confidenceScore * 100).toFixed(1)}%</div>
                  <div className="text-sm opacity-90">Model: {selectedPrediction.predictionModel.split(' ')[0]}</div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg p-4">
                  <h3 className="font-semibold mb-2">⏰ Time to Failure</h3>
                  <div className="text-3xl font-bold">{getDaysUntilFailure(selectedPrediction.predictedFailureDate)}</div>
                  <div className="text-sm opacity-90">Days remaining</div>
                </div>
              </div>

              {/* Input Parameters Analysis */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">📊 Input Parameters Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(selectedPrediction.inputParameters).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="font-semibold">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">🔥 Risk Factors</h3>
                <div className="space-y-2">
                  {selectedPrediction.riskFactors && Array.isArray(selectedPrediction.riskFactors) ? (
                    selectedPrediction.riskFactors
                      .sort((a, b) => b.contribution - a.contribution)
                      .slice(0, 3)
                      .map((factor, index) => (
                        <div 
                          key={index}
                          className={`border rounded-lg p-3 ${
                            index === 0 ? 'bg-red-50 border-red-200' :
                            index === 1 ? 'bg-orange-50 border-orange-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-medium ${
                              index === 0 ? 'text-red-800' :
                              index === 1 ? 'text-orange-800' :
                              'text-yellow-800'
                            }`}>
                              {index === 0 ? 'Primary: ' : index === 1 ? 'Secondary: ' : 'Tertiary: '}
                            </span>
                            <span className={`text-sm font-semibold ${
                              index === 0 ? 'text-red-700' :
                              index === 1 ? 'text-orange-700' :
                              'text-yellow-700'
                            }`}>
                              {(factor.contribution * 100).toFixed(1)}%
                            </span>
                          </div>
                          <span className={`${
                            index === 0 ? 'text-red-700' :
                            index === 1 ? 'text-orange-700' :
                            'text-yellow-700'
                          }`}>
                            {factor.factor} - {factor.description}
                          </span>
                          <div className={`text-xs mt-1 ${
                            index === 0 ? 'text-red-600' :
                            index === 1 ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                            Trend: {factor.trend}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <span className="text-gray-600">Risk factor data not available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">💡 AI Recommendation</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{selectedPrediction.recommendation}</p>
                </div>
              </div>

              {/* Maintenance Actions */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">🔧 Recommended Actions</h3>
                <div className="space-y-2">
                  {selectedPrediction.maintenanceActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  📄 Export Report
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  📅 Schedule Maintenance
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  🔄 Retrain Model
                </button>
                <button 
                  onClick={() => startNewPrediction()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ⚡ Run New Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Prediction Workflow Modal */}
      {showNewPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              
              {/* Step 1: Pipeline Selection */}
              {predictionStep === 'select' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">🔮 Select Pipeline for AI Prediction</h2>
                    <button 
                      onClick={closePredictionModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">Choose the pipeline you want to generate predictions for:</p>
                  
                  <div className="max-h-64 overflow-y-auto border rounded-lg">
                    {availablePipelines.length > 0 ? (
                      <div className="space-y-2 p-4">
                        {availablePipelines.map((pipeline) => (
                          <div 
                            key={pipeline.id}
                            onClick={() => selectPipeline(pipeline.id)}
                            className="p-3 border rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                          >
                            <div className="font-medium">{pipeline.name}</div>
                            <div className="text-sm text-gray-500">
                              Diameter: {pipeline.diameter}" | Material: {pipeline.material} | Length: {pipeline.length} km
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">Loading pipelines...</div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Prediction Configuration */}
              {predictionStep === 'configure' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">⚙️ Configure AI Prediction Model</h2>
                    <button 
                      onClick={closePredictionModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Customize the ML prediction for Pipeline ID: {selectedPipelineId}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Model Type:</label>
                      <select 
                        value={predictionConfig.modelType}
                        onChange={(e) => setPredictionConfig({...predictionConfig, modelType: e.target.value})}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="ensemble">Ensemble (Random Forest + Gradient Boost)</option>
                        <option value="randomForest">Random Forest Only</option>
                        <option value="neuralNetwork">Neural Network</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Analysis Depth:</label>
                      <select 
                        value={predictionConfig.analysisDepth}
                        onChange={(e) => setPredictionConfig({...predictionConfig, analysisDepth: e.target.value})}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="basic">Basic Analysis</option>
                        <option value="standard">Standard Analysis</option>
                        <option value="comprehensive">Comprehensive Analysis</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Confidence Threshold: {predictionConfig.confidenceThreshold}</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="0.99" 
                        step="0.01"
                        value={predictionConfig.confidenceThreshold}
                        onChange={(e) => setPredictionConfig({...predictionConfig, confidenceThreshold: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={predictionConfig.includeTrends}
                          onChange={(e) => setPredictionConfig({...predictionConfig, includeTrends: e.target.checked})}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span>Include Trend Analysis</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={predictionConfig.includeEnvironmental}
                          onChange={(e) => setPredictionConfig({...predictionConfig, includeEnvironmental: e.target.checked})}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span>Environmental Factors</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={predictionConfig.includeMaintenanceHistory}
                          onChange={(e) => setPredictionConfig({...predictionConfig, includeMaintenanceHistory: e.target.checked})}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span>Maintenance History</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setPredictionStep('select')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={startPredictionProcess}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Generate Prediction
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Prediction Progress */}
              {predictionStep === 'progress' && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">🤖 AI Model Processing</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-center">Machine learning models are analyzing pipeline data...</p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>ML Processing Progress</span>
                      <span>{Math.round(predictionProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{width: `${predictionProgress}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Running ensemble ML models and calculating predictions...</p>
                  </div>
                </>
              )}

              {/* Step 4: Prediction Complete */}
              {predictionStep === 'complete' && currentPrediction && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">✅ AI Prediction Complete</h2>
                    <button 
                      onClick={closePredictionModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">AI prediction has been generated successfully!</p>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="font-medium mb-4">Prediction Results:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Failure Probability:</span>
                        <span className="ml-2 font-medium text-lg">
                          {Math.round((currentPrediction.data?.failureProbability || 0) * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence Score:</span>
                        <span className="ml-2 font-medium text-lg">
                          {Math.round((currentPrediction.data?.confidenceScore || 0) * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Model Used:</span>
                        <span className="ml-2 font-medium">{currentPrediction.data?.predictionModel}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Generated:</span>
                        <span className="ml-2">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {currentPrediction.data?.recommendation && (
                      <div className="mt-4 p-3 bg-white rounded border-l-4 border-purple-500">
                        <p className="text-sm font-medium">Recommendation:</p>
                        <p className="text-sm text-gray-600">{currentPrediction.data.recommendation}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={closePredictionModal}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </>
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">CSV Test Data - AI Predictions</h2>
                  <p className="text-gray-600 mt-1">Select a pipeline from the test data to generate AI-powered failure predictions</p>
                </div>
                <button 
                  onClick={() => setShowCSVModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-4">
                {csvData.map((pipeline, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{pipeline.name}</h3>
                        <p className="text-gray-600">{pipeline.operator}</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Diameter:</span>
                            <span className="ml-1 font-medium">{pipeline.specifications.diameter}"</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Age:</span>
                            <span className="ml-1 font-medium">{pipeline.operational.age} years</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Corrosion Rate:</span>
                            <span className="ml-1 font-medium">{pipeline.environmental.corrosionRate} mils/yr</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Current Risk:</span>
                            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                              pipeline.riskFactors.currentRiskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                              pipeline.riskFactors.currentRiskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pipeline.riskFactors.currentRiskLevel}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                          <span>Failure Probability: {(pipeline.riskFactors.failureProbability * 100).toFixed(1)}%</span>
                          <span>Product: {pipeline.specifications.productType}</span>
                          <span>Material: {pipeline.specifications.materialGrade}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => {
                            predictCSVPipeline(pipeline.id, 'ensemble');
                            setShowCSVModal(false);
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          🤖 Ensemble Model
                        </button>
                        <button
                          onClick={() => {
                            predictCSVPipeline(pipeline.id, 'random-forest');
                            setShowCSVModal(false);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🌳 Random Forest
                        </button>
                        <button
                          onClick={() => {
                            predictCSVPipeline(pipeline.id, 'neural-network');
                            setShowCSVModal(false);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          🧠 Neural Network
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
