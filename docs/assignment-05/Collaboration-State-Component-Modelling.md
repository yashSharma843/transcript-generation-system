# The LNM Institute of Information Technology, Jaipur
## Software Development Laboratory
**Course Code:** CS314  
**Lab Assignment 5:** Collaboration, State and Component Modelling  
**Project:** Transcript Generation System (TGS)  
**Team ID:** T029  
**Team Members:** Ayush Agarwal, Yash Sharma, Jatin Dangi, Daksh Kedia  
**Roll Numbers:** 24UCC171, 24UCC172, 24UCC173, 24UCC174  
**Development Model:** Agile - Iterative and Incremental Development   

---

## 36. Collaboration Diagrams

The following collaboration models represent object interactions and message sequences across system boundaries for the three core use cases.

### 36.1 UC-007 — View Academic Records
Models how the system retrieves, validates, and renders a student's verified academic history.

```mermaid
sequenceDiagram
    autonumber
    actor Student as student: Student
    participant UI as ui: WebUI
    participant Auth as authMgr: AuthenticationManager
    participant RecMgr as recordMgr: RecordManagementEngine
    participant DB as db: Database

    Student->>UI: requestAcademicRecords()
    UI->>Auth: verifySession()
    Auth-->>UI: sessionValid
    UI->>RecMgr: getCompleteHistory(studentID)
    RecMgr->>DB: queryRecords(studentID)
    DB-->>RecMgr: returnRecords
    RecMgr-->>UI: returnHistory
    UI-->>Student: displayRecords()
```

---

### 36.2 UC-010 — Request Transcript
Models how the system verifies grade completeness, calculates final GPAs, generates preliminary records, and dispatches notifications.

```mermaid
sequenceDiagram
    autonumber
    actor Student as student: Student
    participant UI as ui: WebUI
    participant RecMgr as recordMgr: RecordManagementEngine
    participant Calc as calcEngine: CalculationEngine
    participant Req as req: TranscriptRequest
    participant DB as db: Database
    participant Notif as notifSys: NotificationService

    Student->>UI: submitTranscriptRequest()
    UI->>RecMgr: checkRecordsComplete(studentID)
    RecMgr-->>UI: recordsVerified
    UI->>Calc: calculateFinalGPA(studentID)
    Calc-->>UI: returnGPA
    UI->>Req: createRequest(studentID, type)
    Req->>DB: saveRequest()
    DB-->>Req: ack
    Req-->>UI: requestId
    UI->>Notif: sendPendingNotification(studentID)
    Notif-->>Student: displayConfirmation()
```

---

### 36.3 UC-011 — Approve Transcript
Models how staff review, approve, apply official watermarks, update databases, create audit logs, and notify the student.

```mermaid
sequenceDiagram
    autonumber
    actor Staff as staff: AcademicOfficeStaff
    participant UI as ui: WebUI
    participant Req as req: TranscriptRequest
    participant DB as db: Database
    participant Gen as pdfGen: TranscriptGenerator
    participant Audit as auditLog: AuditLog
    participant Notif as notifSys: NotificationService

    Staff->>UI: approveRequest(requestID)
    UI->>Req: updateStatus(Approved)
    Req->>DB: updateDB()
    DB-->>Req: ack
    UI->>Gen: generateOfficialPDF(requestID)
    Gen->>DB: savePDF()
    DB-->>Gen: ack
    Gen->>Gen: applyWatermark()
    Gen-->>UI: pdfReady
    UI->>Audit: logAction("Approved", requestID, staffID)
    UI->>Notif: sendApprovalNotification(studentID)
    UI-->>Staff: displaySuccess()
```

---

## 37. State Diagrams

### 37.1 State Diagram for TranscriptRequest
Represents the lifecycle transitions of a transcript request from initial creation to final document dispatch.

```mermaid
stateDiagram-v2
    [*] --> Pending: createRequest()
    Pending --> UnderReview: accessed by Staff
    UnderReview --> Approved: approveRequest()
    UnderReview --> Rejected: rejectRequest(reason)
    Approved --> Completed: generatePDF()
    Completed --> [*]
    Rejected --> [*]
```

---

### 37.2 State Diagram for SemesterRecord
Represents the lifecycle stages of semester grade records from initial faculty draft to official approval.

```mermaid
stateDiagram-v2
    [*] --> Draft: addGradeRecord()
    Draft --> Submitted: submitGrades()
    Submitted --> UnderVerification: selectForVerification()
    UnderVerification --> Verified: verifyRecord()
    UnderVerification --> Rejected: findDiscrepancy()
    Rejected --> Draft: requestCorrection()
    Verified --> Approved: approveRecord()
    Approved --> [*]
```

---

## 38. Component Diagram

The multi-tier system architecture is organized across the Presentation (Frontend), Business Logic (Backend Services), and Persistence (Data) layers.

```mermaid
flowchart TD
    subgraph Users ["Actors"]
        Student["Student"]
        Staff["Academic Office Staff"]
        Coordinator["Course Coordinator"]
    end

    subgraph Frontend ["Frontend Layer"]
        UI["Web Application / UI"]
    end

    subgraph Backend ["Backend Services Layer"]
        RecordEngine["Record Management Engine"]
        CalcEngine["Calculation Engine"]
        TransGen["Transcript Generator"]
        AuthMgr["Authentication Manager"]
        AuditLog["Audit Logger"]
        NotifService["Notification Service"]
    end

    subgraph External ["External Integration"]
        EmailSystem["External Email System"]
    end

    subgraph DataLayer ["Data Layer"]
        Database[("Central Database")]
    end

    Student --> UI
    Staff --> UI
    Coordinator --> UI

    UI --> RecordEngine
    UI --> CalcEngine
    UI --> TransGen
    UI --> AuthMgr
    UI --> AuditLog
    UI --> NotifService

    RecordEngine --> Database
    CalcEngine --> Database
    TransGen --> Database
    AuthMgr --> Database
    AuditLog --> Database
    NotifService --> Database
    NotifService --> EmailSystem
```

---

## 39. Individual Contribution

* **Daksh Kedia (24UCC174) – Project / Requirement Lead:** Ensured structural compliance by tracing all identified classes and associations directly back to the Functional Requirements and Business Rules established in the initial requirements specification. For Assignment 5, ensured end-to-end requirement traceability across the collaboration diagrams for UC-007, UC-010, and UC-011.
* **Yash Sharma (24UCC172) – Design / Architecture Lead:** Designed and modeled the comprehensive UML Class Diagram, establishing the structural architecture, multiplicities, and specific generalization and composition relationships. For Assignment 5, designed the system Component Diagram across the Frontend, Backend Services, and Data Layer modules.
* **Ayush Agarwal (24UCC171) – Development Lead:** Identified the core system classes along with their essential attributes and operations, and designed the UML Object Diagram representing the transcript approval snapshot. For Assignment 5, modeled the UML State Diagrams for the complete lifecycles of TranscriptRequest and SemesterRecord.
* **Jatin Dangi (24UCC173) – Testing & Documentation Lead:** Documented the relationship justifications, verified architectural consistency between Assignment 3 activity diagrams and the new class structures, and managed the GitHub Markdown compilation. For Assignment 5, verified consistency between class models and collaboration interactions, and maintained report compilation alongside the AI policy declarations.

---

## AI Usage Policy — Student Declaration

AI tools may be used as supporting tools for this assignment. The team is responsible for the correctness, consistency, and understanding of all submitted requirements, models, and code.
* We have disclosed the use of AI tools, if any.
* AI-generated suggestions have been reviewed, verified, and adapted by the team.
* We understand and can explain the submitted collaboration diagrams, state models, and component architecture.
* We have verified that the UML models are consistent with our project's scope and baseline requirements.
* The final submission represents our team's understanding and engineering decisions.

| Item | Details |
|---|---|
| **AI Tool(s) Used** | Gemini (Google) |
| **Purpose of AI Use** | Supporting the team in structuring collaboration message flows, formatting state transitions, validating component layer responsibilities, and ensuring comprehensive coverage of transcript generation workflows. All AI suggestions have been reviewed, verified, and adapted by the team. |
| **Team ID** | T029 |
| **Team Member Names** | Ayush Agarwal (24UCC171), Yash Sharma (24UCC172), Jatin Dangi (24UCC173), Daksh Kedia (24UCC174) |
