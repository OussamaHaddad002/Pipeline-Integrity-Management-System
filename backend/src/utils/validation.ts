/**
 * Environment validation utilities
 * @fileoverview Validates and ensures all required environment variables are present
 */

import { logger } from './logger';

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  LOG_LEVEL?: string;
  PYTHON_API_URL?: string;
}

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
export const validateEnv = (): void => {
  const requiredVars: (keyof EnvConfig)[] = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'FRONTEND_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Log configuration for debugging (without sensitive data)
  logger.info('Environment configuration validated', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DATABASE_CONNECTED: !!process.env.DATABASE_URL,
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
    PYTHON_API_URL: process.env.PYTHON_API_URL || 'Not configured'
  });
};

/**
 * Gets environment variable with type safety
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Environment variable value or default
 */
export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  return value || defaultValue!;
};

/**
 * Gets boolean environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Boolean value
 */
export const getBooleanEnv = (key: string, defaultValue = false): boolean => {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Gets numeric environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Numeric value
 */
export const getNumericEnv = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  
  if (!value) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return defaultValue;
  }
  
  const numericValue = parseInt(value, 10);
  
  if (isNaN(numericValue)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
  }
  
  return numericValue;
};
