#!/bin/bash

# Animal Detection API Setup Script
# ================================
# This script sets up the complete Animal Detection API system
# for monitoring farm areas and detecting crop-damaging animals.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if script is run from correct directory
check_directory() {
    if [[ ! -f "app.py" ]] || [[ ! -f "requirements.txt" ]]; then
        print_error "Please run this script from the animal-detection-api directory"
        exit 1
    fi
}

# Check Python version
check_python() {
    print_section "Checking Python Installation"
    
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_status "Found Python $PYTHON_VERSION"
        
        # Check if version is 3.8 or higher
        if python3 -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)"; then
            print_status "Python version is compatible"
        else
            print_error "Python 3.8 or higher is required"
            exit 1
        fi
    else
        print_error "Python 3 is not installed"
        exit 1
    fi
}

# Create virtual environment
create_venv() {
    print_section "Setting up Virtual Environment"
    
    if [[ -d "venv" ]]; then
        print_warning "Virtual environment already exists"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf venv
        else
            print_status "Using existing virtual environment"
            return
        fi
    fi
    
    print_status "Creating virtual environment..."
    python3 -m venv venv
    
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    print_status "Upgrading pip..."
    pip install --upgrade pip
}

# Install Python packages
install_packages() {
    print_section "Installing Python Packages"
    
    if [[ ! -f "venv/bin/activate" ]]; then
        print_error "Virtual environment not found. Please run create_venv first."
        exit 1
    fi
    
    source venv/bin/activate
    
    print_status "Installing packages from requirements.txt..."
    pip install -r requirements.txt
    
    print_status "All packages installed successfully!"
}

# Create necessary directories
create_directories() {
    print_section "Creating Directory Structure"
    
    directories=(
        "static/uploads"
        "static/processed"
        "models"
        "logs"
        "datasets"
    )
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        else
            print_status "Directory already exists: $dir"
        fi
    done
}

# Download YOLOv8 model
download_model() {
    print_section "Downloading YOLOv8 Model"
    
    if [[ ! -f "venv/bin/activate" ]]; then
        print_error "Virtual environment not found"
        exit 1
    fi
    
    source venv/bin/activate
    
    print_status "Downloading YOLOv8 nano model..."
    python3 -c "
from ultralytics import YOLO
import os

# Download YOLOv8 nano model
model = YOLO('yolov8n.pt')
print('YOLOv8 model downloaded successfully!')

# Move to models directory
import shutil
if os.path.exists('yolov8n.pt'):
    shutil.move('yolov8n.pt', 'models/yolov8n.pt')
    print('Model moved to models/yolov8n.pt')
"
    
    print_status "YOLOv8 model ready!"
}

# Create environment configuration file
create_env_config() {
    print_section "Creating Environment Configuration"
    
    if [[ -f ".env" ]]; then
        print_warning ".env file already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi
    
    cat > .env << EOF
# Animal Detection API Configuration
# ================================

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Detection Configuration
DETECTION_CONFIDENCE=0.6
MODEL_PATH=models/yolov8n.pt
MAX_UPLOAD_SIZE=100MB

# Email Configuration (Gmail SMTP)
# Fill in your Gmail credentials to enable email alerts
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Alert Recipients (comma-separated)
ALERT_RECIPIENTS=farmer@example.com,security@example.com

# RTSP Stream Configuration (optional)
# RTSP_URL=rtsp://username:password@camera_ip:port/stream

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/animal_detection.log

# File Upload Limits
UPLOAD_FOLDER=static/uploads
PROCESSED_FOLDER=static/processed
MAX_FILE_SIZE=104857600

# Security (change in production)
SECRET_KEY=change-this-secret-key-in-production
EOF
    
    print_status "Created .env configuration file"
    print_warning "Please edit .env file with your actual configuration values"
}

# Test installation
test_installation() {
    print_section "Testing Installation"
    
    if [[ ! -f "venv/bin/activate" ]]; then
        print_error "Virtual environment not found"
        exit 1
    fi
    
    source venv/bin/activate
    
    print_status "Testing Python imports..."
    python3 -c "
import flask
import cv2
import numpy as np
from ultralytics import YOLO
import smtplib
print('✅ All required packages imported successfully!')
"
    
    print_status "Testing YOLOv8 model loading..."
    python3 -c "
from ultralytics import YOLO
import os

model_path = 'models/yolov8n.pt'
if os.path.exists(model_path):
    model = YOLO(model_path)
    print('✅ YOLOv8 model loaded successfully!')
else:
    print('❌ YOLOv8 model not found')
    exit(1)
"
    
    print_status "Installation test completed successfully!"
}

# Create startup script
create_startup_script() {
    print_section "Creating Startup Scripts"
    
    # Development startup script
    cat > start_dev.sh << 'EOF'
#!/bin/bash

# Animal Detection API - Development Startup
echo "Starting Animal Detection API (Development Mode)..."

# Check if virtual environment exists
if [[ ! -d "venv" ]]; then
    echo "Error: Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Load environment variables
if [[ -f ".env" ]]; then
    export $(grep -v '^#' .env | xargs)
fi

# Start Flask application
echo "Starting Flask server on http://localhost:5000"
python3 app.py
EOF

    # Production startup script
    cat > start_prod.sh << 'EOF'
#!/bin/bash

# Animal Detection API - Production Startup
echo "Starting Animal Detection API (Production Mode)..."

# Check if virtual environment exists
if [[ ! -d "venv" ]]; then
    echo "Error: Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Load environment variables
if [[ -f ".env" ]]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=False

# Install gunicorn if not present
pip install gunicorn

# Start with gunicorn
echo "Starting production server with Gunicorn..."
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 300 app:app
EOF

    chmod +x start_dev.sh start_prod.sh
    
    print_status "Created startup scripts: start_dev.sh and start_prod.sh"
}

# Create systemd service file (for Linux)
create_systemd_service() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_section "Creating Systemd Service (Linux)"
        
        read -p "Do you want to create a systemd service for auto-startup? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            
            CURRENT_DIR=$(pwd)
            USER=$(whoami)
            
            cat > animal-detection.service << EOF
[Unit]
Description=Animal Detection API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$CURRENT_DIR
Environment=PATH=$CURRENT_DIR/venv/bin
ExecStart=$CURRENT_DIR/venv/bin/python3 $CURRENT_DIR/app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
            
            print_status "Created systemd service file: animal-detection.service"
            print_warning "To install the service, run:"
            print_warning "  sudo cp animal-detection.service /etc/systemd/system/"
            print_warning "  sudo systemctl daemon-reload"
            print_warning "  sudo systemctl enable animal-detection"
            print_warning "  sudo systemctl start animal-detection"
        fi
    fi
}

# Main setup function
main() {
    print_section "Animal Detection API Setup"
    
    echo "This script will set up the Animal Detection API system."
    echo "The system includes:"
    echo "  • Flask web server with REST API"
    echo "  • YOLOv8 animal detection model"
    echo "  • Email alert system"
    echo "  • Web interface for video upload and live streaming"
    echo "  • Training scripts for custom datasets"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
    
    # Run setup steps
    check_directory
    check_python
    create_venv
    install_packages
    create_directories
    download_model
    create_env_config
    test_installation
    create_startup_script
    create_systemd_service
    
    print_section "Setup Complete!"
    
    echo -e "\n${GREEN}🎉 Animal Detection API setup completed successfully!${NC}\n"
    
    echo "Next steps:"
    echo "1. Edit the .env file with your configuration:"
    echo "   - Gmail credentials for email alerts"
    echo "   - RTSP camera URLs (optional)"
    echo "   - Alert recipient email addresses"
    echo ""
    echo "2. Start the development server:"
    echo "   ./start_dev.sh"
    echo ""
    echo "3. Access the web interface:"
    echo "   http://localhost:5000"
    echo ""
    echo "4. To train custom models:"
    echo "   python3 train_dataset.py --help"
    echo ""
    echo "5. For production deployment:"
    echo "   ./start_prod.sh"
    echo ""
    
    print_warning "Don't forget to configure your Gmail app password for email alerts!"
    print_status "Setup completed. Happy farming! 🚜🌾"
}

# Run main function
main
