from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import MedicationReminder
from datetime import time

reminder_bp = Blueprint('reminder', __name__, url_prefix='/api/reminders')

@reminder_bp.route('/', methods=['GET'])
@jwt_required()
def get_reminders():
    try:
        identity = get_jwt_identity()
        print('JWT identity:', identity)
        user_id = int(identity)
        print('GET /reminders/ for user:', user_id)
        reminders = MedicationReminder.query.filter_by(user_id=user_id).all()
        print('Reminders found:', len(reminders))
        return jsonify([{'id': r.id, 'name': r.medication, 'time': r.time.strftime('%H:%M'), 'notes': r.notes} for r in reminders])
    except Exception as e:
        print('Error in get_reminders:', e)
        return jsonify({'error': str(e)}), 422

@reminder_bp.route('/', methods=['POST'])
@jwt_required()
def add_reminder():
    try:
        identity = get_jwt_identity()
        print('JWT identity:', identity)
        user_id = int(identity)
        data = request.get_json()
        print('POST /reminders/ data:', data)
        reminder = MedicationReminder(
            user_id=user_id,
            medication=data.get('medication') or data.get('name'),
            time=time.fromisoformat(data['time']),
            notes=data.get('notes')
        )
        db.session.add(reminder)
        db.session.commit()
        return jsonify({'msg': 'Reminder added'})
    except Exception as e:
        print('Error in add_reminder:', e)
        return jsonify({'error': str(e)}), 422

@reminder_bp.route('/<int:reminder_id>/', methods=['GET'])
@jwt_required()
def get_reminder(reminder_id):
    user_id = int(get_jwt_identity())
    reminder = MedicationReminder.query.filter_by(id=reminder_id, user_id=user_id).first_or_404()
    return jsonify({'id': reminder.id, 'name': reminder.medication, 'time': reminder.time.strftime('%H:%M'), 'notes': reminder.notes})

@reminder_bp.route('/<int:reminder_id>/', methods=['PUT'])
@jwt_required()
def update_reminder(reminder_id):
    user_id = int(get_jwt_identity())
    reminder = MedicationReminder.query.filter_by(id=reminder_id, user_id=user_id).first_or_404()
    data = request.get_json()
    reminder.medication = data.get('medication') or data.get('name')
    reminder.time = time.fromisoformat(data['time'])
    reminder.notes = data.get('notes')
    db.session.commit()
    return jsonify({'msg': 'Reminder updated'})

@reminder_bp.route('/<int:reminder_id>/', methods=['DELETE'])
@jwt_required()
def delete_reminder(reminder_id):
    user_id = int(get_jwt_identity())
    reminder = MedicationReminder.query.filter_by(id=reminder_id, user_id=user_id).first_or_404()
    db.session.delete(reminder)
    db.session.commit()
    return jsonify({'msg': 'Reminder deleted'})
