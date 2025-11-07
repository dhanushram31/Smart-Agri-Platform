const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

// Load environment variables from the correct location
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import routes
const farmRoutes = require('./routes/farmRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const userRoutes = require('./routes/userRoutes');
const cropRoutes = require('./routes/cropRoutes');
const seedRoutes = require('./routes/seedRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoute = require('./api/chat');
const apis = require("./api");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced CORS configuration - Allow all origins in development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:5002',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

// MongoDB connection
const mongoURI = process.env.MONGODB_LINK || 'mongodb://localhost:27017/smart-agri-platform';
if (!process.env.MONGODB_LINK) {
  console.warn('⚠️ MONGODB_LINK not set in .env — using fallback local MongoDB URI');
}

console.log('🔄 Attempting to connect to MongoDB...');
console.log('📍 MongoDB URI:', mongoURI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

// Recommended Mongoose settings
mongoose.set('strictQuery', false);

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);

    // Start server after DB is connected
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for development origins`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Please check:');
    console.error('   1. MongoDB connection string in .env file');
    console.error('   2. Network connectivity');
    console.error('   3. MongoDB Atlas whitelist (if using cloud)');
    console.error('   4. Username and password are correct');
    // Exit the process so failures are obvious in production/dev
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Middleware: return 503 if DB not ready (safety fallback)
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Service unavailable - database not connected' });
  }
  next();
});

// Test route
app.get('/CSBS', async (req, res) => {
  res.json({ message: "url got" });
});

// Weather API route - using zip code
app.post('/api/weather', async (req, res) => {
  const { zipCode, tempMetric } = req.body;
  console.log(zipCode + " " + tempMetric);

  try {
    if (!zipCode) {
      return res.status(400).json({ error: 'Zip code is required' });
    }

    const coordinates = await getCoordinatesFromPincode(zipCode);
    const weatherData = await getWeatherData(coordinates, tempMetric);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data', details: error.message });
  }
});

// Weather API route - using coordinates (for auto-detect location)
app.post('/api/weather/coordinates', async (req, res) => {
  const { latitude, longitude, tempMetric } = req.body;
  console.log(`Coordinates: ${latitude}, ${longitude} | Metric: ${tempMetric}`);

  try {
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const coordinates = { latitude, longitude };
    const weatherData = await getWeatherData(coordinates, tempMetric);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data', details: error.message });
  }
});

// Helper: Get coordinates from pincode
const getCoordinatesFromPincode = async (pincode) => {
  const openCageKey = process.env.OPENCAGE_API_KEY;
  
  // Check if API key is configured
  if (!openCageKey || openCageKey === 'your_opencage_api_key_here') {
    console.log('🔑 OpenCage API key not configured, using mock coordinates for development');
    // Return mock coordinates based on pincode (approximate)
    const mockCoordinates = {
      '90210': { latitude: 34.0522, longitude: -118.2437 }, // Beverly Hills, CA
      '10001': { latitude: 40.7505, longitude: -73.9934 },  // New York, NY
      '60601': { latitude: 41.8781, longitude: -87.6298 },  // Chicago, IL
      '94102': { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
      '33101': { latitude: 25.7617, longitude: -80.1918 },  // Miami, FL
      '635126': { latitude: 12.9716, longitude: 77.5946 },  // Bangalore, India
      '560001': { latitude: 12.9716, longitude: 77.5946 },  // Bangalore, India
      '110001': { latitude: 28.6139, longitude: 77.2090 },  // New Delhi, India
      '400001': { latitude: 19.0760, longitude: 72.8777 },  // Mumbai, India
      '600001': { latitude: 13.0827, longitude: 80.2707 },  // Chennai, India
      '700001': { latitude: 22.5726, longitude: 88.3639 },  // Kolkata, India
      '500001': { latitude: 17.3850, longitude: 78.4867 },  // Hyderabad, India
    };
    
    return mockCoordinates[pincode] || { latitude: 40.7128, longitude: -74.0060 }; // Default to NYC
  }
  
  const openCageBaseUrl = "https://api.opencagedata.com/geocode/v1/json";
  const url = `${openCageBaseUrl}?q=${pincode}&key=${openCageKey}`;

  try {
    const response = await axios.get(url);
    const { lat, lng } = response.data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw new Error('Unable to retrieve coordinates. Please try again.');
  }
};

// Helper: Get weather data
const getWeatherData = async ({ latitude, longitude }, tempMetric) => {
  const weatherApiKey = process.env.WEATHER_API_KEY;
  
  // Check if API key is configured
  if (!weatherApiKey || weatherApiKey === 'your_openweathermap_api_key_here') {
    console.log('🔑 Weather API key not configured, using mock weather data for development');
    
    // Return mock weather data
    return {
      coord: { lon: longitude, lat: latitude },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ],
      base: 'stations',
      main: {
        temp: tempMetric === 'imperial' ? 72 : 22,
        feels_like: tempMetric === 'imperial' ? 75 : 24,
        temp_min: tempMetric === 'imperial' ? 68 : 20,
        temp_max: tempMetric === 'imperial' ? 78 : 26,
        pressure: 1013,
        humidity: 65
      },
      visibility: 10000,
      wind: {
        speed: tempMetric === 'imperial' ? 5.1 : 2.3,
        deg: 210
      },
      clouds: { all: 5 },
      dt: Math.floor(Date.now() / 1000),
      sys: {
        type: 2,
        id: 2000654,
        country: 'US',
        sunrise: Math.floor(Date.now() / 1000) - 3600,
        sunset: Math.floor(Date.now() / 1000) + 7200
      },
      timezone: -18000,
      id: 0,
      name: 'Mock Location',
      cod: 200
    };
  }
  
  const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const url = `${weatherBaseUrl}?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=${tempMetric}`;

  const response = await axios.get(url);
  return response.data;
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/seeds', seedRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoute);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});
