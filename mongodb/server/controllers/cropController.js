// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\controllers\cropController.js

const axios = require('axios');
const mongoose = require('mongoose');
const CropPredict = require('../models/CropPredict');

exports.predictCrop = async (req, res) => {
    const { 
        N, P, K, temperature, humidity, ph, rainfall, user_id,
        location, farmSize, soilType, season, notes,
        hadSoilReport, extractedParameters
    } = req.body;
    console.log("Received data:", req.body);

    try {
        const response = await axios.post('http://127.0.0.1:5002/predict', {
            N: parseFloat(N),
            P: parseFloat(P),
            K: parseFloat(K),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            ph: parseFloat(ph),
            rainfall: parseFloat(rainfall)
        });

        console.log("Prediction service response:", response.data);

        const crop = response.data.predicted_crop;
        const price = response.data.predicted_price;
        const recommendations = response.data.recommendations || {};

        // Save prediction in the database with enhanced metadata
        const newPrediction = new CropPredict({
            user_id,
            N,
            P,
            K,
            temperature,
            humidity,
            ph,
            rainfall,
            predictedCrop: crop,
            predictedPrice: price,
            recommendations,
            location: location || null,
            farmSize: farmSize || null,
            soilType: soilType || null,
            season: season || null,
            notes: notes || '',
            hadSoilReport: hadSoilReport || false,
            extractedParameters: extractedParameters || []
        });

        const savedPrediction = await newPrediction.save();
        
        res.json({ 
            predictedCrop: crop, 
            predictedPrice: price,
            predictionId: savedPrediction._id,
            recommendations
        });
    } catch (error) {
        console.error('Error in prediction process:', error.message);
        res.status(500).json({ message: 'Crop prediction failed.', error: error.message });
    }
};

// Get prediction history for a user
exports.getPredictionHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10, skip = 0, sortBy = 'predictionDate', order = 'desc' } = req.query;

        const predictions = await CropPredict.find({ user_id: userId })
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .lean();

        const totalCount = await CropPredict.countDocuments({ user_id: userId });

        res.json({
            success: true,
            predictions,
            totalCount,
            hasMore: (parseInt(skip) + predictions.length) < totalCount
        });
    } catch (error) {
        console.error('Error fetching prediction history:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch prediction history',
            error: error.message 
        });
    }
};

// Get a single prediction by ID
exports.getPredictionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const prediction = await CropPredict.findById(id).lean();
        
        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        res.json({
            success: true,
            prediction
        });
    } catch (error) {
        console.error('Error fetching prediction:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch prediction',
            error: error.message 
        });
    }
};

// Update prediction (for adding notes, marking as implemented, etc.)
exports.updatePrediction = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Only allow certain fields to be updated
        const allowedUpdates = ['notes', 'implemented', 'actualCrop', 'actualYield'];
        const filteredUpdates = {};
        
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }

        const updatedPrediction = await CropPredict.findByIdAndUpdate(
            id,
            filteredUpdates,
            { new: true }
        ).lean();

        if (!updatedPrediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        res.json({
            success: true,
            prediction: updatedPrediction
        });
    } catch (error) {
        console.error('Error updating prediction:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update prediction',
            error: error.message 
        });
    }
};

// Delete a prediction
exports.deletePrediction = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedPrediction = await CropPredict.findByIdAndDelete(id);
        
        if (!deletedPrediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        res.json({
            success: true,
            message: 'Prediction deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting prediction:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete prediction',
            error: error.message 
        });
    }
};

// Get prediction statistics for a user
exports.getPredictionStats = async (req, res) => {
    try {
        const { userId } = req.params;

        const stats = await CropPredict.aggregate([
            { $match: { user_id: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalPredictions: { $sum: 1 },
                    avgPrice: { $avg: '$predictedPrice' },
                    mostPredictedCrop: { $first: '$predictedCrop' },
                    implemented: { $sum: { $cond: ['$implemented', 1, 0] } }
                }
            }
        ]);

        res.json({
            success: true,
            stats: stats[0] || {
                totalPredictions: 0,
                avgPrice: 0,
                mostPredictedCrop: null,
                implemented: 0
            }
        });
    } catch (error) {
        console.error('Error fetching prediction stats:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch prediction statistics',
            error: error.message 
        });
    }
};