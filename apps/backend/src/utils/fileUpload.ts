/**
 * File Upload Utility
 * Current date: 2025-03-05 13:50:32
 * Current user: alschell
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dailyDir = path.join(uploadDir, today);
    
    // Create daily directory if it doesn't exist
    if (!fs.existsSync(dailyDir)) {
      fs.mkdirSync(dailyDir, { recursive: true });
    }
    
    cb(null, dailyDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const randomHash = crypto.randomBytes(8).toString('hex');
    const safeFilename = file.originalname
      .replace(fileExt, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    
    const finalFilename = `${safeFilename}-${randomHash}${fileExt}`;
    cb(null, finalFilename);
  }
});

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow common document types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/png',
    'image/jpeg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Please upload a document or image.'));
  }
};

// Configure file size limits
const maxSize = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // Default 10MB

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSize
  }
});

export default upload;

// Helper to delete a file
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Only delete if file exists and is within uploads directory
    if (filePath && filePath.includes(uploadDir) && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      // Resolve anyway if file doesn't exist
      resolve();
    }
  });
};
