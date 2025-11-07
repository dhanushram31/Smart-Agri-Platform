import React from 'react';
import './ExtractedParametersDisplay.css';

const ExtractedParametersDisplay = ({ extractedData, formData }) => {
    // Determine which values to display (extracted or form values)
    const displayValues = {
        N: extractedData?.N || formData?.N || '-',
        P: extractedData?.P || formData?.P || '-',
        K: extractedData?.K || formData?.K || '-',
        PH: extractedData?.ph || formData?.ph || '-',
        TEMPERATURE: extractedData?.temperature || formData?.temperature || '-',
        HUMIDITY: extractedData?.humidity || formData?.humidity || '-',
        RAINFALL: extractedData?.rainfall || formData?.rainfall || '-'
    };

    // Generate recommendations based on values
    const generateRecommendations = () => {
        const recommendations = [];
        
        const ph = parseFloat(displayValues.PH);
        const N = parseFloat(displayValues.N);
        
        if (!isNaN(ph)) {
            if (ph >= 6.0 && ph <= 8.0) {
                recommendations.push({
                    type: 'success',
                    icon: '✅',
                    message: `Soil pH (${ph.toFixed(1)}) is in the optimal range for most crops.`
                });
            } else if (ph < 6.0) {
                recommendations.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `Low pH (${ph.toFixed(1)}). Consider adding lime to increase pH for better nutrient availability.`
                });
            } else {
                recommendations.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `High pH (${ph.toFixed(1)}). Consider adding sulfur to lower pH.`
                });
            }
        }

        if (!isNaN(N)) {
            if (N > 50) {
                recommendations.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `High nitrogen levels (${N} mg/kg). Reduce nitrogen application to prevent nutrient burn.`
                });
            } else if (N < 20) {
                recommendations.push({
                    type: 'info',
                    icon: '💡',
                    message: `Low nitrogen levels (${N} mg/kg). Consider adding nitrogen-rich fertilizers.`
                });
            } else {
                recommendations.push({
                    type: 'success',
                    icon: '✅',
                    message: `Nitrogen levels (${N} mg/kg) are adequate for most crops.`
                });
            }
        }

        return recommendations;
    };

    const recommendations = generateRecommendations();

    return (
        <div className="extracted-parameters-container">
            {/* Extracted Soil Parameters Section */}
            <div className="extracted-params-section">
                <div className="section-header">
                    <span className="header-icon">🔍</span>
                    <h3>Extracted Soil Parameters</h3>
                </div>
                
                <div className="params-grid">
                    <div className="param-item">
                        <span className="param-label">N</span>
                        <span className="param-value">{displayValues.N}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">P</span>
                        <span className="param-value">{displayValues.P}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">K</span>
                        <span className="param-value">{displayValues.K}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">PH</span>
                        <span className="param-value">{displayValues.PH}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">TEMPERATURE</span>
                        <span className="param-value">{displayValues.TEMPERATURE}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">HUMIDITY</span>
                        <span className="param-value">{displayValues.HUMIDITY}</span>
                    </div>
                    <div className="param-item">
                        <span className="param-label">RAINFALL</span>
                        <span className="param-value">{displayValues.RAINFALL}</span>
                    </div>
                </div>
            </div>

            {/* Soil Improvement Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="recommendations-section">
                    <div className="section-header">
                        <span className="header-icon">💡</span>
                        <h3>Soil Improvement Recommendations</h3>
                    </div>
                    
                    <div className="recommendations-list">
                        {recommendations.map((rec, index) => (
                            <div key={index} className={`recommendation-item ${rec.type}`}>
                                <span className="rec-icon">{rec.icon}</span>
                                <span className="rec-message">{rec.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExtractedParametersDisplay;
