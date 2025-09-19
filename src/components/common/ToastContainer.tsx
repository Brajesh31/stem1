import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeNotification, addNotification } from '../../store/slices/uiSlice';
import Toast, { ToastProps } from './Toast';

const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  useEffect(() => {
    // Listen for app notifications from socket service
    const handleAppNotification = (event: CustomEvent) => {
      const notification = event.detail;
      dispatch(addNotification({
        type: 'info',
        title: notification.title,
        message: notification.message,
      }));
    };

    window.addEventListener('app-notification', handleAppNotification as EventListener);
    return () => {
      window.removeEventListener('app-notification', handleAppNotification as EventListener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={(id) => dispatch(removeNotification(id))}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
