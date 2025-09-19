import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'themed-button-primary-bg',
    success: 'bg-green-500',
    warning: 'bg-yellow-500', 
    danger: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-semibold text-primary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-muted font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-tertiary rounded-full overflow-hidden border border-primary/50 ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${variant === 'primary' ? 'bg-accent-interactive shadow-glow' : variantClasses[variant]} ${animated ? 'relative overflow-hidden' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {animated && (
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;