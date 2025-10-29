import React, { Component } from 'react';
import './SchemePortal.css';

class SchemePortalPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      darkMode: this.loadDarkMode(),
      mobileMenuOpen: false,
      activeSection: 'schemes',
      isLoading: true,
    };

    // Enhanced scheme data
    this.schemes = [
      {
        id: 1,
        title: "PM-KISAN Scheme",
        description: "Direct income support to farmers with landholding up to 2 hectares providing ₹6,000 per year",
        status: "Active",
        beneficiaries: "12.5M",
        budget: "₹87,000 Cr",
        category: "Income Support",
        eligibility: "Small & marginal farmers",
        launched: "2019",
        coverage: "All States & UTs",
      },
      {
        id: 2,
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Comprehensive crop insurance scheme providing financial support against crop losses",
        status: "Active",
        beneficiaries: "5.8M",
        budget: "₹15,695 Cr",
        category: "Insurance",
        eligibility: "All farmers",
        launched: "2016",
        coverage: "550+ Districts",
      },
      {
        id: 3,
        title: "Soil Health Card Scheme",
        description: "Promoting soil test based nutrient management for sustainable agriculture",
        status: "Active",
        beneficiaries: "22.1M",
        budget: "₹568 Cr",
        category: "Soil Management",
        eligibility: "All farmers",
        launched: "2015",
        coverage: "All Districts",
      },
      {
        id: 4,
        title: "National Agriculture Market (e-NAM)",
        description: "Pan-India electronic trading portal for agricultural commodities",
        status: "Active",
        beneficiaries: "1.7M",
        budget: "₹200 Cr",
        category: "Market Access",
        eligibility: "Registered farmers",
        launched: "2016",
        coverage: "1000+ Markets",
      },
      {
        id: 5,
        title: "Kisan Credit Card",
        description: "Providing adequate and timely credit support for agriculture and allied activities",
        status: "Active",
        beneficiaries: "7.2M",
        budget: "₹2,00,000 Cr",
        category: "Credit Support",
        eligibility: "All farmers",
        launched: "1998",
        coverage: "Pan India",
      },
      {
        id: 6,
        title: "Pradhan Mantri Krishi Sinchai Yojana",
        description: "Enhancing water use efficiency and expanding cultivable area under irrigation",
        status: "Active",
        beneficiaries: "3.5M",
        budget: "₹93,068 Cr",
        category: "Irrigation",
        eligibility: "All farmers",
        launched: "2015",
        coverage: "All States",
      },
    ];

    // Enhanced statistics
    this.stats = [
      {
        label: "Total Farmers Enrolled",
        value: "42.1M",
        trend: "+12%",
        icon: "users",
        description: "Registered beneficiaries across all schemes",
      },
      {
        label: "Active Schemes",
        value: "156",
        trend: "+8%",
        icon: "clipboard",
        description: "Currently operational government schemes",
      },
      {
        label: "Districts Covered",
        value: "736",
        trend: "+5%",
        icon: "map",
        description: "Geographic coverage across India",
      },
      {
        label: "Budget Allocated",
        value: "₹1.2L Cr",
        trend: "+15%",
        icon: "currency",
        description: "Total budget for current fiscal year",
      },
    ];
  }

  componentDidMount() {
    this.applyDarkMode();
    // Simulate initial loading
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.darkMode !== this.state.darkMode) {
      this.applyDarkMode();
    }
  }

  loadDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  };

  saveDarkMode = () => {
    localStorage.setItem('darkMode', JSON.stringify(this.state.darkMode));
  };

  applyDarkMode = () => {
    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.saveDarkMode();
  };

  toggleDarkMode = () => {
    this.setState(prevState => ({
      darkMode: !prevState.darkMode
    }));
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({
      mobileMenuOpen: !prevState.mobileMenuOpen
    }));
  };

  handleSectionChange = (section) => {
    this.setState({
      activeSection: section,
      mobileMenuOpen: false
    });
  };

  viewSchemeDetails = (schemeId) => {
    const scheme = this.schemes.find(s => s.id === parseInt(schemeId));
    if (scheme) {
      alert(`🌾 ${scheme.title}\n\n📋 Description: ${scheme.description}\n\n📊 Key Information:\n• Category: ${scheme.category}\n• Status: ${scheme.status}\n• Beneficiaries: ${scheme.beneficiaries}\n• Budget: ${scheme.budget}\n• Launched: ${scheme.launched}\n• Coverage: ${scheme.coverage}\n• Eligibility: ${scheme.eligibility}`);
    }
  };

  exportData = (exportType) => {
    alert(`✅ ${exportType} exported successfully!\n\nDownload would start automatically in a real implementation.`);
  };

  viewReport = (reportType) => {
    alert(`📊 Opening ${reportType} report...\n\nThis would display:\n• Detailed yield analysis\n• Interactive charts and graphs\n• Comparative data\n• Downloadable PDF format`);
  };

  getIconPath = (iconType) => {
    const icons = {
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z"/>',
      clipboard: '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
      map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>',
      currency: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      table: '<path d="M12 3v18"/><rect x="4" y="5" width="16" height="14" rx="1"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>',
      chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
      database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    };
    return icons[iconType] || icons.file;
  };

  renderSchemes = () => (
    <div className="grid grid-md-2 gap-6">
      {this.schemes.map(scheme => (
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
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Launched</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scheme.launched}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Coverage</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scheme.coverage}</p>
              </div>
            </div>
            <button 
              className="btn btn-secondary w-full"
              onClick={() => this.viewSchemeDetails(scheme.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  renderAnalytics = () => (
    <>
      <div className="grid grid-md-2 grid-lg-4 gap-6 mb-6">
        {this.stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="stat-card">
              <div className="stat-info">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</p>
                <h3>{stat.value}</h3>
                <p className="stat-trend">{stat.trend}</p>
              </div>
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <g dangerouslySetInnerHTML={{ __html: this.getIconPath(stat.icon) }} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-md-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Scheme Performance Overview</h3>
            <p className="card-description">Monthly enrollment and budget utilization trends</p>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              📊 Interactive chart visualization would be implemented here
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Regional Distribution</h3>
            <p className="card-description">State-wise scheme implementation status</p>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              🗺️ Geographic distribution map would be displayed here
            </div>
          </div>
        </div>
      </div>
    </>
  );

  renderReports = () => {
    const reports = [
      { season: "Kharif Season 2024", status: "Available", size: "2.4 MB" },
      { season: "Rabi Season 2023-24", status: "Available", size: "1.8 MB" },
      { season: "Summer Season 2024", status: "Processing", size: "Pending" },
      { season: "Annual Report 2023-24", status: "Available", size: "5.2 MB" },
    ];

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Latest Yield Reports</h3>
          <p className="card-description">Access detailed crop yield data, analysis, and seasonal performance metrics</p>
        </div>
        <div className="card-content">
          {reports.map((report, index) => (
            <div key={index} className="report-item">
              <div className="report-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-tertiary)' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div>
                  <h4>{report.season}</h4>
                  <p>Comprehensive yield analysis • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${report.status === "Available" ? "badge-success" : "badge-primary"}`}>
                  {report.status}
                </span>
                {report.status === "Available" && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => this.viewReport(report.season)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    View Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderExports = () => {
    const exportOptions = [
      { type: "Scheme Data (CSV)", description: "Complete scheme information and beneficiary data", icon: "table" },
      { type: "Yield Reports (PDF)", description: "Formatted yield analysis reports", icon: "file" },
      { type: "Analytics Dashboard (Excel)", description: "Performance metrics and statistical data", icon: "chart" },
      { type: "Beneficiary List (JSON)", description: "Structured beneficiary database", icon: "database" },
    ];

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Export Options</h3>
          <p className="card-description">Download comprehensive data sets in your preferred format</p>
        </div>
        <div className="card-content">
          <div className="export-grid">
            {exportOptions.map((option, index) => (
              <button 
                key={index}
                className="btn btn-secondary"
                onClick={() => this.exportData(option.type)}
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <g dangerouslySetInnerHTML={{ __html: this.getIconPath(option.icon) }} />
                  </svg>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{option.type}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{option.description}</div>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  renderContent = () => {
    if (this.state.isLoading) {
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

    switch (this.state.activeSection) {
      case 'schemes':
        return (
          <>
            <div className="section-header flex items-center justify-between">
              <div>
                <h2 className="section-title">Government Schemes</h2>
                <p className="section-description">Comprehensive list of agricultural support programs and initiatives</p>
              </div>
              <button className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Apply for Scheme
              </button>
            </div>
            {this.renderSchemes()}
          </>
        );
      case 'analytics':
        return (
          <>
            <div className="section-header">
              <h2 className="section-title">Analytics Dashboard</h2>
              <p className="section-description">Real-time insights and performance metrics for agricultural schemes</p>
            </div>
            {this.renderAnalytics()}
          </>
        );
      case 'reports':
        return (
          <>
            <div className="section-header">
              <h2 className="section-title">Yield Reports</h2>
              <p className="section-description">Comprehensive agricultural yield analysis and seasonal reports</p>
            </div>
            {this.renderReports()}
          </>
        );
      case 'exports':
        return (
          <>
            <div className="section-header">
              <h2 className="section-title">Data Export</h2>
              <p className="section-description">Export agricultural data and reports in various formats for analysis</p>
            </div>
            {this.renderExports()}
          </>
        );
      default:
        return this.renderSchemes();
    }
  };

  render() {
    const { darkMode, mobileMenuOpen, activeSection } = this.state;

    return (
      <div className="agriculture-portal" data-theme={darkMode ? 'dark' : undefined}>
        <div className="app-container">
          <div className="app-background">
            <div className="gradient-overlay"></div>
            <div className="theme-overlay"></div>
          </div>
          
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>

          <div className="App">
            <header className="portal-header">
              <div className="header-container">
                <div className="logo">
                  <div className="logo-icon">🌾</div>
                  <div className="logo-text">
                    <h1>AgriPortal</h1>
                    <p>Government Schemes</p>
                  </div>
                </div>
                
                <nav className="nav">
                  {['schemes', 'analytics', 'reports', 'exports'].map(section => (
                    <button
                      key={section}
                      className={`nav-item ${activeSection === section ? 'active' : ''}`}
                      onClick={() => this.handleSectionChange(section)}
                    >
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {section === 'schemes' && (
                          <>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </>
                        )}
                        {section === 'analytics' && (
                          <>
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                          </>
                        )}
                        {section === 'reports' && (
                          <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </>
                        )}
                        {section === 'exports' && (
                          <>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </>
                        )}
                      </svg>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </nav>
                
                <div className="flex items-center gap-2">
                  <button onClick={this.toggleDarkMode} className="btn btn-ghost">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {darkMode ? (
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                      ) : (
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      )}
                    </svg>
                  </button>
                  
                  <button onClick={this.toggleMobileMenu} className="btn btn-ghost nav-mobile-only">
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
              
              <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                  {[
                    { key: 'schemes', label: 'Government Schemes' },
                    { key: 'analytics', label: 'Analytics Dashboard' },
                    { key: 'reports', label: 'Yield Reports' },
                    { key: 'exports', label: 'Data Export' }
                  ].map(item => (
                    <button
                      key={item.key}
                      className={`mobile-nav-item ${activeSection === item.key ? 'active' : ''}`}
                      onClick={() => this.handleSectionChange(item.key)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {item.key === 'schemes' && (
                          <>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </>
                        )}
                        {item.key === 'analytics' && (
                          <>
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                          </>
                        )}
                        {item.key === 'reports' && (
                          <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </>
                        )}
                        {item.key === 'exports' && (
                          <>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </>
                        )}
                      </svg>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </header>
            
            <main className="container main-content">
              <div className="page-transition">
                {this.renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default SchemePortalPage;
