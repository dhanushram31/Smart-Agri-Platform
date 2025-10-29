# Animal Detection API 🐗🦌🐘

A comprehensive Flask-based API system for detecting crop-damaging animals in Indian farms using YOLOv8, with email alerts, web interface, and live streaming capabilities.

## 🌟 Features

### Core Detection Capabilities
- **YOLOv8 Integration**: State-of-the-art object detection model
- **Indian Farm Animals**: Specialized detection for 12+ species including wild boar, nilgai, elephants, monkeys, deer, and more
- **Priority-based Classification**: Critical, High, Medium, and Low priority animals
- **High Accuracy**: 0.6 confidence threshold for reliable detection

### Alert System
- **Email Notifications**: Automated Gmail SMTP alerts with detection images
- **Priority-based Alerts**: Different notification levels based on animal threat
- **Rate Limiting**: Intelligent alert management (10 emails/hour, 5-minute intervals)
- **HTML Email Templates**: Professional formatted alerts with detection details

### Web Interface
- **Modern UI**: TailwindCSS responsive design
- **Video Upload**: Drag-and-drop interface with progress tracking
- **Live Streaming**: Real-time RTSP/CCTV camera integration
- **Analytics Dashboard**: Detection history, statistics, and reporting
- **Results Visualization**: Interactive charts and detection timeline

### API Endpoints
- **REST API**: Comprehensive endpoints for all functionality
- **Video Processing**: Upload and process video files
- **Live Stream Control**: Start/stop/configure live detection
- **Statistics**: Get detection analytics and reports
- **Health Monitoring**: System status and performance metrics

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Git
- Gmail account (for email alerts)
- Optional: RTSP camera for live streaming

### 1. Clone and Setup
```bash
cd animal-detection-api
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Create Python virtual environment
- Install all dependencies
- Download YOLOv8 model
- Create directory structure
- Generate configuration files
- Test the installation

### 2. Configure
Edit the `.env` file with your settings:
```bash
# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ALERT_RECIPIENTS=farmer@example.com,security@example.com

# Optional: RTSP Camera
RTSP_URL=rtsp://username:password@camera_ip:port/stream
```

### 3. Start the Server
```bash
# Development mode
./start_dev.sh

# Production mode  
./start_prod.sh
```

### 4. Access the Interface
Open your browser and navigate to: `http://localhost:5000`

## 📁 Project Structure

```
animal-detection-api/
├── app.py                 # Main Flask application
├── detection.py           # YOLOv8 detection engine
├── email_alert.py         # Gmail notification system
├── train_dataset.py       # Model training script
├── requirements.txt       # Python dependencies
├── setup.sh              # Automated setup script
├── .env                  # Environment configuration
├── models/               # YOLOv8 model files
├── static/
│   ├── uploads/          # Uploaded video files
│   └── processed/        # Processed detection results
├── templates/            # HTML web interface
│   ├── index.html        # Main landing page
│   ├── upload.html       # Video upload interface
│   ├── live.html         # Live streaming page
│   └── results.html      # Analytics dashboard
└── logs/                 # Application logs
```

## 🔧 API Documentation

### Upload Video for Detection
```bash
POST /api/upload_video
Content-Type: multipart/form-data

curl -X POST -F "video=@farm_video.mp4" \
     http://localhost:5000/api/upload_video
```

### Start Live Stream Detection
```bash
POST /api/start_live_stream
Content-Type: application/json

{
    "rtsp_url": "rtsp://camera_ip:port/stream",
    "duration": 3600
}
```

### Get Detection Statistics
```bash
GET /api/detection_statistics?days=7
```

### Health Check
```bash
GET /api/health
```

## 🐾 Supported Animals

### Critical Priority (Immediate Action Required)
- **Elephant** 🐘 - Largest crop destroyer, dangerous to humans
- **Wild Boar** 🐗 - Highly destructive, aggressive behavior

### High Priority (Significant Crop Damage)
- **Nilgai** 🦌 - Large antelope, major crop pest
- **Monkey** 🐒 - Intelligent, persistent crop raider

### Medium Priority (Moderate Damage)
- **Deer** 🦌 - Spotted deer, chital
- **Porcupine** 🦔 - Nocturnal crop damage

### Low Priority (Minor Issues)
- **Peacock** 🦚 - Protected bird, limited damage
- **Jackal/Fox** 🦊 - Primarily affects poultry
- **Birds** 🐦 - General bird species
- **Rodents** 🐭 - Small mammals
- **Stray Cattle** 🐄 - Domestic animals
- **Other Domestic Animals** 🐐 - Goats, sheep, etc.

## 🏋️ Model Training

### Prepare Your Dataset
```bash
# From LabelImg annotations
python3 train_dataset.py --mode prepare \
    --dataset-type labelimg \
    --images-path /path/to/images \
    --annotations-path /path/to/xml_annotations \
    --output-path prepared_dataset

# From Roboflow export
python3 train_dataset.py --mode prepare \
    --dataset-type roboflow \
    --dataset-path /path/to/roboflow_export \
    --output-path prepared_dataset
```

### Train Custom Model
```bash
# Train nano model (fastest)
python3 train_dataset.py --mode train \
    --model-size nano \
    --output-path prepared_dataset

# Train medium model (balanced)
python3 train_dataset.py --mode train \
    --model-size medium \
    --output-path prepared_dataset
```

### Evaluate Model
```bash
python3 train_dataset.py --mode evaluate \
    --model-path models/animal_detection_nano_best.pt \
    --output-path prepared_dataset
```

## 🌐 Web Interface

### Main Dashboard (`/`)
- System overview and status
- Quick access to all features
- Recent detection summary
- Animal species gallery

### Video Upload (`/upload`)
- Drag-and-drop video upload
- Progress tracking
- Real-time detection results
- Download processed videos

### Live Streaming (`/live`)
- RTSP camera integration
- Real-time detection overlay
- Stream controls (start/stop/configure)
- Live detection statistics

### Analytics (`/results`)
- Detection history charts
- Animal frequency analysis  
- Time-based patterns
- Export capabilities

## ⚙️ Configuration

### Environment Variables
```bash
# Flask Configuration
FLASK_ENV=development          # development/production
FLASK_DEBUG=True              # True/False
FLASK_HOST=0.0.0.0           # Server host
FLASK_PORT=5000              # Server port

# Detection Settings
DETECTION_CONFIDENCE=0.6      # Confidence threshold (0.0-1.0)
MODEL_PATH=models/yolov8n.pt  # Path to YOLOv8 model
MAX_UPLOAD_SIZE=100MB        # Maximum file upload size

# Email Alerts
SMTP_SERVER=smtp.gmail.com    # SMTP server
SMTP_PORT=587                # SMTP port
EMAIL_USER=your@gmail.com    # Gmail address
EMAIL_PASSWORD=app_password   # Gmail app password
ALERT_RECIPIENTS=emails       # Comma-separated recipients

# Camera Configuration
RTSP_URL=rtsp://ip:port/stream # RTSP camera URL

# Logging
LOG_LEVEL=INFO               # DEBUG/INFO/WARNING/ERROR
LOG_FILE=logs/detection.log  # Log file path
```

### Gmail Setup
1. Enable 2-factor authentication in your Gmail account
2. Generate an "App Password" for the application
3. Use the app password in `EMAIL_PASSWORD` (not your regular password)

## 🔧 Development

### Running Tests
```bash
source venv/bin/activate
python3 -m pytest tests/
```

### Adding New Animal Classes
1. Update `INDIAN_FARM_ANIMALS` dict in `detection.py`
2. Update priority mappings in `get_animal_priority()`
3. Retrain model with new classes
4. Update email templates if needed

### Custom Email Templates
Modify `create_detection_email_html()` in `email_alert.py` to customize email appearance and content.

## 📊 Performance Optimization

### Model Selection
- **Nano (yolov8n.pt)**: Fastest inference, lower accuracy
- **Small (yolov8s.pt)**: Balanced speed and accuracy
- **Medium (yolov8m.pt)**: Higher accuracy, slower inference

### Hardware Acceleration
- **GPU**: Install CUDA-compatible PyTorch for GPU acceleration
- **TensorRT**: Export models to TensorRT for NVIDIA GPUs
- **OpenVINO**: Export for Intel hardware optimization

### Production Deployment
```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 300 app:app

# Or use the provided script
./start_prod.sh
```

## 🐛 Troubleshooting

### Common Issues

**1. YOLOv8 Model Not Found**
```bash
# Download manually
python3 -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
mv yolov8n.pt models/
```

**2. Email Alerts Not Working**
- Check Gmail app password setup
- Verify SMTP settings in `.env`
- Check firewall/network restrictions

**3. RTSP Stream Issues**
- Verify camera URL format
- Check network connectivity
- Test with VLC or similar player first

**4. Large File Uploads Failing**
- Increase `MAX_UPLOAD_SIZE` in `.env`
- Check available disk space
- Verify file format support

**5. Detection Accuracy Issues**
- Adjust `DETECTION_CONFIDENCE` threshold
- Retrain with more specific dataset
- Use larger YOLOv8 model variant

### Debug Mode
```bash
export FLASK_DEBUG=True
export LOG_LEVEL=DEBUG
python3 app.py
```

## 📈 Monitoring

### Log Files
- Application logs: `logs/animal_detection.log`
- Error logs: Check console output
- Detection statistics: Available via `/api/detection_statistics`

### Health Checks
```bash
# System health
curl http://localhost:5000/api/health

# Detection status
curl http://localhost:5000/api/detection_statistics
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Climate-Smart Agriculture Platform. See the main project repository for license information.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review logs in `logs/animal_detection.log`
- Open an issue in the main project repository

## 🙏 Acknowledgments

- **Ultralytics**: YOLOv8 implementation
- **OpenCV**: Computer vision processing
- **Flask**: Web framework
- **TailwindCSS**: UI styling
- **Chart.js**: Data visualization

---

**Happy Farming! 🚜🌾** Protect your crops with AI-powered animal detection!
