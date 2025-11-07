import React, { useState, useRef, useCallback, useMemo } from 'react';
import './SoilReportAnalysis.css';
import ExtractedParametersDisplay from './ExtractedParametersDisplay';

const SoilReportAnalysis = ({ onExtractedData }) => {
    const [file, setFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Memoized file validation constants
    const FILE_CONSTRAINTS = useMemo(() => ({
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png']
    }), []);

    // Optimized file validation with detailed feedback
    const validateFile = useCallback((file) => {
        if (!file) return 'Please select a file';
        
        if (file.size > FILE_CONSTRAINTS.maxSize) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            return `File too large (${sizeMB}MB). Maximum size is 5MB`;
        }
        
        if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type)) {
            return `Invalid file type. Only PDF, JPG, and PNG files are supported`;
        }
        
        return null;
    }, [FILE_CONSTRAINTS]);

    // Handle file selection
    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    }, []);

    // Optimized file processing
    const processFile = useCallback((selectedFile) => {
        // Clear previous states
        setError(null);
        setSuccess(null);
        setExtractedData(null);
        setUploadProgress(0);
        
        const validationError = validateFile(selectedFile);
        if (validationError) {
            setError(validationError);
            setFile(null);
            return;
        }

        setFile(selectedFile);
        console.log('✅ File validated:', {
            name: selectedFile.name,
            size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
            type: selectedFile.type
        });
    }, [validateFile]);

    // Optimized drag and drop handlers with useCallback
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    // Enhanced file removal with cleanup
    const removeFile = useCallback(() => {
        // Cancel any ongoing extraction
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        setFile(null);
        setExtractedData(null);
        setError(null);
        setSuccess(null);
        setUploadProgress(0);
        setExtracting(false);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        console.log('🗑️ File removed and state cleaned');
    }, []);

    // Optimized file reading with progress tracking
    const readFileAsBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 50); // 50% for reading
                    setUploadProgress(progress);
                }
            };
            
            reader.onload = (e) => {
                setUploadProgress(50); // Reading complete
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsDataURL(file);
        });
    }, []);

    // Optimized API call with timeout and abort support
    const extractDataFromAPI = useCallback(async (reportData) => {
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        
        const timeoutId = setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }, 60000); // 60 second timeout

        try {
            setUploadProgress(60); // Starting API call
            
            const response = await fetch('http://localhost:5001/api/crops/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ soilReport: reportData }),
                signal: abortControllerRef.current.signal
            });

            clearTimeout(timeoutId);
            setUploadProgress(80); // API call complete

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
            }

            const result = await response.json();
            setUploadProgress(100); // Processing complete
            
            return result;
        } catch (err) {
            clearTimeout(timeoutId);
            
            if (err.name === 'AbortError') {
                throw new Error('Request timeout. The file might be too large or complex.');
            }
            throw err;
        }
    }, []);

    // Main optimized analyze function
    const analyzeFile = useCallback(async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setExtracting(true);
        setError(null);
        setSuccess(null);
        setUploadProgress(0);

        const startTime = performance.now();

        try {
            // Step 1: Read file (0-50% progress)
            console.log('📖 Reading file...');
            const fileData = await readFileAsBase64(file);

            const reportData = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: fileData
            };

            console.log('📤 Sending to API:', {
                fileName: reportData.fileName,
                size: `${(reportData.fileSize / 1024).toFixed(2)} KB`,
                dataLength: `${(fileData.length / 1024).toFixed(2)} KB (base64)`
            });

            // Step 2: Extract data via API (50-100% progress)
            const result = await extractDataFromAPI(reportData);

            console.log('✅ Extraction complete:', result);

            if (result.success && result.extracted_values) {
                const extractedVals = result.extracted_values;
                
                // Build display data object
                const displayData = {
                    N: extractedVals.N || '',
                    P: extractedVals.P || '',
                    K: extractedVals.K || '',
                    ph: extractedVals.ph || '',
                    temperature: extractedVals.temperature || '',
                    humidity: extractedVals.humidity || '',
                    rainfall: extractedVals.rainfall || ''
                };

                setExtractedData(displayData);
                
                // Count extracted parameters
                const extractedCount = Object.values(extractedVals).filter(
                    val => val !== undefined && val !== '' && val !== null
                ).length;
                
                // Pass data to parent component
                if (onExtractedData && typeof onExtractedData === 'function') {
                    onExtractedData(displayData);
                }

                const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                setSuccess(`✅ Successfully extracted ${extractedCount} parameter(s) in ${duration}s`);
                
                console.log(`⏱️ Analysis completed in ${duration}s`);
            } else {
                throw new Error('No data could be extracted from the report');
            }

        } catch (err) {
            console.error('❌ Analysis error:', err);
            
            // User-friendly error messages
            if (err.message.includes('timeout')) {
                setError('⚠️ Analysis timed out. Try a smaller or clearer file.');
            } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                setError('⚠️ Cannot connect to analysis server. Ensure Flask API is running on port 5001.');
            } else if (err.message.includes('No data')) {
                setError('⚠️ Could not extract data. Try a clearer image or different file format.');
            } else {
                setError(`⚠️ Analysis failed: ${err.message}`);
            }
            
            setUploadProgress(0);
        } finally {
            setExtracting(false);
            abortControllerRef.current = null;
        }
    }, [file, readFileAsBase64, extractDataFromAPI, onExtractedData]);

    return (
        <div className="soil-report-analysis-section">
            <div className="analysis-header">
                <span className="header-icon">📄</span>
                <h2>Upload Soil Test Report</h2>
            </div>

            <p className="analysis-description">
                Upload your soil test report (PDF, image, or text) and we'll automatically extract soil parameters
            </p>

            {/* File Upload Zone */}
            <div 
                className={`file-upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                
                {!file ? (
                    <div className="upload-prompt">
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                            <strong>Click to upload</strong> or drag and drop
                        </p>
                        <p className="upload-hint">
                            PDF, JPG, or PNG (max 5MB)
                        </p>
                    </div>
                ) : (
                    <div className="uploaded-file-info">
                        <div className="file-icon">
                            {file.type === 'application/pdf' ? '📄' : '🖼️'}
                        </div>
                        <div className="file-details">
                            <p className="file-name">{file.name}</p>
                            <p className="file-size">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="analysis-error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && !extracting && (
                <div className="analysis-success-message">
                    <span className="success-icon">✅</span>
                    {success}
                </div>
            )}

            {/* Enhanced Extracting State with Progress */}
            {extracting && (
                <div className="analysis-extracting">
                    <div className="extraction-content">
                        <div className="extraction-spinner"></div>
                        <div className="extraction-text">
                            <strong>Extracting data from soil report...</strong>
                            <br />
                            <small>
                                {uploadProgress < 50 ? 'Reading file...' :
                                 uploadProgress < 80 ? 'Analyzing with AI...' :
                                 uploadProgress < 100 ? 'Processing results...' :
                                 'Finalizing...'}
                            </small>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">{uploadProgress}%</div>
                    {uploadProgress > 0 && (
                        <button 
                            type="button"
                            className="cancel-extraction-btn"
                            onClick={removeFile}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}

            {/* Analyze Button */}
            {file && !extractedData && (
                <button 
                    className="analyze-btn"
                    onClick={analyzeFile}
                    disabled={extracting}
                >
                    {extracting ? (
                        <>
                            <span className="btn-spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span className="btn-icon">🔍</span>
                            Analyze Soil Report
                        </>
                    )}
                </button>
            )}

            {/* Extracted Parameters Display */}
            {extractedData && (
                <div className="analysis-results">
                    <ExtractedParametersDisplay 
                        extractedData={extractedData}
                        formData={extractedData}
                    />
                </div>
            )}
        </div>
    );
};

export default SoilReportAnalysis;
