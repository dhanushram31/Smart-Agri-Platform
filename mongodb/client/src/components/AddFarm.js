import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';
import NotificationContainer from './NotificationContainer';

function AddFarm() {
  const { user } = useAuth();
  const { notifications, showSuccess, showError, hideNotification } = useNotification();
  const [form, setForm] = useState({
    location: '',
    crop_type: '',
    planting_schedule: '',
    soil_type: '',
    irrigation_system: '',
    size: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user is logged in
    if (!user || !user._id) {
      showError('Please log in to add a farm.', 'Authentication Required');
      return;
    }

    setLoading(true);
    
    try {
      const payload = { 
        ...form, 
        user_id: user._id,
        size: parseFloat(form.size) || 0 // Ensure size is a number
      };
      console.log('Sending farm data:', payload);
      const res = await axios.post('http://localhost:5002/api/farms', payload);
      console.log('Farm created successfully:', res.data);
      
      // Show success notification
      showSuccess(
        `Your farm "${form.crop_type}" in "${form.location}" has been successfully added to your portfolio!`,
        '🎉 Farm Added Successfully!'
      );
      
      // Reset form
      setForm({ 
        location: '', 
        crop_type: '', 
        planting_schedule: '', 
        soil_type: '', 
        irrigation_system: '', 
        size: '' 
      });
    } catch (err) {
      console.error('Error adding farm:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'Failed to add farm. Please try again.';
      showError(errorMessage, 'Failed to Add Farm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2>Add New Farm</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
          <input name="crop_type" value={form.crop_type} onChange={handleChange} placeholder="Crop Type" required />
          <input name="planting_schedule" type="date" value={form.planting_schedule} onChange={handleChange} placeholder="Planting Schedule" required />
          <input name="soil_type" value={form.soil_type} onChange={handleChange} placeholder="Soil Type" required />
          <input name="irrigation_system" value={form.irrigation_system} onChange={handleChange} placeholder="Irrigation System" required />
          <input name="size" type="number" step="0.1" value={form.size} onChange={handleChange} placeholder="Size (acres)" required />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Adding Farm...' : 'Add Farm'}
          </button>
        </form>
      </div>
      <NotificationContainer 
        notifications={notifications}
        onHideNotification={hideNotification}
      />
    </>
  );
}

export default AddFarm;