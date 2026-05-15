import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../backend/data/marketplace.db');
const extensionsPath = path.join(__dirname, '../../backend/data/extensions.json');

console.log('🌱 Seeding database...');
console.log(`📁 Database path: ${dbPath}`);
console.log(`📁 Extensions path: ${extensionsPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  } else {
    console.log('✓ Connected to SQLite database');
  }
});

db.serialize(() => {
  // Create extensions table
  db.run(`
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
      console.error('❌ Error creating extensions table:', err);
      process.exit(1);
    }
    console.log('✓ Created extensions table');
  });

  // Create submissions table
  db.run(`
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
      console.error('❌ Error creating submissions table:', err);
      process.exit(1);
    }
    console.log('✓ Created submissions table');
  });

  // Check if extensions table is empty and seed with sample data
  db.get('SELECT COUNT(*) as count FROM extensions', (err, row) => {
    if (err) {
      console.error('❌ Error checking extensions count:', err);
      process.exit(1);
    }

    if (row.count === 0) {
      console.log('📝 Extensions table is empty, seeding...');

      try {
        const extensionsData = JSON.parse(readFileSync(extensionsPath, 'utf-8'));

        const stmt = db.prepare(`
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
                console.error(`❌ Error inserting extension ${ext.name}:`, err);
              }
              completed++;
              if (completed === total) {
                stmt.finalize(() => {
                  console.log(`✓ Seeded ${total} extensions`);
                  db.close();
                  console.log('✅ Database seeding complete!');
                });
              }
            }
          );
        });
      } catch (error) {
        console.error('❌ Error reading extensions.json:', error);
        process.exit(1);
      }
    } else {
      console.log(`✓ Database already contains ${row.count} extensions`);
      db.close();
      console.log('✅ Database is ready!');
    }
  });
});
