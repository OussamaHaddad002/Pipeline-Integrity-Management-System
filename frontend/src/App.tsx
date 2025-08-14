/**
 * Main App component for the Pipeline Risk Assessment Dashboard
 * @fileoverview Root component that sets up routing and global providers
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Dashboard } from './components/Dashboard';
import { MapView } from './components';
import { PipelineList } from './components/Pipeline/PipelineList';
import { PipelineDetail } from './components';
import { RiskAssessments } from './components/Risk/RiskAssessments';
import { Predictions } from './components';
import { useWebSocket } from './hooks';

const App: React.FC = () => {
  const { connected } = useWebSocket();

  return (
    <Router>
      <Layout>
        <div className="relative">
          {/* WebSocket connection indicator */}
          <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
            connected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView pipelines={[]} />} />
            <Route path="/pipelines" element={<PipelineList />} />
            <Route path="/pipelines/:id" element={<PipelineDetail />} />
            <Route path="/risk-assessments" element={<RiskAssessments />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
