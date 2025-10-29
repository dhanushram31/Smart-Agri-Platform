// Utility functions for Labour Hub

/**
 * Get user's current location using browser geolocation API
 * @returns {Promise} Promise that resolves with coordinates {lat, lng}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};

/**
 * Get address from coordinates (mock implementation)
 * In a real application, you would use a geocoding API like Google Maps
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise} Promise that resolves with address string
 */
export const reverseGeocode = async (lat, lng) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }, 500);
  });
};

/**
 * Mock API endpoints for job management
 */
export const jobAPI = {
  /**
   * Get all jobs
   * @returns {Promise} Promise that resolves with jobs array
   */
  getJobs: async () => {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: 'Harvesting Corn',
            workType: 'harvesting',
            location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
            dateTime: '2024-01-20T08:00:00',
            payment: { amount: 150, type: 'daily' },
            notes: 'Experience with corn harvesting preferred. Own transportation required.',
            farmOwner: { name: 'John Smith', phone: '+1234567890', email: 'john@farm.com' },
            applicants: [],
            status: 'active',
            createdAt: '2024-01-15T10:00:00'
          },
          {
            id: 2,
            title: 'Vegetable Planting',
            workType: 'planting',
            location: { lat: 40.7580, lng: -73.9855, address: 'Manhattan, NY' },
            dateTime: '2024-01-22T07:00:00',
            payment: { amount: 18, type: 'hourly' },
            notes: 'Planting seasonal vegetables. 8-hour shift.',
            farmOwner: { name: 'Maria Garcia', phone: '+1234567891', email: 'maria@farm.com' },
            applicants: [],
            status: 'active',
            createdAt: '2024-01-15T11:00:00'
          }
        ]);
      }, 500);
    });
  },

  /**
   * Create a new job posting
   * @param {Object} jobData - Job data to create
   * @returns {Promise} Promise that resolves with created job
   */
  createJob: async (jobData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newJob = {
          id: Date.now(),
          ...jobData,
          status: 'active',
          createdAt: new Date().toISOString(),
          applicants: []
        };
        resolve(newJob);
      }, 500);
    });
  },

  /**
   * Apply to a job
   * @param {number} jobId - Job ID to apply to
   * @param {Object} applicationData - Application data
   * @returns {Promise} Promise that resolves with application
   */
  applyToJob: async (jobId, applicationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const application = {
          id: Date.now(),
          jobId,
          ...applicationData,
          status: 'pending',
          appliedAt: new Date().toISOString()
        };
        resolve(application);
      }, 500);
    });
  },

  /**
   * Get applications for a job
   * @param {number} jobId - Job ID
   * @returns {Promise} Promise that resolves with applications array
   */
  getJobApplications: async (jobId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 300);
    });
  }
};

/**
 * Browser notification utility
 */
export const notifications = {
  /**
   * Request notification permission
   * @returns {Promise} Promise that resolves with permission status
   */
  requestPermission: async () => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  },

  /**
   * Show a notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   */
  show: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  },

  /**
   * Show job notification for workers
   * @param {Object} job - Job data
   */
  showJobNotification: (job) => {
    notifications.show(`New Job Available: ${job.title}`, {
      body: `${job.workType} work at ${job.location.address}\nPayment: $${job.payment.amount}/${job.payment.type}`,
      tag: `job-${job.id}`
    });
  },

  /**
   * Show application notification for farmers
   * @param {Object} application - Application data
   */
  showApplicationNotification: (application) => {
    notifications.show('New Job Application', {
      body: `${application.name} applied for your job`,
      tag: `application-${application.id}`
    });
  }
};

/**
 * Local storage utilities for Labour Hub
 */
export const storage = {
  /**
   * Save user role preference
   * @param {string} role - User role ('farmer' or 'worker')
   */
  saveUserRole: (role) => {
    localStorage.setItem('labourHubUserRole', role);
  },

  /**
   * Get user role preference
   * @returns {string|null} User role or null
   */
  getUserRole: () => {
    return localStorage.getItem('labourHubUserRole');
  },

  /**
   * Clear user role preference
   */
  clearUserRole: () => {
    localStorage.removeItem('labourHubUserRole');
  },

  /**
   * Save user location
   * @param {Object} location - Location data {lat, lng}
   */
  saveUserLocation: (location) => {
    localStorage.setItem('labourHubUserLocation', JSON.stringify(location));
  },

  /**
   * Get user location
   * @returns {Object|null} Location data or null
   */
  getUserLocation: () => {
    const location = localStorage.getItem('labourHubUserLocation');
    return location ? JSON.parse(location) : null;
  },

  /**
   * Save user preferences
   * @param {Object} preferences - User preferences
   */
  saveUserPreferences: (preferences) => {
    localStorage.setItem('labourHubPreferences', JSON.stringify(preferences));
  },

  /**
   * Get user preferences
   * @returns {Object} User preferences
   */
  getUserPreferences: () => {
    const prefs = localStorage.getItem('labourHubPreferences');
    return prefs ? JSON.parse(prefs) : {
      maxDistance: 50,
      preferredWorkTypes: [],
      minPayment: '',
      notifications: true
    };
  }
};

/**
 * Date and time utilities
 */
export const dateUtils = {
  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate: (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Format time for display
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted time string
   */
  formatTime: (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Check if date is in the future
   * @param {string|Date} date - Date to check
   * @returns {boolean} True if date is in the future
   */
  isFutureDate: (date) => {
    return new Date(date) > new Date();
  },

  /**
   * Get relative time string (e.g., "2 hours ago", "in 3 days")
   * @param {string|Date} date - Date to compare
   * @returns {string} Relative time string
   */
  getRelativeTime: (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = d - now;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (Math.abs(diffMinutes) < 60) {
      return diffMinutes > 0 ? `in ${diffMinutes}m` : `${Math.abs(diffMinutes)}m ago`;
    } else if (Math.abs(diffHours) < 24) {
      return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
    } else {
      return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
    }
  }
};
