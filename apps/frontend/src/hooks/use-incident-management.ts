import { useState, useEffect } from 'react';

export interface Incident {
  id: string;
  title: string;
  description?: string;
  category: 'Security' | 'Data Breach' | 'Compliance' | 'Other';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  reportedBy: string;
  assignedTo?: string;
  resolvedAt?: string;
  closedAt?: string;
  slaDeadline?: string;
  slaPercentage?: number;
  actionsCount?: number;
  containmentActions?: string[];
  remediationPlan?: string;
  affectedSystems?: string[];
  affectedData?: string[];
  regulatoryImpact?: {
    requiresNotification: boolean;
    frameworks: string[];
    notificationDeadline?: string;
    notificationStatus?: 'Pending' | 'Submitted' | 'Not Required';
  };
}

interface IncidentStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  openCritical: number;
  openHigh: number;
  slaBreached: number;
  slaAtRisk: number;
  avgResolutionTime: string;
  totalYear: number;
  yearChange: number;
}

interface IncidentManagementData {
  incidents: Incident[];
  stats: IncidentStats;
  categories: { [key: string]: number };
}

export function useIncidentManagement() {
  const [data, setData] = useState<IncidentManagementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T09:49:31Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock incident data
        const mockIncidents: Incident[] = [
          {
            id: "INC-2025-0034",
            title: "Unauthorized Access to Customer Database",
            description: "An unauthorized IP address accessed the customer database. Anomalous query patterns detected.",
            category: "Security",
            severity: "Critical",
            status: "In Progress",
            createdAt: "2025-03-04T16:32:14Z",
            reportedBy: "SecurityMonitoring",
            assignedTo: "Incident Response Team",
            slaDeadline: "2025-03-06T16:32:14Z",
            slaPercentage: 60,
            actionsCount: 8,
            containmentActions: [
              "Blocked suspicious IP address",
              "Revoked compromised credentials",
              "Enabled additional monitoring"
            ],
            remediationPlan: "Full security audit of database access controls and authentication mechanisms.",
            affectedSystems: ["Customer Database", "Authentication Service"],
            affectedData: ["Customer PII"],
            regulatoryImpact: {
              requiresNotification: true,
              frameworks: ["GDPR", "CPRA"],
              notificationDeadline: "2025-03-14T16:32:14Z",
              notificationStatus: "Pending"
            }
          },
          {
            id: "INC-2025-0033",
            title: "GDPR Data Subject Request Delayed Response",
            description: "We failed to respond to a data subject access request within the required 30-day timeframe.",
            category: "Compliance",
            severity: "High",
            status: "Open",
            createdAt: "2025-03-03T10:15:22Z",
            reportedBy: "PrivacyTeam",
            assignedTo: "Privacy Officer",
            slaDeadline: "2025-03-08T10:15:22Z",
            slaPercentage: 40,
            actionsCount: 2,
            affectedData: ["User Account Information"],
            regulatoryImpact: {
              requiresNotification: false,
              frameworks: ["GDPR"],
              notificationStatus: "Not Required"
            }
          },
          {
            id: "INC-2025-0032",
            title: "Vendor Security Assessment Failure",
            description: "Critical vendor failed security assessment with multiple high-risk findings.",
            category: "Compliance",
            severity: "High",
            status: "In Progress",
            createdAt: "2025-03-02T14:45:30Z",
            reportedBy: "VendorManagement",
            assignedTo: "Risk Management Team",
            slaDeadline: "2025-03-09T14:45:30Z",
            slaPercentage: 35,
            actionsCount: 3,
            remediationPlan: "Develop remediation plan with vendor and conduct follow-up assessment."
          },
          {
            id: "INC-2025-0031",
            title: "Potential PII Data Leak in Log Files",
            description: "PII data was found in application logs. Initial investigation suggests approximately 50 customer records affected.",
            category: "Data Breach",
            severity: "Medium",
            status: "Open",
            createdAt: "2025-03-01T09:22:17Z",
            reportedBy: "DevOps",
            assignedTo: "Development Team",
            slaDeadline: "2025-03-11T09:22:17Z",
            slaPercentage: 25,
            actionsCount: 4,
            containmentActions: [
              "Removed sensitive logs",
              "Applied log sanitization",
              "Scanned all log storage for additional instances"
            ],
            affectedData: ["Customer Email Addresses", "Customer Names"],
            regulatoryImpact: {
              requiresNotification: false,
              frameworks: ["GDPR", "CPRA"],
              notificationStatus: "Not Required"
            }
          },
          {
            id: "INC-2025-0030",
            title: "Security Certificate Expiration",
            description: "A security certificate expired leading to brief service disruption.",
            category: "Security",
            severity: "Medium",
            status: "Resolved",
            createdAt: "2025-02-28T18:10:45Z",
            reportedBy: "MonitoringSystem",
            assignedTo: "IT Operations",
            resolvedAt: "2025-03-01T06:30:12Z",
            actionsCount: 1,
            containmentActions: [
              "Renewed certificate",
              "Deployed updated certificate"
            ],
            affectedSystems: ["API Gateway"]
          },
          {
            id: "INC-2025-0029",
            title: "AI Model Bias Detection",
            description: "Compliance audit detected potential bias in AI model outputs for certain demographic groups.",
            category: "Compliance",
            severity: "Medium",
            status: "In Progress",
            createdAt: "2025-02-26T11:05:38Z",
            reportedBy: "AIEthicsCommittee",
            assignedTo: "AI Development Team",
            slaDeadline: "2025-03-12T11:05:38Z",
            slaPercentage: 55,
            actionsCount: 5,
            remediationPlan: "Review training data for biases and implement fairness constraints in the model.",
            regulatoryImpact: {
              requiresNotification: false,
              frameworks: ["EU AI Act"],
              notificationStatus: "Not Required"
            }
          },
          {
            id: "INC-2025-0028",
            title: "Brute Force Authentication Attempts",
            description: "Multiple brute force authentication attempts detected from several IPs.",
            category: "Security",
            severity: "Medium",
            status: "Resolved",
            createdAt: "2025-02-25T08:30:15Z",
            reportedBy: "SecurityMonitoring",
            assignedTo: "Security Team",
            resolvedAt: "2025-02-26T14:40:22Z",
            actionsCount: 3,
            containmentActions: [
              "Blocked attacking IP addresses",
              "Implemented rate limiting",
              "Enhanced monitoring for affected accounts"
            ],
            affectedSystems: ["Authentication Service"]
          },
          {
            id: "INC-2025-0027",
            title: "Data Retention Policy Violation",
            description: "Audit discovered customer data being retained beyond the period specified in our data retention policy.",
            category: "Compliance",
            severity: "Medium",
            status: "Closed",
            createdAt: "2025-02-24T13:20:45Z",
            reportedBy: "InternalAudit",
            assignedTo: "Data Governance Team",
            resolvedAt: "2025-02-28T09:15:30Z",
            closedAt: "2025-03-01T11:30:00Z",
            actionsCount: 2,
            remediationPlan: "Implemented automated data purging process and scheduling quarterly audits.",
            regulatoryImpact: {
              requiresNotification: false,
              frameworks: ["GDPR", "CPRA"],
              notificationStatus: "Not Required"
            }
          },
          {
            id: "INC-2025-0026",
            title: "Third-Party API Excessive Data Access",
            description: "Audit logging revealed a third-party integration accessing more user data than necessary for its function.",
            category: "Data Breach",
            severity: "High",
            status: "Closed",
            createdAt: "2025-02-20T10:45:12Z",
            reportedBy: "SecurityTeam",
            assignedTo: "API Team",
            resolvedAt: "2025-02-25T16:30:45Z",
            closedAt: "2025-02-26T14:20:10Z",
            actionsCount: 4,
            containmentActions: [
              "Restricted API permissions",
              "Implemented more granular access controls"
            ],
            remediationPlan: "Review and update all third-party integrations with principle of least privilege.",
            regulatoryImpact: {
              requiresNotification: true,
              frameworks: ["GDPR"],
              notificationDeadline: "2025-03-22T10:45:12Z",
              notificationStatus: "Submitted"
            }
          },
          {
            id: "INC-2025-0025",
            title: "Employee Access Control Misconfiguration",
            description: "Several employees had excessive permissions to sensitive systems due to role configuration error.",
            category: "Security",
            severity: "Low",
            status: "Closed",
            createdAt: "2025-02-18T09:30:20Z",
            reportedBy: "ITOperations",
            assignedTo: "IT Access Management",
            resolvedAt: "2025-02-19T15:20:45Z",
            closedAt: "2025-02-20T10:15:30Z",
            actionsCount: 1,
            containmentActions: [
              "Corrected role configurations",
              "Reviewed access logs for unauthorized activity"
            ]
          }
        ];
        
        // Calculate SLA percentages based on current time
        mockIncidents.forEach(incident => {
          if ((incident.status === 'Open' || incident.status === 'In Progress') && incident.slaDeadline) {
            const createdTime = new Date(incident.createdAt).getTime();
            const deadlineTime = new Date(incident.slaDeadline).getTime();
            const currentTime = currentDate.getTime();
            const totalDuration = deadlineTime - createdTime;
            const elapsedDuration = currentTime - createdTime;
            
            // Calculate percentage of SLA time used
            const percentageUsed = Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
            incident.slaPercentage = percentageUsed;
          }
        });
        
        // Calculate stats
        const open = mockIncidents.filter(i => i.status === 'Open').length;
        const inProgress = mockIncidents.filter(i => i.status === 'In Progress').length;
        const resolved = mockIncidents.filter(i => i.status === 'Resolved').length;
        const closed = mockIncidents.filter(i => i.status === 'Closed').length;
        
        const openIncidents = mockIncidents.filter(i => i.status === 'Open' || i.status === 'In Progress');
        const openCritical = openIncidents.filter(i => i.severity === 'Critical').length;
        const openHigh = openIncidents.filter(i => i.severity === 'High').length;
        
        // Count SLA breached and at-risk incidents
        let slaBreached = 0;
        let slaAtRisk = 0;
        
        openIncidents.forEach(incident => {
          if (incident.slaDeadline) {
            const deadlineTime = new Date(incident.slaDeadline).getTime();
            const currentTime = currentDate.getTime();
            const hoursLeft = (deadlineTime - currentTime) / (1000 * 60 * 60);
            
            if (hoursLeft < 0) {
              slaBreached++;
            } else if (hoursLeft < 24) {
              slaAtRisk++;
            }
          }
        });
        
        // Calculate average resolution time for resolved incidents
        const resolvedIncidents = mockIncidents.filter(i => i.resolvedAt && i.createdAt);
        let totalResolutionHours = 0;
        
        resolvedIncidents.forEach(incident => {
          const createdTime = new Date(incident.createdAt).getTime();
          const resolvedTime = new Date(incident.resolvedAt!).getTime();
          const resolutionHours = (resolvedTime - createdTime) / (1000 * 60 * 60);
          totalResolutionHours += resolutionHours;
        });
        
        const avgResolutionHours = resolvedIncidents.length > 0 ? 
          totalResolutionHours / resolvedIncidents.length : 0;
        
        // Format as "XX hours" or "XX days, YY hours"
        let avgResolutionTime = "N/A";
        if (resolvedIncidents.length > 0) {
          if (avgResolutionHours < 24) {
            avgResolutionTime = `${Math.round(avgResolutionHours)} hours`;
          } else {
            const days = Math.floor(avgResolutionHours / 24);
            const hours = Math.round(avgResolutionHours % 24);
            avgResolutionTime = `${days} days, ${hours} hours`;
          }
        }
        
        // Calculate year-to-date incidents
        const currentYear = currentDate.getFullYear();
        const totalYear = mockIncidents.filter(i => 
          new Date(i.createdAt).getFullYear() === currentYear
        ).length;
        
        // Mock year-over-year change (would be calculated from historical data)
        const yearChange = 12; // 12% increase
        
        // Calculate category distribution
        const categories: { [key: string]: number } = {};
        mockIncidents.forEach(incident => {
          categories[incident.category] = (categories[incident.category] || 0) + 1;
        });
        
        const stats: IncidentStats = {
          total: mockIncidents.length,
          open,
          inProgress,
          resolved,
          closed,
          openCritical,
          openHigh,
          slaBreached,
          slaAtRisk,
          avgResolutionTime,
          totalYear,
          yearChange
        };
        
        setData({
          incidents: mockIncidents,
          stats,
          categories
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch incident data'));
        console.error('Error fetching incident data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
