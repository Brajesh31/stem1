import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardBody } from '../ui/Card';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  selectedRole: 'student' | 'teacher' | 'admin' | 'guardian';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSwitchToLogin, 
  selectedRole 
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    grade: 6
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (selectedRole === 'student' && (formData.grade < 6 || formData.grade > 12)) {
      newErrors.grade = 'Please select a valid grade (6-12)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        displayName: formData.displayName,
        grade: selectedRole === 'student' ? formData.grade : undefined
      });
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'teacher': return 'Teacher';
      case 'admin': return 'Administrator';
      case 'guardian': return 'Guardian';
      default: return role;
    }
  };

  return (
    <Card className="w-full max-w-md themed-bg-secondary">
      <CardBody>
        <div className="text-center mb-6">
          <div className="w-16 h-16 themed-button-accent rounded-full flex items-center justify-center mx-auto mb-4 themed-shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold themed-text-primary">Create Account</h2>
          <p className="themed-text-secondary mt-2">
            Join Project Spark as a {getRoleDisplayName(selectedRole)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Choose a unique username"
            error={errors.username}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            error={errors.email}
            required
          />

          <Input
            label="Display Name"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder="Your full name"
            error={errors.displayName}
            required
          />

          {selectedRole === 'student' && (
            <div>
              <label className="block text-sm font-medium themed-text-primary mb-1">
                Grade Level
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="w-full px-3 py-2 border themed-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 themed-focus themed-bg-secondary themed-text-primary"
                required
              >
                {Array.from({ length: 7 }, (_, i) => i + 6).map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
              )}
            </div>
          )}

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a secure password"
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="themed-text-link hover:opacity-80 font-medium transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;