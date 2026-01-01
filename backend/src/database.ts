import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/tip_calculator.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export async function setupDatabase(): Promise<void> {
  const database = getDatabase();

  // Create calculations history table
  database.exec(`
    CREATE TABLE IF NOT EXISTS calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_amount REAL NOT NULL,
      tip_percent REAL NOT NULL,
      number_of_people INTEGER NOT NULL,
      tip_amount REAL NOT NULL,
      total_with_tip REAL NOT NULL,
      amount_per_person REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_created_at ON calculations(created_at);
  `);

  console.log('📦 Database tables created/verified');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

