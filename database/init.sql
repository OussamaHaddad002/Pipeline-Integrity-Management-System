-- Pipeline Risk Assessment Database Schema
-- Enables PostGIS extension and creates all necessary tables

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE pipeline_status AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned');
CREATE TYPE incident_severity AS ENUM ('minor', 'moderate', 'major', 'critical');

-- Pipelines table with spatial data
CREATE TABLE pipelines (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(LINESTRING, 4326) NOT NULL,
    diameter FLOAT NOT NULL CHECK (diameter > 0),
    material VARCHAR(100) NOT NULL,
    installation_date DATE NOT NULL,
    pressure_rating FLOAT NOT NULL CHECK (pressure_rating > 0),
    status pipeline_status DEFAULT 'active',
    length_km FLOAT GENERATED ALWAYS AS (ST_Length(geometry::geography) / 1000) STORED,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Risk factors table
CREATE TABLE risk_factors (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id) ON DELETE CASCADE,
    factor_type VARCHAR(100) NOT NULL,
    value FLOAT NOT NULL,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    location GEOMETRY(POINT, 4326),
    recorded_date TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

-- Risk assessments table
CREATE TABLE risk_assessments (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id) ON DELETE CASCADE,
    overall_risk_score FLOAT NOT NULL CHECK (overall_risk_score BETWEEN 0 AND 100),
    risk_level risk_level NOT NULL,
    assessment_date TIMESTAMP DEFAULT NOW(),
    factors_considered JSONB NOT NULL DEFAULT '{}',
    recommendations TEXT,
    assessed_by VARCHAR(255),
    valid_until DATE
);

-- AI Predictions table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id) ON DELETE CASCADE,
    failure_probability FLOAT CHECK (failure_probability BETWEEN 0 AND 1),
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    predicted_failure_date DATE,
    prediction_model VARCHAR(100) NOT NULL,
    input_parameters JSONB NOT NULL DEFAULT '{}',
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id) ON DELETE CASCADE,
    incident_type VARCHAR(100) NOT NULL,
    severity incident_severity NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    description TEXT,
    cause VARCHAR(255),
    cost_estimate DECIMAL(15,2),
    resolved_date TIMESTAMP,
    lessons_learned TEXT
);

-- Maintenance records
CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'scheduled',
    cost DECIMAL(10,2),
    notes TEXT,
    technician VARCHAR(255)
);

-- Create spatial indexes for performance
CREATE INDEX idx_pipelines_geom ON pipelines USING GIST (geometry);
CREATE INDEX idx_risk_factors_location ON risk_factors USING GIST (location);
CREATE INDEX idx_incidents_location ON incidents USING GIST (location);

-- Create regular indexes
CREATE INDEX idx_pipelines_status ON pipelines (status);
CREATE INDEX idx_risk_assessments_pipeline_id ON risk_assessments (pipeline_id);
CREATE INDEX idx_risk_assessments_date ON risk_assessments (assessment_date);
CREATE INDEX idx_predictions_pipeline_id ON predictions (pipeline_id);
CREATE INDEX idx_incidents_date ON incidents (incident_date);

-- Create materialized view for dashboard metrics
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    (SELECT COUNT(*) FROM pipelines WHERE status = 'active') as active_pipelines,
    (SELECT COUNT(*) FROM risk_assessments WHERE risk_level = 'critical' AND valid_until > NOW()) as critical_risks,
    (SELECT COUNT(*) FROM predictions WHERE failure_probability > 0.7) as high_risk_predictions,
    (SELECT COUNT(*) FROM incidents WHERE incident_date > NOW() - INTERVAL '30 days') as recent_incidents,
    (SELECT AVG(overall_risk_score) FROM risk_assessments WHERE assessment_date > NOW() - INTERVAL '30 days') as avg_risk_score;

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pipelines_updated_at 
    BEFORE UPDATE ON pipelines
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
