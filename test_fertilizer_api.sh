#!/bin/bash
# Test script for Fertilizer Recommendation API

echo "🧪 Testing Fertilizer Recommendation API..."
echo "==========================================="
echo ""

# Test 1: Deficient Nitrogen
echo "Test 1: Deficient Nitrogen (N=15, P=25, K=30, pH=6.5)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 15, "P": 25, "K": 30, "ph": 6.5}' | jq '.'
echo ""
echo "---"
echo ""

# Test 2: Deficient Phosphorus
echo "Test 2: Deficient Phosphorus (N=40, P=10, K=35, pH=7.0)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 40, "P": 10, "K": 35, "ph": 7.0}' | jq '.'
echo ""
echo "---"
echo ""

# Test 3: Deficient Potassium
echo "Test 3: Deficient Potassium (N=45, P=30, K=15, pH=6.8)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 45, "P": 30, "K": 15, "ph": 6.8}' | jq '.'
echo ""
echo "---"
echo ""

# Test 4: Acidic Soil (pH < 6.0)
echo "Test 4: Acidic Soil (N=35, P=28, K=40, pH=5.5)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 35, "P": 28, "K": 40, "ph": 5.5}' | jq '.'
echo ""
echo "---"
echo ""

# Test 5: Alkaline Soil (pH > 7.5)
echo "Test 5: Alkaline Soil (N=30, P=20, K=25, pH=8.2)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 30, "P": 20, "K": 25, "ph": 8.2}' | jq '.'
echo ""
echo "---"
echo ""

# Test 6: Multiple Deficiencies
echo "Test 6: Multiple Deficiencies (N=12, P=8, K=10, pH=5.8)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 12, "P": 8, "K": 10, "ph": 5.8}' | jq '.'
echo ""
echo "---"
echo ""

# Test 7: Optimal Levels
echo "Test 7: Optimal Levels (N=50, P=35, K=45, pH=7.0)"
curl -X POST http://localhost:5001/api/fertilizers/recommend \
  -H "Content-Type: application/json" \
  -d '{"N": 50, "P": 35, "K": 45, "ph": 7.0}' | jq '.'
echo ""
echo "---"
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Notes:"
echo "  - Make sure Flask API is running on port 5001"
echo "  - Install jq for formatted JSON output: brew install jq"
echo "  - Check for correct fertilizer types, quantities, and costs"
echo "  - Verify application schedule is populated"
