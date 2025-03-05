import { useState, useEffect } from 'react';

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Upcoming';
  isRequired: boolean;
  duration?: number; // in minutes
  requiredByDate?: string;
  recurrencePeriod?: string; // e.g., "Annual", "Quarterly", etc.
  createdAt: string;
  createdBy: string;
  lastUpdated?: string;
  stats?: {
    completionRate: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    overdue: number;
  };
  modules?: {
    id: string;
    title: string;
    duration: number;
  }[];
  frameworks?: string[];
}

export interface TrainingAssignment {
  id: string;
  courseId: string;
  courseTitle: string;
  assignee: string;
  assignedBy: string;
  assignedDate: string;
  dueDate?: string;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Expired';
  progress?: number;
  completedDate?: string;
  score?: number;
  lastActivity?: string;
  recurrenceId?: string;
  department?: string;
}

interface TrainingActivity {
  id: string;
  type: 'completion' | 'assignment' | 'creation' | 'update';
  user: string;
  courseId: string;
  courseTitle: string;
  description: string;
  timestamp: string;
  details?: string;
}

interface ComplianceSummaryItem {
  category: string;
  completionRate: number;
  completed: number;
  total: number;
}

interface DepartmentCompletionItem {
  department: string;
  completionRate: number;
  completedAssignments: number;
  totalAssignments: number;
}

interface TrainingReports {
  complianceSummary: ComplianceSummaryItem[];
  departmentCompletion: DepartmentCompletionItem[];
  recentActivities: {
    description: string;
    user: string;
    timestamp: string;
  }[];
}

interface TrainingStats {
  overallCompletionRate: number;
  activeCourses: number;
  requiredCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  usersWithOverdueAssignments: number;
  dueThisMonth: number;
  usersWithUpcomingDeadlines: number;
}

interface TrainingManagementData {
  courses: TrainingCourse[];
  assignments: TrainingAssignment[];
  categories: string[];
  reports?: TrainingReports;
  stats: TrainingStats;
}

export function useTrainingManagement() {
  const [data, setData] = useState<TrainingManagementData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentDate = new Date("2025-03-05T10:02:11Z");
  const currentUser = "alschell";
  
  useEffect(() => {
    const fetchTrainingData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock courses data
        const mockCourses: TrainingCourse[] = [
          {
            id: "TRN-2025-001",
            title: "Data Privacy Fundamentals",
            description: "Learn the basics of data privacy regulations, including GDPR, CCPA, and how they impact our business operations.",
            category: "Privacy",
            status: "Active",
            isRequired: true,
            duration: 45,
            requiredByDate: "2025-04-30T00:00:00Z",
            recurrencePeriod: "Annual",
            createdAt: "2024-12-15T09:30:00Z",
            createdBy: "Compliance Team",
            lastUpdated: "2025-01-10T14:25:00Z",
            stats: {
              completionRate: 78,
              completed: 156,
              inProgress: 23,
              notStarted: 21,
              overdue: 5
            },
            modules: [
              { id: "MOD-001", title: "Introduction to Data Privacy", duration: 10 },
              { id: "MOD-002", title: "GDPR Key Requirements", duration: 15 },
              { id: "MOD-003", title: "CCPA Overview", duration: 12 },
              { id: "MOD-004", title: "Data Privacy Best Practices", duration: 8 }
            ],
            frameworks: ["GDPR", "CCPA", "ISO 27701"]
          },
          {
            id: "TRN-2025-002",
            title: "Information Security Awareness",
            description: "Essential security awareness training covering phishing, password security, social engineering, and data protection.",
            category: "Security",
            status: "Active",
            isRequired: true,
            duration: 60,
            requiredByDate: "2025-03-31T00:00:00Z",
            recurrencePeriod: "Annual",
            createdAt: "2024-11-20T13:45:00Z",
            createdBy: "Security Team",
            lastUpdated: "2025-02-05T10:15:00Z",
            stats: {
              completionRate: 85,
              completed: 170,
              inProgress: 15,
              notStarted: 15,
              overdue: 3
            },
            modules: [
              { id: "MOD-001", title: "Phishing Awareness", duration: 15 },
              { id: "MOD-002", title: "Password Security", duration: 10 },
              { id: "MOD-003", title: "Social Engineering Threats", duration: 15 },
              { id: "MOD-004", title: "Data Protection Basics", duration: 10 },
              { id: "MOD-005", title: "Security Incident Reporting", duration: 10 }
            ],
            frameworks: ["ISO 27001", "SOC 2", "NIST CSF"]
          },
          {
            id: "TRN-2025-003",
            title: "AI Ethics and Responsible AI",
            description: "Training on ethical considerations for AI development, deployment, and use, including bias mitigation, transparency, and accountability.",
            category: "AI Governance",
            status: "Active",
            isRequired: false,
            duration: 75,
            createdAt: "2025-01-15T11:30:00Z",
            createdBy: "AI Ethics Committee",
            lastUpdated: "2025-02-20T09:45:00Z",
            stats: {
              completionRate: 42,
              completed: 35,
              inProgress: 18,
              notStarted: 30,
              overdue: 0
            },
            modules: [
              { id: "MOD-001", title: "AI Ethics Principles", duration: 15 },
              { id: "MOD-002", title: "Recognizing and Mitigating Bias", duration: 20 },
              { id: "MOD-003", title: "Transparency in AI Systems", duration: 15 },
              { id: "MOD-004", title: "AI Governance Framework", duration: 25 }
            ],
            frameworks: ["EU AI Act", "NIST AI RMF"]
          },
          {
            id: "TRN-2025-004",
            title: "Code of Conduct Training",
            description: "Training on the company's code of conduct, ethical standards, and business practices.",
            category: "Ethics",
            status: "Active",
            isRequired: true,
            duration: 30,
            requiredByDate: "2025-06-30T00:00:00Z",
            recurrencePeriod: "Annual",
            createdAt: "2025-01-05T14:20:00Z",
            createdBy: "HR Department",
            stats: {
              completionRate: 92,
              completed: 184,
              inProgress: 8,
              notStarted: 8,
              overdue: 0
            },
            frameworks: ["SOC 2"]
          },
          {
            id: "TRN-2025-005",
            title: "Vendor Risk Management",
            description: "Learn how to assess, monitor, and manage risks associated with third-party vendors and service providers.",
            category: "Risk Management",
            status: "Active",
            isRequired: false,
            duration: 45,
            createdAt: "2024-12-10T10:15:00Z",
            createdBy: "Procurement Team",
            lastUpdated: "2025-01-25T15:30:00Z",
            stats: {
              completionRate: 65,
              completed: 65,
              inProgress: 10,
              notStarted: 25,
              overdue: 0
            },
            modules: [
              { id: "MOD-001", title: "Vendor Risk Assessment", duration: 15 },
              { id: "MOD-002", title: "Due Diligence Process", duration: 15 },
              { id: "MOD-003", title: "Ongoing Vendor Monitoring", duration: 15 }
            ],
            frameworks: ["ISO 27001", "SOC 2"]
          },
          {
            id: "TRN-2025-006",
            title: "HIPAA Compliance Basics",
            description: "Overview of HIPAA requirements and procedures for handling protected health information (PHI).",
            category: "Privacy",
            status: "Active",
            isRequired: false,
            duration: 60,
            createdAt: "2024-11-15T13:30:00Z",
            createdBy: "Compliance Team",
            stats: {
              completionRate: 45,
              completed: 45,
              inProgress: 5,
              notStarted: 50,
              overdue: 0
            },
            frameworks: ["HIPAA"]
          },
          {
            id: "TRN-2025-007",
            title: "PCI DSS Requirements Overview",
            description: "Overview of PCI DSS requirements for handling payment card data securely.",
            category: "Security",
            status: "Upcoming",
            isRequired: false,
            duration: 45,
            requiredByDate: "2025-04-15T00:00:00Z",
            createdAt: "2025-02-28T09:15:00Z",
            createdBy: "Security Team"
          },
          {
            id: "TRN-2025-008",
            title: "Data Breach Response Procedures",
            description: "Training on identifying, responding to, and reporting data breach incidents.",
            category: "Security",
            status: "Draft",
            isRequired: false,
            duration: 35,
            createdAt: "2025-03-01T16:45:00Z",
            createdBy: "Security Team"
          },
          {
            id: "TRN-2025-009",
            title: "Cloud Security Fundamentals",
            description: "Security considerations and best practices for cloud environments.",
            category: "Security",
            status: "Draft",
            isRequired: false,
            duration: 50,
            createdAt: "2025-03-03T11:20:00Z",
            createdBy: "Security Team"
          },
          {
            id: "TRN-2024-015",
            title: "SOC 2 Compliance Overview",
            description: "Introduction to SOC 2 trust services criteria and compliance requirements.",
            category: "Compliance",
            status: "Archived",
            isRequired: false,
            duration: 30,
            createdAt: "2024-05-10T10:30:00Z",
            createdBy: "Compliance Team",
            lastUpdated: "2025-01-15T09:20:00Z",
            stats: {
              completionRate: 100,
              completed: 150,
              inProgress: 0,
              notStarted: 0,
              overdue: 0
            }
          }
        ];
        
        // Mock assignments data
        const mockAssignments: TrainingAssignment[] = [
          {
            id: "ASGN-2025-0158",
            courseId: "TRN-2025-001",
            courseTitle: "Data Privacy Fundamentals",
            assignee: "Alex Morgan",
            assignedBy: "Compliance Team",
            assignedDate: "2025-02-15T10:30:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            status: "In Progress",
            progress: 60,
            lastActivity: "2025-03-04T15:20:00Z",
            department: "Marketing"
          },
          {
            id: "ASGN-2025-0159",
            courseId: "TRN-2025-002",
            courseTitle: "Information Security Awareness",
            assignee: "Sarah Johnson",
            assignedBy: "Security Team",
            assignedDate: "2025-02-10T13:45:00Z",
            dueDate: "2025-03-10T00:00:00Z",
            status: "Completed",
            progress: 100,
            completedDate: "2025-03-02T09:15:00Z",
            score: 95,
            department: "Engineering"
          },
          {
            id: "ASGN-2025-0160",
            courseId: "TRN-2025-003",
            courseTitle: "AI Ethics and Responsible AI",
            assignee: "David Chen",
            assignedBy: "AI Ethics Committee",
            assignedDate: "2025-02-20T09:30:00Z",
            dueDate: "2025-03-20T00:00:00Z",
            status: "In Progress",
            progress: 40,
            lastActivity: "2025-03-05T08:45:00Z",
            department: "Data Science"
          },
          {
            id: "ASGN-2025-0161",
            courseId: "TRN-2025-001",
            courseTitle: "Data Privacy Fundamentals",
            assignee: "Emily Wong",
            assignedBy: "Compliance Team",
            assignedDate: "2025-02-05T11:15:00Z",
            dueDate: "2025-03-05T00:00:00Z",
            status: "Assigned",
            lastActivity: "2025-02-05T11:15:00Z",
            department: "Customer Support"
          },
          {
            id: "ASGN-2025-0162",
            courseId: "TRN-2025-002",
            courseTitle: "Information Security Awareness",
            assignee: currentUser,
            assignedBy: "Security Team",
            assignedDate: "2025-02-15T14:30:00Z",
            dueDate: "2025-03-15T00:00:00Z",
            status: "In Progress",
            progress: 75,
            lastActivity: "2025-03-04T10:45:00Z",
            department: "Compliance"
          },
          {
            id: "ASGN-2025-0163",
            courseId: "TRN-2025-004",
            courseTitle: "Code of Conduct Training",
            assignee: "Ryan Taylor",
            assignedBy: "HR Department",
            assignedDate: "2025-01-20T09:00:00Z",
            dueDate: "2025-02-20T00:00:00Z",
            status: "Completed",
            progress: 100,
            completedDate: "2025-02-15T16:30:00Z",
            score: 100,
            department: "Finance"
          },
          {
            id: "ASGN-2025-0164",
            courseId: "TRN-2025-001",
            courseTitle: "Data Privacy Fundamentals",
            assignee: "Jordan Lee",
            assignedBy: "Compliance Team",
            assignedDate: "2025-01-30T13:20:00Z",
            dueDate: "2025-03-01T00:00:00Z",
            status: "Assigned",
            department: "Legal"
          },
          {
            id: "ASGN-2025-0165",
            courseId: "TRN-2025-004",
            courseTitle: "Code of Conduct Training",
            assignee: currentUser,
            assignedBy: "HR Department",
            assignedDate: "2025-02-01T10:15:00Z",
            dueDate: "2025-03-01T00:00:00Z",
            status: "Completed",
            progress: 100,
            completedDate: "2025-02-25T14:30:00Z",
            score: 90,
            department: "Compliance"
          },
          {
            id: "ASGN-2025-0166",
            courseId: "TRN-2025-005",
            courseTitle: "Vendor Risk Management",
            assignee: "Sam Wilson",
            assignedBy: "Procurement Team",
            assignedDate: "2025-02-25T09:45:00Z",
            dueDate: "2025-03-25T00:00:00Z",
            status: "In Progress",
            progress: 20,
            lastActivity: "2025-03-01T11:30:00Z",
            department: "Procurement"
          },
          {
            id: "ASGN-2025-0167",
            courseId: "TRN-2025-003",
            courseTitle: "AI Ethics and Responsible AI",
            assignee: currentUser,
            assignedBy: "AI Ethics Committee",
            assignedDate: "2025-03-01T15:20:00Z",
            dueDate: "2025-04-01T00:00:00Z",
            status: "Assigned",
            department: "Compliance"
          }
        ];
        
        // Extract unique categories
        const categories = Array.from(new Set(mockCourses.map(course => course.category)));
        
        // Calculate stats
        const activeCourses = mockCourses.filter(course => course.status === 'Active').length;
        const requiredCourses = mockCourses.filter(course => course.isRequired).length;
        
        const totalAssignments = mockAssignments.length;
        const completedAssignments = mockAssignments.filter(a => a.status === 'Completed').length;
        const pendingAssignments = totalAssignments - completedAssignments;
        
        // Calculate overdue assignments
        const overdueAssignments = mockAssignments.filter(assignment => 
          assignment.status !== 'Completed' && 
          assignment.dueDate && 
          new Date(assignment.dueDate) < currentDate
        ).length;
        
        // Count unique users with overdue assignments
        const usersWithOverdueAssignments = new Set(
          mockAssignments
            .filter(assignment => 
              assignment.status !== 'Completed' && 
              assignment.dueDate && 
              new Date(assignment.dueDate) < currentDate
            )
            .map(assignment => assignment.assignee)
        ).size;
        
        // Calculate assignments due this month
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const dueThisMonth = mockAssignments.filter(assignment => 
          assignment.status !== 'Completed' && 
          assignment.dueDate && 
          new Date(assignment.dueDate).getMonth() === currentMonth &&
          new Date(assignment.dueDate).getFullYear() === currentYear
        ).length;
        
        // Count unique users with assignments due this month
        const usersWithUpcomingDeadlines = new Set(
          mockAssignments
            .filter(assignment => 
              assignment.status !== 'Completed' && 
              assignment.dueDate && 
              new Date(assignment.dueDate).getMonth() === currentMonth &&
              new Date(assignment.dueDate).getFullYear() === currentYear
            )
            .map(assignment => assignment.assignee)
        ).size;
        
        // Calculate overall completion rate
        const assignmentsWithStatus = mockAssignments.length;
        const overallCompletionRate = assignmentsWithStatus > 0 
          ? Math.round((completedAssignments / assignmentsWithStatus) * 100) 
          : 0;
        
        // Mock reports
        const mockReports: TrainingReports = {
          complianceSummary: [
            { category: "Security Training", completionRate: 85, completed: 170, total: 200 },
            { category: "Data Privacy", completionRate: 78, completed: 156, total: 200 },
            { category: "Code of Conduct", completionRate: 92, completed: 184, total: 200 },
            { category: "AI Ethics", completionRate: 42, completed: 35, total: 83 }
          ],
          departmentCompletion: [
            { department: "Engineering", completionRate: 90, completedAssignments: 45, totalAssignments: 50 },
            { department: "Marketing", completionRate: 75, completedAssignments: 30, totalAssignments: 40 },
            { department: "Finance", completionRate: 95, completedAssignments: 38, totalAssignments: 40 },
            { department: "Data Science", completionRate: 82, completedAssignments: 41, totalAssignments: 50 },
            { department: "Legal", completionRate: 98, completedAssignments: 39, totalAssignments: 40 },
            { department: "Customer Support", completionRate: 70, completedAssignments: 35, totalAssignments: 50 }
          ],
          recentActivities: [
            {
              description: "Completed Information Security Awareness",
              user: "Sarah Johnson",
              timestamp: "2025-03-02T09:15:00Z"
            },
            {
              description: "Completed Code of Conduct Training",
              user: currentUser,
              timestamp: "2025-02-25T14:30:00Z"
            },
            {
              description: "Assigned AI Ethics and Responsible AI",
              user: currentUser,
              timestamp: "2025-03-01T15:20:00Z"
            },
            {
              description: "Assigned Vendor Risk Management",
              user: "Sam Wilson",
              timestamp: "2025-02-25T09:45:00Z"
            },
            {
              description: "Created Cloud Security Fundamentals course",
              user: "Security Team",
              timestamp: "2025-03-03T11:20:00Z"
            }
          ]
        };
        
        const stats: TrainingStats = {
          overallCompletionRate,
          activeCourses,
          requiredCourses,
          totalAssignments,
          completedAssignments,
          pendingAssignments,
          overdueAssignments,
          usersWithOverdueAssignments,
          dueThisMonth,
          usersWithUpcomingDeadlines
        };
        
        setData({
          courses: mockCourses,
          assignments: mockAssignments,
          categories,
          reports: mockReports,
          stats
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch training data'));
        console.error('Error fetching training data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
