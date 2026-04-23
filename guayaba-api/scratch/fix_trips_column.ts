import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixDb() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    console.log('Adding passenger_count column to trips table...');
    await client.query('ALTER TABLE trips ADD COLUMN IF NOT EXISTS passenger_count INTEGER DEFAULT 1;');
    
    console.log('Success! Column added.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

fixDb();
