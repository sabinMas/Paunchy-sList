import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/marketplace.db');

let db = null;

export const getDb = () => {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
    db.configure('busyTimeout', 5000);
  }
  return db;
};

export const initializeDatabase = () => {
  const database = getDb();

  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Create extensions table
      database.run(`
        CREATE TABLE IF NOT EXISTS extensions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          environment TEXT NOT NULL,
          category TEXT NOT NULL,
          devtype TEXT NOT NULL,
          price REAL DEFAULT 0,
          url TEXT NOT NULL UNIQUE,
          icon TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create submissions table
      database.run(`
        CREATE TABLE IF NOT EXISTS submissions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          environment TEXT NOT NULL,
          category TEXT NOT NULL,
          devtype TEXT NOT NULL,
          price REAL DEFAULT 0,
          url TEXT NOT NULL,
          icon TEXT,
          email TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          review_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          reviewed_at DATETIME
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create visitors table
      database.run(`
        CREATE TABLE IF NOT EXISTS visitors (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          total_visits INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Initialize visitors count if not exists
      database.run(`
        INSERT OR IGNORE INTO visitors (id, total_visits)
        VALUES (1, 0)
      `, (err) => {
        if (err) reject(err);
      });

      // Check if extensions table is empty and seed with sample data
      database.get('SELECT COUNT(*) as count FROM extensions', (err, row) => {
        if (err) {
          reject(err);
        } else if (row.count === 0) {
          seedExtensions(database, resolve, reject);
        } else {
          resolve();
        }
      });
    });
  });
};

const seedExtensions = (database, resolve, reject) => {
  import('../../data/extensions.json', { assert: { type: 'json' } })
    .then(({ default: extensionsData }) => {
      const stmt = database.prepare(`
        INSERT INTO extensions (name, description, environment, category, devtype, price, url, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let completed = 0;
      const total = extensionsData.length;

      extensionsData.forEach((ext) => {
        stmt.run(
          [ext.name, ext.description, ext.environment, ext.category, ext.devtype, ext.price, ext.url, ext.icon],
          (err) => {
            if (err) reject(err);
            completed++;
            if (completed === total) {
              stmt.finalize(() => {
                console.log(`✓ Seeded ${total} extensions`);
                resolve();
              });
            }
          }
        );
      });
    })
    .catch(reject);
};

export const runAsync = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const getAsync = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allAsync = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};
