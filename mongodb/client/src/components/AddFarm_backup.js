import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';
import NotificationContainer from './NotificationContainer';
import './AddFarm.css';

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
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Initialize enhancements on mount
  useEffect(() => {
    initFormEnhancements();
    
    return () => {
      // Cleanup event listeners
      const inputs = document.querySelectorAll('.form-input, .form-select');
      inputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
        input.removeEventListener('blur', handleInputBlur);
      });
    };
  }, []);

  // Form enhancement functions
  const initFormEnhancements = () => {
    // Add input animations
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
    });

    // Add ripple effect to button
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
      submitBtn.addEventListener('click', createRipple);
    }
  };

  const handleInputFocus = (e) => {
    const formGroup = e.target.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('focused');
    }
  };

  const handleInputBlur = (e) => {
    const formGroup = e.target.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('focused');
    }
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: rippleEffect 0.6s ease-out;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };