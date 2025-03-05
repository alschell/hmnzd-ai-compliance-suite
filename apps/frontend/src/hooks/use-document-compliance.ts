import { useState, useEffect } from 'react';

interface DocumentOwner {
  id: string;
  name: string;
  role?: string;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Rejected';
  lastUpdated: string;
  createdAt: string;
  expiryDate?: string;
  framework?: string;
  owners?: DocumentOwner[];
  version: string;
  documentUrl?: string;
  requiredBy?: string[];
}

interface DocumentComplianceData {
  documents: ComplianceDocument[];
  completedDocuments: number;
  requiredDocuments: number;
  completionPercentage: number;
}

export function useDocumentCompliance() {
  const [data, setData] = useState<DocumentComplianceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchDocumentCompliance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 900));
        
        // Mock data
        const mockDocuments: ComplianceDocument[] = [
          {
            id: "doc-001",
            title: "Data Protection Policy",
            description: "Comprehensive policy outlining how the organization protects personal data and complies with privacy regulations.",
            category: "Policy",
            status: "Approved",
            lastUpdated: "2025-01-10T14:30:00Z",
            createdAt: "2024-04-15T09:00:00Z",
            expiryDate: "2026-01-10T00:00:00Z",
            framework: "GDPR",
            owners: [
              {
                id: "user-002",
                name: "Jordan Lee",
                role: "Privacy Officer"
              }
            ],
            version: "2.3",
            documentUrl: "/documents/data-protection-policy-v2.3.pdf",
            requiredBy: ["GDPR", "CCPA", "ISO 27001"]
          },
          {
            id: "doc-002",
            title: "Incident Response Plan",
            description: "Procedures for identifying, responding to, and recovering from cybersecurity incidents and data breaches.",
            category: "Procedure",
            status: "Approved",
            lastUpdated: "2024-11-05T16:45:00Z",
            createdAt: "2023-09-20T11:30:00Z",
            expiryDate: "2025-11-05T00:00:00Z",
            framework: "SOC 2",
            owners: [
              {
                id: "user-007",
                name: "Morgan Smith",
                role: "Security Director"
              }
            ],
            version: "3.1",
            documentUrl: "/documents/incident-response-plan-v3.1.pdf",
            requiredBy: ["SOC 2", "ISO 27001", "NIST CSF"]
          },
          {
            id: "doc-003",
            title: "AI Risk Assessment Template",
            description: "Template for evaluating and documenting risks associated with AI systems according to EU AI Act requirements.",
            category: "Template",
            status: "Draft",
            lastUpdated: "2025-02-28T09:15:00Z",
            createdAt: "2025-02-15T13:00:00Z",
            framework: "EU AI Act",
            owners: [
              {
                id: "user-001",
                name: "Alex Schell",
                role: "Compliance Manager"
              },
              {
                id: "user-005",
                name: "Blake Chen",
                role: "AI Ethics Lead"
              }
            ],
            version: "0.8",
            requiredBy: ["EU AI Act", "Internal AI Policy"]
          },
          {
            id: "doc-004",
            title: "Annual Security Assessment Report",
            description: "Results of the most recent annual security assessment including findings, recommendations, and remediation plans.",
            category: "Report",
            status: "Approved",
            lastUpdated: "2024-12-15T11:20:00Z",
            createdAt: "2024-11-01T09:45:00Z",
            expiryDate: "2025-12-15T00:00:00Z",
            framework: "ISO 27001",
            owners: [
              {
                id: "user-007",
                name: "Morgan Smith",
                role: "Security Director"
              }
            ],
            version: "1.0",
            documentUrl: "/documents/security-assessment-report-2024.pdf",
            requiredBy: ["SOC 2", "ISO 27001"]
          },
          {
            id: "doc-005",
            title: "Data Subject Rights Procedure",
            description: "Step-by-step process for handling data subject requests including access, correction, deletion, and portability.",
            category: "Procedure",
            status: "Review",
            lastUpdated: "2025-03-02T14:10:00Z",
            createdAt: "2024-06-10T08:30:00Z",
            expiryDate: "2025-06-10T00:00:00Z",
            framework: "GDPR",
            owners: [
              {
                id: "user-002",
                name: "Jordan Lee",
                role: "Privacy Officer"
              }
            ],
            version: "2.1",
            documentUrl: "/documents/dsar-procedure-v2.1-draft.pdf",
            requiredBy: ["GDPR", "CCPA"]
          },
          {
            id: "doc-006",
            title: "Vendor Security Assessment Questionnaire",
            description: "Form used to evaluate third-party vendors' security and compliance controls before engagement.",
            category: "Form",
            status: "Approved",
            lastUpdated: "2024-08-20T10:15:00Z",
            createdAt: "2023-05-12T15:30:00Z",
            expiryDate: "2025-02-20T00:00:00Z", // Recently expired
            framework: "Vendor Management",
            owners: [
              {
                id: "user-008",
                name: "Casey Taylor",
                role: "Procurement Manager"
              }
            ],
            version: "1.5",
            documentUrl: "/documents/vendor-security-questionnaire-v1.5.pdf",
            requiredBy: ["SOC 2", "ISO 27001", "Internal Policy"]
          },
          {
            id: "doc-007",
            title: "Business Continuity Plan",
            description: "Plan detailing how the organization will maintain operations during and after a disruption or disaster.",
            category: "Plan",
            status: "Approved",
            lastUpdated: "2024-09-30T13:45:00Z",
            createdAt: "2023-10-15T09:00:00Z",
            expiryDate: "2025-04-01T00:00:00Z", // Expiring soon
            framework: "ISO 22301",
            owners: [
              {
                id: "user-009",
                name: "Robin Patel",
                role: "Operations Director"
              }
            ],
            version: "2.2",
            documentUrl: "/documents/business-continuity-plan-v2.2.pdf",
            requiredBy: ["SOC 2", "ISO 27001", "ISO 22301"]
          },
          {
            id: "doc-008",
            title: "Information Classification Policy",
            description: "Policy defining how information assets should be classified and handled based on sensitivity.",
            category: "Policy",
            status: "Rejected",
            lastUpdated: "2025-02-10T11:30:00Z",
            createdAt: "2024-12-05T14:15:00Z",
            framework: "ISO 27001",
            owners: [
              {
                id: "user-010",
                name: "Sam Williams",
                role: "Information Security Analyst"
              }
            ],
            version: "1.2",
            documentUrl: "/documents/info-classification-policy-v1.2-rejected.pdf",
            requiredBy: ["ISO 27001", "SOC 2"]
          }
        ];

        // Calculate stats
        const requiredDocuments = 15; // Total number of required documents for compliance
        const completedDocuments = mockDocuments.filter(doc => 
          doc.status === 'Approved' && (!doc.expiryDate || new Date(doc.expiryDate) > new Date("2025-03-05T07:38:25Z"))
        ).length;
        const completionPercentage = Math.round((completedDocuments / requiredDocuments) * 100);

        setData({
          documents: mockDocuments,
          completedDocuments,
          requiredDocuments,
          completionPercentage
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch document compliance data'));
        console.error('Error fetching document compliance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentCompliance();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
