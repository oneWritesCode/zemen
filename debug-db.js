import { Pool } from 'pg';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';

async function testConnection() {
  const connectionString = process.env.DATABASE_URL.replace('verify-full', 'require');
  console.log('Testing connection to:', connectionString.replace(/:[^:@]+@/, ':****@'));
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Neon PostgreSQL
    },
    max: 5, // Reduced for testing
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000, // Increased timeout
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });

  try {
    const start = Date.now();
    const client = await pool.connect();
    console.log('Connected in', Date.now() - start, 'ms');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error details:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
