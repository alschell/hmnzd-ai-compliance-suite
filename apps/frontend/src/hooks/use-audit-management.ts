import { useState, useEffect } from 'react';

export interface Audit {
  id: string;
  name: string;
  framework: string;
  type: 'Internal' | 'External';
  status: 'Planned' | 'In Progress' | 'Completed';
  startDate: string;
  endDate?: string;
  auditor: string;
  scope?: string;
  description?: string;
  findingStats?: {
    open: number;
    inRemediation: number;
    closed: number;
  };
}

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  description?: string;
  control: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Remediation' | 'Remediated' | 'Accepted';
  owner?: string;
  identifiedDate: string;
  remediationDueDate?: string;
  remediationPlan?: string;
  remediationProgress?: number;
  lastUpdated?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface AuditStats {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  openFindings: number;
  criticalFindings: number;
  highFindings: number;
  inRemediationFindings: number;
  remediatedFindings: number;
  remediationProgress: number;
  completedThisYear: number;
  plannedThisYear: number;
  nextAuditDate: string;
}

interface AuditManagementData {
  audits: Audit[];
  findings: Finding[];
  stats: AuditStats;
}

export function useAuditManagement() {
  const [data, setData] = useState<AuditManagementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T09:53:11Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchAuditData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock audit data
        const mockAudits: Audit[] = [
          {
            id: "AUD-2025-001",
            name: "SOC 2 Type II Annual Audit",
            framework: "SOC 2",
            type: "External",
            status: "Planned",
            startDate: "2025-04-10T00:00:00Z",
            endDate: "2025-05-15T00:00:00Z",
            auditor: "PricewaterhouseCoopers",
            scope: "Trust Services Criteria",
            description: "Annual SOC 2 Type II audit covering security, availability, and confidentiality trust services criteria.",
            findingStats: {
              open: 0,
              inRemediation: 0,
              closed: 0
            }
          },
          {
            id: "AUD-2025-002",
            name: "ISO 27001 Surveillance Audit",
            framework: "ISO 27001",
            type: "External",
            status: "Planned",
            startDate: "2025-06-05T00:00:00Z",
            endDate: "2025-06-20T00:00:00Z",
            auditor: "BSI Group",
            scope: "Information Security Management System",
            description: "Annual surveillance audit for ISO 27001:2022 certification.",
            findingStats: {
              open: 0,
              inRemediation: 0,
              closed: 0
            }
          },
          {
            id: "AUD-2025-003",
            name: "GDPR Compliance Assessment",
            framework: "GDPR",
            type: "Internal",
            status: "In Progress",
            startDate: "2025-02-15T00:00:00Z",
            endDate: "2025-03-20T00:00:00Z",
            auditor: "Internal Privacy Team",
            scope: "Data Processing Operations",
            description: "Internal assessment of GDPR compliance for data processing activities.",
            findingStats: {
              open: 3,
              inRemediation: 2,
              closed: 1
            }
          },
          {
            id: "AUD-2025-004",
            name: "AI Risk Assessment",
            framework: "EU AI Act",
            type: "Internal",
            status: "In Progress",
            startDate: "2025-03-01T00:00:00Z",
            endDate: "2025-03-25T00:00:00Z",
            auditor: "AI Ethics Committee",
            scope: "AI Systems and Processes",
            description: "Assessment of AI systems against EU AI Act requirements and ethical guidelines.",
            findingStats: {
              open: 2,
              inRemediation: 3,
              closed: 0
            }
          },
          {
            id: "AUD-2025-005",
            name: "Security Controls Assessment",
            framework: "NIST CSF",
            type: "Internal",
            status: "Completed",
            startDate: "2025-01-10T00:00:00Z",
            endDate: "2025-02-05T00:00:00Z",
            auditor: "Security Team",
            scope: "Security Controls Implementation",
            description: "Assessment of security controls based on NIST Cybersecurity Framework.",
            findingStats: {
              open: 0,
              inRemediation: 5,
              closed: 7
            }
          },
          {
            id: "AUD-2024-012",
            name: "PCI DSS Compliance Audit",
            framework: "PCI DSS",
            type: "External",
            status: "Completed",
            startDate: "2024-11-15T00:00:00Z",
            endDate: "2024-12-20T00:00:00Z",
            auditor: "TrustWave",
            scope: "Cardholder Data Environment",
            description: "Annual PCI DSS assessment for merchant compliance.",
            findingStats: {
              open: 0,
              inRemediation: 0,
              closed: 5
            }
          },
          {
            id: "AUD-2024-011",
            name: "HIPAA Security Assessment",
            framework: "HIPAA",
            type: "Internal",
            status: "Completed",
            startDate: "2024-10-01T00:00:00Z",
            endDate: "2024-10-25T00:00:00Z",
            auditor: "Compliance Team",
            scope: "PHI Handling Processes",
            description: "Assessment of HIPAA security rule compliance for PHI handling processes.",
            findingStats: {
              open: 0,
              inRemediation: 1,
              closed: 3
            }
          }
        ];
        
        // Mock findings data
        const mockFindings: Finding[] = [
          {
            id: "FND-2025-0015",
            auditId: "AUD-2025-004",
            title: "AI Model Documentation Insufficient",
            description: "The documentation for high-risk AI models lacks adequate explanation of the model's decision-making process and potential biases.",
            control: "AI.GOV.2 - AI Documentation",
            severity: "High",
            status: "Open",
            owner: "AI Development Team",
            identifiedDate: "2025-03-03T14:30:00Z",
            remediationDueDate: "2025-03-25T00:00:00Z",
            remediationPlan: "Create comprehensive model documentation including model cards with details on training data, performance metrics, limitations, and potential biases.",
            lastUpdated: "2025-03-04T09:15:22Z"
          },
          {
            id: "FND-2025-0014",
            auditId: "AUD-2025-004",
            title: "Inadequate Human Oversight for Critical AI Decisions",
            description: "Critical decisions made by AI systems lack sufficient human oversight mechanisms.",
            control: "AI.GOV.5 - Human Oversight",
            severity: "Critical",
            status: "Open",
            owner: "Operations Team",
            identifiedDate: "2025-03-02T16:45:00Z",
            remediationDueDate: "2025-03-15T00:00:00Z",
            remediationPlan: "Implement human-in-the-loop controls for all critical AI decisions and establish an oversight committee.",
            lastUpdated: "2025-03-05T08:30:12Z"
          },
          {
            id: "FND-2025-0013",
            auditId: "AUD-2025-004",
            title: "AI Risk Assessment Framework Incomplete",
            description: "The current risk assessment framework does not adequately address AI-specific risks.",
            control: "AI.GOV.1 - Risk Assessment",
            severity: "Medium",
            status: "In Remediation",
            owner: "Risk Management Team",
            identifiedDate: "2025-03-02T11:20:00Z",
            remediationDueDate: "2025-03-30T00:00:00Z",
            remediationPlan: "Expand risk assessment framework to include AI-specific risk categories and controls.",
            remediationProgress: 40,
            lastUpdated: "2025-03-04T15:45:33Z"
          },
          {
            id: "FND-2025-0012",
            auditId: "AUD-2025-004",
            title: "Inadequate Testing for AI Bias",
            description: "Insufficient testing procedures to identify and mitigate bias in AI algorithms.",
            control: "AI.GOV.3 - Fairness & Non-discrimination",
            severity: "High",
            status: "In Remediation",
            owner: "Quality Assurance Team",
            identifiedDate: "2025-03-01T14:10:00Z",
            remediationDueDate: "2025-03-20T00:00:00Z",
            remediationPlan: "Implement comprehensive bias testing protocols and establish ongoing monitoring.",
            remediationProgress: 65,
            lastUpdated: "2025-03-05T08:15:44Z"
          },
          {
            id: "FND-2025-0011",
            auditId: "AUD-2025-004",
            title: "Missing AI Training Data Management Controls",
            description: "Lack of controls for ensuring quality, relevance, and bias-free training data.",
            control: "AI.GOV.4 - Data Governance",
            severity: "Medium",
            status: "In Remediation",
            owner: "Data Science Team",
            identifiedDate: "2025-03-01T10:30:00Z",
            remediationDueDate: "2025-03-25T00:00:00Z",
            remediationPlan: "Establish comprehensive data management procedures for AI training datasets.",
            remediationProgress: 50,
            lastUpdated: "2025-03-04T11:20:18Z"
          },
          {
            id: "FND-2025-0010",
            auditId: "AUD-2025-003",
            title: "Incomplete Data Processing Records",
            description: "Records of processing activities do not include all required information under GDPR Article 30.",
            control: "GDPR.DOC.1 - Records of Processing",
            severity: "High",
            status: "Open",
            owner: "Privacy Office",
            identifiedDate: "2025-02-25T14:20:00Z",
            remediationDueDate: "2025-03-15T00:00:00Z",
            remediationPlan: "Update records of processing activities with all required information.",
            lastUpdated: "2025-03-03T09:45:10Z"
          },
          {
            id: "FND-2025-0009",
            auditId: "AUD-2025-003",
            title: "Data Subject Request Process Deficiencies",
            description: "The current process for handling data subject requests does not ensure timely responses within the required 30-day period.",
            control: "GDPR.DSR.1 - Request Handling",
            severity: "Critical",
            status: "Open",
            owner: "Privacy Office",
            identifiedDate: "2025-02-24T11:15:00Z",
            remediationDueDate: "2025-03-10T00:00:00Z",
            remediationPlan: "Implement automated tracking system for data subject requests with alerts for approaching deadlines.",
            lastUpdated: "2025-03-02T16:30:22Z"
          },
          {
            id: "FND-2025-0008",
            auditId: "AUD-2025-003",
            title: "Third-Party Processor Agreements Incomplete",
            description: "Several data processor agreements are missing required GDPR clauses.",
            control: "GDPR.TPA.1 - Processor Agreements",
            severity: "Medium",
            status: "In Remediation",
            owner: "Legal Team",
            identifiedDate: "2025-02-23T09:30:00Z",
            remediationDueDate: "2025-03-25T00:00:00Z",
            remediationPlan: "Review and update all processor agreements to include required GDPR clauses.",
            remediationProgress: 30,
            lastUpdated: "2025-03-04T14:15:55Z"
          },
          {
            id: "FND-2025-0007",
            auditId: "AUD-2025-003",
            title: "Privacy Notice Outdated",
            description: "The privacy notice does not reflect current data processing activities.",
            control: "GDPR.TRA.2 - Transparency",
            severity: "Medium",
            status: "Open",
            owner: "Privacy Office",
            identifiedDate: "2025-02-22T15:40:00Z",
            remediationDueDate: "2025-03-20T00:00:00Z",
            remediationPlan: "Update privacy notice to accurately reflect all data processing activities.",
            lastUpdated: "2025-02-28T10:20:33Z"
          },
          {
            id: "FND-2025-0006",
            auditId: "AUD-2025-003",
            title: "DPIA Process Not Consistently Applied",
            description: "Data Protection Impact Assessments not consistently performed for high-risk processing activities.",
            control: "GDPR.PIA.1 - Impact Assessment",
            severity: "High",
            status: "In Remediation",
            owner: "Privacy Office",
            identifiedDate: "2025-02-20T13:25:00Z",
            remediationDueDate: "2025-03-15T00:00:00Z",
            remediationPlan: "Implement automated triggers for DPIA requirement evaluation in project management system.",
            remediationProgress: 80,
            lastUpdated: "2025-03-05T08:45:12Z"
          },
          {
            id: "FND-2025-0005",
            auditId: "AUD-2025-003",
            title: "Data Retention Policy Implementation Gaps",
            description: "Data retention periods not enforced consistently across all systems.",
            control: "GDPR.RET.1 - Data Retention",
            severity: "Medium",
            status: "Remediated",
            owner: "Data Governance Team",
            identifiedDate: "2025-02-18T10:15:00Z",
            remediationDueDate: "2025-03-10T00:00:00Z",
            remediationPlan: "Implement automated data purging mechanisms across all systems.",
            remediationProgress: 100,
            lastUpdated: "2025-03-04T16:10:45Z"
          }
        ];
        
        // Calculate audit statistics
        const plannedAudits = mockAudits.filter(audit => audit.status === 'Planned');
        const inProgressAudits = mockAudits.filter(audit => audit.status === 'In Progress');
        const completedAudits = mockAudits.filter(audit => audit.status === 'Completed');
        
        // Get current year
        const currentYear = currentDate.getFullYear();
        
        // Find completed and planned audits for current year
        const completedThisYear = mockAudits.filter(audit => 
          audit.status === 'Completed' && 
          new Date(audit.endDate || '').getFullYear() === currentYear
        ).length;
        
        const plannedThisYear = mockAudits.filter(audit => 
          (new Date(audit.startDate).getFullYear() === currentYear) &&
          (audit.status === 'Planned' || audit.status === 'In Progress' || 
           (audit.status === 'Completed' && new Date(audit.endDate || '').getFullYear() === currentYear))
        ).length;
        
        // Finding statistics
        const openFindings = mockFindings.filter(finding => finding.status === 'Open').length;
        const criticalFindings = mockFindings.filter(finding => 
          finding.severity === 'Critical' && 
          (finding.status === 'Open' || finding.status === 'In Remediation')
        ).length;
        
        const highFindings = mockFindings.filter(finding => 
          finding.severity === 'High' && 
          (finding.status === 'Open' || finding.status === 'In Remediation')
        ).length;
        
        const inRemediationFindings = mockFindings.filter(finding => finding.status === 'In Remediation').length;
        const remediatedFindings = mockFindings.filter(finding => 
          finding.status === 'Remediated' || finding.status === 'Accepted'
        ).length;
        
        // Calculate remediation progress
        const totalFindingsWithProgress = mockFindings.filter(finding => 
          finding.status === 'In Remediation' && finding.remediationProgress !== undefined
        );
        
        const remediationProgress = totalFindingsWithProgress.length > 0 
          ? Math.round(totalFindingsWithProgress.reduce((sum, finding) => 
              sum + (finding.remediationProgress || 0), 0) / totalFindingsWithProgress.length)
          : 0;
        
        // Find the next upcoming audit
        const upcomingAudits = mockAudits
          .filter(audit => audit.status === 'Planned')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        const nextAuditDate = upcomingAudits.length > 0 ? upcomingAudits[0].startDate : '';
        
        const stats: AuditStats = {
          total: mockAudits.length,
          planned: plannedAudits.length,
          inProgress: inProgressAudits.length,
          completed: completedAudits.length,
          openFindings,
          criticalFindings,
          highFindings,
          inRemediationFindings,
          remediatedFindings,
          remediationProgress,
          completedThisYear,
          plannedThisYear,
          nextAuditDate
        };
        
        setData({
          audits: mockAudits,
          findings: mockFindings,
          stats
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch audit data'));
        console.error('Error fetching audit data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
