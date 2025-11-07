/**
 * Weather Service
 * Handles all weather-related API calls
 */

import axios from 'axios';

const WEATHER_API_BASE_URL = 'http://localhost:5000/api/weather';

/**
 * Get current weather data based on coordinates
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Promise<Object>} Weather data with temperature, humidity, rainfall
 */
export const getCurrentWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE_URL}/current`, {
      params: { lat: latitude, lon: longitude },
      timeout: 10000, // 10 second timeout
    });

    if (response.data.success) {
      return {
        success: true,
        data: {
          temperature: response.data.temperature,
          humidity: response.data.humidity,
          rainfall: response.data.rainfall,
          location: response.data.location,
        },
      };
    } else {
      throw new Error(response.data.error || 'Failed to fetch weather data');
    }
  } catch (error) {
    console.error('Weather API Error:', error);
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('Weather service timeout. Please try again.');
    }
    
    // Handle API errors with specific messages
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      // API key not configured (500)
      if (status === 500 && errorData.error?.includes('not configured')) {
        throw new Error(
          '⚠️ Weather service not configured. Please set up OpenWeatherMap API key. ' +
          'See WEATHER_API_SETUP.md for instructions.'
        );
      }
      
      // Invalid API key (401)
      if (status === 401) {
        throw new Error(
          '❌ Invalid weather API key. Please check your OpenWeatherMap configuration.'
        );
      }
      
      // Location not found (404)
      if (status === 404) {
        throw new Error(
          '📍 Location not found. Please try again or enter weather data manually.'
        );
      }
      
      // Service unavailable (503)
      if (status === 503) {
        throw new Error(
          '🔌 Cannot connect to weather service. Please check your internet connection.'
        );
      }
      
      // Timeout (504)
      if (status === 504) {
        throw new Error(
          '⏱️ Weather service timeout. Please try again in a few seconds.'
        );
      }
      
      // Generic error with server message
      throw new Error(errorData.error || `Weather service error (${status})`);
    }
    
    // Network error (cannot reach Flask API)
    if (error.message.includes('Network Error')) {
      throw new Error(
        '🔌 Cannot connect to Flask API. Make sure Flask server is running on port 5000.'
      );
    }
    
    // Generic error
    throw new Error(error.message || 'Unable to connect to weather service');
  }
};

/**
 * Get user's geolocation
 * @returns {Promise<Object>} Coordinates {latitude, longitude}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable location access.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timeout'));
            break;
          default:
            reject(new Error('An unknown error occurred getting location'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Auto-fill weather data (combines location + weather fetch)
 * @returns {Promise<Object>} Weather data ready for form
 */
export const autoFillWeather = async () => {
  try {
    // Step 1: Get user location
    const location = await getUserLocation();
    
    // Step 2: Fetch weather data
    const weatherData = await getCurrentWeather(location.latitude, location.longitude);
    
    return {
      success: true,
      data: weatherData.data,
      message: `Weather data loaded for ${weatherData.data.location}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
