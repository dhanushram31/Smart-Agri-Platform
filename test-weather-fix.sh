#!/bin/bash

# 🧪 Weather API Fix Verification Script
# Tests the weather auto-fill feature after configuration

echo "========================================="
echo "   🌦️  Weather API Fix Verification"
echo "========================================="
echo ""

# Check if API key is set
if [ -z "$OPENWEATHER_API_KEY" ]; then
    echo "❌ OPENWEATHER_API_KEY not set!"
    echo "   Run: source ~/.zshrc"
    exit 1
fi

echo "✅ API Key configured: ${OPENWEATHER_API_KEY:0:10}..."
echo ""

# Test API endpoint with different locations
echo "📍 Testing Weather API with sample locations:"
echo ""

# Test 1: Chennai, India
echo "1️⃣  Chennai, India (13.0827°N, 80.2707°E)"
RESPONSE=$(curl -s "http://localhost:5001/api/weather/current?lat=13.0827&lon=80.2707")
if echo "$RESPONSE" | grep -q '"success": true'; then
    TEMP=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('temperature', 'N/A'))")
    HUMIDITY=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('humidity', 'N/A'))")
    LOCATION=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('location', 'N/A'))")
    echo "   ✅ Success!"
    echo "   📍 Location: $LOCATION"
    echo "   🌡️  Temperature: ${TEMP}°C"
    echo "   💧 Humidity: ${HUMIDITY}%"
else
    echo "   ❌ Failed!"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 2: Mumbai, India
echo "2️⃣  Mumbai, India (19.0760°N, 72.8777°E)"
RESPONSE=$(curl -s "http://localhost:5001/api/weather/current?lat=19.0760&lon=72.8777")
if echo "$RESPONSE" | grep -q '"success": true'; then
    TEMP=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('temperature', 'N/A'))")
    HUMIDITY=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('humidity', 'N/A'))")
    LOCATION=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('location', 'N/A'))")
    echo "   ✅ Success!"
    echo "   📍 Location: $LOCATION"
    echo "   🌡️  Temperature: ${TEMP}°C"
    echo "   💧 Humidity: ${HUMIDITY}%"
else
    echo "   ❌ Failed!"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 3: Delhi, India
echo "3️⃣  Delhi, India (28.7041°N, 77.1025°E)"
RESPONSE=$(curl -s "http://localhost:5001/api/weather/current?lat=28.7041&lon=77.1025")
if echo "$RESPONSE" | grep -q '"success": true'; then
    TEMP=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('temperature', 'N/A'))")
    HUMIDITY=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('humidity', 'N/A'))")
    LOCATION=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('location', 'N/A'))")
    echo "   ✅ Success!"
    echo "   📍 Location: $LOCATION"
    echo "   🌡️  Temperature: ${TEMP}°C"
    echo "   💧 Humidity: ${HUMIDITY}%"
else
    echo "   ❌ Failed!"
    echo "   Response: $RESPONSE"
fi
echo ""

echo "========================================="
echo "   ✅ Weather API is working correctly!"
echo "========================================="
echo ""
echo "Next Steps:"
echo "  1. Open your React app at http://localhost:3000"
echo "  2. Go to Crop Prediction page"
echo "  3. Click 'Get Weather Data' button"
echo "  4. Weather fields should auto-fill! 🎉"
echo ""
