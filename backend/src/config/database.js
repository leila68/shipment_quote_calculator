import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/quotes.db');

export const db = new Database(dbPath);

export function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS lanes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin_city TEXT NOT NULL,
      origin_province TEXT NOT NULL,
      origin_postal TEXT NOT NULL,
      destination_city TEXT NOT NULL,
      destination_province TEXT NOT NULL,
      destination_postal TEXT NOT NULL,
      base_rate REAL NOT NULL,
      distance_km REAL NOT NULL,
      transit_days INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS equipment_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_type TEXT UNIQUE NOT NULL,
      multiplier REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lane_id INTEGER,
      equipment_type TEXT NOT NULL,
      total_weight REAL NOT NULL,
      pickup_date TEXT NOT NULL,
      base_rate REAL NOT NULL,
      equipment_multiplier REAL NOT NULL,
      weight_surcharge REAL NOT NULL,
      total_quote REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lane_id) REFERENCES lanes(id)
    );

    CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
  `);

  console.log('✅ Database initialized');
}