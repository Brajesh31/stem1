import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, updateUser as updateUserAction } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { User } from '../store/slices/authSlice';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    displayName: string;
    grade?: number;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials and user data
const DEMO_CREDENTIALS = {
  demo_student: {
    password: 'password',
    user: {
      id: 'student-1',
      username: 'demo_student',
      email: 'student@demo.com',
      role: 'student' as const,
      displayName: 'Spark Adventurer',
      level: 5,
      experience: 1250,
      crystals: 150,
      sparks: 75,
      grade: 8
    }
  },
  demo_teacher: {
    password: 'password',
    user: {
      id: 'teacher-1',
      username: 'demo_teacher',
      email: 'teacher@demo.com',
      role: 'teacher' as const,
      displayName: 'Guild Master',
      level: 10,
      experience: 5000,
      crystals: 500,
      sparks: 250
    }
  },
  demo_admin: {
    password: 'password',
    user: {
      id: 'admin-1',
      username: 'demo_admin',
      email: 'admin@demo.com',
      role: 'admin' as const,
      displayName: 'World Architect',
      level: 15,
      experience: 10000,
      crystals: 1000,
      sparks: 500
    }
  },
  demo_guardian: {
    password: 'password',
    user: {
      id: 'guardian-1',
      username: 'demo_guardian',
      email: 'guardian@demo.com',
      role: 'guardian' as const,
      displayName: 'Learning Watcher',
      level: 1,
      experience: 0,
      crystals: 0,
      sparks: 0
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const mockToken = localStorage.getItem('authToken');
    if (mockToken) {
      loadUserProfile();
    } else {
      setInitializing(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const mockToken = localStorage.getItem('authToken');
      if (mockToken && DEMO_CREDENTIALS[mockToken as keyof typeof DEMO_CREDENTIALS]) {
        const userData = DEMO_CREDENTIALS[mockToken as keyof typeof DEMO_CREDENTIALS].user;
        dispatch(loginSuccess({ user: userData, token: mockToken }));
      } else {
        localStorage.removeItem('authToken');
        dispatch(logoutAction());
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('authToken');
      dispatch(loginFailure('Failed to load user profile'));
    } finally {
      setInitializing(false);
    }
  };

  const login = async (username: string, password: string) => {
    dispatch(loginStart());
    try {
      const credentials = DEMO_CREDENTIALS[username as keyof typeof DEMO_CREDENTIALS];
      
      if (credentials && credentials.password === password) {
        dispatch(loginSuccess({ user: credentials.user, token: username }));
        dispatch(addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: `Logged in as ${credentials.user.display_name}`
        }));
      } else {
        dispatch(loginFailure('Invalid username or password'));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      dispatch(loginFailure(message));
      dispatch(addNotification({
        type: 'error',
        title: 'Login Failed',
        message
      }));
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    displayName: string;
    grade?: number;
  }) => {
    dispatch(loginStart());
    try {
      const message = 'Registration is not supported in demo mode';
      dispatch(loginFailure(message));
      dispatch(addNotification({
        type: 'error',
        title: 'Registration Not Available',
        message: 'Please use demo credentials to login'
      }));
      throw new Error(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      dispatch(addNotification({
        type: 'error',
        title: 'Registration Failed',
        message
      }));
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'See you next time!'
    }));
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch(updateUserAction(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading: isLoading || initializing, 
      login, 
      register, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};