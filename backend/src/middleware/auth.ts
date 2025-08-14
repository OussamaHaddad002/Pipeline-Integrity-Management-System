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
    console.log('Auth middleware - req.originalUrl:', req.originalUrl);
    
    // For development, skip auth for all API endpoints
    // Check both undefined NODE_ENV and explicit 'development'
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('Auth middleware - bypassing auth for development environment');
      return next();
    }

    // Production authentication logic
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
