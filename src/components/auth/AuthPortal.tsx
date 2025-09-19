import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPortal: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'login' | 'register'>('select');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin' | 'guardian'>('student');

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin' | 'guardian') => {
    if (role === 'guardian') {
      return;
    }
    setSelectedRole(role);
    setMode('login');
  };

  const handleBackToSelect = () => {
    setMode('select');
  };

  return (
    <div>
      {mode === 'select' && (
        <RoleSelector onRoleSelect={handleRoleSelect} />
      )}
      
      {mode === 'login' && (
        <div>
          <button onClick={handleBackToSelect}>← Back to role selection</button>
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        </div>
      )}
      
      {mode === 'register' && (
        <div>
          <button onClick={handleBackToSelect}>← Back to role selection</button>
          <RegisterForm 
            onSwitchToLogin={() => setMode('login')}
            selectedRole={selectedRole}
          />
        </div>
      )}
    </div>
  );
};

export default AuthPortal;