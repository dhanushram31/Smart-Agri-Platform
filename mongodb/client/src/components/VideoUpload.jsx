import React, { useState, useRef, useCallback } from 'react';
import './VideoUpload.css';

const VideoUpload = () => {
  const [uploadState, setUploadState] = useState({
    isDragging: false,
    isUploading: false,
    progress: 0,
    selectedFile: null,
    results: null,
    error: null,
    processingStage: null, // 'uploading', 'processing', 'completed', 'error'
    processingDetails: null // Real-time processing information
  });

  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropzoneRef.current?.contains(e.relatedTarget)) {
      setUploadState(prev => ({ ...prev, isDragging: false }));
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (!allowedTypes.includes(file.type)) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select a valid video file (MP4, AVI, MOV, WMV)'
      }));
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setUploadState(prev => ({
        ...prev,
        error: 'File size must be less than 100MB'
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      selectedFile: file,
      error: null,
      results: null
    }));
  };

  const uploadVideo = async () => {
    if (!uploadState.selectedFile) return;

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
      processingStage: 'uploading',
      processingDetails: null
    }));

    const formData = new FormData();
    formData.append('video', uploadState.selectedFile);

    try {
      const xhr = new XMLHttpRequest();
      let videoId = null;
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 50; // Upload is 50% of total progress
          setUploadState(prev => ({ 
            ...prev, 
            progress: percentComplete,
            processingStage: 'uploading'
          }));
        }
      });

      // Handle response
      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          // If we have video metadata, extract the video ID for progress tracking
          if (response.video_metadata && response.video_metadata.original_filename) {
            // Generate video ID based on the filename pattern from backend
            const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
            videoId = response.video_metadata.original_filename.replace(/\.[^/.]+$/, '') + '_' + timestamp;
            
            // Start processing progress tracking
            setUploadState(prev => ({
              ...prev,
              progress: 50,
              processingStage: 'processing'
            }));
            
            // Poll for processing progress
            await trackProcessingProgress(videoId, response);
          } else {
            // Fallback for immediate completion
            setUploadState(prev => ({
              ...prev,
              isUploading: false,
              progress: 100,
              processingStage: 'completed',
              results: response
            }));
          }
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setUploadState(prev => ({
            ...prev,
            isUploading: false,
            processingStage: 'error',
            error: errorResponse.error || 'Upload failed'
          }));
        }
      });

      xhr.addEventListener('error', () => {
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          processingStage: 'error',
          error: 'Network error occurred during upload'
        }));
      });

      xhr.open('POST', 'http://localhost:5003/api/upload_video');
      xhr.send(formData);

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        processingStage: 'error',
        error: error.message
      }));
    }
  };

  // New function to track processing progress
  const trackProcessingProgress = async (videoId, finalResponse) => {
    const maxAttempts = 300; // Max 5 minutes of polling (1 request per second)
    let attempts = 0;

    const pollProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5003/api/processing_progress/${videoId}`);
        
        if (response.ok) {
          const progressData = await response.json();
          
          setUploadState(prev => ({
            ...prev,
            progress: 50 + (progressData.progress_percentage * 0.5), // Processing is remaining 50%
            processingDetails: progressData,
            processingStage: progressData.status
          }));

          // Check if processing is complete
          if (progressData.status === 'completed') {
            setUploadState(prev => ({
              ...prev,
              isUploading: false,
              progress: 100,
              processingStage: 'completed',
              results: finalResponse,
              processingDetails: progressData
            }));
            return;
          } else if (progressData.status === 'error') {
            setUploadState(prev => ({
              ...prev,
              isUploading: false,
              processingStage: 'error',
              error: progressData.message || 'Processing failed'
            }));
            return;
          }
        } else if (response.status === 404) {
          // Processing might be completed before we started polling
          setUploadState(prev => ({
            ...prev,
            isUploading: false,
            progress: 100,
            processingStage: 'completed',
            results: finalResponse
          }));
          return;
        }

        // Continue polling if not completed and within limits
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollProgress, 1000); // Poll every second
        } else {
          // Timeout - assume completed
          setUploadState(prev => ({
            ...prev,
            isUploading: false,
            progress: 100,
            processingStage: 'completed',
            results: finalResponse
          }));
        }

      } catch (error) {
        console.warn('Progress polling error:', error);
        // On error, assume processing completed
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          progress: 100,
          processingStage: 'completed',
          results: finalResponse
        }));
      }
    };

    // Start polling after a short delay
    setTimeout(pollProgress, 1000);
  };

  const resetUpload = () => {
    setUploadState({
      isDragging: false,
      isUploading: false,
      progress: 0,
      selectedFile: null,
      results: null,
      error: null,
      processingStage: null,
      processingDetails: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getAnimalEmoji = (animal) => {
    const animalEmojis = {
      'cow': '🐄',
      'bull': '🐂', 
      'buffalo': '🐃',
      'goat': '🐐',
      'sheep': '🐑',
      'pig': '🐷',
      'horse': '🐎',
      'chicken': '🐓',
      'duck': '🦆',
      'dog': '🐕',
      'cat': '🐱',
      'elephant': '🐘',
      'tiger': '🐅',
      'lion': '🦁',
      'leopard': '🐆',
      'deer': '🦌',
      'rabbit': '🐰',
      'bird': '🐦',
      'monkey': '🐒',
      'bear': '🐻'
    };
    return animalEmojis[animal?.toLowerCase()] || '🐾';
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.9) return 'high';
    if (confidence >= 0.7) return 'medium';
    return 'low';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className="video-upload-container">
      {/* Header */}
      <div className="upload-header">
        <h1 className="upload-title">
          <span className="title-icon">📹</span>
          Video Upload & Analysis
        </h1>
        <p className="upload-subtitle">
          Upload farm surveillance videos for AI-powered animal detection analysis
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="upload-main">
        <div
          ref={dropzoneRef}
          className={`dropzone ${uploadState.isDragging ? 'dragging' : ''} ${
            uploadState.selectedFile ? 'has-file' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelection(e.target.files[0])}
            className="file-input"
          />

          {!uploadState.selectedFile ? (
            <div className="dropzone-content">
              <div className="upload-icon">
                {uploadState.isDragging ? '⬇️' : '📁'}
              </div>
              <h3>
                {uploadState.isDragging
                  ? 'Drop your video here'
                  : 'Choose video file or drag & drop'}
              </h3>
              <p>Supports MP4, AVI, MOV, WMV up to 100MB</p>
              <button type="button" className="browse-button">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <div className="file-icon">🎬</div>
                <div className="file-details">
                  <h4>{uploadState.selectedFile.name}</h4>
                  <p>{formatFileSize(uploadState.selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Upload/Processing Progress */}
        {uploadState.isUploading && (
          <div className="progress-section">
            <div className="progress-header">
              <span>
                {uploadState.processingStage === 'uploading' && '📤 Uploading video...'}
                {uploadState.processingStage === 'processing' && '🔍 Analyzing video for animals...'}
                {uploadState.processingStage === 'completed' && '✅ Analysis complete!'}
                {uploadState.processingStage === 'error' && '❌ Processing failed'}
              </span>
              <span>{Math.round(uploadState.progress)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadState.progress}%` }}
              ></div>
            </div>
            
            {/* Real-time Processing Details */}
            {uploadState.processingDetails && (
              <div className="processing-details">
                <div className="processing-stats">
                  <div className="stat-item">
                    <span className="stat-label">Frame:</span>
                    <span className="stat-value">
                      {uploadState.processingDetails.current_frame} / {uploadState.processingDetails.total_frames}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Detections:</span>
                    <span className="stat-value">{uploadState.processingDetails.detections_so_far}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Speed:</span>
                    <span className="stat-value">
                      {uploadState.processingDetails.processing_fps?.toFixed(1)} fps
                    </span>
                  </div>
                  {uploadState.processingDetails.estimated_time_remaining > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Time left:</span>
                      <span className="stat-value">
                        {Math.round(uploadState.processingDetails.estimated_time_remaining)}s
                      </span>
                    </div>
                  )}
                </div>
                <div className="processing-message">
                  {uploadState.processingDetails.message}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {uploadState.error && (
          <div className="error-section">
            <div className="error-content">
              <span className="error-icon">❌</span>
              <span>{uploadState.error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {uploadState.selectedFile && !uploadState.isUploading && (
            <button
              className="upload-button"
              onClick={uploadVideo}
              disabled={uploadState.isUploading}
            >
              <span className="button-icon">🚀</span>
              Start Analysis
            </button>
          )}
          {(uploadState.selectedFile || uploadState.results) && (
            <button className="reset-button" onClick={resetUpload}>
              <span className="button-icon">🔄</span>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {uploadState.results && (
        <div className="results-section">
          <h2 className="results-title">Detection Results</h2>
          
          {/* Summary Stats */}
          <div className="results-summary">
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-content">
                <h3>{uploadState.results.detections?.length || 0}</h3>
                <p>Total Detections</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🐾</div>
              <div className="summary-content">
                <h3>{(() => {
                  const uniqueAnimals = new Set(
                    (uploadState.results.detections || []).map(d => d.animal)
                  );
                  return uniqueAnimals.size;
                })()}</h3>
                <p>Animal Species</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⏱️</div>
              <div className="summary-content">
                <h3>{uploadState.results.processing_time ? 
                  `${Math.round(uploadState.results.processing_time)}s` : 'N/A'}</h3>
                <p>Processing Time</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{(() => {
                  const detections = uploadState.results.detections || [];
                  if (detections.length === 0) return 'N/A';
                  const avgConfidence = detections.reduce((sum, d) => sum + (d.confidence || 0), 0) / detections.length;
                  return `${(avgConfidence * 100).toFixed(1)}%`;
                })()}</h3>
                <p>Avg Confidence</p>
              </div>
            </div>
          </div>

          {/* Detected Animals */}
          {uploadState.results.detections && uploadState.results.detections.length > 0 && (
            <div className="detections-list">
              <h3 className="detections-title">
                🎯 Detected Animals ({uploadState.results.detections.length})
              </h3>
              
              {/* Animal Summary */}
              <div className="animal-summary">
                {(() => {
                  const animalCounts = {};
                  uploadState.results.detections.forEach(detection => {
                    const animal = detection.animal || 'Unknown';
                    animalCounts[animal] = (animalCounts[animal] || 0) + 1;
                  });
                  
                  return Object.entries(animalCounts).map(([animal, count]) => (
                    <div key={animal} className="animal-count-badge">
                      <span className="animal-icon">{getAnimalEmoji(animal)}</span>
                      <span className="animal-name">{animal}</span>
                      <span className="count-badge">{count}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* Detection Timeline */}
              <div className="detections-timeline">
                <h4 className="timeline-title">Detection Timeline</h4>
                <div className="timeline-container">
                  {uploadState.results.detections
                    .sort((a, b) => (a.frame_number || 0) - (b.frame_number || 0))
                    .map((detection, index) => (
                    <div key={index} className={`detection-timeline-item ${getPriorityColor(detection.priority)}`}>
                      <div className="timeline-marker">
                        <span className="timeline-icon">{getAnimalEmoji(detection.animal)}</span>
                      </div>
                      <div className="timeline-content">
                        <div className="detection-main-info">
                          <h5 className="animal-name">{detection.animal || 'Unknown Animal'}</h5>
                          <div className="detection-meta">
                            <span className={`confidence-badge confidence-${getConfidenceLevel(detection.confidence)}`}>
                              {(detection.confidence * 100).toFixed(1)}% confident
                            </span>
                            {detection.priority && (
                              <span className={`priority-tag ${getPriorityColor(detection.priority)}`}>
                                {detection.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="detection-timing">
                          {detection.timestamp && (
                            <span className="timestamp">⏰ {formatTimestamp(detection.timestamp)}</span>
                          )}
                          {detection.frame_number && (
                            <span className="frame-info">🎬 Frame {detection.frame_number}</span>
                          )}
                        </div>
                        {detection.bbox && (
                          <div className="bbox-info">
                            📍 Position: ({Math.round(detection.bbox.x)}, {Math.round(detection.bbox.y)}) 
                            📏 Size: {Math.round(detection.bbox.width)}×{Math.round(detection.bbox.height)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download Links */}
          {(uploadState.results.processed_video || uploadState.results.processed_video_url) && (
            <div className="download-section">
              <h3>📥 Download Results</h3>
              <div className="download-buttons">
                <a
                  href={uploadState.results.processed_video_url || 
                    `http://localhost:5003/static/processed/${uploadState.results.processed_video}`}
                  download={uploadState.results.processed_video}
                  className="download-button video-download"
                >
                  <span className="button-icon">🎬</span>
                  Download Processed Video
                </a>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(uploadState.results, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'detection-report.json';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="download-button report-download"
                >
                  <span className="button-icon">📊</span>
                  Download Detection Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
