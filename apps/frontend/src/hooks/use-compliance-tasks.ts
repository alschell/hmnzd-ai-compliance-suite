import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface ComplianceTask {
  id: string;
  title: string;
  description?: string;
  framework: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ComplianceTasksData {
  tasks: ComplianceTask[];
  totalCount: number;
  overdueTasks: number;
  upcomingTasks: number;
  completedTasks: number;
  lastUpdated: string;
}

export function useComplianceTasks() {
  const [data, setData] = useState<ComplianceTasksData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/compliance-tasks');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching compliance tasks:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch compliance tasks'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Function to mark a task as complete
  const markTaskComplete = async (taskId: string) => {
    try {
      const response = await apiClient.put(`/api/compliance-tasks/${taskId}/complete`, { 
        completed: true,
        completedAt: new Date().toISOString(),
        completedBy: "alschell" // In a real app, this would come from the authenticated user
      });
      
      // Update local state to reflect the change
      setData(prevData => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          tasks: prevData.tasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: true }
              : task
          ),
          completedTasks: prevData.completedTasks + 1,
          overdueTasks: prevData.tasks.find(t => t.id === taskId && new Date(t.dueDate) < new Date())
            ? prevData.overdueTasks - 1
            : prevData.overdueTasks,
          upcomingTasks: prevData.tasks.find(t => t.id === taskId && new Date(t.dueDate) >= new Date())
            ? prevData.upcomingTasks - 1
            : prevData.upcomingTasks
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error marking task as complete:', err);
      throw err;
    }
  };

  // Function to create a new task
  const createTask = async (taskData: Omit<ComplianceTask, 'id' | 'completed'>) => {
    try {
      const response = await apiClient.post('/api/compliance-tasks', {
        ...taskData,
        completed: false
      });
      
      // Update local state to include the new task
      setData(prevData => {
        if (!prevData) return null;
        
        const newTask = response.data;
        const isUpcoming = new Date(newTask.dueDate) >= new Date();
        
        return {
          ...prevData,
          tasks: [...prevData.tasks, newTask],
          totalCount: prevData.totalCount + 1,
          upcomingTasks: isUpcoming ? prevData.upcomingTasks + 1 : prevData.upcomingTasks,
          lastUpdated: new Date().toISOString()
        };
      });
      
      return response.data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  // Function to refresh all tasks
  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/compliance-tasks');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing compliance tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh compliance tasks'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    markTaskComplete,
    createTask,
    refreshTasks
  };
}
