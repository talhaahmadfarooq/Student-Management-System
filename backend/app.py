from flask import Flask

from config import Config
from database import db
from models import Student
from routes.students import students_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.register_blueprint(students_bp)

@app.route("/")
def home():
    return {
        "message": "Student Management System Backend is Running!"
    }


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)