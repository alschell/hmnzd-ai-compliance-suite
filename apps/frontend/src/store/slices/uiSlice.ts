/**
 * UI State Management
 * Current date: 2025-03-05 14:42:02
 * Current user: alschell
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  autoHide?: boolean;
}

interface UiState {
  sidebarOpen: boolean;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string | null;
  darkMode: boolean;
  pageTitle: string;
}

// Get dark mode preference from localStorage or system preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedDarkMode = localStorage.getItem('darkMode');
const initialDarkMode = storedDarkMode !== null 
  ? storedDarkMode === 'true'
  : prefersDarkMode;

// Set initial state
const initialState: UiState = {
  sidebarOpen: window.innerWidth >= 960, // Open on larger screens by default
  notifications: [],
  isLoading: false,
  loadingMessage: null,
  darkMode: initialDarkMode,
  pageTitle: 'Dashboard'
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
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        ...action.payload,
        id,
        autoHide: action.payload.autoHide !== false,
        duration: action.payload.duration || 5000
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (!action.payload) {
        state.loadingMessage = null;
      }
    },
    setLoadingMessage: (state, action: PayloadAction<string | null>) => {
      state.loadingMessage = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
      // Update document title
      document.title = `${action.payload} | Harmonized AI Compliance Suite`;
    }
  }
});

export const {
  setSidebarOpen,
  toggleSidebar,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setLoadingMessage,
  toggleDarkMode,
  setPageTitle
} = uiSlice.actions;

export default uiSlice.reducer;
