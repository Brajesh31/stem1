import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full border transition-all';
  
  const variantClasses = {
    primary: 'bg-accent-interactive/20 text-accent-interactive border-accent-interactive/30',
    secondary: 'bg-tertiary text-secondary border-primary',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-error/20 text-error border-error/30',
    info: 'bg-info/20 text-info border-info/30'
  }[variant] || 'bg-tertiary text-secondary border-primary';
  
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  
  const classes = [baseClasses, variantClasses, sizeClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;