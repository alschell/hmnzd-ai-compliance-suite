import { useState, useEffect } from 'react';

export interface ComplianceFramework {
  id: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  complianceScore?: number;
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  controlStats?: {
    totalControls: number;
    compliantControls: number;
    partialControls: number;
    nonCompliantControls: number;
    notApplicableControls: number;
  };
  owner?: string;
}

export interface ComplianceAssessment {
  id: string;
  name: string;
  description?: string;
  framework: string;
  status: 'Compliant' | 'Non-Compliant' | 'In Progress' | 'Planned' | 'Remediation';
  assessmentDate: string;
  nextAssessmentDate?: string;
  assessor: string;
  findings?: number;
  completionPercentage?: number;
  evidenceCount?: number;
  reportUrl?: string;
}

export interface ComplianceFinding {
  id: string;
  title: string;
  description?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'In Review';
  framework: string;
  controlId: string;
  identifiedDate: string;
  dueDate?: string;
  closedDate?: string;
  owner: string;
  remediationProgress?: number;
  remediationPlan?: string;
  assessmentId: string;
}

interface ComplianceStats {
  overallCompliance: number;
  openFindings: number;
  highPriorityFindings: number;
  totalFrameworks: number;
  activeFrameworks: number;
  totalAssessments: number;
  completedAssessments: number;
  averageComplianceScore: number;
  frameworksWithIssues: number;
  controlsAssessed: number;
}

interface ComplianceAssessmentData {
  frameworks: ComplianceFramework[];
  assessments: ComplianceAssessment[];
  findings: ComplianceFinding[];
  stats: ComplianceStats;
}

export function useComplianceAssessment() {
  const [data, setData] = useState<ComplianceAssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T12:09:09Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchComplianceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock frameworks
        const mockFrameworks: ComplianceFramework[] = [
          {
            id: "FRM-ISO27001",
            name: "ISO 27001:2022",
            description: "Information Security Management System standard, 2022 revision",
            category: "Information Security",
            version: "2022",
            complianceScore: 87,
            lastAssessmentDate: "2025-01-10T00:00:00Z",
            nextAssessmentDate: "2026-01-10T00:00:00Z",
            controlStats: {
              totalControls: 114,
              compliantControls: 96,
              partialControls: 12,
              nonCompliantControls: 4,
              notApplicableControls: 2
            },
            owner: "Security Team"
          },
          {
            id: "FRM-SOC2",
            name: "SOC 2",
            description: "Service Organization Control 2 - Trust Services Criteria",
            category: "Trust Services",
            version: "2017",
            complianceScore: 92,
            lastAssessmentDate: "2024-12-15T00:00:00Z",
            nextAssessmentDate: "2025-12-15T00:00:00Z",
            controlStats: {
              totalControls: 64,
              compliantControls: 58,
              partialControls: 4,
              nonCompliantControls: 1,
              notApplicableControls: 1
            },
            owner: "Compliance Team"
          },
          {
            id: "FRM-GDPR",
            name: "GDPR",
            description: "General Data Protection Regulation",
            category: "Privacy",
            version: "2018",
            complianceScore: 85,
            lastAssessmentDate: "2025-02-05T00:00:00Z",
            nextAssessmentDate: "2025-08-05T00:00:00Z",
            controlStats: {
              totalControls: 34,
              compliantControls: 28,
              partialControls: 4,
              nonCompliantControls: 2,
              notApplicableControls: 0
            },
            owner: "Privacy Office"
          },
          {
            id: "FRM-PCI",
            name: "PCI DSS",
            description: "Payment Card Industry Data Security Standard",
            category: "Payment Security",
            version: "4.0",
            complianceScore: 94,
            lastAssessmentDate: "2025-02-20T00:00:00Z",
            nextAssessmentDate: "2025-08-20T00:00:00Z",
            controlStats: {
              totalControls: 78,
              compliantControls: 73,
              partialControls: 3,
              nonCompliantControls: 1,
              notApplicableControls: 1
            },
            owner: "Security Team"
          },
          {
            id: "FRM-HIPAA",
            name: "HIPAA",
            description: "Health Insurance Portability and Accountability Act",
            category: "Healthcare Privacy",
            version: "2013",
            complianceScore: 81,
            lastAssessmentDate: "2024-11-25T00:00:00Z",
            nextAssessmentDate: "2025-05-25T00:00:00Z",
            controlStats: {
              totalControls: 42,
              compliantControls: 32,
              partialControls: 7,
              nonCompliantControls: 2,
              notApplicableControls: 1
            },
            owner: "Privacy Office"
          },
          {
            id: "FRM-NIST",
            name: "NIST CSF",
            description: "NIST Cybersecurity Framework",
            category: "Cybersecurity",
            version: "1.1",
            complianceScore: 78,
            lastAssessmentDate: "2024-10-15T00:00:00Z",
            nextAssessmentDate: "2025-04-15T00:00:00Z",
            controlStats: {
              totalControls: 108,
              compliantControls: 80,
              partialControls: 18,
              nonCompliantControls: 7,
              notApplicableControls: 3
            },
            owner: "Security Team"
          },
          {
            id: "FRM-CCPA",
            name: "CCPA",
            description: "California Consumer Privacy Act",
            category: "Privacy",
            version: "2020",
            complianceScore: 88,
            lastAssessmentDate: "2025-01-30T00:00:00Z",
            nextAssessmentDate: "2025-07-30T00:00:00Z",
            controlStats: {
              totalControls: 22,
              compliantControls: 19,
              partialControls: 2,
              nonCompliantControls: 1,
              notApplicableControls: 0
            },
            owner: "Privacy Office"
          },
          {
            id: "FRM-AI-ACT",
            name: "EU AI Act",
            description: "European Union Artificial Intelligence Act",
            category: "AI Governance",
            version: "2023",
            complianceScore: 72,
            lastAssessmentDate: "2025-02-12T00:00:00Z",
            nextAssessmentDate: "2025-08-12T00:00:00Z",
            controlStats: {
              totalControls: 36,
              compliantControls: 24,
              partialControls: 8,
              nonCompliantControls: 4,
              notApplicableControls: 0
            },
            owner: "AI Ethics Committee"
          }
        ];
        
        // Mock assessments
        const mockAssessments: ComplianceAssessment[] = [
          {
            id: "ASM-2025-001",
            name: "ISO 27001 Annual Assessment",
            description: "Annual assessment of information security controls against ISO 27001:2022 standard.",
            framework: "ISO 27001:2022",
            status: "Compliant",
            assessmentDate: "2025-01-10T00:00:00Z",
            nextAssessmentDate: "2026-01-10T00:00:00Z",
            assessor: "External Auditor",
            findings: 4,
            evidenceCount: 87,
            reportUrl: "/reports/asm-2025-001.pdf"
          },
          {
            id: "ASM-2024-012",
            name: "SOC 2 Type II Audit",
            description: "Annual SOC 2 Type II audit for Trust Services Criteria.",
            framework: "SOC 2",
            status: "Compliant",
            assessmentDate: "2024-12-15T00:00:00Z",
            nextAssessmentDate: "2025-12-15T00:00:00Z",
            assessor: "External Auditor",
            findings: 1,
            evidenceCount: 65,
            reportUrl: "/reports/asm-2024-012.pdf"
          },
          {
            id: "ASM-2025-002",
            name: "GDPR Compliance Review",
            description: "Bi-annual internal assessment of GDPR compliance.",
            framework: "GDPR",
            status: "Remediation",
            assessmentDate: "2025-02-05T00:00:00Z",
            nextAssessmentDate: "2025-08-05T00:00:00Z",
            assessor: "Privacy Team",
            findings: 2,
            evidenceCount: 34,
            reportUrl: "/reports/asm-2025-002.pdf"
          },
          {
            id: "ASM-2025-003",
            name: "PCI DSS 4.0 Assessment",
            description: "Quarterly PCI DSS compliance assessment.",
            framework: "PCI DSS",
            status: "Compliant",
            assessmentDate: "2025-02-20T00:00:00Z",
            nextAssessmentDate: "2025-05-20T00:00:00Z",
            assessor: "Security Team",
            findings: 1,
            evidenceCount: 53,
            reportUrl: "/reports/asm-2025-003.pdf"
          },
          {
            id: "ASM-2024-011",
            name: "HIPAA Compliance Review",
            description: "Semi-annual HIPAA compliance assessment.",
            framework: "HIPAA",
            status: "Non-Compliant",
            assessmentDate: "2024-11-25T00:00:00Z",
            nextAssessmentDate: "2025-05-25T00:00:00Z",
            assessor: "Privacy Team",
            findings: 2,
            evidenceCount: 41,
            reportUrl: "/reports/asm-2024-011.pdf"
          },
          {
            id: "ASM-2024-010",
            name: "NIST CSF Gap Assessment",
            description: "Assessment of cybersecurity controls against NIST Cybersecurity Framework.",
            framework: "NIST CSF",
            status: "Remediation",
            assessmentDate: "2024-10-15T00:00:00Z",
            nextAssessmentDate: "2025-04-15T00:00:00Z",
            assessor: "Security Team",
            findings: 7,
            evidenceCount: 95,
            reportUrl: "/reports/asm-2024-010.pdf"
          },
          {
            id: "ASM-2025-004",
            name: "CCPA Compliance Assessment",
            description: "Semi-annual assessment of California Consumer Privacy Act compliance.",
            framework: "CCPA",
            status: "Compliant",
            assessmentDate: "2025-01-30T00:00:00Z",
            nextAssessmentDate: "2025-07-30T00:00:00Z",
            assessor: "Privacy Team",
            findings: 1,
            evidenceCount: 22,
            reportUrl: "/reports/asm-2025-004.pdf"
          },
          {
            id: "ASM-2025-005",
            name: "EU AI Act Initial Assessment",
            description: "Initial assessment of AI systems against EU AI Act requirements.",
            framework: "EU AI Act",
            status: "In Progress",
            assessmentDate: "2025-02-12T00:00:00Z",
            nextAssessmentDate: "2025-08-12T00:00:00Z",
            assessor: "AI Ethics Committee",
            completionPercentage: 65,
            evidenceCount: 24
          },
          {
            id: "ASM-2025-006",
            name: "ISO 27001 Gap Assessment",
            description: "Interim gap assessment for ISO 27001 controls.",
            framework: "ISO 27001:2022",
            status: "In Progress",
            assessmentDate: "2025-03-01T00:00:00Z",
            assessor: "Security Team",
            completionPercentage: 80,
            evidenceCount: 37
          },
          {
            id: "ASM-2025-007",
            name: "SOC 2 Readiness Assessment",
            description: "Preparatory assessment for upcoming SOC 2 audit.",
            framework: "SOC 2",
            status: "Planned",
            assessmentDate: "2025-05-15T00:00:00Z",
            assessor: "Compliance Team",
            evidenceCount: 0
          }
        ];
        
        // Mock findings
        const mockFindings: ComplianceFinding[] = [
          {
            id: "FND-2025-001",
            title: "Incomplete Access Reviews",
            description: "Quarterly access reviews were not completed for all systems in scope.",
            severity: "Medium",
            status: "Open",
            framework: "ISO 27001:2022",
            controlId: "A.9.2.5",
            identifiedDate: "2025-01-10T00:00:00Z",
            dueDate: "2025-04-10T00:00:00Z",
            owner: "IT Security Manager",
            remediationProgress: 75,
            remediationPlan: "Implement automated access review system and complete reviews for all systems.",
            assessmentId: "ASM-2025-001"
          },
          {
            id: "FND-2025-002",
            title: "Outdated Third-Party Risk Assessments",
            description: "Risk assessments for 3 critical vendors have not been updated in the past 12 months.",
            severity: "High",
            status: "Open",
            framework: "ISO 27001:2022",
            controlId: "A.15.2.1",
            identifiedDate: "2025-01-10T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "Vendor Management",
            remediationProgress: 60,
            remediationPlan: "Conduct risk assessments for all critical vendors and implement a tracking system.",
            assessmentId: "ASM-2025-001"
          },
          {
            id: "FND-2025-003",
            title: "Insufficient Change Management Documentation",
            description: "Changes to production systems lack complete documentation and approval records.",
            severity: "Medium",
            status: "Closed",
            framework: "ISO 27001:2022",
            controlId: "A.14.2.2",
            identifiedDate: "2025-01-10T00:00:00Z",
            closedDate: "2025-02-20T00:00:00Z",
            owner: "DevOps Manager",
            remediationProgress: 100,
            assessmentId: "ASM-2025-001"
          },
          {
            id: "FND-2025-004",
            title: "Incomplete Business Continuity Testing",
            description: "Business continuity plans have not been fully tested across all critical systems.",
            severity: "Medium",
            status: "Open",
            framework: "ISO 27001:2022",
            controlId: "A.17.1.3",
            identifiedDate: "2025-01-10T00:00:00Z",
            dueDate: "2025-05-10T00:00:00Z",
            owner: "Business Continuity Manager",
            remediationProgress: 40,
            remediationPlan: "Schedule and conduct comprehensive BCP testing for all critical systems.",
            assessmentId: "ASM-2025-001"
          },
          {
            id: "FND-2024-035",
            title: "Insufficient Monitoring Coverage",
            description: "Security monitoring does not cover all systems within the scope of SOC 2.",
            severity: "High",
            status: "Closed",
            framework: "SOC 2",
            controlId: "CC7.2",
            identifiedDate: "2024-12-15T00:00:00Z",
            closedDate: "2025-02-10T00:00:00Z",
            owner: "Security Operations",
            remediationProgress: 100,
            assessmentId: "ASM-2024-012"
          },
          {
            id: "FND-2025-005",
            title: "Incomplete Data Subject Request Process",
            description: "Process for handling data subject access requests does not address all GDPR requirements for response timeliness.",
            severity: "High",
            status: "In Review",
            framework: "GDPR",
            controlId: "Art.15",
            identifiedDate: "2025-02-05T00:00:00Z",
            dueDate: "2025-03-20T00:00:00Z",
            owner: "Privacy Office",
            remediationProgress: 90,
            remediationPlan: "Update DSR handling process and implement tracking system for timely responses.",
            assessmentId: "ASM-2025-002"
          },
          {
            id: "FND-2025-006",
            title: "Inconsistent Data Retention Practices",
            description: "Data retention practices vary across departments and are not consistently enforced.",
            severity: "Medium",
            status: "Open",
            framework: "GDPR",
            controlId: "Art.5(1)(e)",
            identifiedDate: "2025-02-05T00:00:00Z",
            dueDate: "2025-04-05T00:00:00Z",
            owner: "Data Governance Team",
            remediationProgress: 45,
            remediationPlan: "Implement automated data retention controls and policies across all systems.",
            assessmentId: "ASM-2025-002"
          },
          {
            id: "FND-2025-007",
            title: "Insufficient PCI Network Segmentation",
            description: "Network segmentation between cardholder data environment and other networks requires improvement.",
            severity: "High",
            status: "Open",
            framework: "PCI DSS",
            controlId: "1.3",
            identifiedDate: "2025-02-20T00:00:00Z",
            dueDate: "2025-04-20T00:00:00Z",
            owner: "Network Security Team",
            remediationProgress: 65,
            remediationPlan: "Enhance network segmentation controls and validate with penetration testing.",
            assessmentId: "ASM-2025-003"
          },
          {
            id: "FND-2024-033",
            title: "PHI Access Controls Deficiency",
            description: "Access controls for systems containing PHI do not enforce principle of least privilege.",
            severity: "Critical",
            status: "Open",
            framework: "HIPAA",
            controlId: "164.312(a)(1)",
            identifiedDate: "2024-11-25T00:00:00Z",
            dueDate: "2025-01-25T00:00:00Z",
            owner: "IT Security Manager",
            remediationProgress: 85,
            remediationPlan: "Implement role-based access control and complete access review for all PHI systems.",
            assessmentId: "ASM-2024-011"
          },
          {
            id: "FND-2024-034",
            title: "Incomplete PHI Encryption",
            description: "Not all PHI data is encrypted at rest in accordance with HIPAA requirements.",
            severity: "High",
            status: "Open",
            framework: "HIPAA",
            controlId: "164.312(a)(2)(iv)",
            identifiedDate: "2024-11-25T00:00:00Z",
            dueDate: "2025-03-25T00:00:00Z",
            owner: "IT Security Manager",
            remediationProgress: 70,
            remediationPlan: "Implement encryption for all PHI data stores and validate implementation.",
            assessmentId: "ASM-2024-011"
          },
          {
            id: "FND-2024-028",
            title: "Insufficient Incident Response Testing",
            description: "Incident response procedures are not regularly tested through simulations or exercises.",
            severity: "Medium",
            status: "Closed",
            framework: "NIST CSF",
            controlId: "RS.RP-1",
            identifiedDate: "2024-10-15T00:00:00Z",
            closedDate: "2025-01-15T00:00:00Z",
            owner: "Security Operations",
            remediationProgress: 100,
            assessmentId: "ASM-2024-010"
          },
          {
            id: "FND-2024-029",
            title: "Incomplete Asset Inventory",
            description: "Asset inventory does not include all systems and applications in the environment.",
            severity: "High",
            status: "Open",
            framework: "NIST CSF",
            controlId: "ID.AM-1",
            identifiedDate: "2024-10-15T00:00:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            owner: "IT Operations",
            remediationProgress: 75,
            remediationPlan: "Implement automated asset discovery and management system.",
            assessmentId: "ASM-2024-010"
          },
          {
            id: "FND-2024-030",
            title: "Inadequate Supply Chain Risk Management",
            description: "Supply chain risk assessment and management processes are insufficient.",
            severity: "Medium",
            status: "Open",
            framework: "NIST CSF",
            controlId: "ID.SC-1",
            identifiedDate: "2024-10-15T00:00:00Z",
            dueDate: "2025-04-15T00:00:00Z",
            owner: "Procurement Team",
            remediationProgress: 30,
            remediationPlan: "Develop comprehensive supply chain risk management program.",
            assessmentId: "ASM-2024-010"
          },
          {
            id: "FND-2025-008",
            title: "Consumer Request Process Gaps",
            description: "Process for handling consumer rights requests lacks verification procedures.",
            severity: "Medium",
            status: "Closed",
            framework: "CCPA",
            controlId: "1798.130",
            identifiedDate: "2025-01-30T00:00:00Z",
            closedDate: "2025-02-28T00:00:00Z",
            owner: "Privacy Office",
            remediationProgress: 100,
            assessmentId: "ASM-2025-004"
          },
          {
            id: "FND-2025-009",
            title: "AI Model Documentation Insufficient",
            description: "Documentation for high-risk AI models lacks transparency on training data and decision processes.",
            severity: "High",
            status: "Open",
            framework: "EU AI Act",
            controlId: "Art.13",
            identifiedDate: "2025-02-12T00:00:00Z",
            dueDate: "2025-05-12T00:00:00Z",
            owner: "AI Development Team",
            remediationProgress: 40,
            remediationPlan: "Develop comprehensive documentation for all high-risk AI models.",
            assessmentId: "ASM-2025-005"
          },
          {
            id: "FND-2025-010",
            title: "AI Risk Assessment Methodology Incomplete",
            description: "Risk assessment methodology for AI systems does not cover all required dimensions.",
            severity: "Medium",
            status: "Open",
            framework: "EU AI Act",
            controlId: "Art.9",
            identifiedDate: "2025-02-12T00:00:00Z",
            dueDate: "2025-05-12T00:00:00Z",
            owner: "AI Ethics Committee",
            remediationProgress: 25,
            remediationPlan: "Develop comprehensive AI risk assessment methodology and tooling.",
            assessmentId: "ASM-2025-005"
          }
        ];
        
        // Calculate overall stats
        const totalFrameworks = mockFrameworks.length;
        const activeFrameworks = mockFrameworks.filter(f => f.complianceScore !== undefined).length;
        
        const totalAssessments = mockAssessments.length;
        const completedAssessments = mockAssessments.filter(a => 
          a.status === 'Compliant' || a.status === 'Non-Compliant'
        ).length;
        
        const openFindings = mockFindings.filter(f => f.status === 'Open' || f.status === 'In Review').length;
        const highPriorityFindings = mockFindings.filter(f => 
          (f.status === 'Open' || f.status === 'In Review') &&
          (f.severity === 'Critical' || f.severity === 'High')
        ).length;
        
        // Calculate average compliance score across frameworks
        const frameworkScores = mockFrameworks.filter(f => f.complianceScore !== undefined).map(f => f.complianceScore as number);
        const averageComplianceScore = frameworkScores.length > 0 
          ? Math.round(frameworkScores.reduce((a, b) => a + b, 0) / frameworkScores.length) 
          : 0;
        
        const frameworksWithIssues = new Set(
          mockFindings
            .filter(f => f.status === 'Open' || f.status === 'In Review')
            .map(f => f.framework)
        ).size;
        
        // Total count of controls assessed across all frameworks
        const controlsAssessed = mockFrameworks.reduce((sum, fw) => 
          sum + (fw.controlStats?.totalControls || 0), 0
        );
        
        // Calculate overall compliance percentage
        const overallCompliance = Math.round(averageComplianceScore);
        
        const stats: ComplianceStats = {
          overallCompliance,
          openFindings,
          highPriorityFindings,
          totalFrameworks,
          activeFrameworks,
          totalAssessments,
          completedAssessments,
          averageComplianceScore,
          frameworksWithIssues,
          controlsAssessed
        };
        
        setData({
          frameworks: mockFrameworks,
          assessments: mockAssessments,
          findings: mockFindings,
          stats
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch compliance data'));
        console.error('Error fetching compliance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
