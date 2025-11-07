import axios from 'axios';

// API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', {
        message: 'No response received from server',
        url: error.config?.url,
        error: error.message
      });
    } else {
      // Error in request setup
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to handle network errors
export const handleNetworkError = (error) => {
  if (!error.response) {
    return {
      message: 'Network error. Please check if the server is running on ' + API_BASE_URL,
      type: 'network'
    };
  }
  return {
    message: error.response?.data?.message || error.message || 'An error occurred',
    type: 'server',
    status: error.response?.status
  };
};

export { API_BASE_URL, apiClient };
export default apiClient;
