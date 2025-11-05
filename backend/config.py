import os
from dotenv import load_dotenv
 
load_dotenv()
 
class Config:
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "defaultsecret")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///period_tracker.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "defaultsecret")