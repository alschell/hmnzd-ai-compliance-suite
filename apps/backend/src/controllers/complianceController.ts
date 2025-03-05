/**
 * Compliance Controller
 * Current date: 2025-03-05 13:33:56
 * Current user: alschell
 */

import { Request, Response } from 'express';
import { Framework, Control, Assessment, Finding, Evidence } from '../models/complianceModel';
import { logger } from '../utils/logger';

// ======== Framework Controllers ========

// @desc    Get all frameworks
// @route   GET /api/compliance/frameworks
// @access  Private
const getFrameworks = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Framework.countDocuments(filterOptions);
    
    const frameworks = await Framework.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      frameworks,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching frameworks:', error);
    res.status(500).json({
      message: 'Failed to fetch frameworks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get framework by ID
// @route   GET /api/compliance/frameworks/:id
// @access  Private
const getFrameworkById = async (req: Request, res: Response) => {
  try {
    const framework = await Framework.findOne({ id: req.params.id })
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate({
        path: 'controls',
        populate: {
          path: 'owner',
          select: 'username firstName lastName'
        }
      });
    
    if (!framework) {
      res.status(404).json({ message: 'Framework not found' });
      return;
    }
    
    res.json(framework);
  } catch (error) {
    logger.error(`Error fetching framework ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch framework',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create framework
// @route   POST /api/compliance/frameworks
// @access  Private/Admin/ComplianceManager
const createFramework = async (req: Request, res: Response) => {
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
      version,
      controls,
      owner
    } = req.body;
    
    const userId = req.user.id;
    
    // Check if framework with ID already exists
    if (id) {
      const existingFramework = await Framework.findOne({ id });
      if (existingFramework) {
        res.status(400).json({ message: `Framework with ID ${id} already exists` });
        return;
      }
    }
    
    const framework = new Framework({
      id,
      name,
      description,
      category,
      version,
      controls: controls || [],
      owner: owner || userId,
      createdBy: userId
    });
    
    const createdFramework = await framework.save();
    
    res.status(201).json(createdFramework);
  } catch (error) {
    logger.error('Error creating framework:', error);
    res.status(500).json({
      message: 'Failed to create framework',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update framework
// @route   PUT /api/compliance/frameworks/:id
// @access  Private/Admin/ComplianceManager
const updateFramework = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const framework = await Framework.findOne({ id: req.params.id });
    
    if (!framework) {
      res.status(404).json({ message: 'Framework not found' });
      return;
    }
    
    // Update fields
    framework.name = req.body.name || framework.name;
    framework.description = req.body.description || framework.description;
    framework.category = req.body.category || framework.category;
    framework.version = req.body.version || framework.version;
    framework.owner = req.body.owner || framework.owner;
    
    if (req.body.controls) {
      framework.controls = req.body.controls;
    }
    
    if (req.body.complianceScore !== undefined) {
      framework.complianceScore = req.body.complianceScore;
    }
    
    if (req.body.lastAssessmentDate) {
      framework.lastAssessmentDate = new Date(req.body.lastAssessmentDate);
    }
    
    if (req.body.nextAssessmentDate) {
      framework.nextAssessmentDate = new Date(req.body.nextAssessmentDate);
    }
    
    const updatedFramework = await framework.save();
    
    res.json(updatedFramework);
  } catch (error) {
    logger.error(`Error updating framework ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update framework',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete framework
// @route   DELETE /api/compliance/frameworks/:id
// @access  Private/Admin
const deleteFramework = async (req: Request, res: Response) => {
  try {
    const framework = await Framework.findOne({ id: req.params.id });
    
    if (!framework) {
      res.status(404).json({ message: 'Framework not found' });
      return;
    }
    
    // Delete associated controls
    await Control.deleteMany({ framework: framework._id });
    
    // Delete the framework
    await Framework.deleteOne({ _id: framework._id });
    
    res.json({ message: 'Framework and associated controls removed' });
  } catch (error) {
    logger.error(`Error deleting framework ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete framework',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Control Controllers ========

// @desc    Get all controls
// @route   GET /api/compliance/controls
// @access  Private
const getControls = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.frameworkId) {
      const framework = await Framework.findOne({ id: req.query.frameworkId });
      if (framework) {
        filterOptions.framework = framework._id;
      }
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
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
    
    const count = await Control.countDocuments(filterOptions);
    
    const controls = await Control.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('framework', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      controls,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching controls:', error);
    res.status(500).json({
      message: 'Failed to fetch controls',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get control by ID
// @route   GET /api/compliance/controls/:id
// @access  Private
const getControlById = async (req: Request, res: Response) => {
  try {
    const control = await Control.findOne({ id: req.params.id })
      .populate('framework', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate('evidence')
      .populate('policies');
    
    if (!control) {
      res.status(404).json({ message: 'Control not found' });
      return;
    }
    
    res.json(control);
  } catch (error) {
    logger.error(`Error fetching control ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch control',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create control
// @route   POST /api/compliance/controls
// @access  Private/Admin/ComplianceManager
const createControl = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      name,
      description,
      frameworkId,
      category,
      subCategory,
      requirement,
      status,
      evidence,
      policies,
      riskLevel,
      implementationStatus,
      owner
    } = req.body;
    
    const userId = req.user.id;
    
    // Get framework by ID
    const framework = await Framework.findOne({ id: frameworkId });
    if (!framework) {
      res.status(400).json({ message: `Framework with ID ${frameworkId} not found` });
      return;
    }
    
    // Check if control already exists
    if (await Control.findOne({ id })) {
      res.status(400).json({ message: `Control with ID ${id} already exists` });
      return;
    }
    
    const control = new Control({
      id,
      name,
      description,
      framework: framework._id,
      category,
      subCategory,
      requirement,
      status: status || 'Not-Applicable',
      evidence: evidence || [],
      policies: policies || [],
      riskLevel,
      implementationStatus: implementationStatus || 'Not Implemented',
      owner: owner || userId,
      createdBy: userId
    });
    
    const createdControl = await control.save();
    
    // Add control to framework's controls array if not already there
    if (!framework.controls.includes(createdControl._id)) {
      framework.controls.push(createdControl._id);
      await framework.save();
    }
    
    res.status(201).json(createdControl);
  } catch (error) {
    logger.error('Error creating control:', error);
    res.status(500).json({
      message: 'Failed to create control',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update control
// @route   PUT /api/compliance/controls/:id
// @access  Private/Admin/ComplianceManager
const updateControl = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const control = await Control.findOne({ id: req.params.id });
    
    if (!control) {
      res.status(404).json({ message: 'Control not found' });
      return;
    }
    
    // Update fields
    if (req.body.name) control.name = req.body.name;
    if (req.body.description) control.description = req.body.description;
    if (req.body.category) control.category = req.body.category;
    if (req.body.subCategory) control.subCategory = req.body.subCategory;
    if (req.body.requirement) control.requirement = req.body.requirement;
    if (req.body.status) control.status = req.body.status;
    if (req.body.riskLevel) control.riskLevel = req.body.riskLevel;
    if (req.body.implementationStatus) control.implementationStatus = req.body.implementationStatus;
    if (req.body.owner) control.owner = req.body.owner;
    
    if (req.body.evidence) control.evidence = req.body.evidence;
    if (req.body.policies) control.policies = req.body.policies;
    
    if (req.body.lastAssessment) control.lastAssessment = new Date(req.body.lastAssessment);
    if (req.body.nextAssessment) control.nextAssessment = new Date(req.body.nextAssessment);
    
    const updatedControl = await control.save();
    
    res.json(updatedControl);
  } catch (error) {
    logger.error(`Error updating control ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update control',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete control
// @route   DELETE /api/compliance/controls/:id
// @access  Private/Admin
const deleteControl = async (req: Request, res: Response) => {
  try {
    const control = await Control.findOne({ id: req.params.id });
    
    if (!control) {
      res.status(404).json({ message: 'Control not found' });
      return;
    }
    
    // Remove control reference from framework
    await Framework.updateOne(
      { _id: control.framework },
      { $pull: { controls: control._id } }
    );
    
    // Delete the control
    await Control.deleteOne({ _id: control._id });
    
    res.json({ message: 'Control removed' });
  } catch (error) {
    logger.error(`Error deleting control ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete control',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Assessment Controllers ========

// @desc    Get all assessments
// @route   GET /api/compliance/assessments
// @access  Private
const getAssessments = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.frameworkId) {
      const framework = await Framework.findOne({ id: req.query.frameworkId });
      if (framework) {
        filterOptions.framework = framework._id;
      }
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.assessor) {
      filterOptions.assessor = req.query.assessor;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Assessment.countDocuments(filterOptions);
    
    const assessments = await Assessment.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('framework', 'id name category')
      .populate('assessor', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      assessments,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching assessments:', error);
    res.status(500).json({
      message: 'Failed to fetch assessments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/compliance/assessments/:id
// @access  Private
const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findOne({ id: req.params.id })
      .populate('framework', 'id name category')
      .populate('assessor', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate({
        path: 'findings',
        populate: {
          path: 'owner',
          select: 'username firstName lastName'
        }
      });
    
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    res.json(assessment);
  } catch (error) {
    logger.error(`Error fetching assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create assessment
// @route   POST /api/compliance/assessments
// @access  Private/Admin/ComplianceManager/Auditor
const createAssessment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      name,
      description,
      frameworkId,
      status,
      assessmentDate,
      completionDate,
      nextAssessmentDate,
      assessor,
      findings,
      completionPercentage,
      reportUrl
    } = req.body;
    
    const userId = req.user.id;
    
    // Get framework by ID
    const framework = await Framework.findOne({ id: frameworkId });
    if (!framework) {
      res.status(400).json({ message: `Framework with ID ${frameworkId} not found` });
      return;
    }
    
    // Check if assessment ID already exists
    if (id && await Assessment.findOne({ id })) {
      res.status(400).json({ message: `Assessment with ID ${id} already exists` });
      return;
    }
    
    const assessment = new Assessment({
      id,
      name,
      description,
      framework: framework._id,
      status: status || 'Planned',
      assessmentDate: assessmentDate ? new Date(assessmentDate) : new Date(),
      completionDate: completionDate ? new Date(completionDate) : undefined,
      nextAssessmentDate: nextAssessmentDate ? new Date(nextAssessmentDate) : undefined,
      assessor: assessor || userId,
      findings: findings || [],
      completionPercentage: completionPercentage || 0,
      reportUrl,
      createdBy: userId
    });
    
    const createdAssessment = await assessment.save();
    
    // Update framework with assessment info
    if (completionDate) {
      framework.lastAssessmentDate = new Date(completionDate);
    }
    
    if (nextAssessmentDate) {
      framework.nextAssessmentDate = new Date(nextAssessmentDate);
    }
    
    await framework.save();
    
    res.status(201).json(createdAssessment);
  } catch (error) {
    logger.error('Error creating assessment:', error);
    res.status(500).json({
      message: 'Failed to create assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update assessment
// @route   PUT /api/compliance/assessments/:id
// @access  Private/Admin/ComplianceManager/Auditor
const updateAssessment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const assessment = await Assessment.findOne({ id: req.params.id });
    
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    // Update fields
    if (req.body.name) assessment.name = req.body.name;
    if (req.body.description) assessment.description = req.body.description;
    if (req.body.status) assessment.status = req.body.status;
    if (req.body.assessmentDate) assessment.assessmentDate = new Date(req.body.assessmentDate);
    if (req.body.completionDate) assessment.completionDate = new Date(req.body.completionDate);
    if (req.body.nextAssessmentDate) assessment.nextAssessmentDate = new Date(req.body.nextAssessmentDate);
    if (req.body.assessor) assessment.assessor = req.body.assessor;
    if (req.body.completionPercentage !== undefined) assessment.completionPercentage = req.body.completionPercentage;
    if (req.body.reportUrl) assessment.reportUrl = req.body.reportUrl;
    if (req.body.findings) assessment.findings = req.body.findings;
    
    const updatedAssessment = await assessment.save();
    
    // Update framework if assessment is completed
    if (req.body.status === 'Compliant' || req.body.status === 'Non-Compliant') {
      const framework = await Framework.findById(assessment.framework);
      if (framework) {
        if (req.body.completionDate) {
          framework.lastAssessmentDate = new Date(req.body.completionDate);
        } else {
          framework.lastAssessmentDate = new Date();
        }
        
        if (req.body.nextAssessmentDate) {
          framework.nextAssessmentDate = new Date(req.body.nextAssessmentDate);
        }
        
        await framework.save();
      }
    }
    
    res.json(updatedAssessment);
  } catch (error) {
    logger.error(`Error updating assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/compliance/assessments/:id
// @access  Private/Admin
const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findOne({ id: req.params.id });
    
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    // Delete associated findings
    await Finding.deleteMany({ assessment: assessment._id });
    
    // Delete the assessment
    await Assessment.deleteOne({ _id: assessment._id });
    
    res.json({ message: 'Assessment and associated findings removed' });
  } catch (error) {
    logger.error(`Error deleting assessment ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Finding Controllers ========

// @desc    Get all findings
// @route   GET /api/compliance/findings
// @access  Private
const getFindings = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.assessmentId) {
      const assessment = await Assessment.findOne({ id: req.query.assessmentId });
      if (assessment) {
        filterOptions.assessment = assessment._id;
      }
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.severity) {
      filterOptions.severity = req.query.severity;
    }
    
    if (req.query.owner) {
      filterOptions.owner = req.query.owner;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { controlId: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Finding.countDocuments(filterOptions);
    
    const findings = await Finding.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('framework', 'id name')
      .populate('assessment', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      findings,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching findings:', error);
    res.status(500).json({
      message: 'Failed to fetch findings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get finding by ID
// @route   GET /api/compliance/findings/:id
// @access  Private
const getFindingById = async (req: Request, res: Response) => {
  try {
    const finding = await Finding.findOne({ id: req.params.id })
      .populate('framework', 'id name')
      .populate('assessment', 'id name')
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    if (!finding) {
      res.status(404).json({ message: 'Finding not found' });
      return;
    }
    
    res.json(finding);
  } catch (error) {
    logger.error(`Error fetching finding ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch finding',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create finding
// @route   POST /api/compliance/findings
// @access  Private/Admin/ComplianceManager/Auditor
const createFinding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      title,
      description,
      severity,
      status,
      frameworkId,
      controlId,
      assessmentId,
      identifiedDate,
      dueDate,
      owner,
      remediationProgress,
      remediationPlan
    } = req.body;
    
    const userId = req.user.id;
    
    // Get assessment by ID
    const assessment = await Assessment.findOne({ id: assessmentId });
    if (!assessment) {
      res.status(400).json({ message: `Assessment with ID ${assessmentId} not found` });
      return;
    }
    
    // Get framework by ID
    const framework = await Framework.findOne({ id: frameworkId });
    if (!framework) {
      res.status(400).json({ message: `Framework with ID ${frameworkId} not found` });
      return;
    }
    
    // Check if finding ID already exists
    if (id && await Finding.findOne({ id })) {
      res.status(400).json({ message: `Finding with ID ${id} already exists` });
      return;
    }
    
    const finding = new Finding({
      id,
      title,
      description,
      severity,
      status: status || 'Open',
      framework: framework._id,
      controlId,
      assessment: assessment._id,
      identifiedDate: identifiedDate ? new Date(identifiedDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      owner: owner || userId,
      remediationProgress,
      remediationPlan,
      createdBy: userId
    });
    
    const createdFinding = await finding.save();
    
    // Add finding to assessment's findings array
    if (!assessment.findings.includes(createdFinding._id)) {
      assessment.findings.push(createdFinding._id);
      await assessment.save();
    }
    
    res.status(201).json(createdFinding);
  } catch (error) {
    logger.error('Error creating finding:', error);
    res.status(500).json({
      message: 'Failed to create finding',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update finding
// @route   PUT /api/compliance/findings/:id
// @access  Private/Admin/ComplianceManager/Auditor
const updateFinding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const finding = await Finding.findOne({ id: req.params.id });
    
    if (!finding) {
      res.status(404).json({ message: 'Finding not found' });
      return;
    }
    
    // Update fields
    if (req.body.title) finding.title = req.body.title;
    if (req.body.description) finding.description = req.body.description;
    if (req.body.severity) finding.severity = req.body.severity;
    if (req.body.status) finding.status = req.body.status;
    if (req.body.controlId) finding.controlId = req.body.controlId;
    if (req.body.owner) finding.owner = req.body.owner;
    if (req.body.remediationPlan) finding.remediationPlan = req.body.remediationPlan;
    if (req.body.remediationProgress !== undefined) finding.remediationProgress = req.body.remediationProgress;
    if (req.body.dueDate) finding.dueDate = new Date(req.body.dueDate);
    
    // Set closedDate if status changed to Closed
    if (req.body.status === 'Closed' && finding.status !== 'Closed') {
      finding.closedDate = new Date();
    } else if (req.body.status !== 'Closed') {
      finding.closedDate = undefined;
    }
    
    const updatedFinding = await finding.save();
    
    res.json(updatedFinding);
  } catch (error) {
    logger.error(`Error updating finding ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update finding',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete finding
// @route   DELETE /api/compliance/findings/:id
// @access  Private/Admin
const deleteFinding = async (req: Request, res: Response) => {
  try {
    const finding = await Finding.findOne({ id: req.params.id });
    
    if (!finding) {
      res.status(404).json({ message: 'Finding not found' });
      return;
    }
    
    // Remove finding reference from assessment
    await Assessment.updateOne(
      { _id: finding.assessment },
      { $pull: { findings: finding._id } }
    );
    
    // Delete the finding
    await Finding.deleteOne({ _id: finding._id });
    
    res.json({ message: 'Finding removed' });
  } catch (error) {
    logger.error(`Error deleting finding ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete finding',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ======== Evidence Controllers ========

// @desc    Get all evidence
// @route   GET /api/compliance/evidence
// @access  Private
const getEvidence = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.controlId) {
      const control = await Control.findOne({ id: req.query.controlId });
      if (control) {
        filterOptions.controls = control._id;
      }
    }
    
    if (req.query.uploadedBy) {
      filterOptions.uploadedBy = req.query.uploadedBy;
    }
    
    if (req.query.tag) {
      filterOptions.tags = req.query.tag;
    }
    
    if (req.query.fileType) {
      filterOptions.fileType = req.query.fileType;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const count = await Evidence.countDocuments(filterOptions);
    
    const evidence = await Evidence.find(filterOptions)
      .sort({ updatedAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('uploadedBy', 'username firstName lastName')
      .populate('controls', 'id name')
      .populate('assessments', 'id name')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      evidence,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching evidence:', error);
    res.status(500).json({
      message: 'Failed to fetch evidence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get evidence by ID
// @route   GET /api/compliance/evidence/:id
// @access  Private
const getEvidenceById = async (req: Request, res: Response) => {
  try {
    const evidence = await Evidence.findOne({ id: req.params.id })
      .populate('uploadedBy', 'username firstName lastName')
      .populate('controls', 'id name')
      .populate('assessments', 'id name')
      .populate('createdBy', 'username firstName lastName');
    
    if (!evidence) {
      res.status(404).json({ message: 'Evidence not found' });
      return;
    }
    
    res.json(evidence);
  } catch (error) {
    logger.error(`Error fetching evidence ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch evidence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create evidence
// @route   POST /api/compliance/evidence
// @access  Private
const createEvidence = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const {
      id,
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      controls,
      assessments,
      tags,
      expiryDate
    } = req.body;
    
    const userId = req.user.id;
    
    // Check if evidence ID already exists
    if (id && await Evidence.findOne({ id })) {
      res.status(400).json({ message: `Evidence with ID ${id} already exists` });
      return;
    }
    
    const evidence = new Evidence({
      id,
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      uploadedBy: userId,
      uploadDate: new Date(),
      controls: controls || [],
      assessments: assessments || [],
      tags: tags || [],
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      createdBy: userId
    });
    
    const createdEvidence = await evidence.save();
    
    // Add evidence reference to controls
    if (controls && controls.length > 0) {
      await Promise.all(controls.map(async (controlId: string) => {
        const control = await Control.findById(controlId);
        if (control && !control.evidence.includes(createdEvidence._id)) {
          control.evidence.push(createdEvidence._id);
          await control.save();
        }
      }));
    }
    
    res.status(201).json(createdEvidence);
  } catch (error) {
    logger.error('Error creating evidence:', error);
    res.status(500).json({
      message: 'Failed to create evidence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update evidence
// @route   PUT /api/compliance/evidence/:id
// @access  Private
const updateEvidence = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const evidence = await Evidence.findOne({ id: req.params.id });
    
    if (!evidence) {
      res.status(404).json({ message: 'Evidence not found' });
      return;
    }
    
    // Update fields
    if (req.body.title) evidence.title = req.body.title;
    if (req.body.description) evidence.description = req.body.description;
    if (req.body.fileUrl) evidence.fileUrl = req.body.fileUrl;
    if (req.body.fileType) evidence.fileType = req.body.fileType;
    if (req.body.fileSize) evidence.fileSize = req.body.fileSize;
    if (req.body.tags) evidence.tags = req.body.tags;
    if (req.body.expiryDate) evidence.expiryDate = new Date(req.body.expiryDate);
    
    // Handle control and assessment references
    if (req.body.controls) {
      // Remove evidence from controls that are no longer associated
      const existingControlIds = evidence.controls.map(id => id.toString());
      const newControlIds = req.body.controls.map((id: string) => id.toString());
      
      // Controls to remove
      const controlsToRemove = existingControlIds.filter(id => !newControlIds.includes(id));
      if (controlsToRemove.length > 0) {
        await Control.updateMany(
          { _id: { $in: controlsToRemove } },
          { $pull: { evidence: evidence._id } }
        );
      }
      
      // Controls to add
      const controlsToAdd = newControlIds.filter(id => !existingControlIds.includes(id));
      if (controlsToAdd.length > 0) {
        await Promise.all(controlsToAdd.map(async (controlId: string) => {
          await Control.updateOne(
            { _id: controlId },
            { $addToSet: { evidence: evidence._id } }
          );
        }));
      }
      
      evidence.controls = req.body.controls;
    }
    
    if (req.body.assessments) {
      evidence.assessments = req.body.assessments;
    }
    
    const updatedEvidence = await evidence.save();
    
    res.json(updatedEvidence);
  } catch (error) {
    logger.error(`Error updating evidence ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update evidence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete evidence
// @route   DELETE /api/compliance/evidence/:id
// @access  Private/Admin
const deleteEvidence = async (req: Request, res: Response) => {
  try {
    const evidence = await Evidence.findOne({ id: req.params.id });
    
    if (!evidence) {
      res.status(404).json({ message: 'Evidence not found' });
      return;
    }
    
    // Remove evidence reference from controls
    await Control.updateMany(
      { evidence: evidence._id },
      { $pull: { evidence: evidence._id } }
    );
    
    // Delete the evidence
    await Evidence.deleteOne({ _id: evidence._id });
    
    res.json({ message: 'Evidence removed' });
  } catch (error) {
    logger.error(`Error deleting evidence ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete evidence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  // Framework exports
  getFrameworks,
  getFrameworkById,
  createFramework,
  updateFramework,
  deleteFramework,
  
  // Control exports
  getControls,
  getControlById,
  createControl,
  updateControl,
  deleteControl,
  
  // Assessment exports
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  
  // Finding exports
  getFindings,
  getFindingById,
  createFinding,
  updateFinding,
  deleteFinding,
  
  // Evidence exports
  getEvidence,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence
};
