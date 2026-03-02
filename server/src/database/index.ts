/**
 * Database utility module.
 *
 * Sets up a connection pool, wraps basic query/transaction helpers, and
 * exposes helpers used across the application.
 */
/**
 * Database utility module.
 *
 * Sets up a connection pool, wraps basic query/transaction helpers, and
 * exposes helpers used across the application.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { PoolClient, QueryResultRow, QueryResult } from "pg";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

const isProduction = env.NODE_ENV === "production";

// configure Postgres connection pool
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProduction 
    ? { rejectUnauthorized: false} 
    : false,
  max: env.DB_POOL_SIZE,          // max connections per instance
  idleTimeoutMillis: 30000,       // close idle connections after 30s
  connectionTimeoutMillis: 2000,  // fail if cannot connect within 2s
})

// Global error listener
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error: ', err)
})

// query helper
export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[] 
): Promise<QueryResult<T>> => {
  const start = Date.now();

  try {
    const res = await pool.query<T>(text, params);
    
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn("⚠️ Slow query detected:", { 
        text, 
        duration: `${duration}ms`, 
        rows: res.rowCount 
      });
    }

    return res;
  } catch (error) {
    console.error("Database Query Failed:", { text, params });
    throw error;
  }
};

// transaction helper 
export const withTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// check database connection at startup
export const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('Database connected successfully')
  } catch (err) {
    console.error('Database connection failed: ', err)
    process.exit(1)
  }
}

// shutdown
export const closePool = async () => {
  console.log('Closing database pool...')
  await pool.end()
}

export const db = drizzle(pool, { schema, casing: 'snake_case' })