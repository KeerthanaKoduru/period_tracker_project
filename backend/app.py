from flask import Flask

from extensions import db, jwt, cors


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///period_tracker.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
db.init_app(app)
jwt.init_app(app)
cors.init_app(app)


def register_blueprints(app):
    from routes import register_routes
    register_routes(app)

register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True)
