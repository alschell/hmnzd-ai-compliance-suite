import { Request, Response } from 'express';
import Policy from '../models/policyModel';
import { logger } from '../utils/logger';

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private
const getPolicies = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.type) {
      filterOptions.type = req.query.type;
    }
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Policy.countDocuments(filterOptions);
    
    const policies = await Policy.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate('updatedBy', 'username firstName lastName');
    
    res.json({
      policies,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching policies:', error);
    res.status(500).json({
      message: 'Failed to fetch policies',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get policy categories
// @route   GET /api/policies/categories
// @access  Private
const getPolicyCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Policy.distinct('category');
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching policy categories:', error);
    res.status(500).json({
      message: 'Failed to fetch policy categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get policy by ID
// @route   GET /api/policies/:id
// @access  Private
const getPolicyById = async (req: Request, res: Response) => {
  try {
    const policy = await Policy.findOne({ id: req.params.id })
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate('updatedBy', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName');
    
    if (!policy) {
      res.status(404).json({ message: 'Policy not found' });
      return;
    }
    
    res.json(policy);
  } catch (error) {
    logger.error(`Error fetching policy ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create policy
// @route   POST /api/policies
// @access  Private
const createPolicy = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      title,
      description,
      type,
      category,
      version,
      content,
      status,
      owner,
      tags,
      frameworks,
      relatedControls,
      effectiveDate,
      reviewDate,
      fileUrl,
      fileType,
      fileSize
    } = req.body;
    
    const userId = req.user.id;
    
    const policy = new Policy({
      title,
      description,
      type,
      category,
      version,
      content,
      status,
      owner: owner || userId,
      tags,
      frameworks,
      relatedControls,
      effectiveDate,
      reviewDate,
      fileUrl,
      fileType,
      fileSize,
      createdBy: userId,
      updatedBy: userId
    });
    
    const createdPolicy = await policy.save();
    
    res.status(201).json(createdPolicy);
  } catch (error) {
    logger.error('Error creating policy:', error);
    res.status(500).json({
      message: 'Failed to create policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update policy
// @route   PUT /api/policies/:id
// @access  Private
const updatePolicy = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const policy = await Policy.findOne({ id: req.params.id });
    
    if (!policy) {
      res.status(404).json({ message: 'Policy not found' });
      return;
    }
    
    const userId = req.user.id;
    
    // Update fields
    policy.title = req.body.title || policy.title;
    policy.description = req.body.description || policy.description;
    policy.type = req.body.type || policy.type;
    policy.category = req.body.category || policy.category;
    policy.content = req.body.content || policy.content;
    policy.status = req.body.status || policy.status;
    policy.owner = req.body.owner || policy.owner;
    
    if (req.body.version) {
      // Add current version to revisions
      if (!policy.revisions) {
        policy.revisions = [];
      }
      
      policy.revisions.push({
        version: policy.version,
        date: new Date(),
        changedBy: userId,
        changes: req.body.changes || 'Updated policy'
      });
      
      policy.version = req.body.version;
    }
    
    if (req.body.tags) policy.tags = req.body.tags;
    if (req.body.frameworks) policy.frameworks = req.body.frameworks;
    if (req.body.relatedControls) policy.relatedControls = req.body.relatedControls;
    if (req.body.effectiveDate) policy.effectiveDate = new Date(req.body.effectiveDate);
    if (req.body.reviewDate) policy.reviewDate = new Date(req.body.reviewDate);
    
    if (req.body.status === 'Approved' && policy.status !== 'Approved') {
      policy.approvalDate = new Date();
      policy.approvedBy = userId;
    }
    
    // Always update the updatedBy and updatedAt
    policy.updatedBy = userId;
    
    const updatedPolicy = await policy.save();
    
    res.json(updatedPolicy);
  } catch (error) {
    logger.error(`Error updating policy ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deletePolicy = async (req: Request, res: Response) => {
  try {
    const policy = await Policy.findOne({ id: req.params.id });
    
    if (!policy) {
      res.status(404).json({ message: 'Policy not found' });
      return;
    }
    
    await Policy.deleteOne({ id: req.params.id });
    
    res.json({ message: 'Policy removed' });
  } catch (error) {
    logger.error(`Error deleting policy ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  getPolicies,
  getPolicyCategories,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy
};
