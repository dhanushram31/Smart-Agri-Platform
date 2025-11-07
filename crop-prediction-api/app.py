from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
from soil_extractor import extract_soil_data, SoilReportExtractor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load the saved models and scalers
try:
    with open(os.path.join(script_dir, 'model.pkl'), 'rb') as model_file:
        crop_model = pickle.load(model_file)
    with open(os.path.join(script_dir, 'scaler.pkl'), 'rb') as scaler_file:
        scaler = pickle.load(scaler_file)
    with open(os.path.join(script_dir, 'price_model.pkl'), 'rb') as price_model_file:
        price_model = pickle.load(price_model_file)
    with open(os.path.join(script_dir, 'scaler_price.pkl'), 'rb') as scaler_price_file:
        scaler_price = pickle.load(scaler_price_file)
    with open(os.path.join(script_dir, 'label_encoder.pkl'), 'rb') as label_encoder_file:
        label_encoder = pickle.load(label_encoder_file)
except Exception as e:
    raise RuntimeError(f"Error loading models or scalers: {e}")

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Crop prediction API is running'})

# NEW: Fast extraction endpoint - only extracts data, no prediction
@app.route('/api/crops/extract', methods=['POST'])
def extract_only():
    """
    Fast endpoint for extracting soil data from reports.
    Does NOT perform prediction - only extraction.
    """
    try:
        data = request.json
        
        # Check if soil report was provided
        if 'soilReport' not in data:
            return jsonify({
                'success': False,
                'error': 'No soil report provided'
            }), 400
        
        soil_report = data['soilReport']
        file_size = soil_report.get('fileSize', 'unknown')
        print(f"[EXTRACT] Processing: {soil_report.get('fileName', 'unknown')} ({file_size} bytes)")
        
        # Extract data from soil report
        extraction_result = extract_soil_data(soil_report)
        print(f"[EXTRACT] Result: {extraction_result}")
        
        if extraction_result.get('success'):
            extracted_data = extraction_result.get('extracted_data', {})
            extracted_params = []
            missing_params = []
            extracted_values = {}
            
            # All 7 parameters we're looking for
            all_params = {
                'N': 'Nitrogen (N)',
                'P': 'Phosphorus (P)',
                'K': 'Potassium (K)',
                'ph': 'pH',
                'temperature': 'Temperature',
                'humidity': 'Humidity',
                'rainfall': 'Rainfall'
            }
            
            # Build response with extracted values
            for param_key, param_name in all_params.items():
                if param_key in extracted_data:
                    extracted_values[param_key] = extracted_data[param_key]
                    extracted_params.append(param_name)
                else:
                    missing_params.append(param_name)
            
            # Build user-friendly message
            if len(extracted_params) == 7:
                message = f"✅ Successfully extracted all 7 parameters!"
            elif len(extracted_params) > 0:
                message = f"✅ Extracted {len(extracted_params)} parameter(s). ⚠️ Missing: {', '.join(missing_params)}"
            else:
                message = "⚠️ Could not extract any parameters from the PDF"
            
            return jsonify({
                'success': True,
                'extracted_values': extracted_values,
                'extracted_parameters': extracted_params,
                'missing_parameters': missing_params,
                'extraction_method': extraction_result.get('extraction_method', 'Unknown'),
                'message': message
            })
        else:
            return jsonify({
                'success': False,
                'error': extraction_result.get('error', 'Could not extract data'),
                'message': 'Failed to extract data from soil report'
            }), 400
            
    except Exception as e:
        print(f"[EXTRACT] Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/crops/predict', methods=['POST'])
def predict():
    try:
        # Get the data from the request
        data = request.json
        print(f"Incoming data: {data}")  # Log incoming data

        # Initialize extraction result
        extraction_result = None
        extracted_params = []
        
        # Check if soil report was uploaded and extract data
        has_soil_report = 'soilReport' in data
        if has_soil_report:
            soil_report = data['soilReport']
            print(f"Soil report uploaded: {soil_report['fileName']} ({soil_report['fileSize']} bytes)")
            
            # Extract data from soil report
            extraction_result = extract_soil_data(soil_report)
            print(f"Extraction result: {extraction_result}")
            
            if extraction_result.get('success'):
                extracted_data = extraction_result.get('extracted_data', {})
                
                # Merge extracted data with form data (extracted takes priority)
                extractor = SoilReportExtractor()
                merged = extractor.merge_with_form_data(extracted_data, data)
                
                # Update data with all 7 extracted values
                if 'N' in extracted_data:
                    data['N'] = extracted_data['N']
                    extracted_params.append('Nitrogen (N)')
                if 'P' in extracted_data:
                    data['P'] = extracted_data['P']
                    extracted_params.append('Phosphorus (P)')
                if 'K' in extracted_data:
                    data['K'] = extracted_data['K']
                    extracted_params.append('Potassium (K)')
                if 'ph' in extracted_data:
                    data['ph'] = extracted_data['ph']
                    extracted_params.append('pH')
                if 'temperature' in extracted_data:
                    data['temperature'] = extracted_data['temperature']
                    extracted_params.append('Temperature')
                if 'humidity' in extracted_data:
                    data['humidity'] = extracted_data['humidity']
                    extracted_params.append('Humidity')
                if 'rainfall' in extracted_data:
                    data['rainfall'] = extracted_data['rainfall']
                    extracted_params.append('Rainfall')
                
                print(f"Updated data with extracted values: N={data.get('N')}, P={data.get('P')}, K={data.get('K')}, pH={data.get('ph')}, Temp={data.get('temperature')}, Humidity={data.get('humidity')}, Rainfall={data.get('rainfall')}")

        features = [
            data['N'],
            data['P'],
            data['K'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]
        
        # Prepare input data for crop prediction
        input_data = [features]
        input_data_scaled = scaler.transform(input_data)
        
        # Make crop prediction
        predicted_crop_encoded = crop_model.predict(input_data_scaled)[0]
        predicted_crop = label_encoder.inverse_transform([predicted_crop_encoded])[0]

        # Prepare input data for price prediction
        year = 2024
        crop_encoded = label_encoder.transform([predicted_crop])[0]
        
        price_features = [[crop_encoded, year]]  # Adjust this as needed
        price_features_scaled = scaler_price.transform(price_features)
        
        # Make price prediction
        predicted_price = price_model.predict(price_features_scaled)[0]

        print(f"Crop prediction: {predicted_crop}, Price prediction: {predicted_price}")
        
        # Generate enhanced recommendations with extraction info
        recommendations = generate_recommendations(data, predicted_crop, has_soil_report)
        
        # Add extraction information to recommendations
        if has_soil_report and extraction_result:
            if extraction_result.get('success'):
                recommendations['extraction_info'] = {
                    'success': True,
                    'extracted_parameters': extracted_params,
                    'extraction_method': extraction_result.get('extraction_method', 'Unknown'),
                    'message': f"Successfully extracted {len(extracted_params)} parameter(s) from soil report"
                }
            else:
                recommendations['extraction_info'] = {
                    'success': False,
                    'message': 'Could not extract data from soil report. Using manual inputs.',
                    'error': extraction_result.get('error', 'Unknown error')
                }
        
        # Prepare extracted values for auto-fill (if extraction was successful)
        extracted_values = {}
        if has_soil_report and extraction_result and extraction_result.get('success'):
            extracted_data = extraction_result.get('extracted_data', {})
            # Include all 7 parameters
            if 'N' in extracted_data:
                extracted_values['N'] = extracted_data['N']
            if 'P' in extracted_data:
                extracted_values['P'] = extracted_data['P']
            if 'K' in extracted_data:
                extracted_values['K'] = extracted_data['K']
            if 'ph' in extracted_data:
                extracted_values['ph'] = extracted_data['ph']
            if 'temperature' in extracted_data:
                extracted_values['temperature'] = extracted_data['temperature']
            if 'humidity' in extracted_data:
                extracted_values['humidity'] = extracted_data['humidity']
            if 'rainfall' in extracted_data:
                extracted_values['rainfall'] = extracted_data['rainfall']
        
        # Return the result with recommendations and extracted values
        return jsonify({
            'predicted_crop': predicted_crop,
            'predicted_price': predicted_price,
            'recommendations': recommendations,
            'soil_report_processed': has_soil_report,
            'extracted_parameters': extracted_params if has_soil_report else [],
            'extracted_values': extracted_values  # NEW: Send extracted values for auto-fill
        })
    except Exception as e:
        print(f"Error occurred: {e}")  # Log error
        return jsonify({'error': str(e)}), 400


def generate_recommendations(data, predicted_crop, has_soil_report):
    """Generate farming recommendations based on soil data"""
    recommendations = {
        'crops': [],
        'soilAdjustments': [],
        'nutrients': [],
        'generalAdvice': []
    }
    
    # Get nutrient values
    N = float(data.get('N', 0))
    P = float(data.get('P', 0))
    K = float(data.get('K', 0))
    ph = float(data.get('ph', 7.0))
    rainfall = float(data.get('rainfall', 0))
    temperature = float(data.get('temperature', 0))
    
    # Alternative crop suggestions based on predicted crop
    crop_alternatives = {
        'rice': [
            {'name': 'Wheat', 'yield': 'High', 'suitability': 'High'},
            {'name': 'Maize', 'yield': 'Medium', 'suitability': 'Medium'}
        ],
        'wheat': [
            {'name': 'Barley', 'yield': 'High', 'suitability': 'High'},
            {'name': 'Oats', 'yield': 'Medium', 'suitability': 'Medium'}
        ],
        'maize': [
            {'name': 'Sorghum', 'yield': 'High', 'suitability': 'High'},
            {'name': 'Millet', 'yield': 'Medium', 'suitability': 'High'}
        ]
    }
    
    # Add alternative crops
    recommendations['crops'] = crop_alternatives.get(predicted_crop.lower(), [
        {'name': 'Mixed Farming', 'yield': 'Variable', 'suitability': 'Medium'}
    ])
    
    # pH recommendations
    if ph < 6.0:
        recommendations['soilAdjustments'].append({
            'type': 'pH',
            'current': str(round(ph, 1)),
            'recommended': '6.0-7.5',
            'action': 'Add agricultural lime (2-3 tons/acre) to increase pH'
        })
    elif ph > 7.5:
        recommendations['soilAdjustments'].append({
            'type': 'pH',
            'current': str(round(ph, 1)),
            'recommended': '6.0-7.5',
            'action': 'Add elemental sulfur (100-200 kg/acre) to decrease pH'
        })
    
    # NPK recommendations
    if N < 20:
        recommendations['nutrients'].append({
            'nutrient': 'Nitrogen (N)',
            'status': 'Low',
            'recommendation': 'Apply urea or ammonium nitrate (20-30 kg/acre)'
        })
    if P < 15:
        recommendations['nutrients'].append({
            'nutrient': 'Phosphorus (P)',
            'status': 'Low',
            'recommendation': 'Apply single superphosphate (15-20 kg/acre)'
        })
    if K < 20:
        recommendations['nutrients'].append({
            'nutrient': 'Potassium (K)',
            'status': 'Low',
            'recommendation': 'Apply muriate of potash (20-25 kg/acre)'
        })
    
    # Environmental advice
    if rainfall < 50:
        recommendations['generalAdvice'].append('Install drip irrigation for water efficiency')
    elif rainfall > 200:
        recommendations['generalAdvice'].append('Ensure proper drainage to prevent waterlogging')
    
    if temperature > 35:
        recommendations['generalAdvice'].append('Consider shade nets for sensitive crops')
    elif temperature < 15:
        recommendations['generalAdvice'].append('Use cold-tolerant crop varieties')
    
    if has_soil_report:
        recommendations['generalAdvice'].append('Soil report analyzed for enhanced recommendations')
    
    recommendations['generalAdvice'].append(f'{predicted_crop.capitalize()} is well-suited for your soil conditions')
    
    return recommendations

# Weather API endpoint
@app.route('/api/weather/current', methods=['GET'])
def get_current_weather():
    """
    Fetch current weather data from OpenWeatherMap API
    """
    try:
        import requests
        
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        # OpenWeatherMap API key (should be in environment variable)
        api_key = os.environ.get('OPENWEATHER_API_KEY', '').strip()
        
        # Validate API key is configured
        if not api_key or api_key == 'your_api_key_here':
            print("❌ OPENWEATHER_API_KEY not configured!")
            return jsonify({
                'success': False,
                'error': 'Weather service not configured. Please set OPENWEATHER_API_KEY environment variable.',
                'setup_instructions': 'Get your free API key from https://openweathermap.org/api and set it in your environment.'
            }), 500
        
        # Make request to OpenWeatherMap
        url = f'http://api.openweathermap.org/data/2.5/weather'
        params = {
            'lat': lat,
            'lon': lon,
            'appid': api_key,
            'units': 'metric'  # Get temperature in Celsius
        }
        
        print(f"🌦️  Fetching weather for coordinates: ({lat}, {lon})")
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            weather_data = response.json()
            
            # Format response
            formatted_data = {
                'success': True,
                'location': weather_data.get('name', 'Unknown'),
                'temperature': round(weather_data['main']['temp']),
                'humidity': round(weather_data['main']['humidity']),
                'rainfall': round(weather_data.get('rain', {}).get('1h', 0)),
                'main': weather_data['main'],
                'rain': weather_data.get('rain', {}),
                'name': weather_data.get('name', 'Unknown')
            }
            
            print(f"✅ Weather fetched successfully for {formatted_data['location']}")
            return jsonify(formatted_data)
        elif response.status_code == 401:
            print(f"❌ Invalid API key")
            return jsonify({
                'success': False,
                'error': 'Invalid OpenWeatherMap API key. Please check your OPENWEATHER_API_KEY.'
            }), 401
        elif response.status_code == 404:
            print(f"❌ Location not found")
            return jsonify({
                'success': False,
                'error': 'Location not found. Please try again.'
            }), 404
        else:
            error_msg = response.json().get('message', f'HTTP {response.status_code}')
            print(f"❌ Weather API error: {error_msg}")
            return jsonify({
                'success': False,
                'error': f'Weather API error: {error_msg}'
            }), response.status_code
            
    except requests.exceptions.Timeout:
        print(f"❌ Weather API timeout")
        return jsonify({
            'success': False,
            'error': 'Weather service timeout. Please try again.'
        }), 504
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to weather API")
        return jsonify({
            'success': False,
            'error': 'Cannot connect to weather service. Please check your internet connection.'
        }), 503
    except Exception as e:
        print(f"❌ Weather API error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal error: {str(e)}'
        }), 500

# Fertilizer Recommendations API endpoint
@app.route('/api/fertilizers/recommend', methods=['POST'])
def recommend_fertilizers():
    """
    Generate detailed fertilizer recommendations based on soil data
    """
    try:
        data = request.json
        
        N = float(data.get('N', 0))
        P = float(data.get('P', 0))
        K = float(data.get('K', 0))
        ph = float(data.get('ph', 7.0))
        
        recommendations = {
            'fertilizers': [],
            'total_estimated_cost': None,
            'application_schedule': []
        }
        
        # Nitrogen recommendations
        if N < 20:
            recommendations['fertilizers'].append({
                'nutrient': 'Nitrogen (N)',
                'status': 'Deficient',
                'fertilizer': 'Urea (46-0-0)',
                'quantity': '50-75 kg/acre',
                'application': 'Split doses - 50% at planting, 25% at tillering stage, 25% at flowering stage',
                'cost_estimate': '₹800-1,200'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Planting (50%)',
                'fertilizer': 'Urea',
                'quantity': '25-37.5 kg/acre'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Tillering (25%)',
                'fertilizer': 'Urea',
                'quantity': '12.5-18.75 kg/acre'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Flowering (25%)',
                'fertilizer': 'Urea',
                'quantity': '12.5-18.75 kg/acre'
            })
        elif N < 40:
            recommendations['fertilizers'].append({
                'nutrient': 'Nitrogen (N)',
                'status': 'Moderate',
                'fertilizer': 'Ammonium Sulfate (21-0-0)',
                'quantity': '25-40 kg/acre',
                'application': 'Split doses - 60% at planting, 40% at mid-growth stage',
                'cost_estimate': '₹500-800'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Planting (60%)',
                'fertilizer': 'Ammonium Sulfate',
                'quantity': '15-24 kg/acre'
            })
            recommendations['application_schedule'].append({
                'timing': 'Mid-Growth (40%)',
                'fertilizer': 'Ammonium Sulfate',
                'quantity': '10-16 kg/acre'
            })
        else:
            recommendations['fertilizers'].append({
                'nutrient': 'Nitrogen (N)',
                'status': 'Optimal',
                'fertilizer': 'Light Application Only',
                'quantity': '10-15 kg/acre',
                'application': 'Single application at planting if needed',
                'cost_estimate': '₹200-300'
            })
        
        # Phosphorus recommendations
        if P < 15:
            recommendations['fertilizers'].append({
                'nutrient': 'Phosphorus (P)',
                'status': 'Deficient',
                'fertilizer': 'Single Super Phosphate (16% P2O5)',
                'quantity': '40-60 kg/acre',
                'application': 'Full dose at sowing/planting time',
                'cost_estimate': '₹600-900'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Sowing',
                'fertilizer': 'Single Super Phosphate',
                'quantity': '40-60 kg/acre'
            })
        elif P < 30:
            recommendations['fertilizers'].append({
                'nutrient': 'Phosphorus (P)',
                'status': 'Moderate',
                'fertilizer': 'DAP (18-46-0)',
                'quantity': '20-35 kg/acre',
                'application': 'Full dose at planting',
                'cost_estimate': '₹400-700'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Planting',
                'fertilizer': 'DAP',
                'quantity': '20-35 kg/acre'
            })
        else:
            recommendations['fertilizers'].append({
                'nutrient': 'Phosphorus (P)',
                'status': 'Optimal',
                'fertilizer': 'Maintenance Application',
                'quantity': '10-15 kg/acre',
                'application': 'Light application at planting if needed',
                'cost_estimate': '₹200-300'
            })
        
        # Potassium recommendations
        if K < 20:
            recommendations['fertilizers'].append({
                'nutrient': 'Potassium (K)',
                'status': 'Deficient',
                'fertilizer': 'Muriate of Potash (60% K2O)',
                'quantity': '30-50 kg/acre',
                'application': 'Split doses - 50% at planting, 50% at flowering stage',
                'cost_estimate': '₹750-1,250'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Planting (50%)',
                'fertilizer': 'Muriate of Potash',
                'quantity': '15-25 kg/acre'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Flowering (50%)',
                'fertilizer': 'Muriate of Potash',
                'quantity': '15-25 kg/acre'
            })
        elif K < 40:
            recommendations['fertilizers'].append({
                'nutrient': 'Potassium (K)',
                'status': 'Moderate',
                'fertilizer': 'Potassium Sulfate (50% K2O)',
                'quantity': '15-25 kg/acre',
                'application': 'Single application at planting',
                'cost_estimate': '₹400-650'
            })
            recommendations['application_schedule'].append({
                'timing': 'At Planting',
                'fertilizer': 'Potassium Sulfate',
                'quantity': '15-25 kg/acre'
            })
        else:
            recommendations['fertilizers'].append({
                'nutrient': 'Potassium (K)',
                'status': 'Optimal',
                'fertilizer': 'Light Maintenance',
                'quantity': '10-15 kg/acre',
                'application': 'Light application if crop shows deficiency',
                'cost_estimate': '₹250-400'
            })
        
        # pH correction
        if ph < 6.0:
            recommendations['fertilizers'].append({
                'nutrient': 'pH Corrector',
                'status': 'Acidic',
                'fertilizer': 'Agricultural Lime (CaCO3)',
                'quantity': '500-1,000 kg/acre',
                'application': 'Broadcast and incorporate 2-3 months before planting',
                'cost_estimate': '₹1,500-3,000'
            })
        elif ph > 7.5:
            recommendations['fertilizers'].append({
                'nutrient': 'pH Corrector',
                'status': 'Alkaline',
                'fertilizer': 'Elemental Sulfur',
                'quantity': '50-100 kg/acre',
                'application': 'Broadcast and incorporate 3-4 months before planting',
                'cost_estimate': '₹1,000-2,000'
            })
        
        # Calculate total cost (minimum values)
        total_cost = 0
        for fert in recommendations['fertilizers']:
            cost_str = fert['cost_estimate'].replace('₹', '').replace(',', '')
            min_cost = int(cost_str.split('-')[0])
            total_cost += min_cost
        
        recommendations['total_estimated_cost'] = f'₹{total_cost:,} - ₹{int(total_cost * 1.5):,}'
        
        return jsonify(recommendations)
        
    except Exception as e:
        print(f"Fertilizer recommendation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
