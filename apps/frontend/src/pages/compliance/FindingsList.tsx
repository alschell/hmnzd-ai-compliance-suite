/**
 * Compliance Findings List
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle,
  Error as ErrorIcon,
  Assignment,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { AppDispatch } from '../../store';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';

// Mock data for findings
const mockFindings = [
  {
    id: 'FIN-2025-042',
    title: 'Missing Encryption for Stored PII Data',
    framework: 'SOC 2',
    control: 'CC6.1',
    severity: 'High',
    status: 'Open',
    dateIdentified: '2025-03-01',
    dueDate: '2025-04-15',
    assignedTo: 'Sarah Johnson',
    description: 'PII data stored in the user profile database is not encrypted at rest, violating SOC 2 CC6.1 requirements and posing a risk of unauthorized data access.'
  },
  {
    id: 'FIN-2025-041',
    title: 'Inactive User Accounts Not Automatically Disabled',
    framework: 'ISO 27001',
    control: 'A.9.2.6',
    severity: 'Medium',
    status: 'In Progress',
    dateIdentified: '2025-02-28',
    dueDate: '2025-04-01',
    assignedTo: 'Michael Wilson',
    description: 'User accounts that have been inactive for more than 90 days are not being automatically disabled, contrary to ISO 27001 A.9.2.6 requirements.'
  },
  {
    id: 'FIN-2025-040',
    title: 'Incomplete Vendor Risk Assessments',
    framework: 'GDPR',
    control: 'Art. 28',
    severity: 'High',
    status: 'Open',
    dateIdentified: '2025-02-25',
    dueDate: '2025-03-25',
    assignedTo: 'Emma Rodriguez',
    description: 'Several third-party processors handling EU personal data have not undergone complete risk assessments as required by GDPR Article 28.'
  },
  {
    id: 'FIN-2025-039',
    title: 'Security Patches Not Applied Within SLA',
    framework: 'PCI DSS',
    control: '6.2',
    severity: 'High',
    status: 'In Progress',
    dateIdentified: '2025-02-20',
    dueDate: '2025-03-15',
    assignedTo: 'Robert Chen',
    description: 'Critical security patches are not being applied within the 30-day timeframe required by PCI DSS 6.2, leaving systems vulnerable to known exploits.'
  },
  {
    id: 'FIN-2025-038',
    title: 'Inadequate Backup Verification',
    framework: 'NIST CSF',
    control: 'PR.IP-4',
    severity: 'Medium',
    status: 'Resolved',
    dateIdentified: '2025-02-18',
    dueDate: '2025-03-20',
    assignedTo: 'Jennifer Smith',
    description: 'Backup integrity tests are not being performed regularly to verify the effectiveness of data backup processes, contrary to NIST CSF PR.IP-4 guidance.'
  },
  {
    id: 'FIN-2025-037',
    title: 'Insufficient Access Logs Retention',
    framework: 'HIPAA',
    control: '164.312(b)',
    severity: 'Medium',
    status: 'Resolved',
    dateIdentified: '2025-02-15',
    dueDate: '2025-03-15',
    assignedTo: 'David Thompson',
    description: 'Access logs for systems containing PHI are only being retained for 3 months, which is insufficient for HIPAA compliance requirements.'
  },
  {
    id: 'FIN-2025-036',
    title: 'Incomplete Business Continuity Plan',
    framework: 'ISO 27001',
    control: 'A.17.1.1',
    severity: 'Medium',
    status: 'Open',
    dateIdentified: '2025-02-10',
    dueDate: '2025-03-30',
    assignedTo: 'James Wilson',
    description: 'The business continuity plan does not include specific procedures for several critical business functions, failing to meet ISO 27001 A.17.1.1 requirements.'
  },
  {
    id: 'FIN-2025-035',
    title: 'Weak Password Policy Implementation',
    framework: 'CIS Controls',
    control: '5.2',
    severity: 'High',
    status: 'Resolved',
    dateIdentified: '2025-02-05',
    dueDate: '2025-03-05',
    assignedTo: 'Anthony Garcia',
    description: 'The current password policy is not enforcing complexity requirements in accordance with CIS Control 5.2, allowing users to create easily guessable passwords.'
  },
  {
    id: 'FIN-2025-034',
    title: 'Missing Data Classification Policy',
    framework: 'SOC 2',
    control: 'CC6.1',
    severity: 'Low',
    status: 'Open',
    dateIdentified: '2025-02-01',
    dueDate: '2025-04-01',
    assignedTo: 'Lisa Johnson',
    description: 'There is no formal data classification policy to guide proper handling of sensitive information, which is required for SOC 2 CC6.1 compliance.'
  },
  {
    id: 'FIN-2025-033',
    title: 'Inadequate Security Awareness Training',
    framework: 'NIST CSF',
    control: 'PR.AT',
    severity: 'Medium',
    status: 'In Progress',
    dateIdentified: '2025-01-28',
    dueDate: '2025-03-28',
    assignedTo: 'Michelle Wong',
    description: 'Security awareness training is not being conducted regularly for all employees, which is required by NIST CSF PR.AT to maintain a security-conscious workforce.'
  },
];

// Framework options for filtering
const frameworkOptions = [
  'ISO 27001',
  'SOC 2',
  'GDPR',
  'HIPAA',
  'PCI DSS',
  'NIST CSF',
  'CIS Controls'
];

// Severity options for filtering
const severityOptions = [
  'Critical',
  'High',
  'Medium',
  'Low'
];

// Status options for filtering
const statusOptions = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed'
];

const FindingsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [findings, setFindings] = useState(mockFindings);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [filters, setFilters] = useState({
    framework: '',
    severity: '',
    status: '',
  });
  
  useEffect(() => {
    dispatch(setPageTitle('Compliance Findings'));
    
    // Simulate API call to load data
    const timer = setTimeout(() => {
      setFindings(mockFindings);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFindings(mockFindings);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredFindings = mockFindings.filter(finding => 
      finding.title.toLowerCase().includes(query) ||
      finding.id.toLowerCase().includes(query) ||
      finding.description.toLowerCase().includes(query) ||
      finding.framework.toLowerCase().includes(query) ||
      finding.control.toLowerCase().includes(query)
    );
    
    setFindings(filteredFindings);
    setPage(0);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter changes
  const handleFilterChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    applyFilters({ ...filters, [name]: value });
  };

  // Apply all current filters
  const applyFilters = (currentFilters = filters) => {
    let filteredData = [...mockFindings];
    
    if (currentFilters.framework) {
      filteredData = filteredData.filter(finding => 
        finding.framework === currentFilters.framework
      );
    }
    
    if (currentFilters.severity) {
      filteredData = filteredData.filter(finding => 
        finding.severity === currentFilters.severity
      );
    }
    
    if (currentFilters.status) {
      filteredData = filteredData.filter(finding => 
        finding.status === currentFilters.status
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(finding => 
        finding.title.toLowerCase().includes(query) ||
        finding.id.toLowerCase().includes(query) ||
        finding.description.toLowerCase().includes(query)
      );
    }
    
    setFindings(filteredData);
    setPage(0);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      framework: '',
      severity: '',
      status: '',
    });
    setFindings(mockFindings);
  };

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to finding detail
  const handleViewFinding = (id: string) => {
    navigate(`/compliance/findings/${id}`);
  };

  // Navigate to create finding
  const handleCreateFinding = () => {
    navigate('/compliance/findings/new');
  };
  
  // Navigate to edit finding
  const handleEditFinding = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/compliance/findings/${id}/edit`);
  };

  // Get color for severity
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <MainLayout title="Compliance Findings">
      <PageHeader
        title="Compliance Findings"
        subtitle="Manage and track compliance findings and remediation actions"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateFinding}
          >
            New Finding
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance', link: '/compliance' },
          { label: 'Findings' }
        ]}
      />

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search findings..."
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
                          applyFilters();
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
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Framework</InputLabel>
                    <Select
                      name="framework"
                      label="Framework"
                      value={filters.framework}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Frameworks</MenuItem>
                      {frameworkOptions.map((framework) => (
                        <MenuItem key={framework} value={framework}>
                          {framework}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Severity</InputLabel>
                    <Select
                      name="severity"
                      label="Severity"
                      value={filters.severity}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Severities</MenuItem>
                      {severityOptions.map((severity) => (
                        <MenuItem key={severity} value={severity}>
                          {severity}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      label="Status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
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

      {/* Findings table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Framework</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <LoadingSpinner message="Loading findings..." />
                  </TableCell>
                </TableRow>
              ) : findings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No findings match your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                findings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((finding) => (
                    <TableRow
                      key={finding.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewFinding(finding.id)}
                    >
                      <TableCell>{finding.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {finding.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 250, display: 'block' }}>
                            {finding.description.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">{finding.framework}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Control: {finding.control}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={finding.severity} 
                          color={getSeverityColor(finding.severity) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={finding.status} />
                      </TableCell>
                      <TableCell>
                        {format(new Date(finding.dueDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{finding.assignedTo}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="View details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewFinding(finding.id);
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit finding">
                            <IconButton
                              size="small"
                              onClick={(e) => handleEditFinding(finding.id, e)}
                            >
                              <EditIcon />
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
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={findings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainLayout>
  );
};

export default FindingsList;
