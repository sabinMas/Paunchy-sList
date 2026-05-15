import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/marketplace.db');

let db = null;
let dbInitialized = false;

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
  // If already initialized, resolve immediately
  if (dbInitialized) {
    console.log('Database already initialized, skipping');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // Hard timeout: if initialization takes > 15 seconds, give up
    const hardTimeout = setTimeout(() => {
      console.error('❌ Database initialization timeout (15s) - marking as done anyway');
      dbInitialized = true; // Mark as initialized anyway to prevent retries
      resolve(); // Resolve instead of reject to allow server to continue
    }, 15000);

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
                dbInitialized = true;
                resolve();
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
      dbInitialized = true;
      resolve(); // Don't reject - allow server to continue
    }
  });
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

    console.log(`Seeding ${extensionsData.length} extensions...`);
    let index = 0;
    let inserted = 0;

    const insertNext = () => {
      if (index >= extensionsData.length) {
        console.log(`✓ Seeded ${inserted}/${extensionsData.length} extensions`);
        // Ensure visitors row exists
        database.run(
          'INSERT OR IGNORE INTO visitors (id, total_visits) VALUES (1, 0)',
          (err) => {
            if (err) console.error('Error initializing visitors:', err);
            callback();
          }
        );
        return;
      }

      const ext = extensionsData[index];
      index++;

      database.run(
        `INSERT INTO extensions (name, description, environment, category, devtype, price, url, icon)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ext.name, ext.description, ext.environment, ext.category, ext.devtype, ext.price, ext.url, ext.icon],
        (err) => {
          if (!err) {
            inserted++;
            if (inserted % 10 === 0) {
              console.log(`  Seeded ${inserted}/${extensionsData.length}...`);
            }
          } else if (!err.message.includes('UNIQUE constraint')) {
            console.error(`Error inserting ${ext.name}:`, err.message);
          }
          // Continue with next
          insertNext();
        }
      );
    };

    insertNext();
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
