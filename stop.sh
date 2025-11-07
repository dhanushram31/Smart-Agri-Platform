#!/bin/bash

# Smart Agri Platform - Stop Development Services

set -e

echo "🛑 Stopping Smart Agri Platform services..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop backend
if [ -f "$SCRIPT_DIR/.backend.pid" ]; then
    BACKEND_PID=$(cat "$SCRIPT_DIR/.backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    rm "$SCRIPT_DIR/.backend.pid"
fi

# Stop frontend
if [ -f "$SCRIPT_DIR/.frontend.pid" ]; then
    FRONTEND_PID=$(cat "$SCRIPT_DIR/.frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    rm "$SCRIPT_DIR/.frontend.pid"
fi

# Kill any remaining processes on ports
echo "Checking for lingering processes..."
lsof -ti:5002 | xargs kill -9 2>/dev/null && echo "Killed process on port 5002" || true
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "Killed process on port 3001" || true

echo -e "${GREEN}✅ All services stopped${NC}"
