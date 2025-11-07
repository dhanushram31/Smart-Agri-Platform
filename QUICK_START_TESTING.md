# 🚀 Quick Start Testing Guide

## Current Server Status

Based on the check, here's what's running:

✅ **MongoDB**: Running  
✅ **Express API** (port 3001): Running  
✅ **Node.js**: v22.17.0 installed  
✅ **Python**: 3.12.1 installed  
❌ **React Frontend** (port 3000): Not running  
❌ **Flask API** (port 5000): Port blocked by system process  

---

## 🎯 Step-by-Step Testing Instructions

### Step 1: Start React Frontend

The MongoDB/Express/React app is already configured. Just need to start it:

```bash
cd /Users/dhanushram/Desktop/Final\ Year\ Project/Smart-Agri-Platform/mongodb
npm start
```

This will:
- Start Express API on port 3001 (already running)
- Start React frontend on port 3000
- Open browser automatically at `http://localhost:3000`

### Step 2: Start Flask API (Crop Prediction)

The Flask API needs to run on a different port since 5000 is taken.

**Option A: Use Port 5001** (Recommended)

1. Open `crop-prediction-api/app.py` in VS Code
2. Find the line at the bottom: `app.run(debug=True)`
3. Change it to: `app.run(debug=True, port=5001)`
4. Save the file
5. Run:
   ```bash
   cd /Users/dhanushram/Desktop/Final\ Year\ Project/Smart-Agri-Platform/crop-prediction-api
   source venv/bin/activate
   python app.py
   ```

**Option B: Update Frontend to Use Port 5001**

If you use port 5001, also update the React frontend:

1. Open `mongodb/client/src/services/predictionService.js`
2. Change `http://localhost:5000` to `http://localhost:5001`
3. Open `mongodb/client/src/services/weatherService.js`  
4. Change `http://localhost:5000` to `http://localhost:5001`
5. Restart React app

---

## 🧪 Testing Workflow

Once all servers are running, follow this workflow:

### 1. Basic Functionality Test (5 minutes)

1. **Open app**: http://localhost:3000
2. **Navigate** to Crop Prediction form
3. **Fill in sample data**:
   - Nitrogen: 30
   - Phosphorous: 25
   - Potassium: 35
   - pH: 6.5
   - Temperature: 25
   - Humidity: 60
   - Rainfall: 100
4. **Click** "Get Prediction"
5. **Verify** you get:
   - Predicted crop name
   - Predicted price
   - Fertilizer recommendations

✅ If this works, core functionality is good!

### 2. Test Each Feature (30-40 minutes)

Follow the **TESTING_GUIDE_COMPLETE.md** for detailed steps:

1. **Weather Auto-Fill** (5 min)
   - Click "Auto-fill Weather Data"
   - Allow location access
   - Verify temperature, humidity, rainfall fill automatically

2. **Nutrient Gauges** (3 min)
   - Enter different N, P, K, pH values
   - Watch circular gauges update
   - Verify colors: Red (low), Orange (medium), Green (optimal), Blue (high)

3. **Fertilizer Recommendations** (5 min)
   - Make prediction
   - Scroll to recommendations
   - Check: Products, NPK ratios, costs, application rates

4. **Prediction History** (8 min)
   - Make 3-4 predictions
   - Navigate to history (if available as separate page)
   - Test filters, sorting
   - Try "Reuse Data" button

5. **AI Chat Assistant** (10 min)
   - Look for chat button (bottom-right)
   - Open chat
   - Test all 6 quick questions
   - Verify responses mention your specific data

6. **PDF Report Generator** (5 min)
   - After prediction, click "Download Report"
   - Open downloaded PDF
   - Verify all sections present
   - Check color-coded tables

7. **Code Quality** (5 min)
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Test error handling (turn off Flask API, try prediction)
   - Verify friendly error messages

---

## 📋 Quick Test Checklist

Use this for rapid verification:

- [ ] All 4 servers running (MongoDB, Express, React, Flask)
- [ ] Can load homepage without errors
- [ ] Can make a prediction successfully
- [ ] Weather auto-fill button works
- [ ] Gauges display and update
- [ ] Recommendations show with details
- [ ] History saves predictions
- [ ] Chat assistant responds
- [ ] PDF downloads successfully
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Issue: Flask API won't start on port 5000

**Solution**: Port 5000 is used by macOS AirPlay Receiver

**Fix 1** - Disable AirPlay Receiver:
1. System Settings → General → AirDrop & Handoff
2. Turn off "AirPlay Receiver"
3. Try starting Flask again

**Fix 2** - Use port 5001 (see Step 2 above)

### Issue: "Cannot connect to server" errors

**Check**:
```bash
# Check Flask API
curl http://localhost:5001/api/predict

# Check Express API
curl http://localhost:3001/api/crop-predictions

# Check React
open http://localhost:3000
```

### Issue: Weather auto-fill not working

**Check**:
1. Flask API running?
2. OpenWeatherMap API key set in `crop-prediction-api/app.py`?
3. Browser allowed location access?
4. Check browser console for errors

### Issue: Predictions failing

**Check**:
1. Flask API running on correct port?
2. Model file exists (`yolov8n.pt` or crop model)?
3. All form fields filled?
4. Check Flask terminal for errors

### Issue: History not saving

**Check**:
1. MongoDB running? (`ps aux | grep mongod`)
2. Express API running on port 3001?
3. User logged in?
4. Check Express terminal logs

---

## 🎨 Testing Dashboard

I've created an interactive **testing-dashboard.html** that:

- Shows server status in real-time
- Tracks testing progress
- Has quick links to test each feature
- Maintains checklist of tasks

**Open it**: Already opened in your browser, or:
```bash
open /Users/dhanushram/Desktop/Final\ Year\ Project/Smart-Agri-Platform/testing-dashboard.html
```

---

## 📊 Test Results Template

After testing, document results:

```
FEATURE TESTING RESULTS
Date: November 7, 2025
Tester: [Your Name]

1. Weather Auto-Fill: ✅ PASS / ❌ FAIL
   Notes: _______________________

2. Nutrient Gauges: ✅ PASS / ❌ FAIL
   Notes: _______________________

3. Fertilizer Recommendations: ✅ PASS / ❌ FAIL
   Notes: _______________________

4. Prediction History: ✅ PASS / ❌ FAIL
   Notes: _______________________

5. AI Chat Assistant: ✅ PASS / ❌ FAIL
   Notes: _______________________

6. PDF Report Generator: ✅ PASS / ❌ FAIL
   Notes: _______________________

7. Code Quality: ✅ PASS / ❌ FAIL
   Notes: _______________________

Overall Status: READY FOR PRODUCTION / NEEDS FIXES

Issues Found: 
- 
- 

Recommendations:
- 
- 
```

---

## ✅ Ready for Production?

**Before deployment, ensure**:

- [ ] All 7 features tested and working
- [ ] No critical bugs found
- [ ] Console shows no errors
- [ ] Mobile responsive (test with DevTools)
- [ ] Error handling works properly
- [ ] Documentation matches implementation

---

## 🚀 Next Steps After Testing

**If All Tests Pass**:
1. Create production build: `npm run build`
2. Set up environment variables for production
3. Deploy to hosting service
4. Run smoke tests on production
5. Monitor for issues

**If Issues Found**:
1. Document all bugs in detail
2. Prioritize by severity (critical/major/minor)
3. Fix critical issues first
4. Re-test affected features
5. Repeat until all pass

---

## 📞 Need Help?

**Resources**:
- **Testing Guide**: TESTING_GUIDE_COMPLETE.md
- **Feature Docs**: SESSION_SUMMARY_*.md (9 files)
- **Project Status**: PROJECT_COMPLETE.md
- **Quick Reference**: PROJECT_COMPLETION_SUMMARY.md

**Quick Commands**:
```bash
# Check what's running
./test-setup.sh

# Start MongoDB
brew services start mongodb-community

# Start React + Express
cd mongodb && npm start

# Start Flask API
cd crop-prediction-api && source venv/bin/activate && python app.py

# View logs
tail -f mongodb/server/*.log
```

---

**Happy Testing! 🎉**

*Remember: Take your time, test thoroughly, and document everything!*
