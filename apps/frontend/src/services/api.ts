/**
 * API Service
 * Current date: 2025-03-05 14:42:02
 * Current user: alschell
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../config';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Request configuration interface
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandling?: boolean;
}

// Generic API service with error handling
const apiService = {
  /**
   * Send a GET request
   */
  get: async <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      if (!config?.skipErrorHandling) {
        handleApiError(error);
      }
      throw error;
    }
  },

  /**
   * Send a POST request
   */
  post: async <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.post(url, data, config);
      return response.data;
    } catch (error: any) {
      if (!config?.skipErrorHandling) {
        handleApiError(error);
      }
      throw error;
    }
  },

  /**
   * Send a PUT request
   */
  put: async <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.put(url, data, config);
      return response.data;
    } catch (error: any) {
      if (!config?.skipErrorHandling) {
        handleApiError(error);
      }
      throw error;
    }
  },

  /**
   * Send a DELETE request
   */
  delete: async <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.delete(url, config);
      return response.data;
    } catch (error: any) {
      if (!config?.skipErrorHandling) {
        handleApiError(error);
      }
      throw error;
    }
  },

  /**
   * Send a PATCH request
   */
  patch: async <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      if (!config?.skipErrorHandling) {
        handleApiError(error);
      }
      throw error;
    }
  }
};

/**
 * Handle API errors consistently
 */
const handleApiError = (error: any): void => {
  if (axios.isAxiosError(error)) {
    // Get the error message from the response if available
    const errorMessage = error.response?.data?.message || error.message;
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url
    });
    
    // Here you could also dispatch actions to show notifications
    // or handle specific error status codes
  } else {
    console.error('Unexpected error:', error);
  }
};

export default apiService;
