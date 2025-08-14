/**
 * Risk Assessments component
 * @fileoverview Comprehensive risk assessment dashboard and management
 */

import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { apiService } from '../../services/api';
import { RiskAssessment } from '../../types';

const riskLevelColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const riskFactorIcons = {
  corrosion: '🦠',
  pressure: '💨',
  age: '⏰',
  depth: '🕳️',
  soil: '🌍',
  temperature: '🌡️',
  traffic: '🚗',
  weather: '🌦️'
};

export const RiskAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  
  // New assessment workflow states
  const [assessmentStep, setAssessmentStep] = useState<'select' | 'configure' | 'progress' | 'complete'>('select');
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | null>(null);
  const [availablePipelines, setAvailablePipelines] = useState<any[]>([]);
  const [assessmentConfig, setAssessmentConfig] = useState({
    includeCorrosion: true,
    includePressure: true,
    includeEnvironmental: true,
    includeMaintenance: true,
    inspectionUrgency: 'standard' // standard, urgent, scheduled
  });
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);

  const startNewAssessment = async () => {
    setShowNewAssessment(true);
    setAssessmentStep('select');
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
    setAssessmentStep('configure');
  };

  const startAssessmentProcess = async () => {
    setAssessmentStep('progress');
    setAssessmentProgress(0);
    
    // Simulate assessment process with progress
    const steps = [
      'Initializing assessment parameters...',
      'Analyzing pipeline structural data...',
      'Evaluating corrosion patterns...',
      'Processing pressure variance data...',
      'Assessing environmental factors...',
      'Running AI risk prediction models...',
      'Generating maintenance recommendations...',
      'Finalizing risk assessment report...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setAssessmentProgress((i + 1) * 12.5); // 8 steps = 100%
        console.log(`Assessment Step ${i + 1}: ${steps[i]}`);
      }, i * 800);
    }
    
    // Complete the assessment after all steps
    setTimeout(async () => {
      try {
        const selectedPipeline = availablePipelines.find(p => p.id === selectedPipelineId);
        const newAssessmentData = {
          pipelineId: selectedPipelineId!,
          pipelineName: selectedPipeline?.name || `Pipeline-${selectedPipelineId}`,
          overallRiskScore: 0,
          riskLevel: 'medium' as const,
          nextInspectionDue: '',
          inspector: '',
          factorsConsidered: [],
          recommendations: []
        };

        const result = await apiService.createRiskAssessment(newAssessmentData);
        setCurrentAssessment(result);
        setAssessmentStep('complete');
        
        // Refresh assessments list
        await fetchAssessments();
      } catch (error) {
        console.error('Error creating assessment:', error);
        alert('❌ Error generating risk assessment. Please try again.');
        setShowNewAssessment(false);
      }
    }, steps.length * 800 + 500);
  };

  const closeAssessmentModal = () => {
    setShowNewAssessment(false);
    setAssessmentStep('select');
    setSelectedPipelineId(null);
    setAssessmentProgress(0);
    setCurrentAssessment(null);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // CSV Data Import Functions
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showCSVModal, setShowCSVModal] = useState(false);

  const handleImportCSVData = async () => {
    try {
      const response = await fetch('/api/risk-assessments/csv-data');
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

  const assessCSVPipeline = async (pipelineId: string) => {
    try {
      const response = await fetch(`/api/risk-assessments/assess-csv/${pipelineId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh assessments to show the new one
        await fetchAssessments();
        alert(`Risk assessment completed for ${result.data.pipelineName}`);
      } else {
        alert('Failed to generate assessment');
      }
    } catch (error) {
      console.error('Failed to assess CSV pipeline:', error);
      alert('Failed to generate assessment');
    }
  };

  const fetchAssessments = async () => {
    try {
      const data = await apiService.getRiskAssessments();
      setAssessments(data.assessments || []); // Now correctly matches API service return type
    } catch (error) {
      console.error('Failed to fetch risk assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => 
    filterRiskLevel === 'all' || assessment.riskLevel === filterRiskLevel
  );

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSeverityIcon = (level: number) => {
    const icons = ['🟢', '🟡', '🟠', '🔴', '⚫'];
    return icons[Math.min(level - 1, 4)];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk Assessments</h1>
            <p className="text-gray-600 mt-2">Comprehensive pipeline risk analysis and monitoring</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleImportCSVData()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              📊 Import CSV Test Data
            </button>
            <button 
              onClick={() => startNewAssessment()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              🔍 New Assessment
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Assessments', value: assessments.length, color: 'text-blue-600' },
            { label: 'High Risk', value: assessments.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length, color: 'text-red-600' },
            { label: 'Due for Inspection', value: assessments.filter(a => new Date(a.nextInspectionDue) <= new Date()).length, color: 'text-orange-600' },
            { label: 'Average Risk Score', value: Math.round(assessments.reduce((sum, a) => sum + a.overallRiskScore, 0) / assessments.length), color: 'text-purple-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value || 0}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select 
            value={filterRiskLevel} 
            onChange={(e) => setFilterRiskLevel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div 
            key={assessment.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedAssessment(assessment)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {assessment.pipelineName}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {assessment.pipelineId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${riskLevelColors[assessment.riskLevel]}`}>
                  {assessment.riskLevel.toUpperCase()}
                </span>
              </div>

              {/* Risk Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Risk Score</span>
                  <span className={`text-xl font-bold ${getRiskScoreColor(assessment.overallRiskScore)}`}>
                    {assessment.overallRiskScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      assessment.overallRiskScore >= 80 ? 'bg-red-500' :
                      assessment.overallRiskScore >= 60 ? 'bg-orange-500' :
                      assessment.overallRiskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${assessment.overallRiskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Risk Factors */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Key Risk Factors</p>
                <div className="flex flex-wrap gap-2">
                  {assessment.factorsConsidered.slice(0, 3).map((factor, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {riskFactorIcons[factor.type as keyof typeof riskFactorIcons] || '⚠️'}
                      {factor.type} {getSeverityIcon(factor.severityLevel)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>📅 Assessed: {new Date(assessment.assessmentDate).toLocaleDateString()}</p>
                <p>🔍 Next Inspection: {new Date(assessment.nextInspectionDue).toLocaleDateString()}</p>
                <p>👤 Inspector: {assessment.inspector}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Risk Assessment Details - {selectedAssessment.pipelineName}
                  </h2>
                  <p className="text-gray-600">Pipeline ID: {selectedAssessment.pipelineId}</p>
                </div>
                <button 
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Risk Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Risk Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Risk Score:</span>
                      <span className={`font-bold ${getRiskScoreColor(selectedAssessment.overallRiskScore)}`}>
                        {selectedAssessment.overallRiskScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${riskLevelColors[selectedAssessment.riskLevel]}`}>
                        {selectedAssessment.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assessment Date:</span>
                      <span>{new Date(selectedAssessment.assessmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inspector:</span>
                      <span>{selectedAssessment.inspector}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Next Actions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Next Inspection:</span>
                      <span className={new Date(selectedAssessment.nextInspectionDue) <= new Date() ? 'text-red-600 font-semibold' : ''}>
                        {new Date(selectedAssessment.nextInspectionDue).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <span className={`font-semibold ${
                        selectedAssessment.riskLevel === 'critical' ? 'text-red-600' :
                        selectedAssessment.riskLevel === 'high' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {selectedAssessment.riskLevel === 'critical' ? 'URGENT' : 
                         selectedAssessment.riskLevel === 'high' ? 'HIGH' : 'NORMAL'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factors Detail */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Risk Factors Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAssessment.factorsConsidered.map((factor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {riskFactorIcons[factor.type as keyof typeof riskFactorIcons] || '⚠️'}
                        </span>
                        <span className="font-medium capitalize">{factor.type}</span>
                        <span className="ml-auto">
                          {getSeverityIcon(factor.severityLevel)} Level {factor.severityLevel}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Value: {factor.value} | Severity: {factor.severityLevel}/5
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.severityLevel >= 4 ? 'bg-red-500' :
                            factor.severityLevel >= 3 ? 'bg-orange-500' :
                            factor.severityLevel >= 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(factor.severityLevel / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {selectedAssessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  📊 Generate Report
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  🔄 Update Assessment
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  🤖 Run AI Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Assessment Workflow Modal */}
      {showNewAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            
            {/* Step 1: Pipeline Selection */}
            {assessmentStep === 'select' && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🔍 Select Pipeline for Assessment</h3>
                <p className="text-gray-600 mb-6">Choose the pipeline you want to assess:</p>
                
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  {availablePipelines.length > 0 ? (
                    <div className="space-y-2 p-4">
                      {availablePipelines.map((pipeline) => (
                        <div 
                          key={pipeline.id}
                          onClick={() => selectPipeline(pipeline.id)}
                          className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
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
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeAssessmentModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Assessment Configuration */}
            {assessmentStep === 'configure' && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">⚙️ Configure Assessment Parameters</h3>
                <p className="text-gray-600 mb-6">
                  Customize the assessment for Pipeline ID: {selectedPipelineId}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={assessmentConfig.includeCorrosion}
                        onChange={(e) => setAssessmentConfig({...assessmentConfig, includeCorrosion: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Corrosion Analysis</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={assessmentConfig.includePressure}
                        onChange={(e) => setAssessmentConfig({...assessmentConfig, includePressure: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Pressure Testing</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={assessmentConfig.includeEnvironmental}
                        onChange={(e) => setAssessmentConfig({...assessmentConfig, includeEnvironmental: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Environmental Factors</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={assessmentConfig.includeMaintenance}
                        onChange={(e) => setAssessmentConfig({...assessmentConfig, includeMaintenance: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Maintenance History</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Assessment Priority:</label>
                    <select 
                      value={assessmentConfig.inspectionUrgency}
                      onChange={(e) => setAssessmentConfig({...assessmentConfig, inspectionUrgency: e.target.value})}
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="standard">Standard Assessment</option>
                      <option value="urgent">Urgent Assessment</option>
                      <option value="scheduled">Scheduled Maintenance</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setAssessmentStep('select')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={startAssessmentProcess}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Assessment
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Assessment Progress */}
            {assessmentStep === 'progress' && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🔄 Running Assessment</h3>
                <p className="text-gray-600 mb-6">Please wait while we analyze the pipeline...</p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Assessment Progress</span>
                    <span>{Math.round(assessmentProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{width: `${assessmentProgress}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Analyzing pipeline data and generating risk assessment...</p>
                </div>
              </>
            )}

            {/* Step 4: Assessment Complete */}
            {assessmentStep === 'complete' && currentAssessment && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">✅ Assessment Complete</h3>
                <p className="text-gray-600 mb-6">Risk assessment has been completed successfully!</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Assessment Results:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        currentAssessment.data?.riskLevel ? riskLevelColors[currentAssessment.data.riskLevel as keyof typeof riskLevelColors] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentAssessment.data?.riskLevel?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Score:</span>
                      <span className="ml-2 font-medium">{currentAssessment.data?.overallRiskScore}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Inspector:</span>
                      <span className="ml-2">{currentAssessment.data?.inspector}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Assessment Date:</span>
                      <span className="ml-2">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={closeAssessmentModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              </>
            )}
            
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
                  <h2 className="text-2xl font-bold text-gray-900">CSV Test Data - Risk Assessment</h2>
                  <p className="text-gray-600 mt-1">Select a pipeline from the test data to perform real risk assessment</p>
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
                            <span className="text-gray-500">Risk Level:</span>
                            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                              pipeline.riskFactors.currentRiskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                              pipeline.riskFactors.currentRiskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pipeline.riskFactors.currentRiskLevel}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Wall Loss:</span>
                            <span className="ml-1 font-medium">{pipeline.inspection.wallLossPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          assessCSVPipeline(pipeline.id);
                          setShowCSVModal(false);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-4"
                      >
                        🔍 Assess Risk
                      </button>
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
