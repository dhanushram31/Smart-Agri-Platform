import React, { useState } from 'react';
import axios from 'axios';
import './WeatherAutoFill.css';

const WeatherAutoFill = ({ onDataFetched, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user location
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Fetch weather from backend (which calls OpenWeatherMap)
      const response = await axios.get('http://localhost:5001/api/weather/current', {
        params: { 
          lat: latitude.toFixed(4), 
          lon: longitude.toFixed(4)
        },
        timeout: 10000
      });

      const weatherData = response.data;
      
      // Extract and format weather data
      const formattedData = {
        temperature: Math.round(weatherData.main?.temp || weatherData.temperature || 25),
        humidity: Math.round(weatherData.main?.humidity || weatherData.humidity || 65),
        rainfall: Math.round(weatherData.rain?.['1h'] || weatherData.rainfall || 0),
        location: weatherData.name || weatherData.location || 'Your Location'
      };

      setLocationInfo({
        name: formattedData.location,
        lat: latitude.toFixed(4),
        lon: longitude.toFixed(4)
      });

      // Pass data to parent component
      onDataFetched(formattedData);
      setLoading(false);

    } catch (err) {
      console.error('Weather fetch error:', err);
      
      let errorMessage = 'Failed to fetch weather data';
      
      if (err.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions.';
      } else if (err.code === 2) {
        errorMessage = 'Location unavailable. Please try again.';
      } else if (err.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      } else if (err.message === 'Geolocation is not supported by your browser') {
        errorMessage = 'Your browser does not support geolocation.';
      } else if (err.response) {
        errorMessage = `Weather service error: ${err.response.data?.message || 'Please try again'}`;
      } else if (err.request) {
        errorMessage = 'Cannot connect to weather service. Please check your internet connection.';
      }

      setError(errorMessage);
      setLoading(false);

      // Show error for 5 seconds then clear
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="weather-auto-fill">
      <button
        className={`auto-fill-weather-btn ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
        onClick={fetchWeatherData}
        disabled={loading || disabled}
        title="Automatically fill temperature, humidity, and rainfall based on your current location"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            <span>Fetching Weather...</span>
          </>
        ) : (
          <>
            <span className="weather-icon">☁️</span>
            <span>Auto-fill Weather Data</span>
          </>
        )}
      </button>

      {locationInfo && !error && (
        <div className="location-info">
          <span className="location-icon">📍</span>
          <span className="location-text">
            {locationInfo.name} ({locationInfo.lat}, {locationInfo.lon})
          </span>
        </div>
      )}

      {error && (
        <div className="weather-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};

export default WeatherAutoFill;
