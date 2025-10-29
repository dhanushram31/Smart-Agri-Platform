import React, { useState } from 'react';
import AnimalDetectionDashboard from './AnimalDetectionDashboard';
import VideoUpload from './VideoUpload';
import LiveStreaming from './LiveStreaming';
import AnalyticsDashboard from './AnalyticsDashboard';
import './AnimalDetection.css';

const AnimalDetection = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'upload', label: 'Upload Video', icon: '📹' },
    { id: 'live', label: 'Live Stream', icon: '📡' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnimalDetectionDashboard />;
      case 'upload':
        return <VideoUpload />;
      case 'live':
        return <LiveStreaming />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <AnimalDetectionDashboard />;
    }
  };

  return (
    <div className="animal-detection-main">
      {/* Navigation Header */}
      <nav className="animal-detection-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🚜</span>
            <h1 className="brand-title">Animal Detection System</h1>
          </div>
          
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-status">
            <div className="status-indicator online">
              <span className="status-dot"></span>
              <span className="status-text">API Connected</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="animal-detection-content">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default AnimalDetection;