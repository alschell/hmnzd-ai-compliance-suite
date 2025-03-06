/**
 * Policy Detail Page
 * Current date: 2025-03-06 03:07:03
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
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowBack,
  Edit,
  Delete,
  CloudUpload,
  GetApp as Download,
  Visibility,
  ThumbUp,
  Announcement,
  Send,
  History,
  AttachFile,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

import { AppDispatch } from '../../store';
import {
  fetchPolicyById,
  deletePolicy,
  publishPolicy,
  approvePolicy,
  submitPolicyForReview,
  clearPolicyDetail,
  selectPolicyDetail,
  selectPolicyLoading,
  selectPolicyError,
} from '../../store/slices/policySlice';
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
      id={`policy-tabpanel-${index}`}
      aria-labelledby={`policy-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && children}
    </div>
  );
}

const PolicyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const policy = useSelector(selectPolicyDetail);
  const loading = useSelector(selectPolicyLoading);
  const error = useSelector(selectPolicyError);

  const [tabValue, setTabValue] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [approveComments, setApproveComments] = useState('');
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPolicyById(id));
    }

    return () => {
      dispatch(clearPolicyDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (policy) {
      dispatch(setPageTitle(`Policy: ${policy.id}`));
      if (policy.effectiveDate) {
        setEffectiveDate(format(new Date(policy.effectiveDate), 'yyyy-MM-dd'));
      } else {
        // Default to 30 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setEffectiveDate(format(defaultDate, 'yyyy-MM-dd'));
      }
    }
  }, [dispatch, policy]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/policies');
  };

  const handleEdit = () => {
    if (policy) {
      navigate(`/policies/edit/${policy.id}`);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (id) {
      await dispatch(deletePolicy(id));
      dispatch(addNotification({
        message: 'Policy deleted successfully',
        type: 'success'
      }));
      navigate('/policies');
    }
  };

  const handleDownload = () => {
    if (policy?.fileUrl) {
      window.open(policy.fileUrl, '_blank');
    } else {
      dispatch(addNotification({
        message: 'No document available for download',
        type: 'warning'
      }));
    }
  };

  const handleSubmitForReview = () => {
    setShowReviewDialog(true);
  };

  const confirmSubmitReview = async () => {
    if (id) {
      setSubmitReviewLoading(true);
      try {
        await dispatch(submitPolicyForReview({ id, reviewers }));
        dispatch(addNotification({
          message: 'Policy submitted for review',
          type: 'success'
        }));
        setShowReviewDialog(false);
      } catch (error) {
        console.error('Failed to submit for review:', error);
      } finally {
        setSubmitReviewLoading(false);
      }
    }
  };

  const handleApprove = () => {
    setShowApproveDialog(true);
  };

  const confirmApprove = async () => {
    if (id) {
      setApproveLoading(true);
      try {
        await dispatch(approvePolicy({ id, comments: approveComments }));
        dispatch(addNotification({
          message: 'Policy approved successfully',
          type: 'success'
        }));
        setShowApproveDialog(false);
      } catch (error) {
        console.error('Failed to approve policy:', error);
      } finally {
        setApproveLoading(false);
      }
    }
  };

  const handlePublish = () => {
    setShowPublishDialog(true);
  };

  const confirmPublish = async () => {
    if (id) {
      setPublishLoading(true);
      try {
        await dispatch(publishPolicy({ id, effectiveDate }));
        dispatch(addNotification({
          message: 'Policy published successfully',
          type: 'success'
        }));
        setShowPublishDialog(false);
      } catch (error) {
        console.error('Failed to publish policy:', error);
      } finally {
        setPublishLoading(false);
      }
    }
  };

  const canEdit = policy && ['Draft', 'In Review'].includes(policy.status);
  const canSubmitForReview = policy && policy.status === 'Draft';
  const canApprove = policy && policy.status === 'In Review';
  const canPublish = policy && policy.status === 'Approved';
  
  if (loading && !policy) {
    return (
      <MainLayout title="Policy Details">
        <LoadingSpinner message="Loading policy details..." />
      </MainLayout>
    );
  }

  if (error || !policy) {
    return (
      <MainLayout title="Policy Details">
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            {error || 'Policy not found'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Policies
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Format dates
  const createdAt = format(new Date(policy.createdAt), 'MMM dd, yyyy');
  const updatedAt = format(new Date(policy.updatedAt), 'MMM dd, yyyy');
  const effectiveDateFormatted = policy.effectiveDate
    ? format(new Date(policy.effectiveDate), 'MMM dd, yyyy')
    : 'Not set';
  const reviewDateFormatted = policy.reviewDate
    ? format(new Date(policy.reviewDate), 'MMM dd, yyyy')
    : 'Not set';

  return (
    <MainLayout title={`Policy: ${policy.id}`}>
      <PageHeader
        title={policy.title}
        subtitle={`Policy ID: ${policy.id}`}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {canEdit && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
            
            {canSubmitForReview && (
              <Button
                variant="outlined"
                color="info"
                startIcon={<Send />}
                onClick={handleSubmitForReview}
              >
                Submit for Review
              </Button>
            )}
            
            {canApprove && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<ThumbUp />}
                onClick={handleApprove}
              >
                Approve
              </Button>
            )}
            
            {canPublish && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Announcement />}
                onClick={handlePublish}
              >
                Publish
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
            
            {policy.fileUrl && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={handleDownload}
              >
                Download
              </Button>
            )}
          </Box>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Policies', link: '/policies' },
          { label: policy.id }
        ]}
      />

      <Grid container spacing={3}>
        {/* Summary Column */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {/* Status and Version */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip status={policy.status} />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Version
                </Typography>
                <Typography variant="body1">{policy.version}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Type and Category */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Policy Type
                </Typography>
                <Typography variant="body1">{policy.type}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">{policy.category}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Important Dates */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Effective Date
                </Typography>
                <Typography variant="body1">{effectiveDateFormatted}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Next Review
                </Typography>
                <Typography variant="body1">{reviewDateFormatted}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Tags */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tags
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {policy.tags && policy.tags.length > 0
                    ? policy.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))
                    : <Typography variant="body2" color="textSecondary">No tags</Typography>
                  }
                </Box>
              </Box>

              {/* Related Frameworks */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Related Frameworks
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {policy.frameworks && policy.frameworks.length > 0
                    ? policy.frameworks.map((framework) => (
                        <Chip key={framework} label={framework} size="small" color="primary" variant="outlined" />
                      ))
                    : <Typography variant="body2" color="textSecondary">No related frameworks</Typography>
                  }
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Owner and Creation Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Owner
                </Typography>
                <Typography variant="body2">
                  {policy.owner
                    ? `${policy.owner.firstName} ${policy.owner.lastName}`
                    : 'Unassigned'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created By
                </Typography>
                <Typography variant="body2">
                  {`${policy.createdBy.firstName} ${policy.createdBy.lastName} on ${createdAt}`}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">{updatedAt}</Typography>
              </Box>

              {policy.approvedBy && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Approved By
                  </Typography>
                  <Typography variant="body2">
                    {`${policy.approvedBy.firstName} ${policy.approvedBy.lastName}`}
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
                aria-label="policy details tabs"
              >
                <Tab label="Overview" />
                <Tab label="Full Content" />
                <Tab label="Version History" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {policy.description || 'No description provided.'}
                </Typography>

                {policy.fileUrl && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Attached Document
                    </Typography>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachFile color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body1">
                            {policy.id}-{policy.version}.{policy.fileType?.split('/')[1]}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {policy.fileSize && `${(policy.fileSize / 1024 / 1024).toFixed(2)} MB`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Tooltip title="Preview document">
                          <IconButton onClick={() => window.open(policy.fileUrl, '_blank')}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download document">
                          <IconButton onClick={handleDownload}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Full Content Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                {policy.content ? (
                  <Box sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& img': {
                      maxWidth: '100%'
                    }
                  }}>
                    <ReactMarkdown>{policy.content}</ReactMarkdown>
                  </Box>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No content available. Please download the attached document to view full policy content.
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Version History Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" color="textSecondary">
                  Version history functionality will be implemented in the future release.
                </Typography>
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
            Are you sure you want to delete policy {policy.id}? This action cannot be undone.
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

      {/* Submit for Review Dialog */}
      <Dialog
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        aria-labelledby="review-dialog-title"
      >
        <DialogTitle id="review-dialog-title">
          Submit for Review
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Submit this policy for review. You can optionally specify reviewers.
          </DialogContentText>
          <TextField
            fullWidth
            label="Reviewers (comma-separated emails)"
            variant="outlined"
            value={reviewers.join(', ')}
            onChange={(e) => setReviewers(e.target.value.split(',').map(r => r.trim()))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowReviewDialog(false)} 
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton 
            onClick={confirmSubmitReview} 
            color="primary" 
            variant="contained"
            loading={submitReviewLoading}
            autoFocus
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog
        open={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        aria-labelledby="approve-dialog-title"
      >
        <DialogTitle id="approve-dialog-title">
          Approve Policy
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to approve this policy? You can provide optional comments.
          </DialogContentText>
          <TextField
            fullWidth
            label="Approval Comments"
            variant="outlined"
            value={approveComments}
            onChange={(e) => setApproveComments(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowApproveDialog(false)} 
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton 
            onClick={confirmApprove} 
            color="success" 
            variant="contained"
            loading={approveLoading}
            autoFocus
          >
            Approve
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog
        open={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        aria-labelledby="publish-dialog-title"
      >
        <DialogTitle id="publish-dialog-title">
          Publish Policy
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please confirm the effective date for this policy.
          </DialogContentText>
          <TextField
            fullWidth
            label="Effective Date"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowPublishDialog(false)} 
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton 
            onClick={confirmPublish} 
            color="primary" 
            variant="contained"
            loading={publishLoading}
            autoFocus
          >
            Publish
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default PolicyDetail;
