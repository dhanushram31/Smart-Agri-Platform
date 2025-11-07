/**
 * History Service
 * Handles prediction history API calls
 */

import axios from 'axios';

const HISTORY_API_BASE_URL = 'http://localhost:3001/api/crop-predictions';

/**
 * Save prediction to history
 * @param {Object} predictionData - Complete prediction data
 * @returns {Promise<Object>} Saved prediction with ID
 */
export const savePredictionToHistory = async (predictionData) => {
  try {
    const response = await axios.post(HISTORY_API_BASE_URL, predictionData, {
      timeout: 10000,
    });

    if (response.data.success) {
      return {
        success: true,
        prediction: response.data.prediction,
        message: 'Prediction saved to history',
      };
    } else {
      throw new Error('Failed to save prediction');
    }
  } catch (error) {
    console.error('Save History Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('History service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'History service error');
    }
    
    throw new Error('Unable to save prediction to history');
  }
};

/**
 * Get user's prediction history
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters {status, sortBy, sortOrder}
 * @returns {Promise<Object>} Array of predictions
 */
export const getPredictionHistory = async (userId, filters = {}) => {
  try {
    const params = {
      userId,
      ...filters,
    };

    const response = await axios.get(HISTORY_API_BASE_URL, {
      params,
      timeout: 10000,
    });

    if (response.data.success) {
      return {
        success: true,
        predictions: response.data.predictions,
        count: response.data.count,
      };
    } else {
      throw new Error('Failed to fetch prediction history');
    }
  } catch (error) {
    console.error('Get History Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('History service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'History service error');
    }
    
    throw new Error('Unable to fetch prediction history');
  }
};

/**
 * Update prediction status
 * @param {string} predictionId - Prediction ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated prediction
 */
export const updatePrediction = async (predictionId, updates) => {
  try {
    const response = await axios.put(
      `${HISTORY_API_BASE_URL}/${predictionId}`,
      updates,
      {
        timeout: 10000,
      }
    );

    if (response.data.success) {
      return {
        success: true,
        prediction: response.data.prediction,
        message: 'Prediction updated successfully',
      };
    } else {
      throw new Error('Failed to update prediction');
    }
  } catch (error) {
    console.error('Update History Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('History service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'History service error');
    }
    
    throw new Error('Unable to update prediction');
  }
};

/**
 * Delete prediction from history
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<Object>} Success confirmation
 */
export const deletePrediction = async (predictionId) => {
  try {
    const response = await axios.delete(
      `${HISTORY_API_BASE_URL}/${predictionId}`,
      {
        timeout: 10000,
      }
    );

    if (response.data.success) {
      return {
        success: true,
        message: 'Prediction deleted successfully',
      };
    } else {
      throw new Error('Failed to delete prediction');
    }
  } catch (error) {
    console.error('Delete History Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('History service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'History service error');
    }
    
    throw new Error('Unable to delete prediction');
  }
};

/**
 * Get prediction statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics summary
 */
export const getPredictionStats = async (userId) => {
  try {
    const response = await axios.get(`${HISTORY_API_BASE_URL}/stats/${userId}`, {
      timeout: 10000,
    });

    if (response.data.success) {
      return {
        success: true,
        stats: response.data.stats,
      };
    } else {
      throw new Error('Failed to fetch statistics');
    }
  } catch (error) {
    console.error('Get Stats Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Stats service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'Stats service error');
    }
    
    throw new Error('Unable to fetch prediction statistics');
  }
};
