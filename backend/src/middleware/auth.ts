/**
 * Authentication middleware
 * @fileoverview JWT authentication middleware for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Debug logging 
    console.log('Auth middleware - NODE_ENV:', process.env.NODE_ENV);
    console.log('Auth middleware - req.path:', req.path);
    
    // For development, skip auth for certain endpoints
    if (process.env.NODE_ENV === 'development') {
      // Skip auth for health checks and some development endpoints
      if (req.path === '/health' || 
          req.path.startsWith('/dashboard') || 
          req.path.startsWith('/pipelines') ||
          req.path.startsWith('/risk-assessments') ||
          req.path.startsWith('/predictions') ||
          req.path.startsWith('/spatial') ||
          req.path.startsWith('/data')) {
        console.log('Auth middleware - bypassing auth for development');
        return next();
      }
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw createError('Access token is required', 401);
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      throw createError('Access token is required', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not configured');
      throw createError('Authentication configuration error', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid access token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Access token expired', 401));
    } else {
      next(error);
    }
  }
};
