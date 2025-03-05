import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status code
  const statusCode = err.statusCode || 500;
  
  // Log the error
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized',
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate Key Error',
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }
  
  // Default error response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
