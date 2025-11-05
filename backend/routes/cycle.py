from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from models import Cycle
from schemas import CycleSchema
 
cycle_bp = Blueprint("cycle_bp", __name__)
 
cycle_schema = CycleSchema()
cycles_schema = CycleSchema(many=True)
 
 
# ➤ GET all cycles for logged-in user
@cycle_bp.route("/api/cycles", methods=["GET"])
@jwt_required()
def get_cycles():
    user_id = int(get_jwt_identity())  # Convert identity to int
    cycles = Cycle.query.filter_by(user_id=user_id).all()
    return jsonify(cycles_schema.dump(cycles)), 200
 
 
# ➤ ADD a new cycle
@cycle_bp.route("/api/cycles", methods=["POST"])
@jwt_required()
def add_cycle():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
 
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    notes = data.get("notes")
 
    if not start_date:
        return jsonify({"msg": "start_date is required"}), 400
 
    try:
        start_date = datetime.fromisoformat(start_date).date()
        end_date = datetime.fromisoformat(end_date).date() if end_date else None
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
 
    new_cycle = Cycle(
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
        notes=notes,
    )
 
    db.session.add(new_cycle)
    db.session.commit()
 
    return cycle_schema.jsonify(new_cycle), 201
 
 
# ➤ DELETE a cycle (optional, if you have delete functionality)
@cycle_bp.route("/api/cycles/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cycle(id):
    user_id = int(get_jwt_identity())
    cycle = Cycle.query.filter_by(id=id, user_id=user_id).first()
 
    if not cycle:
        return jsonify({"msg": "Cycle not found"}), 404
 
    db.session.delete(cycle)
    db.session.commit()
    return jsonify({"msg": "Cycle deleted successfully"}), 200