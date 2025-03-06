/**
 * Create Incident Page
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBack, Save } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays } from 'date-fns';

import { AppDispatch, RootState } from '../../store';
import {
  createIncident,
  fetchIncidentCategories,
  selectIncidentCategories,
  selectIncidentLoading,
} from '../../store/slices/incidentSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';

const CreateIncident = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const categories = useSelector(selectIncidentCategories);
  const loading = useSelector(selectIncidentLoading);
  
  const [systems, setSystems] = useState<string[]>([]);
  
  // Mock systems for demo
  const availableSystems = [
    'Web Application', 'Database', 'API Services', 'Payment Gateway',
    'Authentication Service', 'Email Service', 'File Storage', 'Backup System',
    'Customer Portal', 'Admin Dashboard', 'Mobile App', 'Network Infrastructure'
  ];
  
  useEffect(() => {
    dispatch(setPageTitle('Create Incident'));
    dispatch(fetchIncidentCategories());
  }, [dispatch]);
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be at most 200 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    severity: Yup.string()
      .required('Severity is required')
      .oneOf(['Critical', 'High', 'Medium', 'Low']),
    category: Yup.string()
      .required('Category is required'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Open', 'Investigating']),
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      severity: '',
      category: '',
      status: 'Open',
      impact: '',
      sla: format(addDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm'),
      affectedSystems: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(createIncident(values));
        if (createIncident.fulfilled.match(result)) {
          navigate(`/incidents/${result.payload.id}`);
        }
      } catch (error) {
        console.error('Failed to create incident:', error);
      }
    },
  });
  
  const handleCancel = () => {
    navigate('/incidents');
  };
  
  const handleSystemsChange = (_event: any, newSystems: string[]) => {
    setSystems(newSystems);
    formik.setFieldValue('affectedSystems', newSystems);
  };
  
  return (
    <MainLayout title="Create Incident">
      <PageHeader
        title="Create Incident"
        subtitle="Report a new security or compliance incident"
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
          { label: 'Incidents', link: '/incidents' },
          { label: 'Create Incident' }
        ]}
      />
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Details Card */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Incident Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Incident Title"
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
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="impact"
                      name="impact"
                      label="Business Impact"
                      multiline
                      rows={3}
                      value={formik.values.impact}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.impact && Boolean(formik.errors.impact)}
                      helperText={formik.touched.impact && formik.errors.impact}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Classification Card */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Incident Classification
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={formik.touched.severity && Boolean(formik.errors.severity)}>
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
                        <MenuItem value="Critical">Critical</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                      {formik.touched.severity && formik.errors.severity && (
                        <FormHelperText>{formik.errors.severity}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
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
                        <FormHelperText>{formik.errors.category}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                      <InputLabel id="status-label">Initial Status</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Initial Status"
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Investigating">Investigating</MenuItem>
                      </Select>
                      {formik.touched.status && formik.errors.status && (
                        <FormHelperText>{formik.errors.status}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="affectedSystems"
                      options={availableSystems}
                      value={systems}
                      onChange={handleSystemsChange}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Affected Systems"
                          placeholder="Select systems"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="sla"
                      name="sla"
                      label="SLA Target"
                      type="datetime-local"
                      value={formik.values.sla}
                      onChange={formik.handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
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
                Create Incident
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </MainLayout>
  );
};

export default CreateIncident;
