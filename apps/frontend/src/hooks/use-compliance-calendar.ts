import { useState, useEffect } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Deadline' | 'Audit' | 'Review' | 'Renewal' | 'Report' | 'Assessment' | string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  framework?: string;
  owner?: string;
  relatedItems?: {
    type: 'audit' | 'policy' | 'control' | 'task';
    id: string;
    title: string;
  }[];
}

interface ComplianceCalendarData {
  events: CalendarEvent[];
  stats: {
    upcomingEvents: number;
    overdueEvents: number;
    criticalEvents: number;
    thisMonthEvents: number;
    nextMonthEvents: number;
  };
}

export function useComplianceCalendar() {
  const [data, setData] = useState<ComplianceCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T11:56:50Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Generate calendar events - create a mix of past, current and future events
        const mockEvents: CalendarEvent[] = [
          {
            id: "EVT-2025-001",
            title: "Annual SOC 2 Type II Report Submission",
            date: "2025-04-15T00:00:00Z",
            type: "Deadline",
            priority: "critical",
            description: "Submit annual SOC 2 Type II report to key customers and update compliance documentation.",
            framework: "SOC 2",
            owner: "Compliance Team",
            relatedItems: [
              {
                type: "audit",
                id: "AUD-2025-001",
                title: "SOC 2 Type II Annual Audit"
              }
            ]
          },
          {
            id: "EVT-2025-002",
            title: "ISO 27001 Surveillance Audit",
            date: "2025-06-10T00:00:00Z",
            type: "Audit",
            priority: "high",
            description: "Annual surveillance audit for ISO 27001:2022 certification.",
            framework: "ISO 27001",
            owner: "Security Team",
            relatedItems: [
              {
                type: "audit",
                id: "AUD-2025-002",
                title: "ISO 27001 Surveillance Audit"
              }
            ]
          },
          {
            id: "EVT-2025-003",
            title: "GDPR Training Program Review",
            date: "2025-03-25T00:00:00Z",
            type: "Review",
            priority: "medium",
            description: "Annual review of GDPR training materials and compliance program.",
            framework: "GDPR",
            owner: "Privacy Office"
          },
          {
            id: "EVT-2025-004",
            title: "PCI DSS Self-Assessment Questionnaire Due",
            date: "2025-03-31T00:00:00Z",
            type: "Deadline",
            priority: "high",
            description: "Complete and submit annual PCI DSS SAQ-D for merchant compliance.",
            framework: "PCI DSS",
            owner: "Finance Team",
            relatedItems: [
              {
                type: "task",
                id: "TSK-2025-050",
                title: "Complete PCI DSS Self-Assessment"
              }
            ]
          },
          {
            id: "EVT-2025-005",
            title: "Vendor Security Assessment Deadline",
            date: "2025-04-05T00:00:00Z",
            type: "Deadline",
            priority: "medium",
            description: "Complete security assessments for all critical vendors.",
            owner: "Procurement Team"
          },
          {
            id: "EVT-2025-006",
            title: "Business Continuity Plan Test",
            date: "2025-05-15T00:00:00Z",
            type: "Assessment",
            priority: "high",
            description: "Annual test of business continuity and disaster recovery plans.",
            framework: "ISO 22301",
            owner: "Operations Team"
          },
          {
            id: "EVT-2025-007",
            title: "Privacy Impact Assessment for New CRM",
            date: "2025-03-10T00:00:00Z",
            type: "Assessment",
            priority: "high",
            description: "Complete privacy impact assessment for new customer relationship management system.",
            framework: "GDPR",
            owner: "Privacy Office"
          },
          {
            id: "EVT-2025-008",
            title: "TLS Certificate Renewal",
            date: "2025-04-20T00:00:00Z",
            type: "Renewal",
            priority: "critical",
            description: "Renew and deploy TLS certificates for primary domains.",
            owner: "IT Security Team"
          },
          {
            id: "EVT-2025-009",
            title: "Quarterly Security Patch Deadline",
            date: "2025-03-31T00:00:00Z",
            type: "Deadline",
            priority: "high",
            description: "Complete application of all security patches across infrastructure.",
            owner: "IT Operations"
          },
          {
            id: "EVT-2025-010",
            title: "Annual Security Awareness Training Completion",
            date: "2025-05-30T00:00:00Z",
            type: "Deadline",
            priority: "medium",
            description: "Ensure all employees complete annual security awareness training.",
            owner: "Security Team",
            relatedItems: [
              {
                type: "task",
                id: "TSK-2025-055",
                title: "Track Security Awareness Training Completion"
              }
            ]
          },
          {
            id: "EVT-2025-011",
            title: "Access Review - Finance Systems",
            date: "2025-03-15T00:00:00Z",
            type: "Review",
            priority: "high",
            description: "Quarterly review of access rights to financial systems and data.",
            owner: "Finance Team"
          },
          {
            id: "EVT-2025-012",
            title: "Penetration Test Report Due",
            date: "2025-04-10T00:00:00Z",
            type: "Report",
            priority: "high",
            description: "External penetration test report and findings due.",
            owner: "Security Team"
          },
          {
            id: "EVT-2025-013",
            title: "Firewall Rule Review",
            date: "2025-03-20T00:00:00Z",
            type: "Review",
            priority: "medium",
            description: "Quarterly review of firewall rules and network security configurations.",
            owner: "Network Security Team"
          },
          {
            id: "EVT-2025-014",
            title: "HIPAA Compliance Assessment",
            date: "2025-06-25T00:00:00Z",
            type: "Assessment",
            priority: "high",
            description: "Annual assessment of HIPAA compliance for health data processing systems.",
            framework: "HIPAA",
            owner: "Compliance Team"
          },
          {
            id: "EVT-2025-015",
            title: "Data Retention Policy Implementation Deadline",
            date: "2025-03-05T00:00:00Z",
            type: "Deadline",
            priority: "high",
            description: "Complete implementation of automated data retention mechanisms across all systems.",
            framework: "GDPR",
            owner: "Data Governance Team"
          },
          {
            id: "EVT-2025-016",
            title: "Annual Risk Assessment",
            date: "2025-05-01T00:00:00Z",
            type: "Assessment",
            priority: "high",
            description: "Annual enterprise risk assessment and management review.",
            owner: "Risk Management Team"
          },
          {
            id: "EVT-2025-017",
            title: "AI Model Bias Remediation Deadline",
            date: "2025-03-25T00:00:00Z",
            type: "Deadline",
            priority: "high",
            description: "Complete remediation of identified AI model biases and implement bias testing protocols.",
            framework: "EU AI Act",
            owner: "AI Ethics Committee",
            relatedItems: [
              {
                type: "task",
                id: "TSK-2025-033",
                title: "Implement AI Bias Testing Protocols"
              }
            ]
          },
          {
            id: "EVT-2025-018",
            title: "Quarterly Data Privacy Review",
            date: "2025-03-31T00:00:00Z",
            type: "Review",
            priority: "medium",
            description: "Quarterly review of data privacy practices and incident response measures.",
            framework: "GDPR",
            owner: "Privacy Office"
          },
          {
            id: "EVT-2025-019",
            title: "Cyber Insurance Renewal",
            date: "2025-04-30T00:00:00Z",
            type: "Renewal",
            priority: "high",
            description: "Annual renewal of cyber insurance policy.",
            owner: "Finance Team"
          },
          {
            id: "EVT-2025-020",
            title: "Security Awareness Phishing Campaign",
            date: "2025-03-15T00:00:00Z",
            type: "Assessment",
            priority: "medium",
            description: "Conduct quarterly security awareness phishing campaign.",
            owner: "Security Team"
          },
          {
            id: "EVT-2025-021",
            title: "Quarterly Compliance Report to Board",
            date: "2025-04-05T00:00:00Z",
            type: "Report",
            priority: "high",
            description: "Prepare and present quarterly compliance report to board of directors.",
            owner: "Compliance Team"
          },
          {
            id: "EVT-2025-022",
            title: "Third-Party Risk Management Program Review",
            date: "2025-05-10T00:00:00Z",
            type: "Review",
            priority: "medium",
            description: "Annual review of third-party risk management program and procedures.",
            owner: "Procurement Team"
          },
          {
            id: "EVT-2025-023",
            title: "Security Architecture Review",
            date: "2025-04-15T00:00:00Z",
            type: "Review",
            priority: "medium",
            description: "Comprehensive review of security architecture and controls.",
            owner: "Security Team"
          },
          {
            id: "EVT-2025-024",
            title: "Data Subject Request Process Assessment",
            date: "2025-03-12T00:00:00Z",
            type: "Assessment",
            priority: "high",
            description: "Assessment of data subject request handling process and response times.",
            framework: "GDPR",
            owner: "Privacy Office",
            relatedItems: [
              {
                type: "task",
                id: "TSK-2025-040",
                title: "Complete Data Subject Request Process Update"
              }
            ]
          },
          {
            id: "EVT-2024-045",
            title: "PCI DSS Quarterly Vulnerability Scan",
            date: "2025-03-01T00:00:00Z",
            type: "Assessment",
            priority: "medium",
            description: "Complete quarterly external vulnerability scan by ASV for PCI compliance.",
            framework: "PCI DSS",
            owner: "Security Team"
          }
        ];
        
        // Calculate statistics
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = mockEvents.filter(event => new Date(event.date) >= today).length;
        
        const overdueEvents = mockEvents.filter(event => 
          new Date(event.date) < today && 
          event.type.toLowerCase() === 'deadline'
        ).length;
        
        const criticalEvents = mockEvents.filter(event => 
          new Date(event.date) >= today && 
          event.priority === 'critical'
        ).length;
        
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        
        const thisMonthEvents = mockEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === thisMonth && 
                 eventDate.getFullYear() === thisYear;
        }).length;
        
        const nextMonth = (thisMonth + 1) % 12;
        const nextMonthYear = thisMonth === 11 ? thisYear + 1 : thisYear;
        
        const nextMonthEvents = mockEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === nextMonth && 
                 eventDate.getFullYear() === nextMonthYear;
        }).length;
        
        const stats = {
          upcomingEvents,
          overdueEvents,
          criticalEvents,
          thisMonthEvents,
          nextMonthEvents
        };
        
        setData({
          events: mockEvents,
          stats
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch calendar data'));
        console.error('Error fetching calendar data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
