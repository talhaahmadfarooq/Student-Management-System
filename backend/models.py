from database import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    department = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    gpa = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Active")
    avatar = db.Column(
        db.String(255),
        nullable=False,
        default="https://ui-avatars.com/api/?name=Student"
    )