import React, { useState, useEffect, useRef } from 'react';
import './LiveStreaming.css';

const LiveStreaming = () => {
  const [streamState, setStreamState] = useState({
    isConnected: false,
    isStreaming: false,
    rtspUrl: '',
    detections: [],
    stats: {
      totalDetections: 0,
      currentFPS: 0,
      streamDuration: 0,
      lastDetection: null
    },
    error: null,
    connectionStatus: 'disconnected'
  });

  const videoRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopStream();
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const startStream = async () => {
    if (!streamState.rtspUrl.trim()) {
      setStreamState(prev => ({
        ...prev,
        error: 'Please enter a valid RTSP URL'
      }));
      return;
    }

    setStreamState(prev => ({
      ...prev,
      isConnected: true,
      error: null,
      connectionStatus: 'connecting'
    }));

    try {
      const response = await fetch('http://localhost:5003/api/start_live_stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rtsp_url: streamState.rtspUrl,
          duration: 3600 // 1 hour default
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        setStreamState(prev => ({
          ...prev,
          isStreaming: true,
          connectionStatus: 'connected',
          stats: { ...prev.stats, streamDuration: 0 }
        }));

        // Start video feed
        if (videoRef.current) {
          videoRef.current.src = 'http://localhost:5003/video_feed';
        }

        // Start polling for stats
        startStatsPolling();
        startDurationTimer();

      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start stream');
      }

    } catch (error) {
      setStreamState(prev => ({
        ...prev,
        isConnected: false,
        isStreaming: false,
        connectionStatus: 'error',
        error: error.message
      }));
    }
  };

  const stopStream = async () => {
    try {
      await fetch('http://localhost:5003/api/stop_live_stream', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error stopping stream:', error);
    }

    setStreamState(prev => ({
      ...prev,
      isConnected: false,
      isStreaming: false,
      connectionStatus: 'disconnected'
    }));

    if (videoRef.current) {
      videoRef.current.src = '';
    }

    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const startStatsPolling = () => {
    statsIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5003/api/live_stream_stats');
        if (response.ok) {
          const stats = await response.json();
          setStreamState(prev => ({
            ...prev,
            detections: stats.recent_detections || [],
            stats: {
              ...prev.stats,
              totalDetections: stats.total_detections || 0,
              currentFPS: stats.current_fps || 0,
              lastDetection: stats.last_detection || null
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching stream stats:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const startDurationTimer = () => {
    const startTime = Date.now();
    durationIntervalRef.current = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setStreamState(prev => ({
        ...prev,
        stats: { ...prev.stats, streamDuration: duration }
      }));
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'status-connected';
      case 'connecting': return 'status-connecting';
      case 'error': return 'status-error';
      default: return 'status-disconnected';
    }
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

  return (
    <div className="live-streaming-container">
      {/* Header */}
      <div className="streaming-header">
        <h1 className="streaming-title">
          <span className="title-icon">📡</span>
          Live Animal Detection
        </h1>
        <p className="streaming-subtitle">
          Connect to CCTV cameras and RTSP streams for real-time animal monitoring
        </p>
      </div>

      <div className="streaming-content">
        {/* Control Panel */}
        <div className="control-panel">
          <div className="connection-controls">
            <h3>Stream Configuration</h3>
            
            <div className="input-group">
              <label htmlFor="rtspUrl">RTSP URL</label>
              <input
                id="rtspUrl"
                type="text"
                value={streamState.rtspUrl}
                onChange={(e) => setStreamState(prev => ({ ...prev, rtspUrl: e.target.value }))}
                placeholder="rtsp://username:password@camera_ip:port/stream"
                className="rtsp-input"
                disabled={streamState.isStreaming}
              />
              <small className="input-hint">
                Example: rtsp://admin:password@192.168.1.100:554/live/main
              </small>
            </div>

            <div className="control-buttons">
              {!streamState.isStreaming ? (
                <button
                  className="start-button"
                  onClick={startStream}
                  disabled={streamState.isConnected && !streamState.isStreaming}
                >
                  <span className="button-icon">▶️</span>
                  {streamState.isConnected ? 'Connecting...' : 'Start Stream'}
                </button>
              ) : (
                <button
                  className="stop-button"
                  onClick={stopStream}
                >
                  <span className="button-icon">⏹️</span>
                  Stop Stream
                </button>
              )}
            </div>

            {/* Connection Status */}
            <div className={`connection-status ${getStatusColor(streamState.connectionStatus)}`}>
              <div className="status-indicator"></div>
              <span className="status-text">
                {streamState.connectionStatus.charAt(0).toUpperCase() + streamState.connectionStatus.slice(1)}
              </span>
            </div>

            {/* Error Display */}
            {streamState.error && (
              <div className="error-display">
                <span className="error-icon">❌</span>
                <span>{streamState.error}</span>
              </div>
            )}
          </div>

          {/* Stream Statistics */}
          <div className="stream-stats">
            <h3>Stream Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-value">{streamState.stats.totalDetections}</span>
                  <span className="stat-label">Detections</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-value">{streamState.stats.currentFPS}</span>
                  <span className="stat-label">FPS</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <span className="stat-value">{formatDuration(streamState.stats.streamDuration)}</span>
                  <span className="stat-label">Duration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Feed */}
        <div className="video-section">
          <div className="video-container">
            {streamState.isStreaming ? (
              <>
                <img
                  ref={videoRef}
                  alt="Live Stream"
                  className="video-feed"
                  onError={() => {
                    setStreamState(prev => ({
                      ...prev,
                      error: 'Failed to load video stream'
                    }));
                  }}
                />
                <div className="video-overlay">
                  <div className="live-indicator">
                    <span className="live-dot"></span>
                    LIVE
                  </div>
                </div>
              </>
            ) : (
              <div className="video-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">📹</div>
                  <h3>No Stream Active</h3>
                  <p>Configure and start an RTSP stream to begin monitoring</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Detections */}
          {streamState.detections.length > 0 && (
            <div className="recent-detections">
              <h3>Recent Detections</h3>
              <div className="detections-list">
                {streamState.detections.slice(0, 5).map((detection, index) => (
                  <div key={index} className={`detection-item ${getPriorityColor(detection.priority)}`}>
                    <div className="detection-emoji">{detection.emoji || '🐾'}</div>
                    <div className="detection-details">
                      <div className="detection-name">{detection.animal}</div>
                      <div className="detection-meta">
                        <span className={`priority-tag ${getPriorityColor(detection.priority)}`}>
                          {detection.priority}
                        </span>
                        <span className="detection-time">{detection.timestamp}</span>
                      </div>
                      <div className="detection-confidence">
                        Confidence: {(detection.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Presets */}
      <div className="camera-presets">
        <h3>Camera Presets</h3>
        <p className="presets-description">
          Quick configuration for common camera setups
        </p>
        <div className="presets-grid">
          <div
            className="preset-card"
            onClick={() => {
              if (!streamState.isStreaming) {
                setStreamState(prev => ({
                  ...prev,
                  rtspUrl: 'rtsp://admin:admin@192.168.1.100:554/live/main'
                }));
              }
            }}
          >
            <div className="preset-icon">📷</div>
            <div className="preset-info">
              <h4>Generic Camera</h4>
              <p>Standard RTSP camera configuration</p>
            </div>
          </div>

          <div
            className="preset-card"
            onClick={() => {
              if (!streamState.isStreaming) {
                setStreamState(prev => ({
                  ...prev,
                  rtspUrl: 'rtsp://admin:password@192.168.1.101:554/cam/realmonitor?channel=1&subtype=0'
                }));
              }
            }}
          >
            <div className="preset-icon">🎥</div>
            <div className="preset-info">
              <h4>Dahua Camera</h4>
              <p>Dahua IP camera format</p>
            </div>
          </div>

          <div
            className="preset-card"
            onClick={() => {
              if (!streamState.isStreaming) {
                setStreamState(prev => ({
                  ...prev,
                  rtspUrl: 'rtsp://admin:password@192.168.1.102:554/h264/ch1/main/av_stream'
                }));
              }
            }}
          >
            <div className="preset-icon">📹</div>
            <div className="preset-info">
              <h4>Hikvision Camera</h4>
              <p>Hikvision IP camera format</p>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Help */}
      <div className="setup-help">
        <h3>Setup Instructions</h3>
        <div className="help-content">
          <div className="help-section">
            <h4>📋 RTSP URL Format</h4>
            <p>rtsp://[username]:[password]@[ip_address]:[port]/[path]</p>
          </div>
          <div className="help-section">
            <h4>🔧 Common Ports</h4>
            <p>Default RTSP port is 554, but some cameras use 8554 or custom ports</p>
          </div>
          <div className="help-section">
            <h4>🔐 Authentication</h4>
            <p>Ensure camera credentials are correct and RTSP is enabled</p>
          </div>
          <div className="help-section">
            <h4>🌐 Network</h4>
            <p>Camera and server must be on same network or have proper routing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreaming;
