import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Autocomplete,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowBack,
  Save,
  Add,
  Delete,
  Upload,
  Task,
  AttachFile,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { AppDispatch } from '../../store';
import { setPageTitle } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';

// Mock data for dropdowns
const frameworkOptions = [
  { id: 'iso27001', name: 'ISO 27001' },
  { id: 'soc2', name: 'SOC 2' },
  { id: 'gdpr', name: 'GDPR' },
  { id: 'hipaa', name: 'HIPAA' },
  { id: 'pcidss', name: 'PCI DSS' },
  { id: 'nistcsf', name: 'NIST CSF' },
  { id: 'cis', name: 'CIS Controls' }
];

const getFrameworkControls = (frameworkId: string) => {
  switch (frameworkId) {
    case 'iso27001':
      return [
        { id: 'A.5.1.1', name: 'Policies for information security' },
        { id: 'A.6.1.1', name: 'Information security roles and responsibilities' },
        { id: 'A.8.1.1', name: 'Inventory of assets' },
        { id: 'A.9.2.6', name: 'Removal or adjustment of access rights' },
        { id: 'A.17.1.1', name: 'Planning information security continuity' },
      ];
    case 'soc2':
      return [
        { id: 'CC1.1', name: 'COSO Principle 1: Demonstrates Commitment to Integrity and Ethical Values' },
        { id: 'CC5.1', name: 'Logical Access Security' },
        { id: 'CC6.1', name: 'Secure Logical Access Points' },
        { id: 'CC7.1', name: 'System Development Life Cycle' },
        { id: 'CC9.1', name: 'Business Continuity Planning' },
      ];
    case 'gdpr':
      return [
        { id: 'Art. 5', name: 'Principles relating to processing of personal data' },
        { id: 'Art. 6', name: 'Lawfulness of processing' },
        { id: 'Art. 17', name: 'Right to erasure' },
        { id: 'Art. 28', name: 'Processor' },
        { id: 'Art. 32', name: 'Security of processing' },
      ];
    default:
      return [];
  }
};

const severityOptions = [
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

const userOptions = [
  { id: 'user1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: 'user2', name: 'Michael Wilson', email: 'michael.wilson@company.com' },
  { id: 'user3', name: 'Emma Rodriguez', email: 'emma.rodriguez@company.com' },
  { id: 'user4', name: 'Robert Chen', email: 'robert.chen@company.com' },
  { id: 'user5', name: 'Jennifer Smith', email: 'jennifer.smith@company.com' },
  { id: 'user6', name: 'David Thompson', email: 'david.thompson@company.com' }
];

interface RemediationTask {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
}

const CreateFinding = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState('');
  const [controlOptions, setControlOptions] = useState<Array<{id: string, name: string}>>([]);
  const [tasks, setTasks] = useState<RemediationTask[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<RemediationTask | null>(null);
  const [isEditTaskMode, setIsEditTaskMode] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  useEffect(() => {
    dispatch(setPageTitle('Create Finding'));
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedFrameworkId) {
      setControlOptions(getFrameworkControls(selectedFrameworkId));
    } else {
      setControlOptions([]);
    }
  }, [selectedFrameworkId]);
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be at most 200 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    frameworkId: Yup.string()
      .required('Framework is required'),
    controlId: Yup.string()
      .required('Control is required'),
    severity: Yup.string()
      .required('Severity is required'),
    assigneeId: Yup.string()
      .required('Assignee is required'),
    dueDate: Yup.date()
      .required('Due date is required')
      .min(new Date(), 'Due date must be in the future'),
    likelihood: Yup.string()
      .required('Likelihood is required'),
    impact: Yup.string()
      .required('Impact is required'),
    riskDescription: Yup.string()
      .required('Risk description is required'),
    remediationPlan: Yup.string()
      .required('Remediation plan is required')
      .min(10, 'Remediation plan must be at least 10 characters'),
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      frameworkId: '',
      controlId: '',
      severity: '',
      assigneeId: '',
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'), // Default to 30 days in the future
      likelihood: '',
      impact: '',
      riskDescription: '',
      remediationPlan: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      
      // In a real app, we would make an API call here
      setTimeout(() => {
        // Create a full finding object that would be sent to the API
        const newFinding = {
          ...values,
          id: `FIN-${format(new Date(), 'yyyy')}-${Math.floor(Math.random() * 999) + 1}`,
          dateIdentified: format(new Date(), 'yyyy-MM-dd'),
          status: 'Open',
          tasks: tasks,
          attachments: attachments.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          })),
        };
        
        // Console log for development purposes
        console.log('New finding:', newFinding);
        
        dispatch(addNotification({
          message: 'Finding created successfully',
          type: 'success'
        }));
        
        // Navigate back to findings list
        navigate('/compliance/findings');
        
        setLoading(false);
      }, 1000);
    },
  });
  
  const handleCancel = () => {
    navigate('/compliance/findings');
  };
  
  const handleFrameworkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const frameworkId = event.target.value;
    formik.setFieldValue('frameworkId', frameworkId);
    formik.setFieldValue('controlId', ''); // Reset control when framework changes
    setSelectedFrameworkId(frameworkId);
  };
  
  const handleAddTask = () => {
    setCurrentTask({
      id: uuidv4(),
      title: '',
      description: '',
      dueDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), // Default to 14 days
    });
    setIsEditTaskMode(false);
    setShowTaskDialog(true);
  };
  
  const handleEditTask = (task: RemediationTask) => {
    setCurrentTask({ ...task });
    setIsEditTaskMode(true);
    setShowTaskDialog(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleSaveTask = (task: RemediationTask) => {
    if (isEditTaskMode) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, task]);
    }
    setShowTaskDialog(false);
    setCurrentTask(null);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setAttachments(attachments.filter(file => file !== fileToRemove));
  };
  
  const getSelectedFrameworkName = () => {
    const framework = frameworkOptions.find(f => f.id === formik.values.frameworkId);
    return framework ? framework.name : '';
  };
  
  const getSelectedControlName = () => {
    const control = controlOptions.find(c => c.id === formik.values.controlId);
    return control ? control.name : '';
  };
  
  const getAssigneeName = (assigneeId: string) => {
    const user = userOptions.find(u => u.id === assigneeId);
    return user ? user.name : '';
  };
  
  return (
    <MainLayout title="Create Finding">
      <PageHeader
        title="Create Finding"
        subtitle="Report a new compliance finding"
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance', link: '/compliance' },
          { label: 'Findings', link: '/compliance/findings' },
          { label: 'Create Finding' }
        ]}
      />
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Details Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Finding Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Finding Title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      multiline
                      rows={4}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.frameworkId && Boolean(formik.errors.frameworkId)}
                    >
                      <InputLabel id="frameworkId-label">Framework</InputLabel>
                      <Select
                        labelId="frameworkId-label"
                        id="frameworkId"
                        name="frameworkId"
                        value={formik.values.frameworkId}
                        onChange={handleFrameworkChange}
                        onBlur={formik.handleBlur}
                        label="Framework"
                      >
                        {frameworkOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.frameworkId && formik.errors.frameworkId && (
                        <FormHelperText>{formik.errors.frameworkId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.controlId && Boolean(formik.errors.controlId)}
                      disabled={!formik.values.frameworkId}
                    >
                      <InputLabel id="controlId-label">Control</InputLabel>
                      <Select
                        labelId="controlId-label"
                        id="controlId"
                        name="controlId"
                        value={formik.values.controlId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Control"
                      >
                        {controlOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id}: {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.controlId && formik.errors.controlId && (
                        <FormHelperText>{formik.errors.controlId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.severity && Boolean(formik.errors.severity)}
                    >
                      <InputLabel id="severity-label">Severity</InputLabel>
                      <Select
                        labelId="severity-label"
                        id="severity"
                        name="severity"
                        value={formik.values.severity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Severity"
                      >
                        {severityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.severity && formik.errors.severity && (
                        <FormHelperText>{formik.errors.severity}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.assigneeId && Boolean(formik.errors.assigneeId)}
                    >
                      <InputLabel id="assigneeId-label">Assignee</InputLabel>
                      <Select
                        labelId="assigneeId-label"
                        id="assigneeId"
                        name="assigneeId"
                        value={formik.values.assigneeId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Assignee"
                      >
                        {userOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.assigneeId && formik.errors.assigneeId && (
                        <FormHelperText>{formik.errors.assigneeId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="dueDate"
                      name="dueDate"
                      label="Due Date"
                      type="date"
                      value={formik.values.dueDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                      helperText={formik.touched.dueDate && formik.errors.dueDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Risk Assessment Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.likelihood && Boolean(formik.errors.likelihood)}
                    >
                      <InputLabel id="likelihood-label">Likelihood</InputLabel>
                      <Select
                        labelId="likelihood-label"
                        id="likelihood"
                        name="likelihood"
                        value={formik.values.likelihood}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Likelihood"
                      >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                      {formik.touched.likelihood && formik.errors.likelihood && (
                        <FormHelperText>{formik.errors.likelihood}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.impact && Boolean(formik.errors.impact)}
                    >
                      <InputLabel id="impact-label">Impact</InputLabel>
                      <Select
                        labelId="impact-label"
                        id="impact"
                        name="impact"
                        value={formik.values.impact}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Impact"
                      >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                      {formik.touched.impact && formik.errors.impact && (
                        <FormHelperText>{formik.errors.impact}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="riskDescription"
                      name="riskDescription"
                      label="Risk Description"
                      multiline
                      rows={4}
                      value={formik.values.riskDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.riskDescription && Boolean(formik.errors.riskDescription)}
                      helperText={formik.touched.riskDescription && formik.errors.riskDescription}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Evidence Upload Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Evidence
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <input
                    type="file"
                    id="evidence-upload"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="evidence-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Upload />}
                    >
                      Upload Evidence
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Upload screenshots, documents, or other evidence related to this finding.
                  </Typography>
                </Box>
                
                {attachments.length > 0 && (
                  <List dense>
                    {attachments.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachFile />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(1)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleRemoveFile(file)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Remediation Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Remediation
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="remediationPlan"
                      name="remediationPlan"
                      label="Remediation Plan"
                      multiline
                      rows={4}
                      value={formik.values.remediationPlan}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.remediationPlan && Boolean(formik.errors.remediationPlan)}
                      helperText={formik.touched.remediationPlan && formik.errors.remediationPlan}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Remediation Tasks
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAddTask}
                      >
                        Add Task
                      </Button>
                    </Box>
                    
                    {tasks.length === 0 ? (
                      <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        No tasks added yet. Click "Add Task" to create remediation tasks.
                      </Typography>
                    ) : (
                      <Paper variant="outlined">
                        <List dense>
                          {tasks.map((task) => (
                            <ListItem key={task.id} divider>
                              <ListItemIcon>
                                <Task />
                              </ListItemIcon>
                              <ListItemText
                                primary={task.title}
                                secondary={
                                  <Box>
                                    {task.description && (
                                      <Typography variant="body2" color="textSecondary">
                                        {task.description}
                                      </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', mt: 0.5 }}>
                                      {task.assigneeId && (
                                        <Chip
                                          label={getAssigneeName(task.assigneeId)}
                                          size="small"
                                          sx={{ mr: 1 }}
                                        />
                                      )}
                                      {task.dueDate && (
                                        <Chip
                                          label={`Due: ${format(new Date(task.dueDate), 'MMM dd, yyyy')}`}
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleEditTask(task)}>
                                  <Edit />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Summary Preview Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Finding Summary
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Title
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formik.values.title || 'Not specified'}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary">
                      Framework
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getSelectedFrameworkName() || 'Not selected'}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary">
                      Control
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formik.values.controlId && `${formik.values.controlId}: ${getSelectedControlName()}`}
                      {!formik.values.controlId && 'Not selected'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Severity
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formik.values.severity || 'Not specified'}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary">
                      Assignee
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formik.values.assigneeId ? getAssigneeName(formik.values.assigneeId) : 'Not assigned'}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formik.values.dueDate ? format(new Date(formik.values.dueDate), 'MMM dd, yyyy') : 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                loading={loading}
              >
                Create Finding
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      {/* Task Dialog */}
      <Dialog 
        open={showTaskDialog} 
        onClose={() => setShowTaskDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditTaskMode ? 'Edit Task' : 'Add Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={currentTask?.title || ''}
                onChange={(e) => setCurrentTask(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={currentTask?.description || ''}
                onChange={(e) => setCurrentTask(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
