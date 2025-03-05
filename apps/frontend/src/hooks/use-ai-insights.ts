import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface Insight {
  id: string;
  type: 'recommendation' | 'improvement' | 'risk' | 'pattern' | 'opportunity';
  category: 'consent' | 'data protection' | 'risk management' | 'documentation' | 'governance';
  content: string;
  recommendation?: string;
  action?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
  readAt?: string;
  read: boolean;
}

export interface AiInsightsData {
  insights: Insight[];
  lastUpdated: string;
  totalCount: number;
  unreadCount: number;
  criticalCount: number;
}

export function useAiInsights() {
  const [data, setData] = useState<AiInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/ai-insights');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching AI insights:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch AI insights'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  // Function to mark an insight as read
  const markInsightAsRead = async (insightId: string) => {
    try {
      const response = await apiClient.put(`/api/ai-insights/${insightId}/read`, {
        read: true,
        readAt: new Date().toISOString(),
        readBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect the change
      setData(prevData => {
        if (!prevData) return null;
        
        const targetInsight = prevData.insights.find(i => i.id === insightId);
        const wasUnread = targetInsight && !targetInsight.read;
        
        return {
          ...prevData,
          insights: prevData.insights.map(insight => 
            insight.id === insightId 
              ? { ...insight, read: true, readAt: new Date().toISOString() }
              : insight
          ),
          unreadCount: wasUnread ? prevData.unreadCount - 1 : prevData.unreadCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking insight as read:', err);
      throw err;
    }
  };

  // Function to regenerate insights
  const refreshInsights = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would trigger the AI to generate new insights
      const response = await apiClient.post('/api/ai-insights/generate', {
        requestedBy: "alschell",
        requestedAt: new Date().toISOString()
      });
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error generating AI insights:', err);
      setError(err instanceof Error ? err : new Error('Failed to generate AI insights'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mark an insight as implemented
  const markInsightAsImplemented = async (insightId: string) => {
    try {
      const response = await apiClient.put(`/api/ai-insights/${insightId}/implement`, {
        implemented: true,
        implementedAt: new Date().toISOString(),
        implementedBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to remove the implemented insight
      setData(prevData => {
        if (!prevData) return null;
        
        const filteredInsights = prevData.insights.filter(insight => insight.id !== insightId);
        const removedInsight = prevData.insights.find(insight => insight.id === insightId);
        
        return {
          ...prevData,
          insights: filteredInsights,
          totalCount: prevData.totalCount - 1,
          unreadCount: removedInsight && !removedInsight.read 
            ? prevData.unreadCount - 1 
            : prevData.unreadCount,
          criticalCount: removedInsight && removedInsight.severity === 'critical'
            ? prevData.criticalCount - 1
            : prevData.criticalCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error implementing insight:', err);
      throw err;
    }
  };

  // Function to filter insights by type and/or category
  const filterInsights = async (filters: { type?: string, category?: string, severity?: string }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.severity) queryParams.append('severity', filters.severity);
      
      const response = await apiClient.get(`/api/ai-insights?${queryParams.toString()}`);
      
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error filtering AI insights:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter AI insights'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    markInsightAsRead,
    refreshInsights,
    markInsightAsImplemented,
    filterInsights
  };
}
