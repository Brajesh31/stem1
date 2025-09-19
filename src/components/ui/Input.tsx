import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'w-full px-4 py-3 border rounded-lg shadow-sm transition-all',
    'bg-secondary text-primary border-primary',
    'focus:outline-none focus:border-glow focus-visible:ring-accent',
    error ? 'border-error focus:border-error focus-visible:ring-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="w-5 h-5 text-error" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error font-medium">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-muted">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;