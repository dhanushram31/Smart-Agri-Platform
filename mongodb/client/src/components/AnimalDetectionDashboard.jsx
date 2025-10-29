import React, { useState, useEffect } from 'react';
import './AnimalDetectionDashboard.css';

const AnimalDetectionDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalDetections: 0,
    activeStreams: 0,
    lastDetection: 'Never',
    systemStatus: 'Unknown'
  });

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/health');
      const healthData = await response.json();
      
      const statsResponse = await fetch('http://localhost:5003/api/detection_statistics');
      const statsData = await statsResponse.json();
      
      setSystemStats({
        totalDetections: statsData.total_detections || 0,
        activeStreams: healthData.active_streams || 0,
        lastDetection: statsData.last_detection || 'Never',
        systemStatus: healthData.status || 'Unknown'
      });
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const supportedAnimals = [
    { name: 'Wild Boar', emoji: '🐗', priority: 'Critical', threat: 'High crop damage' },
    { name: 'Elephant', emoji: '🐘', priority: 'Critical', threat: 'Massive destruction' },
    { name: 'Nilgai', emoji: '🦌', priority: 'High', threat: 'Persistent grazing' },
    { name: 'Monkey', emoji: '🐒', priority: 'High', threat: 'Fruit crop damage' },
    { name: 'Deer', emoji: '🦌', priority: 'Medium', threat: 'Selective grazing' },
    { name: 'Peacock', emoji: '🦚', priority: 'Low', threat: 'Minimal damage' },
    { name: 'Porcupine', emoji: '🦔', priority: 'Medium', threat: 'Root damage' },
    { name: 'Birds', emoji: '🐦', priority: 'Low', threat: 'Seed consumption' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'High': return 'border-orange-500 bg-orange-50';
      case 'Medium': return 'border-yellow-500 bg-yellow-50';
      case 'Low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="animal-detection-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-icon">🚜</span>
            Smart Farm Animal Detection
          </h1>
          <p className="subtitle">
            Advanced AI-powered animal detection system for Indian farms. Monitor your crops 24/7 with YOLOv8 technology and instant email alerts.
          </p>
        </div>
      </div>

 

      {/* Feature Cards */}
      <div className="features-grid">
        {/* Video Upload Feature */}
        <div className="feature-card video-upload">
          <div className="feature-header">
            <div className="feature-icon">📹</div>
            <div className="feature-info">
              <h3>Video Upload</h3>
              <p>Process recorded videos</p>
            </div>
          </div>
          <div className="feature-body">
            <p>Upload farm surveillance videos and get detailed analysis with bounding boxes and animal identification.</p>
            <button 
              className="feature-button upload-button"
              onClick={() => window.location.href = '/upload'}
            >
              Upload Video
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Live Stream Feature */}
        <div className="feature-card live-stream">
          <div className="feature-header">
            <div className="feature-icon">📡</div>
            <div className="feature-info">
              <h3>Live Streaming</h3>
              <p>Real-time monitoring</p>
            </div>
          </div>
          <div className="feature-body">
            <p>Connect CCTV cameras and RTSP streams for real-time animal detection and instant alerts.</p>
            <button 
              className="feature-button stream-button"
              onClick={() => window.location.href = '/live'}
            >
              Start Live Stream
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Analytics Feature */}
        <div className="feature-card analytics">
          <div className="feature-header">
            <div className="feature-icon">📊</div>
            <div className="feature-info">
              <h3>Analytics</h3>
              <p>Detection insights</p>
            </div>
          </div>
          <div className="feature-body">
            <p>View detection history, animal frequency charts, and download detailed reports.</p>
            <button 
              className="feature-button analytics-button"
              onClick={() => window.location.href = '/results'}
            >
              View Analytics
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supported Animals Section */}
      <div className="animals-section">
        <h2 className="section-title">Supported Farm Animals</h2>
        <div className="animals-grid">
          {supportedAnimals.map((animal, index) => (
            <div key={index} className={`animal-card ${getPriorityColor(animal.priority)}`}>
              <div className="animal-emoji">{animal.emoji}</div>
              <div className="animal-info">
                <h4 className="animal-name">{animal.name}</h4>
                <span className={`priority-badge priority-${animal.priority.toLowerCase()}`}>
                  {animal.priority}
                </span>
                <p className="animal-threat">{animal.threat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-button test-button" onClick={fetchSystemStats}>
            🔄 Refresh Status
          </button>
          <button 
            className="action-button email-button"
            onClick={() => alert('Email configuration can be set in the .env file')}
          >
            ✉️ Configure Alerts
          </button>
          <button 
            className="action-button help-button"
            onClick={() => window.open('/api/health', '_blank')}
          >
            🔧 API Health
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetectionDashboard;
