import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/quotes.db');

let db;

export const initializeDatabase = () => {
  if (!db) {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      db = new Database(dbPath, { 
        verbose: console.log,
        timeout: 5000,
        fileMustExist: false
      });
      
      // Enable WAL mode for better concurrency
      db.pragma('journal_mode = WAL');
      db.pragma('busy_timeout = 5000');
      
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
          fuel_surcharge REAL,
          total_quote REAL NOT NULL,
          status TEXT DEFAULT 'created' CHECK(status IN ('created', 'sent', 'accepted')),
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lane_id) REFERENCES lanes(id)
        );

        CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
      `);

      console.log('✅ Database initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message);
      console.error('💡 Make sure no other process is accessing the database file.');
      console.error('💡 Try deleting these files if they exist:');
      console.error(`   - ${dbPath}-shm`);
      console.error(`   - ${dbPath}-wal`);
      throw error;
    }
  }
  return db;
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Database connection closed');
  }
};