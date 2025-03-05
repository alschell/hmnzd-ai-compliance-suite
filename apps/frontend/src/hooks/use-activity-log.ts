import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface ActivityLogUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ActivityLogItem {
  id: string;
  type: string; // e.g., 'login', 'document', 'assessment', 'settings', 'user'
  action: string; // e.g., 'created a document', 'completed an assessment'
  details?: string;
  timestamp: string;
  user: ActivityLogUser;
  metadata?: Record<string, any>;
}

export interface ActivityLogData {
  activities: ActivityLogItem[];
  lastUpdated: string;
  totalCount: number;
}

export function useActivityLog() {
  const [data, setData] = useState<ActivityLogData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/activity-log');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity log:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch activity log'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityLog();
  }, []);

  // Function to filter activity logs
  const filterActivityLog = async (filters: { type?: string, userId?: string, dateFrom?: string, dateTo?: string }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/api/activity-log?${queryParams.toString()}`);
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error filtering activity log:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter activity log'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh activity log
  const refreshActivityLog = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/activity-log');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing activity log:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh activity log'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export activity log
  const exportActivityLog = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const response = await apiClient.get(`/api/activity-log/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create a temporary download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity-log-${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error(`Error exporting activity log as ${format}:`, err);
      throw err;
    }
  };

  // Function to add an activity (mostly used internally by the system)
  const logActivity = async (activityData: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    try {
      const response = await apiClient.post('/api/activity-log', {
        ...activityData,
        timestamp: new Date().toISOString()
      });
      
      // Update local state to include the new activity
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          activities: [response.data, ...prevData.activities],
          totalCount: prevData.totalCount + 1,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error logging activity:', err);
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    filterActivityLog,
    refreshActivityLog,
    exportActivityLog,
    logActivity
  };
}
