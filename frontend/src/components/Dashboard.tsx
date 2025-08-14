/**
 * Dashboard component displaying key metrics and overview
 * @fileoverview Main dashboard with KPIs, charts, and real-time updates
 */

import React from 'react';
import { useDashboardMetrics, usePipelines } from '../hooks';
import { MetricsCard } from './Dashboard/MetricsCard';
import { RiskTrendChart } from './Charts/RiskTrendChart';
import { PipelineStatusChart } from './Charts/PipelineStatusChart';
import { AlertsList } from './common/AlertsList';
import { LoadingSpinner } from './common/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { pipelines, loading: pipelinesLoading } = usePipelines(1, 5);

  if (metricsLoading || pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pipeline Risk Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Real-time monitoring and risk assessment for pipeline integrity management
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Pipelines"
          value={metrics?.totalPipelines || 0}
          icon="🔧"
          color="blue"
          trend={{ value: 2, direction: 'up' }}
        />
        <MetricsCard
          title="High Risk"
          value={metrics?.highRiskPipelines || 0}
          icon="⚠️"
          color="yellow"
          trend={{ value: 1, direction: 'down' }}
        />
        <MetricsCard
          title="Critical Alerts"
          value={metrics?.criticalAlerts || 0}
          icon="🚨"
          color="red"
          trend={{ value: 0, direction: 'neutral' }}
        />
        <MetricsCard
          title="Avg Risk Score"
          value={metrics?.averageRiskScore?.toFixed(1) || '0.0'}
          icon="📊"
          color="green"
          trend={{ value: 0.2, direction: 'down' }}
        />
      </div>

      {/* Charts and data visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk trend chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend Analysis</h2>
          <RiskTrendChart />
        </div>

        {/* Pipeline status distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Status</h2>
          <PipelineStatusChart pipelines={pipelines} />
        </div>
      </div>

      {/* Recent activities and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Critical Alerts</h2>
          <AlertsList alerts={[]} />
        </div>

        {/* Recent pipelines */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Pipelines</h2>
          <div className="space-y-3">
            {pipelines.slice(0, 5).map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{pipeline.name}</h3>
                  <p className="text-sm text-gray-500">
                    {pipeline.material} • {pipeline.diameter}" diameter
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pipeline.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : pipeline.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pipeline.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
            <span className="mr-2">🔍</span>
            Run Risk Assessment
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <span className="mr-2">🤖</span>
            Generate AI Prediction
          </button>
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="mr-2">📄</span>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};
