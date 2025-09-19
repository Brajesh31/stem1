import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './slices/authSlice';
import gameSlice from './slices/gameSlice';
import uiSlice from './slices/uiSlice';
import curriculumSlice from './slices/curriculumSlice';
import livingLabSlice from './slices/livingLabSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    game: gameSlice,
    ui: uiSlice,
    curriculum: curriculumSlice,
    livingLab: livingLabSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;