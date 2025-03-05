import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface DeadlineItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: 'regulatory' | 'assessment' | 'report' | 'audit' | 'other';
  framework?: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface UpcomingDeadlinesData {
  deadlines: DeadlineItem[];
  overdueCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
  lastUpdated: string;
}

export function useUpcomingDeadlines() {
  const [data, setData] = useState<UpcomingDeadlinesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/deadlines');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching upcoming deadlines:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch upcoming deadlines'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  // Function to mark a deadline as completed
  const completeDeadline = async (deadlineId: string) => {
    try {
      const response = await apiClient.put(`/api/deadlines/${deadlineId}/complete`, {
        completed: true,
        completedAt: new Date().toISOString(),
        completedBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect the change
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          deadlines: prevData.deadlines.map(deadline => 
            deadline.id === deadlineId 
              ? { ...deadline, completed: true }
              : deadline
          ),
          // Adjust counts as needed
          overdueCount: prevData.deadlines.find(d => d.id === deadlineId && new Date(d.dueDate) < new Date())
            ? prevData.overdueCount - 1
            : prevData.overdueCount,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error completing deadline:', err);
      throw err;
    }
  };

  // Function to add a new deadline
  const addDeadline = async (deadlineData: Omit<DeadlineItem, 'id' | 'completed'>) => {
    try {
      const response = await apiClient.post('/api/deadlines', {
        ...deadlineData,
        completed: false
      });
      
      // Update local state to include the new deadline
      setData(prevData => {
        if (!prevData) return null;
        
        const newDeadline = response.data;
        const now = new Date();
        const dueDate = new Date(newDeadline.dueDate);
        
        // Calculate which count to increment
        let updatedData = { ...prevData };
        
        if (dueDate < now) {
          updatedData.overdueCount += 1;
        } else {
          // Check if deadline is within this week
          const oneWeek = new Date();
          oneWeek.setDate(now.getDate() + 7);
          
          if (dueDate <= oneWeek) {
            updatedData.thisWeekCount += 1;
          }
          
          // Check if deadline is within this month
          const oneMonth = new Date();
          oneMonth.setMonth(now.getMonth() + 1);
          
          if (dueDate <= oneMonth) {
            updatedData.thisMonthCount += 1;
          }
        }
        
        return {
          ...updatedData,
          deadlines: [...prevData.deadlines, newDeadline],
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error adding deadline:', err);
      throw err;
    }
  };

  // Function to refresh deadlines data
  const refreshDeadlines = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/deadlines');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing deadlines:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh deadlines'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    completeDeadline,
    addDeadline,
    refreshDeadlines
  };
}
