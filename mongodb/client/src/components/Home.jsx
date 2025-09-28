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
      id: 'crop-prediction',
      icon: '🌱',
      title: 'Crop Prediction & Analysis',
      description: 'Advanced AI-powered crop prediction system that analyzes soil conditions, weather patterns, and historical data to recommend optimal crops for maximum yield.',
      features: [
        'Soil quality analysis and recommendations',
        'Weather-based crop suggestions',
        'Yield prediction algorithms',
        'Market price forecasting',
        'Seasonal planting guidance'
      ],
      link: '/crop-prediction'
    },
    {
      id: 'animal-detection',
      icon: '🐘',
      title: 'Animal Detection System',
      description: 'Real-time animal detection and alert system to protect crops from wildlife damage using computer vision and IoT sensors.',
      features: [
        'Real-time animal detection',
        'Automated alert system',
        'Camera integration support',
        'Mobile notifications',
        'Historical activity reports'
      ],
      link: '/animal-detection'
    },
    {
      id: 'weather-monitoring',
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: 'Comprehensive weather monitoring and forecasting system to help farmers make informed decisions based on real-time and predicted weather conditions.',
      features: [
        'Real-time weather data',
        '7-day weather forecasting',
        'Severe weather alerts',
        'Rainfall predictions',
        'Temperature monitoring'
      ],
      link: '/weather'
    },
    {
      id: 'farm-management',
      icon: '🚜',
      title: 'Farm Management Hub',
      description: 'Complete farm management solution for tracking operations, managing resources, and optimizing agricultural workflows.',
      features: [
        'Farm registration and setup',
        'Crop planning calendar',
        'Resource management',
        'Activity tracking',
        'Performance analytics'
      ],
      link: '/tools'
    },
    {
      id: 'iot-monitoring',
      icon: '📡',
      title: 'IoT Farm Monitoring',
      description: 'Comprehensive IoT solution for monitoring farm conditions including soil moisture, temperature, humidity, and irrigation management.',
      features: [
        'Soil moisture monitoring',
        'Environmental sensors',
        'Automated irrigation control',
        'Remote farm monitoring',
        'Data analytics dashboard'
      ],
      link: '/iot-monitoring'
    },
    {
      id: 'marketplace',
      icon: '🛒',
      title: 'Agricultural Marketplace',
      description: 'Digital marketplace connecting farmers with buyers, suppliers, and agricultural services for seamless trade and resource procurement.',
      features: [
        'Seed and fertilizer marketplace',
        'Equipment rental services',
        'Crop trading platform',
        'Labour hub connectivity',
        'Price comparison tools'
      ],
      link: '/labour-hub'
    }
  ];

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/533346/pexels-photo-533346.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Modern sustainable farming techniques',
      title: 'Sustainable Farming',
      description: 'Implementing eco-friendly farming practices for better yields'
    },
    {
      id: 2,
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
  const Header = () => (
    <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" aria-label="Climate Smart Agriculture - Home">
            🌱 Climate Smart Agriculture
          </Link>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/crop-prediction" className="nav-link">Crop Prediction</Link>
            <Link to="/animal-detection" className="nav-link">Animal Detection</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );

  const Hero = () => (
    <section 
      ref={heroRef}
      id="hero-section" 
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-background">
        <div className="floating-element floating-element-1" aria-hidden="true"></div>
        <div className="floating-element floating-element-2" aria-hidden="true"></div>
        <div className="floating-element floating-element-3" aria-hidden="true"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <h1 id="hero-title" className="hero-title">
            Smart Agriculture for a <span className="gradient-text">Sustainable Future</span>
          </h1>
          <p className="hero-description">
            Empowering farmers with AI-driven crop predictions, real-time animal detection, 
            and IoT monitoring solutions to maximize yield while protecting the environment.
          </p>
          <div className="hero-buttons">
            <Link to="/crop-prediction" className="btn btn-primary modern-btn" aria-describedby="btn-primary-desc">
              🚀 Get Started
            </Link>
            <span id="btn-primary-desc" className="sr-only">
              Start using our crop prediction tools
            </span>
            <Link to="/about" className="btn btn-secondary modern-btn">
              📖 Learn More
            </Link>
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
          <h2 id="services-title" className="section-title">
            Our Smart Agriculture Solutions
          </h2>
          <p className="section-subtitle">
            Explore our complete ecosystem of smart agricultural solutions - from AI-powered predictions 
            to real-time monitoring, weather intelligence, and digital marketplace connectivity.
          </p>
        </div>
        
        <div className={`services-grid ${isVisible['services-section'] ? 'animate-in' : ''}`}>
          {services.map((service, index) => (
            <article 
              key={service.id} 
              className="service-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="service-header">
                <div className="service-icon-wrapper">
                  <div className="service-icon" role="img" aria-label={service.title}>
                    {service.icon}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                </div>
              </div>
              
              <div className="service-content">
                <p className="service-description">{service.description}</p>
                
                <ul className="service-list" aria-label={`${service.title} features`}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="service-list-item">
                      <span className="list-bullet" aria-hidden="true"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={service.link} 
                  className="learn-more-link"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
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
      
      <Header />
      
      <main className="main" role="main">
        <Hero />
        <Services />
        <Gallery />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
