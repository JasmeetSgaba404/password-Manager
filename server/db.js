import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is missing from .env file!");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const query = (text, params) => pool.query(text, params);






