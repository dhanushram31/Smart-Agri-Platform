import React from 'react';
import Notification from './Notification';

const NotificationContainer = ({ notifications, onHideNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            zIndex: 10001 + index,
            position: 'relative'
          }}
        >
          <Notification
            message={notification.message}
            type={notification.type}
            title={notification.title}
            isVisible={notification.isVisible}
            duration={notification.duration}
            onClose={() => onHideNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
