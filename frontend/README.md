# Period Tracker and Care App Frontend

## Setup

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the development server:
   ```powershell
   npm start
   ```

## Features

- Dashboard: Cycle summary, health insights, reminders
- Cycle Management: Log and view cycles
- Symptom Tracking: Log and view symptoms
- Medication Reminders: Set and view reminders
- Authentication: Register and login
- Data visualization with Chart.js or Recharts

## API

- Connects to Flask backend at `/api/`
- Use Axios for API calls

## Folder Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main app pages (Dashboard, Cycle, Symptom, Reminder, Auth)
- `src/api/` - Axios API logic
- `src/App.js` - Main app and routing
