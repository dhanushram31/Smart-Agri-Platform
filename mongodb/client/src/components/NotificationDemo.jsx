import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import NotificationContainer from './NotificationContainer';

const NotificationDemo = () => {
  const { notifications, showSuccess, showError, showWarning, showInfo, hideNotification } = useNotification();

  const handleShowSuccess = () => {
    showSuccess(
      'Your farm "Tomatoes" in "California Valley" has been successfully added to your portfolio!',
      '🎉 Farm Added Successfully!'
    );
  };

  const handleShowError = () => {
    showError(
      'Unable to connect to the server. Please check your internet connection.',
      'Connection Error'
    );
  };

  const handleShowWarning = () => {
    showWarning(
      'Weather conditions may affect your planting schedule.',
      'Weather Alert'
    );
  };

  const handleShowInfo = () => {
    showInfo(
      'Your crop prediction analysis is now ready for review.',
      'Analysis Complete'
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Notification System Demo</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button
          onClick={handleShowSuccess}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Show Success
        </button>
        
        <button
          onClick={handleShowError}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Show Error
        </button>
        
        <button
          onClick={handleShowWarning}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Show Warning
        </button>
        
        <button
          onClick={handleShowInfo}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Show Info
        </button>
      </div>
      
      <NotificationContainer 
        notifications={notifications}
        onHideNotification={hideNotification}
      />
    </div>
  );
};

export default NotificationDemo;
