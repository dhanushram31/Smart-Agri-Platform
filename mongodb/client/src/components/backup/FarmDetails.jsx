"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import TodoList from "./TodoList"
import FinancialTracker from "./FinancialTracker"
import "./FarmDetails.css"

const FarmDetails = () => {
  const { id } = useParams()
  const [farm, setFarm] = useState(null)
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
        <div className="loading">Loading farm details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="farm-detail-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  // Single farm view
  if (id && farm) {
    return (
      <div className="farm-detail-container">
        <div className="header">
          <h2>Farm Management Dashboard</h2>
          <button className="add-button" onClick={() => window.history.back()}>
            ← Back to Farms
          </button>
        </div>

        <div className="farm-details">
          <p>
            <strong>Location:</strong>
            <span>{formatValue(farm.location)}</span>
          </p>
          <p>
            <strong>Crop Type:</strong>
            <span>{formatValue(farm.crop_type)}</span>
          </p>
          <p>
            <strong>Planting Schedule:</strong>
            <span>{formatDate(farm.planting_schedule)}</span>
          </p>
          <p>
            <strong>Soil Type:</strong>
            <span>{formatValue(farm.soil_type)}</span>
          </p>
          <p>
            <strong>Irrigation System:</strong>
            <span>{formatValue(farm.irrigation_system)}</span>
          </p>
          <p>
            <strong>Size (acres):</strong>
            <span>{formatValue(farm.size)}</span>
          </p>
        </div>

        {/* Farm Management Features */}
        <div className="farm-management-grid">
          <div className="management-section">
            <TodoList farmId={farm._id} />
          </div>
          <div className="management-section">
            <FinancialTracker 
              farmId={farm._id} 
              farmName={`${farm.location} - ${farm.crop_type}`}
              farmLocation={farm.location}
            />
          </div>
        </div>
      </div>
    )
  }

  // All farms view
  if (!id && farms.length > 0) {
    return (
      <div className="farm-detail-container">
        <div className="header">
          <h2>All Farms ({farms.length})</h2>
          <button className="add-button">+ Add New Farm</button>
        </div>

        <div className="farms-grid">
          {farms.map((f, index) => (
            <div key={f._id} className="farm-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <p>
                <strong>Location:</strong>
                <span>{formatValue(f.location)}</span>
              </p>
              <p>
                <strong>Crop Type:</strong>
                <span>{formatValue(f.crop_type)}</span>
              </p>
              <p>
                <strong>Planting Schedule:</strong>
                <span>{formatDate(f.planting_schedule)}</span>
              </p>
              <p>
                <strong>Soil Type:</strong>
                <span>{formatValue(f.soil_type)}</span>
              </p>
              <p>
                <strong>Irrigation System:</strong>
                <span>{formatValue(f.irrigation_system)}</span>
              </p>
              <p>
                <strong>Size (acres):</strong>
                <span>{formatValue(f.size)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // No farms found
  return (
    <div className="farm-detail-container">
      <div className="header">
        <h2>Farms</h2>
        <button className="add-button">+ Add New Farm</button>
      </div>
      <div className="no-farms">No farms found. Start by adding your first farm!</div>
    </div>
  )
}

export default FarmDetails
