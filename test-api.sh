#!/bin/bash

# API Health Check Script

echo "🔍 Testing Smart Agri Platform API Endpoints"
echo "=============================================="

BASE_URL="http://localhost:5002"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /dev/null -X $method "$BASE_URL$endpoint")
    
    if [ "$response" = "200" ] || [ "$response" = "304" ]; then
        echo -e "${GREEN}✅ OK (HTTP $response)${NC}"
        return 0
    elif [ "$response" = "000" ]; then
        echo -e "${RED}❌ FAILED - Cannot connect to server${NC}"
        return 1
    else
        echo -e "${YELLOW}⚠️  HTTP $response${NC}"
        return 1
    fi
}

echo ""
echo "Basic Connectivity:"
test_endpoint "GET" "/" "Root endpoint"
test_endpoint "GET" "/CSBS" "Test endpoint"

echo ""
echo "API Routes:"
test_endpoint "GET" "/api/farms" "Farms API"
test_endpoint "GET" "/api/seeds/all" "Seeds API"
test_endpoint "GET" "/api/users" "Users API"

echo ""
echo "=============================================="

# Check if any test failed
if [ $? -ne 0 ]; then
    echo -e "${RED}⚠️  Some endpoints are not responding${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Make sure the server is running: npm run server"
    echo "2. Check server logs for errors"
    echo "3. Verify MongoDB is connected"
    echo "4. Check firewall settings"
else
    echo -e "${GREEN}✅ All endpoints are working!${NC}"
fi
