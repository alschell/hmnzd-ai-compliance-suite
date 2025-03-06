/**
 * Policy Management State Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import policyService, { Policy, PolicyListFilters, PolicyUpdateData } from '../../services/policyService';

// Types
interface PolicyState {
  policies: Policy[];
  policy: Policy | null;
  loading: boolean;
  error: string | null;
  policyTypes: string[];
  policyCategories: string[];
  page: number;
  pages: number;
  total: number;
  filters: PolicyListFilters;
}

// Initial state
const initialState: PolicyState = {
  policies: [],
  policy: null,
  loading: false,
  error: null,
  policyTypes: [],
  policyCategories: [],
  page: 1,
  pages: 1,
  total: 0,
  filters: {}
};

// Async thunks
export const fetchPolicies = createAsyncThunk(
  'policy/fetchPolicies',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { policy } = getState() as { policy: PolicyState };
      const filters: PolicyListFilters = {
        ...policy.filters,
        page: policy.page,
      };

      const response = await policyService.getPolicies(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch policies');
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'policy/fetchPolicyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await policyService.getPolicyById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch policy');
    }
  }
);

export const createPolicy = createAsyncThunk(
  'policy/createPolicy',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await policyService.createPolicy(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create policy');
    }
  }
);

export const updatePolicy = createAsyncThunk(
  'policy/updatePolicy',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await policyService.updatePolicy(id, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update policy');
    }
  }
);

export const deletePolicy = createAsyncThunk(
  'policy/deletePolicy',
  async (id: string, { rejectWithValue }) => {
    try {
      await policyService.deletePolicy(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete policy');
    }
  }
);

export const fetchPolicyTypesAndCategories = createAsyncThunk(
  'policy/fetchPolicyTypesAndCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await policyService.getPolicyTypesAndCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch policy types and categories');
    }
  }
);

export const submitPolicyForReview = createAsyncThunk(
  'policy/submitPolicyForReview',
  async ({ id, reviewers }: { id: string; reviewers?: string[] }, { rejectWithValue }) => {
    try {
      const response = await policyService.submitForReview(id, reviewers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit policy for review');
    }
  }
);

export const approvePolicy = createAsyncThunk(
  'policy/approvePolicy',
  async ({ id, comments }: { id: string; comments?: string }, { rejectWithValue }) => {
    try {
      const response = await policyService.approvePolicy(id, comments);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve policy');
    }
  }
);

export const publishPolicy = createAsyncThunk(
  'policy/publishPolicy',
  async ({ id, effectiveDate }: { id: string; effectiveDate?: string }, { rejectWithValue }) => {
    try {
      const response = await policyService.publishPolicy(id, effectiveDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish policy');
    }
  }
);

// Create slice
const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFilters(state, action: PayloadAction<PolicyListFilters>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    clearPolicyDetail(state) {
      state.policy = null;
    },
    clearPolicyError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch policies
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload.policies;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch policy by ID
      .addCase(fetchPolicyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
      })
      .addCase(fetchPolicyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create policy
      .addCase(createPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
      })
      .addCase(createPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update policy
      .addCase(updatePolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
        // Update in the list if it exists
        state.policies = state.policies.map((policy) =>
          policy.id === action.payload.id ? action.payload : policy
        );
      })
      .addCase(updatePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete policy
      .addCase(deletePolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = state.policies.filter(
          (policy) => policy.id !== action.payload
        );
        if (state.policy && state.policy.id === action.payload) {
          state.policy = null;
        }
      })
      .addCase(deletePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch policy types and categories
      .addCase(fetchPolicyTypesAndCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyTypesAndCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.policyTypes = action.payload.policyTypes;
        state.policyCategories = action.payload.policyCategories;
      })
      .addCase(fetchPolicyTypesAndCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit policy for review
      .addCase(submitPolicyForReview.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
        // Update in the list if it exists
        state.policies = state.policies.map((policy) =>
          policy.id === action.payload.id ? action.payload : policy
        );
      })
      
      // Approve policy
      .addCase(approvePolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
        // Update in the list if it exists
        state.policies = state.policies.map((policy) =>
          policy.id === action.payload.id ? action.payload : policy
        );
      })
      
      // Publish policy
      .addCase(publishPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
        // Update in the list if it exists
        state.policies = state.policies.map((policy) =>
          policy.id === action.payload.id ? action.payload : policy
        );
      });
  }
});

export const {
  setPage,
  setFilters,
  clearFilters,
  clearPolicyDetail,
  clearPolicyError
} = policySlice.actions;

// Selectors
export const selectPolicies = (state: RootState) => state.policy.policies;
export const selectPolicyDetail = (state: RootState) => state.policy.policy;
export const selectPolicyLoading = (state: RootState) => state.policy.loading;
export const selectPolicyError = (state: RootState) => state.policy.error;
export const selectPolicyTypes = (state: RootState) => state.policy.policyTypes;
export const selectPolicyCategories = (state: RootState) => state.policy.policyCategories;
export const selectPolicyPagination = (state: RootState) => ({
  page: state.policy.page,
  pages: state.policy.pages,
  total: state.policy.total,
});
export const selectPolicyFilters = (state: RootState) => state.policy.filters;

export default policySlice.reducer;
