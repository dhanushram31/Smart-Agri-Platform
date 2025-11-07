// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\routes\cropRoutes.js

const express = require('express');
const cropController = require('../controllers/cropController');
const router = express.Router();

// Prediction routes
router.post('/predict', cropController.predictCrop);

// History routes
router.get('/history/:userId', cropController.getPredictionHistory);
router.get('/prediction/:id', cropController.getPredictionById);
router.put('/prediction/:id', cropController.updatePrediction);
router.delete('/prediction/:id', cropController.deletePrediction);

// Statistics route
router.get('/stats/:userId', cropController.getPredictionStats);

module.exports = router;
