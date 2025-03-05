/**
 * Compliance Routes
 * Current date: 2025-03-05 13:29:56
 * Current user: alschell
 */

import express from 'express';
import {
  getFrameworks,
  getFrameworkById,
  createFramework,
  updateFramework,
  deleteFramework,
  getControls,
  getControlById,
  createControl,
  updateControl,
  deleteControl,
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getFindings,
  getFindingById,
  createFinding,
  updateFinding,
  deleteFinding,
  getEvidence,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence
} from '../controllers/complianceController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Framework routes
router.get('/frameworks', protect, getFrameworks);
router.get('/frameworks/:id', protect, getFrameworkById);
router.post('/frameworks', protect, authorize('admin', 'compliance_manager'), createFramework);
router.put('/frameworks/:id', protect, authorize('admin', 'compliance_manager'), updateFramework);
router.delete('/frameworks/:id', protect, authorize('admin'), deleteFramework);

// Control routes
router.get('/controls', protect, getControls);
router.get('/controls/:id', protect, getControlById);
router.post('/controls', protect, authorize('admin', 'compliance_manager'), createControl);
router.put('/controls/:id', protect, authorize('admin', 'compliance_manager'), updateControl);
router.delete('/controls/:id', protect, authorize('admin'), deleteControl);

// Assessment routes
router.get('/assessments', protect, getAssessments);
router.get('/assessments/:id', protect, getAssessmentById);
router.post('/assessments', protect, authorize('admin', 'compliance_manager', 'auditor'), createAssessment);
router.put('/assessments/:id', protect, authorize('admin', 'compliance_manager', 'auditor'), updateAssessment);
router.delete('/assessments/:id', protect, authorize('admin'), deleteAssessment);

// Finding routes
router.get('/findings', protect, getFindings);
router.get('/findings/:id', protect, getFindingById);
router.post('/findings', protect, authorize('admin', 'compliance_manager', 'auditor'), createFinding);
router.put('/findings/:id', protect, authorize('admin', 'compliance_manager', 'auditor'), updateFinding);
router.delete('/findings/:id', protect, authorize('admin'), deleteFinding);

// Evidence routes
router.get('/evidence', protect, getEvidence);
router.get('/evidence/:id', protect, getEvidenceById);
router.post('/evidence', protect, authorize('admin', 'compliance_manager', 'auditor', 'user'), createEvidence);
router.put('/evidence/:id', protect, authorize('admin', 'compliance_manager', 'auditor'), updateEvidence);
router.delete('/evidence/:id', protect, authorize('admin'), deleteEvidence);

export default router;
