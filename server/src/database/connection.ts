import sqlite3 from 'sqlite3';
import { DatabaseConfig } from '../types/database';

export class DatabaseService {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor(config: DatabaseConfig) {
    this.dbPath = config.path;
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        throw err;
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  public async initializeTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          last_name TEXT NOT NULL,
          date_of_birth TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('Inquiry', 'Onboarding', 'Active', 'Churned')),
          street_address TEXT NOT NULL,
          city TEXT NOT NULL,
          state_province TEXT NOT NULL,
          zip_postal_code TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Error creating patients table:', err.message);
            reject(err);
          } else {
            console.log('Patients table initialized');
            resolve();
          }
        });
      });
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}
