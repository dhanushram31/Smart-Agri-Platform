import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './RegisterSeed.css';

const RegisterSeed = () => {
  const { user, token } = useAuth();
  const userId = user ? user._id : null;
  const userEmail = user ? user.email : 'default@example.com';
  const [seedName, setSeedName] = useState('');
  const [seedType, setSeedType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Validate user is logged in
    if (!userId || !token) {
      setErrorMessage('Please log in to register a seed.');
      setLoading(false);
      return;
    }

    console.log('User ID:', userId);
    console.log('User email:', userEmail);
    console.log('Token available:', !!token);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('seedName', seedName);
    formData.append('seedType', seedType);
    formData.append('description', description);
    // Remove createdBy and createdByEmail - backend will get this from JWT token

    try {
      const response = await fetch('http://localhost:5002/api/seeds/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      console.log('Raw Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        setErrorMessage('Failed to register seed. Invalid server response.');
        setLoading(false);
        return;
      }

      console.log('Registration Response:', data);

      if (response.ok) {
        setSuccessMessage('Seed registered successfully!');
        // Reset form fields
        setSeedName('');
        setSeedType('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('seed-image');
        if (fileInput) fileInput.value = '';
      } else {
        setErrorMessage(data.error || 'Failed to register seed.');
      }
    } catch (error) {
      console.error('Error registering seed:', error);
      setErrorMessage('An error occurred while registering the seed.');
    } finally {
      setLoading(false);
    }
  };

  const getSeedTypeIcon = (type) => {
    const typeIcons = {
      'vegetable': '🥬',
      'fruit': '🍎',
      'grain': '🌾',
      'herb': '🌿',
      'flower': '🌸',
      'tree': '🌳',
      'legume': '🫘',
      'cereal': '🌽',
      'spice': '🌶️',
      'root': '🥕'
    };
    return typeIcons[type.toLowerCase()] || '🌱';
  };

  return (
    <div className="register-seed-container">
      <div className="register-seed-wrapper">
        <div className="register-seed-header">
          <h1 className="seed-title">
            <span className="title-icon">🌱</span>
            Register New Seed
          </h1>
          <p className="seed-subtitle">
            Share your seeds with the agricultural community and help farmers access quality seeds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-seed-form">
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">📝</span>
              Basic Information
            </h3>
            <div className="input-grid basic-info-grid">
              <div className="form-group">
                <label htmlFor="seedName" className="form-label">
                  <span className="label-icon">🌾</span>
                  Seed Name
                </label>
                <input
                  type="text"
                  id="seedName"
                  className="form-input"
                  placeholder="e.g., Organic Tomato Seeds"
                  value={seedName}
                  onChange={(e) => setSeedName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seedType" className="form-label">
                  <span className="label-icon">🏷️</span>
                  Seed Type
                </label>
                <select
                  id="seedType"
                  className="form-select"
                  value={seedType}
                  onChange={(e) => setSeedType(e.target.value)}
                  required
                >
                  <option value="">Select seed type</option>
                  <option value="vegetable">🥬 Vegetable</option>
                  <option value="fruit">🍎 Fruit</option>
                  <option value="grain">🌾 Grain</option>
                  <option value="herb">🌿 Herb</option>
                  <option value="flower">🌸 Flower</option>
                  <option value="tree">🌳 Tree</option>
                  <option value="legume">🫘 Legume</option>
                  <option value="cereal">🌽 Cereal</option>
                  <option value="spice">🌶️ Spice</option>
                  <option value="root">🥕 Root Vegetable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">📄</span>
              Description
            </h3>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <span className="label-icon">📝</span>
                Seed Description
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Describe your seeds... Include variety, growing conditions, harvest time, special features, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
              <span className="input-help">Provide detailed information to help farmers understand your seeds</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">📸</span>
              Seed Image
            </h3>
            <div className="form-group">
              <label htmlFor="seed-image" className="form-label">
                <span className="label-icon">🖼️</span>
                Upload Seed Image
              </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="seed-image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <label htmlFor="seed-image" className="file-input-label">
                  <span className="upload-icon">📁</span>
                  {image ? 'Change Image' : 'Choose Image'}
                </label>
                <span className="input-help">Upload a clear image of your seeds (PNG, JPG, JPEG)</span>
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Seed preview" className="preview-image" />
                  <div className="preview-info">
                    <p className="preview-name">{image?.name}</p>
                    <p className="preview-size">
                      {(image?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Registering...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Register Seed
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {successMessage}
          </div>
        )}

        {successMessage && seedName && seedType && (
          <div className="success-details">
            <div className="success-card">
              <div className="success-header">
                <h3 className="success-title">
                  <span className="success-title-icon">🎉</span>
                  Registration Complete!
                </h3>
              </div>
              <div className="success-content">
                <div className="registered-seed-info">
                  <div className="seed-icon-large">
                    {getSeedTypeIcon(seedType)}
                  </div>
                  <div className="seed-details">
                    <h4 className="registered-seed-name">{seedName}</h4>
                    <p className="registered-seed-type">
                      Type: {seedType.charAt(0).toUpperCase() + seedType.slice(1)}
                    </p>
                    <p className="registered-by">
                      Registered by: {userEmail}
                    </p>
                  </div>
                </div>
                <div className="next-steps">
                  <h4 className="next-steps-title">What's Next?</h4>
                  <ul className="next-steps-list">
                    <li>Your seed will be reviewed by our team</li>
                    <li>Once approved, it will be visible to farmers</li>
                    <li>You'll receive notifications for seed requests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterSeed;
