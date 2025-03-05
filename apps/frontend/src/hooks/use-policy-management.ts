import { useState, useEffect } from 'react';

export interface Policy {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'Active' | 'Draft' | 'Review' | 'Update Required';
  version: string;
  lastUpdated: string;
  nextReviewDate: string;
  owner: string;
  documentUrl?: string;
  isRequired: boolean;
  frameworks?: string[];
  acknowledgementRate?: number;
}

interface PolicyStats {
  total: number;
  active: number;
  draft: number;
  review: number;
  updateRequired: number;
}

interface PolicyManagementData {
  policies: Policy[];
  stats: PolicyStats;
  categories: string[];
}

export function usePolicyManagement() {
  const [data, setData] = useState<PolicyManagementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T09:44:59Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock policy data
        const mockPolicies: Policy[] = [
          {
            id: "pol-001",
            name: "Data Protection Policy",
            description: "Guidelines and procedures for handling sensitive and personal data in compliance with privacy regulations.",
            category: "Data Privacy",
            status: "Active",
            version: "2.3",
            lastUpdated: "2025-01-15T10:30:00Z",
            nextReviewDate: "2025-07-15T00:00:00Z",
            owner: "Privacy Team",
            documentUrl: "/documents/data-protection-policy-v2.3.pdf",
            isRequired: true,
            frameworks: ["GDPR", "CCPA", "ISO 27001"],
            acknowledgementRate: 92
          },
          {
            id: "pol-002",
            name: "Information Security Policy",
            description: "Comprehensive set of policies and procedures for protecting information assets and systems.",
            category: "Security",
            status: "Update Required",
            version: "3.1",
            lastUpdated: "2024-09-05T14:45:00Z",
            nextReviewDate: "2025-03-15T00:00:00Z",
            owner: "Security Team",
            documentUrl: "/documents/information-security-policy-v3.1.pdf",
            isRequired: true,
            frameworks: ["ISO 27001", "SOC 2", "NIST CSF"],
            acknowledgementRate: 88
          },
          {
            id: "pol-003",
            name: "Acceptable Use Policy",
            description: "Guidelines for appropriate use of company systems, data, and network resources.",
            category: "IT",
            status: "Active",
            version: "2.0",
            lastUpdated: "2025-02-10T09:15:00Z",
            nextReviewDate: "2025-08-10T00:00:00Z",
            owner: "IT Department",
            documentUrl: "/documents/acceptable-use-policy-v2.0.pdf",
            isRequired: true,
            frameworks: ["ISO 27001", "SOC 2"],
            acknowledgementRate: 95
          },
          {
            id: "pol-004",
            name: "Third-Party Risk Management Policy",
            description: "Framework and procedures for assessing, monitoring, and managing risks associated with third-party vendors and service providers.",
            category: "Risk Management",
            status: "Active",
            version: "1.4",
            lastUpdated: "2025-01-20T16:30:00Z",
            nextReviewDate: "2025-07-20T00:00:00Z",
            owner: "Procurement",
            documentUrl: "/documents/vendor-risk-management-policy-v1.4.pdf",
            isRequired: true,
            frameworks: ["ISO 27001", "SOC 2"],
            acknowledgementRate: 89
          },
          {
            id: "pol-005",
            name: "AI Ethics and Governance Policy",
            description: "Guidelines for ethical development, deployment, and use of artificial intelligence systems.",
            category: "AI Governance",
            status: "Review",
            version: "1.0",
            lastUpdated: "2025-02-28T11:45:00Z",
            nextReviewDate: "2025-03-30T00:00:00Z",
            owner: "AI Ethics Committee",
            documentUrl: "/documents/ai-ethics-policy-v1.0.pdf",
            isRequired: false,
            frameworks: ["EU AI Act", "NIST AI RMF"],
            acknowledgementRate: 67
          },
          {
            id: "pol-006",
            name: "Incident Response Plan",
            description: "Procedures and guidelines for detecting, reporting, and responding to security incidents and data breaches.",
            category: "Security",
            status: "Active",
            version: "2.2",
            lastUpdated: "2024-12-05T08:30:00Z",
            nextReviewDate: "2025-06-05T00:00:00Z",
            owner: "Security Team",
            documentUrl: "/documents/incident-response-plan-v2.2.pdf",
            isRequired: true,
            frameworks: ["ISO 27001", "SOC 2", "GDPR", "NIST CSF"],
            acknowledgementRate: 91
          },
          {
            id: "pol-007",
            name: "Business Continuity Plan",
            description: "Strategies and procedures to ensure critical business functions continue during and after a disaster or disruption.",
            category: "Business Continuity",
            status: "Update Required",
            version: "1.8",
            lastUpdated: "2024-08-15T10:00:00Z",
            nextReviewDate: "2025-02-15T00:00:00Z",
            owner: "Operations Team",
            documentUrl: "/documents/business-continuity-plan-v1.8.pdf",
            isRequired: true,
            frameworks: ["ISO 22301", "SOC 2"],
            acknowledgementRate: 82
          },
          {
            id: "pol-008",
            name: "Code of Conduct",
            description: "Standards of ethical behavior expected from all employees and contractors.",
            category: "Ethics",
            status: "Active",
            version: "3.0",
            lastUpdated: "2025-02-01T13:20:00Z",
            nextReviewDate: "2026-02-01T00:00:00Z",
            owner: "HR Department",
            documentUrl: "/documents/code-of-conduct-v3.0.pdf",
            isRequired: true,
            frameworks: ["SOC 2"],
            acknowledgementRate: 98
          },
          {
            id: "pol-009",
            name: "Remote Work Security Policy",
            description: "Security guidelines and requirements for employees working remotely.",
            category: "Security",
            status: "Draft",
            version: "0.9",
            lastUpdated: "2025-03-01T15:40:00Z",
            nextReviewDate: "2025-04-01T00:00:00Z",
            owner: "IT Department",
            isRequired: false
          },
          {
            id: "pol-010",
            name: "Data Retention Policy",
            description: "Guidelines for retaining and disposing of company data in accordance with legal and regulatory requirements.",
            category: "Data Privacy",
            status: "Review",
            version: "1.5",
            lastUpdated: "2025-02-25T11:10:00Z",
            nextReviewDate: "2025-03-25T00:00:00Z",
            owner: "Legal Department",
            documentUrl: "/documents/data-retention-policy-v1.5-draft.pdf",
            isRequired: true,
            frameworks: ["GDPR", "CCPA", "ISO 27001"],
            acknowledgementRate: 72
          },
          {
            id: "pol-011",
            name: "Change Management Policy",
            description: "Procedures for requesting, approving, and implementing changes to IT systems and infrastructure.",
            category: "IT",
            status: "Active",
            version: "2.1",
            lastUpdated: "2024-11-10T09:30:00Z",
            nextReviewDate: "2025-05-10T00:00:00Z",
            owner: "IT Department",
            documentUrl: "/documents/change-management-policy-v2.1.pdf",
            isRequired: true,
            frameworks: ["ISO 27001", "SOC 2", "ITIL"],
            acknowledgementRate: 90
          },
          {
            id: "pol-012",
            name: "Clean Desk Policy",
            description: "Guidelines for maintaining a clean desk to protect sensitive information and maintain a professional appearance.",
            category: "Security",
            status: "Draft",
            version: "1.0",
            lastUpdated: "2025-03-03T14:15:00Z",
            nextReviewDate: "2025-04-03T00:00:00Z",
            owner: "Facilities Management",
            isRequired: false
          }
        ];
        
        // Extract all unique categories
        const categories = [...new Set(mockPolicies.map(policy => policy.category))];
        
        // Calculate stats
        const stats: PolicyStats = {
          total: mockPolicies.length,
          active: mockPolicies.filter(policy => policy.status === 'Active').length,
          draft: mockPolicies.filter(policy => policy.status === 'Draft').length,
          review: mockPolicies.filter(policy => policy.status === 'Review').length,
          updateRequired: mockPolicies.filter(policy => policy.status === 'Update Required').length
        };
        
        setData({
          policies: mockPolicies,
          stats,
          categories
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch policy data'));
        console.error('Error fetching policy data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
