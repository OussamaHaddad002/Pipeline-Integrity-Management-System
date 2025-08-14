/**
 * Pipeline Status Chart component
 * @fileoverview Pie chart showing pipeline status distribution
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Pipeline } from '../../types';

interface PipelineStatusChartProps {
  pipelines: Pipeline[];
}

const COLORS = {
  active: '#10b981',
  maintenance: '#f59e0b', 
  inactive: '#ef4444'
};

export const PipelineStatusChart: React.FC<PipelineStatusChartProps> = ({ pipelines }) => {
  // Calculate status distribution
  const statusData = React.useMemo(() => {
    const statusCounts = pipelines.reduce((acc, pipeline) => {
      acc[pipeline.status] = (acc[pipeline.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: COLORS[status as keyof typeof COLORS] || '#6b7280'
    }));
  }, [pipelines]);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (pipelines.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No pipeline data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
