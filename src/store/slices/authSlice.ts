import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'guardian' | 'admin';
  displayName: string;
  avatar_url?: string;
  level?: number;
  experience?: number;
  crystals?: number;
  sparks?: number;
  grade?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  token: localStorage.getItem('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('authToken', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('authToken');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;