import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'themed-success',
    error: 'themed-danger',
    info: 'themed-info',
    warning: 'themed-warning',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'themed-text-link',
    warning: 'text-yellow-600',
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        ${colors[type]} bg-secondary border-primary border
        ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-2'}
        max-w-sm w-full rounded-xl p-4 shadow-lg transition-all duration-300 backdrop-blur-sm
      `}
    >
      <div className="flex items-start">
        <Icon className={`${iconColors[type]} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary">{title}</p>
          {message && (
            <p className="mt-1 text-sm text-secondary">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="ml-3 flex-shrink-0 text-muted hover:text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;