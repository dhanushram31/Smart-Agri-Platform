import React, { useState } from 'react';
import { predictCrop } from '../services/cropService';
import './CropPredictionForm.css';
import { useAuth } from '../context/AuthContext'; 

const getUserId = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        return user._id;
    } else {
        return null;
    }
};

function CropPredictionForm() {
    const { user } = useAuth();
    const user_id = getUserId(user);
    console.log(user_id);
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
        user_id: user_id // Change this to user_id
    });

    const [predictedCrop, setPredictedCrop] = useState(null);
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const floatValue = parseFloat(value);
        setFormData({ ...formData, [name]: floatValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Clear previous results
        setPredictedCrop(null);
        setPredictedPrice(null);

        console.log("Form submitted with data:", formData);

        try {
            const cropPrediction = await predictCrop(formData);
            console.log("Crop prediction result:", cropPrediction);
            
            if (cropPrediction && cropPrediction.predicted_crop) {
                setPredictedCrop(cropPrediction.predicted_crop);
                setPredictedPrice(cropPrediction.predicted_price);
                console.log("Set predicted crop:", cropPrediction.predicted_crop);
                console.log("Set predicted price:", cropPrediction.predicted_price);
            } else {
                console.error("Invalid response format:", cropPrediction);
                setError('Invalid response from server. Please try again.');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setError('Failed to predict crop. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getSoilConditionLevel = (value, type) => {
        switch(type) {
            case 'N':
                if (value < 20) return { level: 'Low', color: '#dc2626' };
                if (value < 40) return { level: 'Medium', color: '#f59e0b' };
                return { level: 'High', color: '#059669' };
            case 'P':
                if (value < 15) return { level: 'Low', color: '#dc2626' };
                if (value < 30) return { level: 'Medium', color: '#f59e0b' };
                return { level: 'High', color: '#059669' };
            case 'K':
                if (value < 20) return { level: 'Low', color: '#dc2626' };
                if (value < 40) return { level: 'Medium', color: '#f59e0b' };
                return { level: 'High', color: '#059669' };
            case 'ph':
                if (value < 6.0) return { level: 'Acidic', color: '#dc2626' };
                if (value < 7.5) return { level: 'Neutral', color: '#059669' };
                return { level: 'Alkaline', color: '#f59e0b' };
            default:
                return { level: 'Normal', color: '#059669' };
        }
    };

    return (
        <div className="crop-prediction-container">
            <div className="crop-prediction-wrapper">
                <div className="crop-prediction-header">
                    <h1 className="crop-title">
                        <span className="title-icon">🌱</span>
                        Crop Prediction System
                    </h1>
                    <p className="crop-subtitle">
                        Analyze soil conditions and environmental factors to predict the best crop for your farm
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="crop-prediction-form">
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">🧪</span>
                            Soil Nutrients (NPK)
                        </h3>
                        <div className="input-grid nutrients-grid">
                            <div className="form-group">
                                <label htmlFor="N" className="form-label">
                                    <span className="label-icon">🟦</span>
                                    Nitrogen (N)
                                </label>
                                <input
                                    type="number"
                                    id="N"
                                    name="N"
                                    className="form-input"
                                    placeholder="e.g., 30"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">mg/kg</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="P" className="form-label">
                                    <span className="label-icon">🟠</span>
                                    Phosphorus (P)
                                </label>
                                <input
                                    type="number"
                                    id="P"
                                    name="P"
                                    className="form-input"
                                    placeholder="e.g., 25"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">mg/kg</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="K" className="form-label">
                                    <span className="label-icon">🟣</span>
                                    Potassium (K)
                                </label>
                                <input
                                    type="number"
                                    id="K"
                                    name="K"
                                    className="form-input"
                                    placeholder="e.g., 40"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">mg/kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">🌡️</span>
                            Environmental Conditions
                        </h3>
                        <div className="input-grid environment-grid">
                            <div className="form-group">
                                <label htmlFor="temperature" className="form-label">
                                    <span className="label-icon">🌡️</span>
                                    Temperature
                                </label>
                                <input
                                    type="number"
                                    id="temperature"
                                    name="temperature"
                                    className="form-input"
                                    placeholder="e.g., 25"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">°C</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="humidity" className="form-label">
                                    <span className="label-icon">💧</span>
                                    Humidity
                                </label>
                                <input
                                    type="number"
                                    id="humidity"
                                    name="humidity"
                                    className="form-input"
                                    placeholder="e.g., 65"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">%</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="rainfall" className="form-label">
                                    <span className="label-icon">🌧️</span>
                                    Rainfall
                                </label>
                                <input
                                    type="number"
                                    id="rainfall"
                                    name="rainfall"
                                    className="form-input"
                                    placeholder="e.g., 150"
                                    step="any"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">mm</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">⚗️</span>
                            Soil Properties
                        </h3>
                        <div className="input-grid ph-grid">
                            <div className="form-group">
                                <label htmlFor="ph" className="form-label">
                                    <span className="label-icon">🧪</span>
                                    pH Level
                                </label>
                                <input
                                    type="number"
                                    id="ph"
                                    name="ph"
                                    className="form-input"
                                    placeholder="e.g., 6.5"
                                    step="any"
                                    min="0"
                                    max="14"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-help">pH scale (0-14)</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="predict-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">🔍</span>
                                    Predict Best Crop
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {(predictedCrop || predictedPrice) && (
                    <div className="results-display">
                        <div className="results-header">
                            <h2 className="results-title">
                                <span className="results-icon">🎯</span>
                                Prediction Results
                            </h2>
                        </div>

                        <div className="results-content">
                            {predictedCrop && (
                                <div className="result-card crop-result">
                                    <div className="result-icon">🌾</div>
                                    <div className="result-info">
                                        <h3 className="result-label">Recommended Crop</h3>
                                        <p className="result-value crop-name">
                                            {predictedCrop.charAt(0).toUpperCase() + predictedCrop.slice(1)}
                                        </p>
                                        <span className="result-confidence">Best match for your conditions</span>
                                    </div>
                                </div>
                            )}

                            {predictedPrice && (
                                <div className="result-card price-result">
                                    <div className="result-icon">💰</div>
                                    <div className="result-info">
                                        <h3 className="result-label">Expected Price</h3>
                                        <p className="result-value price-value">
                                            ₹{Math.round(predictedPrice).toLocaleString()}
                                        </p>
                                        <span className="result-confidence">Per quintal (approx.)</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="soil-analysis">
                            <h3 className="analysis-title">Soil Condition Analysis</h3>
                            <div className="analysis-grid">
                                {formData.N && (
                                    <div className="analysis-item">
                                        <span className="nutrient-name">Nitrogen</span>
                                        <span 
                                            className="nutrient-level"
                                            style={{ color: getSoilConditionLevel(formData.N, 'N').color }}
                                        >
                                            {getSoilConditionLevel(formData.N, 'N').level}
                                        </span>
                                    </div>
                                )}
                                {formData.P && (
                                    <div className="analysis-item">
                                        <span className="nutrient-name">Phosphorus</span>
                                        <span 
                                            className="nutrient-level"
                                            style={{ color: getSoilConditionLevel(formData.P, 'P').color }}
                                        >
                                            {getSoilConditionLevel(formData.P, 'P').level}
                                        </span>
                                    </div>
                                )}
                                {formData.K && (
                                    <div className="analysis-item">
                                        <span className="nutrient-name">Potassium</span>
                                        <span 
                                            className="nutrient-level"
                                            style={{ color: getSoilConditionLevel(formData.K, 'K').color }}
                                        >
                                            {getSoilConditionLevel(formData.K, 'K').level}
                                        </span>
                                    </div>
                                )}
                                {formData.ph && (
                                    <div className="analysis-item">
                                        <span className="nutrient-name">pH Level</span>
                                        <span 
                                            className="nutrient-level"
                                            style={{ color: getSoilConditionLevel(formData.ph, 'ph').color }}
                                        >
                                            {getSoilConditionLevel(formData.ph, 'ph').level}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CropPredictionForm;
