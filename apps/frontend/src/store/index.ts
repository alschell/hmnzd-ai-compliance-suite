/**
 * Redux Store Configuration
 * Current date: 2025-03-06 10:24:59
 * Current user: alschell
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import frameworkReducer from './slices/frameworkSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import policyReducer from './slices/policySlice';
import findingReducer from './slices/findingSlice';
import assessmentReducer from './slices/assessmentSlice';
import organizationReducer from './slices/organizationSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  framework: frameworkReducer,
  ui: uiReducer,
  auth: authReducer,
  policy: policyReducer,
  finding: findingReducer,
  assessment: assessmentReducer,
  organization: organizationReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/logout'],
        // Ignore these field paths in state and actions
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
