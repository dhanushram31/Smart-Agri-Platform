import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PredictionHistory.css';

const PredictionHistory = ({ userId, onReuseData }) => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [filter, setFilter] = useState('all'); // all, implemented, pending
    const [sortBy, setSortBy] = useState('predictionDate');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        if (userId) {
            fetchPredictionHistory();
        }
    }, [userId, sortBy, sortOrder]);

    const fetchPredictionHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5002/api/crop/history/${userId}`,
                {
                    params: {
                        sortBy,
                        order: sortOrder,
                        limit: 50
                    }
                }
            );

            if (response.data.success) {
                setPredictions(response.data.predictions);
            } else {
                setError('Failed to fetch prediction history');
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to load prediction history');
        } finally {
            setLoading(false);
        }
    };

    const handleReuseData = (prediction) => {
        if (onReuseData) {
            onReuseData({
                N: prediction.N,
                P: prediction.P,
                K: prediction.K,
                ph: prediction.ph,
                temperature: prediction.temperature,
                humidity: prediction.humidity,
                rainfall: prediction.rainfall,
                location: prediction.location,
                farmSize: prediction.farmSize,
                soilType: prediction.soilType,
                season: prediction.season
            });
        }
    };

    const handleViewDetails = (prediction) => {
        setSelectedPrediction(selectedPrediction?._id === prediction._id ? null : prediction);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredPredictions = () => {
        if (filter === 'all') return predictions;
        if (filter === 'implemented') return predictions.filter(p => p.implemented);
        if (filter === 'pending') return predictions.filter(p => !p.implemented);
        return predictions;
    };

    const getStatusIcon = (prediction) => {
        if (prediction.implemented) return '✅';
        return '⏳';
    };

    const getSeasonIcon = (season) => {
        const icons = {
            'Kharif': '🌧️',
            'Rabi': '☀️',
            'Zaid': '🌸',
            'Summer': '🔥',
            'Monsoon': '⛈️',
            'Winter': '❄️'
        };
        return icons[season] || '🌾';
    };

    if (loading) {
        return (
            <div className="prediction-history-loading">
                <div className="loading-spinner"></div>
                <p>Loading your prediction history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="prediction-history-error">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
                <button onClick={fetchPredictionHistory} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    const filteredPredictions = getFilteredPredictions();

    return (
        <div className="prediction-history">
            <div className="history-header">
                <h2 className="history-title">
                    <span className="title-icon">📊</span>
                    Prediction History
                </h2>
                <div className="history-controls">
                    <div className="filter-group">
                        <label>Filter:</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Predictions</option>
                            <option value="implemented">Implemented</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div className="sort-group">
                        <label>Sort By:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="predictionDate">Date</option>
                            <option value="predictedCrop">Crop</option>
                            <option value="predictedPrice">Price</option>
                        </select>
                        <button 
                            className="sort-order-btn"
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        >
                            {sortOrder === 'desc' ? '↓' : '↑'}
                        </button>
                    </div>
                </div>
            </div>

            {filteredPredictions.length === 0 ? (
                <div className="no-predictions">
                    <span className="no-predictions-icon">📭</span>
                    <h3>No predictions found</h3>
                    <p>Start making predictions to see your history here!</p>
                </div>
            ) : (
                <div className="predictions-timeline">
                    {filteredPredictions.map((prediction, index) => (
                        <div key={prediction._id} className="prediction-card">
                            <div className="prediction-header">
                                <div className="prediction-date">
                                    <span className="status-icon">{getStatusIcon(prediction)}</span>
                                    <span className="date-text">{formatDate(prediction.predictionDate)}</span>
                                </div>
                                <div className="prediction-actions">
                                    <button
                                        className="reuse-btn"
                                        onClick={() => handleReuseData(prediction)}
                                        title="Reuse this data for a new prediction"
                                    >
                                        ♻️ Reuse
                                    </button>
                                    <button
                                        className="details-btn"
                                        onClick={() => handleViewDetails(prediction)}
                                    >
                                        {selectedPrediction?._id === prediction._id ? '▼' : '▶'}
                                    </button>
                                </div>
                            </div>

                            <div className="prediction-summary">
                                <div className="crop-info">
                                    <span className="crop-icon">🌾</span>
                                    <div className="crop-details">
                                        <h3 className="crop-name">{prediction.predictedCrop}</h3>
                                        <p className="crop-price">₹{prediction.predictedPrice.toFixed(2)}/quintal</p>
                                    </div>
                                </div>
                                {prediction.season && (
                                    <div className="season-badge">
                                        {getSeasonIcon(prediction.season)} {prediction.season}
                                    </div>
                                )}
                            </div>

                            <div className="nutrients-summary">
                                <div className="nutrient-badge">
                                    <span className="nutrient-label">N:</span>
                                    <span className="nutrient-value">{prediction.N}</span>
                                </div>
                                <div className="nutrient-badge">
                                    <span className="nutrient-label">P:</span>
                                    <span className="nutrient-value">{prediction.P}</span>
                                </div>
                                <div className="nutrient-badge">
                                    <span className="nutrient-label">K:</span>
                                    <span className="nutrient-value">{prediction.K}</span>
                                </div>
                                <div className="nutrient-badge">
                                    <span className="nutrient-label">pH:</span>
                                    <span className="nutrient-value">{prediction.ph}</span>
                                </div>
                            </div>

                            {selectedPrediction?._id === prediction._id && (
                                <div className="prediction-details">
                                    <div className="details-section">
                                        <h4>📍 Location & Environment</h4>
                                        <div className="details-grid">
                                            {prediction.location && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Location:</span>
                                                    <span className="detail-value">{prediction.location}</span>
                                                </div>
                                            )}
                                            <div className="detail-item">
                                                <span className="detail-label">Temperature:</span>
                                                <span className="detail-value">{prediction.temperature}°C</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Humidity:</span>
                                                <span className="detail-value">{prediction.humidity}%</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Rainfall:</span>
                                                <span className="detail-value">{prediction.rainfall} mm</span>
                                            </div>
                                            {prediction.farmSize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Farm Size:</span>
                                                    <span className="detail-value">{prediction.farmSize} acres</span>
                                                </div>
                                            )}
                                            {prediction.soilType && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Soil Type:</span>
                                                    <span className="detail-value">{prediction.soilType}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {prediction.hadSoilReport && (
                                        <div className="details-section">
                                            <h4>📄 Soil Report</h4>
                                            <p className="soil-report-info">
                                                ✅ Extracted {prediction.extractedParameters?.length || 0} parameters from soil report
                                            </p>
                                        </div>
                                    )}

                                    {prediction.notes && (
                                        <div className="details-section">
                                            <h4>📝 Notes</h4>
                                            <p className="prediction-notes">{prediction.notes}</p>
                                        </div>
                                    )}

                                    {prediction.recommendations && (
                                        <div className="details-section">
                                            <h4>💡 Recommendations</h4>
                                            {prediction.recommendations.nutrients?.length > 0 && (
                                                <div className="recommendations-list">
                                                    <strong>Nutrients:</strong>
                                                    {prediction.recommendations.nutrients.map((nutrient, idx) => (
                                                        <div key={idx} className="recommendation-item">
                                                            • {nutrient.nutrient}: {nutrient.recommendation}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {filteredPredictions.length > 0 && (
                <div className="history-footer">
                    <p className="total-count">
                        Showing {filteredPredictions.length} prediction{filteredPredictions.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PredictionHistory;
