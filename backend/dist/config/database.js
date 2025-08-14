"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.connectDatabase = void 0;
const pg_1 = require("pg");
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'pipeline_risk_db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
            idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
            connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };
        console.log('Database config:', JSON.stringify({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password ? 'SET' : 'NOT SET'
        }, null, 2));
        this.pool = new pg_1.Pool(config);
        this.pool.on('error', (err) => {
            logger_1.logger.error('Unexpected error on idle client', err);
        });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
    async testConnection() {
        try {
            const result = await this.query('SELECT NOW()');
            logger_1.logger.info('Database connection successful', { timestamp: result.rows[0].now });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Database connection failed', error);
            return false;
        }
    }
    async createExtensions() {
        try {
            await this.query('CREATE EXTENSION IF NOT EXISTS postgis;');
            await this.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
            logger_1.logger.info('PostGIS extensions enabled');
        }
        catch (error) {
            logger_1.logger.error('Failed to create PostGIS extensions', error);
            throw error;
        }
    }
    async close() {
        await this.pool.end();
        logger_1.logger.info('Database connection pool closed');
    }
    getPool() {
        return this.pool;
    }
}
const connectDatabase = async () => {
    const database = Database.getInstance();
    const isConnected = await database.testConnection();
    if (!isConnected) {
        throw new Error('Failed to connect to database');
    }
    await database.createExtensions();
    logger_1.logger.info('Database initialized successfully');
};
exports.connectDatabase = connectDatabase;
exports.db = Database.getInstance();
//# sourceMappingURL=database.js.map