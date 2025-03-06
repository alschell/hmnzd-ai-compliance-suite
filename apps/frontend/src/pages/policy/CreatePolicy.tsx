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
  Input,
  InputAdornment,
  FormLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBack, Save, AttachFile, Clear } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addMonths } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';

import { AppDispatch } from '../../store';
import {
  createPolicy,
  fetchPolicyTypesAndCategories,
  selectPolicyLoading,
  selectPolicyTypes,
  selectPolicyCategories,
} from '../../store/slices/policySlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';

// Mock frameworks data
const availableFrameworks = [
  'ISO 27001',
  'SOC 2',
  'GDPR',
  'HIPAA',
  'PCI DSS',
  'NIST CSF',
  'NIST 800-53',
  'CIS Controls'
];

const CreatePolicy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const policyTypes = useSelector(selectPolicyTypes);
  const policyCategories = useSelector(selectPolicyCategories);
  const loading = useSelector(selectPolicyLoading);
  
  const [previewMode, setPreviewMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  
  useEffect(() => {
    dispatch(setPageTitle('Create Policy'));
    dispatch(fetchPolicyTypesAndCategories());
  }, [dispatch]);
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be at most 200 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    type: Yup.string()
      .required('Policy type is required'),
    category: Yup.string()
      .required('Category is required'),
    version: Yup.string()
      .required('Version is required')
      .matches(/^\d+\.\d+$/, 'Version must be in format X.Y (e.g., 1.0)'),
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      type: '',
      category: '',
      version: '1.0',
      content: '',
      effectiveDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
      reviewDate: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
      status: 'Draft',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Create FormData object to handle file upload
        const formData = new FormData();
        
        // Add all form values
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        // Add tags and frameworks as JSON strings
        formData.append('tags', JSON.stringify(tags));
        formData.append('frameworks', JSON.stringify(frameworks));
        
        // Add file if selected
        if (file) {
          formData.append('policyFile', file);
        }
        
        const result = await dispatch(createPolicy(formData));
        if (createPolicy.fulfilled.match(result)) {
          dispatch(addNotification({
            message: 'Policy created successfully',
            type: 'success'
          }));
          navigate(`/policies/${result.payload.id}`);
        }
      } catch (error) {
        dispatch(addNotification({
          message: 'Failed to create policy',
          type: 'error'
        }));
      }
    },
  });
  
  const handleCancel = () => {
    navigate('/policies');
  };
  
  const handleTagsChange = (_event: any, newTags: string[]) => {
    setTags(newTags);
  };
  
  const handleFrameworksChange = (_event: any, newFrameworks: string[]) => {
    setFrameworks(newFrameworks);
  };
  
  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };
  
  // File dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });
  
  const handleRemoveFile = () => {
    setFile(null);
  };
  
  return (
    <MainLayout title="Create Policy">
      <PageHeader
        title="Create Policy"
        subtitle="Create a new organizational policy document"
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
          { label: 'Policies', link: '/policies' },
          { label: 'Create Policy' }
        ]}
      />
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Details Card */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Policy Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Policy Title"
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
                      rows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      fullWidth
                      error={formik.touched.type && Boolean(formik.errors.type)}
                    >
                      <InputLabel id="type-label">Policy Type</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Policy Type"
                      >
                        {policyTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.type && formik.errors.type && (
                        <FormHelperText>{formik.errors.type}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={formik.touched.category && Boolean(formik.errors.category)}
                    >
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
                        {policyCategories.map((category) => (
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        label="Status"
                        disabled
                      >
                        <MenuItem value="Draft">Draft</MenuItem>
                      </Select>
                      <FormHelperText>
                        New policies are created as drafts
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="effectiveDate"
                      name="effectiveDate"
                      label="Effective Date"
                      type="date"
                      value={formik.values.effectiveDate}
                      onChange={formik.handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="reviewDate"
                      name="reviewDate"
                      label="Review Date"
                      type="date"
                      value={formik.values.reviewDate}
                      onChange={formik.handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      freeSolo
                      id="tags"
                      options={[]}
                      value={tags}
                      onChange={handleTagsChange}
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
                          label="Tags"
                          placeholder="Add tags"
                          helperText="Press Enter to add a tag"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="frameworks"
                      options={availableFrameworks}
                      value={frameworks}
                      onChange={handleFrameworksChange}
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
                          label="Related Frameworks"
                          placeholder="Select frameworks"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Document Upload Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Document Upload
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Upload Policy Document (Optional)
                  </FormLabel>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      mb: 2,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <AttachFile color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>
                      Drag & drop a file here, or click to select
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Supported formats: PDF, DOC, DOCX, ODT, TXT
                    </Typography>
                  </Box>
                  
                  {file && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachFile sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={handleRemoveFile}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
                  - OR -
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Write Policy Content (Markdown supported)
                  </FormLabel>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Button 
                      size="small" 
                      color={!previewMode ? 'primary' : 'inherit'}
                      onClick={() => setPreviewMode(false)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small"
                      color={previewMode ? 'primary' : 'inherit'}
                      onClick={() => setPreviewMode(true)}
                    >
                      Preview
                    </Button>
                  </Box>
                  
                  {previewMode ? (
                    <Box 
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        p: 2,
                        minHeight: 300,
                        maxHeight: 500,
                        overflow: 'auto',
                      }}
                    >
                      {formik.values.content ? (
                        <ReactMarkdown>{formik.values.content}</ReactMarkdown>
                      ) : (
                        <Typography color="textSecondary" align="center" sx={{ mt: 10 }}>
                          No content to preview
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      id="content"
                      name="content"
                      multiline
                      rows={12}
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      placeholder="Write policy content using Markdown..."
                      variant="outlined"
                    />
                  )}
                  
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    You can use Markdown formatting for headings, lists, links, etc.
                  </Typography>
                </Box>
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
                Create Policy
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </MainLayout>
  );
};

export default CreatePolicy;
