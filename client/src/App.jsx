import React, { useState, useEffect } from 'react';

const DEMO_USERS = [
  { role: 'Student', email: 'student@lnmiit.ac.in', pass: 'Student@123' },
  { role: 'Course Coordinator', email: 'coordinator@lnmiit.ac.in', pass: 'Coord@123' },
  { role: 'Academic Office', email: 'academics@lnmiit.ac.in', pass: 'Academic@123' },
  { role: 'Administrator', email: 'admin@lnmiit.ac.in', pass: 'Admin@123' },
  { role: 'Institute Management', email: 'management@lnmiit.ac.in', pass: 'Manage@123' }
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('tgs_token') || '');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('tgs_user') || 'null'));
  const [academicData, setAcademicData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('tgs_token', data.token);
      localStorage.setItem('tgs_user', JSON.stringify(data.user));
      setStatusMessage(`Logged in as ${data.user.name} (${data.user.role})`);
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const logout = () => {
    setToken('');
    setCurrentUser(null);
    setAcademicData(null);
    setPendingRequests([]);
    localStorage.removeItem('tgs_token');
    localStorage.removeItem('tgs_user');
    setStatusMessage('Logged out successfully.');
  };

  const loadData = async () => {
    if (!token || !currentUser) return;

    if (currentUser.role === 'Student') {
      try {
        const res = await fetch(`/api/academic-records/${currentUser.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAcademicData(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (currentUser.role === 'Academic Office' || currentUser.role === 'Administrator') {
      try {
        const res = await fetch('/api/transcripts/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPendingRequests(data);
      } catch (err) {
        console.error(err);
      }
    }

    try {
      const notifRes = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notifData = await notifRes.json();
      setNotifications(notifData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const requestTranscript = async () => {
    try {
      const res = await fetch('/api/transcripts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type: 'Official', purpose: 'Higher Education / Placements' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusMessage(`Success: ${data.message} (ID: ${data.requestId})`);
      loadData();
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const handleDecision = async (requestId, decision) => {
    try {
      const res = await fetch('/api/transcripts/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, decision, remarks: `Processed by ${currentUser.name}` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusMessage(`Decision updated: ${data.message}`);
      loadData();
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Transcript Generation System (TGS)</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b' }}>Team T029 • CS314 Software Development Laboratory</p>
      </header>

      {statusMessage && (
        <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px' }}>
          {statusMessage}
        </div>
      )}

      {!currentUser ? (
        <section style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px' }}>Demonstration Accounts (Quick Login)</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => login(u.email, u.pass)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 500 }}
              >
                Log in as {u.role}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <strong>{currentUser.name}</strong> ({currentUser.role}) — <span>{currentUser.email}</span>
            </div>
            <button onClick={logout} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>

          {currentUser.role === 'Student' && academicData && (
            <section style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>My Academic Records</h2>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                <p><strong>Cumulative CGPA:</strong> {academicData.cgpa}</p>
                <p><strong>Total Credits Earned:</strong> {academicData.totalCredits}</p>
              </div>

              {academicData.semesters.map((sem) => (
                <div key={sem.semesterId} style={{ marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>
                    Semester {sem.semesterNumber} ({sem.academicYear}) — SGPA: {sem.sgpa} | Status: {sem.status}
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '6px 8px' }}>Course</th>
                        <th style={{ padding: '6px 8px' }}>Credits</th>
                        <th style={{ padding: '6px 8px' }}>Grade</th>
                        <th style={{ padding: '6px 8px' }}>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.grades.map((g) => (
                        <tr key={g.recordId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 8px' }}>{g.courseCode}: {g.courseName}</td>
                          <td style={{ padding: '6px 8px' }}>{g.creditsEarned}</td>
                          <td style={{ padding: '6px 8px' }}>{g.gradeObtained}</td>
                          <td style={{ padding: '6px 8px' }}>{g.gradePoints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <button
                onClick={requestTranscript}
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              >
                Request Official Transcript
              </button>
            </section>
          )}

          {(currentUser.role === 'Academic Office' || currentUser.role === 'Administrator') && (
            <section style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Pending Transcript Approval Queue</h2>
              {pendingRequests.length === 0 ? (
                <p style={{ color: '#64748b' }}>No pending transcript requests in queue.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Request ID</th>
                      <th style={{ padding: '8px' }}>Student</th>
                      <th style={{ padding: '8px' }}>Date</th>
                      <th style={{ padding: '8px' }}>Type</th>
                      <th style={{ padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.requestId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px' }}>{req.requestId}</td>
                        <td style={{ padding: '8px' }}>{req.studentName} ({req.studentEmail})</td>
                        <td style={{ padding: '8px' }}>{req.requestDate}</td>
                        <td style={{ padding: '8px' }}>{req.type}</td>
                        <td style={{ padding: '8px' }}>
                          <button
                            onClick={() => handleDecision(req.requestId, 'Approved')}
                            style={{ marginRight: '8px', background: '#16a34a', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(req.requestId, 'Rejected')}
                            style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {notifications.length > 0 && (
            <section style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px' }}>Notifications</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                {notifications.map((n) => (
                  <li key={n.notificationId} style={{ marginBottom: '6px' }}>
                    {n.message} <small style={{ color: '#94a3b8' }}>({n.timestamp})</small>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
