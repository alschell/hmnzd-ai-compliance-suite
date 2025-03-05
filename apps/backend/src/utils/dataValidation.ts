/**
 * Data Validation Utilities
 * Current date: 2025-03-05 13:50:32
 * Current user: alschell
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Generic validation middleware creator
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Common validation schemas
export const userValidation = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    department: Joi.string().allow(''),
    role: Joi.string().valid('admin', 'compliance_manager', 'security_analyst', 'auditor', 'user')
  }),
  
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  
  update: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    department: Joi.string().allow(''),
    password: Joi.string().min(6).allow(''),
    isActive: Joi.boolean(),
    role: Joi.string().valid('admin', 'compliance_manager', 'security_analyst', 'auditor', 'user')
  })
};

export const policyValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    type: Joi.string().required(),
    category: Joi.string().required(),
    version: Joi.string().required(),
    content: Joi.string().allow(''),
    status: Joi.string().valid('Draft', 'In Review', 'Approved', 'Published', 'Deprecated'),
    owner: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    frameworks: Joi.array().items(Joi.string()),
    relatedControls: Joi.array().items(Joi.string()),
    effectiveDate: Joi.date(),
    reviewDate: Joi.date(),
    fileUrl: Joi.string().allow(''),
    fileType: Joi.string().allow(''),
    fileSize: Joi.number()
  }),
  
  update: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(''),
    type: Joi.string(),
    category: Joi.string(),
    version: Joi.string(),
    content: Joi.string().allow(''),
    status: Joi.string().valid('Draft', 'In Review', 'Approved', 'Published', 'Deprecated'),
    owner: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    frameworks: Joi.array().items(Joi.string()),
    relatedControls: Joi.array().items(Joi.string()),
    effectiveDate: Joi.date(),
    reviewDate: Joi.date(),
    fileUrl: Joi.string().allow(''),
    fileType: Joi.string().allow(''),
    fileSize: Joi.number(),
    changes: Joi.string()
  })
};

export const incidentValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    severity: Joi.string().valid('Critical', 'High', 'Medium', 'Low').required(),
    status: Joi.string().valid('Open', 'Investigating', 'Mitigated', 'Resolved', 'Closed'),
    category: Joi.string().required(),
    owner: Joi.string().allow(''),
    assignedTeam: Joi.string().allow(''),
    affectedSystems: Joi.array().items(Joi.string()),
    impact: Joi.string().allow(''),
    sla: Joi.date()
  }),
  
  update: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(''),
    severity: Joi.string().valid('Critical', 'High', 'Medium', 'Low'),
    status: Joi.string().valid('Open', 'Investigating', 'Mitigated', 'Resolved', 'Closed'),
    category: Joi.string(),
    owner: Joi.string().allow(''),
    assignedTeam: Joi.string().allow(''),
    affectedSystems: Joi.array().items(Joi.string()),
    impact: Joi.string().allow(''),
    rootCause: Joi.string().allow(''),
    mitigation: Joi.string().allow(''),
    lessons: Joi.string().allow(''),
    sla: Joi.date(),
    progress: Joi.number().min(0).max(100),
    related: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      type: Joi.string().required(),
      name: Joi.string().required()
    })),
    notificationsSent: Joi.boolean(),
    reportUrl: Joi.string().allow(''),
    updateMessage: Joi.string().allow('')
  }),
  
  createUpdate: Joi.object({
    updateText: Joi.string().required(),
    updateType: Joi.string().valid('Status Change', 'Investigation', 'Mitigation', 'Resolution', 'General', 'Assignment'),
    previousStatus: Joi.string(),
    newStatus: Joi.string().valid('Open', 'Investigating', 'Mitigated', 'Resolved', 'Closed'),
    attachments: Joi.array().items(Joi.object({
      url: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().required(),
      size: Joi.number().required()
    }))
  })
};
