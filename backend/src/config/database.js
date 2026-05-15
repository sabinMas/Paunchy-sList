import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// On Vercel (and most serverless/PaaS), the deployed bundle is read-only.
// Only /tmp is writable at runtime, so use it when not running locally.
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const dbPath = isProduction
  ? '/tmp/marketplace.db'
  : path.join(__dirname, '../../data/marketplace.db');

let db = null;
let dbInitialized = false;
let dbError = null;
let _initPromise = null;

// Call this at the top of any route handler that needs the DB.
// Returns immediately if already initialized, otherwise waits up to 20s.
export const waitForDb = () => {
  if (dbError) return Promise.reject(new Error(`Database initialization failed: ${dbError}`));
  if (dbInitialized) return Promise.resolve();
  if (_initPromise) return _initPromise;
  // DB hasn't been kicked off yet — initialize now
  _initPromise = initializeDatabase();
  return _initPromise;
};

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
  if (dbInitialized) return Promise.resolve();
  if (_initPromise) return _initPromise;

  _initPromise = new Promise((resolve, reject) => {
    // Hard timeout: if initialization takes > 10 seconds, give up
    const hardTimeout = setTimeout(() => {
      console.error('❌ Database initialization timeout (10s)');
      dbError = 'Database initialization timed out';
      dbInitialized = true;
      reject(new Error(dbError));
    }, 10000);

    try {
      const database = getDb();

      // Simple approach: just run the create statements sequentially
      database.serialize(() => {
        let completed = 0;

        const onTableComplete = () => {
          completed++;
          if (completed === 3) {
            // All tables created, now seed if needed
            checkAndSeed();
          }
        };

        const checkAndSeed = () => {
          database.get(
            'SELECT COUNT(*) as count FROM extensions',
            (err, row) => {
              if (err) {
                console.error('Error checking extensions count:', err);
                clearTimeout(hardTimeout);
                dbError = err.message;
                dbInitialized = true;
                reject(err);
                return;
              }

              if (!row || row.count === 0) {
                console.log('Extensions table is empty, seeding...');
                seedExtensionsSequential(database, () => {
                  clearTimeout(hardTimeout);
                  dbInitialized = true;
                  console.log('✓ Database initialization complete');
                  resolve();
                });
              } else {
                console.log(`✓ Database ready: ${row.count} extensions found`);
                // Ensure visitors row exists
                database.run(
                  'INSERT OR IGNORE INTO visitors (id, total_visits) VALUES (1, 0)',
                  () => {
                    clearTimeout(hardTimeout);
                    dbInitialized = true;
                    resolve();
                  }
                );
              }
            }
          );
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
          }
          onTableComplete();
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
          }
          onTableComplete();
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
          }
          onTableComplete();
        });
      });
    } catch (error) {
      clearTimeout(hardTimeout);
      console.error('Database initialization error:', error);
      dbError = error.message;
      dbInitialized = true;
      reject(error);
    }
  });
  return _initPromise;
};

const seedExtensionsSequential = (database, callback) => {
  try {
    const extensionsPath = path.join(__dirname, '../../data/extensions.json');
    const extensionsData = JSON.parse(readFileSync(extensionsPath, 'utf-8'));

    if (!extensionsData || extensionsData.length === 0) {
      console.warn('No extensions found in extensions.json');
      callback();
      return;
    }

    console.log(`Seeding ${extensionsData.length} extensions in a single transaction...`);

    // Wrap all inserts in one transaction — orders of magnitude faster than one-by-one callbacks
    database.run('BEGIN TRANSACTION', (beginErr) => {
      if (beginErr) {
        console.error('Error starting transaction:', beginErr);
        callback();
        return;
      }

      const stmt = database.prepare(
        `INSERT OR IGNORE INTO extensions (name, description, environment, category, devtype, price, url, icon)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      for (const ext of extensionsData) {
        stmt.run([ext.name, ext.description, ext.environment, ext.category, ext.devtype, ext.price || 0, ext.url, ext.icon]);
      }

      stmt.finalize((finalizeErr) => {
        if (finalizeErr) console.error('Error finalizing statement:', finalizeErr);

        database.run('COMMIT', (commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction:', commitErr);
            database.run('ROLLBACK');
          } else {
            console.log(`✓ Seeded ${extensionsData.length} extensions`);
          }

          database.run(
            'INSERT OR IGNORE INTO visitors (id, total_visits) VALUES (1, 0)',
            (err) => {
              if (err) console.error('Error initializing visitors:', err);
              callback();
            }
          );
        });
      });
    });
  } catch (error) {
    console.error('Error reading extensions.json:', error);
    callback();
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
