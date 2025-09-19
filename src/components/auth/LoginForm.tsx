import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card__header text-center">
            <h2 className="card__title">Welcome Back</h2>
            <p className="card__description">Sign in to continue your learning journey</p>
          </div>

          <div className="card__body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username or email"
                  required
                />
                {errors.username && <p className="text-error mt-sm">{errors.username}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn--secondary btn--sm"
                    style={{ 
                      position: 'absolute', 
                      right: '8px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      padding: '4px 8px'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <p className="text-error mt-sm">{errors.password}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`btn btn--primary w-full ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="card__footer text-center">
            <button 
              onClick={onSwitchToRegister}
              className="btn btn--secondary"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>

        <div className="demo-credentials mt-xl">
          <h3 className="demo-credentials__title">Quick Demo Access</h3>
          <div className="demo-credentials__list">
            <div 
              className="demo-credential"
              onClick={() => {
                setFormData({ username: 'demo_student', password: 'password' });
                setErrors({});
              }}
            >
              <div className="demo-credential__role">Student</div>
              <div className="demo-credential__details">demo_student / password</div>
            </div>
            <div 
              className="demo-credential"
              onClick={() => {
                setFormData({ username: 'demo_teacher', password: 'password' });
                setErrors({});
              }}
            >
              <div className="demo-credential__role">Teacher</div>
              <div className="demo-credential__details">demo_teacher / password</div>
            </div>
            <div 
              className="demo-credential"
              onClick={() => {
                setFormData({ username: 'demo_guardian', password: 'password' });
                setErrors({});
              }}
            >
              <div className="demo-credential__role">Guardian</div>
              <div className="demo-credential__details">demo_guardian / password</div>
            </div>
            <div 
              className="demo-credential"
              onClick={() => {
                setFormData({ username: 'demo_admin', password: 'password' });
                setErrors({});
              }}
            >
              <div className="demo-credential__role">Admin</div>
              <div className="demo-credential__details">demo_admin / password</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;
  )
}