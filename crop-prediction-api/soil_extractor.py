"""
Soil Report Extraction Module
Extracts NPK, pH, and other soil data from PDF and image files
"""

import re
import base64
import io
from PIL import Image
import pytesseract
import PyPDF2
import pdfplumber
import numpy as np

class SoilReportExtractor:
    """Extract soil data from PDF and image reports"""
    
    def __init__(self):
        # Common patterns for soil report data
        self.patterns = {
            'N': [
                r'nitrogen[:\s]+(\d+\.?\d*)',
                r'N[:\s]+(\d+\.?\d*)',
                r'N\s*=\s*(\d+\.?\d*)',
                r'Available\s+N[:\s]+(\d+\.?\d*)',
            ],
            'P': [
                r'phosphorus[:\s]+(\d+\.?\d*)',
                r'P[:\s]+(\d+\.?\d*)',
                r'P\s*=\s*(\d+\.?\d*)',
                r'Available\s+P[:\s]+(\d+\.?\d*)',
                r'P2O5[:\s]+(\d+\.?\d*)',
            ],
            'K': [
                r'potassium[:\s]+(\d+\.?\d*)',
                r'K[:\s]+(\d+\.?\d*)',
                r'K\s*=\s*(\d+\.?\d*)',
                r'Available\s+K[:\s]+(\d+\.?\d*)',
                r'K2O[:\s]+(\d+\.?\d*)',
            ],
            'ph': [
                r'pH[:\s]+(\d+\.?\d*)',
                r'pH\s*=\s*(\d+\.?\d*)',
                r'Soil\s+pH[:\s]+(\d+\.?\d*)',
            ],
            'temperature': [
                r'temperature[:\s]+(\d+\.?\d*)',
                r'temp[:\s]+(\d+\.?\d*)',
                r'avg\.?\s+temp[:\s]+(\d+\.?\d*)',
                r'soil\s+temp[:\s]+(\d+\.?\d*)',
                r'air\s+temp[:\s]+(\d+\.?\d*)',
                r'°c[:\s]+(\d+\.?\d*)',
            ],
            'humidity': [
                r'humidity[:\s]+(\d+\.?\d*)',
                r'relative\s+humidity[:\s]+(\d+\.?\d*)',
                r'rh[:\s]+(\d+\.?\d*)',
                r'moisture[:\s]+(\d+\.?\d*)',
                r'%\s+rh[:\s]+(\d+\.?\d*)',
            ],
            'rainfall': [
                r'rainfall[:\s]+(\d+\.?\d*)',
                r'precipitation[:\s]+(\d+\.?\d*)',
                r'rain[:\s]+(\d+\.?\d*)',
                r'annual\s+rainfall[:\s]+(\d+\.?\d*)',
                r'avg\.?\s+rainfall[:\s]+(\d+\.?\d*)',
                r'mm\s+rain[:\s]+(\d+\.?\d*)',
            ],
            'ec': [
                r'EC[:\s]+(\d+\.?\d*)',
                r'Electrical\s+Conductivity[:\s]+(\d+\.?\d*)',
            ],
            'organic_carbon': [
                r'Organic\s+Carbon[:\s]+(\d+\.?\d*)',
                r'OC[:\s]+(\d+\.?\d*)',
            ]
        }
    
    def extract_from_base64(self, file_data, file_type):
        """
        Extract data from base64 encoded file
        
        Args:
            file_data: Base64 encoded file data with prefix
            file_type: MIME type of the file
            
        Returns:
            dict: Extracted soil parameters
        """
        try:
            # Remove base64 prefix
            if ',' in file_data:
                file_data = file_data.split(',', 1)[1]
            
            # Decode base64
            file_bytes = base64.b64decode(file_data)
            
            # Extract based on file type
            if file_type == 'application/pdf':
                return self._extract_from_pdf(file_bytes)
            elif file_type.startswith('image/'):
                return self._extract_from_image(file_bytes)
            else:
                return {'error': f'Unsupported file type: {file_type}'}
                
        except Exception as e:
            return {'error': f'Failed to extract data: {str(e)}'}
    
    def _extract_from_pdf(self, file_bytes):
        """Extract text from PDF and parse soil data"""
        extracted_data = {}
        text = ""
        
        try:
            # Try pdfplumber first (better for tables)
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                    
                    # Try to extract tables
                    tables = page.extract_tables()
                    for table in tables:
                        extracted_data.update(self._parse_table(table))
            
            # If pdfplumber didn't get much, try PyPDF2
            if len(text) < 50:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            # Parse extracted text
            text_data = self._parse_text(text)
            extracted_data.update(text_data)
            
            return self._validate_and_clean(extracted_data)
            
        except Exception as e:
            return {'error': f'PDF extraction failed: {str(e)}', 'raw_text': text[:500]}
    
    def _extract_from_image(self, file_bytes):
        """Extract text from image using OCR"""
        try:
            # Open image
            image = Image.open(io.BytesIO(file_bytes))
            
            # Preprocess image for better OCR
            image = self._preprocess_image(image)
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(image, config='--psm 6')
            
            # Parse extracted text
            extracted_data = self._parse_text(text)
            
            return self._validate_and_clean(extracted_data)
            
        except Exception as e:
            return {'error': f'Image OCR failed: {str(e)}. Make sure Tesseract is installed.'}
    
    def _preprocess_image(self, image):
        """Preprocess image for better OCR accuracy"""
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            img_array = np.array(image)
            
            # Convert to grayscale
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(2.0)
            
            return image
        except:
            return image
    
    def _parse_table(self, table):
        """Parse table data from PDF"""
        data = {}
        
        if not table:
            return data
        
        try:
            for row in table:
                if not row or len(row) < 2:
                    continue
                
                # Clean row data
                row = [str(cell).strip() if cell else '' for cell in row]
                
                # Try to match parameter names
                for key, patterns in self.patterns.items():
                    for pattern in patterns:
                        for cell in row:
                            if re.search(pattern, cell, re.IGNORECASE):
                                # Look for number in this or next cell
                                for value_cell in row:
                                    numbers = re.findall(r'\d+\.?\d*', value_cell)
                                    if numbers:
                                        data[key] = float(numbers[0])
                                        break
        except:
            pass
        
        return data
    
    def _parse_text(self, text):
        """Parse soil parameters from extracted text"""
        data = {}
        
        # Convert to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Try each pattern for each parameter
        for param, patterns in self.patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text_lower, re.IGNORECASE)
                if match:
                    try:
                        value = float(match.group(1))
                        # Validate ranges
                        if param in ['N', 'P', 'K'] and 0 <= value <= 500:
                            data[param] = value
                            break
                        elif param == 'ph' and 0 <= value <= 14:
                            data[param] = value
                            break
                        elif param == 'temperature' and -10 <= value <= 60:
                            data[param] = value
                            break
                        elif param == 'humidity' and 0 <= value <= 100:
                            data[param] = value
                            break
                        elif param == 'rainfall' and 0 <= value <= 5000:
                            data[param] = value
                            break
                        elif param in ['ec', 'organic_carbon'] and 0 <= value <= 100:
                            data[param] = value
                            break
                    except:
                        continue
        
        return data
    
    def _validate_and_clean(self, data):
        """Validate and clean extracted data"""
        cleaned = {}
        
        # Standard ranges for validation
        ranges = {
            'N': (0, 500),
            'P': (0, 500),
            'K': (0, 500),
            'ph': (3.0, 10.0),
            'temperature': (-10, 60),
            'humidity': (0, 100),
            'rainfall': (0, 5000),
            'ec': (0, 20),
            'organic_carbon': (0, 10)
        }
        
        for key, value in data.items():
            if key in ranges:
                min_val, max_val = ranges[key]
                if isinstance(value, (int, float)) and min_val <= value <= max_val:
                    cleaned[key] = round(float(value), 2)
        
        return cleaned
    
    def merge_with_form_data(self, extracted_data, form_data):
        """
        Merge extracted data with form data
        Extracted data takes precedence if available
        
        Args:
            extracted_data: Data extracted from soil report
            form_data: Data from user form
            
        Returns:
            dict: Merged data with confidence scores
        """
        merged = {}
        confidence = {}
        
        # Priority: extracted > form for ALL 7 parameters
        for key in ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']:
            if key in extracted_data and extracted_data[key]:
                merged[key] = extracted_data[key]
                confidence[key] = 'extracted'
            elif key in form_data and form_data[key]:
                merged[key] = form_data[key]
                confidence[key] = 'manual'
            else:
                merged[key] = 0
                confidence[key] = 'default'
        
        return {
            'data': merged,
            'confidence': confidence,
            'extracted_params': list(extracted_data.keys()) if not isinstance(extracted_data, dict) or 'error' not in extracted_data else []
        }


def extract_soil_data(soil_report):
    """
    Main function to extract soil data from uploaded report
    
    Args:
        soil_report: Dict with fileName, fileType, fileSize, fileData
        
    Returns:
        dict: Extracted soil parameters
    """
    extractor = SoilReportExtractor()
    
    try:
        file_data = soil_report.get('fileData', '')
        file_type = soil_report.get('fileType', '')
        
        if not file_data or not file_type:
            return {'error': 'Missing file data or type'}
        
        extracted = extractor.extract_from_base64(file_data, file_type)
        
        return {
            'success': 'error' not in extracted,
            'extracted_data': extracted,
            'file_name': soil_report.get('fileName', 'unknown'),
            'extraction_method': 'OCR' if file_type.startswith('image/') else 'PDF'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
