# 🌦️ Weather API Setup Guide

## Problem: Weather Auto-Fill Shows "Internal Error"

If you're seeing an **internal error** when trying to auto-fill weather data, it means the **OpenWeatherMap API key is not configured**.

---

## ✅ Solution: Get & Configure API Key (5 minutes)

### Step 1: Get Free API Key from OpenWeatherMap

1. **Go to**: https://openweathermap.org/api
2. **Click**: "Get API Key" or "Sign Up"
3. **Create Account**: Use your email (free tier is sufficient)
4. **Verify Email**: Check your inbox and verify
5. **Get API Key**: Go to https://home.openweathermap.org/api_keys
6. **Copy Key**: Copy the default API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

> ⚠️ **Note**: New API keys take 10-15 minutes to activate. Wait before testing.

---

### Step 2: Configure API Key in Your System

Choose the method based on how you run the Flask API:

#### **Option A: For `quick-setup.sh` Users (Recommended)**

If you use the automated setup script:

```bash
# 1. Export the API key in your current terminal
export OPENWEATHER_API_KEY="your_api_key_here"

# 2. Run the setup script
./quick-setup.sh
```

#### **Option B: Permanent Setup (Best for Development)**

Add to your shell configuration file:

**For zsh (default on macOS):**
```bash
# 1. Open your shell config
nano ~/.zshrc

# 2. Add this line at the end (replace with your actual key)
export OPENWEATHER_API_KEY="your_api_key_here"

# 3. Save (Ctrl+O, Enter, Ctrl+X)

# 4. Reload configuration
source ~/.zshrc

# 5. Verify it's set
echo $OPENWEATHER_API_KEY
```

**For bash:**
```bash
# 1. Open your shell config
nano ~/.bashrc

# 2. Add this line at the end
export OPENWEATHER_API_KEY="your_api_key_here"

# 3. Save and reload
source ~/.bashrc

# 4. Verify
echo $OPENWEATHER_API_KEY
```

#### **Option C: Temporary (Just for Testing)**

```bash
# Set for current terminal session only
export OPENWEATHER_API_KEY="your_api_key_here"

# Start Flask API manually
cd crop-prediction-api
source venv/bin/activate
python app.py
```

---

### Step 3: Restart Flask API

After setting the API key, **restart the Flask API**:

```bash
# If running manually
cd crop-prediction-api
source venv/bin/activate
python app.py

# If using quick-setup.sh
# Kill the old Flask process and restart
./quick-setup.sh
```

---

### Step 4: Test Weather Auto-Fill

1. **Open**: http://localhost:3000
2. **Go to**: Crop Prediction page
3. **Click**: "Get Weather Data" button
4. **Expected Result**: ✅ Weather data should auto-fill (Temperature, Humidity, Rainfall)

---

## 🔍 Troubleshooting

### Error: "Invalid OpenWeatherMap API key"

**Cause**: API key is incorrect or not activated yet

**Fix**:
1. Wait 10-15 minutes after creating the API key
2. Verify the key at https://home.openweathermap.org/api_keys
3. Copy the key carefully (no extra spaces)
4. Re-export the environment variable

### Error: "Weather service not configured"

**Cause**: API key not set in environment

**Fix**:
```bash
# Check if key is set
echo $OPENWEATHER_API_KEY

# If empty, export it again
export OPENWEATHER_API_KEY="your_actual_key"

# Restart Flask API
```

### Error: "Location not found"

**Cause**: Geolocation returned invalid coordinates

**Fix**:
1. Allow location access in your browser
2. Try refreshing the page
3. Check browser console for geolocation errors

### Error: "Weather service timeout"

**Cause**: Slow internet or OpenWeatherMap API down

**Fix**:
1. Check your internet connection
2. Wait a few seconds and try again
3. Check OpenWeatherMap status: https://status.openweathermap.org/

---

## 📊 How It Works

```
User clicks "Get Weather Data"
          ↓
Browser gets user location (latitude, longitude)
          ↓
Frontend calls: GET /api/weather/current?lat=XX&lon=YY
          ↓
Flask API calls: OpenWeatherMap API with your API key
          ↓
OpenWeatherMap returns: temperature, humidity, rainfall
          ↓
Form auto-fills with weather data ✅
```

---

## 🆓 API Limits (Free Tier)

- **Calls/minute**: 60
- **Calls/day**: 1,000
- **Cost**: Free forever

> 💡 **Tip**: This is more than enough for development and small-scale usage!

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep API key in environment variables
- Add `.env` files to `.gitignore`
- Use different keys for dev/production

### ❌ DON'T:
- Commit API keys to Git
- Share API keys publicly
- Hardcode keys in source code

---

## 📝 Quick Reference

```bash
# Export API key (replace with your actual key)
export OPENWEATHER_API_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# Verify it's set
echo $OPENWEATHER_API_KEY

# Start Flask API
cd crop-prediction-api
source venv/bin/activate
python app.py

# Test API directly
curl "http://localhost:5000/api/weather/current?lat=28.6139&lon=77.2090"
```

---

## ✅ Success Checklist

- [ ] Created OpenWeatherMap account
- [ ] Got API key from dashboard
- [ ] Waited 10-15 minutes for activation
- [ ] Set `OPENWEATHER_API_KEY` environment variable
- [ ] Verified key is set: `echo $OPENWEATHER_API_KEY`
- [ ] Restarted Flask API
- [ ] Tested weather auto-fill in browser
- [ ] Weather data auto-fills successfully ✅

---

## 🆘 Still Having Issues?

1. **Check Flask API logs**:
   ```bash
   cd crop-prediction-api
   cat logs/flask.log
   ```

2. **Test API key directly**:
   ```bash
   curl "http://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=YOUR_API_KEY&units=metric"
   ```

3. **Check browser console** (F12 → Console tab) for JavaScript errors

4. **Verify Flask API is running**: http://localhost:5000/api/health

---

**Last Updated**: November 7, 2025  
**Created by**: Smart-Agri-Platform Team
