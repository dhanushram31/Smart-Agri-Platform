import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import CropPredictionForm from './components/CropPredictionForm';
import Weather from './components/Weather';
import AboutUs from './components/AboutUs';
import FarmDetails from './components/FarmDetails';
import PlantingCal from './components/PlantingCale';
import RegisterSeed from './components/RegisterSeed';
import SeedList from './components/SeedList';
import RequestManager from './components/RequestManager';
import FarmList from './components/FarmList';
import AddFarm from './components/AddFarm';
import LabourHub from './components/LabourHub';
import SchemePortalPage from './components/SchemePortalPage';

import './App.css';
import Chatbot from './components/Chatbot';
import Tools from './components/Tools';
import AnimalDetection from './components/AnimalDetection';

function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <Navbar />
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/predict" element={<CropPredictionForm />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/animal-detection" element={<AnimalDetection />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/labour-hub" element={<LabourHub />} />
              <Route path="/scheme-portal" element={<SchemePortalPage />} />
              <Route path="/plantingCal" element={<PlantingCal />} />
              <Route path="/registerSeed" element={<RegisterSeed />} />
              <Route path="/seedList" element={<SeedList />} />
              <Route path="/requestManager" element={<RequestManager />} />

              {/* Farm-related routes */}
              <Route path="/farms" element={<FarmList />} />
              <Route path="/farms/add" element={<AddFarm />} />
              <Route path="/farmDetails/:id" element={<FarmDetails />} />
              <Route path="/farmDetails" element={<FarmDetails />} />
            </Routes>
          </div>
          <Chatbot />
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;
