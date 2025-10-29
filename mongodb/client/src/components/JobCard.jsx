import React from 'react';
import { MapPin, Clock, DollarSign, User, Navigation } from 'lucide-react';

const JobCard = ({ job, userLocation, onApply, calculateDistance }) => {
  const getDistance = () => {
    if (!userLocation) return null;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      job.location.lat,
      job.location.lng
    );
    return distance.toFixed(1);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getWorkTypeColor = (workType) => {
    const colors = {
      harvesting: '#f59e0b',
      planting: '#10b981',
      irrigation: '#3b82f6',
      pesticide: '#ef4444',
      maintenance: '#6b7280',
      livestock: '#8b5cf6',
      packaging: '#f97316',
      general: '#64748b'
    };
    return colors[workType] || '#6b7280';
  };

  const distance = getDistance();
  const { date, time } = formatDateTime(job.dateTime);

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <span 
            className="job-type-badge"
            style={{ backgroundColor: getWorkTypeColor(job.workType) }}
          >
            {job.workType}
          </span>
        </div>
        {distance && (
          <div className="job-distance">
            <Navigation size={16} />
            <span>{distance} km</span>
          </div>
        )}
      </div>

      <div className="job-details">
        <div className="job-detail">
          <MapPin size={16} />
          <span>{job.location.address}</span>
        </div>
        
        <div className="job-detail">
          <Clock size={16} />
          <div className="datetime">
            <span className="date">{date}</span>
            <span className="time">{time}</span>
          </div>
        </div>
        
        <div className="job-detail payment-detail">
          <DollarSign size={16} />
          <span className="payment-amount">
            ₹{job.payment.amount}
            <span className="payment-type">/{job.payment.type}</span>
          </span>
        </div>

        <div className="job-detail">
          <User size={16} />
          <span>{job.farmOwner.name}</span>
        </div>
      </div>

      {job.notes && (
        <div className="job-notes">
          <p>{job.notes}</p>
        </div>
      )}

      <div className="job-card-footer">
        <div className="job-stats">
          <span className="applicants-count">
            {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <button 
          className="apply-btn"
          onClick={() => onApply(job)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
