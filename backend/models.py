from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)  # in real app hash!
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    cycles = db.relationship('Cycle', backref='user', cascade="all, delete-orphan")

class Cycle(db.Model):
    __tablename__ = 'cycles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    symptoms = db.relationship('Symptom', backref='cycle', cascade="all, delete-orphan")
    reminders = db.relationship('Reminder', backref='cycle', cascade="all, delete-orphan")

class Symptom(db.Model):
    __tablename__ = 'symptoms'
    id = db.Column(db.Integer, primary_key=True)
    cycle_id = db.Column(db.Integer, db.ForeignKey('cycles.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    severity = db.Column(db.Integer, default=1)  # 1-5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Reminder(db.Model):
    __tablename__ = 'reminders'
    id = db.Column(db.Integer, primary_key=True)
    cycle_id = db.Column(db.Integer, db.ForeignKey('cycles.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    scheduled_for = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
