/**
 * Pipeline List component
 * @fileoverview Display and manage pipeline list with filtering and search
 */

import React, { useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { usePipelines } from '../../hooks';

export const PipelineList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { pipelines, loading, error } = usePipelines();

  const filteredPipelines = React.useMemo(() => {
    return pipelines.filter(pipeline => {
      const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pipeline.material.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [pipelines, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️ Error loading pipelines</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          Add Pipeline
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search pipelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Pipeline List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pipelines ({filteredPipelines.length})
          </h2>
        </div>
        
        {filteredPipelines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pipelines match your criteria
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPipelines.map((pipeline) => (
              <div key={pipeline.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {pipeline.name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>📏 {pipeline.diameter}" diameter</span>
                      <span>🔧 {pipeline.material}</span>
                      <span>📅 Installed {new Date(pipeline.installationDate).getFullYear()}</span>
                      <span>💪 {pipeline.pressureRating} PSI</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pipeline.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : pipeline.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pipeline.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
