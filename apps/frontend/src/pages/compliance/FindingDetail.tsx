/**
 * Compliance Finding Detail
 * Current date: 2025-03-06 10:06:05
 * Current user: alschell
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowBack,
  Edit,
  Delete,
  Assignment,
  Task,
  Comment,
  Person,
  CalendarToday,
  Add,
  AttachFile,
  Description,
  CheckCircle,
  Error as ErrorIcon,
  Info,
  FormatListBulleted,
  Flag,
  EventNote,
  Send,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { AppDispatch } from '../../store';
import { setPageTitle } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';

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
      id={`finding-tabpanel-${index}`}
      aria-labelledby={`finding-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && children}
    </div>
  );
}

// Mock data for the finding
const mockFinding = {
  id: 'FIN-2025-042',
  title: 'Missing Encryption for Stored PII Data',
  framework: 'SOC 2',
  control: 'CC6.1',
  controlName: 'The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity\'s objectives.',
  severity: 'High',
  status: 'Open',
  dateIdentified: '2025-03-01',
  dueDate: '2025-04-15',
  assignedTo: {
    id: 'user-123',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: '/avatars/sarah.jpg',
  },
  submittedBy: {
    id: 'user-456',
    name: 'Michael Wilson',
    email: 'michael.wilson@company.com',
    avatar: '/avatars/michael.jpg',
  },
  description: 'PII data stored in the user profile database is not encrypted at rest, violating SOC 2 CC6.1 requirements and posing a risk of unauthorized data access.',
  evidence: [
    {
      id: 'ev-001',
      name: 'Database Configuration Screenshot.png',
      type: 'image/png',
      url: '/evidence/database-config.png',
      uploadedAt: '2025-03-01T10:30:00Z',
      uploadedBy: 'Michael Wilson',
    },
    {
      id: 'ev-002',
      name: 'Security Scan Results.pdf',
      type: 'application/pdf',
      url: '/evidence/scan-results.pdf',
      uploadedAt: '2025-03-01T10:35:00Z',
      uploadedBy: 'Michael Wilson',
    },
  ],
  risk: {
    likelihood: 'Medium',
    impact: 'High',
    description: 'If the database were compromised, attackers could access unencrypted PII data directly, potentially affecting all users of the platform. This could lead to regulatory penalties, reputational damage, and legal liability.',
  },
  remediation: {
    plan: 'Implement transparent data encryption (TDE) for the user profile database, including both stored data and backups. Update data security policies to require encryption for all PII data at rest.',
    tasks: [
      {
        id: 'task-001',
        title: 'Assess current database encryption capabilities',
        status: 'Completed',
        assignee: 'Robert Chen',
        dueDate: '2025-03-10',
      },
      {
        id: 'task-002',
        title: 'Develop encryption implementation plan',
        status: 'In Progress',
        assignee: 'Sarah Johnson',
        dueDate: '2025-03-20',
      },
      {
        id: 'task-003',
        title: 'Implement database encryption',
        status: 'Not Started',
        assignee: 'Database Team',
        dueDate: '2025-04-01',
      },
      {
        id: 'task-004',
        title: 'Verify encryption implementation',
        status: 'Not Started',
        assignee: 'Security Team',
        dueDate: '2025-04-10',
      },
    ],
  },
  history: [
    {
      id: 'act-001',
      type: 'Create',
      date: '2025-03-01T10:30:00Z',
      user: 'Michael Wilson',
      details: 'Finding created based on security assessment results',
    },
    {
      id: 'act-002',
      type: 'Update',
      date: '2025-03-01T14:45:00Z',
      user: 'Michael Wilson',
      details: 'Added evidence documentation',
    },
    {
      id: 'act-003',
      type: 'Comment',
      date: '2025-03-02T09:15:00Z',
      user: 'Sarah Johnson',
      details: 'Assigned remediation team to address this issue with high priority',
    },
    {
      id: 'act-004',
      type: 'Task',
      date: '2025-03-05T11:30:00Z',
      user: 'Sarah Johnson',
      details: 'Created remediation tasks and assigned owners',
    },
    {
      id: 'act-005',
      type: 'Update',
      date: '2025-03-10T15:20:00Z',
      user: 'Robert Chen',
      details: 'Completed assessment of current database encryption capabilities',
    },
  ],
  comments: [
    {
      id: 'com-001',
      text: 'I\'ve assigned the database team to analyze the encryption options for our current database system.',
      date: '2025-03-02T09:15:00Z',
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: 'com-002',
      text: 'Initial assessment shows we'll need to upgrade the database server to support TDE. I've scheduled the upgrade for next week.',
      date: '2025-03-05T14:30:00Z',
      user: {
        name: 'Robert Chen',
        avatar: '/avatars/robert.jpg',
      },
    },
    {
      id: 'com-003',
      text: 'Upgrade completed successfully. We can now proceed with implementing the encryption.',
      date: '2025-03-12T11:45:00Z',
      user: {
        name: 'Robert Chen',
        avatar: '/avatars/robert.jpg',
      },
    },
  ]
};

const FindingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [finding, setFinding] = useState<typeof mockFinding | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolvingFinding, setResolvingFinding] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(setPageTitle('Finding Details'));
    
    // Simulate API call to load data
    const timer = setTimeout(() => {
      setFinding(mockFinding);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch, id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/compliance/findings');
  };

  const handleEdit = () => {
    if (finding) {
      navigate(`/compliance/findings/${finding.id}/edit`);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // API call would go here
    dispatch(addNotification({
      message: 'Finding deleted successfully',
      type: 'success'
    }));
    navigate('/compliance/findings');
  };

  const handleResolveFinding = () => {
    setShowResolveDialog(true);
  };

  const confirmResolveFinding = () => {
    setResolvingFinding(true);
    
    // Simulate API call to resolve finding
    setTimeout(() => {
      if (finding) {
        setFinding({
          ...finding,
          status: 'Resolved'
        });
        
        dispatch(addNotification({
          message: 'Finding marked as resolved',
          type: 'success'
        }));
      }
      
      setResolvingFinding(false);
      setShowResolveDialog(false);
    }, 1000);
  };

  const handleAddComment = () => {
    if (finding && newComment.trim()) {
      // In a real app, this would be an API call
      const updatedFinding = {
        ...finding,
        comments: [
          ...finding.comments,
          {
            id: `com-00${finding.comments.length + 1}`,
            text: newComment,
            date: new Date().toISOString(),
            user: {
              name: 'You',
              avatar: '/avatars/default.jpg',
            },
          }
        ]
      };
      
      setFinding(updatedFinding);
      setNewComment('');
      
      dispatch(addNotification({
        message: 'Comment added successfully',
        type: 'success'
      }));
    }
  };
  
  const getTaskStatusChip = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Chip icon={<CheckCircle />} label="Completed" color="success" size="small" />;
      case 'In Progress':
        return <Chip icon={<Flag />} label="In Progress" color="warning" size="small" />;
      case 'Not Started':
      default:
        return <Chip icon={<Info />} label="Not Started" color="default" size="small" />;
    }
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
  
  if (loading) {
    return (
      <MainLayout title="Finding Details">
        <LoadingSpinner message="Loading finding details..." />
      </MainLayout>
    );
  }

  if (!finding) {
    return (
      <MainLayout title="Finding Details">
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            Finding not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Findings
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Finding: ${finding.id}`}>
      <PageHeader
        title={finding.title}
        subtitle={`Finding ID: ${finding.id}`}
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
            
            {finding.status !== 'Resolved' && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleResolveFinding}
              >
                Resolve
              </Button>
            )}
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance', link: '/compliance' },
          { label: 'Findings', link: '/compliance/findings' },
          { label: finding.id }
        ]}
      />

      <Grid container spacing={3}>
        {/* Summary Column */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {/* Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip status={finding.status} />
                </Box>
              </Box>

              {/* Severity */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Severity
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={finding.severity} 
                    color={getSeverityColor(finding.severity) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Framework and Control */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Framework
                </Typography>
                <Typography variant="body1">{finding.framework}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Control
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {finding.control}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {finding.controlName}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Dates */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Identified Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(finding.dateIdentified), 'MMM dd, yyyy')}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(finding.dueDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* People */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Assigned To
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar
                    src={finding.assignedTo.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Box>
                    <Typography variant="body2">{finding.assignedTo.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {finding.assignedTo.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Submitted By
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar
                    src={finding.submittedBy.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Box>
                    <Typography variant="body2">{finding.submittedBy.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {finding.submittedBy.email}
                    </Typography>
                  </Box>
                </Box>
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
                aria-label="finding details tabs"
              >
                <Tab label="Overview" />
                <Tab label="Remediation" />
                <Tab label="Evidence" />
                <Tab label="Comments" />
                <Tab label="History" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {finding.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Risk Assessment
                </Typography>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Likelihood
                        </Typography>
                        <Chip 
                          label={finding.risk.likelihood} 
                          color={
                            finding.risk.likelihood === 'High' ? 'error' :
                            finding.risk.likelihood === 'Medium' ? 'warning' : 'info'
                          } 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Impact
                        </Typography>
                        <Chip 
                          label={finding.risk.impact} 
                          color={
                            finding.risk.impact === 'High' ? 'error' :
                            finding.risk.impact === 'Medium' ? 'warning' : 'info'
                          } 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
                          Risk Description
                        </Typography>
                        <Typography variant="body2">
                          {finding.risk.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Remediation Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Remediation Plan
                </Typography>
                <Typography variant="body1" paragraph>
                  {finding.remediation.plan}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Remediation Tasks
                </Typography>
                
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {finding.remediation.tasks.map((task) => (
                    <ListItem
                      key={task.id}
                      divider
                      secondaryAction={getTaskStatusChip(task.status)}
                    >
                      <ListItemIcon>
                        <Task />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Assigned to: {task.assignee}
                            </Typography>
                            <Box component="span" sx={{ display: 'block' }}>
                              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                >
                  Add Task
                </Button>
              </Box>
            </TabPanel>

            {/* Evidence Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Evidence Documents
                </Typography>
                
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {finding.evidence.map((evidence) => (
                    <ListItem
                      key={evidence.id}
                      divider
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          href={evidence.url}
                          target="_blank"
                        >
                          View
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText
                        primary={evidence.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Uploaded by: {evidence.uploadedBy}
                            </Typography>
                            <Box component="span" sx={{ display: 'block' }}>
                              Date: {format(new Date(evidence.uploadedAt), 'MMM dd, yyyy HH:mm')}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                >
                  Add Evidence
                </Button>
              </Box>
            </TabPanel>

            {/* Comments Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Discussion
                </Typography>

                {/* Comments list */}
                <List sx={{ width: '100%' }}>
                  {finding.comments.map((comment) => (
                    <ListItem
                      key={comment.id}
                      alignItems="flex-start"
                      divider
                    >
                      <ListItemIcon>
                        <Avatar src={comment.user.avatar} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">
                              {comment.user.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {format(new Date(comment.date), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {/* New comment form */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Add Comment
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your comment here..."
                    variant="outlined"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Send />}
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Activity History
                </Typography>
                
                <Timeline position="right">
                  {finding.history.map((activity) => (
                    <TimelineItem key={activity.id}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }} color="text.secondary">
                        {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot 
                          color={
                            activity.type === 'Create' ? 'success' :
                            activity.type === 'Update' ? 'primary' :
                            activity.type === 'Comment' ? 'info' :
                            'secondary'
                          }
                        >
                          {activity.type === 'Create' ? <Add fontSize="small" /> : 
                           activity.type === 'Update' ? <Edit fontSize="small" /> :
                           activity.type === 'Comment' ? <Comment fontSize="small" /> :
                           <Task fontSize="small" />}
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="subtitle2" component="span">
                          {activity.type}
                        </Typography>
                        <Typography variant="body2">
                          {activity.details}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          By {activity.user}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
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
            Are you sure you want to delete finding {finding.id}? This action cannot be undone.
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog
        open={showResolveDialog}
        onClose={() => setShowResolveDialog(false)}
        aria-labelledby="resolve-dialog-title"
      >
        <DialogTitle id="resolve-dialog-title">
          Resolve Finding
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Resolving this finding will mark it as completed. Please provide a resolution note.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Resolution Note"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowResolveDialog(false)} 
            color="inherit"
            disabled={resolvingFinding}
          >
            Cancel
          </Button>
          <LoadingButton 
            onClick={confirmResolveFinding} 
            color="success" 
            variant="contained"
            loading={resolvingFinding}
            disabled={!resolutionNote.trim()}
            autoFocus
          >
            Resolve
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default FindingDetail;
