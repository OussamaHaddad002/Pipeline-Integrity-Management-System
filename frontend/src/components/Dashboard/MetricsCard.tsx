/**
 * Modern Dashboard MetricsCard component
 * @fileoverview Displays key metrics with advanced UI styling and trend indicators
 */

import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  gradient,
  bgGradient,
  trend,
  description
}) => {
  return (
    <div className="group">
      <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
            <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-10 rounded-full`}></div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              {description && <p className="text-xs text-slate-500">{description}</p>}
            </div>
            
            <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg text-white`}>
              {icon}
            </div>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div className="mt-4 flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend.direction === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : trend.direction === 'down'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {trend.direction === 'up' ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                ) : trend.direction === 'down' ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                  </svg>
                ) : (
                  <div className="w-3 h-0.5 bg-current rounded-full" />
                )}
                <span>{trend.value}%</span>
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
