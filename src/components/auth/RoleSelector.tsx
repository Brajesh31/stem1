import React from 'react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'teacher' | 'admin' | 'guardian') => void;
}

const roles = [
  {
    id: 'student',
    name: 'Student',
    description: 'Access learning content and track progress'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Create content and manage students'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'Monitor student progress and activities'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manage system settings and users'
  }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="section section--hero">
      <div className="container">
        <header className="hero">
          <h1 className="hero__title">Project Spark</h1>
          <p className="hero__subtitle">A Gamified & Personalized Learning Odyssey</p>
        </header>

        <main>
          <div className="text-center mb-xl">
            <h2 className="text-primary mb-md">Choose Your Adventure</h2>
            <p className="text-secondary">Select your role to begin your learning journey</p>
          </div>
          
          <div className="role-cards animate-stagger">
            {roles.map((role) => {
              const isDisabled = role.id === 'guardian';
              
              return (
                <div
                  key={role.id}
                  className={`role-card ${isDisabled ? 'role-card--disabled' : 'role-card--interactive'}`}
                  onClick={() => {
                    if (!isDisabled) {
                      onRoleSelect(role.id as any);
                    }
                  }}
                >
                  {isDisabled && <div className="role-card__badge">Coming Soon</div>}
                  
                  <div className="role-card__icon">
                    {role.id === 'student' ? '🎓' : 
                     role.id === 'teacher' ? '👨‍🏫' : 
                     role.id === 'guardian' ? '👨‍👩‍👧‍👦' : '⚙️'}
                  </div>
                  
                  <h3 className="role-card__title">{role.name}</h3>
                  <p className="role-card__description">{role.description}</p>
                  
                  {!isDisabled && (
                    <div className="btn btn--primary">
                      Get Started
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="demo-credentials">
            <h3 className="demo-credentials__title">Demo Credentials</h3>
            <div className="demo-credentials__list">
              <div className="demo-credential">
                <div className="demo-credential__role">Student</div>
                <div className="demo-credential__details">demo_student / password</div>
              </div>
              <div className="demo-credential">
                <div className="demo-credential__role">Teacher</div>
                <div className="demo-credential__details">demo_teacher / password</div>
              </div>
              <div className="demo-credential">
                <div className="demo-credential__role">Admin</div>
                <div className="demo-credential__details">demo_admin / password</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleSelector;