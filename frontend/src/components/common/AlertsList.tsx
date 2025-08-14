/**
 * Alerts List component
 * @fileoverview Displays critical alerts and notifications
 */

import React from 'react';
import { Alert } from '../../types';

interface AlertsListProps {
  alerts: Alert[];
  maxItems?: number;
}

const severityColors = {
  critical: 'bg-red-50 border-red-200 text-red-800',
  high: 'bg-orange-50 border-orange-200 text-orange-800',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  low: 'bg-blue-50 border-blue-200 text-blue-800'
};

const severityIcons = {
  critical: '🚨',
  high: '⚠️',
  medium: '⚡',
  low: 'ℹ️'
};

export const AlertsList: React.FC<AlertsListProps> = ({ alerts, maxItems = 5 }) => {
  const displayAlerts = React.useMemo(() => {
    return alerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems);
  }, [alerts, maxItems]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return alertTime.toLocaleDateString();
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">✅</div>
        <p>No active alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 border rounded-lg ${
            severityColors[alert.severity as keyof typeof severityColors]
          }`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-lg">
              {severityIcons[alert.severity as keyof typeof severityIcons]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium truncate">{alert.title}</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm mt-1 line-clamp-2">{alert.description}</p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span>Pipeline: {alert.pipelineId}</span>
                <span>{formatTimestamp(alert.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {alerts.length > maxItems && (
        <div className="text-center pt-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {alerts.length} alerts
          </button>
        </div>
      )}
    </div>
  );
};
