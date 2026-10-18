const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Calculation helper logic unit test
test('SGPA calculation formula precision', () => {
  // Course 1: 3 credits, Grade A (10.0 pts) => 30.0
  // Course 2: 4 credits, Grade B (8.0 pts)  => 32.0
  // Total credits: 7, Total grade points: 62.0 => SGPA: 8.857... => 8.86
  const courses = [
    { credits: 3, gradePoints: 10.0 },
    { credits: 4, gradePoints: 8.0 }
  ];

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + c.credits * c.gradePoints, 0);
  const sgpa = (totalPoints / totalCredits).toFixed(2);

  assert.equal(totalCredits, 7);
  assert.equal(totalPoints, 62.0);
  assert.equal(sgpa, '8.86');
});

test('CGPA calculation across multiple semesters', () => {
  // Sem 1: 15 credits, 133.05 grade points (SGPA: 8.87)
  // Sem 2: 18 credits, 153.0 grade points (SGPA: 8.50)
  // Cumulative: 33 credits, 286.05 points => CGPA: 8.668... => 8.67
  const sem1 = { credits: 15, points: 133.05 };
  const sem2 = { credits: 18, points: 153.0 };

  const cumCredits = sem1.credits + sem2.credits;
  const cumPoints = sem1.points + sem2.points;
  const cgpa = (cumPoints / cumCredits).toFixed(2);

  assert.equal(cumCredits, 33);
  assert.equal(cgpa, '8.67');
});

test('Credit validation enforces passing grades only', () => {
  const passingGrades = ['A+', 'A', 'B+', 'B', 'C', 'D'];
  const failingGrades = ['F', 'I'];

  function earnsCredit(grade, courseCredits) {
    if (passingGrades.includes(grade)) return courseCredits;
    return 0;
  }

  assert.equal(earnsCredit('A', 4), 4);
  assert.equal(earnsCredit('B', 3), 3);
  assert.equal(earnsCredit('F', 4), 0);
  assert.equal(earnsCredit('I', 3), 0);
});

test('Role-based access rule checks', () => {
  function canApproveTranscript(role) {
    return role === 'Academic Office' || role === 'Administrator';
  }

  assert.equal(canApproveTranscript('Academic Office'), true);
  assert.equal(canApproveTranscript('Administrator'), true);
  assert.equal(canApproveTranscript('Student'), false);
  assert.equal(canApproveTranscript('Course Coordinator'), false);
});
