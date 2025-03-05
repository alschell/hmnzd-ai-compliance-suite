import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface FrameworkCompliance {
  framework: string;
  score: number;
  totalControls: number;
  compliantControls: number;
  partialControls: number;
  nonCompliantControls: number;
}

export interface ComplianceScoreData {
  overallScore: number;
  previousScore: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  frameworks: FrameworkCompliance[];
  lastUpdated: string;
}

export function useComplianceScore() {
  const [data, setData] = useState<ComplianceScoreData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchComplianceScore = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/compliance-score');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching compliance score data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch compliance score data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplianceScore();
  }, []);

  // Function to refresh compliance score data
  const refreshComplianceScore = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/compliance-score');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing compliance score data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh compliance score data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate improving the compliance score
  // This is a placeholder for actual functionality in a real app
  const improveComplianceScore = async (frameworkId: string) => {
    try {
      // In a real app, this would trigger some specific actions to improve compliance
      const response = await apiClient.post(`/api/compliance-score/improve`, { frameworkId });
      await refreshComplianceScore(); // Refresh data after the action
      return response.data;
    } catch (err) {
      console.error('Error improving compliance score:', err);
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    refreshComplianceScore,
    improveComplianceScore
  };
}
