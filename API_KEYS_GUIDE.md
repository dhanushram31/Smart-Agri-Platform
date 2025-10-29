# API Keys Setup Guide

## 🔑 Required API Keys

### 1. OpenCage Geocoding API (Free)
1. Go to: https://opencagedata.com/
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key
5. Replace `OPENCAGE_API_KEY=your_opencage_api_key_here` in your `.env` file

**Free tier includes**: 2,500 requests/day

### 2. OpenWeatherMap API (Free)
1. Go to: https://openweathermap.org/api
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key
5. Replace `WEATHER_API_KEY=your_openweathermap_api_key_here` in your `.env` file

**Free tier includes**: 1,000 calls/day

### 3. Hugging Face API (Optional - for Chatbot)
1. Go to: https://huggingface.co/
2. Sign up for an account
3. Go to Settings > Access Tokens
4. Create a new token
5. Replace `HF_API_KEY=your_huggingface_api_key_here` in your `.env` file

## 🚀 Quick Test Keys (Temporary)

For development/testing purposes only, you can use these sample keys:
- OpenCage: Contact support for test key
- OpenWeather: Contact support for test key

**⚠️ Important**: These are just examples. Get your own keys for production use!

## 🔧 Alternative Solution

If you don't want to get API keys right now, I can modify the code to use mock data for development.
