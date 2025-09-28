import React, { useState, useEffect, useRef } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalDetections: 0,
    uniqueAnimals: 0,
    detectionHistory: [],
    animalFrequency: [],
    recentDetections: [],
    timePatterns: [],
    alertsSent: 0
  });

  const [filters, setFilters] = useState({
    dateRange: '7', // days
    animalType: 'all',
    priority: 'all'
  });

  const [isLoading, setIsLoading] = useState(true);
  const chartRefs = {
    detectionChart: useRef(null),
    animalChart: useRef(null),
    timeChart: useRef(null)
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  useEffect(() => {
    if (analyticsData.detectionHistory.length > 0) {
      renderCharts();
    }
  }, [analyticsData]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        days: filters.dateRange,
        animal: filters.animalType,
        priority: filters.priority
      });

      const response = await fetch(`http://localhost:5003/api/detection_statistics?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData({
          totalDetections: data.total_detections || 0,
          uniqueAnimals: data.unique_animals || 0,
          detectionHistory: data.detection_history || [],
          animalFrequency: data.animal_frequency || [],
          recentDetections: data.recent_detections || [],
          timePatterns: data.time_patterns || [],
          alertsSent: data.alerts_sent || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharts = () => {
    // Detection History Chart (Line Chart)
    renderDetectionHistoryChart();
    // Animal Frequency Chart (Doughnut Chart)
    renderAnimalFrequencyChart();
    // Time Patterns Chart (Bar Chart)
    renderTimePatternsChart();
  };

  const renderDetectionHistoryChart = () => {
    const canvas = chartRefs.detectionChart.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { detectionHistory } = analyticsData;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detectionHistory.length === 0) return;

    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Find max value
    const maxDetections = Math.max(...detectionHistory.map(d => d.count), 1);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const stepX = chartWidth / (detectionHistory.length - 1);
    for (let i = 0; i < detectionHistory.length; i++) {
      const x = padding + stepX * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw line chart
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();

    detectionHistory.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (point.count / maxDetections) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#dc2626';
    detectionHistory.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (point.count / maxDetections) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels (dates)
    detectionHistory.forEach((point, index) => {
      const x = padding + stepX * index;
      const date = new Date(point.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      ctx.fillText(date, x, canvas.height - 20);
    });

    // Y-axis labels (counts)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      const value = Math.round(maxDetections * (5 - i) / 5);
      ctx.fillText(value.toString(), padding - 15, y + 4);
    }

    // Chart title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Detection History', canvas.width / 2, 30);
  };

  const renderAnimalFrequencyChart = () => {
    const canvas = chartRefs.animalChart.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { animalFrequency } = analyticsData;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (animalFrequency.length === 0) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 10;
    const radius = Math.min(centerX, centerY) - 40;

    const total = animalFrequency.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = -Math.PI / 2;

    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', 
      '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    // Draw pie slices
    animalFrequency.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw stroke
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw legend
    const legendStartY = 20;
    animalFrequency.forEach((item, index) => {
      const color = colors[index % colors.length];
      const y = legendStartY + index * 20;

      // Color box
      ctx.fillStyle = color;
      ctx.fillRect(20, y, 15, 15);

      // Text
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.animal} (${item.count})`, 45, y + 12);
    });

    // Chart title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Animal Frequency', canvas.width / 2, canvas.height - 10);
  };

  const renderTimePatternsChart = () => {
    const canvas = chartRefs.timeChart.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { timePatterns } = analyticsData;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timePatterns.length === 0) return;

    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Find max value
    const maxCount = Math.max(...timePatterns.map(t => t.count), 1);
    const barWidth = chartWidth / timePatterns.length * 0.8;
    const barSpacing = chartWidth / timePatterns.length * 0.2;

    // Draw bars
    timePatterns.forEach((pattern, index) => {
      const barHeight = (pattern.count / maxCount) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = padding + chartHeight - barHeight;

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1d4ed8');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar stroke
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Value on top
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pattern.count.toString(), x + barWidth / 2, y - 5);

      // Hour label
      ctx.fillText(pattern.hour + ':00', x + barWidth / 2, canvas.height - 20);
    });

    // Chart title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Hourly Detection Patterns', canvas.width / 2, 30);
  };

  const exportData = (format) => {
    const dataToExport = {
      summary: {
        totalDetections: analyticsData.totalDetections,
        uniqueAnimals: analyticsData.uniqueAnimals,
        alertsSent: analyticsData.alertsSent,
        reportDate: new Date().toISOString()
      },
      detectionHistory: analyticsData.detectionHistory,
      animalFrequency: analyticsData.animalFrequency,
      recentDetections: analyticsData.recentDetections,
      timePatterns: analyticsData.timePatterns
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      downloadFile(blob, 'animal_detection_report.json');
    } else if (format === 'csv') {
      const csv = convertToCSV(analyticsData.recentDetections);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, 'animal_detection_report.csv');
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return 'No data available';

    const headers = ['Date', 'Time', 'Animal', 'Priority', 'Confidence', 'Location'];
    const rows = data.map(detection => [
      new Date(detection.timestamp).toLocaleDateString(),
      new Date(detection.timestamp).toLocaleTimeString(),
      detection.animal,
      detection.priority,
      (detection.confidence * 100).toFixed(1) + '%',
      detection.location || 'N/A'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <h1 className="analytics-title">
          <span className="title-icon">📊</span>
          Detection Analytics
        </h1>
        <p className="analytics-subtitle">
          Comprehensive analysis of animal detection patterns and statistics
        </p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="dateRange">Date Range</label>
          <select
            id="dateRange"
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="filter-select"
          >
            <option value="1">Last 24 Hours</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="animalType">Animal Type</label>
          <select
            id="animalType"
            value={filters.animalType}
            onChange={(e) => setFilters(prev => ({ ...prev, animalType: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Animals</option>
            <option value="wild_boar">Wild Boar</option>
            <option value="elephant">Elephant</option>
            <option value="nilgai">Nilgai</option>
            <option value="monkey">Monkey</option>
            <option value="deer">Deer</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority">Priority Level</label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>{analyticsData.totalDetections}</h3>
            <p>Total Detections</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🐾</div>
          <div className="card-content">
            <h3>{analyticsData.uniqueAnimals}</h3>
            <p>Unique Animals</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📧</div>
          <div className="card-content">
            <h3>{analyticsData.alertsSent}</h3>
            <p>Alerts Sent</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>{filters.dateRange}</h3>
            <p>Days Period</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <canvas
            ref={chartRefs.detectionChart}
            width={600}
            height={300}
            className="analytics-chart"
          />
        </div>

        <div className="chart-container">
          <canvas
            ref={chartRefs.animalChart}
            width={400}
            height={300}
            className="analytics-chart"
          />
        </div>

        <div className="chart-container full-width">
          <canvas
            ref={chartRefs.timeChart}
            width={800}
            height={300}
            className="analytics-chart"
          />
        </div>
      </div>

      {/* Recent Detections Table */}
      <div className="detections-table">
        <div className="table-header">
          <h3>Recent Detections</h3>
          <div className="export-buttons">
            <button
              className="export-button csv-button"
              onClick={() => exportData('csv')}
            >
              📄 Export CSV
            </button>
            <button
              className="export-button json-button"
              onClick={() => exportData('json')}
            >
              📋 Export JSON
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Animal</th>
                <th>Priority</th>
                <th>Confidence</th>
                <th>Alert Sent</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.recentDetections.length > 0 ? (
                analyticsData.recentDetections.slice(0, 20).map((detection, index) => (
                  <tr key={index}>
                    <td>
                      <div className="datetime-cell">
                        <div className="date">
                          {new Date(detection.timestamp).toLocaleDateString()}
                        </div>
                        <div className="time">
                          {new Date(detection.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="animal-cell">
                        <span className="animal-emoji">{detection.emoji || '🐾'}</span>
                        <span>{detection.animal}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityColor(detection.priority)}`}>
                        {detection.priority}
                      </span>
                    </td>
                    <td className="confidence-cell">
                      {(detection.confidence * 100).toFixed(1)}%
                    </td>
                    <td>
                      <span className={`alert-status ${detection.alert_sent ? 'sent' : 'not-sent'}`}>
                        {detection.alert_sent ? '✅ Sent' : '❌ Not Sent'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No detections found for the selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
