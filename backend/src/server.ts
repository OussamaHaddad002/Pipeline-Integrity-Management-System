/**
 * Main server entry point for Pipeline Risk Assessment API
 * @fileoverview Express server with TypeScript, WebSocket support, and comprehensive middleware
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { validateEnv } from './utils/validation';
// import { connectDatabase } from './config/database'; // Temporarily disabled
import { initializeWebSocket } from './services/websocket';

// Import routes
import pipelineRoutes from './routes/pipelines_simple';
import riskAssessmentRoutes from './routes/riskAssessments_simple';
import predictionRoutes from './routes/predictions';
import spatialRoutes from './routes/spatial';
import dataRoutes from './routes/data';
import dashboardRoutes from './routes/dashboard';

// Load environment variables     
dotenv.config({ path: '.env' });

// Validate environment variables  
validateEnv();

class Server {
  private app: Application;
  private httpServer;
  private io: SocketServer;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      path: '/socket.io'
    });
    this.port = parseInt(process.env.PORT || '3001');

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint (before auth)
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });
  }

  private initializeRoutes(): void {
    // Apply authentication middleware to protected routes
    this.app.use('/api', authMiddleware);

    // Debug logging for route mounting
    console.log('Mounting API routes...');
    console.log('Pipeline routes:', typeof pipelineRoutes);
    console.log('Dashboard routes:', typeof dashboardRoutes);

    // API routes
    this.app.use('/api/pipelines', pipelineRoutes);
    this.app.use('/api/risk-assessments', riskAssessmentRoutes);
    this.app.use('/api/predictions', predictionRoutes);
    this.app.use('/api/spatial', spatialRoutes);
    this.app.use('/api/data', dataRoutes);
    this.app.use('/api/dashboard', dashboardRoutes);

    console.log('All API routes mounted successfully');

    // Catch-all for undefined routes
    this.app.all('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeWebSocket(): void {
    initializeWebSocket(this.io);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      // await connectDatabase();
      logger.info('Database connection skipped for startup');

      // Start server
      this.httpServer.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private gracefulShutdown(signal: string): void {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    
    this.httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

export default Server;
