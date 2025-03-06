/**
 * Compliance Frameworks List
 * Current date: 2025-03-06 09:46:24
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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  BarChart as BarChartIcon,
  AssessmentOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { AppDispatch } from '../../store';
import {
  fetchFrameworks,
  fetchFrameworkCategories,
  setPage,
  setFilters,
  clearFilters,
  selectFrameworks,
  selectFrameworkLoading,
  selectFrameworkCategories,
  selectFrameworkFilters,
  selectFrameworkPagination,
} from '../../store/slices/frameworkSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FrameworkList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const frameworks = useSelector(selectFrameworks);
  const loading = useSelector(selectFrameworkLoading);
  const categories = useSelector(selectFrameworkCategories);
  const filters = useSelector(selectFrameworkFilters);
  const { page, pages, total } = useSelector(selectFrameworkPagination);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // Load frameworks on mount and when filters change
  useEffect(() => {
    dispatch(setPageTitle('Compliance Frameworks'));
    dispatch(fetchFrameworkCategories());
    dispatch(fetchFrameworks());
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

  // Navigate to framework detail
  const handleViewFramework = (id: string) => {
    navigate(`/compliance/frameworks/${id}`);
  };

  // Navigate to create framework
  const handleAddFramework = () => {
    navigate('/compliance/frameworks/new');
  };
  
  // Navigate to edit framework
  const handleEditFramework = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/compliance/frameworks/${id}/edit`);
  };
  
  // Navigate to framework assessment
  const handleAssessFramework = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/compliance/frameworks/${id}/assess`);
  };

  // Get color for compliance score
  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <MainLayout title="Compliance Frameworks">
      <PageHeader
        title="Compliance Frameworks"
        subtitle="Manage and monitor your compliance frameworks and standards"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFramework}
          >
            Add Framework
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance', link: '/compliance' },
          { label: 'Frameworks' }
        ]}
      />

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search frameworks..."
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      label="Sort By"
                      value={filters.sortBy || ''}
                      onChange={(e: SelectChangeEvent) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <MenuItem value="">Most Recent</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="score">Compliance Score</MenuItem>
                      <MenuItem value="progress">Implementation Progress</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
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

      {/* Frameworks table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Compliance Score</TableCell>
                <TableCell>Implementation Progress</TableCell>
                <TableCell>Controls</TableCell>
                <TableCell>Last Assessment</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && frameworks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <LoadingSpinner message="Loading frameworks..." />
                  </TableCell>
                </TableRow>
              ) : frameworks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No frameworks found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                frameworks.map((framework) => (
                  <TableRow
                    key={framework.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewFramework(framework.id)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssessmentOutlined sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {framework.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{framework.category}</TableCell>
                    <TableCell>{framework.version}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={getComplianceScoreColor(framework.complianceScore)}
                        >
                          {framework.complianceScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={framework.implementationProgress}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">
                            {framework.implementationProgress}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {framework.implementedControls}/{framework.totalControls}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {framework.notApplicableControls > 0 && 
                          `(${framework.notApplicableControls} N/A)`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {framework.lastAssessmentDate ? (
                        format(new Date(framework.lastAssessmentDate), 'MMM dd, yyyy')
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Not assessed
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewFramework(framework.id);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit framework">
                          <IconButton
                            size="small"
                            onClick={(e) => handleEditFramework(framework.id, e)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Perform assessment">
                          <IconButton
                            size="small"
                            onClick={(e) => handleAssessFramework(framework.id, e)}
                          >
                            <BarChartIcon />
                          </IconButton>
                        </Tooltip>
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

export default FrameworkList;
