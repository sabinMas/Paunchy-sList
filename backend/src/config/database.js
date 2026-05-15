import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

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
      let tablesCreated = 0;
      let tablesTotal = 3;

      const checkAllTablesCreated = () => {
        tablesCreated++;
        if (tablesCreated === tablesTotal) {
          // All tables created, now check if we need to seed
          database.get('SELECT COUNT(*) as count FROM extensions', (err, row) => {
            if (err) {
              console.error('Error checking extensions count:', err);
              reject(err);
            } else if (!row || row.count === 0) {
              console.log('Extensions table empty, seeding...');
              seedExtensions(database, resolve, reject);
            } else {
              console.log(`Database ready with ${row.count} extensions`);
              // Initialize visitors if not exists
              database.run(`
                INSERT OR IGNORE INTO visitors (id, total_visits)
                VALUES (1, 0)
              `, (err) => {
                if (err) {
                  console.error('Error initializing visitors:', err);
                }
                resolve();
              });
            }
          });
        }
      };

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
        if (err) {
          console.error('Error creating extensions table:', err);
          reject(err);
        } else {
          checkAllTablesCreated();
        }
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
        if (err) {
          console.error('Error creating submissions table:', err);
          reject(err);
        } else {
          checkAllTablesCreated();
        }
      });

      // Create visitors table
      database.run(`
        CREATE TABLE IF NOT EXISTS visitors (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          total_visits INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating visitors table:', err);
          reject(err);
        } else {
          checkAllTablesCreated();
        }
      });
    });
  });
};

const seedExtensions = (database, resolve, reject) => {
  try {
    const extensionsPath = path.join(__dirname, '../../data/extensions.json');
    const extensionsData = JSON.parse(readFileSync(extensionsPath, 'utf-8'));

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
          if (err) {
            console.error(`Error inserting extension ${ext.name}:`, err);
            reject(err);
          }
          completed++;
          if (completed === total) {
            stmt.finalize(() => {
              console.log(`✓ Seeded ${total} extensions`);
              // Initialize visitors count after seeding
              database.run(`
                INSERT OR IGNORE INTO visitors (id, total_visits)
                VALUES (1, 0)
              `, (err) => {
                if (err) {
                  console.error('Error initializing visitors:', err);
                }
                resolve();
              });
            });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error reading extensions.json:', error);
    reject(error);
  }
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
