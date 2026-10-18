const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../transcript_system.db');

// Ensure database directory exists if running in /tmp or custom path
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      userId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL,
      accountStatus TEXT DEFAULT 'Active',
      lastLogin TEXT
    )
  `);

  // Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      courseCode TEXT PRIMARY KEY,
      courseName TEXT NOT NULL,
      credits INTEGER NOT NULL,
      department TEXT NOT NULL,
      courseType TEXT DEFAULT 'Core'
    )
  `);

  // Semester Records table
  db.run(`
    CREATE TABLE IF NOT EXISTS semester_records (
      semesterId TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      semesterNumber INTEGER NOT NULL,
      academicYear TEXT NOT NULL,
      totalCredits INTEGER DEFAULT 0,
      sgpa REAL DEFAULT 0.0,
      status TEXT DEFAULT 'Draft',
      FOREIGN KEY (studentId) REFERENCES users(userId)
    )
  `);

  // Grade Records table
  db.run(`
    CREATE TABLE IF NOT EXISTS grade_records (
      recordId TEXT PRIMARY KEY,
      semesterId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      courseCode TEXT NOT NULL,
      gradeObtained TEXT NOT NULL,
      gradePoints REAL NOT NULL,
      creditsEarned INTEGER NOT NULL,
      verificationStatus TEXT DEFAULT 'Draft',
      FOREIGN KEY (semesterId) REFERENCES semester_records(semesterId),
      FOREIGN KEY (studentId) REFERENCES users(userId),
      FOREIGN KEY (courseCode) REFERENCES courses(courseCode)
    )
  `);

  // Transcript Requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS transcript_requests (
      requestId TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      requestDate TEXT NOT NULL,
      type TEXT NOT NULL,
      purpose TEXT,
      status TEXT DEFAULT 'Pending',
      approvedBy TEXT,
      approvalDate TEXT,
      watermarkStatus TEXT DEFAULT 'None',
      filePath TEXT,
      FOREIGN KEY (studentId) REFERENCES users(userId)
    )
  `);

  // Audit Logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      logId TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      actionPerformed TEXT NOT NULL,
      entityAffected TEXT NOT NULL,
      entityId TEXT NOT NULL,
      changesMade TEXT,
      timestamp TEXT NOT NULL
    )
  `);

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      notificationId TEXT PRIMARY KEY,
      recipientId TEXT NOT NULL,
      notificationType TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      readStatus INTEGER DEFAULT 0,
      FOREIGN KEY (recipientId) REFERENCES users(userId)
    )
  `);
});

module.exports = db;
