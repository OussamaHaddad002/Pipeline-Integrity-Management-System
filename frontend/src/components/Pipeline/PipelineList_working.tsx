/**
 * Pipeline List component
 * @fileoverview Display and manage pipeline list with real functionality
 */

import React, { useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { usePipelines } from '../../hooks';
import { apiService } from '../../services/api';

interface NewPipelineForm {
  name: string;
  diameter: number;
  material: string;
  pressureRating: number;
  status: 'active' | 'maintenance' | 'inactive';
}

export const PipelineList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPipeline, setNewPipeline] = useState<NewPipelineForm>({
    name: '',
    diameter: 24,
    material: 'Carbon Steel',
    pressureRating: 1440,
    status: 'active'
  });
  
  const { pipelines, loading, error, refetch } = usePipelines();

  const handleAddPipeline = async () => {
    try {
      // Create new pipeline data
      const pipelineData = {
        name: newPipeline.name,
        diameter: newPipeline.diameter,
        pressureRating: newPipeline.pressureRating,
        material: newPipeline.material,
        installationDate: new Date().toISOString().split('T')[0],
        status: newPipeline.status,
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [Math.random() * 2 + 49, Math.random() * 2 - 97], // Random coordinates
            [Math.random() * 2 + 49.1, Math.random() * 2 - 96.9]
          ] as [number, number][]
        }
      };

      // Add to API - using the createPipeline method
      await apiService.createPipeline(pipelineData);
      
      // Refetch the pipelines to update the list
      await refetch();
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewPipeline({ name: '', diameter: 24, pressureRating: 1440, material: 'Carbon Steel', status: 'active' });
      
      alert('✅ Pipeline Successfully Added!\n\nThe new pipeline has been registered in the system and is now visible in the list.');
    } catch (error) {
      console.error('Error adding pipeline:', error);
      alert('❌ Error adding pipeline. Please try again.');
    }
  };

  const filteredPipelines = React.useMemo(() => {
    return pipelines.filter(pipeline => {
      const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pipeline.material.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pipelines, searchTerm, statusFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline Network</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your pipeline infrastructure</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>+</span> Add Pipeline
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search pipelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Pipeline List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPipelines.map((pipeline) => (
            <div key={pipeline.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pipeline.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pipeline.status === 'active' ? 'bg-green-100 text-green-800' :
                  pipeline.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {pipeline.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Diameter:</span> {pipeline.diameter}"
                </div>
                <div>
                  <span className="font-medium">Material:</span> {pipeline.material}
                </div>
                <div>
                  <span className="font-medium">Pressure:</span> {pipeline.pressureRating} PSI
                </div>
                <div>
                  <span className="font-medium">Installation:</span> {new Date(pipeline.installationDate).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Created: {new Date(pipeline.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Pipeline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Add New Pipeline</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name</label>
                <input
                  type="text"
                  value={newPipeline.name}
                  onChange={(e) => setNewPipeline({...newPipeline, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pipeline name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diameter (inches)</label>
                <input
                  type="number"
                  value={newPipeline.diameter}
                  onChange={(e) => setNewPipeline({...newPipeline, diameter: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pressure Rating (PSI)</label>
                <input
                  type="number"
                  value={newPipeline.pressureRating}
                  onChange={(e) => setNewPipeline({...newPipeline, pressureRating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select
                  value={newPipeline.material}
                  onChange={(e) => setNewPipeline({...newPipeline, material: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Carbon Steel">Carbon Steel</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="HDPE">HDPE</option>
                  <option value="PVC">PVC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newPipeline.status}
                  onChange={(e) => setNewPipeline({...newPipeline, status: e.target.value as 'active' | 'maintenance' | 'inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPipeline}
                disabled={!newPipeline.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Add Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
