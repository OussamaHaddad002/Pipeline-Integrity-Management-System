/**
 * Risk Trend Chart component
 * @fileoverview Line chart showing risk trends over time
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - in real app this would come from API
const sampleData = [
  { month: 'Jan', highRisk: 12, criticalRisk: 3, averageRisk: 4.2 },
  { month: 'Feb', highRisk: 15, criticalRisk: 4, averageRisk: 4.5 },
  { month: 'Mar', highRisk: 11, criticalRisk: 2, averageRisk: 3.8 },
  { month: 'Apr', highRisk: 18, criticalRisk: 6, averageRisk: 5.1 },
  { month: 'May', highRisk: 14, criticalRisk: 3, averageRisk: 4.3 },
  { month: 'Jun', highRisk: 16, criticalRisk: 5, averageRisk: 4.7 },
];

export const RiskTrendChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sampleData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="highRisk" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="High Risk Pipelines"
          />
          <Line 
            type="monotone" 
            dataKey="criticalRisk" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Critical Risk Pipelines"
          />
          <Line 
            type="monotone" 
            dataKey="averageRisk" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Average Risk Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
