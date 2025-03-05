import { useState, useEffect } from 'react';

interface TrainingCategory {
  name: string;
  completionRate: number;
  completedCount: number;
  totalCount: number;
  isRequired: boolean;
  daysUntilDeadline: number | null;
}

interface TrainingDeadline {
  id: string;
  title: string;
  dueDate: string;
  completedCount: number;
  totalCount: number;
}

interface NonCompliantUser {
  id: string;
  name: string;
  department: string;
  avatarUrl?: string;
  overdueCount: number;
  completionRate: number;
}

interface DepartmentCompliance {
  name: string;
  complianceRate: number;
  compliantEmployees: number;
  totalEmployees: number;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  isRequired: boolean;
  dueDate?: string;
  duration: number; // minutes
  assignedCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
}

interface TrainingComplianceData {
  complianceRate: number;
  completedTrainings: number;
  inProgressTrainings: number;
  overdueTrainings: number;
  totalTrainings: number;
  compliantEmployees: number;
  nonCompliantEmployees: number;
  totalEmployees: number;
  categories: TrainingCategory[];
  upcomingDeadlines: TrainingDeadline[];
  nonCompliantUsers: NonCompliantUser[];
  departmentCompliance: DepartmentCompliance[];
  trainings: Training[];
}

export function useTrainingCompliance() {
  const [data, setData] = useState<TrainingComplianceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const currentDate = new Date("2025-03-05T07:47:01Z");
  const currentUser = { id: "user-001", name: "Alex Schell", username: "alschell" };
  
  useEffect(() => {
    const fetchTrainingCompliance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock training category data
        const mockCategories: TrainingCategory[] = [
          {
            name: "Data Privacy",
            completionRate: 94,
            completedCount: 188,
            totalCount: 200,
            isRequired: true,
            daysUntilDeadline: 25
          },
          {
            name: "Information Security",
            completionRate: 87,
            completedCount: 174,
            totalCount: 200,
            isRequired: true,
            daysUntilDeadline: 10
          },
          {
            name: "Anti-Bribery & Corruption",
            completionRate: 92,
            completedCount: 184,
            totalCount: 200,
            isRequired: true,
            daysUntilDeadline: 45
          },
          {
            name: "AI Ethics",
            completionRate: 76,
            completedCount: 152,
            totalCount: 200,
            isRequired: false,
            daysUntilDeadline: 5
          },
          {
            name: "Code of Conduct",
            completionRate: 98,
            completedCount: 196,
            totalCount: 200,
            isRequired: true,
            daysUntilDeadline: null
          }
        ];
        
        // Mock upcoming deadlines
        const mockDeadlines: TrainingDeadline[] = [
          {
            id: "training-002",
            title: "AI Ethics Training",
            dueDate: "2025-03-10T23:59:59Z",
            completedCount: 152,
            totalCount: 200
          },
          {
            id: "training-001",
            title: "Information Security Awareness",
            dueDate: "2025-03-15T23:59:59Z",
            completedCount: 174,
            totalCount: 200
          },
          {
            id: "training-003",
            title: "Data Privacy Fundamentals",
            dueDate: "2025-03-30T23:59:59Z",
            completedCount: 188,
            totalCount: 200
          }
        ];
        
        // Mock non-compliant users
        const mockNonCompliantUsers: NonCompliantUser[] = [
          {
            id: "user-010",
            name: "Taylor Johnson",
            department: "Engineering",
            avatarUrl: "/avatars/taylor-johnson.png",
            overdueCount: 3,
            completionRate: 45
          },
          {
            id: "user-015",
            name: "Jamie Smith",
            department: "Marketing",
            avatarUrl: "/avatars/jamie-smith.png",
            overdueCount: 2,
            completionRate: 67
          },
          {
            id: "user-022",
            name: "Casey Williams",
            department: "Sales",
            avatarUrl: "/avatars/casey-williams.png",
            overdueCount: 2,
            completionRate: 60
          },
          {
            id: "user-031",
            name: "Morgan Lee",
            department: "Finance",
            avatarUrl: "/avatars/morgan-lee.png",
            overdueCount: 1,
            completionRate: 75
          },
          {
            id: "user-042",
            name: "Jordan Taylor",
            department: "Customer Support",
            avatarUrl: "/avatars/jordan-taylor.png",
            overdueCount: 1,
            completionRate: 78
          }
        ];
        
        // Mock department compliance
        const mockDepartmentCompliance: DepartmentCompliance[] = [
          {
            name: "Executive",
            complianceRate: 100,
            compliantEmployees: 5,
            totalEmployees: 5
          },
          {
            name: "Legal & Compliance",
            complianceRate: 98,
            compliantEmployees: 9,
            totalEmployees: 10
          },
          {
            name: "Human Resources",
            complianceRate: 95,
            compliantEmployees: 14,
            totalEmployees: 15
          },
          {
            name: "Engineering",
            complianceRate: 84,
            compliantEmployees: 52,
            totalEmployees: 60
          },
          {
            name: "Product",
            complianceRate: 90,
            compliantEmployees: 27,
            totalEmployees: 30
          },
          {
            name: "Marketing",
            complianceRate: 85,
            compliantEmployees: 17,
            totalEmployees: 20
          },
          {
            name: "Sales",
            complianceRate: 82,
            compliantEmployees: 36,
            totalEmployees: 45
          },
          {
            name: "Customer Support",
            complianceRate: 88,
            compliantEmployees: 30,
            totalEmployees: 35
          }
        ];
        
        // Mock training data
        const mockTrainings: Training[] = [
          {
            id: "training-001",
            title: "Information Security Awareness",
            description: "Learn about key information security principles, best practices for protecting sensitive data, and how to identify and respond to security threats.",
            category: "Information Security",
            isRequired: true,
            dueDate: "2025-03-15T23:59:59Z",
            duration: 45,
            assignedCount: 200,
            completedCount: 174,
            inProgressCount: 15,
            notStartedCount: 11
          },
          {
            id: "training-002",
            title: "AI Ethics Training",
            description: "Understand ethical considerations in AI development and use, including fairness, transparency, accountability, and bias mitigation strategies.",
            category: "AI Ethics",
            isRequired: false,
            dueDate: "2025-03-10T23:59:59Z",
            duration: 60,
            assignedCount: 200,
            completedCount: 152,
            inProgressCount: 25,
            notStartedCount: 23
          },
          {
            id: "training-003",
            title: "Data Privacy Fundamentals",
            description: "Essential knowledge about global privacy regulations, data protection principles, and practical guidance for handling personal data in compliance with applicable laws.",
            category: "Data Privacy",
            isRequired: true,
            dueDate: "2025-03-30T23:59:59Z",
            duration: 60,
            assignedCount: 200,
            completedCount: 188,
            inProgressCount: 8,
            notStartedCount: 4
          },
          {
            id: "training-004",
            title: "Anti-Bribery & Corruption",
            description: "Learn how to identify and prevent corrupt practices, understand key anti-corruption regulations, and implement proper controls.",
            category: "Anti-Bribery & Corruption",
            isRequired: true,
            dueDate: "2025-04-15T23:59:59Z",
            duration: 30,
            assignedCount: 200,
            completedCount: 184,
            inProgressCount: 10,
            notStartedCount: 6
          },
          {
            id: "training-005",
            title: "Code of Conduct",
            description: "Company's code of conduct covering ethical business practices, professional behavior, conflicts of interest, and other key compliance topics.",
            category: "Code of Conduct",
            isRequired: true,
            duration: 30,
            assignedCount: 200,
            completedCount: 196,
            inProgressCount: 3,
            notStartedCount: 1
          },
          {
            id: "training-006",
            title: "AI
