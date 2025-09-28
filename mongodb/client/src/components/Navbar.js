import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
import "./Navbar.css"

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateNoteText, setDateNoteText] = useState('')
  const [dateNotes, setDateNotes] = useState(() => {
    // Load date-specific notes from localStorage
    const savedDateNotes = localStorage.getItem('agricultureDateNotes')
    return savedDateNotes ? JSON.parse(savedDateNotes) : {}
  })
  const [showDateNoteInput, setShowDateNoteInput] = useState(false)
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth())
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear())

  // Save date notes to localStorage whenever date notes change
  useEffect(() => {
    localStorage.setItem('agricultureDateNotes', JSON.stringify(dateNotes))
  }, [dateNotes])

  const addDateNote = (dateStr) => {
    if (dateNoteText.trim()) {
      const note = {
        id: Date.now(),
        text: dateNoteText.trim(),
        date: new Date().toISOString(),
        completed: false
      }
      setDateNotes(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), note]
      }))
      setDateNoteText('')
      setShowDateNoteInput(false)
    }
  }

  const toggleDateNoteComplete = (dateStr, noteId) => {
    setDateNotes(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].map(note => 
        note.id === noteId ? { ...note, completed: !note.completed } : note
      )
    }))
  }

  const deleteDateNote = (dateStr, noteId) => {
    setDateNotes(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter(note => note.id !== noteId)
    }))
  }

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    setShowDateNoteInput(true)
  }

  const getDateNoteCount = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return dateNotes[dateStr] ? dateNotes[dateStr].length : 0
  }

  const navigateToNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0)
      setCurrentCalendarYear(currentCalendarYear + 1)
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1)
    }
  }

  const navigateToPreviousMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11)
      setCurrentCalendarYear(currentCalendarYear - 1)
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1)
    }
  }

  const navigateToCurrentMonth = () => {
    const today = new Date()
    setCurrentCalendarMonth(today.getMonth())
    setCurrentCalendarYear(today.getFullYear())
  }

  // Remove token-based authentication checks since we use AuthContext

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
      if (!event.target.closest(".navbar-container")) {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout() // Use AuthContext logout
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
    navigate("/")
  }

  const handleLogin = () => {
    navigate("/login")
    setIsMobileMenuOpen(false)
  }

  const handleRegister = () => {
    navigate("/register")
    setIsMobileMenuOpen(false)
  }

  const handleProfileClick = () => {
    navigate("/profile")
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const navigationItems = [
    {
      label: "Home",
      href: "/",
      isActive: window.location.pathname === "/",
    },
    {
      label: "About",
      href: "/aboutus",
    },
    {
      label: "Labour Hub",
      href: "/labour-hub",
    },
    {
      label: "Scheme Portal",
      href: "/scheme-portal",
    },
    {
      label: "Tools",
      href: "/tools",
      dropdown: [
        { label: "Planting Calendar", href: "/plantingCal" },
        { label: "Register Seed", href: "/registerSeed" },
        { label: "Add Farm", href: "/farms/add" },
        { label: "Request Manager", href: "/requestManager" },
        { label: "Animal Detection", href: "/animal-detection" },
      ],
    },
  ]

  const userMenuItems = [
    { label: "My Profile", href: "/profile", icon: "👤" },
    { label: "My Farms", href: "/farms", icon: "🚜" },
    { label: "My Seeds", href: "/seedList", icon: "🌱" },
    { label: "Requests", href: "/requestManager", icon: "📋" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveDropdown(null)
  }

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const navigateToPage = (href) => {
    navigate(href)
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <button onClick={() => navigateToPage("/")} className="logo-button">
            <div className="logo-icon">
              <span className="logo-emoji">🌱</span>
            </div>
            <div className="logo-text">
              <span className="logo-main">AgriSmart</span>
              <span className="logo-sub">Climate Platform</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <ul className="nav-list">
            {navigationItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.dropdown ? "has-dropdown" : ""} ${item.isActive ? "active" : ""}`}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <button onClick={() => navigateToPage(item.href)} className="nav-link">
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
                </button>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className={`dropdown-menu ${activeDropdown === index ? "show" : ""}`}>
                    <div className="dropdown-content">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <button
                          key={dropdownIndex}
                          onClick={() => navigateToPage(dropdownItem.href)}
                          className="dropdown-link"
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          {/* Calendar Dropdown */}
          <div 
            className="calendar-dropdown-container"
            onMouseEnter={() => setActiveDropdown("calendar")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="calendar-btn" aria-label="Calendar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>

            {/* Calendar Dropdown Menu */}
            <div className={`calendar-dropdown-menu ${activeDropdown === "calendar" ? "show" : ""}`}>
              <div className="calendar-header">
                <div className="calendar-nav-controls">
                  <button onClick={navigateToPreviousMonth} className="calendar-nav-btn" title="Previous month">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="calendar-month-year">
                    <h4>{new Date(currentCalendarYear, currentCalendarMonth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}</h4>
                  </div>
                  <button onClick={navigateToNextMonth} className="calendar-nav-btn" title="Next month">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="calendar-today-section">
                  <span className="current-date">Today: {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                  <button onClick={navigateToCurrentMonth} className="today-btn" title="Go to current month">
                    Today
                  </button>
                </div>
              </div>
              
              <div className="calendar-content">
                <div className="calendar-grid">
                  <div className="calendar-days-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="day-header">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-days">
                    {(() => {
                      const today = new Date();
                      const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
                      const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());
                      
                      const days = [];
                      for (let i = 0; i < 42; i++) {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + i);
                        const isCurrentMonth = date.getMonth() === currentCalendarMonth;
                        const isToday = date.toDateString() === today.toDateString();
                        const noteCount = getDateNoteCount(date);
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        
                        days.push(
                          <button
                            key={i}
                            className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${noteCount > 0 ? 'has-notes' : ''}`}
                            onClick={() => handleDateClick(date)}
                            title={noteCount > 0 ? `${noteCount} note${noteCount > 1 ? 's' : ''}` : 'Click to add note'}
                          >
                            <span className="day-number">{date.getDate()}</span>
                            {noteCount > 0 && (
                              <span className="note-indicator">{noteCount}</span>
                            )}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>
                
                {/* Date-specific notes section */}
                {selectedDate && (
                  <div className="selected-date-notes">
                    <h5 className="selected-date-title">
                      📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h5>
                    
                    {showDateNoteInput && (
                      <div className="add-date-note-container">
                        <input
                          type="text"
                          value={dateNoteText}
                          onChange={(e) => setDateNoteText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addDateNote(selectedDate)}
                          placeholder="Add activity for this date..."
                          className="note-input"
                          autoFocus
                        />
                        <button onClick={() => addDateNote(selectedDate)} className="add-note-btn">+</button>
                        <button 
                          onClick={() => {
                            setShowDateNoteInput(false)
                            setSelectedDate(null)
                            setDateNoteText('')
                          }} 
                          className="cancel-note-btn"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    
                    <div className="date-notes-list">
                      {dateNotes[selectedDate] && dateNotes[selectedDate].length > 0 ? (
                        dateNotes[selectedDate].map(note => (
                          <div key={note.id} className={`note-item ${note.completed ? 'completed' : ''}`}>
                            <button 
                              onClick={() => toggleDateNoteComplete(selectedDate, note.id)}
                              className="note-checkbox"
                            >
                              {note.completed ? '✅' : '◻️'}
                            </button>
                            <span className="note-text">{note.text}</span>
                            <button 
                              onClick={() => deleteDateNote(selectedDate, note.id)}
                              className="delete-note-btn"
                            >
                              🗑️
                            </button>
                          </div>
                        ))
                      ) : (
                        !showDateNoteInput && (
                          <p className="no-notes">No activities for this date</p>
                        )
                      )}
                    </div>
                  </div>
                )}
                
                <div className="calendar-quick-actions">
                  <button onClick={() => navigateToPage('/plantingCal')} className="calendar-action-btn">
                    📅 Planting Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button className="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {/* Authentication Section */}
          {user ? (
            <div className="user-menu-container">
              {/* User Profile Dropdown */}
              <div
                className="user-profile-dropdown"
                onMouseEnter={() => setActiveDropdown("user")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="user-profile-btn">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar-image" />
                    ) : (
                      <span className="avatar-placeholder">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <span className="user-name">{user?.username || "User"}</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="user-dropdown-arrow">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                <div className={`user-dropdown-menu ${activeDropdown === "user" ? "show" : ""}`}>
                  <div className="user-dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user?.avatar ? (
                          <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar-image" />
                        ) : (
                          <span className="avatar-placeholder">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                        )}
                      </div>
                      <div className="user-details">
                        <span className="user-display-name">{user?.username || "User"}</span>
                        <span className="user-email">{user?.email || "user@example.com"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="user-dropdown-content">
                    {userMenuItems.map((menuItem, index) => (
                      <button key={index} onClick={() => navigateToPage(menuItem.href)} className="user-dropdown-link">
                        <span className="menu-icon">{menuItem.icon}</span>
                        {menuItem.label}
                      </button>
                    ))}
                  </div>

                  <div className="user-dropdown-footer">
                    <button onClick={handleLogout} className="logout-btn">
                      <span className="logout-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={handleLogin} className="login-btn">
                Login
              </button>
              <button onClick={handleRegister} className="cta-btn">
                Get Started
              </button>
            </div>
          )}

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
          {/* Mobile User Section */}
          {user && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar-image" />
                  ) : (
                    <span className="avatar-placeholder">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <div className="user-details">
                  <span className="user-display-name">{user?.username || "User"}</span>
                  <span className="user-email">{user?.email || "user@example.com"}</span>
                </div>
              </div>
            </div>
          )}

          <ul className="mobile-nav-list">
            {navigationItems.map((item, index) => (
              <li key={index} className="mobile-nav-item">
                <div className="mobile-nav-link-wrapper">
                  <button
                    onClick={() => !item.dropdown && navigateToPage(item.href)}
                    className={`mobile-nav-link ${item.isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </button>

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
                      <button
                        key={dropdownIndex}
                        onClick={() => navigateToPage(dropdownItem.href)}
                        className="mobile-dropdown-link"
                      >
                        {dropdownItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}

            {/* Mobile User Menu Items */}
            {user && (
              <>
                <li className="mobile-nav-divider"></li>
                {userMenuItems.map((menuItem, index) => (
                  <li key={index} className="mobile-nav-item">
                    <button onClick={() => navigateToPage(menuItem.href)} className="mobile-nav-link mobile-user-link">
                      <span className="menu-icon">{menuItem.icon}</span>
                      {menuItem.label}
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>

          {/* Mobile Action Buttons */}
          <div className="mobile-actions">
            {user ? (
              <button onClick={handleLogout} className="mobile-logout-btn">
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            ) : (
              <>
                <button onClick={handleLogin} className="mobile-login-btn">
                  Login
                </button>
                <button onClick={handleRegister} className="mobile-cta-btn">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
    </nav>
  )
}

export default Navbar
