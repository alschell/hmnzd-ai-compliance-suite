/**
 * Authentication Service
 * Current date: 2025-03-05 14:42:02
 * Current user: alschell
 */

import api from './api';
import { User } from '../types/user';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../config';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetConfirmation {
  token: string;
  password: string;
  confirmPassword: string;
}

interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

const authService = {
  /**
   * Log in with username and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/users/login', credentials);
    
    // Store token and user in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Log out the current user
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Check if the user is logged in
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Get the current user
   */
  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data', error);
      return null;
    }
  },

  /**
   * Get the current token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/users/refresh-token');
    
    // Update token in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    
    return response;
  },

  /**
   * Request a password reset email
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/api/users/forgot-password', data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordResetConfirmation): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/api/users/reset-password', data);
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: UserProfileUpdate): Promise<User> => {
    return api.put<User>(`/api/users/${userId}`, data);
  },

  /**
   * Change password
   */
  changePassword: async (userId: string, oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/api/users/${userId}/change-password`, {
      currentPassword: oldPassword,
      newPassword
    });
  }
};

export default authService;
