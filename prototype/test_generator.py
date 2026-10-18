import pytest
from transcript_generator import calculate_sgpa, GRADE_POINT_MAP

def test_grade_point_mapping():
    assert GRADE_POINT_MAP['A'] == 10.0
    assert GRADE_POINT_MAP['B'] == 8.0
    assert GRADE_POINT_MAP['F'] == 0.0

def test_sgpa_calculation():
    sample_courses = [
        {"credits": 3, "grade": "A"},  # 30.0 pts
        {"credits": 4, "grade": "B"},  # 32.0 pts
    ]
    sgpa, total_credits = calculate_sgpa(sample_courses)
    assert total_credits == 7
    # 62.0 / 7 = 8.857... -> 8.86
    assert sgpa == 8.86
