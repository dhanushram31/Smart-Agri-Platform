"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import TodoList from "./TodoList"
import FinancialTracker from "./FinancialTracker"
import Notepad from "./Notepad"
import "./FarmDetails.css"

const FarmDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [farm, setFarm] = useState(null)
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('todo')

  useEffect(() => {
    initEnhancements()
    
    if (id) {
      // Fetch single farm by ID
      const fetchFarm = async () => {
        try {
          setLoading(true)
          setError(null)
          const res = await axios.get(`http://localhost:5002/api/farms/${id}`)
          setFarm(res.data)
        } catch (error) {
          console.error("Error fetching farm details:", error)
          setError("Failed to load farm details. Please try again.")
        } finally {
          setLoading(false)
        }
      }
      fetchFarm()
    } else {
      // Fetch all farms
      const fetchFarms = async () => {
        try {
          setLoading(true)
          setError(null)
          const res = await axios.get("http://localhost:5002/api/farms/")
          setFarms(res.data)
        } catch (error) {
          console.error("Error fetching farms:", error)
          setError("Failed to load farms. Please try again.")
        } finally {
          setLoading(false)
        }
      }
      fetchFarms()
    }
  }, [id])

  const initEnhancements = () => {
    // Add tab switch animations
    const handleTabClick = () => {
      const content = document.querySelector('.dashboard-content')
      if (content) {
        content.style.animation = 'none'
        setTimeout(() => {
          content.style.animation = 'fadeSlideIn 0.4s ease-out'
        }, 10)
      }
    }

    // Add ripple effect to buttons
    const addRipple = (e) => {
      const button = e.currentTarget
      const ripple = document.createElement('span')
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
      `

      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }

    setTimeout(() => {
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', handleTabClick)
      })
      
      document.querySelectorAll('.add-button, .back-button').forEach(btn => {
        btn.addEventListener('click', addRipple)
      })
    }, 100)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatValue = (value) => {
    return value || "Not specified"
  }

  if (loading) {
    return (
      <div className="farm-detail-container">
        {/* Floating Shapes Background */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading farm details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="farm-detail-container">
        {/* Floating Shapes Background */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            <span className="btn-icon">🔄</span>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Single farm view
  if (id && farm) {
    return (
      <div className="farm-detail-container">
        {/* Floating Shapes Background */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        {/* Header Section */}
        <div className="farm-detail-header">
          <div className="header-content">
            <div className="header-icon">🏡</div>
            <div className="header-text">
              <h2 className="farm-detail-title">Farm Management Dashboard</h2>
              <p className="farm-detail-subtitle">
                {farm.location} • {farm.crop_type} • {farm.size} acres
              </p>
            </div>
          </div>
          <button className="back-button" onClick={() => navigate('/farms')}>
            <span className="btn-icon">←</span>
            <span>Back to Farms</span>
          </button>
        </div>

        {/* Farm Information Cards */}
        <div className="farm-info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">📍</span>
              <h3>Location</h3>
            </div>
            <p className="info-value">{formatValue(farm.location)}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">🌾</span>
              <h3>Crop Type</h3>
            </div>
            <p className="info-value">{formatValue(farm.crop_type)}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">📏</span>
              <h3>Farm Size</h3>
            </div>
            <p className="info-value">{formatValue(farm.size)} acres</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">📅</span>
              <h3>Planting Date</h3>
            </div>
            <p className="info-value">{formatDate(farm.planting_schedule)}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">🪨</span>
              <h3>Soil Type</h3>
            </div>
            <p className="info-value">{formatValue(farm.soil_type)}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon">💧</span>
              <h3>Irrigation</h3>
            </div>
            <p className="info-value">{formatValue(farm.irrigation_system)}</p>
          </div>
        </div>

        {/* Interactive Farm Management Dashboard */}
        <div className="interactive-dashboard">
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
              aria-label="Farm ToDo List"
            >
              <span className="tab-icon">✓</span>
              <span className="tab-label">Tasks</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
              aria-label="Financial Tracker"
            >
              <span className="tab-icon">₹</span>
              <span className="tab-label">Finance</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'notepad' ? 'active' : ''}`}
              onClick={() => setActiveTab('notepad')}
              aria-label="Farm Notepad"
            >
              <span className="tab-icon">📝</span>
              <span className="tab-label">Notes</span>
            </button>
          </div>
          
          <div className="dashboard-content">
            <div className={`tab-panel ${activeTab === 'todo' ? 'active' : ''}`}>
              {activeTab === 'todo' && (
                <TodoList farmId={farm._id} />
              )}
            </div>
            <div className={`tab-panel ${activeTab === 'financial' ? 'active' : ''}`}>
              {activeTab === 'financial' && (
                <FinancialTracker 
                  farmId={farm._id} 
                  farmName={`${farm.location} - ${farm.crop_type}`}
                  farmLocation={farm.location}
                />
              )}
            </div>
            <div className={`tab-panel ${activeTab === 'notepad' ? 'active' : ''}`}>
              {activeTab === 'notepad' && (
                <Notepad 
                  farmId={farm._id}
                  farmName={`${farm.location} - ${farm.crop_type}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // All farms view
  if (!id && farms.length > 0) {
    return (
      <div className="farm-details-container">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="farm-detail-header">
          <div className="header-content">
            <span className="header-icon">🌾</span>
            <div className="header-text">
              <h2 className="farm-detail-title">All Farms ({farms.length})</h2>
              <p className="farm-detail-subtitle">Manage all your agricultural operations</p>
            </div>
          </div>
          <button className="back-button" onClick={() => navigate('/farms')}>
            <span className="btn-icon">←</span>
            <span>Back to Farm List</span>
          </button>
        </div>

        <div className="all-farms-view">
          <div className="farms-grid">
            {farms.map((f, index) => (
              <div 
                key={f._id} 
                className="farm-card" 
                style={{ '--card-index': index }}
                onClick={() => navigate(`/farmDetails/${f._id}`)}
              >
                <h3>
                  <span>📍</span>
                  {formatValue(f.location)}
                </h3>
                <p>
                  <strong>Crop Type:</strong> {formatValue(f.crop_type)}
                </p>
                <p>
                  <strong>Size:</strong> {formatValue(f.size)} acres
                </p>
                <p>
                  <strong>Planting Date:</strong> {formatDate(f.planting_schedule)}
                </p>
                <p>
                  <strong>Soil Type:</strong> {formatValue(f.soil_type)}
                </p>
                <p>
                  <strong>Irrigation:</strong> {formatValue(f.irrigation_system)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // No farms found
  return (
    <div className="farm-details-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="no-farms-view">
        <div className="empty-state">
          <div className="empty-icon">🏡</div>
          <h3>No Farms Yet</h3>
          <p>Start your agricultural journey by adding your first farm!</p>
          <button className="empty-action-btn" onClick={() => navigate('/addFarm')}>
            <span>+</span>
            <span>Add Your First Farm</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FarmDetails
