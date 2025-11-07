# 🔧 Progress Tracking Fix - Animal Detection API

## Problem Summary

The frontend was getting **404 NOT FOUND** errors when checking video processing progress because:

1. **Video ID Mismatch**: The frontend was requesting progress with an incorrect `video_id`
   - Frontend requested: `animals_20251106_141157` (no extension, wrong timestamp)
   - Backend stored: `animals_20251106_194157_0e6061c3.mp4` (with extension, UUID, correct timestamp)

2. **Strict Matching**: The original code only did exact matches, which failed when:
   - Extensions were missing
   - UUIDs were not included
   - Timestamps didn't match

## Fixes Applied

### 1. **Improved Video ID Matching** (`get_processing_progress`)

Added **4-tier fallback matching strategy**:

```python
# Tier 1: Exact Match
if video_id in processing_progress:
    actual_key = video_id

# Tier 2: Try with Common Extensions
for ext in ['.mp4', '.avi', '.mov', ...]:
    if video_id + ext in processing_progress:
        actual_key = video_id + ext

# Tier 3: Fuzzy Match by Base Name
# Extracts base filename (e.g., "animals" from "animals_20251106_141157")
# Matches any key that starts with the same base name

# Tier 4: Substring Matching (Last Resort)
# Matches if either string contains the other
```

### 2. **Enhanced Logging**

Added detailed logging to help debug matching issues:

```python
# In upload_video():
app.logger.info(f"Unique filename for tracking: {unique_filename}")
app.logger.info(f"Progress tracking initialized for: {unique_filename}")

# In get_processing_progress():
app.logger.info(f"Progress request for video_id: {video_id}")
app.logger.info(f"Available keys in processing_progress: {list(processing_progress.keys())}")
app.logger.info(f"Fuzzy matched video_id '{video_id}' to '{actual_key}'")
```

### 3. **Better Error Messages**

Enhanced 404 response with helpful debugging info:

```json
{
  "error": "Video processing not found",
  "video_id": "animals_20251106_141157",
  "status": "not_found",
  "available_ids": [
    "animals_20251106_194157_0e6061c3.mp4",
    "855538-hd_1920_1080_25fps_20251106_194139_8471a6d8.mp4"
  ],
  "hint": "The video_id in the URL does not match any processing records..."
}
```

## How It Works Now

### Upload Flow:

1. **Frontend uploads**: `animals.mp4`
2. **Backend generates unique filename**: `animals_20251106_194157_0e6061c3.mp4`
3. **Backend stores progress with key**: `animals_20251106_194157_0e6061c3.mp4`
4. **Backend returns in response**: `"video_id": "animals_20251106_194157_0e6061c3.mp4"`

### Progress Check Flow:

5. **Frontend requests**: `/api/processing_progress/animals_20251106_141157`
6. **Backend tries matching**:
   - Exact match: ❌ Not found
   - With extension: ❌ Not found
   - Fuzzy match by base name: ✅ Finds `animals_20251106_194157_0e6061c3.mp4`
7. **Backend returns progress**: With both `video_id` (actual) and `requested_id` (what was asked)

## Testing the Fix

### 1. Restart the API

```bash
cd animal-detection-api
source venv/bin/activate
python3 app.py
```

### 2. Test Video Upload

```bash
curl -X POST http://localhost:5003/api/upload_video \
  -F "video=@/path/to/test.mp4"
```

**Expected Response:**
```json
{
  "success": true,
  "video_id": "test_20251106_194157_abc12345.mp4",
  "message": "Video processed successfully!",
  ...
}
```

### 3. Test Progress Tracking

**Using the EXACT video_id from the upload response:**
```bash
curl http://localhost:5003/api/processing_progress/test_20251106_194157_abc12345.mp4
```

**Using a PARTIAL video_id (tests fuzzy matching):**
```bash
curl http://localhost:5003/api/processing_progress/test_20251106_194157
```

**Using just the BASE NAME (tests base name matching):**
```bash
curl http://localhost:5003/api/processing_progress/test
```

All three should now work! ✅

## Frontend Requirements

**IMPORTANT**: The frontend should use the **exact `video_id`** returned in the upload response:

### ❌ Incorrect (Old Way):
```javascript
// DON'T construct your own video_id
const videoId = `${filename}_${timestamp}`;
fetch(`/api/processing_progress/${videoId}`);
```

### ✅ Correct (New Way):
```javascript
// USE the video_id from the upload response
const response = await uploadVideo(file);
const videoId = response.video_id;  // Use this!
fetch(`/api/processing_progress/${videoId}`);
```

## Why This Happened

The root cause was likely a **timing issue** or **timezone difference**:

- File uploaded at: `14:11:57` (frontend's clock)
- Backend processed at: `19:41:57` (server's clock or different timezone)
- Frontend tried to check progress with: `141157`
- Backend stored with: `194157`

The new fuzzy matching resolves this by matching based on the **base filename** instead of requiring exact timestamp matches.

## Monitoring

Check the logs to see matching in action:

```bash
# Watch the logs in real-time
tail -f logs/animal_detection.log

# Or check the terminal output
```

You should see:
```
INFO: Progress request for video_id: animals_20251106_141157
INFO: Available keys in processing_progress: ['animals_20251106_194157_0e6061c3.mp4']
INFO: Fuzzy matched video_id 'animals_20251106_141157' to 'animals_20251106_194157_0e6061c3.mp4'
```

## Additional Improvements

### Future Enhancement: Use Database Instead of In-Memory Dict

Currently, `processing_progress` is a Python dictionary that gets cleared on restart. Consider:

```python
# Option 1: Redis for fast in-memory storage
import redis
r = redis.Redis()
r.set(video_id, json.dumps(progress_data))

# Option 2: SQLite for persistent storage
import sqlite3
conn = sqlite3.connect('progress.db')
conn.execute('INSERT INTO progress VALUES (?, ?)', (video_id, json.dumps(progress_data)))
```

### Future Enhancement: Cleanup Old Progress Records

Add a cleanup function to remove completed/old records:

```python
def cleanup_old_progress():
    """Remove progress records older than 1 hour"""
    cutoff_time = datetime.now() - timedelta(hours=1)
    for key in list(processing_progress.keys()):
        record_time = datetime.fromisoformat(processing_progress[key]['timestamp'])
        if record_time < cutoff_time:
            del processing_progress[key]
```

## Status

✅ **Fixed**: Video ID matching now works with flexible matching strategies  
✅ **Fixed**: Better error messages with debugging info  
✅ **Fixed**: Enhanced logging for troubleshooting  
✅ **Ready**: API can handle various video_id formats  

---

**Last Updated**: November 6, 2025  
**API Version**: 1.0.0  
**Python**: 3.12.1  
**Flask**: 3.0.0
