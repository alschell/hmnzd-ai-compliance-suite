/**
 * Incident List Page
 * Current date: 2025-03-05 15:07:01
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
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

import { AppDispatch, RootState } from '../../store';
import {
  fetchIncidents,
  fetchIncidentCategories,
  setPage,
  setFilters,
  clearFilters,
  selectIncidents,
  selectIncidentLoading,
  selectIncidentCategories,
  selectIncidentFilters,
  selectIncidentPagination,
} from '../../store/slices/incidentSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';

const IncidentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const incidents = useSelector(selectIncidents);
  const loading = useSelector(selectIncidentLoading);
  const categories = useSelector(selectIncidentCategories);
  const filters = useSelector(selectIncidentFilters);
  const { page, pages, total } = useSelector(selectIncidentPagination);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // Load incidents on mount and when filters change
  useEffect(() => {
    dispatch(setPageTitle('Incidents'));
    dispatch(fetchIncidentCategories());
    dispatch(fetchIncidents());
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

  // Navigate to incident detail
  const handleViewIncident = (id: string) => {
    navigate(`/incidents/${id}`);
  };

  // Navigate to create incident
  const handleCreateIncident = () => {
    navigate('/incidents/new');
  };

  return (
    <MainLayout title="Incidents">
      <PageHeader
        title="All Incidents"
        subtitle="View and manage security incidents"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateIncident}
          >
            New Incident
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Incidents', link: '/incidents' },
          { label: 'All Incidents' }
        ]}
      />

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search incidents..."
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
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Investigating">Investigating</MenuItem>
                      <MenuItem value="Mitigated">Mitigated</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Severity</InputLabel>
                    <Select
                      label="Severity"
                      value={filters.severity || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('severity', e.target.value)}
                    >
                      <MenuItem value="">All Severities</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
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
                      {categories.map((category) => (
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
                      <MenuItem value="severity">Severity</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                      <MenuItem value="sla">SLA (Closest First)</MenuItem>
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

      {/* Incidents table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && incidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <LoadingSpinner message="Loading incidents..." />
                  </TableCell>
                </TableRow>
              ) : incidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No incidents found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                incidents.map((incident) => (
                  <TableRow
                    key={incident.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewIncident(incident.id)}
                  >
                    <TableCell>{incident.id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <StatusChip status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={incident.severity} />
                    </TableCell>
                    <TableCell>{incident.category}</TableCell>
                    <TableCell>
                      {format(new Date(incident.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewIncident(incident.id);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
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

export default IncidentList;
