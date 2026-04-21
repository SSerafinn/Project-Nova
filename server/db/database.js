const { Database } = require('node-sqlite3-wasm');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'notequest.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// node-sqlite3-wasm may leave an empty "<db>.lock" directory after a crash; it blocks reopening.
const lockDir = `${DB_PATH}.lock`;
try {
  if (fs.existsSync(lockDir) && fs.statSync(lockDir).isDirectory()) {
    fs.rmdirSync(lockDir);
  }
} catch {
  // Another process may own the lock; Database() will surface a clear error.
}

const db = new Database(DB_PATH);

db.exec('PRAGMA busy_timeout = 5000');

// Enable foreign key enforcement (SQLite disables it by default)
db.exec('PRAGMA foreign_keys = ON');

// Initialize schema on first run
const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);

// Migration: add folder_id to sessions if it doesn't exist yet
try {
  db.exec('ALTER TABLE sessions ADD COLUMN folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL');
} catch {
  // Column already exists — safe to ignore
}

/**
 * Synchronous transaction wrapper — equivalent to better-sqlite3's db.transaction(fn)().
 * Runs fn() inside BEGIN/COMMIT, rolls back and re-throws on any error.
 */
function runTransaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

module.exports = { db, runTransaction };
