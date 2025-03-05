/**
 * Policy Routes
 * Current date: 2025-03-05 13:29:56
 * Current user: alschell
 */

import express from 'express';
import {
  getPolicies,
  getPolicyCategories,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy
} from '../controllers/policyController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All these routes are protected and require authentication
router.get('/', protect, getPolicies);
router.get('/categories', protect, getPolicyCategories);
router.get('/:id', protect, getPolicyById);

// These routes require higher privileges
router.post('/', protect, authorize('admin', 'compliance_manager'), createPolicy);
router.put('/:id', protect, authorize('admin', 'compliance_manager'), updatePolicy);
router.delete('/:id', protect, authorize('admin'), deletePolicy);

export default router;
