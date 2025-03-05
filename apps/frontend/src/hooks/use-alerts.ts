import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: 'system' | 'compliance' | 'security' | 'risk' | 'deadline' | 'regulatory';
  createdAt: string;
  read: boolean;
  readAt?: string;
  actionRequired: boolean;
  actionLink?: string;
}

export interface AlertsData {
  alerts: Alert[];
  unreadCount: number;
  criticalCount: number;
  lastUpdated: string;
}

export function useAlerts() {
  const [data, setData] = useState<AlertsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/alerts');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Function to mark an alert as read
  const markAlertAsRead = async (alertId: string) => {
    try {
      const response = await apiClient.put(`/api/alerts/${alertId}/read`, {
        read: true,
        readAt: new Date().toISOString(),
        readBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect the change
      setData(prevData => {
        if (!prevData) return null;
        
        const targetAlert = prevData.alerts.find(a => a.id === alertId);
        const wasUnread = targetAlert && !targetAlert.read;
        const wasCritical = targetAlert && targetAlert.severity === 'critical' && !targetAlert.read;
        
        return {
          ...prevData,
          alerts: prevData.alerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, read: true, readAt: new Date().toISOString() }
              : alert
          ),
          unreadCount: wasUnread ? prevData.unreadCount - 1 : prevData.unreadCount,
          criticalCount: wasCritical ? prevData.criticalCount - 1 : prevData.criticalCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking alert as read:', err);
      throw err;
    }
  };

  // Function to mark all alerts as read
  const markAllAlertsAsRead = async () => {
    try {
      const response = await apiClient.put('/api/alerts/mark-all-read', {
        readAt: new Date().toISOString(),
        readBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect all alerts as read
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          alerts: prevData.alerts.map(alert => ({ ...alert, read: true, readAt: new Date().toISOString() })),
          unreadCount: 0,
          criticalCount: 0,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
      throw err;
    }
  };

  // Function to dismiss an alert
  const dismissAlert = async (alertId: string) => {
    try {
      const response = await apiClient.delete(`/api/alerts/${alertId}`);
      
      // Update local state to remove the dismissed alert
      setData(prevData => {
        if (!prevData) return null;
        
        const filteredAlerts = prevData.alerts.filter(alert => alert.id !== alertId);
        const removedAlert = prevData.alerts.find(alert => alert.id === alertId);
        
        return {
          ...prevData,
          alerts: filteredAlerts,
          unreadCount: removedAlert && !removedAlert.read 
            ? prevData.unreadCount - 1 
            : prevData.unreadCount,
          criticalCount: removedAlert && removedAlert.severity === 'critical' && !removedAlert.read
            ? prevData.criticalCount - 1
            : prevData.criticalCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error dismissing alert:', err);
      throw err;
    }
  };

  // Function to refresh alerts
  const refreshAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/alerts');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing alerts:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh alerts'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter alerts
  const filterAlerts = async (filters: { type?: string, severity?: string, source?: string }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.severity) queryParams.append('severity', filters.severity);
      if (filters.source) queryParams.append('source', filters.source);
      
      const response = await apiClient.get(`/api/alerts?${queryParams.toString()}`);
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error filtering alerts:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter alerts'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    markAlertAsRead,
    markAllAlertsAsRead,
    dismissAlert,
    refreshAlerts,
    filterAlerts
  };
}
