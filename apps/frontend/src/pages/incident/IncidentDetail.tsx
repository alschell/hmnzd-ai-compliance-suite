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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import {
  ArrowBack,
  Edit,
  Delete,
  Assignment,
  CheckCircle,
  Warning,
  Comment,
  History,
  Info,
  Person,
  Schedule,
  LocalFireDepartment,
  Download,
} from '@mui/icons-material';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

import { AppDispatch, RootState } from '../../store';
import {
  fetchIncidentById,
  createIncidentUpdate,
  updateIncident,
  deleteIncident,
  clearIncidentDetail,
  selectIncidentDetail,
  selectIncidentLoading,
  selectIncidentError,
} from '../../store/slices/incidentSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Helper to get icon for update type
const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'Status Change':
      return <CheckCircle color="primary" />;
    case 'Investigation':
      return <Info color="info" />;
    case 'Mitigation':
      return <LocalFireDepartment color="warning" />;
    case 'Resolution':
      return <CheckCircle color="success" />;
    case 'Assignment':
      return <Person color="secondary" />;
    default:
      return <Comment color="default" />;
  }
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
      id={`incident-tabpanel-${index}`}
      aria-labelledby={`incident-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && children}
    </div>
  );
}

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const incident = useSelector(selectIncidentDetail);
  const loading = useSelector(selectIncidentLoading);
  const error = useSelector(selectIncidentError);

  const [tabValue, setTabValue] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchIncidentById(id));
    }

    return () => {
      dispatch(clearIncidentDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (incident) {
      dispatch(setPageTitle(`Incident: ${incident.id}`));
    }
  }, [dispatch, incident]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/incidents');
  };

  const handleEdit = () => {
    navigate(`/incidents/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (id) {
      await dispatch(deleteIncident(id));
      navigate('/incidents');
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export incident', id);
  };

  // Update status formik
  const statusFormik = useFormik({
    initialValues: {
      newStatus: '',
      updateText: '',
    },
    validationSchema: Yup.object({
      newStatus: Yup.string().required('Status is required'),
      updateText: Yup.string().required('Update description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!id || !incident) return;

      const updateData = {
        updateText: values.updateText,
        updateType: 'Status Change',
        previousStatus: incident.status,
        newStatus: values.newStatus,
      };

      await dispatch(createIncidentUpdate({ id, data: updateData }));

      // Also update the incident status
      await dispatch(
        updateIncident({
          id,
          data: { status: values.newStatus },
        })
      );

      resetForm();
    },
  });

  // Add comment formik
  const commentFormik = useFormik({
    initialValues: {
      updateText: '',
      updateType: 'General',
    },
    validationSchema: Yup.object({
      updateText: Yup.string().required('Comment text is required'),
      updateType: Yup.string().required('Update type is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!id) return;

      await dispatch(
        createIncidentUpdate({
          id,
          data: {
            updateText: values.updateText,
            updateType: values.updateType,
          },
        })
      );

      resetForm();
    },
  });

  if (loading && !incident) {
    return (
      <MainLayout title="Incident Details">
        <LoadingSpinner message="Loading incident details..." />
      </MainLayout>
    );
  }

  if (error || !incident) {
    return (
      <MainLayout title="Incident Details">
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            {error || 'Incident not found'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Incidents
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Format dates
  const createdAt = format(new Date(incident.createdAt), 'MMM dd, yyyy HH:mm');
  const updatedAt = format(new Date(incident.updatedAt), 'MMM dd, yyyy HH:mm');
  
  // Format SLA if present
  const sla = incident.sla 
    ? format(new Date(incident.sla), 'MMM dd, yyyy HH:mm')
    : 'Not set';

  // Calculate time to SLA
  const getSlaStatus = () => {
    if (!incident.sla) return null;
    
    const slaDate = new Date(incident.sla);
    const now = new Date();
    
    if (now > slaDate) {
      return {
        label: 'SLA Missed',
        color: 'error',
        timeRemaining: `Overdue by ${formatDistanceToNow(slaDate)}`
      };
    } else {
      return {
        label: 'SLA Target',
        color: 'success',
        timeRemaining: `${formatDistanceToNow(slaDate)} remaining`
      };
    }
  };
  
  const slaStatus = getSlaStatus();

  return (
    <MainLayout title={`Incident: ${incident.id}`}>
      <PageHeader
        title={incident.title}
        subtitle={`Incident ID: ${incident.id}`}
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
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Incidents', link: '/incidents' },
          { label: incident.id }
        ]}
      />

      <Grid container spacing={3}>
        {/* Summary Column */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {/* Status and Severity */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip status={incident.status} />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Severity
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip status={incident.severity} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Category */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">{incident.category}</Typography>
              </Box>

              {/* Affected Systems */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Affected Systems
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {incident.affectedSystems && incident.affectedSystems.length > 0
                    ? incident.affectedSystems.map((system) => (
                        <Chip key={system} label={system} size="small" />
                      ))
                    : <Typography variant="body2" color="textSecondary">None specified</Typography>
                  }
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Owner */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Owner
                </Typography>
                <Typography variant="body1">
                  {incident.owner
                    ? `${incident.owner.firstName} ${incident.owner.lastName}`
                    : 'Unassigned'}
                </Typography>
              </Box>

              {/* Assigned Team */}
              {incident.assignedTeam && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Assigned Team
                  </Typography>
                  <Typography variant="body1">{incident.assignedTeam}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* SLA */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  SLA Target
                </Typography>
                <Typography variant="body1">{sla}</Typography>
                {slaStatus && (
                  <Chip
                    size="small"
                    label={slaStatus.label}
                    color={slaStatus.color as any}
                    sx={{ mt: 1, mr: 1 }}
                  />
                )}
                {slaStatus && (
                  <Typography variant="caption" color="textSecondary">
                    {slaStatus.timeRemaining}
                  </Typography>
                )}
              </Box>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Progress
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    height: 8,
                    width: '100%',
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${incident.progress}%`,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {incident.progress}% Complete
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Date Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {createdAt} by {incident.createdBy.firstName} {incident.createdBy.lastName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">{updatedAt}</Typography>
              </Box>

              {incident.resolvedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Resolved
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(incident.resolvedAt), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Box>
              )}

              {incident.closedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Closed
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(incident.closedAt), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Box>
              )}
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
                aria-label="incident details tabs"
              >
                <Tab label="Details" />
                <Tab label="Updates" />
                <Tab label="Actions" />
              </Tabs>
            </Box>

            {/* Details Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Description */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {incident.description || 'No description provided.'}
                  </Typography>
                </Grid>

                {/* Impact */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Impact
                  </Typography>
                  <Typography variant="body1">
                    {incident.impact || 'No impact details provided.'}
                  </Typography>
                </Grid>

                {/* Root Cause */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Root Cause
                  </Typography>
                  <Typography variant="body1">
                    {incident.rootCause || 'Root cause analysis not yet available.'}
                  </Typography>
                </Grid>

                {/* Mitigation */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Mitigation Steps
                  </Typography>
                  <Typography variant="body1">
                    {incident.mitigation || 'No mitigation steps documented.'}
                  </Typography>
                </Grid>

                {/* Lessons Learned */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Lessons Learned
                  </Typography>
                  <Typography variant="body1">
                    {incident.lessons || 'No lessons learned documented.'}
                  </Typography>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Updates Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Incident Timeline
                </Typography>

                {incident.updates && incident.updates.length > 0 ? (
                  <Timeline position="right">
                    {incident.updates.map((update) => (
                      <TimelineItem key={update._id}>
                        <TimelineOppositeContent color="text.secondary">
                          {format(new Date(update.createdAt), 'MMM dd, HH:mm')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color="primary">
                            {getUpdateIcon(update.updateType)}
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body1">{update.updateText}</Typography>
                          <Typography variant="caption
                                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            {update.updateType}
                            {update.previousStatus && update.newStatus ? (
                              <span>
                                : <StatusChip status={update.previousStatus} size="small" /> →{' '}
                                <StatusChip status={update.newStatus} size="small" />
                              </span>
                            ) : null}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            By {update.updatedBy.firstName} {update.updatedBy.lastName}
                          </Typography>
                          
                          {update.attachments && update.attachments.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              {update.attachments.map((attachment) => (
                                <Chip
                                  key={attachment.url}
                                  label={attachment.name}
                                  size="small"
                                  component="a"
                                  href={attachment.url}
                                  target="_blank"
                                  clickable
                                  sx={{ mr: 1, mt: 1 }}
                                />
                              ))}
                            </Box>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                    No updates have been added to this incident yet.
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Actions Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {/* Update Status */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Update Status
                  </Typography>
                  <Card sx={{ p: 2 }}>
                    <form onSubmit={statusFormik.handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            select
                            id="newStatus"
                            name="newStatus"
                            label="New Status"
                            value={statusFormik.values.newStatus}
                            onChange={statusFormik.handleChange}
                            error={statusFormik.touched.newStatus && Boolean(statusFormik.errors.newStatus)}
                            helperText={statusFormik.touched.newStatus && statusFormik.errors.newStatus}
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Status</option>
                            <option value="Open">Open</option>
                            <option value="Investigating">Investigating</option>
                            <option value="Mitigated">Mitigated</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            id="updateText"
                            name="updateText"
                            label="Status Change Notes"
                            multiline
                            rows={2}
                            value={statusFormik.values.updateText}
                            onChange={statusFormik.handleChange}
                            error={statusFormik.touched.updateText && Boolean(statusFormik.errors.updateText)}
                            helperText={statusFormik.touched.updateText && statusFormik.errors.updateText}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="contained" color="primary">
                              Update Status
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Card>
                </Grid>

                {/* Add Comment */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Add Update
                  </Typography>
                  <Card sx={{ p: 2 }}>
                    <form onSubmit={commentFormik.handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            select
                            id="updateType"
                            name="updateType"
                            label="Update Type"
                            value={commentFormik.values.updateType}
                            onChange={commentFormik.handleChange}
                            error={commentFormik.touched.updateType && Boolean(commentFormik.errors.updateType)}
                            helperText={commentFormik.touched.updateType && commentFormik.errors.updateType}
                            SelectProps={{ native: true }}
                          >
                            <option value="General">General Comment</option>
                            <option value="Investigation">Investigation Update</option>
                            <option value="Mitigation">Mitigation Action</option>
                            <option value="Resolution">Resolution Details</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            id="updateText"
                            name="updateText"
                            label="Update Details"
                            multiline
                            rows={3}
                            value={commentFormik.values.updateText}
                            onChange={commentFormik.handleChange}
                            error={commentFormik.touched.updateText && Boolean(commentFormik.errors.updateText)}
                            helperText={commentFormik.touched.updateText && commentFormik.errors.updateText}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="contained" color="primary">
                              Add Update
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Card>
                </Grid>

                {/* Assign Incident */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Assign Incident
                  </Typography>
                  <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          select
                          label="Assign To"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select User</option>
                          <option value="user1">John Smith (Security Analyst)</option>
                          <option value="user2">Jane Doe (Compliance Manager)</option>
                          <option value="user3">Alex Johnson (Security Engineer)</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                          <Button variant="outlined" color="primary">
                            Assign
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ width: 400, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Deletion
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete incident {incident.id}? This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </Box>
          </Card>
        </Box>
      )}
    </MainLayout>
  );
};

export default IncidentDetail;
