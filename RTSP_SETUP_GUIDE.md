# 🎥 RTSP Streaming Setup Guide for Animal Detection

## Quick Setup Options

### Option 1: Using Your Phone as Camera (Recommended for Testing)

#### For Android:
1. **Download "IP Webcam"** from Google Play Store (free)
2. Open the app
3. Scroll to bottom and tap **"Start Server"**
4. Note the IP address shown (e.g., 192.168.1.105:8080)
5. Your RTSP URL will be: `rtsp://192.168.1.105:8080/h264_pcm.sdp`

**Alternative URL formats:**
- HTTP Stream: `http://192.168.1.105:8080/video`
- MJPEG: `http://192.168.1.105:8080/videofeed`

#### For iPhone:
1. **Download "RTSP Camera"** from App Store
2. Enable RTSP server in settings
3. Get your RTSP URL from the app

---

### Option 2: Using OBS Studio (For Computer Webcam)

1. **Download OBS Studio**: https://obsproject.com/
2. Open OBS and go to **Settings → Stream**
3. Set up an RTSP server:
   ```
   Server: rtsp://localhost:8554/live
   ```
4. Start streaming from OBS

---

### Option 3: Using a Real CCTV Camera

#### Common Camera Brands:

**Hikvision:**
```
rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101
```

**Dahua:**
```
rtsp://admin:password@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0
```

**Axis:**
```
rtsp://root:password@192.168.1.100:554/axis-media/media.amp
```

**TP-Link:**
```
rtsp://admin:password@192.168.1.100:554/stream1
```

---

## 🔍 Finding Your Camera's RTSP URL

### Method 1: Check Camera Documentation
- Look for RTSP URL format in manual or manufacturer website

### Method 2: Use ONVIF Device Manager
1. Download ONVIF Device Manager (free)
2. Scan your network for cameras
3. View the RTSP URL for each camera

### Method 3: Try Common Patterns
Replace with your camera's IP:
```
rtsp://admin:password@192.168.1.100:554/live
rtsp://admin:password@192.168.1.100:554/stream1
rtsp://admin:password@192.168.1.100:554/h264
```

---

## ⚙️ Setup Steps for Your Website

### 1. Ensure Animal Detection API is Running
```bash
cd animal-detection-api
python3 app.py
```

Should show: `Running on http://localhost:5003`

### 2. Test Your RTSP URL
Use VLC Media Player to test:
1. Open VLC
2. Go to **Media → Open Network Stream**
3. Paste your RTSP URL
4. Click Play

If it works in VLC, it will work in your app!

### 3. Use in Your Website
1. Navigate to Animal Detection → Live Stream tab
2. Enter your RTSP URL
3. Click "Start Stream"

---

## 🚀 Quick Test with IP Webcam (Android)

### Complete Step-by-Step:

1. **Install IP Webcam** on your Android phone
2. **Connect phone to same WiFi** as your computer
3. **Start the server** in IP Webcam app
4. **Note the IP address** shown (e.g., 192.168.1.105:8080)
5. **Open your browser** to http://localhost:3001
6. **Go to Animal Detection** → Live Stream
7. **Enter RTSP URL**: `rtsp://192.168.1.105:8080/h264_pcm.sdp`
8. **Click "Start Stream"**

---

## 🔧 Troubleshooting

### Stream Not Loading?
- ✅ Ensure phone and computer are on **same WiFi network**
- ✅ Check firewall isn't blocking port 5003
- ✅ Verify RTSP URL is correct (test in VLC first)
- ✅ Make sure Animal Detection API is running

### Poor Performance?
- Use lower resolution in IP Webcam settings
- Reduce FPS to 15-20
- Move closer to WiFi router

### Can't Find Camera IP?
Run in terminal:
```bash
# macOS/Linux
arp -a

# Or use your router's admin panel
```

---

## 📱 Recommended Free RTSP Apps

**Android:**
- IP Webcam ⭐ (Best for testing)
- DroidCam
- Alfred Camera

**iPhone:**
- RTSP Camera
- AtHome Camera
- EpocCam

---

## 🎯 Expected Result

Once connected, you should see:
- ✅ Live video feed from your camera
- ✅ Real-time animal detection with bounding boxes
- ✅ Detection statistics (FPS, total detections)
- ✅ Alert notifications when animals are detected

---

## 💡 Pro Tips

1. **Test with VLC first** - Always verify RTSP URL works in VLC before using in website
2. **Use wired connection** - For best quality, connect camera via Ethernet
3. **Static IP** - Set camera to use static IP to avoid URL changes
4. **Lower latency** - Use lower resolution for faster processing
5. **Network speed** - Ensure good WiFi signal strength

---

## 🆘 Still Having Issues?

Common default credentials:
- Username: `admin`
- Password: `admin`, `password`, `12345`, or check camera label

Check camera manufacturer's documentation for specific RTSP URL format.
