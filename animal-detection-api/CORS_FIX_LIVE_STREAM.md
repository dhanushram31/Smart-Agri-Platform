# 🔧 Animal Detection API - CORS Fix

## 🐛 Problem: Live Stream Failed to Fetch

### Error Details:
```
Status: 0 (Network Error)
Request: POST http://localhost:5003/api/start_live_stream
Origin: http://localhost:3001
Error: "Failed to fetch"
```

### Root Cause:
**CORS Preflight Request Failure** - The browser sends an OPTIONS request before the actual POST request. The server wasn't properly handling these preflight requests, causing the browser to block the actual request with a status code 0.

## ✅ Solution Applied

### 1. Enhanced CORS Configuration

**Before:**
```python
CORS(app,
     resources={r"/api/*": {"origins": ["http://localhost:3001", "http://localhost:3000"]}},
     supports_credentials=True,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'])
```

**After:**
```python
CORS(app,
     resources={
         r"/api/*": {
             "origins": ["http://localhost:3001", "http://localhost:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
             "expose_headers": ["Content-Type"],
             "supports_credentials": True,
             "max_age": 3600  # Cache preflight for 1 hour
         }
     })
```

**Changes:**
- ✅ Restructured configuration for clarity
- ✅ Added `expose_headers` for response header visibility
- ✅ Added `max_age: 3600` to cache preflight responses for 1 hour
- ✅ More explicit configuration prevents CORS edge cases

### 2. Added Explicit OPTIONS Handlers

#### Updated Endpoints:

**1. `/api/upload_video`**
```python
@app.route('/api/upload_video', methods=['POST', 'OPTIONS'])
def upload_video():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response, 200
    
    # ... existing upload logic
```

**2. `/api/start_live_stream`**
```python
@app.route('/api/start_live_stream', methods=['POST', 'OPTIONS'])
def start_live_stream():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response, 200
    
    # ... existing stream logic
```

**3. `/api/stop_live_stream`**
```python
@app.route('/api/stop_live_stream', methods=['POST', 'OPTIONS'])
def stop_live_stream():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response, 200
    
    # ... existing stop logic
```

## 🔍 What These Changes Do

### Preflight Request Handling:
1. **Browser sends OPTIONS request** before actual POST
2. **Server responds with CORS headers** indicating allowed methods/headers
3. **Browser sees approval** and sends the actual POST request
4. **Request succeeds** with proper CORS headers

### Key CORS Headers Explained:

| Header | Purpose | Value |
|--------|---------|-------|
| `Access-Control-Allow-Origin` | Which origins can access | `http://localhost:3001` |
| `Access-Control-Allow-Methods` | Which HTTP methods allowed | `POST, OPTIONS` |
| `Access-Control-Allow-Headers` | Which request headers allowed | `Content-Type, Authorization` |
| `Access-Control-Max-Age` | How long to cache preflight | `3600` seconds (1 hour) |
| `Access-Control-Expose-Headers` | Which response headers visible | `Content-Type` |

## 🧪 Testing the Fix

### 1. Test Preflight Request (OPTIONS)
```bash
curl -X OPTIONS http://localhost:5003/api/start_live_stream \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3001
< Access-Control-Allow-Methods: POST, OPTIONS
< Access-Control-Allow-Headers: Content-Type, Authorization
< Access-Control-Max-Age: 3600
```

### 2. Test Actual POST Request
```bash
curl -X POST http://localhost:5003/api/start_live_stream \
  -H "Origin: http://localhost:3001" \
  -H "Content-Type: application/json" \
  -d '{"rtsp_url": "rtsp://example.com/stream"}' \
  -v
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Live stream started successfully",
  "rtsp_url": "rtsp://example.com/stream"
}
```

### 3. Test from Frontend
```javascript
// In your React app
fetch('http://localhost:5003/api/start_live_stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    rtsp_url: 'rtsp://example.com/stream'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## 📋 Files Modified

```
animal-detection-api/
└── app.py ← Updated CORS configuration and added OPTIONS handlers
```

**Changes:**
- Line 41-53: Enhanced CORS configuration
- Line 167: Added OPTIONS to upload_video route
- Line 169-178: Added OPTIONS handler for upload_video
- Line 298: Added OPTIONS to start_live_stream route
- Line 300-309: Added OPTIONS handler for start_live_stream
- Line 342: Added OPTIONS to stop_live_stream route
- Line 344-353: Added OPTIONS handler for stop_live_stream

## 🚀 Deployment Steps

### 1. Restart the API
```bash
cd animal-detection-api

# Stop existing process
lsof -ti:5003 | xargs kill -9

# Start with new configuration
source venv/bin/activate
python3 app.py
```

### 2. Verify API is Running
```bash
curl http://localhost:5003/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-06T...",
  "version": "1.0.0",
  "services": { ... }
}
```

### 3. Test Live Stream Endpoint
```bash
# Test OPTIONS (preflight)
curl -X OPTIONS http://localhost:5003/api/start_live_stream \
  -H "Origin: http://localhost:3001" \
  -i

# Should see CORS headers in response
```

## 🎯 Why This Fix Works

### The CORS Flow:

```
┌─────────────┐                                ┌─────────────┐
│   Browser   │                                │   Server    │
│ (Port 3001) │                                │ (Port 5003) │
└─────────────┘                                └─────────────┘
       │                                               │
       │  1. OPTIONS /api/start_live_stream           │
       │─────────────────────────────────────────────>│
       │     Origin: http://localhost:3001            │
       │     Access-Control-Request-Method: POST      │
       │                                               │
       │  2. 200 OK + CORS Headers                    │
       │<─────────────────────────────────────────────│
       │     Access-Control-Allow-Origin: ...         │
       │     Access-Control-Allow-Methods: POST, ...  │
       │                                               │
       │  3. ✅ Preflight approved!                   │
       │                                               │
       │  4. POST /api/start_live_stream              │
       │─────────────────────────────────────────────>│
       │     Content-Type: application/json           │
       │     Body: {"rtsp_url": "..."}                │
       │                                               │
       │  5. 200 OK + Response Data                   │
       │<─────────────────────────────────────────────│
       │     {"success": true, ...}                   │
       │                                               │
```

### Before the Fix:
- ❌ Step 2 failed (no proper OPTIONS response)
- ❌ Browser blocked step 4
- ❌ Status code: 0 (network error)

### After the Fix:
- ✅ Step 2 succeeds with CORS headers
- ✅ Browser allows step 4
- ✅ Status code: 200 (success)

## 🛡️ Security Considerations

### Current Setup (Development):
```python
"origins": ["http://localhost:3001", "http://localhost:3000"]
```

### Production Recommendations:

```python
import os

# Use environment variable for allowed origins
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '').split(',')

CORS(app,
     resources={
         r"/api/*": {
             "origins": ALLOWED_ORIGINS,  # From .env file
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }
     })
```

**Environment File (.env):**
```bash
# Development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# Production
ALLOWED_ORIGINS=https://your-farm-app.com,https://api.your-farm-app.com
```

## 📚 Additional Resources

### CORS Documentation:
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)

### Related Endpoints Fixed:
- ✅ `/api/upload_video` - Video upload with progress tracking
- ✅ `/api/start_live_stream` - Start RTSP stream detection
- ✅ `/api/stop_live_stream` - Stop active stream

### Other Endpoints (already working):
- ✅ `/api/health` - Health check (GET only, no preflight)
- ✅ `/api/processing_progress/<video_id>` - Progress status (GET only)
- ✅ `/api/live_stream_status` - Stream status (GET only)

## ✅ Success Indicators

After applying this fix, you should see:

1. **No more Status 0 errors** in browser console
2. **OPTIONS requests succeed** (visible in Network tab)
3. **POST requests go through** after OPTIONS
4. **Live stream starts successfully**
5. **CORS headers present** in all responses

## 🎉 Summary

The CORS preflight issue has been fixed by:
1. ✅ Enhanced CORS configuration with explicit settings
2. ✅ Added OPTIONS method handlers to all POST endpoints
3. ✅ Proper CORS headers in preflight responses
4. ✅ Caching of preflight responses (1 hour)
5. ✅ Clear separation of OPTIONS and POST logic

**Status: FIXED** ✨

The live streaming feature should now work properly from the React frontend on `http://localhost:3001`!

---

**Last Updated**: November 6, 2025  
**Fixed By**: CORS preflight handler implementation  
**API Version**: 1.0.0  
**Tested**: ✅ OPTIONS requests, ✅ POST requests, ✅ CORS headers
