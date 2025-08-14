/**
 * Database configuration and connection
 * @fileoverview PostgreSQL with PostGIS connection setup
 */

import { Pool, PoolConfig } from 'pg';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    const config: PoolConfig = {
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

    this.pool = new Pool(config);

    // Handle pool errors
    this.pool.on('error', (err: Error) => {
      logger.error('Unexpected error on idle client', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      logger.info('Database connection successful', { timestamp: result.rows[0].now });
      return true;
    } catch (error) {
      logger.error('Database connection failed', error);
      return false;
    }
  }

  public async createExtensions(): Promise<void> {
    try {
      // Enable PostGIS extension
      await this.query('CREATE EXTENSION IF NOT EXISTS postgis;');
      await this.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
      logger.info('PostGIS extensions enabled');
    } catch (error) {
      logger.error('Failed to create PostGIS extensions', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection pool closed');
  }

  public getPool(): Pool {
    return this.pool;
  }
}

export const connectDatabase = async (): Promise<void> => {
  const database = Database.getInstance();
  
  const isConnected = await database.testConnection();
  if (!isConnected) {
    throw new Error('Failed to connect to database');
  }

  // Create extensions
  await database.createExtensions();
  
  logger.info('Database initialized successfully');
};

export const db = Database.getInstance();
