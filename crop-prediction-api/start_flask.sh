#!/bin/bash
# Flask API Startup Script

cd "/Users/dhanushram/Desktop/Final Year Project/Smart-Agri-Platform/crop-prediction-api"
source /Users/dhanushram/Climate-Smart-Agriculture-Platform/crop-prediction-api/venv/bin/activate

# Kill any existing Flask processes
pkill -f "python app.py" 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null
sleep 1

# Start Flask in background
nohup python -u app.py > api.log 2>&1 &
PID=$!

echo "Flask API starting... (PID: $PID)"
sleep 4

# Test if it's working
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Flask API is running successfully on port 5001!"
    echo "📍 Health check: http://localhost:5001/api/health"
    echo "📍 Extract endpoint: http://localhost:5001/api/crops/extract"
    echo "📍 Predict endpoint: http://localhost:5001/api/crops/predict"
    echo ""
    echo "View logs: tail -f api.log"
else
    echo "❌ Flask API failed to start"
    echo "Check logs: tail -30 api.log"
    exit 1
fi
