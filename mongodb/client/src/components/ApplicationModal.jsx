import React, { useState } from 'react';
import { X, User, Phone, Mail, FileText, Award } from 'lucide-react';

const ApplicationModal = ({ job, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    skills: '',
    availability: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    onSubmit(formData);
  };

  const skillSuggestions = [
    'Harvesting', 'Planting', 'Irrigation', 'Pesticide Application',
    'Tractor Operation', 'Livestock Care', 'Organic Farming',
    'Equipment Maintenance', 'Crop Monitoring', 'Greenhouse Work'
  ];

  const handleSkillSelect = (skill) => {
    const currentSkills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      setFormData(prev => ({
        ...prev,
        skills: newSkills
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content application-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>Apply for Job</h2>
            <p className="job-title">{job.title}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <User size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-with-icon">
                <Phone size={20} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Experience & Skills</h3>
            
            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years (Beginner)</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years (Expert)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills & Expertise</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="List your relevant skills (e.g., Harvesting, Tractor Operation, Irrigation)"
                rows="3"
              />
              <div className="skill-suggestions">
                <span className="suggestions-label">Quick add:</span>
                {skillSuggestions.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    className="skill-suggestion"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
              >
                <option value="">Select availability</option>
                <option value="immediate">Immediate</option>
                <option value="1-week">Within 1 week</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="notes">Cover Message</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tell the farm owner why you're a good fit for this job..."
                rows="4"
              />
            </div>
          </div>

          <div className="job-summary">
            <h4>Job Summary</h4>
            <div className="summary-details">
              <div className="summary-item">
                <span className="label">Work Type:</span>
                <span className="value">{job.workType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(job.dateTime).toLocaleDateString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Payment:</span>
                <span className="value">₹{job.payment.amount}/{job.payment.type}</span>
              </div>
              <div className="summary-item">
                <span className="label">Location:</span>
                <span className="value">{job.location.address}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
