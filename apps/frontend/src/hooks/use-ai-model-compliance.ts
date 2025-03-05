import { useState, useEffect } from 'react';

interface ComplianceFactor {
  name: string;
  score: number;
  issues?: string[];
}

interface AIModel {
  id: string;
  name: string;
  type: string;
  purpose: string;
  owner: string;
  department: string;
  highRisk: boolean;
  status: 'development' | 'testing' | 'production' | 'retired';
  complianceScore: number;
  complianceFactors: ComplianceFactor[];
  lastAssessment: string;
  framework: string[];
}

interface AIModelComplianceData {
  totalModels: number;
  compliantModels: number;
  atRiskModels: number;
  nonCompliantModels: number;
  highRiskModels: number;
  models: AIModel[];
}

export function useAIModelCompliance() {
  const [data, setData] = useState<AIModelComplianceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAIModelCompliance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockModels: AIModel[] = [
          {
            id: "model-001",
            name: "Customer Churn Predictor",
            type: "Machine Learning",
            purpose: "Predict customer churn likelihood to enable proactive retention",
            owner: "Marketing Analytics",
            department: "Marketing",
            highRisk: false,
            status: "production",
            complianceScore: 87,
            complianceFactors: [
              { name: "Documentation", score: 95 },
              { name: "Fairness", score: 85 },
              { name: "Data Privacy", score: 90 },
              { name: "Explainability", score: 72 },
              { name: "Security", score: 89 },
              { name: "Human Oversight", score: 85 }
            ],
            lastAssessment: "2025-02-18T09:30:00Z",
            framework: ["NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-002",
            name: "Loan Approval System",
            type: "Machine Learning",
            purpose: "Automate loan eligibility assessment for customers",
            owner: "Financial Risk",
            department: "Finance",
            highRisk: true,
            status: "production",
            complianceScore: 73,
            complianceFactors: [
              { name: "Documentation", score: 80 },
              { name: "Fairness", score: 65 },
              { name: "Data Privacy", score: 85 },
              { name: "Explainability", score: 60 },
              { name: "Security", score: 80 },
              { name: "Human Oversight", score: 70 }
            ],
            lastAssessment: "2025-02-10T14:15:00Z",
            framework: ["EU AI Act", "NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-003",
            name: "Customer Service Chatbot",
            type: "Natural Language Processing",
            purpose: "Provide automated customer support through chat interface",
            owner: "Customer Support",
            department: "Operations",
            highRisk: false,
            status: "production",
            complianceScore: 92,
            complianceFactors: [
              { name: "Documentation", score: 90 },
              { name: "Fairness", score: 95 },
              { name: "Data Privacy", score: 94 },
              { name: "Explainability", score: 85 },
              { name: "Security", score: 95 },
              { name: "Human Oversight", score: 90 }
            ],
            lastAssessment: "2025-02-25T11:00:00Z",
            framework: ["NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-004",
            name: "Employee Performance Predictor",
            type: "Machine Learning",
            purpose: "Analyze and predict employee performance metrics",
            owner: "HR Analytics",
            department: "Human Resources",
            highRisk: true,
            status: "testing",
            complianceScore: 58,
            complianceFactors: [
              { name: "Documentation", score: 65 },
              { name: "Fairness", score: 45 },
              { name: "Data Privacy", score: 70 },
              { name: "Explainability", score: 50 },
              { name: "Security", score: 75 },
              { name: "Human Oversight", score: 45 }
            ],
            lastAssessment: "2025-03-01T13:45:00Z",
            framework: ["EU AI Act", "NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-005",
            name: "GPT-4 Enterprise Integration",
            type: "Large Language Model",
            purpose: "Content generation and knowledge assistance for employees",
            owner: "IT Innovation",
            department: "Information Technology",
            highRisk: true,
            status: "production",
            complianceScore: 81,
            complianceFactors: [
              { name: "Documentation", score: 90 },
              { name: "Fairness", score: 75 },
              { name: "Data Privacy", score: 85 },
              { name: "Explainability", score: 65 },
              { name: "Security", score: 90 },
              { name: "Human Oversight", score: 80 }
            ],
            lastAssessment: "2025-02-28T10:30:00Z",
            framework: ["EU AI Act", "NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-006",
            name: "Fraud Detection System",
            type: "Machine Learning",
            purpose: "Identify potential fraudulent transactions",
            owner: "Security Operations",
            department: "Security",
            highRisk: true,
            status: "production",
            complianceScore: 89,
            complianceFactors: [
              { name: "Documentation", score: 85 },
              { name: "Fairness", score: 80 },
              { name: "Data Privacy", score: 95 },
              { name: "Explainability", score: 75 },
              { name: "Security", score: 95 },
              { name: "Human Oversight", score: 95 }
            ],
            lastAssessment: "2025-02-15T16:20:00Z",
            framework: ["EU AI Act", "NIST AI RMF", "Internal AI Policy"]
          },
          {
            id: "model-007",
            name: "Supply Chain Optimizer",
            type: "Machine Learning",
            purpose: "Optimize logistics and inventory management",
            owner: "Operations",
            department: "Supply Chain",
            highRisk: false,
            status: "development",
            complianceScore: 61,
            complianceFactors: [
              { name: "Documentation", score: 75 },
              { name: "Fairness", score: 85 },
              { name: "Data Privacy", score: 80 },
              { name: "Explainability", score: 50 },
              { name: "Security", score: 55 },
              { name: "Human Oversight", score: 70 }
            ],
            lastAssessment: "2025-03-03T09:15:00Z",
            framework: ["Internal AI Policy"]
          }
        ];

        // Calculate summary metrics
        const compliantModels = mockModels.filter(model => model.complianceScore >= 80).length;
        const atRiskModels = mockModels.filter(model => model.complianceScore >= 60 && model.complianceScore < 80).length;
        const nonCompliantModels = mockModels.filter(model => model.complianceScore < 60).length;
        const highRiskModels = mockModels.filter(model => model.highRisk).length;

        setData({
          totalModels: mockModels.length,
          compliantModels,
          atRiskModels,
          nonCompliantModels,
          highRiskModels,
          models: mockModels
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch AI model compliance'));
        console.error('Error fetching AI model compliance:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIModelCompliance();
  }, []);

  const refreshModelCompliance = async () => {
    setIsLoading(true);
    try {
      // This would be an API call in a real implementation
      // Re-fetch the data
      await fetchAIModelCompliance();
    } catch (err) {
      console.error('Error refreshing AI model compliance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAIModelCompliance = async () => {
    // This is just a placeholder since we're using mock data
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return {
    data,
    isLoading,
    error,
    refreshModelCompliance
  };
}
