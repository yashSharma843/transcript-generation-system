const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_academic_t029';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Transcript Generation System API' });
});

// Middleware: Verify JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Route: User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.userId, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Route: Get Academic Records (Student or Academic Office)
app.get('/api/academic-records/:studentId', authenticateToken, (req, res) => {
  const studentId = req.params.studentId;

  // Authorization check: Students can only view their own records
  if (req.user.role === 'Student' && req.user.userId !== studentId) {
    return res.status(403).json({ error: 'Unauthorized access to student record' });
  }

  const query = `
    SELECT sr.semesterId, sr.semesterNumber, sr.academicYear, sr.totalCredits, sr.sgpa, sr.status,
           gr.recordId, gr.courseCode, c.courseName, gr.gradeObtained, gr.gradePoints, gr.creditsEarned, gr.verificationStatus
    FROM semester_records sr
    LEFT JOIN grade_records gr ON sr.semesterId = gr.semesterId
    LEFT JOIN courses c ON gr.courseCode = c.courseCode
    WHERE sr.studentId = ?
    ORDER BY sr.semesterNumber ASC
  `;

  db.all(query, [studentId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.json({ semesters: [], cgpa: 0.0, totalCredits: 0 });

    // Group rows by semester
    const semestersMap = {};
    let totalGradePoints = 0;
    let totalEarnedCredits = 0;

    rows.forEach((row) => {
      if (!semestersMap[row.semesterId]) {
        semestersMap[row.semesterId] = {
          semesterId: row.semesterId,
          semesterNumber: row.semesterNumber,
          academicYear: row.academicYear,
          totalCredits: row.totalCredits,
          sgpa: row.sgpa,
          status: row.status,
          grades: []
        };
      }
      if (row.recordId) {
        semestersMap[row.semesterId].grades.push({
          recordId: row.recordId,
          courseCode: row.courseCode,
          courseName: row.courseName,
          gradeObtained: row.gradeObtained,
          gradePoints: row.gradePoints,
          creditsEarned: row.creditsEarned,
          verificationStatus: row.verificationStatus
        });
        totalGradePoints += row.gradePoints * row.creditsEarned;
        totalEarnedCredits += row.creditsEarned;
      }
    });

    const cgpa = totalEarnedCredits > 0 ? (totalGradePoints / totalEarnedCredits).toFixed(2) : 0.0;

    res.json({
      studentId,
      cgpa: parseFloat(cgpa),
      totalCredits: totalEarnedCredits,
      semesters: Object.values(semestersMap)
    });
  });
});

// Route: Submit Transcript Request (Student)
app.post('/api/transcripts/request', authenticateToken, (req, res) => {
  if (req.user.role !== 'Student') {
    return res.status(403).json({ error: 'Only students can request transcripts' });
  }

  const { type, purpose } = req.body;
  const studentId = req.user.userId;
  const requestId = 'TR-' + Date.now();
  const requestDate = new Date().toISOString().split('T')[0];

  const stmt = db.prepare(`
    INSERT INTO transcript_requests (requestId, studentId, requestDate, type, purpose, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `);

  stmt.run(requestId, studentId, requestDate, type || 'Official', purpose || '', function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Create Audit Log
    db.run(`
      INSERT INTO audit_logs (logId, userId, actionPerformed, entityAffected, entityId, timestamp)
      VALUES (?, ?, 'REQUEST_TRANSCRIPT', 'TranscriptRequest', ?, datetime('now'))
    `, ['LOG-' + Date.now(), studentId, requestId]);

    res.json({ message: 'Transcript requested successfully', requestId });
  });
});

// Route: Get Pending Transcript Requests (Academic Office)
app.get('/api/transcripts/pending', authenticateToken, (req, res) => {
  if (req.user.role !== 'Academic Office' && req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const query = `
    SELECT tr.*, u.name as studentName, u.email as studentEmail
    FROM transcript_requests tr
    JOIN users u ON tr.studentId = u.userId
    WHERE tr.status = 'Pending'
    ORDER BY tr.requestDate DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route: Approve or Reject Transcript Request (Academic Office)
app.post('/api/transcripts/decide', authenticateToken, (req, res) => {
  if (req.user.role !== 'Academic Office' && req.user.role !== 'Administrator') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { requestId, decision, remarks } = req.body;
  if (!['Approved', 'Rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Decision must be Approved or Rejected' });
  }

  const watermarkStatus = decision === 'Approved' ? 'Official Watermark Applied' : 'None';
  const approvalDate = new Date().toISOString().split('T')[0];

  db.run(`
    UPDATE transcript_requests
    SET status = ?, approvedBy = ?, approvalDate = ?, watermarkStatus = ?
    WHERE requestId = ?
  `, [decision, req.user.name, approvalDate, watermarkStatus, requestId], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Log in Audit Trail
    db.run(`
      INSERT INTO audit_logs (logId, userId, actionPerformed, entityAffected, entityId, changesMade, timestamp)
      VALUES (?, ?, ?, 'TranscriptRequest', ?, ?, datetime('now'))
    `, ['LOG-' + Date.now(), req.user.userId, `TRANSCRIPT_${decision.toUpperCase()}`, requestId, remarks || '']);

    res.json({ message: `Transcript request marked as ${decision}` });
  });
});

// Route: User Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM notifications WHERE recipientId = ? ORDER BY timestamp DESC',
    [req.user.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Auto-seed on fresh start if database has no users
db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
  if (!err && row && row.count === 0) {
    console.log('No users found in database. Running initial seed...');
    require('./seed');
  }
});

app.listen(PORT, () => {
  console.log(`TGS Express server listening on http://localhost:${PORT}`);
});
