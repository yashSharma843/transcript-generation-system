"""
Transcript Generation System (TGS) - Python Prototype
Course: CS314 Software Development Laboratory
Team: T029
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

GRADE_POINT_MAP = {
    'A+': 10.0,
    'A': 10.0,
    'B+': 9.0,
    'B': 8.0,
    'C': 6.0,
    'D': 4.0,
    'F': 0.0
}

def calculate_sgpa(courses):
    total_credits = 0
    total_points = 0.0
    for course in courses:
        credits = course['credits']
        grade = course['grade']
        pts = GRADE_POINT_MAP.get(grade, 0.0)
        total_credits += credits
        total_points += (pts * credits)
    
    sgpa = round(total_points / total_credits, 2) if total_credits > 0 else 0.0
    return sgpa, total_credits

class WatermarkCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_watermark()
            super().showPage()
        super().save()

    def draw_watermark(self):
        self.saveState()
        self.setFont("Helvetica-Bold", 54)
        self.setFillColor(colors.HexColor("#e2e8f0"))
        self.translate(300, 420)
        self.rotate(45)
        self.drawCentredString(0, 0, "OFFICIAL TRANSCRIPT")
        self.restoreState()

def generate_transcript_pdf(student_info, semester_records, output_filename="transcript_output.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=1,
        textColor=colors.HexColor('#0f172a')
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        alignment=1,
        textColor=colors.HexColor('#475569')
    )

    elements = [
        Paragraph("THE LNMIIT, JAIPUR", title_style),
        Paragraph("Official Academic Transcript • Office of Academic Affairs", subtitle_style),
        Spacer(1, 16)
    ]

    # Student metadata table
    info_data = [
        [f"Student Name: {student_info['name']}", f"Roll Number: {student_info['roll_number']}"],
        [f"Degree / Program: {student_info['program']}", f"Batch: {student_info['batch']}"],
        [f"Status: {student_info['status']}", f"Issue Date: {student_info['issue_date']}"]
    ]
    info_table = Table(info_data, colWidths=[270, 270])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1e293b')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 14))

    total_cum_credits = 0
    total_cum_points = 0.0

    # Semester tables
    for sem in semester_records:
        sem_title = Paragraph(f"<b>Semester {sem['semester_no']} ({sem['academic_year']})</b>", styles['Normal'])
        elements.append(sem_title)
        elements.append(Spacer(1, 6))

        table_rows = [["Course Code", "Course Name", "Credits", "Grade", "Points"]]
        for c in sem['courses']:
            pts = GRADE_POINT_MAP.get(c['grade'], 0.0)
            table_rows.append([c['code'], c['name'], str(c['credits']), c['grade'], f"{pts:.1f}"])

        sgpa, sem_credits = calculate_sgpa(sem['courses'])
        for c in sem['courses']:
            total_cum_points += GRADE_POINT_MAP.get(c['grade'], 0.0) * c['credits']
        total_cum_credits += sem_credits

        sem_table = Table(table_rows, colWidths=[90, 260, 60, 60, 70])
        sem_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8.5),
            ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(sem_table)

        summary_text = Paragraph(f"<b>Semester Credits:</b> {sem_credits} &nbsp;&nbsp;|&nbsp;&nbsp; <b>SGPA:</b> {sgpa:.2f}", styles['Normal'])
        elements.append(Spacer(1, 4))
        elements.append(summary_text)
        elements.append(Spacer(1, 12))

    # Overall Summary
    cgpa = round(total_cum_points / total_cum_credits, 2) if total_cum_credits > 0 else 0.0
    elements.append(Spacer(1, 8))
    cum_summary = Paragraph(
        f"<b>Cumulative Credits Earned:</b> {total_cum_credits} &nbsp;&nbsp;|&nbsp;&nbsp; <b>Final CGPA:</b> {cgpa:.2f}",
        title_style
    )
    elements.append(cum_summary)

    doc.build(elements, canvasmaker=WatermarkCanvas)
    print(f"Transcript generated successfully: {output_filename}")

if __name__ == '__main__':
    demo_student = {
        "name": "Ayush Agarwal",
        "roll_number": "24UCC171",
        "program": "B.Tech in Computer Science and Engineering",
        "batch": "2024 - 2028",
        "status": "Official / Approved",
        "issue_date": "2026-09-29"
    }

    demo_semesters = [
        {
            "semester_no": 1,
            "academic_year": "2025-2026",
            "courses": [
                {"code": "CS314", "name": "Software Development Laboratory", "credits": 3, "grade": "A"},
                {"code": "CS301", "name": "Computer Networks", "credits": 4, "grade": "B"},
                {"code": "CS303", "name": "Theory of Computation", "credits": 4, "grade": "A"},
                {"code": "CS305", "name": "Database Management Systems", "credits": 4, "grade": "B"}
            ]
        }
    ]

    generate_transcript_pdf(demo_student, demo_semesters)
