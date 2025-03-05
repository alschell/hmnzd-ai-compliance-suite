/**
 * Incident Management State Slice
 * Current date: 2025-03-05 14:55:53
 * Current user: alschell
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '..';

// Types
export interface Incident {
  _id: string;
  id: string;
  title: string;
  description?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Resolved' | 'Closed';
  category: string;
  owner: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  assignedTeam?: string;
  affectedSystems?: string[];
  impact?: string;
  rootCause?: string;
  mitigation?: string;
  lessons?: string;
  sla?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface IncidentUpdate {
  _id: string;
  incident: string;
  updateText: string;
  updatedBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  updateType: 'Status Change' | 'Investigation' | 'Mitigation' | 'Resolution' | 'General' | 'Assignment';
  previousStatus?: string;
  newStatus?: string;
  attachments?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  createdAt: string;
}

interface IncidentDetail extends Incident {
  updates: IncidentUpdate[];
}

interface IncidentListResponse {
  incidents: Incident[];
  page: number;
  pages: number;
  total: number;
}

interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  mitigated: number;
  resolved: number;
  closed: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  recentTrend: { _id: string; count: number }[];
  sla: {
    missed: number;
    atRisk: number;
  };
  avgResolutionTimeHours: number;
}

interface IncidentState {
  incidents: Incident[];
  incident: IncidentDetail | null;
  loading: boolean;
  error: string | null;
  stats: IncidentStats | null;
  categories: string[];
  page: number;
  pages: number;
  total: number;
  filters: {
    status?: string;
    severity?: string;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
  };
}

// Initial state
const initialState: IncidentState = {
  incidents: [],
  incident: null,
  loading: false,
  error: null,
  stats: null,
  categories: [],
  page: 1,
  pages: 1,
  total: 0,
  filters: {}
};

// Async thunks
export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { incident } = getState() as { incident: IncidentState };
      const { page, filters } = incident;
      
      // Build query params
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.severity) queryParams.append('severity', filters.severity);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const response = await api.get<IncidentListResponse>(
        `/api/incidents?${queryParams.toString()}`
      );
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

export const fetchIncidentById = createAsyncThunk(
  'incidents/fetchIncidentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<IncidentDetail>(`/api/incidents/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incident details');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incidentData: Partial<Incident>, { rejectWithValue }) => {
    try {
      const response = await api.post<Incident>('/api/incidents', incidentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create incident');
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incidents/updateIncident',
  async ({ id, data }: { id: string; data: Partial<Incident> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Incident>(`/api/incidents/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update incident');
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incidents/deleteIncident',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/incidents/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete incident');
    }
  }
);

export const createIncidentUpdate = createAsyncThunk(
  'incidents/createIncidentUpdate',
  async ({ id, data }: { id: string; data: Partial<IncidentUpdate> }, { rejectWithValue }) => {
    try {
      const response = await api.post<IncidentUpdate>(
        `/api/incidents/${id}/updates`, 
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create incident update');
    }
  }
);

export const fetchIncidentStats = createAsyncThunk(
  'incidents/fetchIncidentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IncidentStats>('/api/incidents/stats');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incident statistics');
    }
  }
);

export const fetchIncidentCategories = createAsyncThunk(
  'incidents/fetchIncidentCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<string[]>('/api/incidents/categories');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incident categories');
    }
  }
);

// Create slice
const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<IncidentState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    clearIncidentDetail(state) {
      state.incident = null;
    },
    clearIncidentError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload.incidents;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch incident by ID
      .addCase(fetchIncidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.loading = false;
        state.incident = action.payload;
      })
      .addCase(fetchIncidentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create incident
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false;
        // Add to the beginning of the list if it exists
        if (state.incidents.length > 0) {
          state.incidents = [action.payload, ...state.incidents];
        }
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update incident
      .addCase(updateIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.loading = false;
        // Update in the list if it exists
        state.incidents = state.incidents.map((incident) =>
          incident.id === action.payload.id ? action.payload : incident
        );
        // Update detail view if it's the current incident
        if (state.incident && state.incident.id === action.payload.id) {
          state.incident = { ...state.incident, ...action.payload };
        }
      })
      .addCase(updateIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete incident
      .addCase(deleteIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = state.incidents.filter(
          (incident) => incident.id !== action.payload
        );
        if (state.incident && state.incident.id === action.payload) {
          state.incident = null;
        }
      })
      .addCase(deleteIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create incident update
      .addCase(createIncidentUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncidentUpdate.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new update to the incident if it's the current one
        if (state.incident) {
          state.incident.updates = [action.payload, ...state.incident.updates];
        }
      })
      .addCase(createIncidentUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch incident stats
      .addCase(fetchIncidentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchIncidentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch incident categories
      .addCase(fetchIncidentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchIncidentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setPage,
  setFilters,
  clearFilters,
  clearIncidentDetail,
  clearIncidentError
} = incidentSlice.actions;

// Selectors
export const selectIncidents = (state: RootState) => state.incident.incidents;
export const selectIncidentDetail = (state: RootState) => state.incident.incident;
export const selectIncidentLoading = (state: RootState) => state.incident.loading;
export const selectIncidentError = (state: RootState) => state.incident.error;
export const selectIncidentStats = (state: RootState) => state.incident.stats;
export const selectIncidentCategories = (state: RootState) => state.incident.categories;
export const selectIncidentFilters = (state: RootState) => state.incident.filters;
export const selectIncidentPagination = (state: RootState) => ({
  page: state.incident.page,
  pages: state.incident.pages,
  total: state.incident.total
});

export default incidentSlice.reducer;
