import React, { useState } from 'react';
import axios from 'axios';
import './WeatherForm.css';

const WeatherForm = () => {
    const [zipCode, setZipCode] = useState('');
    const [tempMetric, setTempMetric] = useState('imperial');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [locationMethod, setLocationMethod] = useState('zipcode'); // 'zipcode' or 'auto'

    const autoDetectLocation = () => {
        setError('');
        setDetectingLocation(true);
        
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await axios.post('http://localhost:5002/api/weather/coordinates', {
                        latitude,
                        longitude,
                        tempMetric,
                    });
                    setWeatherData(response.data);
                    setLocationMethod('auto');
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                    setError('Failed to fetch weather data for your location. Please try again.');
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Failed to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                
                setError(errorMessage);
                setDetectingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const saveFormData = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        setLocationMethod('zipcode');

        try {
            const response = await axios.post('http://localhost:5002/api/weather', {
                zipCode,
                tempMetric,
            });
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error saving weather data:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (condition) => {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️', 
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };
        return iconMap[condition] || '🌤️';
    };

    const renderCurrentWeather = () => {
        if (!weatherData) return null;

        const { coord, weather, main, wind, clouds, sys, name, timezone } = weatherData;
        const tempUnit = tempMetric === 'imperial' ? '°F' : '°C';

        return (
            <div className="weather-display">
                <div className="weather-header">
                    <div className="weather-icon">
                        {getWeatherIcon(weather[0].main)}
                    </div>
                    <div className="weather-location">
                        <div className="location-header">
                            <h2>{name}</h2>
                            {locationMethod === 'auto' && (
                                <span className="location-badge">
                                    <span className="badge-icon">📍</span>
                                    Auto-Detected
                                </span>
                            )}
                        </div>
                        <p className="coordinates">
                            {coord.lat.toFixed(2)}°, {coord.lon.toFixed(2)}°
                        </p>
                    </div>
                </div>

                <div className="weather-main">
                    <div className="temperature-display">
                        <span className="main-temp">{Math.round(main.temp)}{tempUnit}</span>
                        <span className="feels-like">Feels like {Math.round(main.feels_like)}{tempUnit}</span>
                        <span className="condition">{weather[0].description}</span>
                    </div>
                </div>

                <div className="weather-details">
                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">🌡️</span>
                            <div className="metric-info">
                                <span className="metric-label">Min/Max</span>
                                <span className="metric-value">
                                    {Math.round(main.temp_min)}{tempUnit} / {Math.round(main.temp_max)}{tempUnit}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">💧</span>
                            <div className="metric-info">
                                <span className="metric-label">Humidity</span>
                                <span className="metric-value">{main.humidity}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">🌬️</span>
                            <div className="metric-info">
                                <span className="metric-label">Wind Speed</span>
                                <span className="metric-value">{wind.speed} m/s</span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">📊</span>
                            <div className="metric-info">
                                <span className="metric-label">Pressure</span>
                                <span className="metric-value">{main.pressure} hPa</span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">☁️</span>
                            <div className="metric-info">
                                <span className="metric-label">Cloudiness</span>
                                <span className="metric-value">{clouds.all}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">🌅</span>
                            <div className="metric-info">
                                <span className="metric-label">Sunrise</span>
                                <span className="metric-value">
                                    {new Date(sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">🌇</span>
                            <div className="metric-info">
                                <span className="metric-label">Sunset</span>
                                <span className="metric-value">
                                    {new Date(sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card">
                        <div className="weather-metric">
                            <span className="metric-icon">🧭</span>
                            <div className="metric-info">
                                <span className="metric-label">Wind Direction</span>
                                <span className="metric-value">{wind.deg}°</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="weather-container">
            <div className="weather-form-wrapper">
                <div className="weather-form-header">
                    <h1 className="weather-title">
                        <span className="title-icon">🌦️</span>
                        Weather Information
                    </h1>
                    <p className="weather-subtitle">Get real-time weather data for your location</p>
                </div>

                <div className="location-method-selector">
                    <button
                        type="button"
                        className="auto-detect-btn"
                        onClick={autoDetectLocation}
                        disabled={detectingLocation}
                    >
                        {detectingLocation ? (
                            <>
                                <span className="btn-spinner"></span>
                                Detecting Location...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">📍</span>
                                Auto-Detect My Location
                            </>
                        )}
                    </button>
                    
                    <div className="divider">
                        <span className="divider-text">OR</span>
                    </div>
                </div>

                <form onSubmit={saveFormData} className="weather-form">
                    <div className="form-group">
                        <label htmlFor="zipCode" className="form-label">
                            <span className="label-icon">�️</span>
                            Location (Zip Code)
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            className="form-input"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="Enter zip code (e.g., 10001)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tempMetric" className="form-label">
                            <span className="label-icon">🌡️</span>
                            Temperature Unit
                        </label>
                        <select 
                            id="tempMetric"
                            className="form-select"
                            value={tempMetric} 
                            onChange={(e) => setTempMetric(e.target.value)}
                        >
                            <option value="imperial">Fahrenheit (°F)</option>
                            <option value="metric">Celsius (°C)</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                Loading...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">🔍</span>
                                Get Weather Data
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {renderCurrentWeather()}
            </div>
        </div>
    );
};

export default WeatherForm;
