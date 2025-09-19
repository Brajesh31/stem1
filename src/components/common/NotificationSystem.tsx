import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  actions?: Array<{ label: string; action: () => void }>;
  persistent?: boolean;
  duration?: number;
}

interface NotificationSystemProps {
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  maxNotifications = 5,
  position = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event: CustomEvent) => {
      addNotification(event.detail);
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        id: 'connection-restored',
        type: 'success',
        title: 'Connection Restored',
        message: 'You\'re back online. Syncing your changes...',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        id: 'connection-lost',
        type: 'warning',
        title: 'Connection Lost',
        message: 'You\'re now offline. Changes will sync when reconnected.',
        persistent: true
      });
    };

    window.addEventListener('app-notification', handleNotification as EventListener);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('app-notification', handleNotification as EventListener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      // Remove existing notification with same ID
      const filtered = prev.filter(n => n.id !== notification.id);
      
      // Add new notification
      const updated = [notification, ...filtered];
      
      // Limit number of notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <>
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${!isOnline ? 'block' : 'hidden'}`}>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-lg">
          <WifiOff className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Offline Mode
          </span>
        </div>
      </div>

      {/* Notifications Container */}
      <div 
        className={`fixed ${getPositionClasses()} z-50 space-y-3 max-w-sm w-full`}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`
              ${getBackgroundColor(notification.type)}
              border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out
              ${index === 0 ? 'animate-slide-in' : ''}
            `}
            role="alert"
            aria-atomic="true"
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {notification.message}
                </p>

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="mt-3 flex space-x-2">
                    {notification.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => {
                          action.action();
                          if (!notification.persistent) {
                            removeNotification(notification.id);
                          }
                        }}
                        className="text-xs font-medium px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label={`Dismiss ${notification.title} notification`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar for Timed Notifications */}
            {!notification.persistent && (
              <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-current opacity-30 rounded-full animate-progress"
                  style={{
                    animationDuration: `${notification.duration || 5000}ms`
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in,
          .animate-progress {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default NotificationSystem;