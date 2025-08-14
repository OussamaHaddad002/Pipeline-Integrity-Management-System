"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const validation_1 = require("./utils/validation");
const websocket_1 = require("./services/websocket");
const pipelines_1 = __importDefault(require("./routes/pipelines"));
const riskAssessments_1 = __importDefault(require("./routes/riskAssessments"));
const predictions_1 = __importDefault(require("./routes/predictions"));
const spatial_1 = __importDefault(require("./routes/spatial"));
const data_1 = __importDefault(require("./routes/data"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
dotenv_1.default.config({ path: '.env' });
(0, validation_1.validateEnv)();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
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
    initializeMiddleware() {
        this.app.use((0, helmet_1.default)({
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
        this.app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
            optionsSuccessStatus: 200
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: process.env.NODE_ENV === 'production' ? 100 : 1000,
            message: {
                error: 'Too many requests from this IP, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use('/api/', limiter);
        if (process.env.NODE_ENV !== 'test') {
            this.app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
        }
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: process.env.npm_package_version || '1.0.0'
            });
        });
    }
    initializeRoutes() {
        this.app.use('/api', auth_1.authMiddleware);
        this.app.use('/api/pipelines', pipelines_1.default);
        this.app.use('/api/risk-assessments', riskAssessments_1.default);
        this.app.use('/api/predictions', predictions_1.default);
        this.app.use('/api/spatial', spatial_1.default);
        this.app.use('/api/data', data_1.default);
        this.app.use('/api/dashboard', dashboard_1.default);
        this.app.all('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: `Route ${req.originalUrl} not found`
            });
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    initializeWebSocket() {
        (0, websocket_1.initializeWebSocket)(this.io);
    }
    async start() {
        try {
            logger_1.logger.info('Database connection skipped for startup');
            this.httpServer.listen(this.port, () => {
                logger_1.logger.info(`Server is running on port ${this.port}`);
                logger_1.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
                logger_1.logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
            });
            process.on('SIGTERM', this.gracefulShutdown.bind(this));
            process.on('SIGINT', this.gracefulShutdown.bind(this));
        }
        catch (error) {
            logger_1.logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }
    gracefulShutdown(signal) {
        logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
        this.httpServer.close(() => {
            logger_1.logger.info('HTTP server closed');
            process.exit(0);
        });
        setTimeout(() => {
            logger_1.logger.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 30000);
    }
}
if (require.main === module) {
    const server = new Server();
    server.start();
}
exports.default = Server;
//# sourceMappingURL=server.js.map