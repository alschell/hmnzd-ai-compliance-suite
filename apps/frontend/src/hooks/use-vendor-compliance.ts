import { useState, useEffect } from 'react';

interface VendorCertification {
  name: string;
  validUntil: string;
  status: 'valid' | 'expired' | 'pending';
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  description?: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Compliant' | 'At Risk' | 'Non-Compliant' | 'Pending' | 'Expired';
  complianceScore: number;
  lastAssessmentDate: string;
  nextAssessmentDue: string;
  dataAccess?: string[];
  issues: number;
  logoUrl?: string;
  certifications?: VendorCertification[];
  contactName?: string;
  contactEmail?: string;
}

interface VendorComplianceData {
  vendors: Vendor[];
  totalVendors: number;
  compliantVendors: number;
  atRiskVendors: number;
  nonCompliantVendors: number;
  reviewedVendors: number;
  pendingVendors: number;
  overallRiskScore: number;
  nextAssessmentDue: string;
}

export function useVendorCompliance() {
  const [data, setData] = useState<VendorComplianceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchVendorCompliance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 900));
        
        // Mock data
        const mockVendors: Vendor[] = [
          {
            id: "vendor-001",
            name: "CloudSecure Solutions",
            category: "Cloud Infrastructure",
            description: "Primary cloud service provider for infrastructure and platform services.",
            riskLevel: "Critical",
            status: "Compliant",
            complianceScore: 92,
            lastAssessmentDate: "2025-02-10T09:30:00Z",
            nextAssessmentDue: "2025-08-10T00:00:00Z",
            dataAccess: ["Customer Data", "Payment Information", "Healthcare Information"],
            issues: 0,
            logoUrl: "/vendors/cloudsecure-logo.svg",
            certifications: [
              { name: "ISO 27001", validUntil: "2026-03-15T00:00:00Z", status: "valid" },
              { name: "SOC 2 Type II", validUntil: "2025-12-01T00:00:00Z", status: "valid" },
              { name: "HIPAA", validUntil: "2025-10-20T00:00:00Z", status: "valid" }
            ],
            contactName: "Sarah Johnson",
            contactEmail: "sjohnson@cloudsecure.example"
          },
          {
            id: "vendor-002",
            name: "DataAnalyze Pro",
            category: "Data Analytics",
            description: "Data analytics platform used for business intelligence and customer insights.",
            riskLevel: "High",
            status: "At Risk",
            complianceScore: 78,
            lastAssessmentDate: "2025-01-20T14:15:00Z",
            nextAssessmentDue: "2025-04-20T00:00:00Z",
            dataAccess: ["Customer Data", "Usage Statistics"],
            issues: 3,
            logoUrl: "/vendors/dataanalyze-logo.svg",
            certifications: [
              { name: "SOC 2 Type I", validUntil: "2025-05-30T00:00:00Z", status: "valid" },
              { name: "GDPR", validUntil: "2025-01-15T00:00:00Z", status: "expired" }
            ],
            contactName: "Marcus Lee",
            contactEmail: "mlee@dataanalyze.example"
          },
          {
            id: "vendor-003",
            name: "SecurePayments Inc",
            category: "Payment Processing",
            description: "Payment processing service for all customer transactions.",
            riskLevel: "Critical",
            status: "Compliant",
            complianceScore: 96,
            lastAssessmentDate: "2025-02-28T11:00:00Z",
            nextAssessmentDue: "2025-08-28T00:00:00Z",
            dataAccess: ["Payment Information"],
            issues: 0,
            logoUrl: "/vendors/securepayments-logo.svg",
            certifications: [
              { name: "PCI DSS", validUntil: "2025-11-10T00:00:00Z", status: "valid" },
              { name: "ISO 27001", validUntil: "2025-09-15T00:00:00Z", status: "valid" },
              { name: "SOC 2 Type II", validUntil: "2026-01-20T00:00:00Z", status: "valid" }
            ],
            contactName: "Patricia Wong",
            contactEmail: "pwong@securepayments.example"
          },
          {
            id: "vendor-004",
            name: "TechRecruit Partners",
            category: "HR Services",
            description: "Recruitment and staffing service for technical positions.",
            riskLevel: "Medium",
            status: "Non-Compliant",
            complianceScore: 54,
            lastAssessmentDate: "2024-12-15T10:30:00Z",
            nextAssessmentDue: "2025-03-15T00:00:00Z",
            dataAccess: ["Employee Data"],
            issues: 5,
            certifications: [
              { name: "ISO 27001", validUntil: "2024-12-10T00:00:00Z", status: "expired" }
            ],
            contactName: "Robert Chen",
            contactEmail: "rchen@techrecruit.example"
          },
          {
            id: "vendor-005",
            name: "MarketBoost Media",
            category: "Marketing",
            description: "Digital marketing agency managing social media and online campaigns.",
            riskLevel: "Medium",
            status: "At Risk",
            complianceScore: 68,
            lastAssessmentDate: "2025-01-05T13:45:00Z",
            nextAssessmentDue: "2025-04-05T00:00:00Z",
            dataAccess: ["Customer Contact Information"],
            issues: 2,
            logoUrl: "/vendors/marketboost-logo.svg",
            certifications: [
              { name: "SOC 2 Type I", validUntil: "2025-07-10T00:00:00Z", status: "valid" }
            ],
            contactName: "Jessica Taylor",
            contactEmail: "jtaylor@marketboost.example"
          },
          {
            id: "vendor-006",
            name: "SupportDesk Global",
            category: "Customer Support",
            description: "Outsourced customer support team handling tier 1 and 2 support requests.",
            riskLevel: "High",
            status: "Compliant",
            complianceScore: 87,
            lastAssessmentDate: "2025-02-20T09:15:00Z",
            nextAssessmentDue: "2025-08-20T00:00:00Z",
            dataAccess: ["Customer Data", "Account Information"],
            issues: 1,
            logoUrl: "/vendors/supportdesk-logo.svg",
            certifications: [
              { name: "ISO 27001", validUntil: "2025-10-05T00:00:00Z", status: "valid" },
              { name: "SOC 2 Type II", validUntil: "2025-08-15T00:00:00Z", status: "valid" }
            ],
            contactName: "Michael Rodriguez",
            contactEmail: "mrodriguez@supportdesk.example"
          },
          {
            id: "vendor-007",
            name: "LegalEase Documents",
            category: "Legal Services",
            description: "Legal services provider for contract review and compliance documentation.",
            riskLevel: "Low",
            status: "Pending",
            complianceScore: 0,
            lastAssessmentDate: "2025-03-01T00:00:00Z",
            nextAssessmentDue: "2025-03-15T00:00:00Z",
            dataAccess: ["Contract Information"],
            issues: 0,
            contactName: "Amanda Johnson",
            contactEmail: "ajohnson@legalease.example"
          },
          {
            id: "vendor-008",
            name: "DevOps Accelerate",
            category: "Development Tools",
            description: "CI/CD and development tools provider for engineering team.",
            riskLevel: "High",
            status: "Expired",
            complianceScore: 45,
            lastAssessmentDate: "2024-09-10T11:30:00Z",
            nextAssessmentDue: "2025-03-10T00:00:00Z",
            dataAccess: ["Source Code", "Development Environment"],
            issues: 4,
            logoUrl: "/vendors/devops-logo.svg",
            certifications: [
              { name: "ISO 27001", validUntil: "2025-01-15T00:00:00Z", status: "expired" },
              { name: "SOC 2 Type II", validUntil: "2024-12-20T00:00:00Z", status: "expired" }
            ],
            contactName: "David Wilson",
            contactEmail: "dwilson@devopsacc.example"
          }
        ];

        // Calculate stats
        const compliantVendors = mockVendors.filter(v => v.status === "Compliant").length;
        const atRiskVendors = mockVendors.filter(v => v.status === "At Risk").length;
        const nonCompliantVendors = mockVendors.filter(v => v.status === "Non-Compliant" || v.status === "Expired").length;
        const pendingVendors = mockVendors.filter(v => v.status === "Pending").length;
        const reviewedVendors = mockVendors.filter(v => v.status !== "Pending").length;
        const totalVendors = mockVendors.length;
        
        // Find next due assessment
        const sortedByDueDate = [...mockVendors].sort((a, b) => 
          new Date(a.nextAssessmentDue).getTime() - new Date(b.nextAssessmentDue).getTime()
        );
        const nextAssessmentDue = sortedByDueDate.find(v => 
          new Date(v.nextAssessmentDue) > new Date("2025-03-05T07:45:00Z")
        )?.nextAssessmentDue || "2025-03-15T00:00:00Z";
        
        // Calculate overall risk score
        const overallRiskScore = Math.round(
          (mockVendors.reduce((sum, vendor) => sum + vendor.complianceScore, 0) / 
          mockVendors.filter(v => v.status !== "Pending").length) || 0
        );

        setData({
          vendors: mockVendors,
          totalVendors,
          compliantVendors,
          atRiskVendors,
          nonCompliantVendors,
          reviewedVendors,
          pendingVendors,
          overallRiskScore,
          nextAssessmentDue
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch vendor compliance data'));
        console.error('Error fetching vendor compliance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorCompliance();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
