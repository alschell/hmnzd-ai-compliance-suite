import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  region: string;
  complianceScore: number;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant' | 'Pending';
  lastUpdated: string;
  controlsCompliant: number;
  totalControls: number;
  criticalFindings: number;
}

interface ComplianceSummaryData {
  overallScore: number;
  overallStatus: 'Compliant' | 'At Risk' | 'Non-Compliant' | 'Pending';
  lastAssessment: string;
  frameworks: ComplianceFramework[];
}

export function useComplianceSummary() {
  const [data, setData] = useState<ComplianceSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComplianceSummary = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: ComplianceSummaryData = {
          overallScore: 78,
          overallStatus: 'At Risk',
          lastAssessment: 'Last assessed on Feb 28, 2025',
          frameworks: [
            {
              id: 'gdpr',
              name: 'GDPR',
              description: 'General Data Protection Regulation - EU regulation on data protection and privacy',
              region: 'European Union',
              complianceScore: 82,
              status: 'At Risk',
              lastUpdated: '2025-02-28T15:30:00Z',
              controlsCompliant: 96,
              totalControls: 117,
              criticalFindings: 2
            },
            {
              id: 'hipaa',
              name: 'HIPAA',
              description: 'Health Insurance Portability and Accountability Act - US healthcare data privacy and security',
              region: 'United States',
              complianceScore: 91,
              status: 'Compliant',
              lastUpdated: '2025-02-15T10:45:00Z',
              controlsCompliant: 68,
              totalControls: 75,
              criticalFindings: 0
            },
            {
              id: 'soc2',
              name: 'SOC 2',
              description: 'Service Organization Control 2 - Trust Services Criteria for security, availability, processing integrity, confidentiality, and privacy',
              region: 'Global',
              complianceScore: 76,
              status: 'At Risk',
              lastUpdated: '2025-03-01T09:15:00Z',
              controlsCompliant: 104,
              totalControls: 137,
              criticalFindings: 3
            },
            {
              id: 'nist',
              name: 'NIST CSF',
              description: 'National Institute of Standards and Technology Cybersecurity Framework',
              region: 'United States',
              complianceScore: 73,
              status: 'At Risk',
              lastUpdated: '2025-02-20T14:00:00Z',
              controlsCompliant: 81,
              totalControls: 111,
              criticalFindings: 1
            },
            {
              id: 'iso27001',
              name: 'ISO 27001',
              description: 'International standard for information security management',
              region: 'Global',
              complianceScore: 68,
              status: 'At Risk',
              lastUpdated: '2025-02-10T11:30:00Z',
              controlsCompliant: 75,
              totalControls: 110,
              criticalFindings: 4
            }
          ]
        };

        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch compliance summary'));
        console.error('Error fetching compliance summary:', err);
        toast({
          title: "Error",
          description: "Failed to load compliance summary",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplianceSummary();
  }, [toast]);

  return {
    data,
    isLoading,
    error
  };
}
