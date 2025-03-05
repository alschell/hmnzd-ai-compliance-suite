/**
 * Incident Management Routes
 * Current date: 2025-03-05 13:29:56
 * Current user: alschell
 */

import express from 'express';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentUpdates,
  createIncidentUpdate,
  getIncidentStats,
  getIncidentCategories,
  exportIncidentReport
} from '../controllers/incidentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Incident routes
router.get('/', protect, getIncidents);
router.get('/stats', protect, getIncidentStats);
router.get('/categories', protect, getIncidentCategories);
router.get('/:id', protect, getIncidentById);
router.post('/', protect, createIncident); // Allow all authenticated users to report incidents
router.put('/:id', protect, authorize('admin', 'compliance_manager', 'security_analyst'), updateIncident);
router.delete('/:id', protect, authorize('admin'), deleteIncident);

// Incident update routes
router.get('/:id/updates', protect, getIncidentUpdates);
router.post('/:id/updates', protect, authorize('admin', 'compliance_manager', 'security_analyst'), createIncidentUpdate);

// Export incident report
router.get('/:id/export', protect, authorize('admin', 'compliance_manager', 'security_analyst', 'auditor'), exportIncidentReport);

export default router;
