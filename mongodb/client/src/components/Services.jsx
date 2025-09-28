import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  const [activeCard, setActiveCard] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState({});

  const toggleFeatures = (index) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const services = [
    {
      icon: '🚜',
      title: 'Farm Management System',
      description: 'Complete digital solution for managing your farm operations, from planning to harvest.',
      price: 'Free',
      period: '/forever',
      popular: true,
      link: '/farms',
      features: [
        'Real-time crop monitoring',
        'Equipment tracking',
        'Labor management',
        'Financial planning',
        'Weather integration',
        'Yield predictions'
      ]
    },
    {
      icon: '🌱',
      title: 'Crop Analytics & Prediction',
      description: 'AI-powered insights to optimize your crop selection and maximize yields.',
      price: 'Free',
      period: '/forever',
      link: '/predict',
      features: [
        'Crop recommendation engine',
        'Yield forecasting',
        'Disease detection',
        'Growth stage tracking',
        'Soil analysis integration',
        'Market price predictions'
      ]
    },
    {
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: 'Advanced weather monitoring and forecasting tailored for agriculture.',
      price: 'Free',
      period: '/forever',
      link: '/weather',
      features: [
        'Hyperlocal weather data',
        '15-day forecasts',
        'Severe weather alerts',
        'Irrigation recommendations',
        'Frost warnings',
        'Historical data analysis'
      ]
    },
    {
      icon: '🌰',
      title: 'Seed Management',
      description: 'Comprehensive seed inventory and quality tracking system.',
      price: 'Free',
      period: '/forever',
      link: '/seedList',
      features: [
        'Seed inventory tracking',
        'Quality monitoring',
        'Planting schedules',
        'Variety comparisons',
        'Storage management',
        'Purchase planning'
      ]
    },
    {
      icon: '📅',
      title: 'Planting Calendar',
      description: 'Optimize your planting schedule with intelligent timing recommendations.',
      price: 'Free',
      period: '/forever',
      link: '/plantingCal',
      features: [
        'Seasonal planning',
        'Crop rotation scheduling',
        'Weather-based timing',
        'Regional optimization',
        'Resource allocation',
        'Harvest planning'
      ]
    },
    {
      icon: '📋',
      title: 'Request Management',
      description: 'Streamline agricultural service requests and vendor management.',
      price: 'Free',
      period: '/forever',
      link: '/requestManager',
      features: [
        'Service requests',
        'Vendor coordination',
        'Status tracking',
        'Communication tools',
        'Quality assurance',
        'Payment processing'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: "📱",
      title: "Mobile App",
      description: "Access all features on-the-go with our mobile application"
    },
    {
      icon: "☁️",
      title: "Cloud Storage",
      description: "Secure cloud storage for all your farm data and documents"
    },
    {
      icon: "🤖",
      title: "AI Chatbot",
      description: "24/7 AI-powered farming assistant for instant help"
    },
    {
      icon: "📈",
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and reporting tools"
    },
    {
      icon: "🔗",
      title: "Third-party Integration",
      description: "Connect with existing farm equipment and software"
    },
    {
      icon: "🎓",
      title: "Training & Support",
      description: "Comprehensive training programs and 24/7 technical support"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Punjab, India",
      image: "👨‍🌾",
      text: "The weather analytics helped me save 30% on irrigation costs and increased my wheat yield by 25%.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      location: "Maharashtra, India", 
      image: "👩‍🌾",
      text: "Farm management system transformed how I track expenses. Now I know exactly where my money goes.",
      rating: 5
    },
    {
      name: "Mohan Singh",
      location: "Karnataka, India",
      image: "👨‍🌾",
      text: "Crop intelligence predicted a disease outbreak 2 weeks early. Saved my entire tomato crop!",
      rating: 5
    }
  ];

  return (
    <div className="services-container" style={{
      position: 'fixed !important',
      top: '0 !important',
      left: '0 !important',
      right: '0 !important',
      bottom: '0 !important',
      width: '100vw !important',
      height: '100vh !important',
      zIndex: '9999 !important',
      backgroundColor: '#f0fdf4 !important',
      paddingTop: '80px !important',
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif !important'
    }} id="services-page-container">
      {/* Hero Section */}
      <section className="services-hero" style={{
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important',
        color: 'white !important',
        padding: '60px 20px !important',
        textAlign: 'center !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem) !important',
            fontWeight: '800 !important',
            marginBottom: '20px !important',
            color: 'white !important',
            lineHeight: '1.2 !important'
          }}>
            🌱 Climate-Smart Agriculture Services
          </h1>
          <p className="hero-description" style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem) !important',
            marginBottom: '40px !important',
            maxWidth: '800px !important',
            margin: '0 auto 40px !important',
            color: 'white !important',
            lineHeight: '1.6 !important'
          }}>
            Empowering farmers with cutting-edge technology for sustainable and profitable farming. 
            From weather analytics to smart irrigation, we provide comprehensive digital solutions 
            for modern agriculture.
          </p>
          <div className="hero-stats" style={{
            display: 'flex !important',
            justifyContent: 'center !important',
            gap: '40px !important',
            flexWrap: 'wrap !important'
          }}>
            <div className="stat-item">
              <h3 style={{ 
                fontSize: '2.5rem !important', 
                fontWeight: '900 !important', 
                margin: '0 0 5px !important',
                color: 'white !important'
              }}>10,000+</h3>
              <p style={{ 
                margin: '0 !important',
                color: 'white !important'
              }}>Happy Farmers</p>
            </div>
            <div className="stat-item">
              <h3 style={{ 
                fontSize: '2.5rem !important', 
                fontWeight: '900 !important', 
                margin: '0 0 5px !important',
                color: 'white !important'
              }}>2.5M+</h3>
              <p style={{ 
                margin: '0 !important',
                color: 'white !important'
              }}>Acres Managed</p>
            </div>
            <div className="stat-item">
              <h3 style={{ 
                fontSize: '2.5rem !important', 
                fontWeight: '900 !important', 
                margin: '0 0 5px !important',
                color: 'white !important'
              }}>35%</h3>
              <p style={{ 
                margin: '0 !important',
                color: 'white !important'
              }}>Avg. Yield Increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section" style={{
        padding: '60px 20px !important',
        maxWidth: '1400px !important',
        margin: '0 auto !important',
        backgroundColor: 'white !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="section-header" style={{
          textAlign: 'center !important',
          marginBottom: '60px !important'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem) !important',
            fontWeight: '700 !important',
            color: '#111827 !important',
            marginBottom: '20px !important',
            lineHeight: '1.3 !important'
          }}>Our Premium Services</h2>
          <p style={{
            fontSize: '1.2rem !important',
            color: '#4b5563 !important',
            margin: '0 !important',
            lineHeight: '1.6 !important'
          }}>Choose from our comprehensive range of agricultural technology solutions</p>
        </div>
        
        <div className="services-grid" style={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr)) !important',
          gap: '30px !important',
          marginTop: '40px !important',
          width: '100% !important'
        }}>
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`service-card ${service.popular ? 'popular' : ''}`}
              style={{
                background: 'white !important',
                borderRadius: '20px !important',
                padding: '30px !important',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important',
                cursor: 'pointer !important',
                position: 'relative !important',
                border: service.popular ? '2px solid #f9a825 !important' : '2px solid transparent !important',
                minHeight: '450px !important',
                display: 'block !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                transform: 'none !important',
                transition: 'all 0.3s ease !important',
                boxSizing: 'border-box !important'
              }}
            >
              {service.popular && (
                <div className="popular-badge" style={{
                  position: 'absolute !important',
                  top: '-2px !important',
                  right: '30px !important',
                  background: '#f9a825 !important',
                  color: 'white !important',
                  padding: '4px 16px !important',
                  borderRadius: '0 0 8px 8px !important',
                  fontSize: '0.85rem !important',
                  fontWeight: '600 !important',
                  zIndex: '10 !important'
                }}>Most Popular</div>
              )}
              <div className="service-icon" style={{
                fontSize: '3rem !important',
                marginBottom: '20px !important',
                display: 'block !important'
              }}>{service.icon}</div>
              <h3 className="service-title" style={{
                fontSize: '1.5rem !important',
                fontWeight: '700 !important',
                color: '#111827 !important',
                marginBottom: '15px !important',
                lineHeight: '1.4 !important'
              }}>{service.title}</h3>
              <p className="service-description" style={{
                color: '#4b5563 !important',
                marginBottom: '20px !important',
                lineHeight: '1.6 !important'
              }}>{service.description}</p>
              <div className="service-price" style={{
                fontSize: '1.8rem !important',
                fontWeight: '800 !important',
                color: '#22c55e !important',
                marginBottom: '20px !important',
                textAlign: 'center !important',
                padding: '15px !important',
                background: '#f0fdf4 !important',
                borderRadius: '12px !important'
              }}>{service.price}</div>
              
              <div className={`service-features`} style={{
                maxHeight: '300px !important',
                overflow: 'visible !important',
                marginBottom: '20px !important'
              }}>
                <h4 style={{
                  fontWeight: '600 !important',
                  color: '#374151 !important',
                  marginBottom: '15px !important'
                }}>Features included:</h4>
                <ul style={{
                  listStyle: 'none !important',
                  padding: '0 !important',
                  margin: '0 !important'
                }}>
                  {service.features.map((feature, index) => (
                    <li key={index} style={{
                      padding: '4px 0 !important',
                      color: '#374151 !important',
                      position: 'relative !important',
                      paddingLeft: '20px !important'
                    }}>
                      <span style={{
                        position: 'absolute !important',
                        left: '0 !important',
                        color: '#22c55e !important',
                        fontWeight: 'bold !important'
                      }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link 
                to={service.link} 
                className="service-btn" 
                style={{
                  display: 'inline-block !important',
                  width: '100% !important',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a) !important',
                  color: 'white !important',
                  border: 'none !important',
                  padding: '15px 30px !important',
                  borderRadius: '50px !important',
                  fontWeight: '600 !important',
                  fontSize: '1rem !important',
                  cursor: 'pointer !important',
                  transition: 'all 0.3s ease !important',
                  textDecoration: 'none !important',
                  textAlign: 'center !important',
                  boxSizing: 'border-box !important'
                }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features */}
      <section className="additional-features" style={{
        background: '#f9fafb !important',
        padding: '60px 20px !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="section-header" style={{
          textAlign: 'center !important',
          marginBottom: '60px !important'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem) !important',
            fontWeight: '700 !important',
            color: '#111827 !important',
            marginBottom: '20px !important',
            lineHeight: '1.3 !important'
          }}>Additional Features & Benefits</h2>
          <p style={{
            fontSize: '1.2rem !important',
            color: '#4b5563 !important',
            margin: '0 !important',
            lineHeight: '1.6 !important'
          }}>Everything you need for comprehensive farm management</p>
        </div>
        
        <div className="features-grid" style={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)) !important',
          gap: '30px !important',
          maxWidth: '1200px !important',
          margin: '0 auto !important'
        }}>
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="feature-item" style={{
              background: 'white !important',
              padding: '30px !important',
              borderRadius: '16px !important',
              textAlign: 'center !important',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important',
              border: '1px solid #e5e7eb !important',
              display: 'block !important',
              visibility: 'visible !important',
              opacity: '1 !important'
            }}>
              <div className="feature-icon" style={{
                fontSize: '2.5rem !important',
                marginBottom: '15px !important',
                display: 'block !important'
              }}>{feature.icon}</div>
              <h4 style={{
                fontSize: '1.3rem !important',
                fontWeight: '600 !important',
                color: '#111827 !important',
                marginBottom: '15px !important',
                lineHeight: '1.4 !important'
              }}>{feature.title}</h4>
              <p style={{
                color: '#4b5563 !important',
                margin: '0 !important',
                lineHeight: '1.6 !important'
              }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" style={{
        padding: '60px 20px !important',
        background: 'white !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="section-header" style={{
          textAlign: 'center !important',
          marginBottom: '60px !important'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem) !important',
            fontWeight: '700 !important',
            color: '#111827 !important',
            marginBottom: '20px !important',
            lineHeight: '1.3 !important'
          }}>How It Works</h2>
          <p style={{
            fontSize: '1.2rem !important',
            color: '#4b5563 !important',
            margin: '0 !important',
            lineHeight: '1.6 !important'
          }}>Get started with our platform in just a few simple steps</p>
        </div>
        
        <div className="steps-container" style={{
          maxWidth: '1000px !important',
          margin: '0 auto !important',
          display: 'grid !important',
          gap: '30px !important'
        }}>
          {[
            { num: 1, title: "Sign Up & Setup", desc: "Create your account and add your farm details, including location, crop types, and farm size." },
            { num: 2, title: "Choose Your Services", desc: "Select the services that best fit your farming needs and budget requirements." },
            { num: 3, title: "Start Farming Smart", desc: "Begin using our tools to monitor, manage, and optimize your farming operations." },
            { num: 4, title: "Track & Improve", desc: "Monitor your progress, analyze data, and continuously improve your farming practices." }
          ].map((step, index) => (
            <div key={index} className="step-item" style={{
              display: 'flex !important',
              alignItems: 'center !important',
              gap: '30px !important',
              padding: '30px !important',
              background: '#f0fdf4 !important',
              borderRadius: '16px !important',
              boxSizing: 'border-box !important'
            }}>
              <div className="step-number" style={{
                flexShrink: '0 !important',
                width: '60px !important',
                height: '60px !important',
                borderRadius: '50% !important',
                background: 'linear-gradient(135deg, #22c55e, #16a34a) !important',
                color: 'white !important',
                display: 'flex !important',
                alignItems: 'center !important',
                justifyContent: 'center !important',
                fontSize: '1.5rem !important',
                fontWeight: '800 !important'
              }}>{step.num}</div>
              <div className="step-content">
                <h4 style={{
                  fontSize: '1.4rem !important',
                  fontWeight: '600 !important',
                  color: '#111827 !important',
                  marginBottom: '8px !important',
                  lineHeight: '1.4 !important'
                }}>{step.title}</h4>
                <p style={{
                  color: '#4b5563 !important',
                  margin: '0 !important',
                  lineHeight: '1.6 !important'
                }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" style={{
        background: '#f9fafb !important',
        padding: '60px 20px !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="section-header" style={{
          textAlign: 'center !important',
          marginBottom: '60px !important'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem) !important',
            fontWeight: '700 !important',
            color: '#111827 !important',
            marginBottom: '20px !important',
            lineHeight: '1.3 !important'
          }}>What Our Farmers Say</h2>
          <p style={{
            fontSize: '1.2rem !important',
            color: '#4b5563 !important',
            margin: '0 !important',
            lineHeight: '1.6 !important'
          }}>Real stories from farmers who transformed their operations with our services</p>
        </div>
        
        <div className="testimonials-grid" style={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)) !important',
          gap: '30px !important',
          maxWidth: '1200px !important',
          margin: '0 auto !important'
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card" style={{
              background: 'white !important',
              padding: '30px !important',
              borderRadius: '16px !important',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important',
              borderLeft: '4px solid #22c55e !important',
              display: 'block !important',
              visibility: 'visible !important',
              opacity: '1 !important'
            }}>
              <div className="testimonial-header" style={{
                display: 'flex !important',
                alignItems: 'center !important',
                gap: '15px !important',
                marginBottom: '20px !important'
              }}>
                <div className="testimonial-avatar" style={{
                  fontSize: '2.5rem !important',
                  width: '60px !important',
                  height: '60px !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  background: '#f0fdf4 !important',
                  borderRadius: '50% !important'
                }}>{testimonial.image}</div>
                <div className="testimonial-info">
                  <h4 style={{
                    fontWeight: '600 !important',
                    color: '#111827 !important',
                    marginBottom: '4px !important',
                    lineHeight: '1.4 !important'
                  }}>{testimonial.name}</h4>
                  <p style={{
                    color: '#4b5563 !important',
                    fontSize: '0.9rem !important',
                    marginBottom: '4px !important',
                    lineHeight: '1.4 !important'
                  }}>{testimonial.location}</p>
                  <div className="rating" style={{ fontSize: '0.9rem !important' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="testimonial-text" style={{
                color: '#374151 !important',
                fontStyle: 'italic !important',
                lineHeight: '1.6 !important',
                margin: '0 !important',
                fontSize: '1.05rem !important'
              }}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important',
        color: 'white !important',
        padding: '60px 20px !important',
        textAlign: 'center !important',
        width: '100% !important',
        boxSizing: 'border-box !important'
      }}>
        <div className="cta-content" style={{
          maxWidth: '800px !important',
          margin: '0 auto !important'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem) !important',
            fontWeight: '800 !important',
            marginBottom: '20px !important',
            color: 'white !important',
            lineHeight: '1.3 !important'
          }}>Ready to Transform Your Farm?</h2>
          <p style={{
            fontSize: '1.2rem !important',
            marginBottom: '40px !important',
            color: 'white !important',
            lineHeight: '1.6 !important'
          }}>Join thousands of farmers already using our platform to increase yields and reduce costs.</p>
          <div className="cta-buttons" style={{
            display: 'flex !important',
            gap: '20px !important',
            justifyContent: 'center !important',
            flexWrap: 'wrap !important',
            marginBottom: '30px !important'
          }}>
            <button className="cta-btn primary" style={{
              padding: '15px 30px !important',
              borderRadius: '50px !important',
              fontWeight: '600 !important',
              fontSize: '1.1rem !important',
              cursor: 'pointer !important',
              border: '2px solid white !important',
              background: 'white !important',
              color: '#22c55e !important',
              transition: 'all 0.3s ease !important'
            }}>Start Free Trial</button>
            <button className="cta-btn secondary" style={{
              padding: '15px 30px !important',
              borderRadius: '50px !important',
              fontWeight: '600 !important',
              fontSize: '1.1rem !important',
              cursor: 'pointer !important',
              background: 'transparent !important',
              color: 'white !important',
              border: '2px solid white !important',
              transition: 'all 0.3s ease !important'
            }}>Schedule Demo</button>
          </div>
          <p className="cta-note" style={{
            fontSize: '1rem !important',
            margin: '0 !important',
            padding: '15px !important',
            background: 'rgba(255, 255, 255, 0.1) !important',
            borderRadius: '12px !important',
            border: '1px solid rgba(255, 255, 255, 0.2) !important',
            color: 'white !important',
            lineHeight: '1.5 !important'
          }}>
            🎁 Special Offer: Get 30 days free trial + personal onboarding session
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;
