/**
 * Policy List Page
 * Current date: 2025-03-06 03:04:49
 * Current user: alschell
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Description as DescriptionIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { AppDispatch } from '../../store';
import {
  fetchPolicies,
  fetchPolicyTypesAndCategories,
  setPage,
  setFilters,
  clearFilters,
  selectPolicies,
  selectPolicyLoading,
  selectPolicyTypes,
  selectPolicyCategories,
  selectPolicyFilters,
  selectPolicyPagination,
} from '../../store/slices/policySlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { Policy } from '../../services/policyService';

const PolicyList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const policies = useSelector(selectPolicies);
  const loading = useSelector(selectPolicyLoading);
  const policyTypes = useSelector(selectPolicyTypes);
  const policyCategories = useSelector(selectPolicyCategories);
  const filters = useSelector(selectPolicyFilters);
  const { page, pages, total } = useSelector(selectPolicyPagination);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // Load policies on mount and when filters change
  useEffect(() => {
    dispatch(setPageTitle('Policies'));
    dispatch(fetchPolicyTypesAndCategories());
    dispatch(fetchPolicies());
  }, [dispatch, page, filters]);

  // Handle search
  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery }));
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    dispatch(clearFilters());
  };

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1)); // API uses 1-based pagination
  };

  // Navigate to policy detail
  const handleViewPolicy = (id: string) => {
    navigate(`/policies/${id}`);
  };

  // Navigate to create policy
  const handleCreatePolicy = () => {
    navigate('/policies/new');
  };

  // Download policy document
  const handleDownloadPolicy = (policy: Policy, event: React.MouseEvent) => {
    event.stopPropagation();
    if (policy.fileUrl) {
      window.open(policy.fileUrl, '_blank');
    }
  };

  return (
    <MainLayout title="Policies">
      <PageHeader
        title="Policy Management"
        subtitle="View and manage organizational policies"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePolicy}
          >
            New Policy
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Policies', link: '/policies' },
          { label: 'All Policies' }
        ]}
      />

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchQuery('');
                          if (filters.search) {
                            dispatch(setFilters({ search: '' }));
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                color={showFilters ? 'primary' : 'inherit'}
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Grid>
          </Grid>

          {/* Filter options */}
          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={filters.status || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="In Review">In Review</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Deprecated">Deprecated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Policy Type</InputLabel>
                    <Select
                      label="Policy Type"
                      value={filters.type || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('type', e.target.value)}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {policyTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={filters.category || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('category', e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {policyCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      label="Sort By"
                      value={filters.sortBy || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <MenuItem value="">Most Recent</MenuItem>
                      <MenuItem value="title">Title (A-Z)</MenuItem>
                      <MenuItem value="effectiveDate">Effective Date</MenuItem>
                      <MenuItem value="reviewDate">Review Date</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color="inherit" onClick={handleClearFilters}>
                      Clear All Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Card>

      {/* Policies table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <LoadingSpinner message="Loading policies..." />
                  </TableCell>
                </TableRow>
              ) : policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No policies found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                policies.map((policy) => (
                  <TableRow
                    key={policy.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewPolicy(policy.id)}
                  >
                    <TableCell>{policy.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {policy.title}
                      </Box>
                    </TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>{policy.category}</TableCell>
                    <TableCell>
                      <StatusChip status={policy.status} />
                    </TableCell>
                    <TableCell>{policy.version}</TableCell>
                    <TableCell>
                      {format(new Date(policy.updatedAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View policy">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPolicy(policy.id);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {policy.fileUrl && (
                          <Tooltip title="Download document">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDownloadPolicy(policy, e)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]} // Fixed page size for now
          component="div"
          count={total}
          rowsPerPage={10}
          page={page - 1} // API uses 1-based pagination, MUI uses 0-based
          onPageChange={handleChangePage}
        />
      </Paper>
    </MainLayout>
  );
};

export default PolicyList;
