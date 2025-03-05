import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface RiskCategory {
  name: string;
  score: number;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface RiskAssessmentData {
  overallRiskLevel: string;
  overallScore: number;
  categories: RiskCategory[];
  totalRisks: number;
  urgentRisks: number;
  lastAssessmentDate: string;
}

export function useRiskAssessment() {
  const [data, setData] = useState<RiskAssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRiskAssessment = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an actual API call
        const response = await apiClient.get('/api/risk-assessment/summary');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching risk assessment data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch risk assessment data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskAssessment();
  }, []);

  // Function to refresh risk assessment data
  const refreshRiskAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/risk-assessment/summary');
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error refreshing risk assessment data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh risk assessment data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update a specific risk category or attribute
  const updateRiskItem = async (riskId: string, updatedData: any) => {
    try {
      const response = await apiClient.put(`/api/risk-assessment/items/${riskId}`, updatedData);
      await refreshRiskAssessment(); // Refresh the data after updating
      return response.data;
    } catch (err) {
      console.error('Error updating risk item:', err);
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    refreshRiskAssessment,
    updateRiskItem
  };
}
