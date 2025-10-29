// API Configuration
const API_CONFIG = {
  // Express server APIs (users, farms, weather, etc.)
  EXPRESS_BASE_URL: 'http://localhost:5002',
  
  // Flask server APIs (ML predictions)
  FLASK_BASE_URL: 'http://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    // Express endpoints
    USERS_SIGNUP: '/api/users/signup',
    USERS_LOGIN: '/api/users/login',
    USERS_PREFERENCES: '/api/users',
    WEATHER: '/api/weather',
    FARMS: '/api/farms',
    SEEDS: '/api/seeds',
    REQUESTS: '/api/requests',
    CHAT: '/api/chat',
    
    // Flask endpoints
    CROP_PREDICT: '/api/crops/predict',
  }
};

// Helper functions
export const getExpressURL = (endpoint) => `${API_CONFIG.EXPRESS_BASE_URL}${endpoint}`;
export const getFlaskURL = (endpoint) => `${API_CONFIG.FLASK_BASE_URL}${endpoint}`;

export default API_CONFIG;
