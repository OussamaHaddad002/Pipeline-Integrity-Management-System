-- Sample data for Pipeline Risk Assessment Dashboard
-- Realistic pipeline data with geographic distribution

-- Insert sample pipelines across different regions
INSERT INTO pipelines (name, geometry, diameter, material, installation_date, pressure_rating, status) VALUES
-- Texas region pipelines
('TX-Main-001', ST_GeomFromText('LINESTRING(-97.7431 30.2672, -97.8431 30.3672, -97.9431 30.4672)', 4326), 24, 'Carbon Steel', '1995-03-15', 1440, 'active'),
('TX-Branch-002', ST_GeomFromText('LINESTRING(-97.9431 30.4672, -98.0431 30.5672, -98.1431 30.6672)', 4326), 16, 'Carbon Steel', '1998-07-20', 1200, 'active'),
('TX-Lateral-003', ST_GeomFromText('LINESTRING(-97.5431 30.1672, -97.6431 30.2672, -97.7431 30.2672)', 4326), 12, 'Stainless Steel', '2005-11-10', 1000, 'active'),

-- Louisiana region pipelines
('LA-Main-004', ST_GeomFromText('LINESTRING(-91.1871 30.4515, -91.2871 30.5515, -91.3871 30.6515)', 4326), 30, 'Carbon Steel', '1985-05-25', 1600, 'maintenance'),
('LA-Branch-005', ST_GeomFromText('LINESTRING(-91.3871 30.6515, -91.4871 30.7515, -91.5871 30.8515)', 4326), 20, 'Carbon Steel', '1992-09-12', 1300, 'active'),
('LA-Offshore-006', ST_GeomFromText('LINESTRING(-91.0871 30.3515, -91.1871 30.4515)', 4326), 18, 'Carbon Steel', '2000-02-18', 1100, 'active'),

-- Oklahoma region pipelines
('OK-Main-007', ST_GeomFromText('LINESTRING(-97.5349 35.4819, -97.6349 35.5819, -97.7349 35.6819)', 4326), 28, 'Carbon Steel', '1988-12-05', 1500, 'active'),
('OK-Branch-008', ST_GeomFromText('LINESTRING(-97.7349 35.6819, -97.8349 35.7819, -97.9349 35.8819)', 4326), 14, 'HDPE', '2010-04-22', 800, 'active'),

-- North Dakota region pipelines
('ND-Bakken-009', ST_GeomFromText('LINESTRING(-103.2317 47.9048, -103.3317 48.0048, -103.4317 48.1048)', 4326), 32, 'Carbon Steel', '2012-06-15', 1800, 'active'),
('ND-Gathering-010', ST_GeomFromText('LINESTRING(-103.4317 48.1048, -103.5317 48.2048, -103.6317 48.3048)', 4326), 10, 'Carbon Steel', '2014-08-30', 900, 'active'),

-- California region pipelines
('CA-Coast-011', ST_GeomFromText('LINESTRING(-118.2437 34.0522, -118.3437 34.1522, -118.4437 34.2522)', 4326), 22, 'Stainless Steel', '2008-01-12', 1250, 'active'),
('CA-Valley-012', ST_GeomFromText('LINESTRING(-118.4437 34.2522, -118.5437 34.3522, -118.6437 34.4522)', 4326), 16, 'Carbon Steel', '1999-10-08', 1150, 'active'),

-- Alaska region pipelines
('AK-Trans-013', ST_GeomFromText('LINESTRING(-149.9003 61.2181, -150.0003 61.3181, -150.1003 61.4181)', 4326), 48, 'Carbon Steel', '1977-05-20', 2000, 'active'),
('AK-North-014', ST_GeomFromText('LINESTRING(-150.1003 61.4181, -150.2003 61.5181, -150.3003 61.6181)', 4326), 36, 'Carbon Steel', '1980-03-15', 1750, 'active'),

-- Additional pipelines for comprehensive testing
('FL-Gulf-015', ST_GeomFromText('LINESTRING(-81.3792 28.5383, -81.4792 28.6383, -81.5792 28.7383)', 4326), 20, 'Carbon Steel', '2001-07-25', 1200, 'inactive'),
('NY-Metro-016', ST_GeomFromText('LINESTRING(-74.0059 40.7128, -74.1059 40.8128, -74.2059 40.9128)', 4326), 18, 'Stainless Steel', '2006-09-18', 1100, 'active'),
('CO-Rocky-017', ST_GeomFromText('LINESTRING(-104.9903 39.7392, -105.0903 39.8392, -105.1903 39.9392)', 4326), 26, 'Carbon Steel', '1995-11-30', 1400, 'active'),
('PA-Marcellus-018', ST_GeomFromText('LINESTRING(-77.1945 41.2033, -77.2945 41.3033, -77.3945 41.4033)', 4326), 14, 'HDPE', '2011-04-12', 950, 'active'),
('WV-Appalachian-019', ST_GeomFromText('LINESTRING(-80.9540 39.6295, -81.0540 39.7295, -81.1540 39.8295)', 4326), 16, 'Carbon Steel', '2009-12-08', 1050, 'active'),
('NM-Permian-020', ST_GeomFromText('LINESTRING(-103.2317 32.2217, -103.3317 32.3217, -103.4317 32.4217)', 4326), 24, 'Carbon Steel', '2013-02-14', 1350, 'active');

-- Insert risk factors for pipelines
INSERT INTO risk_factors (pipeline_id, factor_type, value, severity_level, location, notes, data_source) VALUES
-- Corrosion factors
(1, 'corrosion', 0.15, 4, ST_GeomFromText('POINT(-97.8431 30.3672)', 4326), 'High corrosion rate detected in soil analysis', 'Field Inspection'),
(2, 'corrosion', 0.08, 2, ST_GeomFromText('POINT(-98.0431 30.5672)', 4326), 'Moderate corrosion, cathodic protection adequate', 'Ultrasonic Testing'),
(3, 'corrosion', 0.05, 2, ST_GeomFromText('POINT(-97.6431 30.2672)', 4326), 'Low corrosion rate, stainless steel material', 'Visual Inspection'),
(4, 'corrosion', 0.25, 5, ST_GeomFromText('POINT(-91.2871 30.5515)', 4326), 'Critical corrosion in marine environment', 'Inline Inspection'),
(5, 'corrosion', 0.12, 3, ST_GeomFromText('POINT(-91.4871 30.7515)', 4326), 'Moderate corrosion, monitoring required', 'Field Survey'),
(13, 'corrosion', 0.03, 1, ST_GeomFromText('POINT(-150.0003 61.3181)', 4326), 'Excellent condition, cold climate protection', 'Annual Inspection'),

-- Depth factors
(1, 'depth', 2.5, 3, ST_GeomFromText('POINT(-97.7431 30.2672)', 4326), 'Standard burial depth', 'Construction Records'),
(2, 'depth', 1.2, 4, ST_GeomFromText('POINT(-98.1431 30.6672)', 4326), 'Shallow depth, increased external risk', 'Survey Data'),
(4, 'depth', 3.8, 2, ST_GeomFromText('POINT(-91.3871 30.6515)', 4326), 'Deep burial, good protection', 'As-Built Drawings'),
(7, 'depth', 2.1, 3, ST_GeomFromText('POINT(-97.6349 35.5819)', 4326), 'Average depth for region', 'GPS Survey'),
(9, 'depth', 4.2, 1, ST_GeomFromText('POINT(-103.3317 48.0048)', 4326), 'Deep burial due to frost line', 'Construction Spec'),
(13, 'depth', 5.5, 1, ST_GeomFromText('POINT(-149.9003 61.2181)', 4326), 'Very deep burial, permafrost considerations', 'Design Records'),

-- Soil factors
(1, 'soil', 2500, 2, ST_GeomFromText('POINT(-97.9431 30.4672)', 4326), 'Clay soil, moderate resistivity', 'Soil Testing'),
(2, 'soil', 1200, 4, ST_GeomFromText('POINT(-98.0431 30.5672)', 4326), 'Sandy soil, low resistivity, high corrosion risk', 'Geotechnical Report'),
(4, 'soil', 800, 5, ST_GeomFromText('POINT(-91.1871 30.4515)', 4326), 'Marine clay, very corrosive environment', 'Environmental Assessment'),
(6, 'soil', 3500, 1, ST_GeomFromText('POINT(-91.0871 30.3515)', 4326), 'Rocky substrate, high resistivity', 'Geological Survey'),
(11, 'soil', 4200, 1, ST_GeomFromText('POINT(-118.3437 34.1522)', 4326), 'Stable geological conditions', 'Seismic Study'),
(13, 'soil', 6000, 1, ST_GeomFromText('POINT(-150.1003 61.4181)', 4326), 'Permafrost, excellent protection', 'Arctic Engineering'),

-- Pressure factors
(1, 'pressure', 1200, 3, NULL, 'Operating at 83% of design pressure', 'SCADA System'),
(2, 'pressure', 950, 2, NULL, 'Operating at 79% of design pressure', 'Control Room'),
(4, 'pressure', 1450, 4, NULL, 'High operating pressure, 91% of design', 'Pressure Monitoring'),
(7, 'pressure', 1300, 3, NULL, 'Moderate operating pressure', 'Field Measurement'),
(9, 'pressure', 1650, 4, NULL, 'High pressure operation for new field', 'Real-time Monitoring'),
(13, 'pressure', 1800, 4, NULL, 'Maximum design pressure operation', 'Control System'),

-- Temperature factors
(1, 'temperature', 28, 3, NULL, 'Average ambient temperature', 'Weather Station'),
(4, 'temperature', 32, 4, NULL, 'High temperature, Gulf Coast region', 'Environmental Monitor'),
(6, 'temperature', 30, 3, NULL, 'Coastal temperature variations', 'Meteorological Data'),
(8, 'temperature', 25, 2, NULL, 'Moderate temperature range', 'Climate Data'),
(13, 'temperature', -15, 2, NULL, 'Cold climate, thermal stress considerations', 'Arctic Weather'),
(14, 'temperature', -18, 2, NULL, 'Extreme cold, material brittleness risk', 'Temperature Logger');

-- Insert historical risk assessments
INSERT INTO risk_assessments (pipeline_id, overall_risk_score, risk_level, assessment_date, factors_considered, recommendations, assessed_by, assessment_method) VALUES
(1, 6.2, 'high', '2024-01-15', '{"corrosion": 4, "depth": 3, "pressure": 3, "age": 4}', 'Increase inspection frequency, consider cathodic protection upgrade', 'John Smith, PE', 'API 1160'),
(2, 4.1, 'medium', '2024-01-10', '{"corrosion": 2, "depth": 4, "pressure": 2, "age": 3}', 'Monitor shallow burial areas, maintain current inspection schedule', 'Sarah Johnson, PE', 'ASME B31.8S'),
(3, 2.8, 'low', '2024-01-20', '{"corrosion": 2, "depth": 2, "pressure": 2, "age": 2}', 'Continue standard maintenance program', 'Mike Davis, PE', 'API 1160'),
(4, 8.3, 'critical', '2024-01-05', '{"corrosion": 5, "depth": 2, "pressure": 4, "age": 5}', 'URGENT: Schedule immediate inspection and repair, reduce operating pressure', 'Lisa Chen, PE', 'Emergency Assessment'),
(5, 5.4, 'medium', '2024-01-12', '{"corrosion": 3, "depth": 3, "pressure": 3, "age": 4}', 'Enhanced monitoring, plan maintenance within 6 months', 'Robert Wilson, PE', 'Risk-Based Assessment'),
(7, 4.8, 'medium', '2024-01-18', '{"corrosion": 2, "depth": 3, "pressure": 3, "age": 4}', 'Standard inspection protocol, monitor pressure variations', 'Jennifer Brown, PE', 'Quantitative Assessment'),
(9, 3.2, 'medium', '2024-01-22', '{"corrosion": 1, "depth": 1, "pressure": 4, "age": 1}', 'Monitor high pressure operations, excellent overall condition', 'David Lee, PE', 'New Pipeline Assessment'),
(13, 2.1, 'low', '2024-01-25', '{"corrosion": 1, "depth": 1, "pressure": 4, "age": 5}', 'Despite age, excellent condition due to environment and maintenance', 'Alaska Engineering Team', 'Arctic Pipeline Standard');

-- Insert historical incidents
INSERT INTO incidents (pipeline_id, incident_type, severity, location, incident_date, description, cause, cost_estimate, downtime_hours, environmental_impact) VALUES
(4, 'Leak', 'major', ST_GeomFromText('POINT(-91.2371 30.5215)', 4326), '2023-08-15 14:30:00', 'Small leak detected during routine inspection', 'External corrosion', 125000.00, 18, 'Minor soil contamination, remediated within 48 hours'),
(2, 'Pressure Loss', 'moderate', ST_GeomFromText('POINT(-98.0231 30.5472)', 4326), '2023-05-20 09:15:00', 'Gradual pressure loss over 6 hours', 'Valve malfunction', 45000.00, 6, 'No environmental impact'),
(1, 'Third Party Damage', 'minor', ST_GeomFromText('POINT(-97.8131 30.3372)', 4326), '2023-11-03 16:45:00', 'Construction equipment contacted pipeline', 'Excavation without proper clearance', 15000.00, 3, 'No release, protective coating damaged'),
(7, 'Corrosion', 'moderate', ST_GeomFromText('POINT(-97.6549 35.5619)', 4326), '2022-12-10 11:20:00', 'Internal corrosion detected during inline inspection', 'Product quality issues', 85000.00, 12, 'No environmental impact'),
(5, 'Equipment Failure', 'minor', ST_GeomFromText('POINT(-91.4671 30.7315)', 4326), '2024-02-28 08:00:00', 'Compressor station malfunction', 'Mechanical wear', 35000.00, 4, 'No environmental impact');

-- Insert maintenance records
INSERT INTO maintenance_records (pipeline_id, maintenance_type, scheduled_date, completed_date, status, description, cost, performed_by, notes) VALUES
(1, 'Inline Inspection', '2024-03-15', '2024-03-18', 'completed', 'Magnetic flux leakage inspection', 75000.00, 'Pipeline Integrity Services Inc.', 'Several indications found, detailed analysis in progress'),
(2, 'Cathodic Protection Survey', '2024-02-20', '2024-02-22', 'completed', 'Annual CP system effectiveness survey', 8500.00, 'Corrosion Control Specialists', 'All readings within acceptable range'),
(3, 'Valve Maintenance', '2024-01-30', '2024-01-30', 'completed', 'Quarterly valve operation and lubrication', 3200.00, 'Maintenance Team A', 'All valves operational'),
(4, 'Emergency Repair', '2024-01-08', '2024-01-12', 'completed', 'Repair of corrosion-related wall loss', 185000.00, 'Emergency Response Team', 'Temporary clamp installed, permanent repair scheduled'),
(5, 'Hydrostatic Test', '2024-04-10', NULL, 'scheduled', 'Pressure test of repaired section', 25000.00, 'Testing Contractors LLC', 'Pending weather conditions'),
(7, 'Coating Repair', '2024-03-25', NULL, 'scheduled', 'Repair damaged coating from third-party contact', 12000.00, 'Coating Specialists Inc.', 'Materials ordered, work scheduled'),
(9, 'Routine Inspection', '2024-05-15', NULL, 'scheduled', 'Annual ground patrol and facility inspection', 5500.00, 'Field Operations Team', 'Standard annual inspection'),
(13, 'Specialized Inspection', '2024-06-01', NULL, 'scheduled', 'Arctic conditions pipeline assessment', 95000.00, 'Arctic Pipeline Services', 'Requires specialized equipment for extreme conditions');

-- Insert environmental factors
INSERT INTO environmental_factors (pipeline_id, factor_type, location, value, unit, data_source) VALUES
-- Soil resistivity measurements
(1, 'soil_resistivity', ST_GeomFromText('POINT(-97.8431 30.3672)', 4326), 2500, 'ohm-cm', 'Geotechnical Survey'),
(2, 'soil_resistivity', ST_GeomFromText('POINT(-98.0431 30.5672)', 4326), 1200, 'ohm-cm', 'Environmental Testing'),
(4, 'soil_resistivity', ST_GeomFromText('POINT(-91.2871 30.5515)', 4326), 800, 'ohm-cm', 'Marine Environment Study'),

-- Ground temperature measurements
(1, 'ground_temperature', ST_GeomFromText('POINT(-97.7431 30.2672)', 4326), 22.5, 'celsius', 'Weather Station'),
(4, 'ground_temperature', ST_GeomFromText('POINT(-91.1871 30.4515)', 4326), 26.8, 'celsius', 'Environmental Monitor'),
(13, 'ground_temperature', ST_GeomFromText('POINT(-149.9003 61.2181)', 4326), -8.2, 'celsius', 'Arctic Weather Station'),

-- Water table depth
(1, 'water_table_depth', ST_GeomFromText('POINT(-97.8431 30.3672)', 4326), 3.2, 'meters', 'Hydrogeological Survey'),
(2, 'water_table_depth', ST_GeomFromText('POINT(-98.0431 30.5672)', 4326), 1.8, 'meters', 'Well Data'),
(4, 'water_table_depth', ST_GeomFromText('POINT(-91.2871 30.5515)', 4326), 0.5, 'meters', 'Coastal Survey'),

-- Seismic activity measurements
(11, 'seismic_activity', ST_GeomFromText('POINT(-118.2437 34.0522)', 4326), 2.1, 'magnitude', 'USGS Seismic Network'),
(13, 'frost_depth', ST_GeomFromText('POINT(-149.9003 61.2181)', 4326), 4.8, 'meters', 'Permafrost Research Station');

-- Refresh dashboard metrics view
SELECT refresh_dashboard_metrics();
