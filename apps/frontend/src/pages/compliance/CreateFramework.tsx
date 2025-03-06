/**
 * Create Compliance Framework
 * Current date: 2025-03-06 10:00:21
 * Current user: alschell
 */

import { useEffect, useState } from 'react';
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
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Edit,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { AppDispatch } from '../../store';
import {
  createFramework,
  fetchFrameworkCategories,
  selectFrameworkCategories,
  selectFrameworkLoading,
} from '../../store/slices/frameworkSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';

// Type definitions
interface ControlGroupForm {
  id: string;
  name: string;
  description: string;
}

interface ControlForm {
  id: string;
  name: string;
  description: string;
  groupId: string;
  implementationStatus: 'Not Implemented';
}

const CreateFramework = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const categories = useSelector(selectFrameworkCategories);
  const loading = useSelector(selectFrameworkLoading);
  
  const [controlGroups, setControlGroups] = useState<ControlGroupForm[]>([]);
  const [controls, setControls] = useState<ControlForm[]>([]);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showControlDialog, setShowControlDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<ControlGroupForm | null>(null);
  const [currentControl, setCurrentControl] = useState<ControlForm | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    dispatch(setPageTitle('Create Framework'));
    dispatch(fetchFrameworkCategories());
  }, [dispatch]);
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Framework name is required')
      .min(3, 'Framework name must be at least 3 characters')
      .max(100, 'Framework name must be at most 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    version: Yup.string()
      .required('Version is required')
      .matches(/^\d+\.\d+$/, 'Version must be in format X.Y (e.g., 1.0)'),
    category: Yup.string()
      .required('Category is required'),
  });
  
  const groupValidationSchema = Yup.object({
    name: Yup.string()
      .required('Group name is required')
      .min(3, 'Group name must be at least 3 characters')
      .max(100, 'Group name must be at most 100 characters'),
    description: Yup.string()
      .required('Description is required'),
  });
  
  const controlValidationSchema = Yup.object({
    name: Yup.string()
      .required('Control name is required')
      .min(3, 'Control name must be at least 3 characters')
      .max(200, 'Control name must be at most 200 characters'),
    description: Yup.string()
      .required('Description is required'),
    groupId: Yup.string()
      .required('Control group is required'),
  });
  
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      version: '1.0',
      category: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (controlGroups.length === 0) {
        dispatch(addNotification({
          message: 'You must add at least one control group',
          type: 'error'
        }));
        return;
      }
      
      if (controls.length === 0) {
        dispatch(addNotification({
          message: 'You must add at least one control',
          type: 'error'
        }));
        return;
      }
      
      try {
        const result = await dispatch(createFramework({
          ...values,
          controlGroups,
          controls: controls.map(control => ({
            ...control,
            implementationStatus: 'Not Implemented'
          })),
        }));
        
        if (createFramework.fulfilled.match(result)) {
          dispatch(addNotification({
            message: 'Framework created successfully',
            type: 'success'
          }));
          navigate(`/compliance/frameworks/${result.payload.id}`);
        }
      } catch (error) {
        dispatch(addNotification({
          message: 'Failed to create framework',
          type: 'error'
        }));
      }
    },
  });
  
  const groupFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: groupValidationSchema,
    onSubmit: (values) => {
      if (isEditMode && currentGroup) {
        // Update existing group
        setControlGroups(prev => prev.map(group => 
          group.id === currentGroup.id 
            ? { ...group, name: values.name, description: values.description }
            : group
        ));
      } else {
        // Add new group
        const newGroup = {
          id: `group-${uuidv4()}`,
          name: values.name,
          description: values.description,
        };
        setControlGroups([...controlGroups, newGroup]);
      }
      
      // Reset and close dialog
      groupFormik.resetForm();
      setShowGroupDialog(false);
      setIsEditMode(false);
      setCurrentGroup(null);
    },
  });
  
  const controlFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
      groupId: '',
    },
    validationSchema: controlValidationSchema,
    onSubmit: (values) => {
      if (isEditMode && currentControl) {
        // Update existing control
        setControls(prev => prev.map(control => 
          control.id === currentControl.id 
            ? { 
                ...control, 
                name: values.name, 
                description: values.description,
                groupId: values.groupId
              }
            : control
        ));
      } else {
        // Add new control
        const newControl = {
          id: `control-${uuidv4()}`,
          name: values.name,
          description: values.description,
          groupId: values.groupId,
          implementationStatus: 'Not Implemented' as const,
        };
        setControls([...controls, newControl]);
      }
      
      // Reset and close dialog
      controlFormik.resetForm();
      setShowControlDialog(false);
      setIsEditMode(false);
      setCurrentControl(null);
    },
  });
  
  const handleCancel = () => {
    navigate('/compliance/frameworks');
  };
  
  const handleAddGroup = () => {
    groupFormik.resetForm();
    setIsEditMode(false);
    setCurrentGroup(null);
    setShowGroupDialog(true);
  };
  
  const handleEditGroup = (group: ControlGroupForm) => {
    setIsEditMode(true);
    setCurrentGroup(group);
    groupFormik.setValues({
      name: group.name,
      description: group.description,
    });
    setShowGroupDialog(true);
  };
  
  const handleDeleteGroup = (groupId: string) => {
    setControlGroups(controlGroups.filter(group => group.id !== groupId));
    
    // Remove any controls that belong to this group
    setControls(controls.filter(control => control.groupId !== groupId));
  };
  
  const handleAddControl = () => {
    controlFormik.resetForm();
    setIsEditMode(false);
    setCurrentControl(null);
    
    // Set default group if available
    if (controlGroups.length > 0) {
      controlFormik.setFieldValue('groupId', controlGroups[0].id);
    }
    
    setShowControlDialog(true);
  };
  
  const handleEditControl = (control: ControlForm) => {
    setIsEditMode(true);
    setCurrentControl(control);
    controlFormik.setValues({
      name: control.name,
      description: control.description,
      groupId: control.groupId,
    });
    setShowControlDialog(true);
  };
  
  const handleDeleteControl = (controlId: string) => {
    setControls(controls.filter(control => control.id !== controlId));
  };
  
  return (
    <MainLayout title="Create Framework">
      <PageHeader
        title="Create Compliance Framework"
        subtitle="Define a new compliance framework with controls"
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
          { label: 'Frameworks', link: '/compliance/frameworks' },
          { label: 'Create Framework' }
        ]}
      />
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Details Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Framework Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Framework Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      id="version"
                      name="version"
                      label="Version"
                      value={formik.values.version}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.version && Boolean(formik.errors.version)}
                      helperText={formik.touched.version && formik.errors.version}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.category && formik.errors.category && (
                        <Typography variant="caption" color="error">
                          {formik.errors.category}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      multiline
                      rows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Control Groups Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Control Groups
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddGroup}
                  >
                    Add Group
                  </Button>
                </Box>
                
                {controlGroups.length === 0 ? (
                  <Typography color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    No control groups defined. Click "Add Group" to create one.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {controlGroups.map((group) => (
                          <TableRow key={group.id}>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                {group.description}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleEditGroup(group)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Controls Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Controls
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddControl}
                    disabled={controlGroups.length === 0}
                  >
                    Add Control
                  </Button>
                </Box>
                
                {controls.length === 0 ? (
                  <Typography color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                    {controlGroups.length === 0 
                      ? 'Add control groups before adding controls.'
                      : 'No controls defined. Click "Add Control" to create one.'}
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Group</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {controls.map((control) => {
                          const group = controlGroups.find(g => g.id === control.groupId);
                          return (
                            <TableRow key={control.id}>
                              <TableCell>{control.id.split('-')[1].slice(0, 8)}</TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                  {control.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {group ? group.name : 'Unknown Group'}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditControl(control)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteControl(control.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
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
                Create Framework
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      {/* Control Group Dialog */}
      <Dialog
        open={showGroupDialog}
        onClose={() => setShowGroupDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Control Group' : 'Add Control Group'}
        </DialogTitle>
        <form onSubmit={groupFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Group Name"
                  value={groupFormik.values.name}
                  onChange={groupFormik.handleChange}
                  onBlur={groupFormik.handleBlur}
                  error={groupFormik.touched.name && Boolean(groupFormik.errors.name)}
                  helperText={groupFormik.touched.name && groupFormik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={groupFormik.values.description}
                  onChange={groupFormik.handleChange}
                  onBlur={groupFormik.handleBlur}
                  error={groupFormik.touched.description && Boolean(groupFormik.errors.description)}
                  helperText={groupFormik.touched.description && groupFormik.errors.description}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGroupDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Control Dialog */}
      <Dialog
        open={showControlDialog}
        onClose={() => setShowControlDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Control' : 'Add Control'}
        </DialogTitle>
        <form onSubmit={controlFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Control Name"
                  value={controlFormik.values.name}
                  onChange={controlFormik.handleChange}
                  onBlur={controlFormik.handleBlur}
                  error={controlFormik.touched.name && Boolean(controlFormik.errors.name)}
                  helperText={controlFormik.touched.name && controlFormik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={controlFormik.touched.groupId && Boolean(controlFormik.errors.groupId)}>
                  <InputLabel id="groupId-label">Control Group</InputLabel>
                  <Select
                    labelId="groupId-label"
                    id="groupId"
                    name="groupId"
                    value={controlFormik.values.groupId}
                    onChange={controlFormik.handleChange}
                    onBlur={controlFormik.handleBlur}
                    label="Control Group"
                  >
                    {controlGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {controlFormik.touched.groupId && controlFormik.errors.groupId && (
                    <Typography variant="caption" color="error">
                      {controlFormik.errors.groupId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={controlFormik.values.description}
                  onChange={controlFormik.handleChange}
                  onBlur={controlFormik.handleBlur}
                  error={controlFormik.touched.description && Boolean(controlFormik.errors.description)}
                  helperText={controlFormik.touched.description && controlFormik.errors.description}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowControlDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
};

export default CreateFramework;
