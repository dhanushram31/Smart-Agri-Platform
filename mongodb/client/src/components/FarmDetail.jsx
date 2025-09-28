// src/components/FarmDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FarmDetail = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/farms/${id}`);
        setFarm(response.data);
      } catch (err) {
        console.error('Error fetching farm:', err);
        setError('Failed to load farm details');
      }
    };

    fetchFarm();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!farm) return <div>Loading farm details...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Farm Details</h2>
      <p><strong>Location:</strong> {farm.location}</p>
      <p><strong>Crop Type:</strong> {farm.crop_type}</p>
      <p><strong>Area:</strong> {farm.area} acres</p>
      <p><strong>Farmer:</strong> {farm.farmer_name}</p>
      {/* Add more fields if available */}
    </div>
  );
};

export default FarmDetail;
