import { useState, useEffect } from 'react';

export interface Person {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
}

export interface TimelineEvent {
  timestamp: string;
  description: string;
  user: string;
  type: 'status_change' | 'comment' | 'action' | 'assignment' | 'other';
}

export interface Action {
  id: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
}

export interface IncidentDetails {
  id: string;
  referenceId: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Pending Review' | 'Resolved' | 'Closed';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: string;
  impact?: string;
  reportedAt: string;
  reportedBy: Person;
  assignedTo?: Person;
  dueDate?: string;
  relatedFrameworks?: string[];
  timeline?: TimelineEvent[];
  actions?: Action[];
}

interface ComplianceIncidentsData {
  incidents: IncidentDetails[];
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  criticalIncidents: number;
}

export function useComplianceIncidents() {
  const [data, setData] = useState<ComplianceIncidentsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const currentUser = { id: "user-001", name: "Alex Schell", username: "alschell" };
  
  useEffect(() => {
    const fetchComplianceIncidents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock incidents data
        const mockIncidents: IncidentDetails[] = [
          {
            id: "incident-001",
            referenceId: "INC-2025-001",
            title: "Unauthorized Data Access by Third Party Vendor",
            description: "Third-party analytics provider accessed customer data beyond the scope permitted in the data processing agreement. Potential violation of data processing limitations.",
            status: "In Progress",
            severity: "High",
            type: "Data Privacy",
            impact: "Moderate - Affects non-sensitive data of approximately 1,200 users",
            reportedAt: "2025-03-01T14:30:00Z",
            reportedBy: {
              id: "user-002",
              name: "Jordan Lee",
              avatarUrl: "/avatars/jordan-lee.png"
            },
            assignedTo: {
              id: "user-003",
              name: "Taylor Wong",
              avatarUrl: "/avatars/taylor-wong.png"
            },
            dueDate: "2025-03-10T23:59:59Z",
            relatedFrameworks: ["GDPR", "ISO 27001"],
            timeline: [
              {
                timestamp: "2025-03-01T14:30:00Z",
                description: "Incident reported by Jordan Lee",
                user: "Jordan Lee",
                type: "comment"
              },
              {
                timestamp: "2025-03-01T15:45:00Z",
                description: "Incident assigned to Taylor Wong",
                user: "Morgan Smith",
                type: "assignment"
              },
              {
                timestamp: "2025-03-02T09:15:00Z",
                description: "Investigation started. Contacted vendor for explanation and access logs.",
                user: "Taylor Wong",
                type: "comment"
              },
              {
                timestamp: "2025-03-03T16:30:00Z",
                description: "Status changed from Open to In Progress",
                user: "Taylor Wong",
                type: "status_change"
              }
            ],
            actions: [
              {
                id: "action-001",
                description: "Revoke vendor's excessive access permissions",
                dueDate: "2025-03-05T23:59:59Z",
                assignedTo: "Taylor Wong",
                completed: true
              },
              {
                id: "action-002",
                description: "Conduct audit of all data accessed by vendor",
                dueDate: "2025-03-08T23:59:59Z",
                assignedTo: "Security Team",
                completed: false
              },
              {
                id: "action-003",
                description: "Update Data Processing Agreement with vendor",
                dueDate: "2025-03-15T23:59:59Z",
                assignedTo: "Legal Team",
                completed: false
              }
            ]
          },
          {
            id: "incident-002",
            referenceId: "INC-2025-002",
            title: "Delayed Security Patch Implementation",
            description: "Critical security patches for cloud infrastructure were not applied within the required 30-day window per compliance requirements.",
            status: "Open",
            severity: "Critical",
            type: "Security Compliance",
            reportedAt: "2025-03-03T10:15:00Z",
            reportedBy: {
              id: "user-004",
              name: "Riley Johnson",
              avatarUrl: "/avatars/riley-johnson.png"
            },
            relatedFrameworks: ["SOC 2", "ISO 27001", "NIST CSF"],
            timeline: [
              {
                timestamp: "2025-03-03T10:15:00Z",
                description: "Incident reported during routine compliance check",
                user: "Riley Johnson",
                type: "comment"
              },
              {
                timestamp: "2025-03-04T09:00:00Z",
                description: "Preliminary assessment complete - affected systems identified",
                user: "Security Team",
                type: "comment"
              }
            ],
            actions: [
              {
                id: "action-004",
                description: "Apply all missing security patches immediately",
                dueDate: "2025-03-06T23:59:59Z",
                assignedTo: "IT Operations",
                completed: false
              },
              {
                id: "action-005",
                description: "Review and update patch management process",
                dueDate: "2025-03-20T23:59:59Z",
                assignedTo: "IT Management",
                completed: false
              }
            ]
          },
          {
            id: "incident-003",
            referenceId: "INC-2025-003",
            title: "AI Model Documentation Gap",
            description: "Documentation for the customer churn prediction AI model is missing required information about fairness testing and bias mitigation methods.",
            status: "Pending Review",
            severity: "Medium",
            type: "AI Governance",
            reportedAt: "2025-02-28T13:45:00Z",
            reportedBy: {
              id: "user-001",
              name: "Alex Schell",
              username: "alschell",
              avatarUrl: "/avatars/alex-schell.png"
            },
            assignedTo: {
              id: "user-005",
              name: "Blake Chen",
              avatarUrl: "/avatars/blake-chen.png"
            },
            dueDate: "2025-03-15T23:59:59Z",
            relatedFrameworks: ["EU AI Act", "Internal AI Policy"],
            timeline: [
              {
                timestamp: "2025-02-28T13:45:00Z",
                description: "Documentation issue identified during AI inventory review",
                user: "Alex Schell",
                type: "comment"
              },
              {
                timestamp: "2025-02-28T14:30:00Z",
                description: "Assigned to AI Ethics team for remediation",
                user: "Alex Schell",
                type: "assignment"
              },
              {
                timestamp: "2025-03-02T11:20:00Z",
                description: "Initial fairness tests conducted and documented",
                user: "Blake Chen",
                type: "comment"
              },
              {
                timestamp: "2025-03-04T15:10:00Z",
                description: "Status updated to Pending Review - awaiting final approval",
                user: "Blake Chen",
                type: "status_change"
              }
            ],
            actions: [
              {
                id: "action-006",
                description: "Complete fairness assessment documentation",
                dueDate: "2025-03-05T23:59:59Z",
                assignedTo: "Blake Chen",
                completed: true
              },
              {
                id: "action-007",
                description: "Update AI model inventory with documentation link",
                dueDate: "2025-03-08T23:59:59Z",
                assignedTo: "Blake Chen",
                completed: true
              },
              {
                id: "action-008",
                description: "Schedule independent review of documentation",
                dueDate: "2025-03-10T23:59:59Z",
                assignedTo: "Compliance Team",
                completed: false
              }
            ]
          },
          {
            id: "incident-004",
            referenceId: "INC-2025-004",
            title: "Missing Data Subject Access Request Response",
            description: "A data subject access request
