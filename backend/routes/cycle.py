from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import CycleLog
from datetime import datetime

cycle_bp = Blueprint('cycle', __name__, url_prefix='/api/cycles')

@cycle_bp.route('/', methods=['GET'])
@jwt_required()
def get_cycles():
    user_id = int(get_jwt_identity())
    print('GET /cycles/ for user:', user_id)
    cycles = CycleLog.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': c.id, 'start_date': c.start_date.isoformat(), 'end_date': c.end_date.isoformat(), 'notes': c.notes} for c in cycles])

@cycle_bp.route('/', methods=['POST'])
@jwt_required()
def add_cycle():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    print('POST /cycles/ data:', data)
    try:
        cycle = CycleLog(
            user_id=user_id,
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
            notes=data.get('notes')
        )
        db.session.add(cycle)
        db.session.commit()
        return jsonify({'msg': 'Cycle log added'})
    except Exception as e:
        print('Error in add_cycle:', e)
        return jsonify({'error': str(e), 'data': data}), 422

@cycle_bp.route('/<int:cycle_id>/', methods=['GET'])
@jwt_required()
def get_cycle(cycle_id):
    user_id = int(get_jwt_identity())
    cycle = CycleLog.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
    return jsonify({'id': cycle.id, 'start_date': cycle.start_date.isoformat(), 'end_date': cycle.end_date.isoformat(), 'notes': cycle.notes})

@cycle_bp.route('/<int:cycle_id>/', methods=['PUT'])
@jwt_required()
def update_cycle(cycle_id):
    user_id = int(get_jwt_identity())
    cycle = CycleLog.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
    data = request.get_json()
    cycle.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    cycle.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    cycle.notes = data.get('notes')
    db.session.commit()
    return jsonify({'msg': 'Cycle log updated'})

@cycle_bp.route('/<int:cycle_id>/', methods=['DELETE'])
@jwt_required()
def delete_cycle(cycle_id):
    user_id = int(get_jwt_identity())
    cycle = CycleLog.query.filter_by(id=cycle_id, user_id=user_id).first_or_404()
    db.session.delete(cycle)
    db.session.commit()
    return jsonify({'msg': 'Cycle log deleted'})
