/**
 * Modern About Us Component
 * ==========================
 * Enhanced About page matching the homepage theme
 * with animations, modern design, and responsive layout
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import "./AboutUs.css";

const AboutUs = () => {
  // ===== STATE MANAGEMENT =====
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    farmers: 0,
    reduction: 0,
    smallholders: 0
  });

  // ===== REFS =====
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const goalsRef = useRef(null);
  const achievementsRef = useRef(null);

  // ===== UTILITY FUNCTIONS =====
  const animateCounter = (target, key, duration = 2000) => {
    const startValue = 0;
    const endValue = target;
    const startTime = Date.now();

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuad);

      setCounters(prev => ({ ...prev, [key]: currentValue }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCounters(prev => ({ ...prev, [key]: endValue }));
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // ===== EVENT HANDLERS =====
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elementId = entry.target.id;
        setIsVisible((prev) => ({
          ...prev,
          [elementId]: true
        }));

        // Trigger counter animations when achievements section becomes visible
        if (elementId === 'achievements-section' && !isVisible['achievements-section']) {
          animateCounter(1000, 'farmers');
          animateCounter(20, 'reduction');
          animateCounter(500, 'smallholders');
        }
      }
    });
  };

  // ===== EFFECTS =====
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const elements = [
      heroRef.current,
      missionRef.current,
      goalsRef.current,
      achievementsRef.current
    ].filter(Boolean);

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      {/* Hero Section */}
      <header 
        ref={heroRef}
        id="hero-section"
        className="about-header"
        aria-labelledby="about-title"
      >
        <div className="about-hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-element-about elem-1" aria-hidden="true">🌾</div>
          <div className="floating-element-about elem-2" aria-hidden="true">🌱</div>
          <div className="floating-element-about elem-3" aria-hidden="true">🚜</div>
        </div>
        
        <div className="about-header-content">
          <div className={`header-badge ${isVisible['hero-section'] ? 'animate-in' : ''}`}>
            <span className="badge-icon">🌍</span>
            <span className="badge-text">About Us</span>
          </div>
          
          <h1 id="about-title" className={`main-title ${isVisible['hero-section'] ? 'animate-in' : ''}`}>
            Transforming Agriculture Through <span className="gradient-text-about">Innovation</span>
          </h1>
          
          <p className={`subtitle ${isVisible['hero-section'] ? 'animate-in' : ''}`}>
            Empowering farmers with AI-driven insights for a sustainable future
          </p>
        </div>
      </header>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="container-about">
          <div className={`intro-content ${isVisible['hero-section'] ? 'animate-in' : ''}`}>
            <div className="intro-icon">✨</div>
            <p className="intro-text">
              Welcome to the Climate-Smart Agriculture Platform, where cutting-edge technology meets sustainable farming. We
              empower farmers worldwide with data-driven insights and advanced tools to navigate the challenges of modern
              agriculture while protecting our planet's future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section 
        ref={missionRef}
        id="mission-section"
        className="mission-vision-section"
        aria-labelledby="mission-vision-title"
      >
        <div className="container-about">
          <div className="section-header-about">
            <h2 id="mission-vision-title" className="section-title-about">
              Our Mission & Vision
            </h2>
            <p className="section-subtitle-about">
              Driven by purpose, guided by sustainability
            </p>
          </div>

          <div className={`mission-vision-grid ${isVisible['mission-section'] ? 'animate-in' : ''}`}>
            <div className="card mission-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">🎯</div>
              </div>
              <h3 className="card-title">Our Mission</h3>
              <p className="card-description">
                To revolutionize agriculture by providing farmers with intelligent, data-driven solutions that enhance
                productivity, minimize environmental impact, and build resilience against climate change challenges.
              </p>
            </div>
            
            <div className="card vision-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">🌱</div>
              </div>
              <h3 className="card-title">Our Vision</h3>
              <p className="card-description">
                A world where sustainable agriculture thrives through technology, ensuring food security for all while
                preserving our environment for future generations. Every farmer equipped with the knowledge and tools to
                succeed in an evolving climate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Goals Section */}
      <section 
        ref={goalsRef}
        id="goals-section"
        className="goals-section"
        aria-labelledby="goals-title"
      >
        <div className="container-about">
          <div className="section-header-about">
            <div className="section-badge-about">
              <span className="badge-icon">🚀</span>
              <span className="badge-text">Our Approach</span>
            </div>
            <h2 id="goals-title" className="section-title-about">
              Strategic Goals
            </h2>
            <p className="section-subtitle-about">
              Four pillars driving agricultural innovation
            </p>
          </div>

          <div className={`goals-grid ${isVisible['goals-section'] ? 'animate-in' : ''}`}>
            <div className="goal-item" style={{ animationDelay: '0.1s' }}>
              <div className="goal-number">01</div>
              <div className="goal-icon">📊</div>
              <h3 className="goal-title">Data-Driven Insights</h3>
              <p className="goal-description">
                Provide actionable climate and crop intelligence to optimize farming decisions
              </p>
            </div>
            
            <div className="goal-item" style={{ animationDelay: '0.2s' }}>
              <div className="goal-number">02</div>
              <div className="goal-icon">🌿</div>
              <h3 className="goal-title">Sustainable Practices</h3>
              <p className="goal-description">
                Promote eco-friendly farming methods that protect our environment
              </p>
            </div>
            
            <div className="goal-item" style={{ animationDelay: '0.3s' }}>
              <div className="goal-number">03</div>
              <div className="goal-icon">🔮</div>
              <h3 className="goal-title">Predictive Analytics</h3>
              <p className="goal-description">
                Enable better decision-making through advanced crop yield modeling
              </p>
            </div>
            
            <div className="goal-item" style={{ animationDelay: '0.4s' }}>
              <div className="goal-number">04</div>
              <div className="goal-icon">🤝</div>
              <h3 className="goal-title">Collaborative Network</h3>
              <p className="goal-description">
                Foster partnerships between farmers, researchers, and policymakers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section 
        ref={achievementsRef}
        id="achievements-section"
        className="achievements-section"
        aria-labelledby="achievements-title"
      >
        <div className="container-about">
          <div className="section-header-about">
            <div className="section-badge-about light">
              <span className="badge-icon">🏆</span>
              <span className="badge-text">Our Impact</span>
            </div>
            <h2 id="achievements-title" className="section-title-about light">
              Our Impact
            </h2>
            <p className="section-subtitle-about light">
              Real results from farmers we've empowered
            </p>
          </div>

          <div className={`achievements-grid ${isVisible['achievements-section'] ? 'animate-in' : ''}`}>
            <div className="achievement-card" style={{ animationDelay: '0.1s' }}>
              <div className="achievement-icon">👨‍🌾</div>
              <div className="achievement-number">
                {counters.farmers.toLocaleString()}+
              </div>
              <h3 className="achievement-title">Farmers Empowered</h3>
              <p className="achievement-description">
                Successfully implemented crop prediction models across diverse agricultural communities
              </p>
            </div>
            
            <div className="achievement-card" style={{ animationDelay: '0.2s' }}>
              <div className="achievement-icon">💰</div>
              <div className="achievement-number">
                {counters.reduction}%
              </div>
              <h3 className="achievement-title">Cost Reduction</h3>
              <p className="achievement-description">
                Average farming cost reduction achieved through precision agriculture tools
              </p>
            </div>
            
            <div className="achievement-card" style={{ animationDelay: '0.3s' }}>
              <div className="achievement-icon">🌾</div>
              <div className="achievement-number">
                {counters.smallholders.toLocaleString()}+
              </div>
              <h3 className="achievement-title">Smallholder Farmers</h3>
              <p className="achievement-description">
                Supported with advanced agricultural technology and sustainable practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="about-cta-section">
        <div className="container-about">
          <div className="cta-content-about">
            <h2 className="cta-title-about">
              Join Us in Building a Sustainable Future
            </h2>
            <p className="cta-description-about">
              Discover how our AI-powered platform can transform your farming operations
            </p>
            
            <div className="cta-buttons-about">
              <Link to="/services" className="cta-btn-about primary">
                <span className="btn-icon">🚀</span>
                Explore Services
              </Link>
              <Link to="/contact" className="cta-btn-about secondary">
                <span className="btn-icon">📧</span>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Climate-Smart Agriculture Platform. All rights reserved.
          </p>
          <p className="footer-tagline">
            Building a sustainable future, one farm at a time. 🌱
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
