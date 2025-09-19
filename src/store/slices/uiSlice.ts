import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    timestamp: number;
  }>;
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  notifications: [],
  loading: {
    global: false,
    components: {},
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning';
      title: string;
      message?: string;
    }>) => {
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setComponentLoading,
} = uiSlice.actions;

export default uiSlice.reducer;