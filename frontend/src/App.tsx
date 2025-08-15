/**
 * Main App component for the Pipeline Risk Assessment Dashboard
 * @fileoverview Root component with modern routing, providers, and enhanced UX
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
        <div className="relative min-h-full">
          {/* Enhanced WebSocket connection indicator */}
          

          {/* Modern page transitions and routing */}
          <div className="transition-all duration-300 ease-in-out">
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
        </div>
      </Layout>
    </Router>
  );
};

export default App;
