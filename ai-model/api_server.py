"""
Flask API server for Pipeline Risk Prediction ML models
Serves trained models via REST API for integration with Node.js backend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import traceback
from datetime import datetime
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import pandas as pd
from risk_predictor import PipelineRiskPredictor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global model instance
predictor = None
model_loaded = False

def load_model():
    """Load the trained ML model"""
    global predictor, model_loaded
    
    try:
        predictor = PipelineRiskPredictor()
        model_path = os.getenv('MODEL_PATH', '/app/models/pipeline_risk_model.joblib')
        
        if os.path.exists(model_path):
            predictor.load_model(model_path)
            model_loaded = True
            logger.info(f"Model loaded successfully from {model_path}")
        else:
            logger.warning(f"Model file not found at {model_path}, creating new model")
            # Train a new model with sample data if no model exists
            from risk_predictor import create_sample_data
            sample_data = create_sample_data(1000)
            predictor.train(sample_data)
            predictor.save_model(model_path)
            model_loaded = True
            logger.info("New model trained and saved")
            
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_loaded = False

def get_db_connection():
    """Get database connection"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://pipeline_user:pipeline_password@database:5432/pipeline_risk')
        conn = psycopg2.connect(database_url)
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return None

def fetch_pipeline_data(pipeline_id=None):
    """Fetch pipeline data from database"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if pipeline_id:
                cur.execute("""
                    SELECT 
                        p.*,
                        EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.installation_date)) as age_years,
                        ST_Length(p.geometry::geography) / 1000 as length_km,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'corrosion'), 0) as corrosion_rate,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'depth'), 2) as depth_avg,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'temperature'), 20) as temperature_avg,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'corrosion'), 3) as corrosion_severity,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'depth'), 3) as depth_variation,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'pressure'), 3) as pressure_fluctuation,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'temperature'), 3) as temperature_variation,
                        COALESCE(AVG(rf.severity_level), 3) as external_damage_risk
                    FROM pipelines p
                    LEFT JOIN risk_factors rf ON p.id = rf.pipeline_id
                    WHERE p.id = %s
                    GROUP BY p.id
                """, (pipeline_id,))
            else:
                cur.execute("""
                    SELECT 
                        p.*,
                        EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.installation_date)) as age_years,
                        ST_Length(p.geometry::geography) / 1000 as length_km,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'corrosion'), 0) as corrosion_rate,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'depth'), 2) as depth_avg,
                        COALESCE(AVG(rf.value) FILTER (WHERE rf.factor_type = 'temperature'), 20) as temperature_avg,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'corrosion'), 3) as corrosion_severity,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'depth'), 3) as depth_variation,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'pressure'), 3) as pressure_fluctuation,
                        COALESCE(AVG(rf.severity_level) FILTER (WHERE rf.factor_type = 'temperature'), 3) as temperature_variation,
                        COALESCE(AVG(rf.severity_level), 3) as external_damage_risk
                    FROM pipelines p
                    LEFT JOIN risk_factors rf ON p.id = rf.pipeline_id
                    GROUP BY p.id
                    LIMIT 100
                """)
            
            rows = cur.fetchall()
            return [dict(row) for row in rows]
            
    except Exception as e:
        logger.error(f"Database query failed: {str(e)}")
        return None
    finally:
        conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict failure probability for pipeline data"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'success': False
        }), 503
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400
        
        # Convert to DataFrame
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = pd.DataFrame([data])
        
        # Make prediction
        result = predictor.predict(df, return_confidence=True)
        
        return jsonify({
            'success': True,
            'predictions': result,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

@app.route('/predict/pipeline/<int:pipeline_id>', methods=['POST'])
def predict_pipeline(pipeline_id):
    """Predict failure probability for a specific pipeline from database"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'success': False
        }), 503
    
    try:
        # Fetch pipeline data from database
        pipeline_data = fetch_pipeline_data(pipeline_id)
        
        if not pipeline_data:
            return jsonify({
                'error': f'Pipeline {pipeline_id} not found',
                'success': False
            }), 404
        
        # Make prediction
        result = predictor.predict_single_pipeline(pipeline_data[0])
        
        return jsonify({
            'success': True,
            'prediction': result,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Pipeline prediction failed: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': f'Pipeline prediction failed: {str(e)}',
            'success': False
        }), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    """Retrain the model with latest data from database"""
    global predictor, model_loaded
    
    try:
        # Fetch training data from database
        pipeline_data = fetch_pipeline_data()
        
        if not pipeline_data:
            return jsonify({
                'error': 'No training data available',
                'success': False
            }), 400
        
        df = pd.DataFrame(pipeline_data)
        
        # Add synthetic failure probabilities for training (in production, use real data)
        # This is a simplified example - in production, you'd have real failure data
        df['failure_probability'] = (
            (df['age_years'] / 50) * 0.3 +
            (df.get('corrosion_rate', 0.1) / 0.5) * 0.3 +
            (df.get('corrosion_severity', 3) / 5) * 0.2 +
            0.2
        ).clip(0, 1)
        
        # Initialize new predictor and train
        new_predictor = PipelineRiskPredictor()
        training_metrics = new_predictor.train(df)
        
        # Save the new model
        model_path = os.getenv('MODEL_PATH', '/app/models/pipeline_risk_model.joblib')
        new_predictor.save_model(model_path)
        
        # Update global predictor
        predictor = new_predictor
        model_loaded = True
        
        logger.info("Model retrained successfully")
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'training_metrics': training_metrics,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Model retraining failed: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': f'Model retraining failed: {str(e)}',
            'success': False
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the current model"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'success': False
        }), 503
    
    try:
        feature_importance = predictor.get_feature_importance()
        
        return jsonify({
            'success': True,
            'model_info': {
                'loaded': model_loaded,
                'version': '1.0',
                'feature_importance': feature_importance,
                'model_types': list(predictor.models.keys())
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Model info request failed: {str(e)}")
        return jsonify({
            'error': f'Model info request failed: {str(e)}',
            'success': False
        }), 500

@app.route('/batch/predict', methods=['POST'])
def batch_predict():
    """Batch prediction for multiple pipelines"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'success': False
        }), 503
    
    try:
        # Fetch all pipeline data from database
        pipeline_data = fetch_pipeline_data()
        
        if not pipeline_data:
            return jsonify({
                'error': 'No pipeline data available',
                'success': False
            }), 400
        
        df = pd.DataFrame(pipeline_data)
        
        # Make batch predictions
        results = predictor.predict(df, return_confidence=True)
        
        # Combine with pipeline IDs
        predictions = []
        for i, pipeline in enumerate(pipeline_data):
            predictions.append({
                'pipeline_id': pipeline['id'],
                'pipeline_name': pipeline['name'],
                'failure_probability': results['failure_probability'][i],
                'confidence_score': results['confidence_score'][i] if results['confidence_score'] else 0.8,
                'risk_level': predictor._get_risk_level(results['failure_probability'][i])
            })
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'total_pipelines': len(predictions),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': f'Batch prediction failed: {str(e)}',
            'success': False
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'success': False
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'success': False
    }), 500

# Initialize model on startup
if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('/app/models', exist_ok=True)
    
    # Load the model
    load_model()
    
    # Start the Flask app
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
else:
    # For production deployment (e.g., with Gunicorn)
    load_model()
