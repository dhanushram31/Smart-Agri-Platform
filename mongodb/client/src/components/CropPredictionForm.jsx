import React, { useState, useRef } from 'react';
import { predictCrop } from '../services/cropService';
import './CropPredictionForm.css';
import { useAuth } from '../context/AuthContext';
import SoilReportAnalysis from './SoilReportAnalysis';
import WeatherAutoFill from './WeatherAutoFill';
import NutrientGauges from './NutrientGauges';
import FertilizerRecommendations from './FertilizerRecommendations';
import PredictionHistory from './PredictionHistory';
import CropChatbot from './CropChatbot';
import { generateCropPredictionReport } from '../utils/ReportGenerator'; 

// UPDATED: Added getUserId utility function
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
    
    // UPDATED: New state hooks for soil report upload and recommendations
    const [soilReportFile, setSoilReportFile] = useState(null);
    const [soilReportData, setSoilReportData] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [fileSuccess, setFileSuccess] = useState(null); // NEW: For extraction success message
    const [extracting, setExtracting] = useState(false); // NEW: Loading state for extraction
    const [showExtractionTable, setShowExtractionTable] = useState(false); // NEW: Show editable table
    const [extractedData, setExtractedData] = useState(null); // NEW: Store extracted data
    const [dragActive, setDragActive] = useState(false);
    const [inputMode, setInputMode] = useState('report'); // NEW: 'report' or 'manual'
    const [autoFillMessage, setAutoFillMessage] = useState(null); // NEW: Message when switching to manual
    const [showHistory, setShowHistory] = useState(false); // NEW: Toggle history view
    const [generatingPDF, setGeneratingPDF] = useState(false); // NEW: PDF generation loading state
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const floatValue = parseFloat(value);
        setFormData({ ...formData, [name]: floatValue });
    };

    // NEW: Handle PDF Report Generation
    const handleDownloadReport = async () => {
        setGeneratingPDF(true);
        
        try {
            const reportData = {
                predictedCrop,
                predictedPrice,
                soilData: formData,
                recommendations,
                userName: user?.name || user?.username || 'Farmer',
                location: 'India' // You can add location field to form if needed
            };

            const result = await generateCropPredictionReport(reportData);
            
            if (result.success) {
                setAutoFillMessage(`✅ Report downloaded: ${result.fileName}`);
                setTimeout(() => setAutoFillMessage(null), 5000);
            } else {
                setError('Failed to generate PDF report. Please try again.');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Failed to generate PDF report. Please try again.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    // NEW: Handle extracted data from SoilReportAnalysis component
    const handleExtractedData = (extractedValues) => {
        console.log('✅ Received extracted data:', extractedValues);
        
        // Count how many fields were extracted
        const extractedFields = Object.keys(extractedValues).filter(
            key => extractedValues[key] !== '' && extractedValues[key] !== null && extractedValues[key] !== undefined
        );
        
        // Auto-fill form with extracted values
        const updatedFormData = {
            ...formData,
            N: extractedValues.N || formData.N,
            P: extractedValues.P || formData.P,
            K: extractedValues.K || formData.K,
            ph: extractedValues.ph || formData.ph,
            temperature: extractedValues.temperature || formData.temperature,
            humidity: extractedValues.humidity || formData.humidity,
            rainfall: extractedValues.rainfall || formData.rainfall
        };
        
        setFormData(updatedFormData);
        
        // Show success message WITHOUT switching tabs
        const message = `✅ ${extractedFields.length} parameter(s) extracted and saved! Data is ready in Manual Input.`;
        setAutoFillMessage(message);
        
        // Clear message after 5 seconds (but don't switch tabs)
        console.log('✅ Data extracted and saved to form. Staying on Report Analysis tab.');
        setTimeout(() => {
            setAutoFillMessage(null);
        }, 5000);
    };

    // NEW: Handle weather data from WeatherAutoFill component
    const handleWeatherData = (weatherData) => {
        console.log('🌤️ Received weather data:', weatherData);
        
        setFormData(prev => ({
            ...prev,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            rainfall: weatherData.rainfall
        }));
        
        const message = `✅ Weather data auto-filled from ${weatherData.location}!`;
        setAutoFillMessage(message);
        
        setTimeout(() => {
            setAutoFillMessage(null);
        }, 5000);
    };

    // NEW: Handle reusing data from prediction history
    const handleReuseHistoryData = (historyData) => {
        console.log('♻️ Reusing prediction data:', historyData);
        
        setFormData(prev => ({
            ...prev,
            N: historyData.N,
            P: historyData.P,
            K: historyData.K,
            ph: historyData.ph,
            temperature: historyData.temperature,
            humidity: historyData.humidity,
            rainfall: historyData.rainfall
        }));
        
        // Close history view and show success message
        setShowHistory(false);
        const message = `✅ Data reused from previous prediction!`;
        setAutoFillMessage(message);
        
        setTimeout(() => {
            setAutoFillMessage(null);
        }, 5000);
    };


    // UPDATED: File validation and upload handler
    const validateFile = (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        
        if (!file) {
            return 'Please select a file';
        }
        
        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }
        
        if (!allowedTypes.includes(file.type)) {
            return 'Only PDF, JPG, and PNG files are allowed';
        }
        
        return null;
    };

    // UPDATED: Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    // UPDATED: Process and validate file
    const processFile = (file) => {
        setFileError(null);
        setFileSuccess(null); // Clear previous success message
        setExtracting(false); // Clear extraction state
        
        const error = validateFile(file);
        if (error) {
            setFileError(error);
            setSoilReportFile(null);
            setSoilReportData(null);
            return;
        }

        setSoilReportFile(file);
        setFileError(null);
        
        // Read file as base64 for API submission
        const reader = new FileReader();
        reader.onload = async (e) => {
            const reportData = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: e.target.result
            };
            setSoilReportData(reportData);
            
            // Immediately extract data and auto-fill form
            await extractAndAutoFill(reportData);
        };
        reader.onerror = () => {
            setFileError('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
    };

    // UPDATED: Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // UPDATED: Remove uploaded file
    const removeFile = () => {
        setSoilReportFile(null);
        setSoilReportData(null);
        setFileError(null);
        setFileSuccess(null);
        setExtracting(false); // Clear extraction state
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // UPDATED: Enhanced submit handler with soil report data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Clear previous results
        setPredictedCrop(null);
        setPredictedPrice(null);
        setRecommendations(null);

        // UPDATED: Prepare submission data with soil report if available
        const submissionData = {
            ...formData,
            ...(soilReportData && { soilReport: soilReportData })
        };

        console.log("Form submitted with data:", submissionData);

        try {
            const cropPrediction = await predictCrop(submissionData);
            console.log("Crop prediction result:", cropPrediction);
            
            if (cropPrediction && cropPrediction.predicted_crop) {
                setPredictedCrop(cropPrediction.predicted_crop);
                setPredictedPrice(cropPrediction.predicted_price);
                
                // UPDATED: Set recommendations if available from API
                if (cropPrediction.recommendations) {
                    // Add extraction info to recommendations
                    const recs = { ...cropPrediction.recommendations };
                    
                    // If parameters were extracted, add a notice
                    if (cropPrediction.extracted_parameters && cropPrediction.extracted_parameters.length > 0) {
                        if (!recs.generalAdvice) recs.generalAdvice = [];
                        recs.generalAdvice.unshift(
                            `✅ Extracted ${cropPrediction.extracted_parameters.length} parameter(s) from soil report: ${cropPrediction.extracted_parameters.join(', ')}`
                        );
                    }
                    
                    setRecommendations(recs);
                } else {
                    // Generate basic recommendations based on soil data
                    setRecommendations(generateBasicRecommendations(formData));
                }
                
                console.log("Set predicted crop:", cropPrediction.predicted_crop);
                console.log("Set predicted price:", cropPrediction.predicted_price);
                
                // Log extraction info if available
                if (cropPrediction.extracted_parameters) {
                    console.log("Extracted parameters:", cropPrediction.extracted_parameters);
                }
            } else {
                console.error("Invalid response format:", cropPrediction);
                setError('Invalid response from server. Please try again.');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            if (soilReportData) {
                setError('Unable to analyze soil report. Please try a clearer file or check your inputs.');
            } else {
                setError('Failed to predict crop. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // UPDATED: Extract data from soil report and display results
    const extractAndAutoFill = async (reportData) => {
        try {
            setFileError(null);
            setFileSuccess(null);
            setExtracting(true); // START LOADING
            
            // Show extracting message
            console.log('Extracting data from soil report...');
            
            // OPTIMIZED: Call the fast extraction endpoint (no prediction)
            const extractionData = {
                soilReport: reportData
            };
            
            const response = await fetch('http://localhost:5001/api/crops/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(extractionData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to extract data from soil report');
            }
            
            const result = await response.json();
            console.log('Extraction result:', result);
            
            // Check if extraction was successful
            if (result.success && result.extracted_values) {
                const extractedVals = result.extracted_values;
                
                // Prepare data for display with all extracted values
                const displayData = {
                    N: extractedVals.N || '',
                    P: extractedVals.P || '',
                    K: extractedVals.K || '',
                    ph: extractedVals.ph || '',
                    temperature: extractedVals.temperature || '',
                    humidity: extractedVals.humidity || '',
                    rainfall: extractedVals.rainfall || ''
                };
                
                // Store extracted data for display
                setExtractedData(displayData);
                setShowExtractionTable(true);
                
                // Auto-fill the form with extracted values
                const updatedFormData = {
                    ...formData,
                    N: extractedVals.N || formData.N,
                    P: extractedVals.P || formData.P,
                    K: extractedVals.K || formData.K,
                    ph: extractedVals.ph || formData.ph,
                    temperature: extractedVals.temperature || formData.temperature,
                    humidity: extractedVals.humidity || formData.humidity,
                    rainfall: extractedVals.rainfall || formData.rainfall
                };
                setFormData(updatedFormData);
                
                // Show success message
                const extractedCount = Object.keys(extractedVals).filter(k => extractedVals[k] !== undefined && extractedVals[k] !== '').length;
                setFileSuccess(`✅ Successfully extracted ${extractedCount} parameter(s) from your soil report`);
                
            } else {
                setFileError('⚠️ Could not extract data from soil report. Please fill the form manually.');
            }
            
        } catch (error) {
            console.error('Error extracting data:', error);
            setFileError('⚠️ Could not extract data from soil report. Please fill the form manually.');
        } finally {
            setExtracting(false); // STOP LOADING
        }
    };

    // UPDATED: Generate basic recommendations based on form data
    const generateBasicRecommendations = (data) => {
        const recs = {
            crops: [],
            soilAdjustments: [],
            nutrients: [],
            generalAdvice: []
        };

        // FIXED: Validate data exists and is numeric before processing
        const N = parseFloat(data.N);
        const P = parseFloat(data.P);
        const K = parseFloat(data.K);
        const ph = parseFloat(data.ph);
        const rainfall = parseFloat(data.rainfall);
        const temperature = parseFloat(data.temperature);

        // pH recommendations
        if (!isNaN(ph)) {
            if (ph < 6.0) {
                recs.soilAdjustments.push({
                    type: 'pH',
                    current: ph.toFixed(1),
                    recommended: '6.0-7.5',
                    action: 'Add lime to increase pH (2-3 tons/acre)'
                });
            } else if (ph > 7.5) {
                recs.soilAdjustments.push({
                    type: 'pH',
                    current: ph.toFixed(1),
                    recommended: '6.0-7.5',
                    action: 'Add sulfur to decrease pH (100-200 kg/acre)'
                });
            } else {
                recs.soilAdjustments.push({
                    type: 'pH',
                    current: ph.toFixed(1),
                    recommended: '6.0-7.5',
                    action: 'pH level is optimal - maintain current practices'
                });
            }
        }

        // NPK recommendations
        if (!isNaN(N)) {
            if (N < 20) {
                recs.nutrients.push({
                    nutrient: 'Nitrogen (N)',
                    status: 'Low',
                    recommendation: 'Apply urea or ammonium nitrate (20-30 kg/acre)'
                });
            } else if (N < 40) {
                recs.nutrients.push({
                    nutrient: 'Nitrogen (N)',
                    status: 'Medium',
                    recommendation: 'Maintain with light fertilization (10-15 kg/acre)'
                });
            } else {
                recs.nutrients.push({
                    nutrient: 'Nitrogen (N)',
                    status: 'High',
                    recommendation: 'Optimal levels - no additional nitrogen needed'
                });
            }
        }

        if (!isNaN(P)) {
            if (P < 15) {
                recs.nutrients.push({
                    nutrient: 'Phosphorus (P)',
                    status: 'Low',
                    recommendation: 'Apply superphosphate (15-20 kg/acre)'
                });
            } else if (P < 30) {
                recs.nutrients.push({
                    nutrient: 'Phosphorus (P)',
                    status: 'Medium',
                    recommendation: 'Maintain with light application (8-10 kg/acre)'
                });
            } else {
                recs.nutrients.push({
                    nutrient: 'Phosphorus (P)',
                    status: 'High',
                    recommendation: 'Optimal levels - no additional phosphorus needed'
                });
            }
        }

        if (!isNaN(K)) {
            if (K < 20) {
                recs.nutrients.push({
                    nutrient: 'Potassium (K)',
                    status: 'Low',
                    recommendation: 'Apply potash (20-25 kg/acre)'
                });
            } else if (K < 40) {
                recs.nutrients.push({
                    nutrient: 'Potassium (K)',
                    status: 'Medium',
                    recommendation: 'Maintain with light application (10-15 kg/acre)'
                });
            } else {
                recs.nutrients.push({
                    nutrient: 'Potassium (K)',
                    status: 'High',
                    recommendation: 'Optimal levels - no additional potassium needed'
                });
            }
        }

        // General advice based on conditions
        if (!isNaN(rainfall)) {
            if (rainfall < 50) {
                recs.generalAdvice.push('Low rainfall detected. Install drip irrigation system for water efficiency.');
            } else if (rainfall > 200) {
                recs.generalAdvice.push('High rainfall. Ensure proper drainage to prevent waterlogging and root rot.');
            } else {
                recs.generalAdvice.push('Rainfall is adequate. Monitor soil moisture regularly.');
            }
        }

        if (!isNaN(temperature)) {
            if (temperature > 35) {
                recs.generalAdvice.push('High temperature detected. Consider shade nets or mulching to protect sensitive crops.');
            } else if (temperature < 15) {
                recs.generalAdvice.push('Low temperature. Consider cold-tolerant varieties or greenhouse cultivation.');
            } else {
                recs.generalAdvice.push('Temperature is in optimal range for most crops.');
            }
        }

        // Add soil report specific advice if uploaded
        if (soilReportFile) {
            recs.generalAdvice.push(`Soil report "${soilReportFile.name}" analyzed. Recommendations are based on your detailed soil data.`);
        }

        // Add general best practices
        recs.generalAdvice.push('Regular soil testing every 2-3 years is recommended for optimal results.');
        recs.generalAdvice.push('Consider crop rotation to maintain soil health and reduce pest pressure.');

        return recs;
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
                    <div className="header-content">
                        <h1 className="crop-title">
                            <span className="title-icon">🌱</span>
                            Crop Prediction System
                        </h1>
                        <p className="crop-subtitle">
                            Analyze soil conditions and environmental factors to predict the best crop for your farm
                        </p>
                    </div>
                    <button
                        type="button"
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? '📝 New Prediction' : '📊 View History'}
                    </button>
                </div>

                {/* NEW: Prediction History View */}
                {showHistory ? (
                    <PredictionHistory 
                        userId={user_id}
                        onReuseData={handleReuseHistoryData}
                    />
                ) : (
                    <>
                        {/* NEW: Input Mode Toggle */}
                        <div className="input-mode-toggle">
                    <button
                        type="button"
                        className={`mode-btn ${inputMode === 'report' ? 'active' : ''}`}
                        onClick={() => setInputMode('report')}
                    >
                        <span className="mode-icon">📄</span>
                        Report Analysis
                    </button>
                    <button
                        type="button"
                        className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
                        onClick={() => setInputMode('manual')}
                    >
                        <span className="mode-icon">✍️</span>
                        Manual Input
                    </button>
                </div>

                {/* Conditional Rendering Based on Input Mode */}
                {inputMode === 'report' && (
                    <>
                        {/* Success message shown in Report Analysis tab */}
                        {autoFillMessage && (
                            <div className="auto-fill-banner">
                                <span className="banner-icon">📋</span>
                                <span className="banner-text">{autoFillMessage}</span>
                                <button 
                                    type="button"
                                    className="banner-close"
                                    onClick={() => setAutoFillMessage(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <SoilReportAnalysis onExtractedData={handleExtractedData} />
                    </>
                )}

                {inputMode === 'manual' && (
                <form onSubmit={handleSubmit} className="crop-prediction-form">
                    {/* Auto-fill success message */}
                    {autoFillMessage && (
                        <div className="auto-fill-banner">
                            <span className="banner-icon">📋</span>
                            <span className="banner-text">{autoFillMessage}</span>
                            <button 
                                type="button"
                                className="banner-close"
                                onClick={() => setAutoFillMessage(null)}
                            >
                                ✕
                            </button>
                        </div>
                    )}

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
                                    value={formData.N}
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
                                    value={formData.P}
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
                                    value={formData.K}
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
                        
                        {/* Weather Auto-Fill Button */}
                        <WeatherAutoFill 
                            onDataFetched={handleWeatherData}
                            disabled={loading}
                        />
                        
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
                                    value={formData.temperature}
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
                                    value={formData.humidity}
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
                                    value={formData.rainfall}
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
                                    value={formData.ph}
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
                )}

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* UPDATED: Enhanced Results Display with Recommendations */}
                {(predictedCrop || predictedPrice) && (
                    <div className="results-display">
                        <div className="results-header">
                            <h2 className="results-title">
                                <span className="results-icon">🎯</span>
                                Prediction Results
                            </h2>
                            <button
                                type="button"
                                className="download-report-btn"
                                onClick={handleDownloadReport}
                                disabled={generatingPDF}
                            >
                                {generatingPDF ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">📄</span>
                                        Download Report
                                    </>
                                )}
                            </button>
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

                        {/* NEW: Nutrient Gauges Visualization */}
                        <NutrientGauges soilData={formData} />

                        {/* NEW: Enhanced Fertilizer Recommendations */}
                        <FertilizerRecommendations soilData={formData} />

                        {/* UPDATED: Detailed Recommendations Section */}
                        {recommendations && (
                            <div className="recommendations-section">
                                <h3 className="recommendations-title">
                                    <span className="section-icon">💡</span>
                                    Soil & Crop Recommendations
                                </h3>

                                {/* Soil Adjustments */}
                                {recommendations.soilAdjustments && recommendations.soilAdjustments.length > 0 && (
                                    <div className="recommendation-card">
                                        <h4 className="rec-card-title">
                                            <span className="rec-icon">⚗️</span>
                                            Soil Adjustments Needed
                                        </h4>
                                        <div className="rec-list">
                                            {recommendations.soilAdjustments.map((adj, idx) => (
                                                <div key={idx} className="rec-item">
                                                    <div className="rec-item-header">
                                                        <span className="rec-type">{adj.type}</span>
                                                        <span className="rec-status warning">Needs Adjustment</span>
                                                    </div>
                                                    <div className="rec-details">
                                                        <p><strong>Current:</strong> {adj.current}</p>
                                                        <p><strong>Recommended:</strong> {adj.recommended}</p>
                                                        <p className="rec-action">
                                                            <span className="action-icon">✓</span>
                                                            {adj.action}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Nutrient Recommendations */}
                                {recommendations.nutrients && recommendations.nutrients.length > 0 && (
                                    <div className="recommendation-card">
                                        <h4 className="rec-card-title">
                                            <span className="rec-icon">🧪</span>
                                            Nutrient Management
                                        </h4>
                                        <div className="nutrients-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Nutrient</th>
                                                        <th>Status</th>
                                                        <th>Recommendation</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recommendations.nutrients.map((nutrient, idx) => (
                                                        <tr key={idx}>
                                                            <td className="nutrient-name">{nutrient.nutrient}</td>
                                                            <td>
                                                                <span className={`status-badge ${nutrient.status.toLowerCase()}`}>
                                                                    {nutrient.status}
                                                                </span>
                                                            </td>
                                                            <td className="nutrient-rec">{nutrient.recommendation}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* General Advice */}
                                {recommendations.generalAdvice && recommendations.generalAdvice.length > 0 && (
                                    <div className="recommendation-card">
                                        <h4 className="rec-card-title">
                                            <span className="rec-icon">🌟</span>
                                            General Farming Advice
                                        </h4>
                                        <ul className="advice-list">
                                            {recommendations.generalAdvice.map((advice, idx) => (
                                                <li key={idx} className="advice-item">
                                                    <span className="advice-bullet">→</span>
                                                    {advice}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Alternative Crops (if provided by API) */}
                                {recommendations.crops && recommendations.crops.length > 0 && (
                                    <div className="recommendation-card">
                                        <h4 className="rec-card-title">
                                            <span className="rec-icon">🌱</span>
                                            Alternative Crop Suggestions
                                        </h4>
                                        <div className="crops-grid">
                                            {recommendations.crops.map((crop, idx) => (
                                                <div key={idx} className="crop-suggestion-card">
                                                    <div className="crop-img-placeholder">
                                                        <img 
                                                            src={`https://source.unsplash.com/200x150/?${crop.name},crop`}
                                                            alt={crop.name}
                                                            onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=Crop'}
                                                        />
                                                    </div>
                                                    <div className="crop-info">
                                                        <h5 className="crop-suggestion-name">{crop.name}</h5>
                                                        {crop.yield && (
                                                            <p className="crop-yield">
                                                                <strong>Yield:</strong> {crop.yield}
                                                            </p>
                                                        )}
                                                        {crop.suitability && (
                                                            <span className={`suitability-badge ${crop.suitability.toLowerCase()}`}>
                                                                {crop.suitability}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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
                    </>
                )}

                {/* Chat Assistant - Show when prediction is available */}
                {predictedCrop && !showHistory && (
                    <CropChatbot 
                        predictionContext={{
                            predictedCrop,
                            N: formData.N,
                            P: formData.P,
                            K: formData.K,
                            ph: formData.ph,
                            temperature: formData.temperature,
                            humidity: formData.humidity,
                            rainfall: formData.rainfall
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default CropPredictionForm;
