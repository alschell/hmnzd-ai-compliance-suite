/**
 * Compliance Framework Detail
 * Current date: 2025-03-06 09:55:44
 * Current user: alschell
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Assignment,
  BarChart,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  RemoveCircle,
  Cancel,
  HelpOutline,
  Save,
  Person,
  Link as LinkIcon,
  AttachFile,
  Add,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';

import { AppDispatch } from '../../store';
import {
  fetchFrameworkById,
  updateControl,
  deleteFramework,
  clearFrameworkDetail,
  selectFramework,
  selectFrameworkLoading,
  selectFrameworkError,
  Control,
  ControlGroup,
} from '../../store/slices/frameworkSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CHART_COLORS } from '../../config';

// Control status chip component
const ControlStatusChip = ({ status }: { status: Control['implementationStatus'] }) => {
  const getChipColor = () => {
    switch (status) {
      case 'Implemented':
        return { color: 'success', icon: <CheckCircle fontSize="small" /> };
      case 'Partially Implemented':
        return { color: 'warning', icon: <RemoveCircle fontSize="small" /> };
      case 'Not Implemented':
        return { color: 'error', icon: <Cancel fontSize="small" /> };
      case 'Not Applicable':
        return { color: 'default', icon: <HelpOutline fontSize="small" /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const { color, icon } = getChipColor();

  return (
    <Chip
      icon={icon}
      label={status}
      color={color as any}
      size="small"
      variant="outlined"
    />
  );
};

// Control row component for the table
interface ControlRowProps {
  control: Control;
  frameworkId: string;
  onUpdateControl: (controlId: string, data: Partial<Control>) => void;
}

const ControlRow = ({ control, frameworkId, onUpdateControl }: ControlRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(control.implementationStatus);
  const [updatedDetails, setUpdatedDetails] = useState(control.implementationDetails || '');
  const [updatedNotes, setUpdatedNotes] = useState(control.notes || '');
  const [saving, setSaving] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await onUpdateControl(control.id, {
        implementationStatus: updatedStatus,
        implementationDetails: updatedDetails,
        notes: updatedNotes,
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Failed to update control:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUpdatedStatus(control.implementationStatus);
    setUpdatedDetails(control.implementationDetails || '');
    setUpdatedNotes(control.notes || '');
    setEditing(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={handleExpandClick}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Typography variant="body2">{control.id}</Typography>
          </Box>
        </TableCell>
        <TableCell>{control.name}</TableCell>
        <TableCell>
          {editing ? (
            <FormControl fullWidth size="small">
              <Select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value as Control['implementationStatus'])}
              >
                <MenuItem value="Implemented">Implemented</MenuItem>
                <MenuItem value="Partially Implemented">Partially Implemented</MenuItem>
                <MenuItem value="Not Implemented">Not Implemented</MenuItem>
                <MenuItem value="Not Applicable">Not Applicable</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <ControlStatusChip status={control.implementationStatus} />
          )}
        </TableCell>
        <TableCell>
          {control.assignedTo?.name || (
            <Typography variant="caption" color="textSecondary">
              Unassigned
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {editing ? (
            <>
              <Button 
                size="small"
                variant="contained" 
                color="primary"
                startIcon={<Save />}
                disabled={saving}
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                {saving ? <CircularProgress size={20} /> : 'Save'}
              </Button>
              <Button 
                size="small" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              size="small"
              variant="outlined" 
              startIcon={<Edit />}
              onClick={handleEditClick}
            >
              Update
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ py: 3, px: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {control.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Implementation Details
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Describe how this control is implemented..."
                      value={updatedDetails}
                      onChange={(e) => setUpdatedDetails(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body2" paragraph>
                      {control.implementationDetails || 'No implementation details provided.'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes & Observations
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Add any notes or observations..."
                      value={updatedNotes}
                      onChange={(e) => setUpdatedNotes(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body2" paragraph>
                      {control.notes || 'No notes provided.'}
                    </Typography>
                  )}
                </Grid>
                
                {(control.evidenceRequired || control.evidenceLinks?.length) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Evidence
                      {control.evidenceRequired && (
                        <Chip 
                          label="Required" 
                          color="primary" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    
                    {control.evidenceLinks && control.evidenceLinks.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {control.evidenceLinks.map((link, index) => (
                          <Chip
                            key={index}
                            icon={link.includes('http') ? <LinkIcon /> : <AttachFile />}
                            label={link.split('/').pop() || link}
                            component="a"
                            href={link}
                            target="_blank"
                            clickable
                            size="small"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2">
                        No evidence provided.
                        {control.evidenceRequired && ' Evidence is required for this control.'}
                      </Typography>
                    )}
                    
                    {editing && (
                      <Button 
                        startIcon={<Add />}
                        variant="outlined" 
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Add Evidence
                      </Button>
                    )}
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`framework-tabpanel-${index}`}
      aria-labelledby={`framework-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && children}
    </div>
  );
}

const FrameworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const framework = useSelector(selectFramework);
  const loading = useSelector(selectFrameworkLoading);
  const error = useSelector(selectFrameworkError);

  const [tabValue, setTabValue] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchFrameworkById(id));
    }

    return () => {
      dispatch(clearFrameworkDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (framework) {
      dispatch(setPageTitle(`Framework: ${framework.name}`));
      
      // Expand first group by default if available
      if (framework.controlGroups && framework.controlGroups.length > 0) {
        setExpandedGroups([framework.controlGroups[0].id]);
      }
    }
  }, [dispatch, framework]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/compliance/frameworks');
  };

  const handleEdit = () => {
    if (framework) {
      navigate(`/compliance/frameworks/${framework.id}/edit`);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (id) {
      await dispatch(deleteFramework(id));
      dispatch(addNotification({
        message: 'Framework deleted successfully',
        type: 'success'
      }));
      navigate('/compliance/frameworks');
    }
  };

  const handleAssessment = () => {
    if (framework) {
      navigate(`/compliance/frameworks/${framework.id}/assess`);
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  const handleUpdateControl = async (controlId: string, data: Partial<Control>) => {
    if (!id) return;
    
    try {
      await dispatch(updateControl({
        frameworkId: id,
        controlId,
        data
      }));
      
      dispatch(addNotification({
        message: 'Control updated successfully',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to update control',
        type: 'error'
      }));
    }
  };
  
  // Format data for compliance distribution chart
  const getComplianceDistributionData = () => {
    if (!framework) return null;
    
    return {
      labels: ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'],
      datasets: [
        {
          data: [
            framework.implementedControls,
            framework.partiallyImplementedControls,
            framework.notImplementedControls,
            framework.notApplicableControls
          ],
          backgroundColor: [
            CHART_COLORS.success,
            CHART_COLORS.warning,
            CHART_COLORS.error,
            CHART_COLORS.grey
          ],
          borderWidth: 1,
          borderColor: '#ffffff'
        }
      ]
    };
  };
  
  if (loading && !framework) {
    return (
      <MainLayout title="Framework Details">
        <LoadingSpinner message="Loading framework details..." />
      </MainLayout>
    );
  }

  if (error || !framework) {
    return (
      <MainLayout title="Framework Details">
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            {error || 'Framework not found'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Frameworks
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Format dates
  const createdAt = format(new Date(framework.createdAt), 'MMM dd, yyyy');
  const updatedAt = format(new Date(framework.updatedAt), 'MMM dd, yyyy');
  const lastAssessmentDate = framework.lastAssessmentDate
    ? format(new Date(framework.lastAssessmentDate), 'MMM dd, yyyy')
    : 'Not assessed yet';
  const nextAssessmentDate = framework.nextAssessmentDate
    ? format(new Date(framework.nextAssessmentDate), 'MMM dd, yyyy')
    : 'Not scheduled';

  return (
    <MainLayout title={`Framework: ${framework.name}`}>
      <PageHeader
        title={framework.name}
        subtitle={`Version ${framework.version}`}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<BarChart />}
              onClick={handleAssessment}
            >
              Assessment
            </Button>
          </Box>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance', link: '/compliance' },
          { label: 'Frameworks', link: '/compliance/frameworks' },
          { label: framework.name }
        ]}
      />

      <Grid container spacing={3}>
        {/* Summary Column */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {/* Compliance Score */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Compliance Score
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      color: framework.complianceScore >= 80 ? 'success.main' : 
                             framework.complianceScore >= 60 ? 'warning.main' : 
                             'error.main',
                      fontWeight: 500
                    }}
                  >
                    {framework.complianceScore}%
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Implementation Progress */}
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Implementation Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

              {/* Control Counts */}
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Control Implementation
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Implemented
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'success.main' }}>
                      {framework.implementedControls}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Partial
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'warning.main' }}>
                      {framework.partiallyImplementedControls}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Not Implemented
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'error.main' }}>
                      {framework.notImplementedControls}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      N/A
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {framework.notApplicableControls}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Framework Details */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">{framework.category}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Owner
                </Typography>
                <Typography variant="body1">
                  {framework.owner
                    ? framework.owner.name
                    : 'Unassigned'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Assessment
                </Typography>
                <Typography variant="body1">{lastAssessmentDate}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Next Assessment
                </Typography>
                <Typography variant="body1">{nextAssessmentDate}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Creation Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created
                </Typography>
                <Typography variant="body2">{createdAt}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">{updatedAt}</Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* Compliance Distribution Chart */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Control Distribution
              </Typography>
              <Box sx={{ height: 260, display: 'flex', justifyContent: 'center' }}>
                <Doughnut
                  data={getComplianceDistributionData() || {labels: [], datasets: []}}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    },
                    cutout: '65%'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detail Column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="framework details tabs"
              >
                <Tab label="Overview" />
                <Tab label="Controls" />
                <Tab label="Assessment History" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Framework Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {framework.description || 'No description provided.'}
                </Typography>
                
                {/* Control Group Summary */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Control Groups Overview
                </Typography>
                
                {framework.controlGroups && framework.controlGroups.length > 0 ? (
                  <Grid container spacing={2}>
                    {framework.controlGroups.map(group => {
                      // Count controls in this group
                      const groupControls = framework.controls?.filter(c => c.groupId === group.id) || [];
                      const implementedCount = groupControls.filter(c => c.implementationStatus === 'Implemented').length;
                      const partialCount = groupControls.filter(c => c.implementationStatus === 'Partially Implemented').length;
                      const notImplementedCount = groupControls.filter(c => c.implementationStatus === 'Not Implemented').length;
                      const notApplicableCount = groupControls.filter(c => c.implementationStatus === 'Not Applicable').length;
                      const totalCount = groupControls.length;
                      
                      // Calculate group compliance score
                      const denominator = totalCount - notApplicableCount;
                      const complianceScore = denominator > 0 
                        ? Math.round((implementedCount + (partialCount * 0.5)) / denominator * 100)
                        : 100;
                        
                      return (
                        <Grid item xs={12} md={6} key={group.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                {group.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                {group.description || 'No description'}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">
                                  Compliance: {complianceScore}%
                                </Typography>
                                <Typography variant="body2">
                                  {implementedCount}/{totalCount} controls
                                </Typography>
                              </Box>
                              
                              <LinearProgress 
                                variant="determinate" 
                                value={complianceScore} 
                                color={
                                  complianceScore >= 80 ? "success" : 
                                  complianceScore >= 60 ? "warning" : 
                                  "error"
                                }
                                sx={{ height: 6, borderRadius: 1 }}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No control groups defined for this framework.
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Controls Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Framework Controls
                </Typography>
                
                {framework.controlGroups && framework.controls && (
                  <>
                    {framework.controlGroups.map(group => {
                      const isExpanded = expandedGroups.includes(group.id);
                      const groupControls = framework.controls!.filter(c => c.groupId === group.id);
                      
                      return (
                        <Card key={group.id} variant="outlined" sx={{ mb: 2 }}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: 'action.hover',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleToggleGroup(group.id)}
                          >
                            <Box>
                              <Typography variant="subtitle1">
                                {group.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {groupControls.length} controls
                              </Typography>
                            </Box>
                            <IconButton size="small">
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                          
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Control</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {groupControls.map(control => (
                                    <ControlRow 
                                      key={control.id} 
                                      control={control} 
                                      frameworkId={framework.id}
                                      onUpdateControl={handleUpdateControl}
                                    />
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Collapse>
                        </Card>
                      );
                    })}
                  </>
                )}
              </Box>
            </TabPanel>

            {/* Assessment History Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" color="textSecondary">
                  Assessment history functionality will be implemented in the future release.
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Assignment />}
                  sx={{ mt: 3 }}
                  onClick={handleAssessment}
                >
                  Start New Assessment
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the {framework.name} framework? This action cannot be undone and will remove all associated controls and assessment data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteConfirm(false)} 
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
