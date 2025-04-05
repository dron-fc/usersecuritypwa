import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  filename: path.join(__dirname, '../../database.db'),
  driver: sqlite3.Database
};

export async function connectDB() {
  try {
    const db = await open(dbConfig);
    
    // Оптимизации
    await db.run('PRAGMA journal_mode = WAL');
    await db.run('PRAGMA foreign_keys = ON');
    await db.run('PRAGMA busy_timeout = 5000');
    
    console.log('✅ SQLite connected');
    return db;
  } catch (err) {
    console.error('❌ SQLite connection error:', err.message);
    process.exit(1);
  }
}
