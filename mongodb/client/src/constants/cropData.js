/**
 * Crop Data Constants
 * Crop-specific information and recommendations
 */

// Crop seasons (Kharif, Rabi, Zaid)
export const CROP_SEASONS = {
  rice: { season: 'Kharif', months: 'June-October' },
  wheat: { season: 'Rabi', months: 'November-March' },
  maize: { season: 'Kharif', months: 'June-September' },
  cotton: { season: 'Kharif', months: 'April-October' },
  sugarcane: { season: 'Year-round', months: 'February-March or October-November' },
  chickpea: { season: 'Rabi', months: 'October-March' },
  groundnut: { season: 'Kharif', months: 'June-September' },
  soybean: { season: 'Kharif', months: 'June-September' },
  mustard: { season: 'Rabi', months: 'October-February' },
  barley: { season: 'Rabi', months: 'November-April' },
  potato: { season: 'Rabi', months: 'October-December' },
  tomato: { season: 'Year-round', months: 'All year (varies by region)' },
};

// Water requirements (in mm per season)
export const WATER_REQUIREMENTS = {
  rice: { requirement: '1200-1500 mm', frequency: 'Continuous flooding or frequent irrigation' },
  wheat: { requirement: '450-650 mm', frequency: '4-6 irrigations' },
  maize: { requirement: '500-800 mm', frequency: 'Critical at tasseling and grain filling' },
  cotton: { requirement: '700-1300 mm', frequency: '5-7 irrigations' },
  sugarcane: { requirement: '1500-2500 mm', frequency: '8-10 irrigations' },
  chickpea: { requirement: '300-500 mm', frequency: '2-3 irrigations' },
  groundnut: { requirement: '500-700 mm', frequency: '4-6 irrigations' },
  soybean: { requirement: '450-700 mm', frequency: '3-5 irrigations' },
  mustard: { requirement: '300-400 mm', frequency: '2-3 irrigations' },
  barley: { requirement: '450-650 mm', frequency: '3-5 irrigations' },
  potato: { requirement: '500-700 mm', frequency: '6-8 irrigations' },
  tomato: { requirement: '600-800 mm', frequency: 'Frequent light irrigation' },
};

// Common pests and diseases
export const CROP_PESTS = {
  rice: ['Brown plant hopper', 'Leaf folder', 'Blast disease', 'Bacterial blight'],
  wheat: ['Aphids', 'Rust', 'Powdery mildew', 'Smut'],
  maize: ['Fall armyworm', 'Stem borer', 'Blight', 'Downy mildew'],
  cotton: ['Bollworm', 'Whitefly', 'Aphids', 'Wilt'],
  sugarcane: ['Borer', 'Woolly aphid', 'Red rot', 'Smut'],
  chickpea: ['Pod borer', 'Aphids', 'Wilt', 'Blight'],
  groundnut: ['Aphids', 'Leaf miner', 'Tikka disease', 'Rust'],
  soybean: ['Stem fly', 'Girdle beetle', 'Rust', 'Bacterial blight'],
  mustard: ['Aphids', 'Sawfly', 'White rust', 'Alternaria blight'],
  barley: ['Aphids', 'Rust', 'Powdery mildew', 'Spot blotch'],
  potato: ['Aphids', 'Late blight', 'Early blight', 'Tuber rot'],
  tomato: ['Whitefly', 'Fruit borer', 'Leaf curl virus', 'Early blight'],
};

// Growth duration (in days)
export const CROP_DURATION = {
  rice: '120-150 days',
  wheat: '120-150 days',
  maize: '80-110 days',
  cotton: '150-180 days',
  sugarcane: '12-18 months',
  chickpea: '95-105 days',
  groundnut: '100-150 days',
  soybean: '90-120 days',
  mustard: '120-140 days',
  barley: '120-150 days',
  potato: '90-120 days',
  tomato: '60-90 days',
};

// Optimal temperature ranges (in °C)
export const OPTIMAL_TEMPERATURE = {
  rice: { min: 20, max: 35, optimal: '25-30°C' },
  wheat: { min: 10, max: 25, optimal: '15-20°C' },
  maize: { min: 18, max: 32, optimal: '21-27°C' },
  cotton: { min: 21, max: 37, optimal: '25-35°C' },
  sugarcane: { min: 20, max: 40, optimal: '26-32°C' },
  chickpea: { min: 10, max: 30, optimal: '20-25°C' },
  groundnut: { min: 20, max: 30, optimal: '22-28°C' },
  soybean: { min: 20, max: 30, optimal: '25-30°C' },
  mustard: { min: 10, max: 25, optimal: '15-20°C' },
  barley: { min: 10, max: 25, optimal: '15-20°C' },
  potato: { min: 15, max: 25, optimal: '18-22°C' },
  tomato: { min: 18, max: 27, optimal: '21-24°C' },
};

// Soil pH preferences
export const SOIL_PH_PREFERENCES = {
  rice: '5.5-7.0',
  wheat: '6.0-7.5',
  maize: '5.5-7.5',
  cotton: '5.8-8.0',
  sugarcane: '6.0-7.5',
  chickpea: '6.0-7.5',
  groundnut: '6.0-6.5',
  soybean: '6.0-7.0',
  mustard: '6.0-7.5',
  barley: '6.5-7.5',
  potato: '5.2-6.4',
  tomato: '6.0-7.0',
};

/**
 * Get crop information
 * @param {string} cropName - Name of the crop
 * @returns {Object} Complete crop information
 */
export const getCropInfo = (cropName) => {
  const crop = cropName?.toLowerCase();
  
  return {
    season: CROP_SEASONS[crop] || { season: 'Unknown', months: 'N/A' },
    water: WATER_REQUIREMENTS[crop] || { requirement: 'N/A', frequency: 'N/A' },
    pests: CROP_PESTS[crop] || [],
    duration: CROP_DURATION[crop] || 'N/A',
    temperature: OPTIMAL_TEMPERATURE[crop] || { min: 0, max: 50, optimal: 'N/A' },
    ph: SOIL_PH_PREFERENCES[crop] || 'N/A',
  };
};

// Crop rotation recommendations
export const CROP_ROTATION = {
  rice: ['Wheat', 'Mustard', 'Chickpea'],
  wheat: ['Rice', 'Maize', 'Cotton'],
  maize: ['Wheat', 'Mustard', 'Potato'],
  cotton: ['Wheat', 'Chickpea', 'Mustard'],
  sugarcane: ['Wheat', 'Potato', 'Chickpea'],
  chickpea: ['Wheat', 'Maize', 'Cotton'],
  groundnut: ['Wheat', 'Mustard', 'Chickpea'],
  soybean: ['Wheat', 'Chickpea', 'Mustard'],
  mustard: ['Rice', 'Maize', 'Cotton'],
  barley: ['Rice', 'Maize', 'Groundnut'],
  potato: ['Wheat', 'Maize', 'Mustard'],
  tomato: ['Wheat', 'Maize', 'Chickpea'],
};
