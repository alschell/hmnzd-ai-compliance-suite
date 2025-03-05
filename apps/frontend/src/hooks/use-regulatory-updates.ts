import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  sourceUrl?: string;
  region: string;
  framework: string;
  publishedAt: string;
  read: boolean;
  category: 'new' | 'amendment' | 'guidance' | 'enforcement' | 'upcoming';
  relevance: 'high' | 'medium' | 'low';
}

export interface RegulatoryUpdatesData {
  updates: RegulatoryUpdate[];
  unreadCount: number;
  highRelevanceCount: number;
  lastUpdated: string;
}

export function useRegulatoryUpdates() {
  const [data, setData] = useState<RegulatoryUpdatesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/regulatory-updates');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching regulatory updates:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch regulatory updates'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Function to mark an update as read
  const markUpdateAsRead = async (updateId: string) => {
    try {
      const response = await apiClient.put(`/api/regulatory-updates/${updateId}/read`, {
        read: true,
        readAt: new Date().toISOString(),
        readBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect the change
      setData(prevData => {
        if (!prevData) return null;
        
        const targetUpdate = prevData.updates.find(u => u.id === updateId);
        const wasUnread = targetUpdate && !targetUpdate.read;
        
        return {
          ...prevData,
          updates: prevData.updates.map(update => 
            update.id === updateId 
              ? { ...update, read: true }
              : update
          ),
          unreadCount: wasUnread ? prevData.unreadCount - 1 : prevData.unreadCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking update as read:', err);
      throw err;
    }
  };

  // Function to mark all updates as read
  const markAllAsRead = async () => {
    try {
      const response = await apiClient.put('/api/regulatory-updates/mark-all-read', {
        readAt: new Date().toISOString(),
        readBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect all updates as read
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          updates: prevData.updates.map(update => ({ ...update, read: true })),
          unreadCount: 0,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking all updates as read:', err);
      throw err;
    }
  };

  // Function to refresh regulatory updates
  const refreshUpdates = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/regulatory-updates');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing regulatory updates:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh regulatory updates'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter updates by region and/or framework
  const filterUpdates = async (filters: { region?: string, framework?: string, category?: string }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.framework) queryParams.append('framework', filters.framework);
      if (filters.category) queryParams.append('category', filters.category);
      
      const response = await apiClient.get(`/api/regulatory-updates?${queryParams.toString()}`);
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error filtering regulatory updates:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter regulatory updates'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    markUpdateAsRead,
    markAllAsRead,
    refreshUpdates,
    filterUpdates
  };
}
