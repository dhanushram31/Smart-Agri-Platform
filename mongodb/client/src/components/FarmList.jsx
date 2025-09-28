import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FarmList.css';

const FarmList = () => {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/farms');
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);

  return (
    <div className="farm-list-container">
  <h2 className="farm-list-title">Farms</h2>
  {farms.length === 0 ? (
    <p className="no-farms-message">No farms found.</p>
  ) : (
    <ul className="farms-list">
      {farms.map((farm) => (
        <li key={farm._id} className="farm-item">
          <div className="farm-info">
            <span className="farm-name">{farm.name}</span>
            <span className="farm-location">- {farm.location}</span>
          </div>
          <Link to={`/farmDetails/${farm._id}`} className="farm-details-link">
            View Details
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>
  );
};

export default FarmList;
