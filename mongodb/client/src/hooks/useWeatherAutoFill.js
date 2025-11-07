/**
 * Custom Hook: useWeatherAutoFill
 * Manages weather auto-fill functionality
 */

import { useState } from 'react';
import { autoFillWeather } from '../services/weatherService';

export const useWeatherAutoFill = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const autoFill = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await autoFillWeather();

      if (result.success) {
        setMessage(result.message);
        
        // Call success callback with weather data
        if (onSuccess) {
          onSuccess({
            temperature: result.data.temperature,
            humidity: result.data.humidity,
            rainfall: result.data.rainfall,
          });
        }

        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
    setError(null);
  };

  return {
    autoFill,
    loading,
    error,
    message,
    clearMessage,
  };
};
