/**
 * Request Logging Middleware
 * Current date: 2025-03-05 13:50:32
 * Current user: alschell
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log the request
  logger.http(`${req.method} ${req.originalUrl} from ${req.ip}`);
  
  // Create start time
  const start = Date.now();
  
  // Once response is finished
  res.on('finish', () => {
    // Calculate request duration
    const duration = Date.now() - start;
    
    // Log response details
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  
  next();
};

export default requestLogger;
