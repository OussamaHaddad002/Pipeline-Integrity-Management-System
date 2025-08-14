"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumericEnv = exports.getBooleanEnv = exports.getEnv = exports.validateEnv = void 0;
const logger_1 = require("./logger");
const validateEnv = () => {
    const requiredVars = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'JWT_SECRET',
        'FRONTEND_URL'
    ];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
        logger_1.logger.error(errorMessage);
        throw new Error(errorMessage);
    }
    logger_1.logger.info('Environment configuration validated', {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        FRONTEND_URL: process.env.FRONTEND_URL,
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        DATABASE_CONNECTED: !!process.env.DATABASE_URL,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        PYTHON_API_URL: process.env.PYTHON_API_URL || 'Not configured'
    });
};
exports.validateEnv = validateEnv;
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value || defaultValue;
};
exports.getEnv = getEnv;
const getBooleanEnv = (key, defaultValue = false) => {
    const value = process.env[key];
    if (!value) {
        return defaultValue;
    }
    return value.toLowerCase() === 'true' || value === '1';
};
exports.getBooleanEnv = getBooleanEnv;
const getNumericEnv = (key, defaultValue) => {
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
exports.getNumericEnv = getNumericEnv;
//# sourceMappingURL=validation.js.map