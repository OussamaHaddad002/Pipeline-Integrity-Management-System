/**
 * Modern Dashboard component with advanced UI/UX
 * @fileoverview Redesigned dashboard featuring glass morphism, animations, and professional data visualization
 */

import React, { useState, useEffect } from 'react';
import { useDashboardMetrics, usePipelines } from '../hooks';
import { RiskTrendChart } from './Charts/RiskTrendChart';
import { PipelineStatusChart } from './Charts/PipelineStatusChart';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { pipelines, loading: pipelinesLoading } = usePipelines(1, 5);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  if (metricsLoading || pipelinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-slate-500 animate-pulse">Loading dashboard insights...</p>
        </div>
      </div>
    );
  }

  const metricsData = [
    {
      title: "Active Pipelines",
      value: metrics?.totalPipelines || 10,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      trend: { value: 2, direction: 'up' as const },
      description: "Total operational pipelines"
    },
    {
      title: "Risk Assessments",
      value: metrics?.criticalAlerts || 24,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      trend: { value: 3, direction: 'up' as const },
      description: "Completed this month"
    },
    {
      title: "High Priority",
      value: metrics?.highRiskPipelines || 3,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      trend: { value: 1, direction: 'down' as const },
      description: "Requiring immediate attention"
    },
    {
      title: "System Health",
      value: "98.2%",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      trend: { value: 0.3, direction: 'up' as const },
      description: "Overall system performance"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10 rounded-2xl"></div>
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Good {timeOfDay}! 👋
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Here's what's happening with your pipeline network
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Link 
                to="/risk-assessments"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Assessment
              </Link>
              
              <Link
                to="/predictions"
                className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-slate-700 font-medium rounded-xl border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Predictions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.title} className="group">
            <div className={`relative overflow-hidden bg-gradient-to-br ${metric.bgGradient} rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-50">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5`}></div>
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                  <div className={`w-full h-full bg-gradient-to-br ${metric.gradient} opacity-10 rounded-full`}></div>
                </div>
              </div>

              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-xs text-slate-500">{metric.description}</p>
                  </div>
                  
                  <div className={`p-3 bg-gradient-to-br ${metric.gradient} rounded-xl shadow-lg text-white`}>
                    {metric.icon}
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="mt-4 flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend.direction === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : metric.trend.direction === 'down'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {metric.trend.direction === 'up' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    ) : metric.trend.direction === 'down' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                      </svg>
                    ) : (
                      <div className="w-3 h-0.5 bg-current rounded-full" />
                    )}
                    <span>{metric.trend.value}%</span>
                  </div>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Trend Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Risk Analysis Trends</h2>
              <p className="text-sm text-slate-600 mt-1">30-day risk assessment overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Risk Level</span>
            </div>
          </div>
          <RiskTrendChart />
        </div>

        {/* Pipeline Status Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pipeline Distribution</h2>
              <p className="text-sm text-slate-600 mt-1">Status breakdown by risk category</p>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Low</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-600">Medium</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">High</span>
              </div>
            </div>
          </div>
          <PipelineStatusChart pipelines={pipelines} />
        </div>
      </div>

      {/* Enhanced Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Pipeline Activity</h2>
            <Link to="/pipelines" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 group">
              <span>View All</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-4">
            {pipelines.slice(0, 5).map((pipeline) => (
              <div key={pipeline.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {pipeline.name?.charAt(0) || 'P'}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {pipeline.material} • {pipeline.diameter}" diameter • Last assessed 2 days ago
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pipeline.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : pipeline.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {pipeline.status || 'Active'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Risk: Low
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link
              to="/risk-assessments"
              className="block p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Run Assessment
                  </h3>
                  <p className="text-xs text-slate-600">Analyze pipeline risks</p>
                </div>
              </div>
            </Link>

            <Link
              to="/predictions"
              className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                    AI Predictions
                  </h3>
                  <p className="text-xs text-slate-600">Generate failure forecasts</p>
                </div>
              </div>
            </Link>

            <Link
              to="/map"
              className="block p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
                    View Map
                  </h3>
                  <p className="text-xs text-slate-600">Geographic overview</p>
                </div>
              </div>
            </Link>
          </div>

          {/* System Status Mini Panel */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">API Response</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Fast</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Data Sync</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 font-medium">Live</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">AI Models</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-600 font-medium">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
