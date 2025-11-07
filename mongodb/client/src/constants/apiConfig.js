/**
 * API Configuration Constants
 * Base URLs, endpoints, and timeouts
 */

// Development/Production environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// API Base URLs
export const API_CONFIG = {
  // Flask API (ML predictions)
  FLASK_BASE_URL: IS_PRODUCTION
    ? 'https://your-production-flask-url.com/api'
    : 'http://localhost:5000/api',

  // Express API (User data, history)
  EXPRESS_BASE_URL: IS_PRODUCTION
    ? 'https://your-production-express-url.com/api'
    : 'http://localhost:3001/api',
};

// API Endpoints
export const ENDPOINTS = {
  // Prediction endpoints
  PREDICT: '/predict',
  FERTILIZER: '/fertilizer-recommendations',
  
  // Weather endpoints
  WEATHER_CURRENT: '/weather/current',
  
  // History endpoints
  HISTORY_BASE: '/crop-predictions',
  HISTORY_STATS: (userId) => `/crop-predictions/stats/${userId}`,
  HISTORY_ITEM: (id) => `/crop-predictions/${id}`,
};

// Request timeouts (in milliseconds)
export const TIMEOUTS = {
  SHORT: 5000,      // 5 seconds - for quick operations
  MEDIUM: 10000,    // 10 seconds - for standard API calls
  LONG: 15000,      // 15 seconds - for predictions/ML operations
  WEATHER: 10000,   // 10 seconds - for weather API
};

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

// Request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// CORS configuration
export const CORS_CONFIG = {
  credentials: true,
  withCredentials: true,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  WEATHER: 600000,      // 10 minutes
  PREDICTIONS: 300000,  // 5 minutes
  HISTORY: 60000,       // 1 minute
};
