import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';

const JobForm = ({ onSubmit, onClose, userLocation }) => {
  const [formData, setFormData] = useState({
    title: '',
    workType: '',
    location: {
      lat: userLocation?.lat || 0,
      lng: userLocation?.lng || 0,
      address: ''
    },
    dateTime: '',
    payment: {
      amount: '',
      type: 'daily'
    },
    notes: ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (userLocation) {
      // Reverse geocoding to get address
      reverseGeocode(userLocation.lat, userLocation.lng)
        .then(address => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: userLocation.lat,
              lng: userLocation.lng,
              address: address || 'Current Location'
            }
          }));
        })
        .catch(error => {
          console.error('Error getting address:', error);
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: userLocation.lat,
              lng: userLocation.lng,
              address: 'Current Location'
            }
          }));
        });
    } else {
      // Auto-detect location when component loads if no userLocation is provided
      console.log('No userLocation provided, attempting auto-detection...');
      handleLocationDetect();
    }
  }, [userLocation]);

  const workTypes = [
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'planting', label: 'Planting' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'pesticide', label: 'Pesticide Spraying' },
    { value: 'maintenance', label: 'Farm Maintenance' },
    { value: 'livestock', label: 'Livestock Care' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'general', label: 'General Farm Work' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', { name, value }); // Debug logging
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationDetect = () => {
    console.log('Location detection started...');
    setIsLocating(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser.';
      console.error(error);
      setLocationError(error);
      setIsLocating(false);
      return;
    }

    console.log('Requesting location from browser...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Location obtained:', position.coords);
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get address using reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          console.log('Reverse geocoding result:', address);
          
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: address || `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            }
          }));
          
          setLocationError('');
          console.log('Location set successfully');
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            }
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = '';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your internet connection or enter address manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter address manually.';
            break;
          default:
            errorMessage = `Location detection failed (${error.message}). Please enter address manually.`;
            break;
        }
        
        console.error('Location error message:', errorMessage);
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 60000 // 1 minute cache
      }
    );
  };

  // Reverse geocoding function using OpenStreetMap Nominatim (free service)
  const reverseGeocode = async (lat, lng) => {
    try {
      console.log(`Reverse geocoding coordinates: ${lat}, ${lng}`);
      
      // Using OpenStreetMap Nominatim service (free and no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Climate-Smart-Agriculture-Platform'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Nominatim response:', data);
      
      if (data && data.display_name) {
        // Extract relevant parts of the address
        const address = data.address;
        let formattedAddress = '';
        
        if (address) {
          const parts = [];
          if (address.village || address.town || address.city) {
            parts.push(address.village || address.town || address.city);
          }
          if (address.state_district || address.state) {
            parts.push(address.state_district || address.state);
          }
          if (address.country) {
            parts.push(address.country);
          }
          
          formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
        } else {
          formattedAddress = data.display_name;
        }
        
        console.log('Formatted address:', formattedAddress);
        return formattedAddress;
      } else {
        throw new Error('No address found');
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      
      // Fallback to a meaningful description
      const regionNames = [
        'Agricultural Area', 'Farm District', 'Rural Zone', 'Countryside',
        'Farmland Region', 'Agricultural Belt', 'Rural Area', 'Farm Zone'
      ];
      
      const randomRegion = regionNames[Math.floor(Math.random() * regionNames.length)];
      const fallbackAddress = `${randomRegion} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      console.log('Using fallback address:', fallbackAddress);
      return fallbackAddress;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    // Validation
    if (!formData.title || !formData.workType || !formData.dateTime || !formData.payment.amount) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate location
    if (!formData.location.address && (formData.location.lat === 0 || formData.location.lng === 0)) {
      alert('Please provide a valid location or use auto-detect');
      return;
    }

    // Generate title if not provided
    const title = formData.title || `${formData.workType.charAt(0).toUpperCase() + formData.workType.slice(1)} Work`;
    
    const submitData = {
      ...formData,
      title,
      payment: {
        amount: parseInt(formData.payment.amount), // Ensure it's a number
        type: formData.payment.type
      }
    };
    
    console.log('Submitting job data:', submitData);
    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content job-form-modal">
        <div className="modal-header">
          <h2>Post New Job</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Corn Harvesting Assistant"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="workType">Type of Work *</label>
            <select
              id="workType"
              name="workType"
              value={formData.workType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select work type...</option>
              {workTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <div className="location-input">
              <MapPin size={20} />
              <input
                type="text"
                id="location"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Enter farm address or use auto-detect..."
                required
              />
              <button
                type="button"
                className="detect-location-btn"
                onClick={handleLocationDetect}
                disabled={isLocating}
              >
                {isLocating ? 'Detecting...' : 'Auto-detect'}
              </button>
            </div>
            {locationError && (
              <p className="location-error">{locationError}</p>
            )}
            {formData.location.lat !== 0 && formData.location.lng !== 0 && (
              <p className="location-coordinates">
                📍 Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateTime">Date & Time *</label>
            <div className="datetime-input">
              <Calendar size={20} />
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </div>

          <div className="form-group payment-group">
            <label>Payment *</label>
            <div className="payment-inputs">
              <div className="payment-amount">
                <span className="rupee-symbol">₹</span>
                <input
                  type="number"
                  name="payment.amount"
                  value={formData.payment.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  min="1"
                  required
                />
              </div>
              <select
                name="payment.type"
                value={formData.payment.type}
                onChange={handleInputChange}
                className="payment-type"
              >
                <option value="hourly">per hour</option>
                <option value="daily">per day</option>
                <option value="fixed">fixed rate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any specific requirements, tools needed, experience preferred, etc."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
