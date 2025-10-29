/**
 * Modern Home Component
 * =====================
 * A React component with modern design principles, accessibility features,
 * and responsive layout using hooks and functional components.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // ===== STATE MANAGEMENT =====
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  // ===== REFS =====
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const galleryRef = useRef(null);
  const footerRef = useRef(null);

  // ===== DATA =====

  const services = [
    {
      id: 'animal-detection',
      icon: '🐄',
      title: 'Animal Detection',
      description: 'Real-time monitoring and identification of livestock using advanced AI computer vision technology with 24/7 surveillance capabilities.',
      features: [
        'Real-time livestock monitoring & tracking',
        'Automated health assessment & vital signs',
        'Behavioral pattern analysis & anomaly detection',
        'Instant alert notifications via SMS/Email',
        'Disease early detection & prevention alerts',
        'Predator intrusion detection system'
      ],
      benefit: 'Reduce livestock losses by up to 40%',
      link: '/animal-detection'
    },
    {
      id: 'crop-prediction',
      icon: '🌾',
      title: 'Crop Prediction',
      description: 'Predict yield and detect diseases using sophisticated machine learning models, satellite imagery, and IoT sensor data integration.',
      features: [
        'Yield prediction algorithms with 95% accuracy',
        'Disease detection & prevention protocols',
        'Weather-based crop recommendations',
        'Market price forecasting & trend analysis',
        'Seasonal planting guidance & optimization',
        'Soil nutrient analysis & fertilizer suggestions'
      ],
      benefit: 'Increase crop yield by up to 35%',
      link: '/crop-prediction'
    },
    {
      id: 'farm-management',
      icon: '📊',
      title: 'Farm Management',
      description: 'Centralized platform for comprehensive farm operations, soil data monitoring, irrigation automation, and real-time productivity analytics.',
      features: [
        'Soil moisture monitoring & pH analysis',
        'Automated irrigation control & scheduling',
        'Resource management & inventory tracking',
        'Performance analytics dashboard & insights',
        'Financial tracking & profit optimization',
        'Equipment maintenance scheduling & alerts'
      ],
      benefit: 'Save up to 30% on water usage',
      link: '/farm-management'
    },
    {
      id: 'weather-intelligence',
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: 'Advanced weather forecasting and climate analysis with AI-powered insights for optimal farming decisions and risk management.',
      features: [
        'Hyperlocal weather forecasting (1km accuracy)',
        'Climate change adaptation strategies',
        'Frost & storm early warning system',
        'Optimal planting windows & harvest timing',
        'Weather-based activity recommendations',
        'Drought & flood risk assessment'
      ],
      benefit: 'Reduce weather-related losses by 50%',
      link: '/weather-intelligence'
    }
  ];

  const benefits = [
    {
      icon: '📈',
      title: 'Improve Yield',
      description: 'Increase crop productivity by 25-35% with AI-driven insights, precision farming techniques, and data-driven decision making for optimal harvests.',
      metric: '+35% Yield'
    },
    {
      icon: '🛡️',
      title: 'Reduce Losses',
      description: 'Minimize crop and livestock losses through early detection systems, preventive measures, and real-time monitoring alerts for immediate action.',
      metric: '-40% Losses'
    },
    {
      icon: '💧',
      title: 'Manage Resources',
      description: 'Optimize water, fertilizer, and energy usage with smart monitoring, automation systems, and intelligent resource allocation algorithms.',
      metric: '-30% Waste'
    },
    {
      icon: '🌱',
      title: 'Sustainable Farming',
      description: 'Promote eco-friendly practices while maintaining high productivity standards through carbon-neutral solutions and environmental monitoring.',
      metric: '100% Sustainable'
    }
  ];

  const whyChooseUs = [
    {
      icon: '🎯',
      title: 'Accuracy',
      description: '95%+ prediction accuracy backed by advanced machine learning algorithms and real-world data.',
      metric: '95%+'
    },
    {
      icon: '⚡',
      title: 'Reliability',
      description: '24/7 monitoring with 99.9% uptime ensuring your farm operations never miss a beat.',
      metric: '99.9%'
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description: 'Eco-friendly solutions that reduce environmental impact while boosting productivity.',
      metric: 'Carbon Neutral'
    },
    {
      icon: '🤝',
      title: 'Support',
      description: 'Dedicated agricultural experts available round-the-clock for guidance and assistance.',
      metric: '24/7'
    }
  ];

  const galleryImages = [
    {
      id: 1,
      src: '/images/smart-livestock-monitoring.jpg',
      alt: 'AI-powered livestock monitoring system with detection boxes around cattle',
      title: 'Smart Livestock Monitoring',
      description: 'Advanced AI technology monitors 125+ animals with real-time detection alerts and health analytics'
    },
    {
      id: 2,
      src: '/images/crop-prediction-dashboard.jpg',
      alt: 'Smart crop prediction dashboard showing field analysis and yield forecasting',
      title: 'Intelligent Crop Analytics',
      description: 'AI-driven crop field monitoring with predictive analytics for optimal farming decisions'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/533346/pexels-photo-533346.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Modern sustainable farming techniques',
      title: 'Sustainable Farming',
      description: 'Implementing eco-friendly farming practices for better yields'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/2518861/pexels-photo-2518861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Smart irrigation system',
      title: 'Smart Irrigation',
      description: 'Automated water management systems for optimal crop growth'
    }
  ];

  // ===== UTILITY FUNCTIONS =====
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);





  // ===== EVENT HANDLERS =====
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsHeaderScrolled(scrollY > 100);
  }, []);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elementId = entry.target.id;
        setIsVisible((prev) => ({
          ...prev,
          [elementId]: true
        }));
      }
    });
  }, []);

  // ===== EFFECTS =====
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const elements = [
      heroRef.current,
      servicesRef.current,
      galleryRef.current,
      footerRef.current
    ].filter(Boolean);

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    const debouncedMouseMove = debounce(handleMouseMove, 10);
    
    window.addEventListener('mousemove', debouncedMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', debouncedMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [debounce, handleMouseMove, handleScroll]);

  // Handle reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // ===== COMPONENT FUNCTIONS =====

  const Hero = () => (
    <section 
      ref={heroRef}
      id="hero-section" 
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-background">
        <div className="floating-element floating-element-1" aria-hidden="true">🌾</div>
        <div className="floating-element floating-element-2" aria-hidden="true">🚜</div>
        <div className="floating-element floating-element-3" aria-hidden="true">🌱</div>
        <div className="floating-element floating-element-4" aria-hidden="true">🐄</div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🤖</span>
            <span className="badge-text">AI-Powered Agriculture</span>
          </div>
          
          <h1 id="hero-title" className="hero-title">
            AI-Powered Farming for a <span className="gradient-text">Smarter Tomorrow</span>
          </h1>
          
          <p className="hero-description">
            Transform your farm with intelligent solutions that combine cutting-edge AI technology 
            with traditional farming wisdom. Monitor livestock, predict crop yields, and manage 
            resources efficiently with our comprehensive agriculture platform.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Farmers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">35%</span>
              <span className="stat-label">Yield Increase</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">40%</span>
              <span className="stat-label">Loss Reduction</span>
            </div>
          </div>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary modern-btn" aria-describedby="btn-primary-desc">
              🚀 Get Started Free
            </Link>
            <span id="btn-primary-desc" className="sr-only">
              Start your free trial today
            </span>
            <Link to="/demo" className="btn btn-secondary modern-btn">
              📹 Watch Demo
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="dashboard-header">
              <div className="dashboard-title">🌾 Farm Analytics Dashboard</div>
              <div className="live-indicator">
                <span className="live-dot"></span>
                Live Updates
              </div>
            </div>
            <div className="dashboard-content">
              <div className="metric-card">
                <span className="metric-icon">📈</span>
                <div className="metric-info">
                  <span className="metric-value">95%</span>
                  <span className="metric-label">Crop Health</span>
                </div>
              </div>
              <div className="metric-card">
                <span className="metric-icon">🐄</span>
                <div className="metric-info">
                  <span className="metric-value">24</span>
                  <span className="metric-label">Livestock</span>
                </div>
              </div>
              <div className="metric-card">
                <span className="metric-icon">💧</span>
                <div className="metric-info">
                  <span className="metric-value">78%</span>
                  <span className="metric-label">Soil Moisture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );



  const Services = () => (
    <section 
      ref={servicesRef}
      id="services-section" 
      className="services-section"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">⚡</span>
            <span className="badge-text">Smart Solutions</span>
          </div>
          <h2 id="services-title" className="section-title">
            AI-Powered Agriculture Solutions
          </h2>
          <p className="section-subtitle">
            Discover our comprehensive suite of intelligent farming tools designed to revolutionize 
            your agricultural operations with cutting-edge technology and proven results.
          </p>
        </div>
        
        <div className={`services-grid ${isVisible['services-section'] ? 'animate-in' : ''}`}>
          {services.map((service, index) => (
            <article 
              key={service.id} 
              className="service-card premium-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="service-header">
                <div className="service-icon-wrapper">
                  <div className="service-icon" role="img" aria-label={service.title}>
                    {service.icon}
                  </div>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <div className="service-benefit">{service.benefit}</div>
              </div>
              
              <div className="service-content">
                <p className="service-description">{service.description}</p>
                
                <ul className="service-list" aria-label={`${service.title} features`}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="service-list-item">
                      <span className="list-bullet" aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={service.link} 
                  className="service-cta-btn"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Explore Solution <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const Benefits = () => (
    <section className="benefits-section" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">🎯</span>
            <span className="badge-text">Proven Results</span>
          </div>
          <h2 id="benefits-title" className="section-title">
            Transform Your Farm Operations
          </h2>
          <p className="section-subtitle">
            See how our AI-powered solutions help farmers achieve remarkable improvements 
            in productivity, efficiency, and sustainability.
          </p>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-metric">{benefit.metric}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const WhyChooseUs = () => (
    <section className="why-choose-section" aria-labelledby="why-choose-title">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">⭐</span>
            <span className="badge-text">Why Choose Us</span>
          </div>
          <h2 id="why-choose-title" className="section-title">
            Built for Modern Farmers
          </h2>
          <p className="section-subtitle">
            Our platform combines cutting-edge technology with agricultural expertise 
            to deliver unmatched accuracy, reliability, and sustainability.
          </p>
        </div>
        
        <div className="why-choose-grid">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="why-choose-card">
              <div className="why-choose-header">
                <div className="why-choose-icon">{item.icon}</div>
                <div className="why-choose-metric">{item.metric}</div>
              </div>
              <h3 className="why-choose-title">{item.title}</h3>
              <p className="why-choose-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CallToAction = () => (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-content">
          <h2 id="cta-title" className="cta-title">
            Ready to Transform Your Farm?
          </h2>
          <p className="cta-description">
            Join thousands of farmers who are already using AI to boost their productivity, 
            reduce losses, and build sustainable farming practices.
          </p>
          <div className="cta-buttons">
            <Link to="/demo" className="btn btn-primary large-btn">
              🎯 Request Free Demo
            </Link>
            <Link to="/register" className="btn btn-secondary large-btn">
              📱 Start Free Trial
            </Link>
          </div>
          <div className="cta-features">
            <span className="cta-feature">✓ 30-day free trial</span>
            <span className="cta-feature">✓ No setup fees</span>
            <span className="cta-feature">✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );

  const Gallery = () => (
    <section 
      ref={galleryRef}
      id="gallery-section" 
      className="gallery-section"
      aria-labelledby="gallery-title"
    >
      <div className="container">
        <h2 id="gallery-title" className="section-title">
          Agriculture in Action
        </h2>
        
        <div className={`gallery-grid ${isVisible['gallery-section'] ? 'animate-in' : ''}`}>
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img 
                src={image.src} 
                alt={image.alt}
                className="gallery-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDQwMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwSDEwMEwxNTAgNTBIMjUwTDIwMCAxMDBaIiBmaWxsPSIjQ0JENUEXC1NbmPdGNGF0aF0KPC9zdmc+';
                }}
              />
              <div className="gallery-overlay">
                <div className="gallery-content">
                  <h3 className="gallery-title">{image.title}</h3>
                  <p className="gallery-description">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer 
      ref={footerRef}
      id="footer-section" 
      className="footer"
      role="contentinfo"
    >
      <div className="footer-background" aria-hidden="true">
        <div className="footer-star" style={{ top: '20%', left: '10%' }}>✨</div>
        <div className="footer-star" style={{ top: '60%', left: '80%' }}>⭐</div>
        <div className="footer-star" style={{ top: '30%', left: '60%' }}>✨</div>
      </div>
      
      <div className="container">
        <div className={`footer-content ${isVisible['footer-section'] ? 'animate-in' : ''}`}>
          <p className="footer-text">
            Building the future of agriculture with technology and innovation
          </p>
          <p className="footer-contact">
            Contact us: <a href="mailto:info@climatesmartagri.com" className="footer-link">
              info@climatesmartagri.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );

  // ===== RENDER =====
  return (
    <div className="home-container">
      {/* Cursor glow effect */}
      <div 
        className="cursor-glow" 
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100
        }}
        aria-hidden="true"
      />
      
      {/* Skip link for accessibility */}
      <a href="#hero-section" className="skip-link">
        Skip to main content
      </a>
      
      <main className="main" role="main">
        <Hero />
        <Services />
        <Benefits />
        <WhyChooseUs />
        <Gallery />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
