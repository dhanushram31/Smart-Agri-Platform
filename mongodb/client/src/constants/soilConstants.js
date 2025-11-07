/**
 * Soil Analysis Constants
 * Thresholds and ranges for N, P, K, pH levels
 */

// Nitrogen (N) thresholds in kg/ha
export const NITROGEN_LEVELS = {
  LOW: 20,
  MEDIUM: 40,
  OPTIMAL: 60,
};

// Phosphorus (P) thresholds in kg/ha
export const PHOSPHORUS_LEVELS = {
  LOW: 15,
  MEDIUM: 30,
  OPTIMAL: 50,
};

// Potassium (K) thresholds in kg/ha
export const POTASSIUM_LEVELS = {
  LOW: 20,
  MEDIUM: 40,
  OPTIMAL: 60,
};

// pH ranges
export const PH_RANGES = {
  ACIDIC: 6.0,
  NEUTRAL_MIN: 6.0,
  NEUTRAL_MAX: 7.5,
  ALKALINE: 7.5,
};

// Nutrient status types
export const NUTRIENT_STATUS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  OPTIMAL: 'Optimal',
  HIGH: 'High',
};

// pH status types
export const PH_STATUS = {
  ACIDIC: 'Acidic',
  NEUTRAL: 'Neutral',
  ALKALINE: 'Alkaline',
};

// Gauge color codes (for visualization)
export const GAUGE_COLORS = {
  RED: '#dc2626',      // Low
  ORANGE: '#f59e0b',   // Medium
  GREEN: '#059669',    // Optimal
  BLUE: '#3b82f6',     // High
};

// Input validation ranges
export const INPUT_RANGES = {
  nitrogen: { min: 0, max: 140, step: 1 },
  phosphorus: { min: 0, max: 145, step: 1 },
  potassium: { min: 0, max: 205, step: 1 },
  ph: { min: 3.5, max: 10.0, step: 0.1 },
  temperature: { min: -10, max: 50, step: 0.1 },
  humidity: { min: 0, max: 100, step: 1 },
  rainfall: { min: 0, max: 500, step: 0.1 },
};

/**
 * Get nitrogen status based on value
 * @param {number} value - Nitrogen value in kg/ha
 * @returns {string} Status (Low/Medium/Optimal/High)
 */
export const getNitrogenStatus = (value) => {
  if (value < NITROGEN_LEVELS.LOW) return NUTRIENT_STATUS.LOW;
  if (value < NITROGEN_LEVELS.MEDIUM) return NUTRIENT_STATUS.MEDIUM;
  if (value < NITROGEN_LEVELS.OPTIMAL) return NUTRIENT_STATUS.OPTIMAL;
  return NUTRIENT_STATUS.HIGH;
};

/**
 * Get phosphorus status based on value
 * @param {number} value - Phosphorus value in kg/ha
 * @returns {string} Status (Low/Medium/Optimal/High)
 */
export const getPhosphorusStatus = (value) => {
  if (value < PHOSPHORUS_LEVELS.LOW) return NUTRIENT_STATUS.LOW;
  if (value < PHOSPHORUS_LEVELS.MEDIUM) return NUTRIENT_STATUS.MEDIUM;
  if (value < PHOSPHORUS_LEVELS.OPTIMAL) return NUTRIENT_STATUS.OPTIMAL;
  return NUTRIENT_STATUS.HIGH;
};

/**
 * Get potassium status based on value
 * @param {number} value - Potassium value in kg/ha
 * @returns {string} Status (Low/Medium/Optimal/High)
 */
export const getPotassiumStatus = (value) => {
  if (value < POTASSIUM_LEVELS.LOW) return NUTRIENT_STATUS.LOW;
  if (value < POTASSIUM_LEVELS.MEDIUM) return NUTRIENT_STATUS.MEDIUM;
  if (value < POTASSIUM_LEVELS.OPTIMAL) return NUTRIENT_STATUS.OPTIMAL;
  return NUTRIENT_STATUS.HIGH;
};

/**
 * Get pH status based on value
 * @param {number} value - pH value
 * @returns {string} Status (Acidic/Neutral/Alkaline)
 */
export const getPhStatus = (value) => {
  if (value < PH_RANGES.ACIDIC) return PH_STATUS.ACIDIC;
  if (value <= PH_RANGES.NEUTRAL_MAX) return PH_STATUS.NEUTRAL;
  return PH_STATUS.ALKALINE;
};

/**
 * Get color for nutrient/pH status
 * @param {string} status - Status string
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => {
  switch (status) {
    case NUTRIENT_STATUS.LOW:
    case PH_STATUS.ACIDIC:
      return GAUGE_COLORS.RED;
    case NUTRIENT_STATUS.MEDIUM:
    case PH_STATUS.ALKALINE:
      return GAUGE_COLORS.ORANGE;
    case NUTRIENT_STATUS.OPTIMAL:
    case PH_STATUS.NEUTRAL:
      return GAUGE_COLORS.GREEN;
    case NUTRIENT_STATUS.HIGH:
      return GAUGE_COLORS.BLUE;
    default:
      return GAUGE_COLORS.GREEN;
  }
};
