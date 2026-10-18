# The LNM Institute of Information Technology, Jaipur
## Software Development Laboratory
**Course Code:** CS314  
**Lab Assignment 3:** Scenario, Use Case and Activity Modelling  
**Project:** Transcript Generation System (TGS)  
**Team ID:** T029  
**Team Members:** Ayush Agarwal, Yash Sharma, Jatin Dangi, Daksh Kedia  
**Roll Numbers:** 24UCC171, 24UCC172, 24UCC173, 24UCC174  
**Development Model:** Agile - Iterative and Incremental Development  

---

## 30. Scenarios

The three detailed use cases defined in Assignment 2 are carried forward without introducing new functionality:
- **UC-007:** View Academic Records
- **UC-010:** Request Transcript
- **UC-011:** Approve Transcript

---

### Scenario: UC-007 — View Academic Records

| Field | Description |
|---|---|
| **Actor(s) involved** | **Primary:** Student.<br>**Supporting:** Transcript Generation System. |
| **Starting condition** | The Student is authenticated and has at least one completed semester with verified grade records in the institutional database. |
| **Main sequence of activities** | 1. The student navigates to the "My Academic Records" section.<br>2. The system retrieves the student's complete academic history from the centralized database.<br>3. The system displays semester-wise grade records (course code, name, credits, and grade obtained).<br>4. The system calculates and displays the Semester Grade Point Average (SGPA) for each semester.<br>5. The system displays the Cumulative Grade Point Average (CGPA) across all completed semesters.<br>6. The system displays total credits earned to date.<br>7. The student selects and views detailed records for any specific semester. |
| **Important alternative / exception flows** | • **No Records Available:** If no grade records exist for the student, the system displays a "No records available" message.<br>• **Pending Calculations:** If grade verification or SGPA/CGPA calculation is pending, the system displays the status as "Under Processing".<br>• **Unauthorized Access:** If a user attempts to access another student's academic history, access is blocked and an unauthorized access attempt is logged. |
| **Expected outcome** | The student successfully views their complete academic history, including verified grades, earned credits, semester SGPAs, and cumulative CGPA without unauthorized modifications. |

#### Compact Representation: UC-007
```mermaid
flowchart TD
    A["Student: Navigate to My Academic Records"] --> B["System: Retrieve complete academic history"]
    B --> C["System: Display semester-wise grades and credits"]
    C --> D["System: Display calculated SGPA and CGPA"]
    D --> E["Student: View detailed semester information"]
```

---

### Scenario: UC-010 — Request Transcript

| Field | Description |
|---|---|
| **Actor(s) involved** | **Primary:** Student.<br>**Supporting:** Transcript Generation System; Academic Office Staff receives the pending request. |
| **Starting condition** | The Student is authenticated and has at least one completed semester with fully verified and approved academic grade records. |
| **Main sequence of activities** | 1. The student navigates to the "Request Transcript" section.<br>2. The system displays the transcript request form.<br>3. The student selects the transcript type (`Official` or `Unofficial`) and optionally provides a purpose or remarks.<br>4. The student submits the transcript request.<br>5. The system validates that all semester grade records are complete, verified, and free of discrepancies.<br>6. The system creates a transcript request record and calculates the final SGPA and CGPA.<br>7. The system generates a preliminary transcript snapshot.<br>8. The system routes the request to the Academic Office pending approval queue.<br>9. The system displays an on-screen confirmation with a unique Request ID to the student.<br>10. The system dispatches an automated notification to Academic Office staff. |
| **Important alternative / exception flows** | • **Incomplete Records:** If grade records are missing, incomplete, or unverified, the system blocks submission and notifies the student.<br>• **Pending Corrections:** If a semester record has pending grade corrections, the request is paused until resolution.<br>• **Generation Failure:** If an error occurs during PDF preliminary generation, the transaction rolls back and an error is logged. |
| **Expected outcome** | A formal transcript request record is created in `Pending` status; preliminary calculations are verified; the request is queued for Academic Office review; and an acknowledgement is issued to the student. |

#### Compact Representation: UC-010
```mermaid
flowchart TD
    A["Student: Navigate to Request Transcript"] --> B["System: Display request form"]
    B --> C["Student: Select transcript type and submit"]
    C --> D["System: Validate record completeness and verification"]
    D --> E["System: Calculate final GPA and create request record"]
    E --> F["System: Queue in Academic Office pending requests"]
    F --> G["System: Display Request ID and send notification"]
```

---

### Scenario: UC-011 — Approve Transcript

| Field | Description |
|---|---|
| **Actor(s) involved** | **Primary:** Academic Office Staff.<br>**Supporting:** Transcript Generation System; Student receives the approval notification. |
| **Starting condition** | The staff member is authenticated with Academic Office credentials; a transcript request exists in `Pending` status; and all associated semester grade records are verified. |
| **Main sequence of activities** | 1. The staff member accesses the pending transcript approval queue.<br>2. The system displays the list of pending transcript requests.<br>3. The staff member selects a request to inspect.<br>4. The system presents student details along with an interactive preliminary transcript preview.<br>5. The staff member reviews the transcript for accuracy and verifies student institutional eligibility.<br>6. The staff member selects **Approve**.<br>7. The system updates the transcript status to `Approved`.<br>8. The system applies the official institutional watermark to the final PDF.<br>9. The system logs the approval event, approver ID, and timestamp in the audit trail.<br>10. The system generates and sends a notification alerting the student that their official transcript is ready for download. |
| **Important alternative / exception flows** | • **Discrepancies Found:** The staff member selects `Reject` and enters mandatory rejection comments; the system marks the request `Rejected` and notifies the student.<br>• **Manual Scrutiny Required:** The staff member marks the request for additional departmental review.<br>• **Eligibility Revoked:** If student clearance is withheld, the request is rejected with reason. |
| **Expected outcome** | The transcript request is marked `Approved`; an official watermarked PDF is compiled and stored; the audit trail is updated; and the student is notified that the document is ready for download. |

#### Compact Representation: UC-011
```mermaid
flowchart TD
    A["Academic Staff: Open pending transcript queue"] --> B["System: Display pending requests"]
    B --> C["Academic Staff: Select request and inspect preview"]
    C --> D["Academic Staff: Verify eligibility and approve"]
    D --> E["System: Update status to Approved"]
    E --> F["System: Apply official watermark to PDF"]
    F --> G["System: Log in audit trail and notify student"]
```

---

## 31. UML Use Case Diagram — Complete System

```mermaid
flowchart LR
    subgraph TGS["Transcript Generation System (TGS)"]
        UC001(["UC-001: Login"])
        UC002(["UC-002: Manage Users"])
        UC003(["UC-003: Configure Grading Scheme"])
        UC015(["UC-015: View Audit Trail"])

        UC005(["UC-005: Submit Course Grades"])

        UC004(["UC-004: Upload Grade Records"])
        UC006(["UC-006: Verify Grade Records"])
        UC014(["UC-014: Search Student Records"])
        UC011(["UC-011: Approve Transcript"])
        UC016(["UC-016: Generate Reports"])

        UC007(["UC-007: View Academic Records"])
        UC010(["UC-010: Request Transcript"])
        UC013(["UC-013: Download Transcript"])
        UC017(["UC-017: View Notifications"])

        UC008(["UC-008: Calculate SGPA"])
        UC009(["UC-009: Calculate CGPA"])
        UC012(["UC-012: Generate Transcript PDF"])
    end

    ActorStudent["Student"]
    ActorCoordinator["Course Coordinator / Faculty"]
    ActorStaff["Academic / Examination Office Staff"]
    ActorAdmin["Administrator"]
    ActorManagement["Institute Management"]

    ActorStudent --> UC001
    ActorStudent --> UC007
    ActorStudent --> UC010
    ActorStudent --> UC013
    ActorStudent --> UC017

    ActorCoordinator --> UC001
    ActorCoordinator --> UC005
    ActorCoordinator --> UC017

    ActorStaff --> UC001
    ActorStaff --> UC004
    ActorStaff --> UC006
    ActorStaff --> UC011
    ActorStaff --> UC014
    ActorStaff --> UC016
    ActorStaff --> UC017

    ActorAdmin --> UC001
    ActorAdmin --> UC002
    ActorAdmin --> UC003
    ActorAdmin --> UC015

    ActorManagement --> UC001
    ActorManagement --> UC016

    UC007 -.->|"include"| UC001
    UC010 -.->|"include"| UC001
    UC010 -.->|"include"| UC008
    UC010 -.->|"include"| UC009
    UC011 -.->|"include"| UC012
    UC013 -.->|"include"| UC001
```

**Relationship Notes:**
- `UC-001 Login` is included (`include`) in all primary operations requiring secure role authentication (`UC-007`, `UC-010`, and `UC-013`).
- `UC-008 Calculate SGPA` and `UC-009 Calculate CGPA` are included (`include`) in `UC-010 Request Transcript` to validate credit totals and grade summaries.
- `UC-012 Generate Transcript PDF` is included (`include`) in `UC-011 Approve Transcript` upon applying the official watermark.

---

## 32. Activity Diagrams

### 32.1 UC-007 — View Academic Records
```mermaid
flowchart TD
    subgraph Student["Student"]
        startNode["Start"] --> navRecords["Navigate to My Academic Records"]
        viewDetailed["View detailed semester records"] --> endNode["End"]
    end

    subgraph System["TGS System"]
        navRecords --> retrieveHist["Retrieve complete academic history"]
        retrieveHist --> recCheck{"Records exist?"}
        recCheck -->|"No"| showNoRec["Display 'No records available' message"]
        showNoRec --> endNode
        recCheck -->|"Yes"| dispGrades["Display semester-wise grades and credits"]
        dispGrades --> calcCheck{"Calculations complete?"}
        calcCheck -->|"No"| showPending["Display status as 'Under Processing'"]
        showPending --> endNode
        calcCheck -->|"Yes"| dispGPA["Display calculated SGPA, CGPA, and total credits"]
        dispGPA --> viewDetailed
    end
```

---

### 32.2 UC-010 — Request Transcript
```mermaid
flowchart TD
    subgraph Student["Student"]
        startReq["Start"] --> navReq["Navigate to Request Transcript"]
        fillForm["Select transcript type and submit"] --> waitNotice["Receive Request ID and confirmation"]
        waitNotice --> endReq["End"]
    end

    subgraph System["TGS System"]
        navReq --> showForm["Display transcript request form"]
        showForm --> fillForm
        fillForm --> valRecords{"Grade records verified and complete?"}
        valRecords -->|"No"| notifyIncomplete["Notify student: Records incomplete or pending review"]
        notifyIncomplete --> endIncomplete["End"]
        valRecords -->|"Yes"| calcFinal["Calculate final SGPA and CGPA"]
        calcFinal --> createReqRec["Create transcript request record"]
        createReqRec --> genPrelim["Generate preliminary transcript snapshot"]
        genPrelim --> queueStaff["Queue in Academic Office pending approvals"]
        genPrelim --> sendConfirm["Send confirmation with Request ID to student"]
        queueStaff --> waitNotice
        sendConfirm --> waitNotice
    end
```

---

### 32.3 UC-011 — Approve Transcript
```mermaid
flowchart TD
    subgraph AcademicStaff["Academic Office Staff"]
        startStaff["Start"] --> openQueue["Access pending transcript approval queue"]
        selectReq["Select transcript request"] --> inspectPrev["Review transcript preview and verify eligibility"]
        inspectPrev --> decisionChoice{"Approve or Reject?"}
        approveReq["Select Approve"] --> staffDone["Approval recorded"]
        rejectReq["Select Reject with mandatory comments"] --> staffDone
        staffDone --> endStaff["End"]
    end

    subgraph System["TGS System"]
        openQueue --> dispQueue["Display list of pending requests"]
        dispQueue --> selectReq
        selectReq --> dispPreview["Display student details and preview"]
        dispPreview --> inspectPrev
        decisionChoice -->|"Approve"| approveReq
        decisionChoice -->|"Reject"| rejectReq
        rejectReq --> updReject["Update status to 'Rejected'"]
        updReject --> notifyReject["Notify student with rejection reason"]
        notifyReject --> staffDone
        approveReq --> updApprove["Update status to 'Approved'"]
        updApprove --> applyWatermark["Apply official watermark to PDF"]
        applyWatermark --> logAudit["Record approval in audit trail"]
        applyWatermark --> notifyStudent["Notify student: Transcript ready for download"]
        logAudit --> staffDone
        notifyStudent --> staffDone
    end
```

---

## 33. Consistency and Traceability Check

The models preserve the required chain:  
**Assignment 2 requirements -> the same 3 detailed use cases -> scenarios -> complete-system use case diagram -> activity diagrams.**  
No new system functionality has been introduced.

| Detailed Use Case | Assignment 2 Source | Requirement Basis | Scenario | Activity Diagram |
|---|---|---|---|---|
| **UC-007 View Academic Records** | Section 19.1 | FR-028, FR-015, FR-017, FR-020; record viewing and GPA display rules | Scenario 1 | 32.1 |
| **UC-010 Request Transcript** | Section 19.2 | FR-022, FR-023, BR-004, BR-005, BR-010; eligibility checks and request queuing | Scenario 2 | 32.2 |
| **UC-011 Approve Transcript** | Section 19.3 | FR-025, FR-027, FR-041, BR-006, BR-012; verification, watermark, and audit logging | Scenario 3 | 32.3 |

---

## 35. Individual Contribution

- **Daksh Kedia (24UCC174):** Traced scenarios and activity workflows directly back to functional requirements and business rules, ensuring end-to-end traceability for UC-007, UC-010, and UC-011.
- **Yash Sharma (24UCC172):** Designed the complete-system UML use case diagram, structured actor associations, and verified swimlane interactions across the system boundary.
- **Ayush Agarwal (24UCC171):** Prepared the detailed scenario specifications and activity diagrams for UC-010 (Request Transcript) and UC-011 (Approve Transcript).
- **Jatin Dangi (24UCC173):** Prepared the activity model for UC-007 (View Academic Records), verified diagram consistency with Assignment 2 specifications, and compiled GitHub documentation.

---

## AI Usage Policy — Student Declaration

AI tools may be used as supporting tools for this assignment. The team is responsible for the correctness, consistency, and understanding of all submitted scenarios and UML models.
- We have disclosed the use of AI tools, if any.
- AI-generated suggestions have been reviewed, verified, and adapted by the team.
- We understand and can explain the submitted scenarios, use case diagram, and activity diagrams.
- We have verified that the UML models are consistent
