@echo off
REM Soil Report Extraction Setup Script for Windows
REM Run this script to install all dependencies

echo ========================================================
echo    Smart Agri Platform - Soil Report Extraction Setup
echo ========================================================
echo.

REM Check Python
echo Checking Python version...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo.

REM Check Tesseract
echo Checking for Tesseract OCR...
tesseract --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Tesseract OCR not found!
    echo.
    echo Please install Tesseract from:
    echo https://github.com/UB-Mannheim/tesseract/wiki
    echo.
    echo After installation, add to PATH:
    echo C:\Program Files\Tesseract-OCR
    echo.
    choice /C YN /M "Continue anyway?"
    if errorlevel 2 exit /b 1
) else (
    tesseract --version
)
echo.

REM Navigate to API directory
echo Navigating to crop-prediction-api...
cd crop-prediction-api
echo.

REM Create virtual environment
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install requirements
echo Installing Python packages...
echo This may take a few minutes...
pip install -r requirements.txt
echo.

REM Verify installations
echo ========================================================
echo Verifying installations...
echo ========================================================
python -c "import flask; print('   OK: Flask')"
python -c "import flask_cors; print('   OK: Flask-CORS')"
python -c "import numpy; print('   OK: NumPy')"
python -c "import sklearn; print('   OK: scikit-learn')"
python -c "import PyPDF2; print('   OK: PyPDF2')"
python -c "import pdfplumber; print('   OK: pdfplumber')"
python -c "import PIL; print('   OK: Pillow')"
python -c "import pytesseract; print('   OK: pytesseract')"
python -c "import cv2; print('   OK: OpenCV')"
echo.

REM Test Tesseract
echo Testing Tesseract Python integration...
python -c "import pytesseract; print('   OK: Tesseract version:', pytesseract.get_tesseract_version())"
echo.

REM Create test directory
if not exist test_reports (
    echo Creating test_reports directory...
    mkdir test_reports
    echo Done!
)
echo.

echo ========================================================
echo    Setup Complete!
echo ========================================================
echo.
echo Next Steps:
echo   1. Start the API server:
echo      cd crop-prediction-api
echo      venv\Scripts\activate
echo      python app.py
echo.
echo   2. Test with a soil report:
echo      - Upload PDF/image through web interface
echo      - Check console for extraction results
echo.
echo   3. View documentation:
echo      - SOIL_EXTRACTION_GUIDE.md
echo      - SOIL_REPORT_FIX_DOCUMENTATION.md
echo.
echo Happy farming! 
echo.
pause
