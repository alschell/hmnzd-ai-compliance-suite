/**
 * Compliance Framework State Slice
 * Current date: 2025-03-06 09:43:36
 * Current user: alschell
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import api from '../../services/api';

// Types
export interface ControlGroup {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface Control {
  id: string;
  name: string;
  description: string;
  groupId: string;
  implementationStatus: 'Implemented' | 'Partially Implemented' | 'Not Implemented' | 'Not Applicable';
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  implementationDetails?: string;
  evidenceRequired?: boolean;
  evidenceProvided?: boolean;
  evidenceLinks?: string[];
  assignedTo?: {
    id: string;
    name: string;
  };
  lastUpdated?: string;
  notes?: string;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  owner?: {
    id: string;
    name: string;
  };
  complianceScore: number;
  implementationProgress: number;
  totalControls: number;
  implementedControls: number;
  notImplementedControls: number;
  partiallyImplementedControls: number;
  notApplicableControls: number;
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  createdAt: string;
  updatedAt: string;
  controlGroups?: ControlGroup[];
  controls?: Control[];
}

export interface FrameworkSummary {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  complianceScore: number;
  implementationProgress: number;
  totalControls: number;
  implementedControls: number;
  notImplementedControls: number;
  partiallyImplementedControls: number;
  notApplicableControls: number;
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
}

export interface FrameworkListResponse {
  frameworks: FrameworkSummary[];
  page: number;
  pages: number;
  total: number;
}

export interface FrameworkFilters {
  category?: string;
  search?: string;
  sortBy?: string;
}

interface FrameworkState {
  frameworks: FrameworkSummary[];
  framework: Framework | null;
  loading: boolean;
  error: string | null;
  categories: string[];
  page: number;
  pages: number;
  total: number;
  filters: FrameworkFilters;
}

// Initial state
const initialState: FrameworkState = {
  frameworks: [],
  framework: null,
  loading: false,
  error: null,
  categories: [],
  page: 1,
  pages: 1,
  total: 0,
  filters: {}
};

// Async thunks
export const fetchFrameworks = createAsyncThunk(
  'framework/fetchFrameworks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { framework } = getState() as { framework: FrameworkState };
      const { page, filters } = framework;
      
      // Build query params
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const response = await api.get<FrameworkListResponse>(
        `/api/frameworks?${queryParams.toString()}`
      );
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch frameworks');
    }
  }
);

export const fetchFrameworkById = createAsyncThunk(
  'framework/fetchFrameworkById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Framework>(`/api/frameworks/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch framework details');
    }
  }
);

export const createFramework = createAsyncThunk(
  'framework/createFramework',
  async (frameworkData: Partial<Framework>, { rejectWithValue }) => {
    try {
      const response = await api.post<Framework>('/api/frameworks', frameworkData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create framework');
    }
  }
);

export const updateFramework = createAsyncThunk(
  'framework/updateFramework',
  async ({ id, data }: { id: string; data: Partial<Framework> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Framework>(`/api/frameworks/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update framework');
    }
  }
);

export const deleteFramework = createAsyncThunk(
  'framework/deleteFramework',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/frameworks/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete framework');
    }
  }
);

export const updateControl = createAsyncThunk(
  'framework/updateControl',
  async (
    { 
      frameworkId, 
      controlId, 
      data 
    }: { 
      frameworkId: string; 
      controlId: string; 
      data: Partial<Control> 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<Control>(
        `/api/frameworks/${frameworkId}/controls/${controlId}`,
        data
      );
      return { control: response, frameworkId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update control');
    }
  }
);

export const fetchFrameworkCategories = createAsyncThunk(
  'framework/fetchFrameworkCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<string[]>('/api/frameworks/categories');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch framework categories');
    }
  }
);

// Create slice
const frameworkSlice = createSlice({
  name: 'framework',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFilters(state, action: PayloadAction<FrameworkFilters>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    clearFrameworkDetail(state) {
      state.framework = null;
    },
    clearFrameworkError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch frameworks
      .addCase(fetchFrameworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrameworks.fulfilled, (state, action) => {
        state.loading = false;
        state.frameworks = action.payload.frameworks;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchFrameworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch framework by ID
      .addCase(fetchFrameworkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrameworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.framework = action.payload;
      })
      .addCase(fetchFrameworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create framework
      .addCase(createFramework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFramework.fulfilled, (state, action) => {
        state.loading = false;
        state.framework = action.payload;
      })
      .addCase(createFramework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update framework
      .addCase(updateFramework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFramework.fulfilled, (state, action) => {
        state.loading = false;
        state.framework = action.payload;
        // Update in the list if it exists
        state.frameworks = state.frameworks.map((framework) =>
          framework.id === action.payload.id 
            ? {
                ...framework,
                name: action.payload.name,
                description: action.payload.description,
                version: action.payload.version,
                category: action.payload.category,
                complianceScore: action.payload.complianceScore,
                implementationProgress: action.payload.implementationProgress,
                totalControls: action.payload.totalControls,
                implementedControls: action.payload.implementedControls,
                notImplementedControls: action.payload.notImplementedControls,
                partiallyImplementedControls: action.payload.partiallyImplementedControls,
                notApplicableControls: action.payload.notApplicableControls,
                lastAssessmentDate: action.payload.lastAssessmentDate,
                nextAssessmentDate: action.payload.nextAssessmentDate
              }
            : framework
        );
      })
      .addCase(updateFramework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete framework
      .addCase(deleteFramework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFramework.fulfilled, (state, action) => {
        state.loading = false;
        state.frameworks = state.frameworks.filter(
          (framework) => framework.id !== action.payload
        );
        if (state.framework && state.framework.id === action.payload) {
          state.framework = null;
        }
      })
      .addCase(deleteFramework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update control
      .addCase(updateControl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateControl.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the control in the framework detail view
        if (state.framework && state.framework.id === action.payload.frameworkId && state.framework.controls) {
          state.framework.controls = state.framework.controls.map((control) =>
            control.id === action.payload.control.id ? action.payload.control : control
          );
          
          // Update compliance metrics based on control statuses
          const controls = state.framework.controls;
          
          const totalControls = controls.length;
          const implementedControls = controls.filter(c => c.implementationStatus === 'Implemented').length;
          const partiallyImplementedControls = controls.filter(c => c.implementationStatus === 'Partially Implemented').length;
          const notImplementedControls = controls.filter(c => c.implementationStatus === 'Not Implemented').length;
          const notApplicableControls = controls.filter(c => c.implementationStatus === 'Not Applicable').length;
          
          // Calculate the compliance score: (implemented + (partially * 0.5)) / (total - notApplicable) * 100
          const denominator = totalControls - notApplicableControls;
          const complianceScore = denominator > 0 
            ? Math.round((implementedControls + (partiallyImplementedControls * 0.5)) / denominator * 100)
            : 100;
          
          // Calculate implementation progress
          const implementationProgress = denominator > 0
            ? Math.round((implementedControls + partiallyImplementedControls + notApplicableControls) / totalControls * 100)
            : 100;
          
          // Update framework metrics
          state.framework.complianceScore = complianceScore;
          state.framework.implementationProgress = implementationProgress;
          state.framework.implementedControls = implementedControls;
          state.framework.partiallyImplementedControls = partiallyImplementedControls;
          state.framework.notImplementedControls = notImplementedControls;
          state.framework.notApplicableControls = notApplicableControls;
        }
      })
      .addCase(updateControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch framework categories
      .addCase(fetchFrameworkCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrameworkCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchFrameworkCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setPage,
  setFilters,
  clearFilters,
  clearFrameworkDetail,
  clearFrameworkError
} = frameworkSlice.actions;

// Selectors
export const selectFrameworks = (state: RootState) => state.framework.frameworks;
export const selectFramework = (state: RootState) => state.framework.framework;
export const selectFrameworkLoading = (state: RootState) => state.framework.loading;
export const selectFrameworkError = (state: RootState) => state.framework.error;
export const selectFrameworkCategories = (state: RootState) => state.framework.categories;
export const selectFrameworkPagination = (state: RootState) => ({
  page: state.framework.page,
  pages: state.framework.pages,
  total: state.framework.total
});
export const selectFrameworkFilters = (state: RootState) => state.framework.filters;

export default frameworkSlice.reducer;
