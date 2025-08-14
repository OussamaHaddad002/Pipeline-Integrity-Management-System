-- Pipeline Risk Assessment Database Schema
-- PostGIS enabled PostgreSQL database for pipeline integrity management

-- Enable PostGIS extension for spatial data support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create updated_at trigger function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Pipelines table - Core pipeline infrastructure data
CREATE TABLE pipelines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    geometry GEOMETRY(LINESTRING, 4326) NOT NULL,
    diameter FLOAT NOT NULL CHECK (diameter > 0),
    material VARCHAR(100) NOT NULL,
    installation_date DATE NOT NULL,
    pressure_rating FLOAT NOT NULL CHECK (pressure_rating > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    length_km FLOAT GENERATED ALWAYS AS (ST_Length(geometry::geography) / 1000) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk factors table - Individual risk factors for pipeline segments
CREATE TABLE risk_factors (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    factor_type VARCHAR(100) NOT NULL CHECK (factor_type IN ('corrosion', 'depth', 'soil', 'pressure', 'age', 'temperature', 'external_damage')),
    value FLOAT NOT NULL,
    severity_level INTEGER NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
    location GEOMETRY(POINT, 4326),
    recorded_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    data_source VARCHAR(100),
    
    -- Ensure location is on or near the pipeline if specified
    CONSTRAINT valid_location CHECK (
        location IS NULL OR 
        ST_DWithin(location::geography, (SELECT geometry::geography FROM pipelines WHERE id = pipeline_id), 1000)
    )
);

-- Risk assessments table - Overall risk calculations for pipelines
CREATE TABLE risk_assessments (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    overall_risk_score FLOAT NOT NULL CHECK (overall_risk_score BETWEEN 0 AND 10),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    factors_considered JSONB NOT NULL DEFAULT '{}',
    recommendations TEXT,
    assessed_by VARCHAR(255),
    assessment_method VARCHAR(100) DEFAULT 'automated',
    
    -- Index on JSONB for efficient querying
    CONSTRAINT valid_risk_level CHECK (
        (risk_level = 'low' AND overall_risk_score <= 3) OR
        (risk_level = 'medium' AND overall_risk_score > 3 AND overall_risk_score <= 5) OR
        (risk_level = 'high' AND overall_risk_score > 5 AND overall_risk_score <= 7) OR
        (risk_level = 'critical' AND overall_risk_score > 7)
    )
);

-- AI predictions table - Machine learning failure predictions
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    failure_probability FLOAT NOT NULL CHECK (failure_probability BETWEEN 0 AND 1),
    confidence_score FLOAT NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    predicted_failure_date DATE,
    prediction_model VARCHAR(100) NOT NULL,
    input_parameters JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(50),
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure predicted failure date is in the future
    CONSTRAINT future_failure_date CHECK (predicted_failure_date IS NULL OR predicted_failure_date > CURRENT_DATE)
);

-- Incidents table - Historical pipeline incidents and failures
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),
    location GEOMETRY(POINT, 4326) NOT NULL,
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    cause VARCHAR(255),
    cost_estimate DECIMAL(15,2) CHECK (cost_estimate >= 0),
    downtime_hours FLOAT CHECK (downtime_hours >= 0),
    environmental_impact TEXT,
    regulatory_report_id VARCHAR(100),
    resolved_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance records table - Scheduled and performed maintenance
CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    description TEXT,
    cost DECIMAL(15,2) CHECK (cost >= 0),
    performed_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Environmental factors table - External conditions affecting risk
CREATE TABLE environmental_factors (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    factor_type VARCHAR(100) NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    value FLOAT NOT NULL,
    unit VARCHAR(50),
    measurement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_source VARCHAR(100)
);

-- Create spatial indexes for performance optimization
CREATE INDEX idx_pipelines_geom ON pipelines USING GIST (geometry);
CREATE INDEX idx_risk_factors_location ON risk_factors USING GIST (location) WHERE location IS NOT NULL;
CREATE INDEX idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX idx_incidents_date ON incidents (incident_date);
CREATE INDEX idx_environmental_factors_location ON environmental_factors USING GIST (location);

-- Create standard indexes
CREATE INDEX idx_pipelines_status ON pipelines (status);
CREATE INDEX idx_pipelines_material ON pipelines (material);
CREATE INDEX idx_risk_factors_pipeline_id ON risk_factors (pipeline_id);
CREATE INDEX idx_risk_factors_type ON risk_factors (factor_type);
CREATE INDEX idx_risk_factors_severity ON risk_factors (severity_level);
CREATE INDEX idx_risk_assessments_pipeline_id ON risk_assessments (pipeline_id);
CREATE INDEX idx_risk_assessments_level ON risk_assessments (risk_level);
CREATE INDEX idx_risk_assessments_date ON risk_assessments (assessment_date);
CREATE INDEX idx_predictions_pipeline_id ON predictions (pipeline_id);
CREATE INDEX idx_predictions_probability ON predictions (failure_probability);
CREATE INDEX idx_predictions_date ON predictions (predicted_failure_date);
CREATE INDEX idx_maintenance_status ON maintenance_records (status);
CREATE INDEX idx_maintenance_date ON maintenance_records (scheduled_date);

-- Create JSONB indexes for efficient querying
CREATE INDEX idx_risk_assessments_factors ON risk_assessments USING GIN (factors_considered);
CREATE INDEX idx_predictions_parameters ON predictions USING GIN (input_parameters);

-- Create updated_at triggers
CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create materialized view for dashboard metrics (for performance)
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    COUNT(*)::INTEGER as total_pipelines,
    COUNT(*) FILTER (WHERE status = 'active')::INTEGER as active_pipelines,
    COUNT(DISTINCT ra.pipeline_id) FILTER (WHERE ra.risk_level IN ('high', 'critical'))::INTEGER as high_risk_pipelines,
    COUNT(*) FILTER (WHERE i.severity = 'critical' AND i.incident_date >= NOW() - INTERVAL '30 days')::INTEGER as critical_alerts,
    COALESCE(AVG(ra.overall_risk_score), 0)::FLOAT as average_risk_score,
    COUNT(DISTINCT p.pipeline_id) FILTER (WHERE p.failure_probability > 0.7)::INTEGER as predicted_failures
FROM pipelines pl
LEFT JOIN risk_assessments ra ON pl.id = ra.pipeline_id 
    AND ra.assessment_date = (
        SELECT MAX(assessment_date) 
        FROM risk_assessments 
        WHERE pipeline_id = pl.id
    )
LEFT JOIN incidents i ON pl.id = i.pipeline_id
LEFT JOIN predictions p ON pl.id = p.pipeline_id 
    AND p.created_at = (
        SELECT MAX(created_at) 
        FROM predictions 
        WHERE pipeline_id = pl.id
    );

-- Create index on materialized view
CREATE INDEX idx_dashboard_metrics_refresh ON dashboard_metrics (total_pipelines);

-- Function to refresh dashboard metrics
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- Create function for calculating risk scores
CREATE OR REPLACE FUNCTION calculate_risk_score(p_pipeline_id INTEGER)
RETURNS FLOAT AS $$
DECLARE
    risk_score FLOAT := 0;
    factor_weight FLOAT;
    factor_value FLOAT;
    age_years INTEGER;
BEGIN
    -- Get pipeline age
    SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, installation_date))
    INTO age_years
    FROM pipelines
    WHERE id = p_pipeline_id;
    
    -- Age factor (0-2 points)
    risk_score := risk_score + LEAST(age_years / 25.0 * 2, 2);
    
    -- Sum risk factors with weights
    FOR factor_weight, factor_value IN
        SELECT 
            CASE rf.factor_type
                WHEN 'corrosion' THEN 2.0
                WHEN 'pressure' THEN 1.5
                WHEN 'depth' THEN 1.0
                WHEN 'soil' THEN 0.8
                WHEN 'temperature' THEN 0.5
                ELSE 1.0
            END,
            rf.severity_level
        FROM risk_factors rf
        WHERE rf.pipeline_id = p_pipeline_id
    LOOP
        risk_score := risk_score + (factor_value / 5.0 * factor_weight);
    END LOOP;
    
    RETURN LEAST(risk_score, 10.0);
END;
$$ LANGUAGE plpgsql;

-- Create function for spatial queries
CREATE OR REPLACE FUNCTION get_nearby_pipelines(
    p_lat FLOAT,
    p_lng FLOAT,
    p_radius_meters INTEGER DEFAULT 1000
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    distance_meters FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        ST_Distance(
            p.geometry::geography,
            ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
        ) as distance_meters
    FROM pipelines p
    WHERE ST_DWithin(
        p.geometry::geography,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_radius_meters
    )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;
