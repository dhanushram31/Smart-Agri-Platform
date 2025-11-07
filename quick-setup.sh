#!/bin/bash

# Smart-Agri-Platform Quick Setup Script
# This script automates the setup process for all components

echo "🌾 Smart-Agri-Platform - Quick Setup 🌾"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python installed: $PYTHON_VERSION"
else
    print_error "Python not found. Please install from https://www.python.org/"
    exit 1
fi

# Check MongoDB
if command -v mongod &> /dev/null; then
    print_success "MongoDB installed"
else
    print_warning "MongoDB not found. Will attempt to start anyway..."
fi

echo ""
echo "=========================================="
echo "📦 Installing Dependencies..."
echo "=========================================="
echo ""

# Install Flask API dependencies
echo "1️⃣  Setting up Flask API (Crop Prediction)..."
cd crop-prediction-api

if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi

print_info "Activating virtual environment..."
source venv/bin/activate

print_info "Installing Python packages..."
pip install -r requirements.txt > /dev/null 2>&1
print_success "Flask API dependencies installed"

cd ..

# Install Express API dependencies
echo ""
echo "2️⃣  Setting up Express API (User Data & History)..."
cd mongodb/server

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages..."
    npm install > /dev/null 2>&1
    print_success "Express API dependencies installed"
else
    print_success "Express API dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env file..."
    echo "MONGODB_URI=mongodb://localhost:27017/smart-agri" > .env
    echo "PORT=3001" >> .env
    echo "JWT_SECRET=smart_agri_secret_key_2025" >> .env
    print_success ".env file created"
fi

cd ../..

# Install React dependencies
echo ""
echo "3️⃣  Setting up React Frontend..."
cd mongodb/client

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages (this may take 2-3 minutes)..."
    npm install > /dev/null 2>&1
    print_success "React dependencies installed"
else
    print_success "React dependencies already installed"
fi

cd ../..

echo ""
echo "=========================================="
echo "🔑 Configuring API Keys..."
echo "=========================================="
echo ""

# Check for OpenWeatherMap API key
if [ -z "$OPENWEATHER_API_KEY" ]; then
    print_warning "OpenWeatherMap API key not set"
    print_info "Get a free API key from: https://openweathermap.org/api"
    read -p "Enter your OpenWeatherMap API key (or press Enter to skip): " API_KEY
    
    if [ ! -z "$API_KEY" ]; then
        export OPENWEATHER_API_KEY="$API_KEY"
        print_success "API key set for this session"
        print_info "Add this to your ~/.zshrc or ~/.bashrc to persist:"
        echo "export OPENWEATHER_API_KEY=\"$API_KEY\""
    else
        print_warning "Weather auto-fill feature will not work without API key"
    fi
else
    print_success "OpenWeatherMap API key already set"
fi

echo ""
echo "=========================================="
echo "🚀 Starting Services..."
echo "=========================================="
echo ""

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
    return $?
}

# Start MongoDB
echo "1️⃣  Starting MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    print_success "MongoDB already running"
else
    if command -v brew &> /dev/null; then
        brew services start mongodb-community > /dev/null 2>&1
        sleep 2
        if pgrep -x "mongod" > /dev/null; then
            print_success "MongoDB started"
        else
            print_warning "Could not start MongoDB automatically. Please start manually."
        fi
    else
        print_warning "Please start MongoDB manually: mongod"
    fi
fi

# Start Flask API
echo ""
echo "2️⃣  Starting Flask API..."
if check_port 5000; then
    print_warning "Port 5000 already in use. Skipping Flask API start."
else
    cd crop-prediction-api
    source venv/bin/activate
    nohup python app.py > ../logs/flask.log 2>&1 &
    FLASK_PID=$!
    sleep 2
    if ps -p $FLASK_PID > /dev/null; then
        print_success "Flask API started on http://localhost:5000 (PID: $FLASK_PID)"
    else
        print_error "Failed to start Flask API. Check logs/flask.log for details."
    fi
    cd ..
fi

# Start Express API
echo ""
echo "3️⃣  Starting Express API..."
if check_port 3001; then
    print_warning "Port 3001 already in use. Skipping Express API start."
else
    cd mongodb/server
    nohup node server.js > ../../logs/express.log 2>&1 &
    EXPRESS_PID=$!
    sleep 2
    if ps -p $EXPRESS_PID > /dev/null; then
        print_success "Express API started on http://localhost:3001 (PID: $EXPRESS_PID)"
    else
        print_error "Failed to start Express API. Check logs/express.log for details."
    fi
    cd ../..
fi

# Start React App
echo ""
echo "4️⃣  Starting React Frontend..."
if check_port 3000; then
    print_warning "Port 3000 already in use. Skipping React app start."
else
    cd mongodb/client
    print_info "Starting React development server..."
    nohup npm start > ../../logs/react.log 2>&1 &
    REACT_PID=$!
    print_success "React app starting... (PID: $REACT_PID)"
    print_info "React will open automatically in your browser at http://localhost:3000"
    cd ../..
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
print_success "All components are starting up!"
echo ""
echo "📍 Access Points:"
echo "   • React App:     http://localhost:3000"
echo "   • Flask API:     http://localhost:5000"
echo "   • Express API:   http://localhost:3001"
echo "   • Testing Dashboard: Open testing-dashboard.html in browser"
echo ""
echo "📝 Logs:"
echo "   • Flask:  logs/flask.log"
echo "   • Express: logs/express.log"
echo "   • React:   logs/react.log"
echo ""
echo "🧪 Next Steps:"
echo "   1. Wait 10-15 seconds for React to compile"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Open testing-dashboard.html to track your testing"
echo "   4. Follow the Quick Start Guide (QUICK_START_GUIDE.md)"
echo ""
echo "🛑 To Stop Services:"
echo "   • Press Ctrl+C in terminals"
echo "   • Or run: kill $FLASK_PID $EXPRESS_PID $REACT_PID"
echo ""
print_success "🌾 Happy Farming with Smart-Agri-Platform! 🌾"
echo ""
