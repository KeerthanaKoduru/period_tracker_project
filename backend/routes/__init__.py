from .user import user_bp
from .cycle import cycle_bp
from .symptom import symptom_bp
from .reminder import reminder_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(cycle_bp)
    app.register_blueprint(symptom_bp)
    app.register_blueprint(reminder_bp)
