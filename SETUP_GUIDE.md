# Climate Smart Agriculture Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- API Keys for external services

### 1. Installation

```bash
# From the mongodb directory
chmod +x start.sh
./start.sh
```

OR manually:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Start both servers
npm run dev
```

### 2. Environment Configuration

Create a `.env` file in the `mongodb` directory:

```env
# MongoDB Configuration
MONGODB_LINK=mongodb://localhost:27017/climate-smart-agriculture

# Server Configuration
PORT=5000

# API Keys (Get these from respective services)
OPENCAGE_API_KEY=your_opencage_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here
HF_API_KEY=your_huggingface_api_key_here

# Node Environment
NODE_ENV=development
```

### 3. Get API Keys

**🎯 Good News**: The application now works with **mock data** when API keys are not configured, so you can test it immediately!

1. **OpenWeatherMap API**: 
   - Sign up at https://openweathermap.org/api
   - Get your free API key
   - Add it to `WEATHER_API_KEY` in `.env`
   - **Without API key**: Uses mock weather data for development

2. **OpenCage Geocoding API**:
   - Sign up at https://opencagedata.com/
   - Get your free API key
   - Add it to `OPENCAGE_API_KEY` in `.env`
   - **Without API key**: Uses mock coordinates for common zip codes

3. **Hugging Face API** (for chatbot):
   - Sign up at https://huggingface.co/
   - Get your API key from settings
   - Add it to `HF_API_KEY` in `.env`
   - **Without API key**: Uses intelligent mock responses for farming questions

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://mongodb.com/atlas
- Create cluster and get connection string
- Replace `MONGODB_LINK` in `.env` with your connection string

## 🔧 Server Configuration

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3001
- **Database**: MongoDB (local or Atlas)

## ✅ Fixed Issues

### Port Configuration
- ✅ Backend now runs on port 5000 (consistent with frontend API calls)
- ✅ Frontend runs on port 3001
- ✅ All API endpoints updated to use correct ports

### Authentication System
- ✅ User registration and login working
- ✅ Password hashing with bcrypt
- ✅ JWT-less session management using localStorage
- ✅ User profile management
- ✅ Password change functionality
- ✅ Preferences update

### API Endpoints
- ✅ Weather API integration
- ✅ Crop prediction
- ✅ Farm management
- ✅ Seed registration
- ✅ User management
- ✅ File upload for seed images

### Features Available
- 🌱 User Registration/Login
- 👤 User Profile Management  
- 🚜 Farm Management
- 🌾 Crop Prediction
- 🌤️ Weather Integration
- 🌱 Seed Registration & Marketplace
- 💬 AI Chatbot
- 📊 Request Management

## 📂 Project Structure

```
mongodb/
├── server/              # Backend Express server
│   ├── api/            # External API integrations
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── server.js       # Main server file
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # Context providers
│   │   ├── services/   # API services
│   │   └── App.js      # Main App component
│   └── package.json
├── uploads/            # File uploads storage
├── .env               # Environment variables
└── package.json       # Backend package config
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for Atlas

3. **API Keys Not Working**
   - Verify keys are correctly added to `.env`
   - Check key permissions and quotas
   - Restart server after updating `.env`

4. **File Upload Issues**
   - Ensure `uploads` directory exists
   - Check file permissions
   - Verify multer configuration

## 📝 Usage

1. **Register a new account** at http://localhost:3001/register
2. **Login** with your credentials
3. **Add farms** and manage your agricultural data
4. **Register seeds** for the marketplace
5. **Check weather** for your location
6. **Use the chatbot** for farming advice
7. **Predict crops** based on soil conditions

## 🔐 Security Notes

- Passwords are hashed using bcrypt
- CORS configured for frontend domain
- Input validation on all forms
- File upload restrictions in place

## 🚧 Development

To contribute or modify:

```bash
# Backend development (with auto-reload)
npm run server

# Frontend development
npm run client

# Run both simultaneously
npm run dev
```

---

*If you encounter any issues, please check the console logs in both browser and terminal for detailed error messages.*
