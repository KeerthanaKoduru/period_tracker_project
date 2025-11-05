import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, User, Cycle, Symptom, Reminder
from schemas import CycleSchema, SymptomSchema, ReminderSchema, UserSchema
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from flask_cors import CORS
from config import Config

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///period_tracker.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    cycle_schema = CycleSchema()
    cycles_schema = CycleSchema(many=True)
    symptom_schema = SymptomSchema()
    symptom_list_schema = SymptomSchema(many=True)
    reminder_schema = ReminderSchema()
    reminder_list_schema = ReminderSchema(many=True)
    user_schema = UserSchema()

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.json or {}
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return jsonify({"msg": "username & password required"}), 400
        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "username already exists"}), 400
        hashed = generate_password_hash(password)
        user = User(username=username, password=hashed)
        db.session.add(user)
        db.session.commit()
        return jsonify(user_schema.dump(user)), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.json or {}
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"msg": "invalid credentials"}), 401
        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token, "user": user_schema.dump(user)}), 200

    # cycles
    @app.route('/api/cycles', methods=['GET'])
    @jwt_required()
    def list_cycles():
        user_id = get_jwt_identity()
        cycles = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date.desc()).all()
        return jsonify(cycles_schema.dump(cycles))

    @app.route('/api/cycles', methods=['POST'])
    @jwt_required()
    def add_cycle():
        user_id = get_jwt_identity()
        data = request.json or {}
        start_date = data.get('start_date')
        end_date = data.get('end_date')  # optional
        notes = data.get('notes')
        if not start_date:
            return jsonify({"msg": "start_date required"}), 400
        c = Cycle(user_id=user_id, start_date=datetime.fromisoformat(start_date).date(), end_date=(datetime.fromisoformat(end_date).date() if end_date else None), notes=notes)
        db.session.add(c)
        db.session.commit()
        return jsonify(cycle_schema.dump(c)), 201

    @app.route('/api/cycles/<int:cycle_id>', methods=['PUT'])
    @jwt_required()
    def update_cycle(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        data = request.json or {}
        if 'start_date' in data:
            c.start_date = datetime.fromisoformat(data['start_date']).date()
        if 'end_date' in data:
            c.end_date = datetime.fromisoformat(data['end_date']).date() if data['end_date'] else None
        c.notes = data.get('notes', c.notes)
        db.session.commit()
        return cycle_schema.jsonify(c)

    @app.route('/api/cycles/<int:cycle_id>', methods=['DELETE'])
    @jwt_required()
    def delete_cycle(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        db.session.delete(c)
        db.session.commit()
        return jsonify({"msg": "deleted"}), 200

    # symptoms endpoints for a cycle
    @app.route('/api/cycles/<int:cycle_id>/symptoms', methods=['GET'])
    @jwt_required()
    def list_symptoms(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        return jsonify(symptom_list_schema.dump(c.symptoms))

    @app.route('/api/cycles/<int:cycle_id>/symptoms', methods=['POST'])
    @jwt_required()
    def add_symptom(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        data = request.json or {}
        name = data.get('name')
        severity = int(data.get('severity', 1))
        if not name:
            return jsonify({"msg": "name required"}), 400
        s = Symptom(cycle_id=c.id, name=name, severity=severity)
        db.session.add(s)
        db.session.commit()
        return jsonify(symptom_schema.dump(s)), 201

    # reminders endpoints for a cycle
    @app.route('/api/cycles/<int:cycle_id>/reminders', methods=['GET'])
    @jwt_required()
    def list_reminders(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        return jsonify(reminder_list_schema.dump(c.reminders))

    @app.route('/api/cycles/<int:cycle_id>/reminders', methods=['POST'])
    @jwt_required()
    def add_reminder(cycle_id):
        user_id = get_jwt_identity()
        c = Cycle.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
        data = request.json or {}
        title = data.get('title')
        scheduled_for = data.get('scheduled_for')
        notes = data.get('notes')
        if not title or not scheduled_for:
            return jsonify({"msg": "title and scheduled_for required"}), 400
        r = Reminder(cycle_id=c.id, title=title, scheduled_for=datetime.fromisoformat(scheduled_for), notes=notes)
        db.session.add(r)
        db.session.commit()
        return jsonify(reminder_schema.dump(r)), 201

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
