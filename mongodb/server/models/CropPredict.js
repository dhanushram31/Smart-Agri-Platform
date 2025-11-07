// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\models\CropPredict.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const cropPredictSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    
    // Soil nutrient data
    N: { type: Number, required: true },
    P: { type: Number, required: true },
    K: { type: Number, required: true },
    ph: { type: Number, required: true },
    
    // Environmental data
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    
    // Prediction results
    predictedCrop: { type: String, required: true },
    predictedPrice: { type: Number, required: true },
    
    // Enhanced metadata
    predictionDate: { type: Date, default: Date.now },
    location: { type: String, default: null },
    farmSize: { type: Number, default: null }, // in acres
    soilType: { type: String, default: null },
    season: { type: String, default: null },
    
    // Recommendations snapshot
    recommendations: {
        crops: { type: Array, default: [] },
        soilAdjustments: { type: Array, default: [] },
        nutrients: { type: Array, default: [] },
        generalAdvice: { type: Array, default: [] }
    },
    
    // Soil report info
    hadSoilReport: { type: Boolean, default: false },
    extractedParameters: { type: Array, default: [] },
    
    // User notes
    notes: { type: String, default: '' },
    
    // Status tracking
    implemented: { type: Boolean, default: false },
    actualCrop: { type: String, default: null },
    actualYield: { type: Number, default: null }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('CropPredict', cropPredictSchema);
