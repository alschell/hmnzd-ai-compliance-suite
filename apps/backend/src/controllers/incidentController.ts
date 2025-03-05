/**
 * Incident Management Controller
 * Current date: 2025-03-05 13:43:29
 * Current user: alschell
 */

import { Request, Response } from 'express';
import { Incident, IncidentUpdate } from '../models/incidentModel';
import { logger } from '../utils/logger';

// ======== Incident Controllers ========

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filter object based on query params
    const filterOptions: any = {};
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.severity) {
      filterOptions.severity = req.query.severity;
    }
    
    if (req.query.category) {
      filterOptions.category = req.query.category;
    }
    
    if (req.query.owner) {
      filterOptions.owner = req.query.owner;
    }
    
    if (req.query.assignedTeam) {
      filterOptions.assignedTeam = req.query.assignedTeam;
    }
    
    if (req.query.search) {
      filterOptions.$or = [
        { id: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filterOptions.createdAt = {};
      
      if (req.query.startDate) {
        filterOptions.createdAt.$gte = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        filterOptions.createdAt.$lte = new Date(req.query.endDate as string);
      }
    }
    
    const count = await Incident.countDocuments(filterOptions);
    
    // Sort options
    let sortOption = { createdAt: -1 }; // Default sort by creation date (newest first)
    
    if (req.query.sortBy) {
      if (req.query.sortBy === 'severity') {
        // Custom sort for severity (Critical > High > Medium > Low)
        const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        sortOption = { severity: -1, createdAt: -1 };
      } else if (req.query.sortBy === 'status') {
        sortOption = { status: 1, createdAt: -1 };
      } else if (req.query.sortBy === 'sla') {
        sortOption = { sla: 1, createdAt: -1 }; // Sort by closest SLA first
      }
    }
    
    const incidents = await Incident.find(filterOptions)
      .sort(sortOption)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    res.json({
      incidents,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    logger.error('Error fetching incidents:', error);
    res.status(500).json({
      message: 'Failed to fetch incidents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get incident statistics
// @route   GET /api/incidents/stats
// @access  Private
const getIncidentStats = async (req: Request, res: Response) => {
  try {
    // Get total counts by status
    const statusCounts = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get total counts by severity
    const severityCounts = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Get total counts by category
    const categoryCounts = await Incident.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get incidents created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentIncidents = await Incident.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get SLA statistics
    const now = new Date();
    const slaMissedCount = await Incident.countDocuments({ 
      status: { $in: ['Open', 'Investigating'] }, 
      sla: { $lt: now } 
    });
    
    const slaAtRiskCount = await Incident.countDocuments({
      status: { $in: ['Open', 'Investigating'] },
      sla: { $gt: now, $lt: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    // Average resolution time (for resolved incidents)
    const avgResolutionTime = await Incident.aggregate([
      { $match: { resolvedAt: { $exists: true } } },
      { $project: { 
          resolutionTimeHours: { 
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] }, 
              3600000 // Convert ms to hours
            ] 
          } 
        } 
      },
      { $group: { _id: null, average: { $avg: '$resolutionTimeHours' } } }
    ]);
    
    // Format the results
    const stats = {
      total: await Incident.countDocuments(),
      open: await Incident.countDocuments({ status: 'Open' }),
      investigating: await Incident.countDocuments({ status: 'Investigating' }),
      mitigated: await Incident.countDocuments({ status: 'Mitigated' }),
      resolved: await Incident.countDocuments({ status: 'Resolved' }),
      closed: await Incident.countDocuments({ status: 'Closed' }),
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: severityCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      byCategory: categoryCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      recentTrend: recentIncidents,
      sla: {
        missed: slaMissedCount,
        atRisk: slaAtRiskCount
      },
      avgResolutionTimeHours: avgResolutionTime.length > 0 ? avgResolutionTime[0].average : 0
    };
    
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching incident statistics:', error);
    res.status(500).json({
      message: 'Failed to fetch incident statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get incident categories
// @route   GET /api/incidents/categories
// @access  Private
const getIncidentCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Incident.distinct('category');
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching incident categories:', error);
    res.status(500).json({
      message: 'Failed to fetch incident categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id })
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    // Get updates for this incident
    const updates = await IncidentUpdate.find({ incident: incident._id })
      .sort({ createdAt: 1 })
      .populate('updatedBy', 'username firstName lastName');
    
    // Return incident with updates
    res.json({
      ...incident.toObject(),
      updates
    });
  } catch (error) {
    logger.error(`Error fetching incident ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create incident
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req: Request, res: Response) => {
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
      category,
      owner,
      assignedTeam,
      affectedSystems,
      impact,
      sla
    } = req.body;
    
    const userId = req.user.id;
    
    // Check if incident ID already exists
    if (id && await Incident.findOne({ id })) {
      res.status(400).json({ message: `Incident with ID ${id} already exists` });
      return;
    }
    
    const incident = new Incident({
      id,
      title,
      description,
      severity,
      status: status || 'Open',
      category,
      createdBy: userId,
      owner: owner || userId,
      assignedTeam,
      affectedSystems,
      impact,
      sla: sla ? new Date(sla) : undefined,
      progress: 0,
      notificationsSent: false
    });
    
    const createdIncident = await incident.save();
    
    // Create an initial update entry
    const initialUpdate = new IncidentUpdate({
      incident: createdIncident._id,
      updateText: `Incident created: ${description || 'No initial description provided'}`,
      updatedBy: userId,
      updateType: 'General',
      createdAt: new Date()
    });
    
    await initialUpdate.save();
    
    res.status(201).json(createdIncident);
  } catch (error) {
    logger.error('Error creating incident:', error);
    res.status(500).json({
      message: 'Failed to create incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const updateIncident = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const incident = await Incident.findOne({ id: req.params.id });
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    const userId = req.user.id;
    const previousStatus = incident.status;
    
    // Update fields
    if (req.body.title) incident.title = req.body.title;
    if (req.body.description) incident.description = req.body.description;
    if (req.body.severity) incident.severity = req.body.severity;
    if (req.body.status) incident.status = req.body.status;
    if (req.body.category) incident.category = req.body.category;
    if (req.body.owner) incident.owner = req.body.owner;
    if (req.body.assignedTeam) incident.assignedTeam = req.body.assignedTeam;
    if (req.body.affectedSystems) incident.affectedSystems = req.body.affectedSystems;
    if (req.body.impact) incident.impact = req.body.impact;
    if (req.body.rootCause) incident.rootCause = req.body.rootCause;
    if (req.body.mitigation) incident.mitigation = req.body.mitigation;
    if (req.body.lessons) incident.lessons = req.body.lessons;
    if (req.body.sla) incident.sla = new Date(req.body.sla);
    if (req.body.progress !== undefined) incident.progress = req.body.progress;
    if (req.body.related) incident.related = req.body.related;
    if (req.body.notificationsSent !== undefined) incident.notificationsSent = req.body.notificationsSent;
    if (req.body.reportUrl) incident.reportUrl = req.body.reportUrl;
    
    // Set timestamps based on status changes
    if (req.body.status && req.body.status !== previousStatus) {
      if (req.body.status === 'Resolved' && previousStatus !== 'Resolved') {
        incident.resolvedAt = new Date();
      } else if (req.body.status === 'Closed' && previousStatus !== 'Closed') {
        incident.closedAt = new Date();
      }
    }
    
    // Update timestamp
    incident.updatedAt = new Date();
    
    const updatedIncident = await incident.save();
    
    // Create a status update entry if status changed
    if (req.body.status && req.body.status !== previousStatus) {
      const statusUpdate = new IncidentUpdate({
        incident: incident._id,
        updateText: `Status changed from ${previousStatus} to ${req.body.status}${req.body.updateMessage ? ': ' + req.body.updateMessage : ''}`,
        updatedBy: userId,
        updateType: 'Status Change',
        previousStatus,
        newStatus: req.body.status,
        createdAt: new Date()
      });
      
      await statusUpdate.save();
    }
    
    res.json(updatedIncident);
  } catch (error) {
    logger.error(`Error updating incident ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to update incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private/Admin
const deleteIncident = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    // Delete associated updates
    await IncidentUpdate.deleteMany({ incident: incident._id });
    
    // Delete the incident
    await Incident.deleteOne({ _id: incident._id });
    
    res.json({ message: 'Incident and updates removed' });
  } catch (error) {
    logger.error(`Error deleting incident ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to delete incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get incident updates
// @route   GET /api/incidents/:id/updates
// @access  Private
const getIncidentUpdates = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    const updates = await IncidentUpdate.find({ incident: incident._id })
      .sort({ createdAt: -1 })
      .populate('updatedBy', 'username firstName lastName');
    
    res.json(updates);
  } catch (error) {
    logger.error(`Error fetching updates for incident ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch incident updates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create incident update
// @route   POST /api/incidents/:id/updates
// @access  Private/Admin/ComplianceManager/SecurityAnalyst
const createIncidentUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const incident = await Incident.findOne({ id: req.params.id });
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    const {
      updateText,
      updateType,
      previousStatus,
      newStatus,
      attachments
    } = req.body;
    
    const userId = req.user.id;
    
    const update = new IncidentUpdate({
      incident: incident._id,
      updateText,
      updatedBy: userId,
      updateType: updateType || 'General',
      previousStatus,
      newStatus,
      attachments,
      createdAt: new Date()
    });
    
    const createdUpdate = await update.save();
    
    // Update incident status if provided in the update
    if (newStatus && incident.status !== newStatus) {
      incident.status = newStatus;
      
      // Set timestamps based on status changes
      if (newStatus === 'Resolved' && incident.resolvedAt === undefined) {
        incident.resolvedAt = new Date();
      } else if (newStatus === 'Closed' && incident.closedAt === undefined) {
        incident.closedAt = new Date();
      }
      
      incident.updatedAt = new Date();
      await incident.save();
    }
    
    res.status(201).json(createdUpdate);
  } catch (error) {
    logger.error(`Error creating update for incident ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to create incident update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Export incident report
// @route   GET /api/incidents/:id/export
// @access  Private/Admin/ComplianceManager/SecurityAnalyst/Auditor
const exportIncidentReport = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id })
      .populate('owner', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    // Get updates for this incident
    const updates = await IncidentUpdate.find({ incident: incident._id })
      .sort({ createdAt: 1 })
      .populate('updatedBy', 'username firstName lastName');
    
    // Format the incident data
    const reportData = {
      incident: incident.toObject(),
      updates: updates.map(update => update.toObject()),
      exportTimestamp: new Date(),
      exportedBy: req.user?.id
    };
    
    // For now, we'll just return the JSON data
    // In a real implementation, this would generate a PDF or formatted report
    
    res.json({
      success: true,
      report: reportData,
      message: 'Export successful'
    });
  } catch (error) {
    logger.error(`Error exporting incident report ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to export incident report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
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
};
