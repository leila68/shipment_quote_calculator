import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool;

/**
 * PostgreSQL connection configuration
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shipment_quotes',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',

  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

/**
 * Initialize PostgreSQL connection pool and create schema
 */
export const initializeDatabase = async () => {
  if (!pool) {
    try {
      // Create connection pool
      pool = new Pool(dbConfig);

      // Test connection
      const client = await pool.connect();
      console.log('✅ Connected to PostgreSQL database');

      // Run migrations
      const migrationPath = path.join(__dirname, '../migrations/001_initial_schema.sql');

      if (fs.existsSync(migrationPath)) {
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Execute migration
        await client.query(migrationSQL);
        console.log('✅ Database schema initialized');
      } else {
        console.warn('⚠️  Migration file not found, skipping schema creation');
      }

      client.release();

      // Handle pool errors
      pool.on('error', (err) => {
        console.error('❌ Unexpected database error:', err);
        process.exit(-1);
      });

    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message);
      console.error('💡 Make sure PostgreSQL is running and credentials are correct');
      console.error('💡 Database:', dbConfig.database);
      console.error('💡 Host:', dbConfig.host);
      console.error('💡 Port:', dbConfig.port);
      console.error('💡 User:', dbConfig.user);
      throw error;
    }
  }
  return pool;
};

/**
 * Get database pool instance
 * @returns {Pool} PostgreSQL connection pool
 */
export const getDatabase = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
};

/**
 * Execute a query with parameters
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('executed query', { text, duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<PoolClient>} Database client
 */
export const getClient = async () => {
  return await pool.connect();
};

/**
 * Close database connection pool
 */
export const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database connection pool closed');
  }
};

/**
 * Check if database connection is healthy
 */
export const healthCheck = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return { healthy: true, timestamp: result.rows[0].now };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};
