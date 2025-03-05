import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  complianceArea?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  createdBy: string;
  lastUpdated?: string;
  completedAt?: string;
  completedBy?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  relatedItems?: {
    type: 'audit' | 'incident' | 'policy' | 'finding';
    id: string;
    title: string;
  }[];
  comments?: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  overdue: number;
  overdueHighPriority: number;
  dueToday: number;
  dueThisWeek: number;
  completedLast30Days: number;
  completionRate: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

interface TaskManagementData {
  tasks: Task[];
  stats: TaskStats;
  categories: string[];
  complianceAreas: string[];
}

export function useTaskManagement() {
  const [data, setData] = useState<TaskManagementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T09:57:25Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchTaskData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock task data
        const mockTasks: Task[] = [
          {
            id: "TSK-2025-0042",
            title: "Update Data Privacy Policy",
            description: "Review and update the data privacy policy to include new GDPR requirements and AI data usage guidelines.",
            category: "Policy",
            complianceArea: "Data Privacy",
            priority: "High",
            status: "In Progress",
            dueDate: "2025-03-15T00:00:00Z",
            assignee: "Privacy Team",
            createdAt: "2025-02-15T10:30:00Z",
            createdBy: "Compliance Manager",
            lastUpdated: "2025-03-04T14:20:15Z",
            relatedItems: [
              {
                type: "policy",
                id: "POL-001",
                title: "Data Privacy Policy"
              },
              {
                type: "audit",
                id: "AUD-2025-003",
                title: "GDPR Compliance Assessment"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "Privacy Officer",
                text: "Need to review the updated section on AI data processing.",
                timestamp: "2025-03-04T14:20:15Z"
              }
            ]
          },
          {
            id: "TSK-2025-0041",
            title: "Remediate AI Model Documentation Finding",
            description: "Develop comprehensive model documentation for high-risk AI systems to address audit finding FND-2025-0015.",
            category: "Remediation",
            complianceArea: "AI Governance",
            priority: "High",
            status: "In Progress",
            dueDate: "2025-03-25T00:00:00Z",
            assignee: "AI Development Team",
            createdAt: "2025-03-03T15:20:00Z",
            createdBy: "AI Ethics Officer",
            lastUpdated: "2025-03-05T09:10:22Z",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0015",
                title: "AI Model Documentation Insufficient"
              },
              {
                type: "audit",
                id: "AUD-2025-004",
                title: "AI Risk Assessment"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "AI Developer",
                text: "Started working on model cards for the recommendation system.",
                timestamp: "2025-03-05T09:10:22Z"
              }
            ]
          },
          {
            id: "TSK-2025-0040",
            title: "Complete Data Subject Request Process Update",
            description: "Implement new workflow for data subject requests to ensure timely responses.",
            category: "Process",
            complianceArea: "Data Privacy",
            priority: "High",
            status: "Not Started",
            dueDate: "2025-03-10T00:00:00Z",
            assignee: "Privacy Office",
            createdAt: "2025-02-28T11:30:00Z",
            createdBy: "Compliance Manager",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0009",
                title: "Data Subject Request Process Deficiencies"
              },
              {
                type: "incident",
                id: "INC-2025-0033",
                title: "GDPR Data Subject Request Delayed Response"
              }
            ]
          },
          {
            id: "TSK-2025-0039",
            title: "Update Third-Party Processor Agreements",
            description: "Review and update all data processor agreements to include required GDPR clauses.",
            category: "Legal",
            complianceArea: "Data Privacy",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2025-03-25T00:00:00Z",
            assignee: "Legal Team",
            createdAt: "2025-02-25T09:45:00Z",
            createdBy: "Privacy Officer",
            lastUpdated: "2025-03-04T15:30:12Z",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0008",
                title: "Third-Party Processor Agreements Incomplete"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "Legal Counsel",
                text: "Completed review of 10 out of 25 agreements so far.",
                timestamp: "2025-03-04T15:30:12Z"
              }
            ]
          },
          {
            id: "TSK-2025-0038",
            title: "Implement Human Oversight for AI Systems",
            description: "Design and implement human oversight mechanisms for critical AI decision-making systems.",
            category: "Controls",
            complianceArea: "AI Governance",
            priority: "High",
            status: "Not Started",
            dueDate: "2025-03-15T00:00:00Z",
            assignee: "Operations Team",
            createdAt: "2025-03-02T17:20:00Z",
            createdBy: "AI Ethics Officer",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0014",
                title: "Inadequate Human Oversight for Critical AI Decisions"
              }
            ]
          },
          {
            id: "TSK-2025-0037",
            title: "Conduct Quarterly Access Rights Review",
            description: "Review user access rights across all systems and remove unnecessary privileges.",
            category: "Access Management",
            complianceArea: "Security",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2025-03-31T00:00:00Z",
            assignee: "IT Security Team",
            createdAt: "2025-03-01T10:15:00Z",
            createdBy: "Security Manager",
            lastUpdated: "2025-03-05T08:45:30Z",
            comments: [
              {
                id: "CMT-001",
                author: "IT Security Analyst",
                text: "Completed review for finance and engineering departments.",
                timestamp: "2025-03-05T08:45:30Z"
              }
            ]
          },
          {
            id: "TSK-2025-0036",
            title: "Update Privacy Notice",
            description: "Update privacy notice to accurately reflect current data processing activities.",
            category: "Documentation",
            complianceArea: "Data Privacy",
            priority: "Medium",
            status: "Not Started",
            dueDate: "2025-03-20T00:00:00Z",
            assignee: "Privacy Office",
            createdAt: "2025-02-22T16:10:00Z",
            createdBy: "Compliance Manager",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0007",
                title: "Privacy Notice Outdated"
              }
            ]
          },
          {
            id: "TSK-2025-0035",
            title: "Implement DPIA Integration in Project Management",
            description: "Integrate Data Protection Impact Assessment workflow into the project management system.",
            category: "Process",
            complianceArea: "Data Privacy",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2025-03-15T00:00:00Z",
            assignee: "IT Team",
            createdAt: "2025-02-20T14:30:00Z",
            createdBy: "Privacy Officer",
            lastUpdated: "2025-03-02T15:40:22Z",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0006",
                title: "DPIA Process Not Consistently Applied"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "IT Developer",
                text: "Integration with Jira completed, working on Azure DevOps integration.",
                timestamp: "2025-03-02T15:40:22Z"
              }
            ]
          },
          {
            id: "TSK-2025-0034",
            title: "Create AI Risk Assessment Framework",
            description: "Develop comprehensive AI risk assessment framework covering data quality, bias, and transparency.",
            category: "Documentation",
            complianceArea: "AI Governance",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2025-03-30T00:00:00Z",
            assignee: "Risk Management Team",
            createdAt: "2025-03-02T11:45:00Z",
            createdBy: "AI Ethics Officer",
            lastUpdated: "2025-03-05T09:30:15Z",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0013",
                title: "AI Risk Assessment Framework Incomplete"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "Risk Analyst",
                text: "First draft completed, circulating for internal review.",
                timestamp: "2025-03-05T09:30:15Z"
              }
            ]
          },
          {
            id: "TSK-2025-0033",
            title: "Implement AI Bias Testing Protocols",
            description: "Develop and implement comprehensive testing protocols for identifying and mitigating bias in AI models.",
            category: "Controls",
            complianceArea: "AI Governance",
            priority: "High",
            status: "In Progress",
            dueDate: "2025-03-20T00:00:00Z",
            assignee: "Quality Assurance Team",
            createdAt: "2025-03-01T15:10:00Z",
            createdBy: "AI Ethics Officer",
            lastUpdated: "2025-03-04T11:25:40Z",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0012",
                title: "Inadequate Testing for AI Bias"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "QA Lead",
                text: "Completed initial test framework, running pilots on recommendation system.",
                timestamp: "2025-03-04T11:25:40Z"
              }
            ]
          },
          {
            id: "TSK-2025-0032",
            title: "Implement Automated Data Retention Controls",
            description: "Implement automated data purging mechanisms across all systems to enforce data retention policies.",
            category: "Controls",
            complianceArea: "Data Privacy",
            priority: "Medium",
            status: "Completed",
            dueDate: "2025-03-10T00:00:00Z",
            assignee: "Data Governance Team",
            createdAt: "2025-02-18T10:30:00Z",
            createdBy: "Compliance Manager",
            lastUpdated: "2025-03-04T16:10:45Z",
            completedAt: "2025-03-04T16:10:45Z",
            completedBy: "Data Engineer",
            relatedItems: [
              {
                type: "finding",
                id: "FND-2025-0005",
                title: "Data Retention Policy Implementation Gaps"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "Data Engineer",
                text: "Implemented automated purging across all primary systems. Conducted testing and verified proper functionality.",
                timestamp: "2025-03-04T16:10:45Z"
              }
            ]
          },
          {
            id: "TSK-2025-0031",
            title: "Complete Security Certificate Renewal Process",
            description: "Establish automated monitoring and renewal process for security certificates.",
            category: "Security",
            complianceArea: "Security",
            priority: "Medium",
            status: "Completed",
            dueDate: "2025-03-05T00:00:00Z",
            assignee: "IT Operations",
            createdAt: "2025-03-01T08:30:00Z",
            createdBy: "Security Manager",
            lastUpdated: "2025-03-03T15:20:30Z",
            completedAt: "2025-03-03T15:20:30Z",
            completedBy: "IT Operations Lead",
            relatedItems: [
              {
                type: "incident",
                id: "INC-2025-0030",
                title: "Security Certificate Expiration"
              }
            ],
            comments: [
              {
                id: "CMT-001",
                author: "IT Operations Lead",
                text: "Set up automated monitoring with 30-day alerts and automated renewal process.",
                timestamp: "2025-03-03T15:20:30Z"
              }
            ]
          },
          {
            id: "TSK-2025-0030",
            title: "Complete PCI DSS Self-Assessment Questionnaire",
            description: "Complete annual PCI DSS SAQ-D for merchant compliance.",
            category: "Compliance",
            complianceArea: "PCI DSS",
            priority: "Medium",
            status: "Completed",
            dueDate: "2025-02-28T00:00:00Z",
            assignee: "Compliance Team",
            createdAt: "2025-02-10T09:15:00Z",
            createdBy: "Compliance Manager",
            lastUpdated: "2025-02-27T14:30:20Z",
            completedAt: "2025-02-27T14:30:20Z",
            completedBy: "Compliance Analyst",
            comments: [
              {
                id: "CMT-001",
                author: "Compliance Analyst",
                text: "Submitted SAQ-D to acquirer. All requirements satisfied.",
                timestamp: "2025-02-27T14:30:20Z"
              }
            ]
          }
        ];
        
        // Extract unique categories and compliance areas
        const categories = Array.from(new Set(mockTasks.map(task => task.category)));
        const complianceAreas = Array.from(new Set(mockTasks.map(task => task.complianceArea).filter(Boolean) as string[]));
        
        // Calculate task statistics
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        // Count tasks by status
        const notStarted = mockTasks.filter(task => task.status === 'Not Started').length;
        const inProgress = mockTasks.filter(task => task.status === 'In Progress').length;
        const completed = mockTasks.filter(task => task.status === 'Completed').length;
        
        // Count overdue tasks
        const overdueTasks = mockTasks.filter(task => 
          task.status !== 'Completed' && 
          task.dueDate && 
          new Date(task.dueDate) < today
        );
        
        const overdue = overdueTasks.length;
        
        // Count overdue high priority tasks
        const overdueHighPriority = overdueTasks.filter(task => task.priority === 'High').length;
        
        // Count tasks due today
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        const dueToday = mockTasks.filter(task => 
          task.status !== 'Completed' && 
          task.dueDate && 
          new Date(task.dueDate) >= today && 
          new Date(task.dueDate) <= todayEnd
        ).length;
        
        // Count tasks due this week
        const dueThisWeek = mockTasks.filter(task => 
          task.status !== 'Completed' && 
          task.dueDate && 
          new Date(task.dueDate) > todayEnd && 
          new Date(task.dueDate) <= endOfWeek
        ).length;
        
        // Count tasks completed in last 30 days
        const completedLast30Days = mockTasks.filter(task => 
          task.status === 'Completed' && 
          task.completedAt && 
          new Date(task.completedAt) >= thirtyDaysAgo
        ).length;
        
        // Calculate completion rate (for in progress tasks)
        const totalActiveTasks = notStarted + inProgress + completed;
        const completionRate = totalActiveTasks > 0 ? Math.round((completed / totalActiveTasks) * 100) : 0;
        
        // Count tasks by priority
        const highPriority = mockTasks.filter(task => task.priority === 'High').length;
        const mediumPriority = mockTasks.filter(task => task.priority === 'Medium').length;
        const lowPriority = mockTasks.filter(task => task.priority === 'Low').length;
        
        const stats: TaskStats = {
          total: mockTasks.length,
          notStarted,
          inProgress,
          completed,
          overdue,
          overdueHighPriority,
          dueToday,
          dueThisWeek,
          completedLast30Days,
          completionRate,
          highPriority,
          mediumPriority,
          lowPriority
        };
        
        setData({
          tasks: mockTasks,
          stats,
          categories,
          complianceAreas
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch task data'));
        console.error('Error fetching task data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
