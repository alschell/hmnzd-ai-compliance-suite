/**
 * Vendor Management Routes
 * Current date: 2025-03-05 13:29:56
 * Current user: alschell
 */

import express from 'express';
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorCategories,
  getVendorAssessments,
  getVendorAssessmentById,
  createVendorAssessment,
  updateVendorAssessment,
  deleteVendorAssessment,
  getVendorIssues,
  getVendorIssueById,
  createVendorIssue,
  updateVendorIssue,
  deleteVendorIssue,
  getVendorAssessmentsByVendorId,
  getVendorIssuesByVendorId
} from '../controllers/vendorController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Vendor routes
router.get('/', protect, getVendors);
router.get('/categories', protect, getVendorCategories);
router.get('/:id', protect, getVendorById);
router.post('/', protect, authorize('admin', 'compliance_manager'), createVendor);
router.put('/:id', protect, authorize('admin', 'compliance_manager'), updateVendor);
router.delete('/:id', protect, authorize('admin'), deleteVendor);

// Vendor assessments routes
router.get('/:id/assessments', protect, getVendorAssessmentsByVendorId);
router.get('/:id/issues', protect, getVendorIssuesByVendorId);

// Vendor assessment routes
router.get('/assessments', protect, getVendorAssessments);
router.get('/assessments/:id', protect, getVendorAssessmentById);
router.post('/assessments', protect, authorize('admin', 'compliance_manager', 'security_analyst'), createVendorAssessment);
router.put('/assessments/:id', protect, authorize('admin', 'compliance_manager', 'security_analyst'), updateVendorAssessment);
router.delete('/assessments/:id', protect, authorize('admin'), deleteVendorAssessment);

// Vendor issue routes
router.get('/issues', protect, getVendorIssues);
router.get('/issues/:id', protect, getVendorIssueById);
router.post('/issues', protect, authorize('admin', 'compliance_manager', 'security_analyst'), createVendorIssue);
router.put('/issues/:id', protect, authorize('admin', 'compliance_manager', 'security_analyst'), updateVendorIssue);
router.delete('/issues/:id', protect, authorize('admin'), deleteVendorIssue);

export default router;
