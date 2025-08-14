"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("./errorHandler");
const authMiddleware = async (req, _res, next) => {
    try {
        console.log('Auth middleware - NODE_ENV:', process.env.NODE_ENV);
        console.log('Auth middleware - req.path:', req.path);
        console.log('Auth middleware - req.originalUrl:', req.originalUrl);
        const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            console.log('Auth middleware - bypassing auth for development environment');
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw (0, errorHandler_1.createError)('Access token is required', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw (0, errorHandler_1.createError)('Access token is required', 401);
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.logger.error('JWT_SECRET is not configured');
            throw (0, errorHandler_1.createError)('Authentication configuration error', 500);
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next((0, errorHandler_1.createError)('Invalid access token', 401));
        }
        else if (error.name === 'TokenExpiredError') {
            next((0, errorHandler_1.createError)('Access token expired', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map