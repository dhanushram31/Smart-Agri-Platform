import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Filter, Search, Bell, CheckCircle, XCircle, User, Briefcase } from 'lucide-react';
import JobForm from './JobForm';
import JobCard from './JobCard';
import ApplicationModal from './ApplicationModal';
import './LabourHub.css';

const LabourHub = () => {
  const [userRole, setUserRole] = useState(null); // 'farmer' or 'worker'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFarmerJob, setSelectedFarmerJob] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    workType: '',
    dateRange: '',
    maxDistance: 50,
    minPayment: '',
    maxPayment: ''
  });

  // Mock data for jobs with Indian locations
  const mockJobs = [
    {
      id: 1,
      title: 'Harvesting Corn',
      workType: 'harvesting',
      location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi, India' },
      dateTime: '2025-08-20T08:00:00',
      payment: { amount: 1200, type: 'daily' },
      notes: 'Experience with corn harvesting preferred. Own transportation required.',
      farmOwner: { name: 'John Smith', phone: '+91-9876543210', email: 'john@farm.com' },
      applicants: []
    },
    {
      id: 2,
      title: 'Vegetable Planting',
      workType: 'planting',
      location: { lat: 28.7041, lng: 77.1025, address: 'Gurgaon, Haryana, India' },
      dateTime: '2025-08-22T07:00:00',
      payment: { amount: 150, type: 'hourly' },
      notes: 'Planting seasonal vegetables. 8-hour shift.',
      farmOwner: { name: 'Maria Garcia', phone: '+91-9876543211', email: 'maria@farm.com' },
      applicants: []
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setJobs(mockJobs);
    getUserLocation();
    initializeNotifications();
  }, []);

  const initializeNotifications = () => {
    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'job',
        title: 'New Job Posted',
        message: 'Harvesting job available 5km away',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: 2,
        type: 'application',
        title: 'Application Received',
        message: 'Someone applied to your Vegetable Planting job',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];
    setNotifications(mockNotifications);
  };

  const getUserLocation = () => {
    console.log('Getting user location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location obtained:', location);
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Delhi coordinates (change to your preferred location)
          const fallbackLocation = { lat: 28.6139, lng: 77.2090 };
          console.log('Using fallback location:', fallbackLocation);
          setUserLocation(fallbackLocation);
        }
      );
    } else {
      // Fallback location for browsers without geolocation
      const fallbackLocation = { lat: 28.6139, lng: 77.2090 };
      console.log('Geolocation not supported, using fallback:', fallbackLocation);
      setUserLocation(fallbackLocation);
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getFilteredJobs = () => {
    console.log('Filtering jobs with filters:', filters);
    console.log('Available jobs:', jobs);
    console.log('User location:', userLocation);
    
    let filtered = jobs.filter(job => {
      console.log(`Checking job: ${job.title}`);
      
      // Search filter
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !job.workType.toLowerCase().includes(filters.search.toLowerCase())) {
        console.log(`Job ${job.title} filtered out by search`);
        return false;
      }

      // Work type filter
      if (filters.workType && job.workType !== filters.workType) {
        console.log(`Job ${job.title} filtered out by work type`);
        return false;
      }

      // Distance filter
      if (userLocation && filters.maxDistance && 
          job.location && job.location.lat !== 0 && job.location.lng !== 0) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          job.location.lat, job.location.lng
        );
        console.log(`Distance for job ${job.title}: ${distance.toFixed(2)}km (max: ${filters.maxDistance}km)`);
        if (distance > filters.maxDistance) {
          console.log(`Job ${job.title} filtered out by distance`);
          return false;
        }
      }

      // Payment filter
      if (filters.minPayment && filters.minPayment !== '') {
        const minPay = parseInt(filters.minPayment);
        const jobAmount = parseInt(job.payment.amount);
        console.log(`Min payment filter: ${minPay} <= ${jobAmount}?`);
        if (isNaN(minPay) || isNaN(jobAmount) || jobAmount < minPay) {
          console.log(`Job ${job.title} filtered out by min payment`);
          return false;
        }
      }
      if (filters.maxPayment && filters.maxPayment !== '') {
        const maxPay = parseInt(filters.maxPayment);
        const jobAmount = parseInt(job.payment.amount);
        console.log(`Max payment filter: ${jobAmount} <= ${maxPay}?`);
        if (isNaN(maxPay) || isNaN(jobAmount) || jobAmount > maxPay) {
          console.log(`Job ${job.title} filtered out by max payment`);
          return false;
        }
      }

      console.log(`Job ${job.title} passed all filters`);
      return true;
    });

    console.log('Filtered jobs:', filtered);

    // Sort by distance if location available
    if (userLocation) {
      filtered = filtered.sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.lat, userLocation.lng,
          a.location.lat, a.location.lng
        );
        const distanceB = calculateDistance(
          userLocation.lat, userLocation.lng,
          b.location.lat, b.location.lng
        );
        return distanceA - distanceB;
      });
    }

    return filtered;
  };

  const handleJobSubmit = (jobData) => {
    console.log('Job data received:', jobData);
    
    // Ensure location has valid coordinates
    let validLocation = jobData.location;
    if (!validLocation || validLocation.lat === 0 || validLocation.lng === 0) {
      // Use user's current location as fallback
      if (userLocation) {
        validLocation = {
          ...userLocation,
          address: jobData.location?.address || 'Current Location'
        };
      } else {
        // Default fallback location (you can change this to your area)
        validLocation = {
          lat: 28.6139, // Delhi coordinates as example
          lng: 77.2090,
          address: jobData.location?.address || 'Location not specified'
        };
      }
    }

    const newJob = {
      id: Date.now(),
      ...jobData,
      location: validLocation,
      payment: {
        amount: parseInt(jobData.payment.amount), // Ensure amount is a number
        type: jobData.payment.type
      },
      farmOwner: { 
        name: 'Current User', 
        phone: '+91-9876543210', // Updated to Indian format
        email: 'user@farm.com' 
      },
      applicants: []
    };
    
    console.log('New job created:', newJob);
    setJobs([...jobs, newJob]);
    setShowJobForm(false);
  };

  const handleJobApplication = (applicationData) => {
    const newApplication = {
      id: Date.now(),
      jobId: selectedJob.id,
      ...applicationData,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    
    setApplications([...applications, newApplication]);
    
    // Update job with new applicant
    setJobs(jobs.map(job => 
      job.id === selectedJob.id 
        ? { ...job, applicants: [...job.applicants, newApplication] }
        : job
    ));
    
    // Add notification for farmer
    const newNotification = {
      id: Date.now() + 1,
      type: 'application',
      title: 'New Application',
      message: `${applicationData.name} applied to your ${selectedJob.title} job`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
    
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // Mark all notifications as read
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleViewApplications = (job) => {
    setSelectedFarmerJob(job);
    setShowApplicationsModal(true);
  };

  const NotificationDropdown = () => (
    <div className={`notification-dropdown ${showNotifications ? 'show' : ''}`}>
      <div className="notification-header">
        <h4>Notifications</h4>
        <span className="notification-count">{notifications.filter(n => !n.read).length}</span>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
              <div className="notification-content">
                <h5>{notif.title}</h5>
                <p>{notif.message}</p>
                <span className="notification-time">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ApplicationsModal = () => (
    <div className="modal-overlay">
      <div className="modal-content applications-modal">
        <div className="modal-header">
          <h2>Applications for {selectedFarmerJob?.title}</h2>
          <button 
            className="close-btn" 
            onClick={() => setShowApplicationsModal(false)}
          >
            ✕
          </button>
        </div>
        <div className="applications-content">
          {selectedFarmerJob?.applicants?.length === 0 ? (
            <div className="no-applications">
              <p>No applications received yet.</p>
            </div>
          ) : (
            selectedFarmerJob?.applicants?.map(applicant => (
              <div key={applicant.id} className="applicant-card">
                <div className="applicant-header">
                  <h4>{applicant.name}</h4>
                  <span className={`status-badge ${applicant.status}`}>
                    {applicant.status}
                  </span>
                </div>
                <div className="applicant-details">
                  <div className="contact-info">
                    <p><strong>Phone:</strong> {applicant.phone}</p>
                    <p><strong>Email:</strong> {applicant.email}</p>
                    <p><strong>Experience:</strong> {applicant.experience || 'Not specified'}</p>
                  </div>
                  {applicant.skills && (
                    <div className="skills">
                      <strong>Skills:</strong> {applicant.skills}
                    </div>
                  )}
                  {applicant.notes && (
                    <div className="applicant-notes">
                      <strong>Message:</strong>
                      <p>{applicant.notes}</p>
                    </div>
                  )}
                  <div className="application-actions">
                    <button className="btn-primary">Accept</button>
                    <button className="btn-secondary">Reject</button>
                    <button className="btn-secondary">Contact</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const RoleSelector = () => (
    <div className="role-selector-container">
      <div className="role-selector">
        <h1 className="role-selector-title">Welcome to Labour Hub</h1>
        <p className="role-selector-subtitle">Choose your role to get started</p>
        
        <div className="role-options">
          <button
            className="role-option farmer-role"
            onClick={() => setUserRole('farmer')}
          >
            <div className="role-icon">
              <Briefcase size={48} />
            </div>
            <h3>Farm Owner</h3>
            <p>Post jobs and find workers for your farm</p>
          </button>
          
          <button
            className="role-option worker-role"
            onClick={() => setUserRole('worker')}
          >
            <div className="role-icon">
              <User size={48} />
            </div>
            <h3>Labour (Worker)</h3>
            <p>Find agricultural work opportunities</p>
          </button>
        </div>
      </div>
    </div>
  );

  const FarmerView = () => (
    <div className="farmer-view">
      <div className="farmer-header">
        <h1>Farm Owner Dashboard</h1>
        <div className="farmer-actions">
          <button
            className="btn-primary"
            onClick={() => setShowJobForm(true)}
          >
            <Briefcase size={20} />
            Post New Job
          </button>
          <div className="notification-container">
            <button 
              className="btn-secondary notification-btn"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <NotificationDropdown />
          </div>
        </div>
      </div>

      <div className="farmer-stats">
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-number">{jobs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{applications.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Jobs</h3>
          <p className="stat-number">0</p>
        </div>
      </div>

      <div className="jobs-section">
        <h2>Your Posted Jobs</h2>
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="farmer-job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.workType}</span>
              </div>
              <div className="job-details">
                <div className="job-detail">
                  <MapPin size={16} />
                  <span>{job.location.address}</span>
                </div>
                <div className="job-detail">
                  <Clock size={16} />
                  <span>{new Date(job.dateTime).toLocaleDateString()}</span>
                </div>
                <div className="job-detail">
                  <DollarSign size={16} />
                  <span>₹{job.payment.amount}/{job.payment.type}</span>
                </div>
              </div>
              <div className="job-applicants">
                <span>{job.applicants.length} applicant(s)</span>
                <button 
                  className="btn-secondary"
                  onClick={() => handleViewApplications(job)}
                >
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showJobForm && (
        <JobForm
          onSubmit={handleJobSubmit}
          onClose={() => setShowJobForm(false)}
          userLocation={userLocation}
        />
      )}

      {showApplicationsModal && <ApplicationsModal />}
    </div>
  );

  const WorkerView = () => (
    <div className="worker-view">
      <div className="worker-header">
        <h1>Available Jobs</h1>
        <div className="worker-actions">
          <div className="notification-container">
            <button 
              className="btn-secondary notification-btn"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <NotificationDropdown />
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <div className="filters">
          <select
            value={filters.workType}
            onChange={(e) => setFilters({...filters, workType: e.target.value})}
          >
            <option value="">All Work Types</option>
            <option value="harvesting">Harvesting</option>
            <option value="planting">Planting</option>
            <option value="irrigation">Irrigation</option>
            <option value="pesticide">Pesticide Spraying</option>
            <option value="maintenance">Farm Maintenance</option>
          </select>

          <input
            type="range"
            min="1"
            max="100"
            value={filters.maxDistance}
            onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
            title={`Max Distance: ${filters.maxDistance}km`}
          />
          <span>{filters.maxDistance}km</span>

          <input
            type="number"
            placeholder="Min Pay"
            value={filters.minPayment}
            onChange={(e) => setFilters({...filters, minPayment: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Pay"
            value={filters.maxPayment}
            onChange={(e) => setFilters({...filters, maxPayment: e.target.value})}
          />
        </div>
      </div>

      <div className="jobs-section">
        <div className="jobs-grid">
          {getFilteredJobs().map(job => (
            <JobCard
              key={job.id}
              job={job}
              userLocation={userLocation}
              onApply={(job) => {
                setSelectedJob(job);
                setShowApplicationModal(true);
              }}
              calculateDistance={calculateDistance}
            />
          ))}
        </div>
      </div>

      {showApplicationModal && (
        <ApplicationModal
          job={selectedJob}
          onSubmit={handleJobApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );

  return (
    <div className="labour-hub">
      {!userRole && <RoleSelector />}
      {userRole === 'farmer' && <FarmerView />}
      {userRole === 'worker' && <WorkerView />}
      
      <button
        className="role-switch-btn"
        onClick={() => setUserRole(null)}
        title="Switch Role"
      >
        Switch Role
      </button>
    </div>
  );
};

export default LabourHub;
