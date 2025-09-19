import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { useEffect } from 'react';
import AuthPortal from './components/auth/AuthPortal';
import StudentRealm from './components/realms/StudentRealm';
import TeacherRealm from './components/realms/TeacherRealm';
import AdminRealm from './components/realms/AdminRealm';
import GuardianRealm from './components/realms/GuardianRealm';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useState } from 'react';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Load theme system
    import('./theme.js');
    
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!initialLoadComplete) {
    return (
      <div className="section section--hero">
        <div className="container">
          <div className="hero">
            <h1 className="hero__title">Project Spark</h1>
            <p className="hero__subtitle">Loading your learning odyssey...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section section--hero">
        <div className="container">
          <div className="hero">
            <h1 className="hero__title">Project Spark</h1>
            <p className="hero__subtitle">Authenticating your adventure...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPortal />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a href="/" className="nav__brand">Project Spark</a>
            <div className="nav__user">
              <span className="text-secondary">Welcome, {user.displayName}</span>
              <span className="badge badge--primary">{user.role}</span>
            </div>
          </nav>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route 
            path="/" 
            element={
              user.role === 'student' ? <Navigate to="/student" /> :
              user.role === 'teacher' ? <Navigate to="/teacher" /> :
              user.role === 'admin' ? <Navigate to="/admin" /> :
              user.role === 'guardian' ? <Navigate to="/guardian" /> :
              <Navigate to="/login" />
            } 
          />
          <Route path="/student/*" element={user.role === 'student' ? <StudentRealm /> : <Navigate to="/" />} />
          <Route path="/teacher/*" element={user.role === 'teacher' ? <TeacherRealm /> : <Navigate to="/" />} />
          <Route path="/admin/*" element={user.role === 'admin' ? <AdminRealm /> : <Navigate to="/" />} />
          <Route path="/guardian/*" element={user.role === 'guardian' ? <GuardianRealm /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <Router>
            <AppRoutes />
            <ToastContainer />
          </Router>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;