#!/bin/bash

# Soil Report Extraction Setup Script
# Run this script to install all dependencies

echo "🌱 Smart Agri Platform - Soil Report Extraction Setup"
echo "======================================================"
echo ""

# Check Python version
echo "📝 Checking Python version..."
python_version=$(python3 --version 2>&1)
echo "   Found: $python_version"
echo ""

# Check if Tesseract is installed
echo "🔍 Checking for Tesseract OCR..."
if command -v tesseract &> /dev/null; then
    tesseract_version=$(tesseract --version 2>&1 | head -n 1)
    echo "   ✅ Found: $tesseract_version"
else
    echo "   ❌ Tesseract OCR not found!"
    echo ""
    echo "   Please install Tesseract:"
    echo "   - macOS:   brew install tesseract"
    echo "   - Ubuntu:  sudo apt-get install tesseract-ocr"
    echo "   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki"
    echo ""
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Navigate to API directory
echo "📂 Navigating to crop-prediction-api..."
cd "$(dirname "$0")/crop-prediction-api" || exit
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
    echo "   ✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate
echo "   ✅ Activated"
echo ""

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip
echo ""

# Install requirements
echo "📦 Installing Python packages..."
echo "   This may take a few minutes..."
pip install -r requirements.txt
echo ""

# Verify installations
echo "✅ Verifying installations..."
python3 << EOF
import sys
packages = [
    'flask',
    'flask_cors',
    'numpy',
    'sklearn',
    'PyPDF2',
    'pdfplumber',
    'PIL',
    'pytesseract',
    'cv2'
]

missing = []
for package in packages:
    try:
        __import__(package)
        print(f"   ✅ {package}")
    except ImportError:
        print(f"   ❌ {package} - NOT FOUND")
        missing.append(package)

if missing:
    print(f"\n   ⚠️  Missing packages: {', '.join(missing)}")
    sys.exit(1)
else:
    print("\n   ✅ All packages installed successfully!")
EOF

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Some packages failed to install. Please check the errors above."
    exit 1
fi
echo ""

# Test Tesseract Python binding
echo "🧪 Testing Tesseract Python integration..."
python3 << EOF
try:
    import pytesseract
    version = pytesseract.get_tesseract_version()
    print(f"   ✅ Tesseract Python binding works! Version: {version}")
except Exception as e:
    print(f"   ⚠️  Tesseract test failed: {e}")
    print("   Make sure Tesseract is installed and in PATH")
EOF
echo ""

# Create test directory
echo "📁 Setting up test directory..."
mkdir -p test_reports
echo "   ✅ test_reports/ directory created"
echo ""

# Success message
echo "======================================================"
echo "🎉 Setup Complete!"
echo "======================================================"
echo ""
echo "📝 Next Steps:"
echo "   1. Start the API server:"
echo "      cd crop-prediction-api"
echo "      source venv/bin/activate"
echo "      python app.py"
echo ""
echo "   2. Test with a soil report:"
echo "      - Upload a PDF or image through the web interface"
echo "      - Check console for extraction results"
echo ""
echo "   3. View documentation:"
echo "      - SOIL_EXTRACTION_GUIDE.md"
echo "      - SOIL_REPORT_FIX_DOCUMENTATION.md"
echo ""
echo "✨ Happy farming! 🌾"
echo ""
