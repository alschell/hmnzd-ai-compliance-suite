/**
 * Policy Management Service
 */

import api from './api';

export interface Policy {
  _id: string;
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  version: string;
  content?: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Deprecated';
  owner?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  tags?: string[];
  frameworks?: string[];
  relatedControls?: string[];
  effectiveDate?: string;
  reviewDate?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  createdBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedBy?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export interface PolicyUpdateData {
  title?: string;
  description?: string;
  type?: string;
  category?: string;
  version?: string;
  content?: string;
  status?: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Deprecated';
  owner?: string;
  tags?: string[];
  frameworks?: string[];
  relatedControls?: string[];
  effectiveDate?: string;
  reviewDate?: string;
  changes?: string;
}

export interface PolicyListFilters {
  status?: string;
  type?: string;
  category?: string;
  search?: string;
  page?: number;
  sortBy?: string;
}

export interface PolicyListResponse {
  policies: Policy[];
  page: number;
  pages: number;
  total: number;
}

export interface PolicyTypeCategory {
  policyTypes: string[];
  policyCategories: string[];
}

const policyService = {
  /**
   * Get all policies with optional filters
   */
  getPolicies: async (filters: PolicyListFilters = {}): Promise<PolicyListResponse> => {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<PolicyListResponse>(`/api/policies${query}`);
  },

  /**
   * Get a single policy by ID
   */
  getPolicyById: async (id: string): Promise<Policy> => {
    return api.get<Policy>(`/api/policies/${id}`);
  },

  /**
   * Create a new policy
   */
  createPolicy: async (policyData: FormData): Promise<Policy> => {
    return api.post<Policy>('/api/policies', policyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update a policy
   */
  updatePolicy: async (id: string, policyData: FormData): Promise<Policy> => {
    return api.put<Policy>(`/api/policies/${id}`, policyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a policy
   */
  deletePolicy: async (id: string): Promise<void> => {
    return api.delete(`/api/policies/${id}`);
  },

  /**
   * Get policy types and categories
   */
  getPolicyTypesAndCategories: async (): Promise<PolicyTypeCategory> => {
    return api.get<PolicyTypeCategory>('/api/policies/types-categories');
  },

  /**
   * Archive policy document
   */
  archivePolicy: async (id: string): Promise<Policy> => {
    return api.post<Policy>(`/api/policies/${id}/archive`);
  },

  /**
   * Submit policy for review
   */
  submitForReview: async (id: string, reviewers?: string[]): Promise<Policy> => {
    return api.post<Policy>(`/api/policies/${id}/submit-review`, { reviewers });
  },

  /**
   * Approve policy
   */
  approvePolicy: async (id: string, comments?: string): Promise<Policy> => {
    return api.post<Policy>(`/api/policies/${id}/approve`, { comments });
  },

  /**
   * Publish policy
   */
  publishPolicy: async (id: string, effectiveDate?: string): Promise<Policy> => {
    return api.post<Policy>(`/api/policies/${id}/publish`, { effectiveDate });
  },

  /**
   * Reject policy
   */
  rejectPolicy: async (id: string, reason: string): Promise<Policy> => {
    return api.post<Policy>(`/api/policies/${id}/reject`, { reason });
  },

  /**
   * Download policy document
   */
  downloadPolicy: async (id: string): Promise<Blob> => {
    return api.get<Blob>(`/api/policies/${id}/download`, {
      responseType: 'blob',
    });
  }
};

export default policyService;
