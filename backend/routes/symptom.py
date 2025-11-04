from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import SymptomLog
from datetime import datetime

symptom_bp = Blueprint('symptom', __name__, url_prefix='/api/symptoms')

@symptom_bp.route('/', methods=['GET'])
@jwt_required()
def get_symptoms():
    user_id = int(get_jwt_identity())
    print('GET /symptoms/ for user:', user_id)
    symptoms = SymptomLog.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': s.id, 'date': s.date.isoformat(), 'symptom': s.symptom, 'severity': s.severity, 'notes': s.notes} for s in symptoms])

@symptom_bp.route('/', methods=['POST'])
@jwt_required()
def add_symptom():
    try:
        identity = get_jwt_identity()
        print('JWT identity:', identity)
        user_id = int(identity)
        data = request.get_json()
        print('POST /symptoms/ data:', data)
        symptom = SymptomLog(
            user_id=user_id,
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            symptom=data['symptom'],
            severity=data['severity'],
            notes=data.get('notes')
        )
        db.session.add(symptom)
        db.session.commit()
        return jsonify({'msg': 'Symptom log added'})
    except Exception as e:
        print('Error in add_symptom:', e)
        return jsonify({'error': str(e)}), 422

@symptom_bp.route('/<int:symptom_id>/', methods=['GET'])
@jwt_required()
def get_symptom(symptom_id):
    user_id = int(get_jwt_identity())
    symptom = SymptomLog.query.filter_by(id=symptom_id, user_id=user_id).first_or_404()
    return jsonify({'id': symptom.id, 'date': symptom.date.isoformat(), 'symptom': symptom.symptom, 'severity': symptom.severity, 'notes': symptom.notes})

@symptom_bp.route('/<int:symptom_id>/', methods=['PUT'])
@jwt_required()
def update_symptom(symptom_id):
    user_id = int(get_jwt_identity())
    symptom = SymptomLog.query.filter_by(id=symptom_id, user_id=user_id).first_or_404()
    data = request.get_json()
    symptom.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    symptom.symptom = data['symptom']
    symptom.severity = data['severity']
    symptom.notes = data.get('notes')
    db.session.commit()
    return jsonify({'msg': 'Symptom log updated'})

@symptom_bp.route('/<int:symptom_id>/', methods=['DELETE'])
@jwt_required()
def delete_symptom(symptom_id):
    user_id = int(get_jwt_identity())
    symptom = SymptomLog.query.filter_by(id=symptom_id, user_id=user_id).first_or_404()
    db.session.delete(symptom)
    db.session.commit()
    return jsonify({'msg': 'Symptom log deleted'})
