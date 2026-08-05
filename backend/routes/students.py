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
    "department": student.department,
    "semester": student.semester,
    "gpa": student.gpa,
    "status": student.status,
    "avatar": student.avatar,

        }
        for student in students
    ]

    return {
        "message": "Students fetched successfully.",
        "data": data,
    }


@students_bp.route("/students", methods=["POST"])
def add_student():
    data = request.get_json()

    student = Student(
        student_id=data["student_id"],
        full_name=data["full_name"],
        email=data["email"],
        department=data["department"],
        semester=data["semester"],
        gpa=data["gpa"],
        status=data.get("status", "Active"),
        avatar=data.get(
            "avatar",
            "https://ui-avatars.com/api/?name=" + data["full_name"].replace(" ", "+")
        )
    )

    db.session.add(student)
    db.session.commit()

    return {
        "message": "Student added successfully."
    }, 201