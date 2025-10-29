// ================================================================
// SCHEME PORTAL PAGE - COMPLETE INTEGRATION EXAMPLE
// Copy this code into your SchemePortalPage.jsx
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import './SchemePortal.css';
import { initSchemePortalEnhancements } from './SchemePortalEnhancements';

const SchemePortalPage = () => {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('schemes');
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================
  // INITIALIZE ENHANCEMENTS (IMPORTANT!)
  // ============================================================
  
  useEffect(() => {
    // Initialize all interactive features after component mounts
    const timer = setTimeout(() => {
      initSchemePortalEnhancements();
      console.log('✅ Scheme Portal Enhancements Initialized');
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // ============================================================
  // DARK MODE MANAGEMENT
  // ============================================================
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  }, []);

  // ============================================================
  // DATA (Your existing schemes data)
  // ============================================================
  
  const schemes = [
    {
      id: 1,
      title: "PM-KISAN Scheme",
      description: "Direct income support to farmers with landholding up to 2 hectares",
      status: "Active",
      beneficiaries: "12.5M",
      budget: "₹87,000 Cr",
      category: "Income Support",
      eligibility: "Small & marginal farmers",
      launched: "2019",
      coverage: "All States & UTs",
    },
    // ... more schemes
  ];

  const stats = [
    {
      label: "Total Farmers Enrolled",
      value: "42.1M",
      trend: "+12%",
      icon: "users",
    },
    // ... more stats
  ];

  // ============================================================
  // RENDER FUNCTIONS (Your existing render functions)
  // ============================================================
  
  const renderSchemes = () => (
    <div className="grid grid-md-2 gap-6">
      {schemes.map(scheme => (
        <div key={scheme.id} className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">{scheme.title}</h3>
                <span className="badge badge-primary">{scheme.category}</span>
              </div>
              <span className="badge badge-success">{scheme.status}</span>
            </div>
            <p className="card-description mt-2">{scheme.description}</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Beneficiaries</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scheme.beneficiaries}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Budget</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scheme.budget}</p>
              </div>
            </div>
            <button className="btn btn-secondary w-full">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading content...</p>
        </div>
      );
    }

    return renderSchemes(); // Or your other sections
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================
  
  return (
    <div className="agriculture-portal" data-theme={darkMode ? 'dark' : undefined}>
      <div className="app-container">
        {/* Animated Background */}
        <div className="app-background">
          <div className="gradient-overlay"></div>
          <div className="theme-overlay"></div>
        </div>
        
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>

        <div className="App">
          {/* Header */}
          <header className="portal-header">
            <div className="header-container">
              {/* Logo */}
              <div className="logo">
                <div className="logo-icon">🌾</div>
                <div className="logo-text">
                  <h1>AgriPortal</h1>
                  <p>Government Schemes</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="nav">
                <button
                  className={`nav-item ${activeSection === 'schemes' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('schemes')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Schemes
                </button>
                {/* Add more nav items */}
              </nav>
              
              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <button onClick={toggleDarkMode} className="btn btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {darkMode ? (
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    ) : (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    )}
                  </svg>
                </button>
                
                <button onClick={toggleMobileMenu} className="btn btn-ghost nav-mobile-only">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {mobileMenuOpen ? (
                      <path d="M18 6L6 18M6 6l12 12"/>
                    ) : (
                      <path d="M3 12h18M3 6h18M3 18h18"/>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
              <nav className="mobile-nav">
                <button
                  className={`mobile-nav-item ${activeSection === 'schemes' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('schemes')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Government Schemes
                </button>
                {/* Add more mobile nav items */}
              </nav>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="container main-content">
            <div className="page-transition">
              <div className="section-header flex items-center justify-between">
                <div>
                  <h2 className="section-title">Government Schemes</h2>
                  <p className="section-description">
                    Comprehensive list of agricultural support programs and initiatives
                  </p>
                </div>
                <button className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Apply for Scheme
                </button>
              </div>
              
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SchemePortalPage;

// ================================================================
// NOTES:
// ================================================================
// 
// 1. This is a complete working example
// 2. Replace schemes data with your actual data
// 3. Add your other sections (analytics, reports, exports)
// 4. The enhancements will auto-initialize
// 5. Search and filters will be auto-created
// 6. All animations will work automatically
// 
// Features that work out of the box:
// ✅ Search functionality
// ✅ Category filters
// ✅ Scroll-to-top button
// ✅ Animated counters
// ✅ Card reveal animations
// ✅ Ripple effects
// ✅ Toast notifications
// ✅ Dark mode
// ✅ Mobile responsive
// 
// ================================================================
