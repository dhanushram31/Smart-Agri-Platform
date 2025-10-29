"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Header.css"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-container")) {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const navigationItems = [
    {
      label: "Home",
      href: "/",
      isActive: true,
    },
    {
      label: "About",
      href: "/about",
      dropdown: [
        { label: "Our Mission", href: "/about/mission" },
        { label: "Our Team", href: "/about/team" },
        { label: "History", href: "/about/history" },
        { label: "Achievements", href: "/about/achievements" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      dropdown: [
        { label: "Crop Prediction", href: "/services/crop-prediction" },
        { label: "Weather Analytics", href: "/services/weather" },
        { label: "Soil Analysis", href: "/services/soil-analysis" },
        { label: "Market Insights", href: "/services/market" },
        { label: "Consultation", href: "/services/consultation" },
      ],
    },
    {
      label: "Programs",
      href: "/programs",
      dropdown: [
        { label: "PM-KISAN", href: "/programs/pm-kisan" },
        { label: "Soil Health Card", href: "/programs/soil-health" },
        { label: "e-NAM", href: "/programs/enam" },
        { label: "Organic Farming", href: "/programs/organic" },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      dropdown: [
        { label: "Research Papers", href: "/resources/research" },
        { label: "Guidelines", href: "/resources/guidelines" },
        { label: "Downloads", href: "/resources/downloads" },
        { label: "FAQs", href: "/resources/faqs" },
      ],
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveDropdown(null)
  }

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <span className="logo-emoji">🌱</span>
            </div>
            <div className="logo-text">
              <span className="logo-main">AgriSmart</span>
              <span className="logo-sub">Climate Platform</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navigationItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.dropdown ? "has-dropdown" : ""} ${item.isActive ? "active" : ""}`}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <Link to={item.href} className="nav-link">
                  {item.label}
                  {item.dropdown && (
                    <span className="dropdown-arrow">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className={`dropdown-menu ${activeDropdown === index ? "show" : ""}`}>
                    <div className="dropdown-content">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link key={dropdownIndex} to={dropdownItem.href} className="dropdown-link">
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="header-actions">
          <button className="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="cta-btn">
            Get Started
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {navigationItems.map((item, index) => (
              <li key={index} className="mobile-nav-item">
                <div className="mobile-nav-link-wrapper">
                  <Link
                    to={item.href}
                    className={`mobile-nav-link ${item.isActive ? "active" : ""}`}
                    onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>

                  {item.dropdown && (
                    <button
                      className={`mobile-dropdown-toggle ${activeDropdown === index ? "active" : ""}`}
                      onClick={() => toggleDropdown(index)}
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown */}
                {item.dropdown && (
                  <div className={`mobile-dropdown ${activeDropdown === index ? "show" : ""}`}>
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      <Link
                        key={dropdownIndex}
                        to={dropdownItem.href}
                        className="mobile-dropdown-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Action Buttons */}
          <div className="mobile-actions">
            <Link to="/login" className="mobile-login-btn" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="mobile-cta-btn" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
    </header>
  )
}

export default Header
