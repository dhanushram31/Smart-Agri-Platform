#!/bin/bash

# Smart Agri Platform - Development Startup Script
# This script helps start all services in the correct order

set -e  # Exit on error

echo "🌱 Smart Agri Platform - Starting Development Environment"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service
wait_for_service() {
    local url=$1
    local service=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service to start...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    
    echo -e "\n${RED}❌ $service failed to start within $max_attempts seconds${NC}"
    return 1
}

# Check if MongoDB is running
echo ""
echo "1️⃣  Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB is not running. Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 3
    
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB. Please start it manually.${NC}"
        exit 1
    fi
fi

# Check if port 5002 is available for the backend
echo ""
echo "2️⃣  Checking backend port (5002)..."
if check_port 5002; then
    echo -e "${YELLOW}⚠️  Port 5002 is already in use. Killing the process...${NC}"
    lsof -ti:5002 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Check if port 3001 is available for the frontend
echo ""
echo "3️⃣  Checking frontend port (3001)..."
if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Killing the process...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# Start the backend server
echo ""
echo "4️⃣  Starting Backend Server..."
cd "$PROJECT_ROOT/mongodb"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
nohup npm run server > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
if ! wait_for_service "http://localhost:5002" "Backend Server"; then
    echo -e "${RED}Backend failed to start. Check backend.log for errors.${NC}"
    cat backend.log
    exit 1
fi

# Start the frontend
echo ""
echo "5️⃣  Starting Frontend..."
cd "$PROJECT_ROOT/mongodb/client"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to be ready
sleep 5  # Give it some time to compile
if ! wait_for_service "http://localhost:3001" "Frontend"; then
    echo -e "${YELLOW}⚠️  Frontend might still be compiling...${NC}"
fi

# Success message
echo ""
echo "=========================================================="
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "📊 Service Status:"
echo "   Backend:  http://localhost:5002 (PID: $BACKEND_PID)"
echo "   Frontend: http://localhost:3001 (PID: $FRONTEND_PID)"
echo "   MongoDB:  Running"
echo ""
echo "📝 Logs:"
echo "   Backend:  $PROJECT_ROOT/mongodb/backend.log"
echo "   Frontend: $PROJECT_ROOT/mongodb/client/frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: ./stop.sh"
echo ""
echo "=========================================================="

# Save PIDs to file for stop script
echo "$BACKEND_PID" > "$PROJECT_ROOT/.backend.pid"
echo "$FRONTEND_PID" > "$PROJECT_ROOT/.frontend.pid"

# Keep script running and show logs
echo ""
echo "Press Ctrl+C to stop following logs (services will continue running)"
echo ""
tail -f "$PROJECT_ROOT/mongodb/backend.log" "$PROJECT_ROOT/mongodb/client/frontend.log"
