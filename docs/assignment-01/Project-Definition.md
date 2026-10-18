# Lab Assignment 01 — Project Identification and Initial Definition

**Course:** CS314 — Software Development Laboratory  
**Institute:** The LNM Institute of Information Technology, Jaipur  
**Team ID:** T029  

---

## 1. Project Identification

| Item | Details |
| :--- | :--- |
| **Project Name** | Transcript Generation System (TGS) |
| **Project Type** | Web-based Academic Transcript Generation & Verification System |
| **Team ID** | T029 |
| **Team Members** | Ayush Agarwal, Yash Sharma, Jatin Dangi, Daksh Kedia |
| **Roll Numbers** | 24UCC171, 24UCC172, 24UCC173, 24UCC174 |
| **Development Model** | Agile + Incremental Development |
| **Primary Users** | Students, Course Coordinators, Academic Office Staff, Administrators |
| **Development Team** | Student software development team |
| **Course** | Software Engineering (CS314) |
| **Project Objective** | To develop a system that generates verified academic transcripts by calculating course credits, grades, semester (SGPA) and cumulative (CGPA) performance from institutionally verified academic records |
| **Expected Outcome** | A working, tested and documented software system developed incrementally |

---

## 2. Project Background

### Current Problem
The current process for generating academic transcripts relies heavily on manual data entry, creating significant bottlenecks for both university administrators and students. Examination offices typically juggle separate spreadsheets, paper files, and scanned mark sheets for every individual semester. This fragmented approach causes two primary issues:

- **Administrative Inefficiency:** Manually calculating earned credits, SGPAs, and CGPAs across hundreds of students is tedious. It frequently introduces human error, miscalculations, and formatting inconsistencies.
- **Student Delays:** When students need transcripts for higher education, internships, or job placements, they face frustrating wait times. Staff must manually track down, compile, and double-check multiple semester records before issuing the final document.

Automating this workflow is essential to eliminate calculation errors, reduce staff workload, and ensure students receive their critical academic credentials without unnecessary administrative delays.

### Proposed Solution
The TGS provides a centralized, reliable platform designed to automate the calculation of earned credits, SGPAs, and CGPAs from institutionally verified records, ensuring that consistently formatted and approved academic transcripts are easily generated and managed for students.

---

## 3. Project Vision

The TGS provides a centralized, reliable platform designed to automate the calculation of earned credits, SGPAs, and CGPAs from institutionally verified records, ensuring that consistently formatted and approved academic transcripts are easily generated and managed for students.

---

## 4. Problem Statement

Institutes need to issue academic transcripts to students for purposes such as higher education, placements and scholarships. Existing practices, which often rely on spreadsheets and manual verification across departments, are susceptible to calculation errors, formatting inconsistencies and processing delays. TGS is proposed as an integrated software solution that stores verified academic records, automates credit, SGPA and CGPA calculation according to a fixed grading scheme, and generates the final transcript only after appropriate verification, thereby reducing manual effort and error while improving turnaround time.

---

## 5. Project Objectives

The initial objectives are:

- To provide a centralized platform for storing and managing verified semester-wise academic records of students.
- To automatically calculate credits earned for each course based on the grade obtained.
- To automatically calculate the Semester Grade Point Average (SGPA) for each completed semester using the defined grading formula.
- To automatically calculate the Cumulative Grade Point Average (CGPA) across all completed semesters.
- To provide role-based access for students, course coordinators, academic office staff and administrators.
- To implement a verification and approval workflow so that a transcript is marked official only after review.
- To generate a properly formatted, downloadable transcript (PDF) for a student on request.
- To maintain an audit trail of record entries, edits and approvals for accountability.
- To allow the academic office to securely upload or update semester grade records.
- To develop the system incrementally using standard software engineering practices.

---

## 6. Stakeholders

| Stakeholder | Interest / Role |
| :--- | :--- |
| **Students** | View, download and verify their own academic transcript |
| **Academic / Examination Office** | Upload and verify semester-wise grade records; approve transcripts |
| **Course Coordinators / Faculty** | Submit and confirm grade data for their courses |
| **Administrator** | Manage users, roles, grading scheme and overall system configuration |
| **Institute Management** | Monitor academic performance and obtain consolidated reports |
| **System Development Team** | Design, develop, test and maintain the Transcript Generation System |

---

## 7. Initial Scope

### In Scope
TGS will initially cover:

- User registration/login
- Role-based access (student, faculty, academic office, administrator)
- Semester-wise course and grade record entry/upload
- Credit calculation engine based on grade and course credit weight
- SGPA calculation per semester
- CGPA calculation across completed semesters
- Record verification and approval workflow
- Transcript generation and download (PDF)
- Transcript/record history view for students
- Search and filter of student academic records (for staff)
- Basic reports/dashboard for the academic office

### Initially Out of Scope
To keep the project manageable, we initially exclude:

- Online fee/payment processing
- Online examination or exam-conduct features
- Course registration/enrollment management
- Complete ERP functionality
- Backlog/re-evaluation and grade-revision workflows beyond basic correction
- Mobile native application
- Integration with external universities or degree-verification agencies
- AI-based performance prediction or analytics

---

## 8. Initial Assumptions

- Users will have access to the Internet.
- Users will have valid institutional accounts or credentials.
- Grade records supplied by the academic office are accurate and verified before entry into the system.
- The grading scale and credit structure (e.g., grade points per letter grade) are defined and fixed in advance.
- The system will initially be developed as a web application.
- The system will use a centralized database.
- Only one academic program/curriculum structure is handled during the initial version.

---

## 9. Initial Constraints

- Limited development time.
- Student development team.
- Limited access to real institutional academic data; sample/mock data will be used for development and testing.
- Limited infrastructure available during development.
- Possible requirement changes during development.
- Need to protect sensitive student academic data and ensure privacy.
- Limited testing opportunities with real end users.
- Grading and credit policies may vary across departments; the initial version assumes a single, uniform scheme.

---

## 10. Initial Success Criteria

TGS will be considered successful if the team can demonstrate that:

1. Different user roles (student, faculty, academic office, administrator) can access only their appropriate functionality.
2. The academic office can upload or enter semester-wise grade records for a student.
3. The system correctly calculates credits earned and SGPA for a given semester.
4. The system correctly calculates CGPA across multiple completed semesters.
5. A grade record can pass through the verification/approval workflow before being marked official.
6. A verified transcript can be generated and downloaded as a properly formatted PDF.
7. Unauthorized users cannot access another student's academic records.
8. Important system functions (credit/SGPA/CGPA calculation, access control) are tested.
9. Defects are documented and resolved.
10. The project is maintained in a controlled Git/GitHub repository with meaningful commit history.

---

## AI USAGE POLICY — STUDENT DECLARATION

AI tools may be used as supporting tools for this assignment, but the submitted work must represent the team's own understanding and contribution.

| Item | Details |
| :--- | :--- |
| **AI Tool Used** | Gemini (Google) |
| **Purpose of AI Use** | Supporting the team in structuring the requirements specification document, organizing functional and non-functional requirements based on our project scope, reviewing consistency between calculation logic and business rules, improving clarity and testability of requirements statements, and ensuring comprehensive coverage of transcript generation workflows. All AI suggestions have been reviewed, verified, and adapted by the team. |
| **Team ID** | T029 |
| **Team Member Names** | Ayush Agarwal, Yash Sharma, Jatin Dangi, Daksh Kedia |
| **Team Declaration** | We confirm that the information provided above is accurate and that we accept responsibility for the submitted work. |
