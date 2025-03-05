/**
 * Application Configuration
 * Current date: 2025-03-05 14:42:02
 * Current user: alschell
 */

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Auth Configuration
export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';
export const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// App Configuration
export const APP_NAME = 'Harmonized AI Compliance Suite';
export const APP_VERSION = '1.0.0';

// Chart Colors
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#9c27b0',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1',
  grey: '#757575',
};

// Dashboard Configuration
export const DASHBOARD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Date Formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const DISPLAY_DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
