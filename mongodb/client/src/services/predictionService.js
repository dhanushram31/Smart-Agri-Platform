/**
 * Prediction Service
 * Handles crop prediction API calls
 */

import axios from 'axios';

const PREDICTION_API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get crop prediction based on soil and environmental data
 * @param {Object} data - Prediction input data
 * @returns {Promise<Object>} Prediction results with crop and price
 */
export const getCropPrediction = async (data) => {
  try {
    const response = await axios.post(`${PREDICTION_API_BASE_URL}/predict`, data, {
      timeout: 15000, // 15 second timeout
    });

    if (response.data.predicted_crop) {
      return {
        success: true,
        crop: response.data.predicted_crop,
        price: response.data.predicted_price,
      };
    } else {
      throw new Error('Invalid prediction response');
    }
  } catch (error) {
    console.error('Prediction API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Prediction service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'Prediction service error');
    }
    
    throw new Error('Unable to connect to prediction service');
  }
};

/**
 * Get fertilizer recommendations based on soil data
 * @param {Object} soilData - Soil nutrient data
 * @param {string} crop - Predicted crop name
 * @returns {Promise<Object>} Fertilizer recommendations
 */
export const getFertilizerRecommendations = async (soilData, crop) => {
  try {
    const response = await axios.post(
      `${PREDICTION_API_BASE_URL}/fertilizer-recommendations`,
      {
        N: soilData.nitrogen,
        P: soilData.phosphorous,
        K: soilData.potassium,
        pH: soilData.ph,
        crop: crop,
      },
      {
        timeout: 10000,
      }
    );

    if (response.data.success) {
      return {
        success: true,
        recommendations: response.data.recommendations,
        general_advice: response.data.general_advice,
      };
    } else {
      throw new Error('Failed to get fertilizer recommendations');
    }
  } catch (error) {
    console.error('Fertilizer API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Fertilizer service timeout. Please try again.');
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'Fertilizer service error');
    }
    
    throw new Error('Unable to get fertilizer recommendations');
  }
};

/**
 * Complete prediction flow: get prediction + fertilizer recommendations
 * @param {Object} formData - Complete form data
 * @returns {Promise<Object>} Combined prediction and recommendations
 */
export const getCompletePrediction = async (formData) => {
  try {
    // Step 1: Get crop prediction
    const predictionResult = await getCropPrediction(formData);
    
    // Step 2: Get fertilizer recommendations
    const fertilizerResult = await getFertilizerRecommendations(
      {
        nitrogen: formData.nitrogen,
        phosphorous: formData.phosphorous,
        potassium: formData.potassium,
        ph: formData.ph,
      },
      predictionResult.crop
    );
    
    return {
      success: true,
      prediction: {
        crop: predictionResult.crop,
        price: predictionResult.price,
      },
      fertilizer: {
        recommendations: fertilizerResult.recommendations,
        general_advice: fertilizerResult.general_advice,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
