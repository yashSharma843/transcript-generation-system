# React application (Assignment 05)

The implementation uses React 19 and Vite, an Express API and SQLite. The API implements the semester grade verification, automated SGPA/CGPA calculations, transcript approval workflows, and audit logging defined in Assignment 05. The Python prototype remains available separately.

## Run locally

Use Node.js 22 or newer. From the repository root:

```powershell
npm install --prefix server
npm install --prefix client
npm start --prefix server
```

In a second terminal:

```powershell
npm run dev --prefix client
```

Open http://localhost:5173. The API runs on port 8000, so stop any Python server using that port first. On an empty database, the Node server creates sample accounts and verified academic data automatically. Existing data is preserved. `npm run seed --prefix server` resets ALL data to the demo baseline; use only when you intend to reset it.

## Demonstration accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@lnmiit.ac.in | Student@123 |
| Course Coordinator | coordinator@lnmiit.ac.in | Coord@123 |
| Academic Office | academics@lnmiit.ac.in | Academic@123 |
| Administrator | admin@lnmiit.ac.in | Admin@123 |
| Institute Management | management@lnmiit.ac.in | Manage@123 |

Quick-login buttons use these seeded credentials. This is an academic demonstration; remove demo login and configure a deployment JWT secret before deploying publicly.

## Demonstrate the workflow

1. Course Coordinator logs in, selects an assigned course, enters letter grades for enrolled students, and submits them, moving records from Draft to Submitted.
2. Academic Office opens the grade verification queue, reviews submitted semester records, and verifies them (UnderVerification -> Verified -> Approved).
3. The Calculation Engine automatically computes earned credits based on passing grades, recalculates the Semester Grade Point Average (SGPA), and updates the Cumulative Grade Point Average (CGPA) accurate to two decimal places.
4. Student logs in, navigates to "My Academic Records", views semester-wise grades, credits, SGPA, and cumulative CGPA, and submits an Official or Unofficial transcript request.
5. The system validates record completeness and places the request into the Academic Office pending queue.
6. Academic Office inspects the transcript preview, verifies student eligibility, and selects Approve (or Reject with mandatory comments).
7. Upon approval, the system applies the official institutional watermark to the PDF, records the approver ID and timestamp in the audit trail, and generates an in-app notification.
8. Student receives the notification and downloads the verified, watermarked PDF transcript directly from their dashboard.
9. Administrator manages user roles, verifies the grading scheme points, and inspects immutable audit logs.
10. Institute Management accesses batch-wise analytics and CGPA distribution reports.

## Validation

```powershell
npm run build --prefix client
npm test --prefix server
```

Tests use an in-memory database and never reset the development database. Regression coverage includes passing-grade credit validation, SGPA/CGPA formula precision, role-based route guards, incomplete-record request blocking, official watermark application, and audit trail generation.

## Architecture and scope

React calls `/api` through Vite's proxy. Express routes delegate to RecordManagementEngine, CalculationEngine, TranscriptGenerator, AuthenticationManager, AuditLogger, and NotificationService. Transaction boundaries keep grade states, GPA recalculations, approval logs, and notification dispatches consistent when an operation fails. SQLite stores semester records, transcript requests, and generated document metadata.

Institutional SSO, external email/SMS dispatch, payment gateways for transcript fees, and ERP write-back are external integrations and are not connected. Master-data configuration covers grading schemes, courses, and student profiles. Batch transcript generation and external university degree-verification integrations remain outside this implementation.

Dependency audit: compatible npm audit fixes were applied. Remaining advisories require major dependency upgrades; review them before a public deployment.
