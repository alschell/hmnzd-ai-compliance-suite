/**
 * Compliance Findings State Slice
 * Current date: 2025-03-06 10:30:15
 * Current user: alschell
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import api from '../../services/api';

// Types
export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type FindingStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface FindingTask {
  id: string;
  title: string;
  description?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  assignee?: {
    id: string;
    name: string;
  };
  dueDate?: string;
  completedDate?: string;
  comments?: Array<{
    id: string;
    text: string;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
  }>;
}

export interface FindingEvidence {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  framework: {
    id: string;
    name: string;
  };
  control: {
    id: string;
    name: string;
  };
  severity: FindingSeverity;
  status: FindingStatus;
  dateIdentified: string;
  dueDate: string;
  closedDate?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  risk: {
    likelihood: 'High' | 'Medium' | 'Low';
    impact: 'High' | 'Medium' | 'Low';
    description: string;
  };
  remediation: {
    plan: string;
    tasks: FindingTask[];
  };
  evidence: FindingEvidence[];
  comments: Array<{
    id: string;
    text: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  history: Array<{
    id: string;
    type: 'Create' | 'Update' | 'Comment' | 'Task' | 'Status' | 'Assign';
    date: string;
    user: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface FindingSummary {
  id: string;
  title: string;
  framework: string;
  control: string;
  severity: FindingSeverity;
  status: FindingStatus;
  dateIdentified: string;
  dueDate: string;
  assignedTo?: string;
  description: string;
}

export interface FindingListResponse {
  findings: FindingSummary[];
  page: number;
  pages: number;
  total: number;
}

export interface FindingFilters {
  framework?: string;
  severity?: FindingSeverity;
  status?: FindingStatus;
  assignedTo?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

interface FindingState {
  findings: FindingSummary[];
  finding: Finding | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  total: number;
  filters: FindingFilters;
}

// Initial state
const initialState: FindingState = {
  findings: [],
  finding: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,
  filters: {}
};

// Async thunks
export const fetchFindings = createAsyncThunk(
  'finding/fetchFindings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { finding } = getState() as { finding: FindingState };
      const { page, filters } = finding;
      
      // Build query params
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      
      if (filters.framework) queryParams.append('framework', filters.framework);
      if (filters.severity) queryParams.append('severity', filters.severity);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
        queryParams.append('sortDirection', filters.sortDirection || 'desc');
      }
      
      const response = await api.get<FindingListResponse>(
        `/api/findings?${queryParams.toString()}`
      );
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch findings');
    }
  }
);

export const fetchFindingById = createAsyncThunk(
  'finding/fetchFindingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Finding>(`/api/findings/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch finding details');
    }
  }
);

export const createFinding = createAsyncThunk(
  'finding/createFinding',
  async (findingData: Partial<Finding>, { rejectWithValue }) => {
    try {
      const response = await api.post<Finding>('/api/findings', findingData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create finding');
    }
  }
);

export const updateFinding = createAsyncThunk(
  'finding/updateFinding',
  async ({ id, data }: { id: string; data: Partial<Finding> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Finding>(`/api/findings/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update finding');
    }
  }
);

export const deleteFinding = createAsyncThunk(
  'finding/deleteFinding',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/findings/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete finding');
    }
  }
);

export const addFindingComment = createAsyncThunk(
  'finding/addFindingComment',
  async ({ id, comment }: { id: string; comment: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<Finding>(
        `/api/findings/${id}/comments`,
        { text: comment }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const updateFindingStatus = createAsyncThunk(
  'finding/updateFindingStatus',
  async ({ id, status, note }: { id: string; status: FindingStatus; note?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<Finding>(
        `/api/findings/${id}/status`,
        { status, note }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const addFindingTask = createAsyncThunk(
  'finding/addFindingTask',
  async ({ id, task }: { id: string; task: Partial<FindingTask> }, { rejectWithValue }) => {
    try {
      const response = await api.post<Finding>(
        `/api/findings/${id}/tasks`,
        task
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add task');
    }
  }
);

export const updateFindingTask = createAsyncThunk(
  'finding/updateFindingTask',
  async ({ id, taskId, task }: { id: string; taskId: string; task: Partial<FindingTask> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Finding>(
        `/api/findings/${id}/tasks/${taskId}`,
        task
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

// Create slice
const findingSlice = createSlice({
  name: 'finding',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFilters(state, action: PayloadAction<FindingFilters>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    clearFindingDetail(state) {
      state.finding = null;
    },
    clearFindingError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch findings
      .addCase(fetchFindings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFindings.fulfilled, (state, action) => {
        state.loading = false;
        state.findings = action.payload.findings;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchFindings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch finding by ID
      .addCase(fetchFindingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFindingById.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
      })
      .addCase(fetchFindingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create finding
      .addCase(createFinding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
      })
      .addCase(createFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update finding
      .addCase(updateFinding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
        // Update in the list if it exists
        state.findings = state.findings.map((finding) =>
          finding.id === action.payload.id 
            ? {
                ...finding,
                title: action.payload.title,
                severity: action.payload.severity,
                status: action.payload.status,
                dueDate: action.payload.dueDate,
                assignedTo: action.payload.assignedTo?.name,
              }
            : finding
        );
      })
      .addCase(updateFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete finding
      .addCase(deleteFinding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.findings = state.findings.filter(
          (finding) => finding.id !== action.payload
        );
        if (state.finding && state.finding.id === action.payload) {
          state.finding = null;
        }
      })
      .addCase(deleteFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add comment
      .addCase(addFindingComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFindingComment.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
      })
      .addCase(addFindingComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update status
      .addCase(updateFindingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFindingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
        // Update in the list if it exists
        state.findings = state.findings.map((finding) =>
          finding.id === action.payload.id 
            ? {
                ...finding,
                status: action.payload.status,
              }
            : finding
        );
      })
      .addCase(updateFindingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add task
      .addCase(addFindingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFindingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
      })
      .addCase(addFindingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update task
      .addCase(updateFindingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFindingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.finding = action.payload;
      })
      .addCase(updateFindingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setPage,
  setFilters,
  clearFilters,
  clearFindingDetail,
  clearFindingError
} = findingSlice.actions;

// Selectors
export const selectFindings = (state: RootState) => state.finding.findings;
export const selectFinding = (state: RootState) => state.finding.finding;
export const selectFindingLoading = (state: RootState) => state.finding.loading;
export const selectFindingError = (state: RootState) => state.finding.error;
export const selectFindingPagination = (state: RootState) => ({
  page: state.finding.page,
  pages: state.finding.pages,
  total: state.finding.total
});
export const selectFindingFilters = (state: RootState) => state.finding.filters;

export default findingSlice.reducer;
