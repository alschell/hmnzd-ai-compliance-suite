/**
 * Vendor Management Controller
 * Current date: 2025-03-05 13:37:47
 * Current user: alschell
 */

import { Request, Response } from 'express';
import { Vendor, VendorAssessment, VendorIssue } from '../models/vendorModel';
import { logger } from '../utils/logger';

// ======== Vendor Controllers ========

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private
const getVendors = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.riskLevel) {
      filterOptions.riskLevel = req.query.riskLevel;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Vendor.countDocuments(filterOptions);
    
    const vendors = await Vendor.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('createdBy', 'username firstName lastName')
      .populate('updatedBy', 'username firstName lastName');
    
    res.json({
      vendors,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching vendors:', error);
    res.status(500).json({
      message: 'Failed to fetch vendors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findOne({ id: req.params.id })
      .populate('createdBy', 'username firstName lastName')
      .populate('updatedBy', 'username firstName lastName');
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    res.json(vendor);
  } catch (error) {
    logger.error(`Error fetching vendor ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch vendor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor categories
// @route   GET /api/vendors/categories
// @access  Private
const getVendorCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Vendor.distinct('category');
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching vendor categories:', error);
    res.status(500).json({
      message: 'Failed to fetch vendor categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private/Admin/ComplianceManager
const createVendor = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      name,
      description,
      category,
      riskLevel,
      riskScores,
      dataAccessed,
      contract,
      contactInfo,
      status,
      lastAssessmentDate,
      nextAssessment
    } = req.body;
    
    const userId = req.user.id;
    
    // Check if vendor ID already exists
    if (id && await Vendor.findOne({ id })) {
      res.status(400).json({ message: `Vendor with ID ${id} already exists` });
      return;
    }
    
    const vendor = new Vendor({
      id,
      name,
      description,
      category,
      riskLevel,
      riskScores,
      dataAccessed,
      lastAssessmentDate: lastAssessmentDate ? new Date(lastAssessmentDate) : undefined,
      nextAssessment: nextAssessment ? new Date(nextAssessment) : undefined,
      contract: contract ? {
        startDate: contract.startDate ? new Date(contract.startDate) : undefined,
        endDate: contract.endDate ? new Date(contract.endDate) : undefined,
        value: contract.value,
        auto_renewal: contract.auto_renewal || false,
        documentUrl: contract.documentUrl
      } : undefined,
      contactInfo,
      status: status || 'Pending',
      createdBy: userId,
      updatedBy: userId
    });
    
    const createdVendor = await vendor.save();
    
    res.status(201).json(createdVendor);
  } catch (error) {
    logger.error('Error creating vendor:', error);
    res.status(500).json({
      message: 'Failed to create vendor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private/Admin/ComplianceManager
const updateVendor = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const vendor = await Vendor.findOne({ id: req.params.id });
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    const userId = req.user.id;
    
    // Update fields
    if (req.body.name) vendor.name = req.body.name;
    if (req.body.description) vendor.description = req.body.description;
    if (req.body.category) vendor.category = req.body.category;
    if (req.body.riskLevel) vendor.riskLevel = req.body.riskLevel;
    if (req.body.status) vendor.status = req.body.status;
    if (req.body.dataAccessed) vendor.dataAccessed = req.body.dataAccessed;
    
    if (req.body.riskScores) {
      vendor.riskScores = {
        security: req.body.riskScores.security !== undefined ? req.body.riskScores.security : vendor.riskScores?.security,
        privacy: req.body.riskScores.privacy !== undefined ? req.body.riskScores.privacy : vendor.riskScores?.privacy,
        compliance: req.body.riskScores.compliance !== undefined ? req.body.riskScores.compliance : vendor.riskScores?.compliance,
        overall: req.body.riskScores.overall !== undefined ? req.body.riskScores.overall : vendor.riskScores?.overall
      };
    }
    
    if (req.body.lastAssessmentDate) {
      vendor.lastAssessmentDate = new Date(req.body.lastAssessmentDate);
    }
    
    if (req.body.nextAssessment) {
      vendor.nextAssessment = new Date(req.body.nextAssessment);
    }
    
    if (req.body.contract) {
      vendor.contract = {
        startDate: req.body.contract.startDate ? new Date(req.body.contract.startDate) : vendor.contract?.startDate,
        endDate: req.body.contract.endDate ? new Date(req.body.contract.endDate) : vendor.contract?.endDate,
        value: req.body.contract.value !== undefined ? req.body.contract.value : vendor.contract?.value,
        auto_renewal: req.body.contract.auto_renewal !== undefined ? req.body.contract.auto_renewal : vendor.contract?.auto_renewal,
        documentUrl: req.body.contract.documentUrl || vendor.contract?.documentUrl
      };
    }
    
    if (req.body.contactInfo) {
      vendor.contactInfo = {
        name: req.body.contactInfo.name || vendor.contactInfo?.name,
        email: req.body.contactInfo.email || vendor.contactInfo?.email,
        phone: req.body.contactInfo.phone || vendor.contactInfo?.phone,
        role: req.body.contactInfo.role || vendor.contactInfo?.role
      };
    }
    
    vendor.updatedBy = userId;
    
    const updatedVendor = await vendor.save();
    
    res.json(updatedVendor);
  } catch (error) {
    logger.error(`Error updating vendor ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update vendor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
const deleteVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findOne({ id: req.params.id });
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    // Delete associated assessments and issues
    await VendorAssessment.deleteMany({ vendor: vendor._id });
    await VendorIssue.deleteMany({ vendor: vendor._id });
    
    // Delete the vendor
    await Vendor.deleteOne({ _id: vendor._id });
    
    res.json({ message: 'Vendor and associated data removed' });
  } catch (error) {
    logger.error(`Error deleting vendor ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete vendor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Vendor Assessment Controllers ========

// @desc    Get all vendor assessments
// @route   GET /api/vendors/assessments
// @access  Private
const getVendorAssessments = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.vendorId) {
      const vendor = await Vendor.findOne({ id: req.query.vendorId });
      if (vendor) {
        filterOptions.vendor = vendor._id;
      }
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.type) {
      filterOptions.type = req.query.type;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { type: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await VendorAssessment.countDocuments(filterOptions);
    
    const assessments = await VendorAssessment.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('vendor', 'id name category')
      .populate('assessor', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      assessments,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching vendor assessments:', error);
    res.status(500).json({
      message: 'Failed to fetch vendor assessments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor assessments by vendor ID
// @route   GET /api/vendors/:id/assessments
// @access  Private
const getVendorAssessmentsByVendorId = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findOne({ id: req.params.id });
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    const assessments = await VendorAssessment.find({ vendor: vendor._id })
      .sort({ updatedAt: -1 })
      .populate('vendor', 'id name category')
      .populate('assessor', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json(assessments);
  } catch (error) {
    logger.error(`Error fetching assessments for vendor ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch vendor assessments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor assessment by ID
// @route   GET /api/vendors/assessments/:id
// @access  Private
const getVendorAssessmentById = async (req: Request, res: Response) => {
  try {
    const assessment = await VendorAssessment.findOne({ id: req.params.id })
      .populate('vendor', 'id name category riskLevel')
      .populate('assessor', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    if (!assessment) {
      res.status(404).json({ message: 'Vendor assessment not found' });
      return;
    }
    
    // Get issues associated with this assessment
    const issues = await VendorIssue.find({ assessment: assessment._id });
    
    // Return assessment with issues
    res.json({
      ...assessment.toObject(),
      issues
    });
  } catch (error) {
    logger.error(`Error fetching vendor assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch vendor assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create vendor assessment
// @route   POST /api/vendors/assessments
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const createVendorAssessment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      type,
      vendorId,
      status,
      dueDate,
      completionDate,
      nextDueDate,
      assessor,
      scope,
      controlsAssessed,
      method,
      riskLevel,
      progress,
      reportUrl
    } = req.body;
    
    const userId = req.user.id;
    
    // Get vendor by ID
    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) {
      res.status(400).json({ message: `Vendor with ID ${vendorId} not found` });
      return;
    }
    
    // Check if assessment ID already exists
    if (id && await VendorAssessment.findOne({ id })) {
      res.status(400).json({ message: `Assessment with ID ${id} already exists` });
      return;
    }
    
    const assessment = new VendorAssessment({
      id,
      type,
      vendor: vendor._id,
      status: status || 'Pending',
      dueDate: new Date(dueDate),
      completionDate: completionDate ? new Date(completionDate) : undefined,
      nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
      assessor: assessor || userId,
      scope,
      issues: 0,
      highRiskIssues: 0,
      remediatedIssues: 0,
      controlsAssessed,
      method,
      riskLevel,
      progress: progress || 0,
      reportUrl,
      createdBy: userId
    });
    
    const createdAssessment = await assessment.save();
    
    // Update vendor with assessment info
    vendor.lastAssessmentDate = createdAssessment.completionDate;
    vendor.nextAssessment = createdAssessment.nextDueDate;
    
    await vendor.save();
    
    res.status(201).json(createdAssessment);
  } catch (error) {
    logger.error('Error creating vendor assessment:', error);
    res.status(500).json({
      message: 'Failed to create vendor assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update vendor assessment
// @route   PUT /api/vendors/assessments/:id
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const updateVendorAssessment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const assessment = await VendorAssessment.findOne({ id: req.params.id });
    
    if (!assessment) {
      res.status(404).json({ message: 'Vendor assessment not found' });
      return;
    }
    
    // Update fields
    if (req.body.type) assessment.type = req.body.type;
    if (req.body.status) assessment.status = req.body.status;
    if (req.body.dueDate) assessment.dueDate = new Date(req.body.dueDate);
    if (req.body.completionDate) assessment.completionDate = new Date(req.body.completionDate);
    if (req.body.nextDueDate) assessment.nextDueDate = new Date(req.body.nextDueDate);
    if (req.body.assessor) assessment.assessor = req.body.assessor;
    if (req.body.scope) assessment.scope = req.body.scope;
    if (req.body.issues !== undefined) assessment.issues = req.body.issues;
    if (req.body.highRiskIssues !== undefined) assessment.highRiskIssues = req.body.highRiskIssues;
    if (req.body.remediatedIssues !== undefined) assessment.remediatedIssues = req.body.remediatedIssues;
    if (req.body.controlsAssessed) assessment.controlsAssessed = req.body.controlsAssessed;
    if (req.body.method) assessment.method = req.body.method;
    if (req.body.riskLevel) assessment.riskLevel = req.body.riskLevel;
    if (req.body.progress !== undefined) assessment.progress = req.body.progress;
    if (req.body.reportUrl) assessment.reportUrl = req.body.reportUrl;
    
    const updatedAssessment = await assessment.save();
    
    // Update vendor with assessment info
    const vendor = await Vendor.findById(assessment.vendor);
    if (vendor) {
      if (updatedAssessment.status === 'Approved') {
        vendor.lastAssessmentDate = updatedAssessment.completionDate || new Date();
        vendor.nextAssessment = updatedAssessment.nextDueDate;
        
        // Update vendor risk level based on assessment if provided
        if (updatedAssessment.riskLevel) {
          vendor.riskLevel = updatedAssessment.riskLevel;
        }
        
        await vendor.save();
      }
    }
    
    res.json(updatedAssessment);
  } catch (error) {
    logger.error(`Error updating vendor assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update vendor assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete vendor assessment
// @route   DELETE /api/vendors/assessments/:id
// @access  Private/Admin
const deleteVendorAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await VendorAssessment.findOne({ id: req.params.id });
    
    if (!assessment) {
      res.status(404).json({ message: 'Vendor assessment not found' });
      return;
    }
    
    // Delete associated issues
    await VendorIssue.deleteMany({ assessment: assessment._id });
    
    // Delete the assessment
    await VendorAssessment.deleteOne({ _id: assessment._id });
    
    res.json({ message: 'Vendor assessment and associated issues removed' });
  } catch (error) {
    logger.error(`Error deleting vendor assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete vendor assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Vendor Issue Controllers ========

// @desc    Get all vendor issues
// @route   GET /api/vendors/issues
// @access  Private
const getVendorIssues = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.vendorId) {
      const vendor = await Vendor.findOne({ id: req.query.vendorId });
      if (vendor) {
        filterOptions.vendor = vendor._id;
      }
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.severity) {
      filterOptions.severity = req.query.severity;
    }
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
    }
    
    if (req.query.assessmentId) {
      const assessment = await VendorAssessment.findOne({ id: req.query.assessmentId });
      if (assessment) {
        filterOptions.assessment = assessment._id;
      }
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await VendorIssue.countDocuments(filterOptions);
    
    const issues = await VendorIssue.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('vendor', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('assessment', 'id type')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      issues,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching vendor issues:', error);
    res.status(500).json({
      message: 'Failed to fetch vendor issues',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor issues by vendor ID
// @route   GET /api/vendors/:id/issues
// @access  Private
const getVendorIssuesByVendorId = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findOne({ id: req.params.id });
    
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    
    const issues = await VendorIssue.find({ vendor: vendor._id })
      .sort({ updatedAt: -1 })
      .populate('vendor', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('assessment', 'id type')
      .populate('createdBy', 'username firstName lastName');
    
    res.json(issues);
  } catch (error) {
    logger.error(`Error fetching issues for vendor ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch vendor issues',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get vendor issue by ID
// @route   GET /api/vendors/issues/:id
// @access  Private
const getVendorIssueById = async (req: Request, res: Response) => {
  try {
    const issue = await VendorIssue.findOne({ id: req.params.id })
      .populate('vendor', 'id name category')
      .populate('owner', 'username firstName lastName')
      .populate('assessment', 'id type')
      .populate('createdBy', 'username firstName lastName');
    
    if (!issue) {
      res.status(404).json({ message: 'Vendor issue not found' });
      return;
    }
    
    res.json(issue);
  } catch (error) {
    logger.error(`Error fetching vendor issue ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch vendor issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create vendor issue
// @route   POST /api/vendors/issues
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const createVendorIssue = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      title,
      description,
      vendorId,
      severity,
      status,
      identifiedDate,
      dueDate,
      owner,
      category,
      remediationPlan,
      remediationProgress,
      assessmentId
    } = req.body;
    
    const userId = req.user.id;
    
    // Get vendor by ID
    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) {
      res.status(400).json({ message: `Vendor with ID ${vendorId} not found` });
      return;
    }
    
    // Get assessment by ID
    const assessment = await VendorAssessment.findOne({ id: assessmentId });
    if (!assessment) {
      res.status(400).json({ message: `Assessment with ID ${assessmentId} not found` });
      return;
    }
    
    // Check if issue ID already exists
    if (id && await VendorIssue.findOne({ id })) {
      res.status(400).json({ message: `Issue with ID ${id} already exists` });
      return;
    }
    
    const issue = new VendorIssue({
      id,
      title,
      description,
      vendor: vendor._id,
      severity,
      status: status || 'Open',
      identifiedDate: new Date(identifiedDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      owner: owner || userId,
      category,
      remediationPlan,
      remediationProgress: remediationProgress || 0,
      assessment: assessment._id,
      createdBy: userId
    });
    
    const createdIssue = await issue.save();
    
    // Update assessment issue counts
    assessment.issues = (assessment.issues || 0) + 1;
    if (severity === 'Critical' || severity === 'High') {
      assessment.highRiskIssues = (assessment.highRiskIssues || 0) + 1;
    }
    await assessment.save();
    
    res.status(201).json(createdIssue);
  } catch (error) {
    logger.error('Error creating vendor issue:', error);
    res.status(500).json({
      message: 'Failed to create vendor issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update vendor issue
// @route   PUT /api/vendors/issues/:id
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const updateVendorIssue = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const issue = await VendorIssue.findOne({ id: req.params.id });
    
    if (!issue) {
      res.status(404).json({ message: 'Vendor issue not found' });
      return;
    }
    
    const prevStatus = issue.status;
    const prevSeverity = issue.severity;
    
    // Update fields
    if (req.body.title) issue.title = req.body.title;
    if (req.body.description) issue.description = req.body.description;
    if (req.body.severity) issue.severity = req.body.severity;
    if (req.body.status) issue.status = req.body.status;
    if (req.body.dueDate) issue.dueDate = new Date(req.body.dueDate);
    if (req.body.owner) issue.owner = req.body.owner;
    if (req.body.category) issue.category = req.body.category;
    if (req.body.remediationPlan) issue.remediationPlan = req.body.remediationPlan;
    if (req.body.remediationProgress !== undefined) issue.remediationProgress = req.body.remediationProgress;
    
    // Set closedDate if status changed to Closed or Remediated
    if ((req.body.status === 'Closed' || req.body.status === 'Remediated') && 
        (prevStatus !== 'Closed' && prevStatus !== 'Remediated')) {
      issue.closedDate = new Date();
    } else if (req.body.
                   // Set closedDate if status changed to Closed or Remediated
    if ((req.body.status === 'Closed' || req.body.status === 'Remediated') && 
        (prevStatus !== 'Closed' && prevStatus !== 'Remediated')) {
      issue.closedDate = new Date();
    } else if (req.body.status !== 'Closed' && req.body.status !== 'Remediated') {
      issue.closedDate = undefined;
    }
    
    const updatedIssue = await issue.save();
    
    // Update assessment issue counts if necessary
    if (req.body.status && prevStatus !== req.body.status) {
      const assessment = await VendorAssessment.findById(issue.assessment);
      if (assessment) {
        // If issue is now remediated or closed, but wasn't before
        if ((req.body.status === 'Remediated' || req.body.status === 'Closed') && 
            (prevStatus !== 'Remediated' && prevStatus !== 'Closed')) {
          assessment.remediatedIssues = (assessment.remediatedIssues || 0) + 1;
          await assessment.save();
        }
        // If issue was remediated or closed, but isn't anymore
        else if ((prevStatus === 'Remediated' || prevStatus === 'Closed') && 
                (req.body.status !== 'Remediated' && req.body.status !== 'Closed')) {
          assessment.remediatedIssues = Math.max(0, (assessment.remediatedIssues || 0) - 1);
          await assessment.save();
        }
      }
    }
    
    // Update high risk issue count if severity changed
    if (req.body.severity && prevSeverity !== req.body.severity) {
      const assessment = await VendorAssessment.findById(issue.assessment);
      if (assessment) {
        // If issue is now high/critical, but wasn't before
        if ((req.body.severity === 'Critical' || req.body.severity === 'High') && 
            (prevSeverity !== 'Critical' && prevSeverity !== 'High')) {
          assessment.highRiskIssues = (assessment.highRiskIssues || 0) + 1;
          await assessment.save();
        }
        // If issue was high/critical, but isn't anymore
        else if ((prevSeverity === 'Critical' || prevSeverity === 'High') && 
                (req.body.severity !== 'Critical' && req.body.severity !== 'High')) {
          assessment.highRiskIssues = Math.max(0, (assessment.highRiskIssues || 0) - 1);
          await assessment.save();
        }
      }
    }
    
    res.json(updatedIssue);
  } catch (error) {
    logger.error(`Error updating vendor issue ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update vendor issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete vendor issue
// @route   DELETE /api/vendors/issues/:id
// @access  Private/Admin
const deleteVendorIssue = async (req: Request, res: Response) => {
  try {
    const issue = await VendorIssue.findOne({ id: req.params.id });
    
    if (!issue) {
      res.status(404).json({ message: 'Vendor issue not found' });
      return;
    }
    
    // Update assessment issue counts
    const assessment = await VendorAssessment.findById(issue.assessment);
    if (assessment) {
      assessment.issues = Math.max(0, (assessment.issues || 0) - 1);
      
      if (issue.severity === 'Critical' || issue.severity === 'High') {
        assessment.highRiskIssues = Math.max(0, (assessment.highRiskIssues || 0) - 1);
      }
      
      if (issue.status === 'Remediated' || issue.status === 'Closed') {
        assessment.remediatedIssues = Math.max(0, (assessment.remediatedIssues || 0) - 1);
      }
      
      await assessment.save();
    }
    
    // Delete the issue
    await VendorIssue.deleteOne({ _id: issue._id });
    
    res.json({ message: 'Vendor issue removed' });
  } catch (error) {
    logger.error(`Error deleting vendor issue ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete vendor issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  // Vendor exports
  getVendors,
  getVendorById,
  getVendorCategories,
  createVendor,
  updateVendor,
  deleteVendor,
  
  // Vendor assessment exports
  getVendorAssessments,
  getVendorAssessmentById,
  createVendorAssessment,
  updateVendorAssessment,
  deleteVendorAssessment,
  getVendorAssessmentsByVendorId,
  
  // Vendor issue exports
  getVendorIssues,
  getVendorIssueById,
  createVendorIssue,
  updateVendorIssue,
  deleteVendorIssue,
  getVendorIssuesByVendorId
};
