import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FertilizerRecommendations.css';

const FertilizerRecommendations = ({ soilData }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (soilData && Object.keys(soilData).length > 0) {
      fetchRecommendations();
    }
  }, [soilData]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5001/api/fertilizers/recommend', {
        N: parseFloat(soilData.N) || 0,
        P: parseFloat(soilData.P) || 0,
        K: parseFloat(soilData.K) || 0,
        ph: parseFloat(soilData.ph) || 7.0
      });

      setRecommendations(response.data);
    } catch (err) {
      console.error('Error fetching fertilizer recommendations:', err);
      setError('Failed to fetch fertilizer recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (!soilData || Object.keys(soilData).length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="fertilizer-recommendations loading">
        <div className="loading-spinner"></div>
        <p>Calculating fertilizer recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fertilizer-recommendations error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'deficient':
        return '🔴';
      case 'moderate':
        return '🟡';
      case 'optimal':
        return '🟢';
      case 'acidic':
        return '🔵';
      case 'alkaline':
        return '🟣';
      default:
        return '⚪';
    }
  };

  return (
    <div className="fertilizer-recommendations">
      <h3 className="fert-title">
        <span className="title-icon">🧾</span>
        Detailed Fertilizer Plan
      </h3>

      {/* Fertilizer Cards */}
      {recommendations.fertilizers && recommendations.fertilizers.length > 0 && (
        <div className="fertilizer-cards">
          {recommendations.fertilizers.map((fert, idx) => (
            <div key={idx} className={`fert-card ${fert.status.toLowerCase()}`}>
              <div className="fert-header">
                <div className="fert-header-left">
                  <span className="status-icon">{getStatusIcon(fert.status)}</span>
                  <h4 className="fert-nutrient">{fert.nutrient}</h4>
                </div>
                <span className={`status-badge ${fert.status.toLowerCase()}`}>
                  {fert.status}
                </span>
              </div>

              <div className="fert-body">
                <div className="fert-detail">
                  <span className="detail-icon">💊</span>
                  <div className="detail-content">
                    <span className="detail-label">Fertilizer Type</span>
                    <span className="detail-value">{fert.fertilizer}</span>
                  </div>
                </div>

                <div className="fert-detail">
                  <span className="detail-icon">⚖️</span>
                  <div className="detail-content">
                    <span className="detail-label">Quantity Required</span>
                    <span className="detail-value">{fert.quantity}</span>
                  </div>
                </div>

                <div className="fert-detail">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Application Method</span>
                    <span className="detail-value application">{fert.application}</span>
                  </div>
                </div>

                <div className="fert-detail">
                  <span className="detail-icon">💰</span>
                  <div className="detail-content">
                    <span className="detail-label">Estimated Cost</span>
                    <span className="detail-value cost">{fert.cost_estimate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cost Summary */}
      {recommendations.total_estimated_cost && (
        <div className="cost-summary">
          <div className="cost-summary-header">
            <h4>💵 Total Investment Required</h4>
          </div>
          <div className="cost-summary-body">
            <div className="total-cost">
              {recommendations.total_estimated_cost}
            </div>
            <div className="cost-note">
              <span className="note-icon">ℹ️</span>
              <span>Prices are approximate and may vary by location and brand</span>
            </div>
          </div>
        </div>
      )}

      {/* Application Schedule */}
      {recommendations.application_schedule && recommendations.application_schedule.length > 0 && (
        <div className="application-schedule">
          <h4 className="schedule-title">
            <span className="schedule-icon">📅</span>
            Application Timeline
          </h4>
          <div className="schedule-table">
            <table>
              <thead>
                <tr>
                  <th>Timing</th>
                  <th>Fertilizer</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.application_schedule.map((item, idx) => (
                  <tr key={idx}>
                    <td className="schedule-timing">
                      <span className="timing-icon">⏰</span>
                      {item.timing || item.month}
                    </td>
                    <td className="schedule-fertilizer">{item.fertilizer}</td>
                    <td className="schedule-quantity">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Best Practices */}
      <div className="best-practices">
        <h4 className="practices-title">
          <span className="practices-icon">💡</span>
          Application Best Practices
        </h4>
        <ul className="practices-list">
          <li>
            <span className="practice-bullet">✓</span>
            Apply fertilizers when soil is moist for better absorption
          </li>
          <li>
            <span className="practice-bullet">✓</span>
            Avoid application during heavy rain to prevent nutrient runoff
          </li>
          <li>
            <span className="practice-bullet">✓</span>
            Use split doses for nitrogen to reduce leaching and improve efficiency
          </li>
          <li>
            <span className="practice-bullet">✓</span>
            Incorporate fertilizers into soil for better root access
          </li>
          <li>
            <span className="practice-bullet">✓</span>
            Monitor crop response and adjust application rates as needed
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="fert-actions">
        <button className="download-plan-btn">
          <span className="btn-icon">📥</span>
          Download Fertilizer Plan (PDF)
        </button>
      </div>
    </div>
  );
};

export default FertilizerRecommendations;
