import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './NutrientGauges.css';

const NutrientGauges = ({ soilData }) => {
  const getNutrientLevel = (value, type) => {
    const thresholds = {
      N: { low: 20, optimal: 40, high: 60, max: 80 },
      P: { low: 15, optimal: 30, high: 50, max: 60 },
      K: { low: 20, optimal: 40, high: 60, max: 80 },
      ph: { low: 6.0, optimal: 7.0, high: 7.5, max: 14 }
    };

    const threshold = thresholds[type];
    const numValue = parseFloat(value);

    if (numValue < threshold.low) {
      return { level: 'Low', color: '#dc2626', status: 'deficient' };
    }
    if (numValue < threshold.optimal) {
      return { level: 'Medium', color: '#f59e0b', status: 'moderate' };
    }
    if (numValue <= threshold.high) {
      return { level: 'Optimal', color: '#059669', status: 'optimal' };
    }
    return { level: 'High', color: '#3b82f6', status: 'excess' };
  };

  const nutrients = [
    { key: 'N', name: 'Nitrogen', max: 80, unit: 'mg/kg', icon: '🧪' },
    { key: 'P', name: 'Phosphorus', max: 60, unit: 'mg/kg', icon: '⚗️' },
    { key: 'K', name: 'Potassium', max: 80, unit: 'mg/kg', icon: '🔬' },
    { key: 'ph', name: 'pH Level', max: 14, unit: 'pH', icon: '📊' }
  ];

  // Check if soilData is available
  if (!soilData || Object.keys(soilData).length === 0) {
    return (
      <div className="nutrient-gauges">
        <h3 className="gauges-title">
          <span className="title-icon">🧪</span>
          Soil Nutrient Analysis
        </h3>
        <div className="no-data-message">
          <p>No soil data available. Please analyze a soil report or enter data manually.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrient-gauges">
      <h3 className="gauges-title">
        <span className="title-icon">🧪</span>
        Soil Nutrient Analysis
      </h3>
      
      <div className="gauges-grid">
        {nutrients.map(nutrient => {
          const value = soilData[nutrient.key];
          
          // Skip if no value
          if (value === undefined || value === null || value === '') {
            return null;
          }

          const numValue = parseFloat(value);
          const status = getNutrientLevel(numValue, nutrient.key);
          const percentage = Math.min((numValue / nutrient.max) * 100, 100);

          return (
            <div key={nutrient.key} className={`gauge-card ${status.status}`}>
              <div className="gauge-header">
                <span className="nutrient-icon">{nutrient.icon}</span>
                <h4 className="nutrient-name">{nutrient.name}</h4>
              </div>
              
              <div className="gauge-container">
                <CircularProgressbar
                  value={percentage}
                  text={`${numValue}`}
                  styles={buildStyles({
                    pathColor: status.color,
                    textColor: status.color,
                    trailColor: '#e5e7eb',
                    pathTransitionDuration: 0.8,
                    textSize: '24px'
                  })}
                />
              </div>
              
              <div className="gauge-info">
                <span className="gauge-value">
                  {numValue} {nutrient.unit}
                </span>
                <span 
                  className={`gauge-status ${status.status}`}
                  style={{ color: status.color }}
                >
                  {status.level}
                </span>
              </div>

              {/* Range indicator */}
              <div className="range-indicator">
                <div className="range-bar">
                  <div 
                    className="range-marker"
                    style={{ left: `${percentage}%` }}
                  />
                </div>
                <div className="range-labels">
                  <span>0</span>
                  <span>{nutrient.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="gauges-legend">
        <div className="legend-item">
          <span className="legend-dot deficient"></span>
          <span>Low (Deficient)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot moderate"></span>
          <span>Medium</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot optimal"></span>
          <span>Optimal</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot excess"></span>
          <span>High (Excess)</span>
        </div>
      </div>
    </div>
  );
};

export default NutrientGauges;
