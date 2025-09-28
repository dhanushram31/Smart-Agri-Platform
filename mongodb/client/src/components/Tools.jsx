import React from 'react';
import { Link } from 'react-router-dom';
import './Tools.css';

function Tools() {
  const toolCategories = [
    {
      title: "Farm Management",
      description: "Manage your agricultural operations efficiently",
      icon: "🚜",
      tools: [
        {
          name: "Add Farm",
          description: "Register and setup new farm properties",
          path: "/farms/add",
          icon: "🏡",
          color: "#4CAF50"
        },
        {
          name: "Farm List",
          description: "View and manage all your farms",
          path: "/farms",
          icon: "📋",
          color: "#2196F3"
        },
        {
          name: "Farm Details",
          description: "Detailed information about your farms",
          path: "/farmDetails",
          icon: "📊",
          color: "#FF9800"
        }
      ]
    },
    {
      title: "Crop Analytics",
      description: "Advanced crop prediction and planning tools",
      icon: "🌱",
      tools: [
        {
          name: "Crop Prediction",
          description: "AI-powered crop yield predictions",
          path: "/predict",
          icon: "🔮",
          color: "#9C27B0"
        },
        {
          name: "Planting Calendar",
          description: "Optimize your planting schedule",
          path: "/plantingCal",
          icon: "📅",
          color: "#795548"
        }
      ]
    },
    {
      title: "Weather Intelligence",
      description: "Real-time weather data and forecasting",
      icon: "⛅",
      tools: [
        {
          name: "Weather Dashboard",
          description: "Current weather and forecasts",
          path: "/weather",
          icon: "🌤️",
          color: "#03A9F4"
        }
      ]
    },
    {
      title: "Seed Management",
      description: "Track and manage your seed inventory",
      icon: "🌰",
      tools: [
        {
          name: "Register Seeds",
          description: "Add new seeds to your inventory",
          path: "/registerSeed",
          icon: "➕",
          color: "#4CAF50"
        },
        {
          name: "Seed Inventory",
          description: "View and manage seed stock",
          path: "/seedList",
          icon: "📦",
          color: "#FFC107"
        }
      ]
    },
    {
      title: "Security & Monitoring",
      description: "Protect your crops with intelligent monitoring systems",
      icon: "🔒",
      tools: [
        {
          name: "Animal Detection",
          description: "AI-powered wildlife monitoring and crop protection",
          path: "/animal-detection",
          icon: "🐘",
          color: "#FF5722"
        }
      ]
    },
    {
      title: "Operations",
      description: "Handle requests and administrative tasks",
      icon: "⚙️",
      tools: [
        {
          name: "Request Manager",
          description: "Manage agricultural service requests",
          path: "/requestManager",
          icon: "📝",
          color: "#E91E63"
        }
      ]
    }
  ];

  return (
    <div className="tools-container">
      {/* Header Section */}
      <div className="tools-header">
        <div className="tools-hero">
          <h1 className="tools-title">
            <span className="title-icon">🛠️</span>
            Agricultural Tools Suite
          </h1>
          <p className="tools-subtitle">
            Comprehensive digital tools designed to optimize your farming operations, 
            increase productivity, and make data-driven agricultural decisions.
          </p>
        </div>
      </div>

      {/* Tools Categories */}
      <div className="tools-content">
        <div className="tools-grid">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="tool-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <h2 className="category-title">{category.title}</h2>
                  <p className="category-description">{category.description}</p>
                </div>
              </div>
              
              <div className="category-tools">
                {category.tools.map((tool, toolIndex) => (
                  <Link 
                    key={toolIndex} 
                    to={tool.path} 
                    className="tool-card"
                    style={{ '--tool-color': tool.color }}
                  >
                    <div className="tool-icon" style={{ backgroundColor: tool.color }}>
                      {tool.icon}
                    </div>
                    <div className="tool-info">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                    </div>
                    <div className="tool-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="tools-stats">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">13</div>
              <div className="stat-label">Available Tools</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Availability</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Digital</div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="tools-features">
          <h2 className="features-title">Why Choose Our Tools?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <h3>Cutting-Edge Technology</h3>
              <p>AI-powered predictions and real-time data analytics</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>User-Friendly Interface</h3>
              <p>Intuitive design that's easy to navigate and use</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔗</div>
              <h3>Integrated Ecosystem</h3>
              <p>All tools work seamlessly together for maximum efficiency</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive analytics</p>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="tools-getting-started">
          <div className="getting-started-content">
            <h2>Getting Started</h2>
            <p>New to our platform? Here's how to make the most of our agricultural tools:</p>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Add Your Farm</h3>
                  <p>Start by registering your farm properties and basic information</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Set Up Weather Monitoring</h3>
                  <p>Configure weather alerts for your farm locations</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Plan Your Crops</h3>
                  <p>Use prediction tools to optimize your crop selection</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Monitor & Manage</h3>
                  <p>Track progress and manage operations using our comprehensive tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tools;
