import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success', title = null, duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      title,
      duration,
      isVisible: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration + 500); // Extra time for exit animation
    }

    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isVisible: false }
          : notification
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, title = 'Success!', duration = 4000) => {
    return showNotification(message, 'success', title, duration);
  }, [showNotification]);

  const showError = useCallback((message, title = 'Error!', duration = 5000) => {
    return showNotification(message, 'error', title, duration);
  }, [showNotification]);

  const showWarning = useCallback((message, title = 'Warning!', duration = 4500) => {
    return showNotification(message, 'warning', title, duration);
  }, [showNotification]);

  const showInfo = useCallback((message, title = 'Info', duration = 4000) => {
    return showNotification(message, 'info', title, duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;
