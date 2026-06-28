import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'castleskeepprod-ro-1p.gslb4.comcast.com',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'castleskeep',
  user: process.env.DB_USER || 'sryali755',
  password: process.env.DB_PASSWORD || 'CqTFbRlB',
  ssl: false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}

export { pool };
