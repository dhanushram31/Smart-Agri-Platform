import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FarmList.css';

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    initEnhancements();
    fetchFarms();
  }, []);

  const initEnhancements = () => {
    // Add search animation
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      searchInput.addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focused');
      });
    }

    // Add scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.farm-card').forEach(card => {
        observer.observe(card);
      });
    }, 100);
  };

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5002/api/farms');
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.crop_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || farm.crop_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const cropTypes = [...new Set(farms.map(f => f.crop_type).filter(Boolean))];

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="farm-list-container">
      {/* Floating Shapes Background */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header Section */}
      <div className="farm-list-header">
        <div className="header-content">
          <div className="header-icon">🌾</div>
          <h2 className="farm-list-title">My Farms</h2>
          <p className="farm-list-subtitle">
            Manage and monitor all your agricultural properties
          </p>
        </div>
        <button 
          className="add-farm-btn"
          onClick={() => navigate('/farms/add')}
        >
          <span className="btn-icon">➕</span>
          <span>Add New Farm</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="controls-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by location or crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Farms
          </button>
          {cropTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚜</div>
          <div className="stat-content">
            <div className="stat-value">{farms.length}</div>
            <div className="stat-label">Total Farms</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <div className="stat-value">{cropTypes.length}</div>
            <div className="stat-label">Crop Types</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div className="stat-content">
            <div className="stat-value">
              {farms.reduce((acc, f) => acc + (parseFloat(f.size) || 0), 0).toFixed(1)}
            </div>
            <div className="stat-label">Total Acres</div>
          </div>
        </div>
      </div>

      {/* Farm Cards Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your farms...</p>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏡</div>
          <h3>No Farms Found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first farm!'}</p>
          <button className="empty-action-btn" onClick={() => navigate('/farms/add')}>
            <span>➕</span>
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="farms-grid">
          {filteredFarms.map((farm, index) => (
            <div 
              key={farm._id} 
              className="farm-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="farm-card-header">
                <div className="farm-badge">{farm.crop_type || 'Unknown'}</div>
                <div className="farm-actions">
                  <button className="action-btn" title="Edit">✏️</button>
                </div>
              </div>
              
              <div className="farm-card-body">
                <h3 className="farm-card-title">
                  <span className="location-icon">📍</span>
                  {farm.location || 'Unknown Location'}
                </h3>
                
                <div className="farm-details-grid">
                  <div className="detail-item">
                    <span className="detail-icon">🌾</span>
                    <div className="detail-content">
                      <span className="detail-label">Crop</span>
                      <span className="detail-value">{farm.crop_type || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📏</span>
                    <div className="detail-content">
                      <span className="detail-label">Size</span>
                      <span className="detail-value">{farm.size || 'N/A'} acres</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🪨</span>
                    <div className="detail-content">
                      <span className="detail-label">Soil</span>
                      <span className="detail-value">{farm.soil_type || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <div className="detail-content">
                      <span className="detail-label">Irrigation</span>
                      <span className="detail-value">{farm.irrigation_system || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="farm-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    Planted: {formatDate(farm.planting_schedule)}
                  </span>
                </div>
              </div>
              
              <div className="farm-card-footer">
                <Link 
                  to={`/farmDetails/${farm._id}`} 
                  className="view-details-btn"
                >
                  <span>View Dashboard</span>
                  <span className="arrow-icon">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmList;
