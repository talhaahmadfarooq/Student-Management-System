from flask import Blueprint, request

from database import db
from models import Student


students_bp = Blueprint("students", __name__)


@students_bp.route("/students", methods=["GET"])
def get_students():
    students = Student.query.all()
    data = [
        {
            "id": student.id,
            "student_id": student.student_id,
            "full_name": student.full_name,
            "email": student.email,
        }
        for student in students
    ]

    return {
        "message": "Students fetched successfully.",
        "data": data,
    }


@students_bp.route("/students", methods=["POST"])
def add_student():
    data = request.get_json(silent=True) or {}

    student = Student(
        student_id=data.get("student_id"),
        full_name=data.get("full_name"),
        email=data.get("email"),
    )

    db.session.add(student)
    db.session.commit()

    return {
        "message": "Student added successfully.",
    }, 201