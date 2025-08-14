/**
 * Dashboard MetricsCard component
 * @fileoverview Displays key metrics with trend indicators
 */

import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'yellow' | 'red' | 'green';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: 'text-blue-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      icon: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: 'text-green-600'
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} p-6 rounded-lg shadow-sm border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-1 text-sm">
              {getTrendIcon()}
              <span className="ml-1 text-gray-600">
                {Math.abs(trend.value)} from last period
              </span>
            </div>
          )}
        </div>
        <div className={`text-3xl ${colors.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
