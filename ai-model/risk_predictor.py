"""
Pipeline Risk Prediction Model
Advanced ML model for predicting pipeline failure probability using multiple factors
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import logging
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import json
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PipelineRiskPredictor:
    """
    Advanced machine learning model for pipeline failure risk prediction
    Uses ensemble methods and feature engineering for accurate predictions
    """
    
    def __init__(self):
        self.models = {
            'random_forest': RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                random_state=42
            )
        }
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_importance = {}
        self.is_trained = False
        
        # Feature definitions
        self.numerical_features = [
            'age_years', 'diameter', 'pressure_rating', 'length_km',
            'depth_avg', 'temperature_avg', 'corrosion_rate',
            'soil_resistivity', 'cathodic_protection_level',
            'wall_thickness', 'operating_pressure'
        ]
        
        self.categorical_features = [
            'material', 'coating_type', 'environment_type',
            'soil_type', 'installation_method'
        ]
        
        self.risk_factors = [
            'corrosion_severity', 'depth_variation', 'pressure_fluctuation',
            'temperature_variation', 'external_damage_risk'
        ]
        
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create additional features from raw pipeline data
        
        Args:
            df: Raw pipeline data DataFrame
            
        Returns:
            DataFrame with engineered features
        """
        df_engineered = df.copy()
        
        try:
            # Age-related features
            if 'installation_date' in df.columns:
                df_engineered['age_years'] = (
                    pd.to_datetime('now') - pd.to_datetime(df['installation_date'])
                ).dt.days / 365.25
                
            # Pressure ratio (operating vs rating)
            if 'operating_pressure' in df.columns and 'pressure_rating' in df.columns:
                df_engineered['pressure_ratio'] = (
                    df_engineered['operating_pressure'] / df_engineered['pressure_rating']
                )
                
            # Wall thickness ratio (current vs original)
            if 'current_wall_thickness' in df.columns and 'original_wall_thickness' in df.columns:
                df_engineered['wall_thickness_ratio'] = (
                    df_engineered['current_wall_thickness'] / df_engineered['original_wall_thickness']
                )
                
            # Corrosion rate acceleration
            if 'corrosion_rate' in df.columns and 'age_years' in df_engineered.columns:
                df_engineered['corrosion_acceleration'] = (
                    df_engineered['corrosion_rate'] * df_engineered['age_years']
                )
                
            # Risk factor composite scores
            if all(factor in df.columns for factor in self.risk_factors):
                df_engineered['composite_risk_score'] = (
                    df_engineered[self.risk_factors].mean(axis=1)
                )
                df_engineered['max_risk_factor'] = (
                    df_engineered[self.risk_factors].max(axis=1)
                )
                
            # Environmental stress index
            environmental_factors = ['temperature_avg', 'soil_resistivity', 'depth_avg']
            available_env_factors = [f for f in environmental_factors if f in df.columns]
            if available_env_factors:
                # Normalize and combine environmental factors
                for factor in available_env_factors:
                    df_engineered[f'{factor}_normalized'] = (
                        (df_engineered[factor] - df_engineered[factor].mean()) / 
                        df_engineered[factor].std()
                    )
                
                df_engineered['environmental_stress'] = (
                    df_engineered[[f'{f}_normalized' for f in available_env_factors]].abs().mean(axis=1)
                )
                
            logger.info(f"Feature engineering completed. Shape: {df_engineered.shape}")
            
        except Exception as e:
            logger.error(f"Feature engineering failed: {str(e)}")
            
        return df_engineered
        
    def prepare_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, Optional[np.ndarray]]:
        """
        Prepare data for training or prediction
        
        Args:
            df: Input DataFrame
            
        Returns:
            Tuple of (features, target) where target is None for prediction
        """
        df_prepared = self.engineer_features(df)
        
        # Handle categorical variables
        for feature in self.categorical_features:
            if feature in df_prepared.columns:
                if feature not in self.label_encoders:
                    self.label_encoders[feature] = LabelEncoder()
                    df_prepared[feature] = self.label_encoders[feature].fit_transform(
                        df_prepared[feature].astype(str)
                    )
                else:
                    # Handle unseen categories in prediction
                    try:
                        df_prepared[feature] = self.label_encoders[feature].transform(
                            df_prepared[feature].astype(str)
                        )
                    except ValueError:
                        # Use most common category for unseen values
                        most_common = self.label_encoders[feature].classes_[0]
                        df_prepared[feature] = df_prepared[feature].astype(str).apply(
                            lambda x: x if x in self.label_encoders[feature].classes_ else most_common
                        )
                        df_prepared[feature] = self.label_encoders[feature].transform(df_prepared[feature])
        
        # Select features for modeling
        available_features = [f for f in (self.numerical_features + self.categorical_features) 
                             if f in df_prepared.columns]
        
        if not available_features:
            raise ValueError("No valid features found in the data")
        
        X = df_prepared[available_features].fillna(df_prepared[available_features].median())
        
        # Scale features
        if self.is_trained:
            X_scaled = self.scaler.transform(X)
        else:
            X_scaled = self.scaler.fit_transform(X)
        
        # Get target if available
        y = None
        if 'failure_probability' in df_prepared.columns:
            y = df_prepared['failure_probability'].values
        elif 'incident_occurred' in df_prepared.columns:
            # Binary target - convert to probability
            y = df_prepared['incident_occurred'].astype(float).values
        
        return X_scaled, y
        
    def train(self, df: pd.DataFrame) -> Dict[str, float]:
        """
        Train the ensemble model on pipeline data
        
        Args:
            df: Training data with failure_probability or incident_occurred target
            
        Returns:
            Training metrics dictionary
        """
        logger.info("Starting model training...")
        
        X, y = self.prepare_data(df)
        
        if y is None:
            raise ValueError("No target variable found in training data")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=(y > 0.5).astype(int)
        )
        
        # Train individual models
        model_scores = {}
        
        for name, model in self.models.items():
            logger.info(f"Training {name}...")
            
            # Train model
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred_train = model.predict(X_train)
            y_pred_test = model.predict(X_test)
            
            # Cross-validation score
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_squared_error')
            
            model_scores[name] = {
                'train_mse': mean_squared_error(y_train, y_pred_train),
                'test_mse': mean_squared_error(y_test, y_pred_test),
                'train_r2': r2_score(y_train, y_pred_train),
                'test_r2': r2_score(y_test, y_pred_test),
                'cv_mse': -cv_scores.mean(),
                'cv_std': cv_scores.std()
            }
            
            # Feature importance
            if hasattr(model, 'feature_importances_'):
                available_features = [f for f in (self.numerical_features + self.categorical_features) 
                                     if f in df.columns]
                self.feature_importance[name] = dict(zip(available_features, model.feature_importances_))
        
        self.is_trained = True
        
        # Log results
        for name, scores in model_scores.items():
            logger.info(f"{name} - Test R²: {scores['test_r2']:.4f}, Test MSE: {scores['test_mse']:.4f}")
        
        return model_scores
        
    def predict(self, df: pd.DataFrame, return_confidence: bool = True) -> Dict:
        """
        Make failure probability predictions
        
        Args:
            df: Pipeline data for prediction
            return_confidence: Whether to include confidence intervals
            
        Returns:
            Dictionary with predictions and metadata
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        X, _ = self.prepare_data(df)
        
        # Get predictions from all models
        predictions = {}
        for name, model in self.models.items():
            predictions[name] = model.predict(X)
        
        # Ensemble prediction (weighted average)
        ensemble_pred = (predictions['random_forest'] * 0.6 + 
                        predictions['gradient_boosting'] * 0.4)
        
        # Calculate confidence based on prediction agreement
        pred_std = np.std([predictions['random_forest'], predictions['gradient_boosting']], axis=0)
        confidence = np.clip(1 - (pred_std * 2), 0.1, 1.0)  # Higher std = lower confidence
        
        results = {
            'failure_probability': ensemble_pred.tolist(),
            'confidence_score': confidence.tolist() if return_confidence else None,
            'individual_predictions': {
                name: pred.tolist() for name, pred in predictions.items()
            },
            'model_version': '1.0',
            'prediction_date': datetime.now().isoformat()
        }
        
        return results
        
    def predict_single_pipeline(self, pipeline_data: Dict) -> Dict:
        """
        Predict failure probability for a single pipeline
        
        Args:
            pipeline_data: Dictionary with pipeline attributes
            
        Returns:
            Prediction result with recommendations
        """
        df = pd.DataFrame([pipeline_data])
        prediction = self.predict(df, return_confidence=True)
        
        failure_prob = prediction['failure_probability'][0]
        confidence = prediction['confidence_score'][0] if prediction['confidence_score'] else 0.8
        
        # Generate recommendations based on risk level
        recommendations = self._generate_recommendations(failure_prob, pipeline_data)
        
        # Estimate time to failure
        predicted_failure_date = self._estimate_failure_date(failure_prob, pipeline_data)
        
        return {
            'pipeline_id': pipeline_data.get('id'),
            'failure_probability': failure_prob,
            'confidence_score': confidence,
            'predicted_failure_date': predicted_failure_date,
            'risk_level': self._get_risk_level(failure_prob),
            'recommendations': recommendations,
            'input_parameters': pipeline_data,
            'prediction_model': 'ensemble_v1.0',
            'created_at': datetime.now().isoformat()
        }
        
    def _generate_recommendations(self, failure_prob: float, pipeline_data: Dict) -> List[str]:
        """Generate maintenance recommendations based on failure probability"""
        recommendations = []
        
        if failure_prob > 0.8:
            recommendations.extend([
                "URGENT: Schedule immediate inspection",
                "Consider pipeline replacement or major repair",
                "Increase monitoring frequency to weekly",
                "Implement emergency response procedures"
            ])
        elif failure_prob > 0.6:
            recommendations.extend([
                "Schedule comprehensive inspection within 30 days",
                "Increase cathodic protection monitoring",
                "Consider targeted repairs for high-risk sections",
                "Review operating pressure limits"
            ])
        elif failure_prob > 0.4:
            recommendations.extend([
                "Schedule routine inspection within 90 days",
                "Monitor corrosion indicators closely",
                "Review maintenance schedule",
                "Consider preventive maintenance"
            ])
        else:
            recommendations.extend([
                "Continue standard monitoring schedule",
                "Annual comprehensive inspection recommended",
                "Maintain current operating procedures"
            ])
        
        # Add specific recommendations based on pipeline characteristics
        if pipeline_data.get('age_years', 0) > 30:
            recommendations.append("Consider age-related integrity assessment")
        
        if pipeline_data.get('corrosion_rate', 0) > 0.1:
            recommendations.append("Implement enhanced corrosion monitoring")
        
        return recommendations
        
    def _estimate_failure_date(self, failure_prob: float, pipeline_data: Dict) -> Optional[str]:
        """Estimate potential failure date based on probability and pipeline characteristics"""
        if failure_prob < 0.3:
            return None
        
        # Base time estimation (higher probability = sooner failure)
        base_years = max(0.5, (1 - failure_prob) * 10)
        
        # Adjust based on pipeline age and condition
        age_factor = 1.0
        if pipeline_data.get('age_years', 0) > 25:
            age_factor = 0.8  # Older pipelines fail sooner
        
        corrosion_factor = 1.0
        if pipeline_data.get('corrosion_rate', 0) > 0.1:
            corrosion_factor = 0.7  # High corrosion accelerates failure
        
        estimated_years = base_years * age_factor * corrosion_factor
        failure_date = datetime.now() + timedelta(days=estimated_years * 365)
        
        return failure_date.date().isoformat()
        
    def _get_risk_level(self, failure_prob: float) -> str:
        """Convert failure probability to risk level"""
        if failure_prob >= 0.7:
            return 'critical'
        elif failure_prob >= 0.5:
            return 'high'
        elif failure_prob >= 0.3:
            return 'medium'
        else:
            return 'low'
        
    def save_model(self, filepath: str):
        """Save trained model to disk"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        model_data = {
            'models': self.models,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_importance': self.feature_importance,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
        
    def load_model(self, filepath: str):
        """Load trained model from disk"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        
        model_data = joblib.load(filepath)
        
        self.models = model_data['models']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_importance = model_data['feature_importance']
        self.is_trained = model_data['is_trained']
        
        logger.info(f"Model loaded from {filepath}")
        
    def get_feature_importance(self) -> Dict:
        """Get feature importance from trained models"""
        if not self.is_trained:
            raise ValueError("Model must be trained to get feature importance")
        
        return self.feature_importance


def create_sample_data(n_samples: int = 1000) -> pd.DataFrame:
    """
    Create realistic sample pipeline data for testing
    
    Args:
        n_samples: Number of sample pipelines to generate
        
    Returns:
        DataFrame with sample pipeline data
    """
    np.random.seed(42)
    
    materials = ['Carbon Steel', 'Stainless Steel', 'HDPE', 'Fiberglass']
    coating_types = ['FBE', '3LPE', 'Tape', 'None']
    soil_types = ['Clay', 'Sand', 'Rock', 'Mixed']
    environment_types = ['Rural', 'Urban', 'Industrial', 'Marine']
    
    data = {
        'id': range(1, n_samples + 1),
        'age_years': np.random.uniform(5, 50, n_samples),
        'diameter': np.random.choice([6, 8, 10, 12, 16, 20, 24, 30], n_samples),
        'pressure_rating': np.random.uniform(600, 1500, n_samples),
        'operating_pressure': np.random.uniform(300, 1200, n_samples),
        'length_km': np.random.uniform(1, 100, n_samples),
        'depth_avg': np.random.uniform(0.5, 3.0, n_samples),
        'temperature_avg': np.random.uniform(5, 45, n_samples),
        'wall_thickness': np.random.uniform(6, 20, n_samples),
        'material': np.random.choice(materials, n_samples),
        'coating_type': np.random.choice(coating_types, n_samples),
        'soil_type': np.random.choice(soil_types, n_samples),
        'environment_type': np.random.choice(environment_types, n_samples),
        'corrosion_rate': np.random.uniform(0.01, 0.5, n_samples),
        'soil_resistivity': np.random.uniform(500, 5000, n_samples),
        'cathodic_protection_level': np.random.uniform(0.85, 1.2, n_samples),
        'corrosion_severity': np.random.randint(1, 6, n_samples),
        'depth_variation': np.random.randint(1, 6, n_samples),
        'pressure_fluctuation': np.random.randint(1, 6, n_samples),
        'temperature_variation': np.random.randint(1, 6, n_samples),
        'external_damage_risk': np.random.randint(1, 6, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create realistic failure probabilities based on features
    failure_prob = (
        (df['age_years'] / 50) * 0.3 +
        (df['corrosion_rate'] / 0.5) * 0.3 +
        (df['corrosion_severity'] / 5) * 0.2 +
        ((df['pressure_rating'] - df['operating_pressure']) / df['pressure_rating']) * -0.1 +
        np.random.normal(0, 0.1, n_samples)
    )
    
    df['failure_probability'] = np.clip(failure_prob, 0, 1)
    
    return df


if __name__ == "__main__":
    # Example usage
    logger.info("Creating sample data...")
    sample_data = create_sample_data(1000)
    
    logger.info("Training model...")
    predictor = PipelineRiskPredictor()
    
    # Train the model
    training_metrics = predictor.train(sample_data)
    print("Training Metrics:")
    for model_name, metrics in training_metrics.items():
        print(f"{model_name}: R² = {metrics['test_r2']:.4f}")
    
    # Make a prediction for a single pipeline
    test_pipeline = {
        'id': 9999,
        'age_years': 25,
        'diameter': 12,
        'pressure_rating': 1000,
        'operating_pressure': 800,
        'material': 'Carbon Steel',
        'corrosion_rate': 0.15,
        'corrosion_severity': 4
    }
    
    prediction = predictor.predict_single_pipeline(test_pipeline)
    print(f"\nPrediction for pipeline {test_pipeline['id']}:")
    print(f"Failure Probability: {prediction['failure_probability']:.3f}")
    print(f"Risk Level: {prediction['risk_level']}")
    print(f"Confidence: {prediction['confidence_score']:.3f}")
    
    # Save the model
    predictor.save_model('pipeline_risk_model.joblib')
    logger.info("Model saved successfully")
