# Period Tracker and Care App Backend

## Setup

1. Create a virtual environment and activate it:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```python
   from app import db
   db.create_all()
   ```
4. Run the Flask app:
   ```powershell
   python app.py
   ```

## API Endpoints

- **User**
  - `POST /api/register/` - Register
  - `POST /api/login/` - Login
- **Cycle Log**
  - `GET /api/cycles/` - List cycles
  - `POST /api/cycles/` - Add cycle
  - `GET /api/cycles/<id>/` - Get cycle
  - `PUT /api/cycles/<id>/` - Update cycle
  - `DELETE /api/cycles/<id>/` - Delete cycle
- **Symptom Log**
  - `GET /api/symptoms/` - List symptoms
  - `POST /api/symptoms/` - Add symptom
  - `GET /api/symptoms/<id>/` - Get symptom
  - `PUT /api/symptoms/<id>/` - Update symptom
  - `DELETE /api/symptoms/<id>/` - Delete symptom
- **Medication Reminder**
  - `GET /api/reminders/` - List reminders
  - `POST /api/reminders/` - Add reminder
  - `GET /api/reminders/<id>/` - Get reminder
  - `PUT /api/reminders/<id>/` - Update reminder
  - `DELETE /api/reminders/<id>/` - Delete reminder

## Notes

- Uses JWT for authentication. Pass the token in the `Authorization: Bearer <token>` header.
- SQLite by default. Can be switched to PostgreSQL in `app.py`.
