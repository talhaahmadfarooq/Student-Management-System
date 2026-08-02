from flask import Blueprint

students_bp = Blueprint("students", __name__)


@students_bp.route("/students", methods=["GET"])
def get_students():
    return {
        "message": "Students endpoint is working!",
        "data": []
    }