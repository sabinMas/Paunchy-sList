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
    // Check if tables exist first (faster than creating)
    database.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('extensions', 'submissions', 'visitors')",
      [],
      (err, tables) => {
        if (err) {
          console.error('Error checking tables:', err);
          return reject(err);
        }

        const existingTables = tables.map(t => t.name);
        const needsSetup = existingTables.length < 3;

        if (!needsSetup) {
          // All tables exist, just ensure visitors row exists
          database.run(
            'INSERT OR IGNORE INTO visitors (id, total_visits) VALUES (1, 0)',
            (err) => {
              if (err) {
                console.error('Error initializing visitors:', err);
              }
              console.log('✓ Database ready (tables exist)');
              resolve();
            }
          );
          return;
        }

        // Create missing tables
        database.serialize(() => {
          let completed = 0;
          const onComplete = () => {
            completed++;
            if (completed === 3) {
              // Check if extensions table is empty
              database.get(
                'SELECT COUNT(*) as count FROM extensions',
                (err, row) => {
                  if (err) {
                    console.error('Error checking extensions count:', err);
                    return reject(err);
                  }
                  if (!row || row.count === 0) {
                    console.log('Seeding extensions...');
                    seedExtensions(database, resolve, reject);
                  } else {
                    console.log(`✓ Database ready with ${row.count} extensions`);
                    resolve();
                  }
                }
              );
            }
          };

          // Create extensions table
          if (!existingTables.includes('extensions')) {
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
            `, onComplete);
          } else {
            onComplete();
          }

          // Create submissions table
          if (!existingTables.includes('submissions')) {
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
            `, onComplete);
          } else {
            onComplete();
          }

          // Create visitors table
          if (!existingTables.includes('visitors')) {
            database.run(`
              CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                total_visits INTEGER DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `, onComplete);
          } else {
            onComplete();
          }
        });
      }
    );
  });
};

const seedExtensions = (database, resolve, reject) => {
  try {
    const extensionsPath = path.join(__dirname, '../../data/extensions.json');
    const extensionsData = JSON.parse(readFileSync(extensionsPath, 'utf-8'));

    console.log(`Seeding ${extensionsData.length} extensions...`);

    const stmt = database.prepare(`
      INSERT INTO extensions (name, description, environment, category, devtype, price, url, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let completed = 0;
    const total = extensionsData.length;
    let hasError = false;

    const checkComplete = () => {
      if (completed === total && !hasError) {
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
    };

    extensionsData.forEach((ext) => {
      stmt.run(
        [ext.name, ext.description, ext.environment, ext.category, ext.devtype, ext.price, ext.url, ext.icon],
        (err) => {
          if (err && !hasError) {
            console.error(`Error inserting extension ${ext.name}:`, err);
            hasError = true;
            stmt.finalize();
            reject(err);
          } else if (!hasError) {
            completed++;
            checkComplete();
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
