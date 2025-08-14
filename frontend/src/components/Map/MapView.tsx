/**
 * Map View component
 * @fileoverview Interactive map displaying pipelines with risk visualization
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pipeline, RiskAssessment, Incident } from '../../types';

interface MapViewProps {
  pipelines: Pipeline[];
  riskAssessments?: RiskAssessment[];
  incidents?: Incident[];
  onPipelineClick?: (pipeline: Pipeline) => void;
  height?: string;
}

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapView: React.FC<MapViewProps> = ({
  pipelines,
  riskAssessments = [],
  incidents = [],
  onPipelineClick,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Risk level colors
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Initialize layer group
    layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    // Clear existing layers
    layerGroupRef.current.clearLayers();

    // Add pipelines
    pipelines.forEach((pipeline) => {
      const coordinates = pipeline.geometry.coordinates.map(coord => 
        [coord[1], coord[0]] as [number, number]
      );

      // Find risk assessment for this pipeline
      const riskAssessment = riskAssessments.find(r => r.pipelineId === pipeline.id);
      const riskLevel = riskAssessment?.riskLevel || 'low';
      
      // Create polyline
      const polyline = L.polyline(coordinates, {
        color: getRiskColor(riskLevel),
        weight: 4,
        opacity: 0.8
      });

      // Add popup
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg">${pipeline.name}</h3>
          <div class="mt-2 space-y-1 text-sm">
            <p><strong>Status:</strong> <span class="capitalize">${pipeline.status}</span></p>
            <p><strong>Material:</strong> ${pipeline.material}</p>
            <p><strong>Diameter:</strong> ${pipeline.diameter}" </p>
            <p><strong>Pressure Rating:</strong> ${pipeline.pressureRating} PSI</p>
            ${riskAssessment ? `
              <p><strong>Risk Level:</strong> 
                <span class="px-2 py-1 rounded text-xs font-medium" style="background-color: ${getRiskColor(riskLevel)}20; color: ${getRiskColor(riskLevel)};">
                  ${riskLevel.toUpperCase()}
                </span>
              </p>
              <p><strong>Risk Score:</strong> ${riskAssessment.overallRiskScore}/100</p>
            ` : ''}
          </div>
        </div>
      `;

      polyline.bindPopup(popupContent);

      // Add click handler
      if (onPipelineClick) {
        polyline.on('click', () => onPipelineClick(pipeline));
      }

      layerGroupRef.current?.addLayer(polyline);
    });

    // Add incident markers
    incidents.forEach((incident) => {
      const [lng, lat] = incident.location.coordinates;
      
      // Custom icon based on severity
      const getIncidentIcon = (severity: string) => {
        const color = severity === 'critical' ? 'red' : 
                     severity === 'major' ? 'orange' :
                     severity === 'moderate' ? 'yellow' : 'blue';
        
        return L.divIcon({
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          className: 'incident-marker'
        });
      };

      const marker = L.marker([lat, lng], {
        icon: getIncidentIcon(incident.severity)
      });

      const incidentPopup = `
        <div class="p-2">
          <h4 class="font-bold text-red-600">Incident Report</h4>
          <div class="mt-2 space-y-1 text-sm">
            <p><strong>Type:</strong> ${incident.incidentType}</p>
            <p><strong>Severity:</strong> ${incident.severity}</p>
            <p><strong>Date:</strong> ${new Date(incident.incidentDate).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${incident.description}</p>
            <p><strong>Cause:</strong> ${incident.cause}</p>
            <p><strong>Cost:</strong> $${incident.costEstimate.toLocaleString()}</p>
          </div>
        </div>
      `;

      marker.bindPopup(incidentPopup);
      layerGroupRef.current?.addLayer(marker);
    });

    // Fit bounds if pipelines exist
    if (pipelines.length > 0) {
      const bounds = L.latLngBounds(
        pipelines.flatMap(pipeline => 
          pipeline.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number])
        )
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

  }, [pipelines, riskAssessments, incidents, onPipelineClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200 shadow-sm"
    />
  );
};
