# Transcript Generation System (TGS)

[![Python CI](https://github.com/yashSharma843/transcript-generation-system/actions/workflows/ci.yml/badge.svg)](https://github.com/yashSharma843/transcript-generation-system/actions/workflows/ci.yml)
![Course](https://img.shields.io/badge/Course-CS314-blue)
![Team](https://img.shields.io/badge/Team-T029-green)
![Assignments](https://img.shields.io/badge/Assignments-01%20through%2005-purple)

A role-based platform for managing verified semester-wise academic records, automating course credit, SGPA and CGPA calculations, and generating official watermarked academic transcripts. This repository contains documentation through **Assignment 05**, the **React 19 + Express + SQLite application**, and the earlier **Python/FastAPI prototype**.

## Team details

**Course:** CS314 — Software Development Laboratory, The LNM Institute of Information Technology, Jaipur
**Team ID:** T029
**Development model:** Agile — Iterative and Incremental Development

| Member | Roll number | Responsibility |
| --- | --- | --- |
| Daksh Kedia | 24UCC174 | Project / Requirement Lead — trace classes, associations and collaboration workflows back to functional requirements and business rules. |
| Yash Sharma | 24UCC172 | Design / Architecture Lead — design the UML class architecture, structural relationships and multi-tier system component diagram. |
| Ayush Agarwal | 24UCC171 | Development Lead — identify core domain classes and operations, model object snapshots and state lifecycles, and coordinate implementation. |
| Jatin Dangi | 24UCC173 | Testing & Documentation Lead — verify architectural consistency across models, validate workflows and maintain repository documentation. |

## Assignment deliverables through Assignment 05

| Assignment | Focus | Deliverable |
| --- | --- | --- |
| **01** | Project identification and initial definition | [Project Definition](docs/assignment-01/Project-Definition.md) |
| **02** | Requirements specification and traceability | [SRS v1.0](docs/requirements/SRS-v1.0.md) · [System Context](docs/requirements/diagrams/System-Context.png) |
| **03** | Scenarios, use-case and activity modelling | [Scenario, Use Case and Activity Modelling](docs/assignment-03/Scenario-Use-Case-Activity-Modelling.md) |
| **04** | Classes, object diagram and relationships | [Classes, Object Diagram and Relationships](docs/assignment-04/Classes-Object-Diagram-Relationships.md) |
| **05** | Collaboration/communication, state and component modelling | [Collaboration, State and Component Modelling](docs/assignment-05/Collaboration-State-Component-Modelling.md) · [Assignment 01–05 PDF](T-029.pdf) |

The modelling documents carry forward **UC-007 — View Academic Records**, **UC-010 — Request Transcript**, and **UC-011 — Approve Transcript**. Assignment 05 describes their collaborating objects, semester record and transcript request state transitions, and component responsibilities.

## Problem and stakeholders

Generating academic transcripts manually relies on fragmented spreadsheets, paper files and scanned mark sheets across semesters, introducing calculation errors, formatting inconsistencies and student delays. TGS centralizes verified semester grade records, automates earned credit, SGPA and CGPA calculations, and enforces an approval workflow before issuing official PDF transcripts.

![System Context](docs/requirements/diagrams/System-Context.png)

| Stakeholder | Responsibility |
| --- | --- |
| Students | Authenticate, view semester-wise academic records, SGPA and CGPA, request transcripts and download approved PDF transcripts |
| Academic / Examination Office | Upload and verify semester-wise grade records, review transcript previews and approve or reject transcript requests |
| Course Coordinators / Faculty | Submit and confirm course grade data for assigned courses within permitted timelines |
| Administrator | Manage user accounts and roles, configure the grading scheme and credit structure, and inspect the audit trail |
| Institute Management | Monitor consolidated academic performance, SGPA/CGPA distributions and transcript generation statistics |

## Assignment 05 application

The React application provides:

- JWT authentication and server-side role-based access control across Student, Course Coordinator, Academic Office Staff, Administrator and Management roles.
- Predefined grading scheme mapping (`A+` through `F`) with automatic credit validation so only passing grades earn credits.
- Automated Semester Grade Point Average (SGPA = Σ(Grade Points × Credits) / Σ(Credits)) and Cumulative Grade Point Average (CGPA) calculation accurate to two decimal places.
- Semester record lifecycle management across `Draft`, `Submitted`, `UnderVerification`, `Verified`, `Approved` and `Rejected` states.
- Student transcript request workflow (`Official` / `Unofficial`) with completeness and verification checks.
- Academic Office approval queue with transcript preview, eligibility verification, rejection with required reason, and official approval.
- Standardized PDF transcript generation with official status watermark and download support.
- Persistent notifications for grade submissions, pending approvals and transcript readiness.
- Comprehensive audit logging of all grade entries, record modifications and transcript approvals with user identity and timestamp.

### Workflow demonstration

1. **Course Coordinator** submits course grades for enrolled students, moving semester records from `Draft` to `Submitted`.
2. **Academic Office Staff** reviews and verifies the submitted grade records (`UnderVerification` → `Verified` → `Approved`), triggering automatic SGPA and CGPA recalculation.
3. **Student** views semester-wise grades, earned credits, SGPA and cumulative CGPA, and submits an official transcript request (`UC-007`, `UC-010`).
4. **System** validates record completeness, calculates final SGPA/CGPA, generates a preliminary transcript and places the request in the Academic Office approval queue.
5. **Academic Office Staff** previews the transcript (`UC-011`), verifies eligibility and approves (or rejects with comments).
6. **System** marks the transcript `Approved`, applies the official watermark to the PDF, logs the action in the audit trail and notifies the **Student** for download.

### Architecture

The React/Vite client calls `/api` through the development proxy. Express routes delegate to `RecordManagementEngine`, `CalculationEngine`, `TranscriptGenerator`, `AuthenticationManager`, `AuditLogger` and `NotificationService`. SQLite persists demo data, including grade records, transcript requests and generated PDF metadata. Database transactions ensure grade verifications, GPA recalculations, transcript approvals, notifications and audit logs remain consistent.

The broader SRS domain model covers `User`, `Student`, `AcademicOfficeStaff`, `Course`, `GradeRecord`, `SemesterRecord`, `AcademicHistory`, `TranscriptRequest`, `TranscriptPDF`, `AuditLog` and `Notification`. Assignment 04 describes class/object relationships; Assignment 05 describes collaboration, states and components.

## Run the React application locally

**Prerequisites:** Node.js 22 or newer, npm and Git.

```powershell
git clone [https://github.com/yashSharma843/transcript-generation-system.git](https://github.com/yashSharma843/transcript-generation-system.git)
cd transcript-generation-system
npm install --prefix server
npm install --prefix client
npm start --prefix server
```

In a second terminal, from the repository root:

```powershell
npm run dev --prefix client
```

Open **http://localhost:5173**. The API runs on **port 8000**; stop the Python server first if it uses that port. An empty database is seeded automatically, and existing data is preserved.

To deliberately reset **all application data** to the demo baseline:

```powershell
npm run seed --prefix server
```

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@lnmiit.ac.in | Student@123 |
| Course Coordinator | coordinator@lnmiit.ac.in | Coord@123 |
| Academic Office | academics@lnmiit.ac.in | Academic@123 |
| Administrator | admin@lnmiit.ac.in | Admin@123 |
| Management | management@lnmiit.ac.in | Manage@123 |

Quick-login buttons use these credentials for academic demonstration.

### Build and validation

```powershell
npm run build --prefix client
npm test --prefix server
```

Server tests use an in-memory database without resetting development data. Regression coverage includes SGPA/CGPA accuracy, passing-grade credit validation, role-based access restrictions, incomplete-record transcript blocking, official watermark application and audit log creation.

The existing GitHub Actions workflow runs the **Python pytest suite**. Run the React build and Node tests separately using the commands above.

See [REACT-README.md](REACT-README.md) for the detailed application guide and [DEPLOYMENT.md](DEPLOYMENT.md) for Render deployment. The free-demo configuration uses ephemeral storage, so online data can be lost after restarts or redeployment.

## Earlier Python/FastAPI prototype

Use Python 3.10+ and run from the repository root:

```powershell
pip install -r requirements.txt
python scripts/seed_data.py
uvicorn src.main:app --reload --port 8000
```

Swagger UI: **http://127.0.0.1:8000/docs**
OpenAPI specification: **http://127.0.0.1:8000/openapi.json**

```powershell
pytest -v
```

## Repository structure

```text
transcript-generation-system/
├── .github/workflows/ci.yml        # Python CI
├── docs/
│   ├── assignment-01/              # Project definition
│   ├── requirements/               # SRS and system context
│   ├── assignment-03/              # Scenarios, use cases and activities
│   ├── assignment-04/              # Classes, objects and relationships
│   ├── assignment-05/              # Collaboration, states and components
│   └── pdf/                        # Submission PDFs
├── client/                         # React/Vite frontend
├── server/
│   ├── src/                        # Express routes, services and SQLite database
│   └── tests/                      # API and Assignment 05 regression tests
├── src/                            # Earlier FastAPI prototype
├── tests/                          # Python tests
├── scripts/seed_data.py            # Python seed script
├── T-029.pdf                       # Assignments 01–05 submission
├── render.yaml                     # Render deployment configuration
├── DEPLOYMENT.md                   # Deployment guide
├── REACT-README.md                 # Detailed React application guide
├── requirements.txt                # Python dependencies
└── README.md
```

## Implementation scope

Institutional SSO, external email/SMS gateways, online fee payment, ERP integration and external degree-verification agencies are not connected. The initial release supports a single uniform grading scheme and curriculum structure. For public deployment, remove demo login, configure a deployment JWT secret and review the security notes in [REACT-README.md](REACT-README.md).

## AI usage declaration

AI tools, including Google Gemini, supported requirements structuring, calculation logic verification, UML modelling consistency checks and implementation assistance. Team T029 is responsible for reviewing, verifying and adapting all submitted requirements, models and code in accordance with the course AI policy.

**Team ID:** T029 (Ayush Agarwal, Yash Sharma, Jatin Dangi, Daksh Kedia)
**Documentation coverage:** Assignments 01–05
