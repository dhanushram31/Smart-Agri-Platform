#!/bin/bash

echo "🚀 Starting Climate Smart Agriculture Platform..."
echo "📋 This script will start both backend and frontend servers"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mongodb directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Create .env file from example if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from example..."
    cp .env.example .env
    echo "⚠️ Please update the .env file with your actual API keys"
fi

echo "🎯 Starting servers..."
echo "📊 Backend will run on http://localhost:5000"
echo "🖥️ Frontend will run on http://localhost:3001"
echo ""

# Start both servers concurrently
npm run dev
