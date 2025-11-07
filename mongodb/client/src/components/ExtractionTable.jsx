import React, { useState } from 'react';
import './ExtractionTable.css';

const ExtractionTable = ({ extractedData, onUpdate, onConfirm }) => {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [localData, setLocalData] = useState(extractedData);

  const parameterInfo = {
    nitrogen: { label: 'Nitrogen (N)', unit: 'mg/kg', min: 0, max: 500 },
    phosphorus: { label: 'Phosphorus (P)', unit: 'mg/kg', min: 0, max: 500 },
    potassium: { label: 'Potassium (K)', unit: 'mg/kg', min: 0, max: 500 },
    ph: { label: 'pH Level', unit: '', min: 3, max: 10 },
    temperature: { label: 'Temperature', unit: '°C', min: -10, max: 60 },
    humidity: { label: 'Humidity', unit: '%', min: 0, max: 100 },
    rainfall: { label: 'Rainfall', unit: 'mm', min: 0, max: 5000 }
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSave = (field) => {
    const info = parameterInfo[field];
    const numValue = parseFloat(tempValue);

    // Validation
    if (isNaN(numValue)) {
      alert(`Please enter a valid number for ${info.label}`);
      return;
    }

    if (numValue < info.min || numValue > info.max) {
      alert(`${info.label} must be between ${info.min} and ${info.max}${info.unit}`);
      return;
    }

    // Update local state
    const updatedData = { ...localData, [field]: numValue };
    setLocalData(updatedData);
    
    // Notify parent component
    if (onUpdate) {
      onUpdate(updatedData);
    }

    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleConfirm = () => {
    // Check if all fields have values
    const missingFields = Object.keys(parameterInfo).filter(
      field => !localData[field] || localData[field] === ''
    );

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(f => parameterInfo[f].label).join(', ');
      alert(`Please fill in all fields before confirming. Missing: ${missingLabels}`);
      return;
    }

    if (onConfirm) {
      onConfirm(localData);
    }
  };

  const getStatusIcon = (field) => {
    const value = localData[field];
    if (!value || value === '') return '⚠️';
    
    const info = parameterInfo[field];
    const numValue = parseFloat(value);
    
    if (numValue < info.min || numValue > info.max) return '❌';
    return '✅';
  };

  const getStatusClass = (field) => {
    const value = localData[field];
    if (!value || value === '') return 'missing';
    
    const info = parameterInfo[field];
    const numValue = parseFloat(value);
    
    if (numValue < info.min || numValue > info.max) return 'invalid';
    return 'valid';
  };

  return (
    <div className="extraction-table-container">
      <div className="extraction-table-header">
        <h3>📊 Extracted Soil Parameters</h3>
        <button 
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={Object.keys(parameterInfo).some(f => !localData[f])}
        >
          ✓ Confirm & Analyze
        </button>
      </div>

      <div className="extraction-table">
        {Object.entries(parameterInfo).map(([field, info]) => {
          const isEditing = editingField === field;
          const value = localData[field];
          const statusClass = getStatusClass(field);
          const statusIcon = getStatusIcon(field);

          return (
            <div key={field} className={`parameter-row ${statusClass}`}>
              <div className="parameter-label">
                <span className="status-icon">{statusIcon}</span>
                <span className="label-text">{info.label}</span>
              </div>

              <div className="parameter-value">
                {isEditing ? (
                  <div className="edit-mode">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSave(field);
                        if (e.key === 'Escape') handleCancel();
                      }}
                      placeholder={`Enter ${info.label.toLowerCase()}`}
                      autoFocus
                      step="0.1"
                      min={info.min}
                      max={info.max}
                    />
                    <span className="unit">{info.unit}</span>
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSave(field)}
                        title="Save"
                      >
                        ✓
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={handleCancel}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="value-text">
                      {value ? `${value} ${info.unit}` : 'Not extracted'}
                    </span>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(field, value)}
                      title="Edit value"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="parameter-range">
                  <span className="range-text">
                    Valid: {info.min} - {info.max}{info.unit}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="extraction-table-footer">
        <div className="legend">
          <span className="legend-item">
            <span className="status-icon">✅</span> Valid
          </span>
          <span className="legend-item">
            <span className="status-icon">⚠️</span> Missing
          </span>
          <span className="legend-item">
            <span className="status-icon">❌</span> Out of range
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExtractionTable;
