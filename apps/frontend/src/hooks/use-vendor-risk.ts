import { useState, useEffect } from 'react';

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScores?: {
    security: number;
    privacy: number;
    compliance: number;
    overall?: number;
  };
  dataAccessed?: string[];
  lastAssessmentDate?: string;
  nextAssessment?: string;
  contract?: {
    startDate: string;
    endDate: string;
    value?: number;
    auto_renewal: boolean;
  };
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  openIssues?: number;
  status: 'Active' | 'Pending' | 'Terminated' | 'Under Review';
}

export interface VendorAssessment {
  id: string;
  type: string;
  vendorId: string;
  vendorName: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'In Progress' | 'Expired';
  dueDate: string;
  completionDate?: string;
  nextDueDate?: string;
  assessor: string;
  scope?: string;
  issues?: number;
  highRiskIssues?: number;
  remediatedIssues?: number;
  controlsAssessed?: number;
  method?: string;
  riskLevel?: 'Critical' | 'High' | 'Medium' | 'Low';
  progress?: number;
  reportUrl?: string;
}

export interface VendorIssue {
  id: string;
  title: string;
  description?: string;
  vendorId: string;
  vendorName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'In Progress' | 'Remediated' | 'Accepted';
  identifiedDate: string;
  dueDate?: string;
  closedDate?: string;
  owner: string;
  category?: string;
  remediationPlan?: string;
  remediationProgress?: number;
  assessmentId: string;
}

interface VendorRiskStats {
  totalVendors: number;
  activeVendors: number;
  highRiskVendors: number;
  criticalRiskVendors: number;
  assessmentsDue: number;
  overdueAssessments: number;
  openIssues: number;
  highSeverityIssues: number;
}

interface VendorRiskData {
  vendors: Vendor[];
  assessments: VendorAssessment[];
  issues: VendorIssue[];
  stats: VendorRiskStats;
  categories: string[];
}

export function useVendorRisk() {
  const [data, setData] = useState<VendorRiskData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T12:37:46Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchVendorRiskData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock vendors
        const mockVendors: Vendor[] = [
          {
            id: "VEN-001",
            name: "CloudSoft Technologies",
            description: "Cloud infrastructure and platform provider for critical workloads.",
            category: "Infrastructure",
            riskLevel: "High",
            riskScores: {
              security: 65,
              privacy: 72,
              compliance: 68,
              overall: 68
            },
            dataAccessed: ["PII", "Infrastructure Config"],
            lastAssessmentDate: "2025-01-15T00:00:00Z",
            nextAssessment: "2025-07-15T00:00:00Z",
            contract: {
              startDate: "2024-03-01T00:00:00Z",
              endDate: "2026-03-01T00:00:00Z",
              value: 250000,
              auto_renewal: true
            },
            contactInfo: {
              name: "Sarah Johnson",
              email: "sjohnson@cloudsoft.example.com",
              phone: "+1 (555) 123-4567"
            },
            openIssues: 3,
            status: "Active"
          },
          {
            id: "VEN-002",
            name: "SecureData Analytics",
            description: "Data processing and analytics platform with AI/ML capabilities.",
            category: "Data Processing",
            riskLevel: "Critical",
            riskScores: {
              security: 45,
              privacy: 38,
              compliance: 52,
              overall: 45
            },
            dataAccessed: ["PII", "Financial Data", "Health Information"],
            lastAssessmentDate: "2025-02-10T00:00:00Z",
            nextAssessment: "2025-05-10T00:00:00Z",
            contract: {
              startDate: "2024-01-15T00:00:00Z",
              endDate: "2025-07-15T00:00:00Z",
              value: 180000,
              auto_renewal: false
            },
            contactInfo: {
              name: "Michael Chen",
              email: "mchen@securedata.example.com",
              phone: "+1 (555) 234-5678"
            },
            openIssues: 5,
            status: "Under Review"
          },
          {
            id: "VEN-003",
            name: "PaymentFlow Systems",
            description: "Payment processing and financial transaction management.",
            category: "Financial",
            riskLevel: "Medium",
            riskScores: {
              security: 78,
              privacy: 75,
              compliance: 85,
              overall: 79
            },
            dataAccessed: ["Financial Data", "Payment Card Information"],
            lastAssessmentDate: "2024-11-20T00:00:00Z",
            nextAssessment: "2025-05-20T00:00:00Z",
            contract: {
              startDate: "2024-06-01T00:00:00Z",
              endDate: "2026-06-01T00:00:00Z",
              value: 125000,
              auto_renewal: true
            },
            contactInfo: {
              name: "Patricia Rodriguez",
              email: "prodriguez@paymentflow.example.com",
              phone: "+1 (555) 345-6789"
            },
            openIssues: 1,
            status: "Active"
          },
          {
            id: "VEN-004",
            name: "CustCRM Pro",
            description: "Enterprise customer relationship management platform.",
            category: "SaaS",
            riskLevel: "Medium",
            riskScores: {
              security: 72,
              privacy: 65,
              compliance: 70,
              overall: 69
            },
            dataAccessed: ["PII", "Customer Data"],
            lastAssessmentDate: "2024-12-05T00:00:00Z",
            nextAssessment: "2025-06-05T00:00:00Z",
            contract: {
              startDate: "2023-09-15T00:00:00Z",
              endDate: "2025-09-15T00:00:00Z",
              value: 95000,
              auto_renewal: true
            },
            contactInfo: {
              name: "David Williams",
              email: "dwilliams@custcrm.example.com",
              phone: "+1 (555) 456-7890"
            },
            openIssues: 2,
            status: "Active"
          },
          {
            id: "VEN-005",
            name: "TalentHub HR",
            description: "Human resources management and payroll processing system.",
            category: "HR",
            riskLevel: "High",
            riskScores: {
              security: 58,
              privacy: 62,
              compliance: 75,
              overall: 65
            },
            dataAccessed: ["PII", "Financial Data", "Employee Records"],
            lastAssessmentDate: "2025-01-25T00:00:00Z",
            nextAssessment: "2025-04-25T00:00:00Z",
            contract: {
              startDate: "2024-02-01T00:00:00Z",
              endDate: "2026-02-01T00:00:00Z",
              value: 110000,
              auto_renewal: false
            },
            contactInfo: {
              name: "Emily Thompson",
              email: "ethompson@talenthub.example.com",
              phone: "+1 (555) 567-8901"
            },
            openIssues: 3,
            status: "Active"
          },
          {
            id: "VEN-006",
            name: "MarketSync Ads",
            description: "Digital marketing and advertising platform.",
            category: "Marketing",
            riskLevel: "Medium",
            riskScores: {
              security: 70,
              privacy: 68,
              compliance: 75,
              overall: 71
            },
            dataAccessed: ["PII", "Customer Data", "Behavioral Data"],
            lastAssessmentDate: "2024-10-15T00:00:00Z",
            nextAssessment: "2025-04-15T00:00:00Z",
            contract: {
              startDate: "2024-05-01T00:00:00Z",
              endDate: "2026-05-01T00:00:00Z",
              value: 85000,
              auto_renewal: true
            },
            contactInfo: {
              name: "James Anderson",
              email: "janderson@marketsync.example.com",
              phone: "+1 (555) 678-9012"
            },
            openIssues: 0,
            status: "Active"
          },
          {
            id: "VEN-007",
            name: "SecureVault Backup",
            description: "Enterprise backup and disaster recovery solution.",
            category: "Infrastructure",
            riskLevel: "Low",
            riskScores: {
              security: 88,
              privacy: 85,
              compliance: 90,
              overall: 88
            },
            dataAccessed: ["System Backups", "Infrastructure Config"],
            lastAssessmentDate: "2025-02-20T00:00:00Z",
            nextAssessment: "2025-08-20T00:00:00Z",
            contract: {
              startDate: "2024-01-01T00:00:00Z",
              endDate: "2025-12-31T00:00:00Z",
              value: 75000,
              auto_renewal: true
            },
            contactInfo: {
              name: "Robert Kim",
              email: "rkim@securevault.example.com",
              phone: "+1 (555) 789-0123"
            },
            openIssues: 0,
            status: "Active"
          },
          {
            id: "VEN-008",
            name: "GlobalTranslate AI",
            description: "AI-powered translation and localization services.",
            category: "AI Services",
            riskLevel: "Medium",
            riskScores: {
              security: 72,
              privacy: 70,
              compliance: 68,
              overall: 70
            },
            dataAccessed: ["Content Data", "Customer Data"],
            lastAssessmentDate: "2025-03-01T00:00:00Z",
            nextAssessment: "2025-09-01T00:00:00Z",
            contract: {
              startDate: "2024-01-15T00:00:00Z",
              endDate: "2025-01-15T00:00:00Z",
              value: 60000,
              auto_renewal: false
            },
            contactInfo: {
              name: "Sophia Martinez",
              email: "smartinez@globaltranslate.example.com",
              phone: "+1 (555) 890-1234"
            },
            openIssues: 1,
            status: "Active"
          },
          {
            id: "VEN-009",
            name: "CloudGuard Security",
            description: "Cloud security and threat monitoring service.",
            category: "Security",
            riskLevel: "Low",
            riskScores: {
              security: 92,
              privacy: 88,
              compliance: 90,
              overall: 90
            },
            dataAccessed: ["Security Logs", "Infrastructure Config"],
            lastAssessmentDate: "2025-02-15T00:00:00Z",
            nextAssessment: "2025-08-15T00:00:00Z",
            contract: {
              startDate: "2024-02-01T00:00:00Z",
              endDate: "2026-02-01T00:00:00Z",
              value: 150000,
              auto_renewal: true
            },
            contactInfo: {
              name: "Thomas Wilson",
              email: "twilson@cloudguard.example.com",
              phone: "+1 (555) 901-2345"
            },
            openIssues: 0,
            status: "Active"
          },
          {
            id: "VEN-010",
            name: "HealthTech Solutions",
            description: "Healthcare management and analytics platform.",
            category: "Healthcare",
            riskLevel: "Critical",
            riskScores: {
              security: 48,
              privacy: 52,
              compliance: 55,
              overall: 52
            },
            dataAccessed: ["PII", "Health Information", "Payment Information"],
            lastAssessmentDate: "2024-12-10T00:00:00Z",
            nextAssessment: "2025-03-01T00:00:00Z", // past due
            contract: {
              startDate: "2024-07-01T00:00:00Z",
              endDate: "2026-07-01T00:00:00Z",
              value: 210000,
              auto_renewal: false
            },
            contactInfo: {
              name: "Amanda Brown",
              email: "abrown@healthtech.example.com",
              phone: "+1 (555) 012-3456"
            },
            openIssues: 7,
            status: "Under Review"
          },
          {
            id: "VEN-011",
            name: "DevOps Pipeline Pro",
            description: "CI/CD and development operations platform.",
            category: "Development Tools",
            riskLevel: "Medium",
            riskScores: {
              security: 75,
              privacy: 80,
              compliance: 72,
              overall: 76
            },
            dataAccessed: ["Source Code", "Deployment Config"],
            lastAssessmentDate: "2025-01-05T00:00:00Z",
            nextAssessment: "2025-07-05T00:00:00Z",
            contract: {
              startDate: "2023-11-15T00:00:00Z",
              endDate: "2025-11-15T00:00:00Z",
              value: 90000,
              auto_renewal: true
            },
            contactInfo: {
              name: "Daniel Lee",
              email: "dlee@devopspro.example.com",
              phone: "+1 (555) 123-4567"
            },
            openIssues: 1,
            status: "Active"
          },
          {
            id: "VEN-012",
            name: "LegalDocs AI",
            description: "AI-powered legal document management and analysis.",
            category: "Legal",
            riskLevel: "High",
            riskScores: {
              security: 62,
              privacy: 58,
              compliance: 65,
              overall: 62
            },
            dataAccessed: ["Legal Documents", "PII", "Confidential Data"],
            lastAssessmentDate: "2025-02-25T00:00:00Z",
            nextAssessment: "2025-05-25T00:00:00Z",
            contract: {
              startDate: "2024-04-01T00:00:00Z",
              endDate: "2026-04-01T00:00:00Z",
              value: 135000,
              auto_renewal: false
            },
            contactInfo: {
              name: "Nicole Garcia",
              email: "ngarcia@legaldocs.example.com",
              phone: "+1 (555) 234-5678"
            },
            openIssues: 3,
            status: "Active"
          }
        ];
        
        // Mock assessments
        const mockAssessments: VendorAssessment[] = [
          {
            id: "ASM-2025-001",
            type: "Security Risk Assessment",
            vendorId: "VEN-001",
            vendorName: "CloudSoft Technologies",
            status: "Approved",
            dueDate: "2025-01-15T00:00:00Z",
            completionDate: "2025-01-15T00:00:00Z",
            nextDueDate: "2025-07-15T00:00:00Z",
            assessor: "Security Team",
            scope: "Cloud infrastructure security controls and data protection",
            issues: 3,
            highRiskIssues: 1,
            remediatedIssues: 0,
            controlsAssessed: 78,
            method: "Questionnaire + Evidence Review",
            riskLevel: "High"
          },
          {
            id: "ASM-2025-002",
            type: "Security & Privacy Assessment",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            status: "Rejected",
            dueDate: "2025-02-10T00:00:00Z",
            completionDate: "2025-02-10T00:00:00Z",
            nextDueDate: "2025-05-10T00:00:00Z",
            assessor: "Third-party Auditor",
            scope: "Data processing, analytics, and AI model security",
            issues: 12,
            highRiskIssues: 5,
            remediatedIssues: 0,
            controlsAssessed: 94,
            method: "On-site Assessment",
            riskLevel: "Critical"
          },
          {
            id: "ASM-2024-042",
            type: "PCI DSS Assessment",
            vendorId: "VEN-003",
            vendorName: "PaymentFlow Systems",
            status: "Approved",
            dueDate: "2024-11-20T00:00:00Z",
            completionDate: "2024-11-20T00:00:00Z",
            nextDueDate: "2025-05-20T00:00:00Z",
            assessor: "Compliance Team",
            scope: "Payment processing systems and cardholder data environment",
            issues: 1,
            highRiskIssues: 0,
            remediatedIssues: 1,
            controlsAssessed: 52,
            method: "Documentation Review + Sample Testing",
            riskLevel: "Medium"
          },
          {
            id: "ASM-2024-045",
            type: "Security & Privacy Assessment",
            vendorId: "VEN-004",
            vendorName: "CustCRM Pro",
            status: "Approved",
            dueDate: "2024-12-05T00:00:00Z",
            completionDate: "2024-12-05T00:00:00Z",
            nextDueDate: "2025-06-05T00:00:00Z",
            assessor: "Security Team",
            scope: "CRM platform security, access controls, and data protection",
            issues: 4,
            highRiskIssues: 1,
            remediatedIssues: 2,
            controlsAssessed: 68,
            method: "Questionnaire + Evidence Review",
            riskLevel: "Medium"
          },
          {
            id: "ASM-2025-003",
            type: "Data Protection Assessment",
            vendorId: "VEN-005",
            vendorName: "TalentHub HR",
            status: "Approved",
            dueDate: "2025-01-25T00:00:00Z",
            completionDate: "2025-01-25T00:00:00Z",
            nextDueDate: "2025-04-25T00:00:00Z",
            assessor: "Privacy Office",
            scope: "HR data handling and employee information protection",
            issues: 5,
            highRiskIssues: 2,
            remediatedIssues: 2,
            controlsAssessed: 61,
            method: "Questionnaire + Interview",
            riskLevel: "High"
          },
          {
            id: "ASM-2024-038",
            type: "Security Assessment",
            vendorId: "VEN-006",
            vendorName: "MarketSync Ads",
            status: "Approved",
            dueDate: "2024-10-15T00:00:00Z",
            completionDate: "2024-10-15T00:00:00Z",
            nextDueDate: "2025-04-15T00:00:00Z",
            assessor: "Security Team",
            scope: "Marketing platform security and data handling",
            issues: 2,
            highRiskIssues: 0,
            remediatedIssues: 2,
            controlsAssessed: 55,
            method: "Questionnaire",
            riskLevel: "Medium"
          },
          {
            id: "ASM-2025-004",
            type: "Security & DR Assessment",
            vendorId: "VEN-007",
            vendorName: "SecureVault Backup",
            status: "Approved",
            dueDate: "2025-02-20T00:00:00Z",
            completionDate: "2025-02-20T00:00:00Z",
            nextDueDate: "2025-08-20T00:00:00Z",
            assessor: "Security Team",
            scope: "Backup security, encryption, and disaster recovery capabilities",
            issues: 0,
            highRiskIssues: 0,
            remediatedIssues: 0,
            controlsAssessed: 64,
            method: "Documentation Review + Demo",
            riskLevel: "Low"
          },
          {
            id: "ASM-2025-005",
            type: "AI Security Assessment",
            vendorId: "VEN-008",
            vendorName: "GlobalTranslate AI",
            status: "Approved",
            dueDate: "2025-03-01T00:00:00Z",
            completionDate: "2025-03-01T00:00:00Z",
            nextDueDate: "2025-09-01T00:00:00Z",
            assessor: "AI Ethics Committee",
            scope: "AI model security, translation accuracy, and data handling",
            issues: 3,
            highRiskIssues: 0,
            remediatedIssues: 2,
            controlsAssessed: 48,
            method: "Technical Review + Algorithm Analysis",
            riskLevel: "Medium"
          },
          {
            id: "ASM-2025-006",
            type: "Security Assessment",
            vendorId: "VEN-009",
            vendorName: "CloudGuard Security",
            status: "Approved",
            dueDate: "2025-02-15T00:00:00Z",
            completionDate: "2025-02-15T00:00:00Z",
            nextDueDate: "2025-08-15T00:00:00Z",
            assessor: "External Security Firm",
            scope: "Security platform capabilities and controls",
            issues: 0,
            highRiskIssues: 0,
            remediatedIssues: 0,
            controlsAssessed: 82,
            method: "Penetration Testing + Code Review",
            riskLevel: "Low"
          },
          {
            id: "ASM-2024-050",
            type: "HIPAA Assessment",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            status: "Expired",
            dueDate: "2024-12-10T00:00:00Z",
            completionDate: "2024-12-10T00:00:00Z",
            nextDueDate: "2025-03-01T00:00:00Z", // past due
            assessor: "Compliance Team",
            scope: "Healthcare data processing and HIPAA compliance",
            issues: 11,
            highRiskIssues: 7,
            remediatedIssues: 4,
            controlsAssessed: 77,
            method: "On-site Assessment + Documentation Review",
            riskLevel: "Critical"
          },
          {
            id: "ASM-2025-007",
            type: "Security Assessment",
            vendorId: "VEN-011",
            vendorName: "DevOps Pipeline Pro",
            status: "Approved",
            dueDate: "2025-01-05T00:00:00Z",
            completionDate: "2025-01-05T00:00:00Z",
            nextDueDate: "2025-07-05T00:00:00Z",
            assessor: "Security Team",
            scope: "DevOps pipeline security and code safety",
            issues: 2,
            highRiskIssues: 0,
            remediatedIssues: 1,
            controlsAssessed: 58,
            method: "Technical Review + Sample Testing",
            riskLevel: "Medium"
          },
          {
            id: "ASM-2025-008",
            type: "Privacy & Security Assessment",
            vendorId: "VEN-012",
            vendorName: "LegalDocs AI",
            status: "Approved",
            dueDate: "2025-02-25T00:00:00Z",
            completionDate: "2025-02-25T00:00:00Z",
            nextDueDate: "2025-05-25T00:00:00Z",
            assessor: "Privacy Office",
            scope: "Legal document processing, AI model security, and data protection",
            issues: 5,
            highRiskIssues: 2,
            remediatedIssues: 2,
            controlsAssessed: 71,
            method: "Documentation Review + Technical Testing",
            riskLevel: "High"
          },
          {
            id: "ASM-2025-009",
            type: "Follow-up Assessment",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            status: "In Progress",
            dueDate: "2025-03-15T00:00:00Z",
            assessor: "Security Team",
            scope: "Remediation verification of critical findings",
            progress: 65,
            method: "Evidence Review",
            riskLevel: "Critical"
          },
          {
            id: "ASM-2025-010",
            type: "Re-assessment",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            status: "Pending",
            dueDate: "2025-04-01T00:00:00Z",
            assessor: "Compliance Team",
            scope: "Full HIPAA compliance re-assessment",
            method: "On-site Assessment",
            riskLevel: "Critical"
          }
        ];
        
        // Mock issues
        const mockIssues: VendorIssue[] = [
          {
            id: "ISS-2025-001",
            title: "Insufficient Access Controls",
            description: "Access controls for cloud resources do not enforce principle of least privilege.",
            vendorId: "VEN-001",
            vendorName: "CloudSoft Technologies",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-01-15T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Vendor Security Team",
            category: "Access Control",
            remediationPlan: "Implement role-based access controls and review all permission sets.",
            remediationProgress: 45,
            assessmentId: "ASM-2025-001"
          },
          {
            id: "ISS-2025-002",
            title: "Incomplete Data Encryption",
            description: "Customer data at rest is not consistently encrypted across all storage systems.",
            vendorId: "VEN-001",
            vendorName: "CloudSoft Technologies",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-01-15T00:00:00Z",
            dueDate: "2025-04-15T00:00:00Z",
            owner: "Vendor Security Team",
            category: "Data Protection",
            remediationPlan: "Implement encryption across all storage systems and validate implementation.",
            remediationProgress: 30,
            assessmentId: "ASM-2025-001"
          },
          {
            id: "ISS-2025-003",
            title: "Inadequate Logging",
            description: "Security event logging is insufficient to support forensic investigation.",
            vendorId: "VEN-001",
            vendorName: "CloudSoft Technologies",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-01-15T00:00:00Z",
            dueDate: "2025-04-01T00:00:00Z",
            owner: "Vendor Security Team",
            category: "Monitoring",
            remediationPlan: "Enhance logging across all systems and implement centralized log management.",
            remediationProgress: 20,
            assessmentId: "ASM-2025-001"
          },
          {
            id: "ISS-2025-004",
            title: "Missing Vulnerability Management",
            description: "No formal vulnerability management program for identifying and remediating security issues.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-03-10T00:00:00Z",
            owner: "Information Security",
            category: "Vulnerability Management",
            remediationPlan: "Implement vulnerability scanning and management program with regular cadence.",
            remediationProgress: 60,
            assessmentId: "ASM-2025-002"
          },
          {
            id: "ISS-2025-005",
            title: "Data Processing Issues",
            description: "Data processing activities lack proper isolation between customers, creating potential data leakage risks.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Information Security",
            category: "
              Here's the remaining code for the `use-vendor-risk.ts` hook:

```typescript
            id: "ISS-2025-005",
            title: "Data Processing Issues",
            description: "Data processing activities lack proper isolation between customers, creating potential data leakage risks.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Information Security",
            category: "Data Segregation",
            remediationPlan: "Implement tenant isolation and data segregation controls.",
            remediationProgress: 40,
            assessmentId: "ASM-2025-002"
          },
          {
            id: "ISS-2025-006",
            title: "Insufficient Backup Validation",
            description: "Backup restoration processes are not regularly tested to ensure viability.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-04-10T00:00:00Z",
            owner: "IT Operations",
            category: "Disaster Recovery",
            remediationPlan: "Implement quarterly backup restoration testing and validation.",
            remediationProgress: 20,
            assessmentId: "ASM-2025-002"
          },
          {
            id: "ISS-2025-007",
            title: "Inadequate Third-Party Risk Management",
            description: "Vendor lacks adequate assessment of their own sub-processors and service providers.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-05-10T00:00:00Z",
            owner: "Vendor Management",
            category: "Third-party Management",
            remediationPlan: "Develop and implement third-party risk management program for sub-processors.",
            remediationProgress: 10,
            assessmentId: "ASM-2025-002"
          },
          {
            id: "ISS-2025-008",
            title: "Data Breach Response Plan Missing",
            description: "No formal process for responding to and reporting data breaches.",
            vendorId: "VEN-002",
            vendorName: "SecureData Analytics",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-02-10T00:00:00Z",
            dueDate: "2025-04-01T00:00:00Z",
            owner: "Information Security",
            category: "Incident Response",
            remediationPlan: "Develop and implement data breach response plan and procedures.",
            remediationProgress: 30,
            assessmentId: "ASM-2025-002"
          },
          {
            id: "ISS-2024-089",
            title: "Weak Encryption Standards",
            description: "Outdated encryption algorithms used for stored card data.",
            vendorId: "VEN-003",
            vendorName: "PaymentFlow Systems",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2024-11-20T00:00:00Z",
            dueDate: "2025-03-20T00:00:00Z",
            owner: "Security Engineering",
            category: "Cryptography",
            remediationPlan: "Upgrade to AES-256 encryption and implement key rotation.",
            remediationProgress: 70,
            assessmentId: "ASM-2024-042"
          },
          {
            id: "ISS-2024-092",
            title: "Ineffective Password Policies",
            description: "Password policies do not enforce sufficient complexity or rotation.",
            vendorId: "VEN-004",
            vendorName: "CustCRM Pro",
            severity: "Medium",
            status: "In Progress",
            identifiedDate: "2024-12-05T00:00:00Z",
            dueDate: "2025-03-05T00:00:00Z",
            owner: "Security Team",
            category: "Authentication",
            remediationPlan: "Implement new password policy with increased complexity requirements.",
            remediationProgress: 85,
            assessmentId: "ASM-2024-045"
          },
          {
            id: "ISS-2024-093",
            title: "Incomplete MFA Implementation",
            description: "Multi-factor authentication not enforced for all administrative access.",
            vendorId: "VEN-004",
            vendorName: "CustCRM Pro",
            severity: "High",
            status: "Open",
            identifiedDate: "2024-12-05T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Security Team",
            category: "Authentication",
            remediationPlan: "Extend MFA to all privileged accounts and administrative functions.",
            remediationProgress: 60,
            assessmentId: "ASM-2024-045"
          },
          {
            id: "ISS-2025-009",
            title: "Unencrypted PII in Logs",
            description: "Personal identifiable information appears unmasked in application logs.",
            vendorId: "VEN-005",
            vendorName: "TalentHub HR",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-01-25T00:00:00Z",
            dueDate: "2025-03-25T00:00:00Z",
            owner: "Development Team",
            category: "Data Protection",
            remediationPlan: "Implement data masking in all logs containing PII.",
            remediationProgress: 50,
            assessmentId: "ASM-2025-003"
          },
          {
            id: "ISS-2025-010",
            title: "Insufficient Data Retention Controls",
            description: "HR data retained beyond necessary timeframes without proper controls.",
            vendorId: "VEN-005",
            vendorName: "TalentHub HR",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-01-25T00:00:00Z",
            dueDate: "2025-04-25T00:00:00Z",
            owner: "Data Management",
            category: "Data Lifecycle",
            remediationPlan: "Implement data retention policies and automated purging.",
            remediationProgress: 40,
            assessmentId: "ASM-2025-003"
          },
          {
            id: "ISS-2025-011",
            title: "Inadequate Security Monitoring",
            description: "Security monitoring does not provide adequate coverage for employee data access.",
            vendorId: "VEN-005",
            vendorName: "TalentHub HR",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-01-25T00:00:00Z",
            dueDate: "2025-04-10T00:00:00Z",
            owner: "Security Operations",
            category: "Monitoring",
            remediationPlan: "Enhance monitoring coverage and implement access alerting.",
            remediationProgress: 30,
            assessmentId: "ASM-2025-003"
          },
          {
            id: "ISS-2025-012",
            title: "AI Training Data Concerns",
            description: "Unclear provenance and permissions for data used in AI model training.",
            vendorId: "VEN-008",
            vendorName: "GlobalTranslate AI",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-03-01T00:00:00Z",
            dueDate: "2025-05-01T00:00:00Z",
            owner: "AI Governance Team",
            category: "AI Ethics",
            remediationPlan: "Document training data sources and obtain necessary permissions.",
            remediationProgress: 25,
            assessmentId: "ASM-2025-005"
          },
          {
            id: "ISS-2024-075",
            title: "PHI Access Controls Deficient",
            description: "Access to PHI not properly restricted based on job role and need to know.",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2024-12-10T00:00:00Z",
            dueDate: "2025-02-10T00:00:00Z", // past due
            owner: "Compliance Team",
            category: "Access Control",
            remediationPlan: "Implement role-based access controls for PHI data.",
            remediationProgress: 45,
            assessmentId: "ASM-2024-050"
          },
          {
            id: "ISS-2024-076",
            title: "Incomplete Audit Logging",
            description: "Audit logs do not capture all access to PHI as required by HIPAA.",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            severity: "High",
            status: "Open",
            identifiedDate: "2024-12-10T00:00:00Z",
            dueDate: "2025-03-10T00:00:00Z",
            owner: "Security Engineering",
            category: "Audit Controls",
            remediationPlan: "Enhance audit logging to capture all PHI access events.",
            remediationProgress: 55,
            assessmentId: "ASM-2024-050"
          },
          {
            id: "ISS-2024-077",
            title: "Inadequate Risk Analysis",
            description: "Security risk analysis does not meet HIPAA requirements.",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2024-12-10T00:00:00Z",
            dueDate: "2025-02-15T00:00:00Z", // past due
            owner: "Compliance Team",
            category: "Risk Management",
            remediationPlan: "Conduct comprehensive HIPAA-compliant security risk analysis.",
            remediationProgress: 30,
            assessmentId: "ASM-2024-050"
          },
          {
            id: "ISS-2024-078",
            title: "Business Associate Agreements Missing",
            description: "BAAs not in place for all subcontractors handling PHI.",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            severity: "Critical",
            status: "Open",
            identifiedDate: "2024-12-10T00:00:00Z",
            dueDate: "2025-01-31T00:00:00Z", // past due
            owner: "Legal Team",
            category: "Compliance",
            remediationPlan: "Identify all subcontractors and execute BAAs.",
            remediationProgress: 60,
            assessmentId: "ASM-2024-050"
          },
          {
            id: "ISS-2024-079",
            title: "Inadequate Encryption in Transit",
            description: "PHI not consistently encrypted during transmission.",
            vendorId: "VEN-010",
            vendorName: "HealthTech Solutions",
            severity: "High",
            status: "Open",
            identifiedDate: "2024-12-10T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Security Engineering",
            category: "Transmission Security",
            remediationPlan: "Implement TLS 1.3 for all data transmissions.",
            remediationProgress: 40,
            assessmentId: "ASM-2024-050"
          },
          {
            id: "ISS-2025-013",
            title: "Insufficient CI/CD Pipeline Security",
            description: "Security scanning not integrated into CI/CD pipeline.",
            vendorId: "VEN-011",
            vendorName: "DevOps Pipeline Pro",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-01-05T00:00:00Z",
            dueDate: "2025-04-05T00:00:00Z",
            owner: "DevSecOps Team",
            category: "DevSecOps",
            remediationPlan: "Integrate security scanning tools into CI/CD workflow.",
            remediationProgress: 70,
            assessmentId: "ASM-2025-007"
          },
          {
            id: "ISS-2025-014",
            title: "Inadequate Data Classification",
            description: "Legal documents not properly classified based on sensitivity.",
            vendorId: "VEN-012",
            vendorName: "LegalDocs AI",
            severity: "High",
            status: "Open",
            identifiedDate: "2025-02-25T00:00:00Z",
            dueDate: "2025-04-25T00:00:00Z",
            owner: "Information Governance",
            category: "Data Classification",
            remediationPlan: "Implement automated data classification for legal documents.",
            remediationProgress: 35,
            assessmentId: "ASM-2025-008"
          },
          {
            id: "ISS-2025-015",
            title: "Insufficient AI Model Governance",
            description: "Lack of oversight process for AI model changes and updates.",
            vendorId: "VEN-012",
            vendorName: "LegalDocs AI",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-02-25T00:00:00Z",
            dueDate: "2025-05-25T00:00:00Z",
            owner: "AI Governance Team",
            category: "AI Governance",
            remediationPlan: "Establish AI governance framework including change management.",
            remediationProgress: 20,
            assessmentId: "ASM-2025-008"
          },
          {
            id: "ISS-2025-016",
            title: "Incomplete Document Retention Controls",
            description: "Legal document retention not consistently enforced.",
            vendorId: "VEN-012",
            vendorName: "LegalDocs AI",
            severity: "Medium",
            status: "Open",
            identifiedDate: "2025-02-25T00:00:00Z",
            dueDate: "2025-05-15T00:00:00Z",
            owner: "Information Governance",
            category: "Data Lifecycle",
            remediationPlan: "Implement document retention policies with automated enforcement.",
            remediationProgress: 25,
            assessmentId: "ASM-2025-008"
          }
        ];
        
        // Extract vendor categories
        const categories = Array.from(new Set(mockVendors.map(vendor => vendor.category)));
        
        // Calculate vendor risk stats
        const totalVendors = mockVendors.length;
        
        const activeVendors = mockVendors.filter(v => 
          v.status === "Active" || v.status === "Under Review"
        ).length;
        
        const highRiskVendors = mockVendors.filter(v => 
          v.riskLevel === "High"
        ).length;
        
        const criticalRiskVendors = mockVendors.filter(v => 
          v.riskLevel === "Critical"
        ).length;
        
        // Count assessments due and overdue
        const assessmentsDue = mockVendors.filter(v => 
          v.nextAssessment && new Date(v.nextAssessment) <= new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000))
        ).length;
        
        const overdueAssessments = mockVendors.filter(v => 
          v.nextAssessment && new Date(v.nextAssessment) < currentDate
        ).length;
        
        // Count open issues and high severity issues
        const openIssues = mockIssues.filter(i => 
          i.status === "Open" || i.status === "In Progress"
        ).length;
        
        const highSeverityIssues = mockIssues.filter(i => 
          (i.status === "Open" || i.status === "In Progress") &&
          (i.severity === "Critical" || i.severity === "High")
        ).length;
        
        // Compile stats
        const stats: VendorRiskStats = {
          totalVendors,
          activeVendors,
          highRiskVendors,
          criticalRiskVendors,
          assessmentsDue,
          overdueAssessments,
          openIssues,
          highSeverityIssues
        };
        
        setData({
          vendors: mockVendors,
          assessments: mockAssessments,
          issues: mockIssues,
          stats,
          categories
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch vendor risk data'));
        console.error('Error fetching vendor risk data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorRiskData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
```
