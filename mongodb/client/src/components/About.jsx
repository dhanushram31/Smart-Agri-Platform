/**
 * Modern About Us Component
 * ==========================
 * A comprehensive About page for the AI-powered agriculture platform
 * featuring mission, vision, technology, team, and achievements
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  // ===== STATE MANAGEMENT =====
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    farms: 0,
    accuracy: 0,
    regions: 0,
    users: 0
  });

  // ===== REFS =====
  const introRef = useRef(null);
  const missionRef = useRef(null);
  const storyRef = useRef(null);
  const techRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const ctaRef = useRef(null);

  // ===== DATA =====
  const missionVision = [
    {
      icon: '🎯',
      title: 'Our Mission',
      description: 'To empower farmers worldwide with accessible, affordable AI-driven agricultural solutions that increase productivity, reduce losses, and promote sustainable farming practices for future generations.'
    },
    {
      icon: '🌟',
      title: 'Our Vision',
      description: 'To become the global leader in smart agriculture technology, creating a world where every farmer has access to intelligent tools that transform traditional farming into precision agriculture.'
    },
    {
      icon: '🌱',
      title: 'Our Values',
      description: 'Innovation, sustainability, accessibility, and farmer-first approach guide everything we do. We believe in creating technology that serves agriculture, not the other way around.'
    }
  ];

  const technologies = [
    {
      icon: '🤖',
      title: 'Artificial Intelligence',
      description: 'Advanced machine learning models trained on millions of agricultural data points for accurate predictions and insights.',
      features: ['Computer Vision', 'Deep Learning', 'Predictive Analytics']
    },
    {
      icon: '📡',
      title: 'IoT Integration',
      description: 'Real-time sensor networks monitoring soil, weather, and crop conditions with instant data synchronization.',
      features: ['Smart Sensors', 'Edge Computing', 'Cloud Infrastructure']
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Comprehensive analytics platform processing terabytes of agricultural data for actionable insights.',
      features: ['Big Data Processing', 'Visualization Tools', 'Custom Reports']
    },
    {
      icon: '🛰️',
      title: 'Satellite Imaging',
      description: 'High-resolution satellite imagery for crop health monitoring and large-scale farm management.',
      features: ['NDVI Analysis', 'Thermal Mapping', 'Change Detection']
    }
  ];

  const team = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Technology Officer',
      avatar: '👨‍💼',
      bio: '15+ years in AgriTech & AI',
      linkedin: '#'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Head of Product',
      avatar: '👩‍💼',
      bio: 'Agricultural Engineer & UX Expert',
      linkedin: '#'
    },
    {
      id: 3,
      name: 'Arjun Patel',
      role: 'Lead Data Scientist',
      avatar: '👨‍💻',
      bio: 'PhD in Machine Learning',
      linkedin: '#'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Head of Sustainability',
      avatar: '👩‍🔬',
      bio: 'Environmental Scientist',
      linkedin: '#'
    }
  ];

  const achievements = [
    { label: 'Farms Served', value: 10000, suffix: '+', prefix: '' },
    { label: 'Accuracy Rate', value: 95, suffix: '%', prefix: '' },
    { label: 'Regions Covered', value: 25, suffix: '+', prefix: '' },
    { label: 'Active Users', value: 50000, suffix: '+', prefix: '' }
  ];

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

        // Trigger counter animations when stats section becomes visible
        if (elementId === 'stats-section' && !isVisible['stats-section']) {
          animateCounter(10000, 'farms');
          animateCounter(95, 'accuracy');
          animateCounter(25, 'regions');
          animateCounter(50000, 'users');
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
      introRef.current,
      missionRef.current,
      storyRef.current,
      techRef.current,
      statsRef.current,
      teamRef.current,
      ctaRef.current
    ].filter(Boolean);

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ===== COMPONENT SECTIONS =====

  const IntroSection = () => (
    <section 
      ref={introRef}
      id="intro-section"
      className="about-intro-section"
      aria-labelledby="intro-title"
    >
      <div className="about-background">
        <div className="floating-shape shape-1" aria-hidden="true"></div>
        <div className="floating-shape shape-2" aria-hidden="true"></div>
        <div className="floating-shape shape-3" aria-hidden="true"></div>
      </div>
      
      <div className="container">
        <div className={`intro-content ${isVisible['intro-section'] ? 'animate-in' : ''}`}>
          <div className="intro-badge">
            <span className="badge-icon">🌾</span>
            <span className="badge-text">About Climate Smart Agri</span>
          </div>
          
          <h1 id="intro-title" className="intro-title">
            Empowering Farmers with <span className="gradient-text">AI-Driven Insights</span>
          </h1>
          
          <p className="intro-description">
            We're revolutionizing agriculture through cutting-edge artificial intelligence, 
            making smart farming accessible to every farmer. Our platform combines advanced 
            technology with agricultural expertise to create sustainable, profitable, and 
            efficient farming solutions.
          </p>

          <div className="intro-highlights">
            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span className="highlight-text">AI-Powered Solutions</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span className="highlight-text">Sustainable Farming</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span className="highlight-text">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const MissionVisionSection = () => (
    <section 
      ref={missionRef}
      id="mission-section"
      className="mission-vision-section"
      aria-labelledby="mission-title"
    >
      <div className="container">
        <div className="section-header">
          <h2 id="mission-title" className="section-title">
            Our Mission & Vision
          </h2>
          <p className="section-subtitle">
            Driven by innovation, guided by sustainability, and focused on empowering farmers
          </p>
        </div>

        <div className={`mission-grid ${isVisible['mission-section'] ? 'animate-in' : ''}`}>
          {missionVision.map((item, index) => (
            <div 
              key={index} 
              className="mission-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mission-icon">{item.icon}</div>
              <h3 className="mission-title">{item.title}</h3>
              <p className="mission-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const StorySection = () => (
    <section 
      ref={storyRef}
      id="story-section"
      className="story-section"
      aria-labelledby="story-title"
    >
      <div className="container">
        <div className="story-content">
          <div className={`story-text ${isVisible['story-section'] ? 'animate-in' : ''}`}>
            <div className="story-badge">
              <span className="badge-icon">📖</span>
              <span className="badge-text">Our Story</span>
            </div>
            
            <h2 id="story-title" className="story-title">
              Who We Are
            </h2>
            
            <p className="story-paragraph">
              Founded in 2020 by a team of agricultural engineers, data scientists, and farmers, 
              Climate Smart Agri was born from a simple observation: traditional farming methods 
              weren't keeping pace with modern challenges like climate change, resource scarcity, 
              and increasing food demand.
            </p>
            
            <p className="story-paragraph">
              We started with a pilot project in rural Maharashtra, helping 50 farmers monitor 
              their crops using basic AI tools. The results were transformative — yield increased 
              by 35%, water usage dropped by 30%, and farmers gained confidence in their decisions.
            </p>
            
            <p className="story-paragraph">
              Today, we serve over 10,000 farms across 25+ regions, providing comprehensive 
              AI-powered solutions for animal detection, crop prediction, farm management, 
              and weather intelligence. Our mission remains unchanged: making smart farming 
              accessible to every farmer.
            </p>

            <div className="story-values">
              <div className="value-item">
                <span className="value-icon">💡</span>
                <span className="value-label">Innovation First</span>
              </div>
              <div className="value-item">
                <span className="value-icon">🌍</span>
                <span className="value-label">Sustainability</span>
              </div>
              <div className="value-item">
                <span className="value-icon">👥</span>
                <span className="value-label">Farmer-Centric</span>
              </div>
            </div>
          </div>
          
          <div className={`story-visual ${isVisible['story-section'] ? 'animate-in' : ''}`}>
            <div className="story-image-wrapper">
              <img 
                src="https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Farmers using smart agriculture technology in the field"
                className="story-image"
                loading="lazy"
              />
              <div className="story-overlay">
                <div className="overlay-stat">
                  <span className="overlay-number">2020</span>
                  <span className="overlay-label">Founded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const TechnologySection = () => (
    <section 
      ref={techRef}
      id="tech-section"
      className="technology-section"
      aria-labelledby="tech-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">⚡</span>
            <span className="badge-text">Our Technology</span>
          </div>
          <h2 id="tech-title" className="section-title">
            Powered by Advanced Technology
          </h2>
          <p className="section-subtitle">
            Combining AI, IoT, and data analytics to revolutionize agriculture
          </p>
        </div>

        <div className={`tech-grid ${isVisible['tech-section'] ? 'animate-in' : ''}`}>
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="tech-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="tech-icon-wrapper">
                <div className="tech-icon">{tech.icon}</div>
              </div>
              <h3 className="tech-title">{tech.title}</h3>
              <p className="tech-description">{tech.description}</p>
              
              <ul className="tech-features">
                {tech.features.map((feature, idx) => (
                  <li key={idx} className="tech-feature-item">
                    <span className="feature-bullet">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const StatsSection = () => (
    <section 
      ref={statsRef}
      id="stats-section"
      className="stats-section"
      aria-labelledby="stats-title"
    >
      <div className="container">
        <div className="section-header">
          <h2 id="stats-title" className="section-title light">
            Our Impact in Numbers
          </h2>
          <p className="section-subtitle light">
            Real results from farmers across the country
          </p>
        </div>

        <div className={`stats-grid ${isVisible['stats-section'] ? 'animate-in' : ''}`}>
          {achievements.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-number">
                {stat.prefix}
                {index === 0 ? counters.farms.toLocaleString() : 
                 index === 1 ? counters.accuracy : 
                 index === 2 ? counters.regions : 
                 counters.users.toLocaleString()}
                {stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const TeamSection = () => (
    <section 
      ref={teamRef}
      id="team-section"
      className="team-section"
      aria-labelledby="team-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">👥</span>
            <span className="badge-text">Meet Our Team</span>
          </div>
          <h2 id="team-title" className="section-title">
            Led by Industry Experts
          </h2>
          <p className="section-subtitle">
            A diverse team of engineers, scientists, and agricultural experts
          </p>
        </div>

        <div className={`team-grid ${isVisible['team-section'] ? 'animate-in' : ''}`}>
          {team.map((member, index) => (
            <div 
              key={member.id} 
              className="team-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="team-avatar">{member.avatar}</div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
              <a 
                href={member.linkedin} 
                className="team-link"
                aria-label={`Connect with ${member.name} on LinkedIn`}
              >
                <span className="link-icon">🔗</span>
                Connect
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CTASection = () => (
    <section 
      ref={ctaRef}
      id="cta-section"
      className="about-cta-section"
      aria-labelledby="cta-title"
    >
      <div className="container">
        <div className={`cta-content ${isVisible['cta-section'] ? 'animate-in' : ''}`}>
          <h2 id="cta-title" className="cta-title">
            Ready to Join the Smart Farming Revolution?
          </h2>
          <p className="cta-description">
            Discover how our AI-powered platform can transform your farm operations. 
            Get started with a free demo today.
          </p>
          
          <div className="cta-buttons">
            <Link to="/demo" className="cta-btn primary">
              <span className="btn-icon">🎯</span>
              Request Free Demo
            </Link>
            <Link to="/services" className="cta-btn secondary">
              <span className="btn-icon">🚀</span>
              Explore Services
            </Link>
          </div>

          <div className="cta-features">
            <div className="feature-badge">✓ No credit card required</div>
            <div className="feature-badge">✓ 30-day free trial</div>
            <div className="feature-badge">✓ Full feature access</div>
          </div>
        </div>
      </div>
    </section>
  );

  // ===== RENDER =====
  return (
    <div className="about-container">
      <main className="about-main" role="main">
        <IntroSection />
        <MissionVisionSection />
        <StorySection />
        <TechnologySection />
        <StatsSection />
        <TeamSection />
        <CTASection />
      </main>
    </div>
  );
};

export default About;
