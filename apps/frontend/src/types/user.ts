/**
 * User Type Definitions
 * Current date: 2025-03-05 14:42:02
 * Current user: alschell
 */

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole =
  | 'admin'
  | 'compliance_manager'
  | 'security_analyst'
  | 'auditor'
  | 'user';

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrator',
  compliance_manager: 'Compliance Manager',
  security_analyst: 'Security Analyst',
  auditor: 'Auditor',
  user: 'Regular User'
};

export interface UserListResponse {
  users: User[];
  page: number;
  pages: number;
  total: number;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NewUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  isActive?: boolean;
}
