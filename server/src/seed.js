const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  console.log('Seeding database with demo data...');

  const passwordStudent = await bcrypt.hash('Student@123', 10);
  const passwordCoord = await bcrypt.hash('Coord@123', 10);
  const passwordAcademic = await bcrypt.hash('Academic@123', 10);
  const passwordAdmin = await bcrypt.hash('Admin@123', 10);
  const passwordManagement = await bcrypt.hash('Manage@123', 10);

  db.serialize(() => {
    // Clear existing data
    db.run('DELETE FROM notifications');
    db.run('DELETE FROM audit_logs');
    db.run('DELETE FROM transcript_requests');
    db.run('DELETE FROM grade_records');
    db.run('DELETE FROM semester_records');
    db.run('DELETE FROM courses');
    db.run('DELETE FROM users');

    // 1. Seed Users
    const insertUser = db.prepare(`
      INSERT INTO users (userId, name, email, passwordHash, role, accountStatus, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    insertUser.run('U-001', 'Ayush Agarwal', 'student@lnmiit.ac.in', passwordStudent, 'Student', 'Active');
    insertUser.run('U-002', 'Dr. Coordinator', 'coordinator@lnmiit.ac.in', passwordCoord, 'Course Coordinator', 'Active');
    insertUser.run('U-003', 'Jane Doe (Academic Staff)', 'academics@lnmiit.ac.in', passwordAcademic, 'Academic Office', 'Active');
    insertUser.run('U-004', 'System Admin', 'admin@lnmiit.ac.in', passwordAdmin, 'Administrator', 'Active');
    insertUser.run('U-005', 'Dean Academics', 'management@lnmiit.ac.in', passwordManagement, 'Institute Management', 'Active');
    insertUser.finalize();

    // 2. Seed Courses
    const insertCourse = db.prepare(`
      INSERT INTO courses (courseCode, courseName, credits, department, courseType)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertCourse.run('CS314', 'Software Development Laboratory', 3, 'CSE', 'Core');
    insertCourse.run('CS301', 'Computer Networks', 4, 'CSE', 'Core');
    insertCourse.run('CS303', 'Theory of Computation', 4, 'CSE', 'Core');
    insertCourse.run('CS305', 'Database Management Systems', 4, 'CSE', 'Core');
    insertCourse.run('EC307', 'Digital Signal Processing', 3, 'ECE', 'Elective');
    insertCourse.finalize();

    // 3. Seed Semester Record (Semester 1 - Completed & Approved)
    const insertSemester = db.prepare(`
      INSERT INTO semester_records (semesterId, studentId, semesterNumber, academicYear, totalCredits, sgpa, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertSemester.run('SEM-001', 'U-001', 1, '2025-2026', 15, 8.87, 'Approved');
    insertSemester.finalize();

    // 4. Seed Grade Records for Semester 1
    const insertGrade = db.prepare(`
      INSERT INTO grade_records (recordId, semesterId, studentId, courseCode, gradeObtained, gradePoints, creditsEarned, verificationStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertGrade.run('GR-001', 'SEM-001', 'U-001', 'CS314', 'A', 10.0, 3, 'Approved');
    insertGrade.run('GR-002', 'SEM-001', 'U-001', 'CS301', 'B', 8.0, 4, 'Approved');
    insertGrade.run('GR-003', 'SEM-001', 'U-001', 'CS303', 'A', 10.0, 4, 'Approved');
    insertGrade.run('GR-004', 'SEM-001', 'U-001', 'CS305', 'B', 8.0, 4, 'Approved');
    insertGrade.finalize();

    // 5. Seed Initial Audit Log
    db.run(`
      INSERT INTO audit_logs (logId, userId, actionPerformed, entityAffected, entityId, changesMade, timestamp)
      VALUES ('LOG-001', 'U-003', 'SEED_VERIFY', 'SemesterRecord', 'SEM-001', 'Seeded initial verified semester 1 grades', datetime('now'))
    `);

    // 6. Seed Notification
    db.run(`
      INSERT INTO notifications (notificationId, recipientId, notificationType, message, timestamp, readStatus)
      VALUES ('NT-001', 'U-001', 'INFO', 'Welcome to the Transcript Generation System. Semester 1 records are available.', datetime('now'), 0)
    `);

    console.log('Seeding completed successfully!');
  });
}

seed();
