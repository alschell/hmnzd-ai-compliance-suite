import { useState, useEffect } from 'react';

interface EmployeeIssue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
}

interface EmployeeActivity {
  timestamp: string;
  description: string;
  type: 'training' | 'document' | 'access' | 'review' | 'other';
}

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  assignedDate: string;
  dueDate?: string;
  completionDate?: string;
  score?: number;
  duration: number;
}

interface EmployeeDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Exempt';
  submittedDate?: string;
  approvedDate?: string;
  approvedBy?: string;
  expiryDate?: string;
  documentId?: string;
  fileUrl?: string;
}

interface AccessSystem {
  id: string;
  name: string;
  category: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  accessLevel: string;
  permissions?: string[];
  grantDate: string;
  expiryDate?: string;
  approvedBy: string;
  lastReviewDate: string;
  lastAccessDate: string;
}

interface AccessRequest {
  id: string;
  system: string;
  accessLevel: string;
  requestDate: string;
  requestReason: string;
}

interface EmployeeBasic {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  complianceScore: number;
  avatarUrl?: string;
}

export interface EmployeeProfile extends EmployeeBasic {
  phone?: string;
  hireDate: string;
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Pending';
  training: {
    completionRate: number;
    requiredCount: number;
    completedCount: number;
    overdueCount: number;
    courses: TrainingCourse[];
  };
  documentation: {
    completionRate: number;
    requiredCount: number;
    completedCount: number;
    documents: EmployeeDocument[];
  };
  certifications: {
    total: number;
    valid: number;
    expired: number;
    list: { name: string; expiryDate: string; status: 'valid' | 'expired' }[];
  };
  accessRights: {
    reviewedPercent: number;
    lastReviewDate: string;
    nextReviewDate: string;
    reviewer?: string;
    systems: AccessSystem[];
    pendingRequests?: AccessRequest[];
  };
  issues: EmployeeIssue[];
  recentActivity: EmployeeActivity[];
}

export function useEmployeeCompliance() {
  const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
  const [data, setData] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  const currentDate = new Date("2025-03-05T08:15:21Z");
  
  // First, fetch the list of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockEmployees: EmployeeBasic[] = [
          {
            id: "emp-001",
            name: "Alex Morgan",
            email: "amorgan@example.com",
            department: "Engineering",
            title: "Senior Software Engineer",
            complianceScore: 92,
            avatarUrl: "/avatars/alex-morgan.png"
          },
          {
            id: "emp-002",
            name: "Jamie Chen",
            email: "jchen@example.com",
            department: "Marketing",
            title: "Marketing Director",
            complianceScore: 78,
            avatarUrl: "/avatars/jamie-chen.png"
          },
          {
            id: "emp-003",
            name: "Taylor Williams",
            email: "twilliams@example.com",
            department: "Sales",
            title: "Account Executive",
            complianceScore: 65,
            avatarUrl: "/avatars/taylor-williams.png"
          },
          {
            id: "emp-004",
            name: "Jordan Smith",
            email: "jsmith@example.com",
            department: "Finance",
            title: "Financial Analyst",
            complianceScore: 95,
            avatarUrl: "/avatars/jordan-smith.png"
          },
          {
            id: "emp-005",
            name: "Casey Johnson",
            email: "cjohnson@example.com",
            department: "Human Resources",
            title: "HR Manager",
            complianceScore: 99,
            avatarUrl: "/avatars/casey-johnson.png"
          },
          {
            id: "emp-006",
            name: "Morgan Lee",
            email: "mlee@example.com",
            department: "Legal",
            title: "Legal Counsel",
            complianceScore: 96,
            avatarUrl: "/avatars/morgan-lee.png"
          },
          {
            id: "emp-007",
            name: "Robin Taylor",
            email: "rtaylor@example.com",
            department: "Engineering",
            title: "DevOps Engineer",
            complianceScore: 82,
            avatarUrl: "/avatars/robin-taylor.png"
          },
          {
            id: "emp-008",
            name: "Sam Rodriguez",
            email: "srodriguez@example.com",
            department: "Customer Support",
            title: "Support Team Lead",
            complianceScore: 87,
            avatarUrl: "/avatars/sam-rodriguez.png"
          }
        ];
        
        setEmployees(mockEmployees);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch employees'));
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Function to select an employee and fetch their details
  const selectEmployee = async (employeeId: string) => {
    if (employeeId === selectedEmployeeId && data) {
      return; // Already selected and loaded
    }
    
    setSelectedEmployeeId(employeeId);
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get basic employee info
      const employee = employees.find(emp => emp.id === employeeId);
      
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Generate mock employee profile based on their compliance score
      // Higher score = better compliance status
      const score = employee.complianceScore;
      
      // Mock employee profile data
      const mockProfile: EmployeeProfile = {
        ...employee,
        phone: "+1 (555) 123-4567",
        hireDate: "2023-06-15T00:00:00Z",
        overallStatus: score >= 90 ? 'Compliant' : score >= 70 ? 'Non-Compliant' : 'Pending',
        
        training: {
          completionRate: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
          requiredCount: 5,
          completedCount: Math.floor((5 * score) / 100),
          overdueCount: 5 - Math.floor((5 * score) / 100),
          courses: [
            {
              id: "trng-001",
              title: "Data Privacy Fundamentals",
              description: "Essential knowledge about global privacy regulations, data protection principles, and practical guidance for handling personal data in compliance with applicable laws.",
              category: "Data Privacy",
              status: score >= 90 ? "Completed" : score >= 75 ? "In Progress" : "Not Started",
              assignedDate: "2025-02-01T00:00:00Z",
              dueDate: "2025-03-15T23:59:59Z",
              completionDate: score >= 90 ? "2025-02-28T10:45:00Z" : undefined,
              score: score >= 90 ? 95 : undefined,
              duration: 60
            },
            {
              id: "trng-002",
              title: "Information Security Awareness",
              description: "Learn about key information security principles, best practices for protecting sensitive data, and how to identify and respond to security threats.",
              category: "Information Security",
              status: score >= 85 ? "Completed" : score >= 70 ? "In Progress" : "Not Started",
              assignedDate: "2025-01-15T00:00:00Z",
              dueDate: "2025-03-01T23:59:59Z",
              completionDate: score >= 85 ? "2025-02-10T14:30:00Z" : undefined,
              score: score >= 85 ? 88 : undefined,
              duration: 45
            },
            {
              id: "trng-003",
              title: "Code of Conduct",
              description: "Company's code of conduct covering ethical business practices, professional behavior, conflicts of interest, and other key compliance topics.",
              category: "Code of Conduct",
              status: score >= 70 ? "Completed" : score >= 60 ? "In Progress" : "Not Started",
              assignedDate: "2024-12-01T00:00:00Z",
              dueDate: "2025-01-15T23:59:59Z",
              completionDate: score >= 70 ? "2025-01-10T09:15:00Z" : undefined,
              score: score >= 70 ? 92 : undefined,
              duration: 30
            },
            {
              id: "trng-004",
              title: "Anti-Bribery & Corruption",
              description: "Learn how to identify and prevent corrupt practices, understand key anti-corruption regulations, and implement proper controls.",
              category: "Anti-Bribery & Corruption",
              status: score >= 80 ? "Completed" : "Not Started",
              assignedDate: "2025-02-15T00:00:00Z",
              dueDate: "2025-04-15T23:59:59Z",
              completionDate: score >= 80 ? "2025-03-02T11:30:00Z" : undefined,
              score: score >= 80 ? 85 : undefined,
              duration: 30
            },
            {
              id: "trng-005",
              title: "AI Ethics Training",
              description: "Understand ethical considerations in AI development and use, including fairness, transparency, accountability, and bias mitigation strategies.",
              category: "AI Ethics",
              status: "Not Started",
              assignedDate: "2025-03-01T00:00:00Z",
              dueDate: "2025-04-30T23:59:59Z",
              duration: 60
            }
          ]
        },
        
        documentation: {
          completionRate: Math.min(100, score + Math.floor(Math.random() * 8) - 4),
          requiredCount: 3,
          completedCount: Math.floor((3 * score) / 100),
          documents: [
            {
              id: "doc-001",
              title: "Confidentiality Agreement",
              description: "Standard agreement covering the handling of confidential information and trade secrets.",
              category: "Legal",
              status: score >= 75 ? "Compliant" : "Non-Compliant",
              submittedDate: score >= 75 ? "2023-06-20T00:00:00Z" : undefined,
              approvedDate: score >= 75 ? "2023-06-22T00:00:00Z" : undefined,
              approvedBy: score >= 75 ? "HR Department" : undefined,
              documentId: score >= 75 ? "CONF-2023-0416" : undefined,
              fileUrl: score >= 75 ? "/documents/confidentiality-agreement.pdf" : undefined
            },
            {
              id: "doc-002",
              title: "Data Handling Certification",
              description: "Annual certification confirming understanding of data handling policies and procedures.",
              category: "Data Privacy",
              status: score >= 85 ? "Compliant" : "Non-Compliant",
              submittedDate: score >= 85 ? "2025-01-15T00:00:00Z" : undefined,
              approvedDate: score >= 85 ? "2025-01-18T00:00:00Z" : undefined,
              approvedBy: score >= 85 ? "Privacy Office" : undefined,
              expiryDate: "2026-01-15T00:00:00Z",
              documentId: score >= 85 ? "DHC-2025-0128" : undefined,
              fileUrl: score >= 85 ? "/documents/data-handling-cert.pdf" : undefined
            },
            {
              id: "doc-003",
              title: "Security Awareness Acknowledgment",
              description: "Acknowledgment of security awareness training and responsibilities.",
              category: "Information Security",
              status: score >= 80 ? "Compliant" : "Pending",
              submittedDate: score >= 80 ? "2025-02-10T00:00:00Z" : undefined,
              approvedDate: score >= 80 ? "2025-02-12T00:00:00Z" : undefined,
              approvedBy: score >= 80 ? "Security Team" : undefined,
              expiryDate: "2026-02-10T00:00:00Z",
              documentId: score >= 80 ? "SAA-2025-0391" : undefined,
              fileUrl: score >= 80 ? "/documents/security-acknowledgment.pdf" : undefined
            }
          ]
        },
        
        certifications: {
          total: 2,
          valid: score >= 90 ? 2 : score >= 80 ? 1 : 0,
          expired: 2 - (score >= 90 ? 2 : score >= 80 ? 1 : 0),
          list: [
            {
              name: "Internal Data Privacy Certification",
              expiryDate: "2026-01-15T00:00:00Z",
              status: score >= 80 ? "valid" : "expired"
            },
            {
              name: "Security Awareness Certification",
              expiryDate: "2025-08-30T00:00:00Z",
              status: score >= 90 ? "valid" : "expired"
            }
          ]
        },
        
        accessRights: {
          reviewedPercent: Math.min(100, score + Math.floor(Math.random() * 6) - 3),
          lastReviewDate: "2025-01-15T00:00:00Z",
          nextReviewDate: "2025-07-15T00:00:00Z",
          reviewer: "Security Team",
          systems: [
            {
              id: "sys-001",
              name: "Customer Data Platform",
              category: "Customer Data",
              status: score >= 85 ? "Compliant" : "Non-Compliant",
              accessLevel: "Read-Only",
              permissions: ["View Customer Records", "Run Reports", "Export Anonymized Data"],
              grantDate: "2023-07-01T00:00:00Z",
              approvedBy: "Department Manager",
              lastReviewDate: "2025-01-15T00:00:00Z",
              lastAccessDate: "2025-03-04T16:30:00Z"
            },
            {
              id: "sys-002",
              name: "Code Repository",
              category: "Development",
              status: score >= 75 ? "Compliant" : "Pending Review",
              accessLevel: "Contributor",
              permissions: ["Pull Code", "Submit Code", "Create Branches", "Review PRs"],
              grantDate: "2023-06-20T00:00:00Z",
              approvedBy: "Engineering Manager",
              lastReviewDate: "2025-01-15T00:00:00Z",
              lastAccessDate: "2025-03-05T08:10:00Z"
            },
            {
              id: "sys-003",
              name: "Financial Reporting System",
              category: "Finance",
              status: employee.department === "Finance" ? "Compliant" : "Non-Compliant",
              accessLevel: employee.department === "Finance" ? "Full Access" : "Limited Access",
              permissions: employee.department === "Finance" ? 
                ["View Reports", "Create Reports", "Export Data", "Modify Settings"] : 
                ["View Reports"],
              grantDate: "2024-01-10T00:00:00Z",
              approvedBy: "Finance Director",
              lastReviewDate: "2025-01-15T00:00:00Z",
              lastAccessDate: employee.department === "Finance" ? "2025-03-05T07:45:00Z" : "2025-02-15T10:30:00Z"
            }
          ],
          pendingRequests: score < 90 ? [
            {
              id: "req-001",
              system: "Analytics Dashboard",
              accessLevel: "Standard User",
              requestDate: "2025-03-01T00:00:00Z",
              requestReason: "Need access to team performance metrics"
            }
          ] : []
        },
        
        issues: score >= 90 ? [] : [
          {
            id: "issue-001",
            title: "Complete Data Privacy Training",
            description: "Required annual data privacy training course must be completed.",
            severity: score < 70 ? "High" : "Medium",
            dueDate: "2025-03-15T23:59:59Z"
          },
          {
            id: "issue-002",
            title: "Submit Security Awareness Acknowledgment",
            description: "Annual security awareness acknowledgment form needs to be signed and submitted.",
            severity: score < 80 ? "High" : "Low",
            dueDate: "2025-03-10T23:59:59Z"
          },
          score < 75 ? {
            id: "issue-003",
            title: "Access Rights Review Overdue",
            description: "Your access rights to critical systems require periodic review and attestation.",
            severity: "Critical",
            dueDate: "2025-02-28T23:59:59Z"
          } : null
        ].filter(Boolean) as EmployeeIssue[],
        
        recentActivity: [
          {
            timestamp: "2025-03-05T08:10:21Z",
            description: "Logged into Code Repository system",
            type: "access"
          },
          {
            timestamp: "2025-03-04T16:30:45Z",
            description: "Accessed Customer Data Platform",
            type: "access"
          },
          {
            timestamp: "2025-03-02T11:30:15Z",
            description: score >= 80 ? "Completed Anti-Bribery & Corruption Training" : "Started Anti-Bribery & Corruption Training",
            type: "training"
          },
          {
            timestamp: "2025-02-28T15:45:00Z",
            description: score >= 90 ? "Submitted required compliance documentation" : "Received notification about missing compliance documentation",
            type: "document"
          },
          {
            timestamp: "2025-02-15T14:20:30Z",
            description: "Completed quarterly access rights attestation",
            type: "review"
          }
        ]
      };
      
      setData(mockProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch employee details'));
      console.error('Error fetching employee details:', err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    employees,
    data,
    isLoading,
    error,
    selectEmployee,
    selectedEmployeeId
  };
}
