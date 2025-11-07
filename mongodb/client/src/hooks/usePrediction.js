/**
 * Custom Hook: usePrediction
 * Manages crop prediction logic
 */

import { useState } from 'react';
import { getCompletePrediction } from '../services/predictionService';
import { savePredictionToHistory } from '../services/historyService';

export const usePrediction = (userId) => {
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = async (formData) => {
    setPredicting(true);
    setError(null);
    setResult(null);

    try {
      const predictionResult = await getCompletePrediction(formData);

      if (predictionResult.success) {
        setResult({
          crop: predictionResult.prediction.crop,
          price: predictionResult.prediction.price,
          recommendations: predictionResult.fertilizer.recommendations,
          general_advice: predictionResult.fertilizer.general_advice,
        });

        // Save to history if user is logged in
        if (userId) {
          try {
            await savePredictionToHistory({
              userId,
              formData: {
                nitrogen: formData.nitrogen,
                phosphorous: formData.phosphorous,
                potassium: formData.potassium,
                ph: formData.ph,
                temperature: formData.temperature,
                humidity: formData.humidity,
                rainfall: formData.rainfall,
              },
              predictedCrop: predictionResult.prediction.crop,
              predictedPrice: predictionResult.prediction.price,
              recommendations: predictionResult.fertilizer.recommendations,
              generalAdvice: predictionResult.fertilizer.general_advice,
              status: 'pending',
            });
          } catch (historyError) {
            console.error('Failed to save to history:', historyError);
            // Don't fail the whole prediction if history save fails
          }
        }

        return predictionResult;
      } else {
        throw new Error(predictionResult.error);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to get prediction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setPredicting(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    predict,
    predicting,
    result,
    error,
    clearResult,
  };
};
