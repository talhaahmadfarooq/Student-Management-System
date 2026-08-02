import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = "your-secret-key-change-this-later"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'student_management.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False