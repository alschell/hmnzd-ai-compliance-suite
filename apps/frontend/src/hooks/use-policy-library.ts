import { useState, useEffect } from 'react';

export interface PolicyDocument {
  id: string;
  title: string;
  description?: string;
  type: 'Policy' | 'Procedure' | 'Standard' | 'Guideline' | 'Evidence';
  category: string;
  version?: string;
  lastUpdated: string;
  updatedBy?: string;
  approvalDate?: string;
  approvedBy?: string;
  owner?: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
  frameworks?: string[];
  complianceStatus?: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not-Applicable';
  referenceCount?: number;
  relatedControls?: {
    id: string;
    name: string;
    framework: string;
  }[];
}

interface PolicyTemplate {
  id: string;
  title: string;
  description?: string;
  type: string;
  format: string;
  url: string;
}

interface EvidenceFolder {
  id: string;
  name: string;
  description?: string;
  fileCount: number;
  lastUpdated: string;
  frameworkMapping?: Record<string, string[]>;
}

interface PolicyLibraryStats {
  totalDocuments: number;
  policies: number;
  procedures: number;
  standards: number;
  guidelines: number;
  mappedControls: number;
  controlCoverage: number;
  frameworkCoverage: number;
  recentlyAdded: number;
}

interface PolicyLibraryData {
  documents: PolicyDocument[];
  templates: PolicyTemplate[];
  evidenceFolders: EvidenceFolder[];
  stats: PolicyLibraryStats;
  frameworks: string[];
  categories: string[];
}

export function usePolicyLibrary() {
  const [data, setData] = useState<PolicyLibraryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T12:05:17Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchLibraryData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock documents
        const mockDocuments: PolicyDocument[] = [
          {
            id: "DOC-001",
            title: "Information Security Policy",
            description: "Master policy outlining security controls and practices to protect company information assets.",
            type: "Policy",
            category: "Security",
            version: "3.0",
            lastUpdated: "2025-01-20T11:30:00Z",
            updatedBy: "CISO",
            approvalDate: "2025-01-25T00:00:00Z",
            approvedBy: "Executive Committee",
            owner: "CISO Office",
            url: "/documents/policies/info-security-policy-v3.0.pdf",
            fileType: "PDF",
            fileSize: 2450000,
            frameworks: ["ISO 27001", "NIST CSF", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 24,
            relatedControls: [
              { id: "ISO-A.5.1", name: "Information Security Policies", framework: "ISO 27001" },
              { id: "SOC2-CC1.1", name: "Information Security Policy", framework: "SOC 2" }
            ]
          },
          {
            id: "DOC-002",
            title: "Data Privacy Policy",
            description: "Policy establishing guidelines for the collection, storage, and processing of personal data in compliance with privacy regulations.",
            type: "Policy",
            category: "Privacy",
            version: "2.1",
            lastUpdated: "2025-02-10T14:45:00Z",
            updatedBy: "Privacy Officer",
            approvalDate: "2025-02-15T00:00:00Z",
            approvedBy: "Legal Department",
            owner: "Privacy Office",
            url: "/documents/policies/data-privacy-policy-v2.1.pdf",
            fileType: "PDF",
            fileSize: 1850000,
            frameworks: ["GDPR", "CCPA", "ISO 27701"],
            complianceStatus: "Compliant",
            referenceCount: 18,
            relatedControls: [
              { id: "GDPR-Art.5", name: "Principles relating to processing of personal data", framework: "GDPR" },
              { id: "ISO-A.18.1.4", name: "Privacy and protection of PII", framework: "ISO 27001" }
            ]
          },
          {
            id: "DOC-003",
            title: "Incident Response Procedure",
            description: "Detailed procedures for identifying, responding to, mitigating, and reporting security incidents.",
            type: "Procedure",
            category: "Security",
            version: "2.0",
            lastUpdated: "2025-02-28T13:45:00Z",
            updatedBy: "Incident Response Lead",
            owner: "Security Team",
            url: "/documents/procedures/incident-response-procedure-v2.0.pdf",
            fileType: "PDF",
            fileSize: 3250000,
            frameworks: ["ISO 27001", "NIST CSF", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 12,
            relatedControls: [
              { id: "ISO-A.16.1", name: "Management of information security incidents", framework: "ISO 27001" },
              { id: "NIST-DE.CM", name: "Detection Processes", framework: "NIST CSF" }
            ]
          },
          {
            id: "DOC-004",
            title: "Data Retention Schedule",
            description: "Schedule for retaining and disposing of data in accordance with legal, regulatory, and business requirements.",
            type: "Standard",
            category: "Privacy",
            version: "1.3",
            lastUpdated: "2025-03-01T10:20:00Z",
            updatedBy: "Compliance Manager",
            approvalDate: "2025-03-05T00:00:00Z",
            approvedBy: "Legal Department",
            owner: "Privacy Office",
            url: "/documents/standards/data-retention-schedule-v1.3.pdf",
            fileType: "PDF",
            fileSize: 1250000,
            frameworks: ["GDPR", "CCPA", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 10
          },
          {
            id: "DOC-005",
            title: "Access Control Standard",
            description: "Standard for controlling access to company systems and data based on least privilege principles.",
            type: "Standard",
            category: "Security",
            version: "1.5",
            lastUpdated: "2025-02-05T11:15:00Z",
            updatedBy: "Security Manager",
            approvalDate: "2025-02-10T00:00:00Z",
            approvedBy: "CISO",
            owner: "Security Team",
            url: "/documents/standards/access-control-standard-v1.5.pdf",
            fileType: "PDF",
            fileSize: 1650000,
            frameworks: ["ISO 27001", "SOC 2", "PCI DSS"],
            complianceStatus: "Partial",
            referenceCount: 15
          },
          {
            id: "DOC-006",
            title: "Password Guidelines",
            description: "Guidelines for creating and managing strong passwords across company systems.",
            type: "Guideline",
            category: "Security",
            version: "2.1",
            lastUpdated: "2025-02-25T13:15:00Z",
            updatedBy: "Security Manager",
            owner: "Security Team",
            url: "/documents/guidelines/password-guidelines-v2.1.pdf",
            fileType: "PDF",
            fileSize: 950000,
            frameworks: ["NIST SP 800-63B", "ISO 27001", "SOC 2"],
            complianceStatus: "Partial",
            referenceCount: 9
          },
          {
            id: "DOC-007",
            title: "Business Continuity Plan",
            description: "Comprehensive plan to ensure business continuity during and after disruptive incidents.",
            type: "Policy",
            category: "Operations",
            version: "2.0",
            lastUpdated: "2025-01-30T14:45:00Z",
            updatedBy: "Business Continuity Manager",
            approvalDate: "2025-02-05T00:00:00Z",
            approvedBy: "Executive Committee",
            owner: "Operations Team",
            url: "/documents/policies/business-continuity-plan-v2.0.pdf",
            fileType: "PDF",
            fileSize: 4250000,
            frameworks: ["ISO 22301", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 8
          },
          {
            id: "DOC-008",
            title: "Third-Party Risk Assessment Procedure",
            description: "Procedure for assessing and managing risks associated with third-party vendors and service providers.",
            type: "Procedure",
            category: "Risk",
            version: "1.1",
            lastUpdated: "2024-12-10T11:30:00Z",
            updatedBy: "Risk Manager",
            approvalDate: "2024-12-15T00:00:00Z",
            approvedBy: "CFO",
            owner: "Risk Management",
            url: "/documents/procedures/third-party-risk-procedure-v1.1.pdf",
            fileType: "PDF",
            fileSize: 1750000,
            frameworks: ["ISO 27001", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 7
          },
          {
            id: "DOC-009",
            title: "AI Ethics Guidelines",
            description: "Guidelines for ethical development, deployment, and use of artificial intelligence systems.",
            type: "Guideline",
            category: "AI Governance",
            version: "0.9",
            lastUpdated: "2025-03-02T15:30:00Z",
            updatedBy: "AI Ethics Officer",
            owner: "AI Ethics Committee",
            url: "/documents/guidelines/ai-ethics-guidelines-v0.9.pdf",
            fileType: "PDF",
            fileSize: 2100000,
            frameworks: ["EU AI Act"],
            complianceStatus: "Partial",
            referenceCount: 5
          },
          {
            id: "DOC-010",
            title: "Data Subject Rights Procedure",
            description: "Procedures for handling data subject requests in compliance with privacy regulations.",
            type: "Procedure",
            category: "Privacy",
            version: "1.2",
            lastUpdated: "2025-03-01T11:45:00Z",
            updatedBy: "Privacy Officer",
            owner: "Privacy Office",
            url: "/documents/procedures/dsr-procedure-v1.2.pdf",
            fileType: "PDF",
            fileSize: 1450000,
            frameworks: ["GDPR", "CCPA"],
            complianceStatus: "Compliant",
            referenceCount: 6
          },
          {
            id: "DOC-011",
            title: "Clean Desk Standard",
            description: "Standard to ensure sensitive information is properly secured when workstations are unattended.",
            type: "Standard",
            category: "Security",
            version: "1.0",
            lastUpdated: "2025-01-10T09:30:00Z",
            updatedBy: "Security Manager",
            approvalDate: "2025-01-15T00:00:00Z",
            approvedBy: "CISO",
            owner: "Facilities",
            url: "/documents/standards/clean-desk-standard-v1.0.pdf",
            fileType: "PDF",
            fileSize: 850000,
            frameworks: ["ISO 27001", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 3
          },
          {
            id: "DOC-012",
            title: "Data Classification Guidelines",
            description: "Guidelines for classifying data based on sensitivity and criticality.",
            type: "Guideline",
            category: "Information Management",
            version: "1.2",
            lastUpdated: "2025-01-05T13:20:00Z",
            updatedBy: "Information Security",
            approvalDate: "2025-01-10T00:00:00Z",
            approvedBy: "CISO",
            owner: "Information Security",
            url: "/documents/guidelines/data-classification-v1.2.pdf",
            fileType: "PDF",
            fileSize: 1050000,
            frameworks: ["ISO 27001", "NIST CSF", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 11
          },
          {
            id: "DOC-013",
            title: "Cloud Security Standard",
            description: "Security requirements for cloud services and applications.",
            type: "Standard",
            category: "Security",
            version: "1.0",
            lastUpdated: "2024-09-15T10:45:00Z",
            updatedBy: "Cloud Security Lead",
            approvalDate: "2024-09-20T00:00:00Z",
            approvedBy: "CISO",
            owner: "Cloud Security Team",
            url: "/documents/standards/cloud-security-standard-v1.0.pdf",
            fileType: "PDF",
            fileSize: 1850000,
            frameworks: ["ISO 27001", "CSA CCM", "SOC 2"],
            complianceStatus: "Non-Compliant",
            referenceCount: 8
          },
          {
            id: "DOC-014",
            title: "Vulnerability Management Procedure",
            description: "Procedures for identifying, assessing, and remediation of security vulnerabilities.",
            type: "Procedure",
            category: "Security",
            version: "2.3",
            lastUpdated: "2025-02-15T09:20:00Z",
            updatedBy: "Security Operations Manager",
            approvalDate: "2025-02-20T00:00:00Z",
            approvedBy: "CISO",
            owner: "Security Team",
            url: "/documents/procedures/vulnerability-management-v2.3.pdf",
            fileType: "PDF",
            fileSize: 2200000,
            frameworks: ["ISO 27001", "NIST CSF", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 9
          },
          {
            id: "DOC-015",
            title: "Employee Security Handbook",
            description: "Security guidelines and best practices for all employees.",
            type: "Guideline",
            category: "Security",
            version: "3.1",
            lastUpdated: "2025-01-25T11:30:00Z",
            updatedBy: "Security Awareness Manager",
            approvalDate: "2025-02-01T00:00:00Z",
            approvedBy: "HR Director",
            owner: "Security Team",
            url: "/documents/guidelines/security-handbook-v3.1.pdf",
            fileType: "PDF",
            fileSize: 3500000,
            frameworks: ["ISO 27001", "SOC 2"],
            complianceStatus: "Compliant",
            referenceCount: 10
          }
        ];
        
        // Mock templates
        const mockTemplates: PolicyTemplate[] = [
          {
            id: "TPL-001",
            title: "Policy Template",
            description: "Standard template for creating organizational policies.",
            type: "Policy",
            format: "DOCX",
            url: "/templates/policy-template.docx"
          },
          {
            id: "TPL-002",
            title: "Procedure Template",
            description: "Standard template for creating procedural documents.",
            type: "Procedure",
            format: "DOCX",
            url: "/templates/procedure-template.docx"
          },
          {
            id: "TPL-003",
            title: "Risk Assessment Template",
            description: "Template for conducting risk assessments.",
            type: "Assessment",
            format: "XLSX",
            url: "/templates/risk-assessment-template.xlsx"
          },
          {
            id: "TPL-004",
            title: "Data Processing Agreement",
            description: "Template for agreements with data processors.",
            type: "Legal",
            format: "DOCX",
            url: "/templates/dpa-template.docx"
          },
          {
            id: "TPL-005",
            title: "Incident Response Form",
            description: "Form for documenting security incidents.",
            type: "Form",
            format: "DOCX",
            url: "/templates/incident-response-form.docx"
          },
          {
            id: "TPL-006",
            title: "DPIA Template",
            description: "Template for Data Protection Impact Assessments.",
            type: "Assessment",
            format: "DOCX",
            url: "/templates/dpia-template.docx"
          }
        ];
        
        // Mock evidence folders
        const mockEvidenceFolders: EvidenceFolder[] = [
          {
            id: "EVI-001",
            name: "SOC 2 Audit Evidence",
            description: "Evidence collected for annual SOC 2 audit.",
            fileCount: 45,
            lastUpdated: "2025-02-28T16:20:00Z",
            frameworkMapping: {
              "SOC 2": ["CC1.1", "CC2.1", "CC3.2", "CC4.1", "CC5.1"]
            }
          },
          {
            id: "EVI-002",
            name: "ISO 27001 Evidence",
            description: "Evidence for ISO 27001 certification.",
            fileCount: 78,
            lastUpdated: "2025-03-01T14:30:00Z",
            frameworkMapping: {
              "ISO 27001": ["A.5", "A.6", "A.7", "A.8", "A.9", "A.10"]
            }
          },
          {
            id: "EVI-003",
            name: "GDPR Compliance Evidence",
            description: "Documentation supporting GDPR compliance.",
            fileCount: 32,
            lastUpdated: "2025-02-20T11:15:00Z",
            frameworkMapping: {
              "GDPR": ["Art.5", "Art.6", "Art.12", "Art.13", "Art.30"]
            }
          },
          {
            id: "EVI-004",
            name: "Security Training Records",
            description: "Records of security awareness training completion.",
            fileCount: 25,
            lastUpdated: "2025-03-04T09:45:00Z"
          },
          {
            id: "EVI-005",
            name: "Vendor Assessments",
            description: "Security and privacy assessments of third-party vendors.",
            fileCount: 18,
            lastUpdated: "2025-02-15T13:20:00Z"
          },
          {
            id: "EVI-006",
            name: "Access Review Records",
            description: "Documentation of periodic access reviews.",
            fileCount: 12,
            lastUpdated: "2025-02-10T10:30:00Z",
            frameworkMapping: {
              "SOC 2": ["CC6.1", "CC6.2", "CC6.3"],
              "ISO 27001": ["A.9.2.5", "A.9.2.6"]
            }
          }
        ];
        
        // Extract unique frameworks and categories
        const frameworks = Array.from(new Set(
          mockDocuments.flatMap(doc => doc.frameworks || [])
        ));
        
        const categories = Array.from(new Set(
          mockDocuments.map(doc => doc.category)
        ));
        
        // Calculate stats
        const totalDocuments = mockDocuments.length;
        
        const policies = mockDocuments.filter(doc => doc.type === 'Policy').length;
        const procedures = mockDocuments.filter(doc => doc.type === 'Procedure').length;
        const standards = mockDocuments.filter(doc => doc.type === 'Standard').length;
        const guidelines = mockDocuments.filter(doc => doc.type === 'Guideline').length;
        
        // Count mapped controls (using the related controls)
        const mappedControls = mockDocuments.reduce((count, doc) => 
          count + (doc.relatedControls?.length || 0), 0);
        
        // Calculate control coverage percentage (mock value)
        const controlCoverage = 82;
        
        // Calculate framework coverage percentage (mock value)
        const frameworkCoverage = 78;
        
        // Count recently added (in the last 30 days)
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentlyAdded = mockDocuments.filter(doc => 
          new Date(doc.lastUpdated) >= thirtyDaysAgo
        ).length;
        
        // Compile stats
        const stats: PolicyLibraryStats = {
          totalDocuments,
          policies,
          procedures,
          standards,
          guidelines,
          mappedControls,
          controlCoverage,
          frameworkCoverage,
          recentlyAdded
        };
        
        setData({
          documents: mockDocuments,
          templates: mockTemplates,
          evidenceFolders: mockEvidenceFolders,
          stats,
          frameworks,
          categories
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch policy library data'));
        console.error('Error fetching policy library data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
