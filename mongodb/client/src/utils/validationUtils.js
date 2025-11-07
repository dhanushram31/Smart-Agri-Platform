/**
 * Validation Utilities
 * Form validation and input sanitization
 */

import { INPUT_RANGES } from '../constants/soilConstants';

/**
 * Validate number input within range
 * @param {number} value - Value to validate
 * @param {string} field - Field name (nitrogen, phosphorus, etc.)
 * @returns {Object} {valid: boolean, error: string}
 */
export const validateNumberInput = (value, field) => {
  const range = INPUT_RANGES[field];

  if (!range) {
    return { valid: false, error: `Unknown field: ${field}` };
  }

  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: `${capitalize(field)} is required` };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { valid: false, error: `${capitalize(field)} must be a number` };
  }

  if (numValue < range.min) {
    return { valid: false, error: `${capitalize(field)} must be at least ${range.min}` };
  }

  if (numValue > range.max) {
    return { valid: false, error: `${capitalize(field)} must not exceed ${range.max}` };
  }

  return { valid: true, error: null };
};

/**
 * Validate entire form data
 * @param {Object} formData - Complete form data object
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateFormData = (formData) => {
  const errors = {};
  const fields = ['nitrogen', 'phosphorous', 'potassium', 'ph', 'temperature', 'humidity', 'rainfall'];

  fields.forEach((field) => {
    const result = validateNumberInput(formData[field], field);
    if (!result.valid) {
      errors[field] = result.error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize number input
 * @param {any} value - Value to sanitize
 * @param {number} decimals - Number of decimal places
 * @returns {number} Sanitized number
 */
export const sanitizeNumber = (value, decimals = 2) => {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return 0;
  }

  return parseFloat(num.toFixed(decimals));
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Valid or not
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Valid or not
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if value is within acceptable range with tolerance
 * @param {number} value - Value to check
 * @param {number} min - Minimum acceptable value
 * @param {number} max - Maximum acceptable value
 * @param {number} tolerance - Tolerance percentage (default 10%)
 * @returns {boolean} Within range or not
 */
export const isWithinRange = (value, min, max, tolerance = 0.1) => {
  const toleranceAmount = (max - min) * tolerance;
  return value >= min - toleranceAmount && value <= max + toleranceAmount;
};
