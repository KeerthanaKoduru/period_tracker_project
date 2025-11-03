import React, { useEffect, useState } from "react";
import api from "../api/axios";

function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ medication: "", time: "", notes: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  async function fetchReminders() {
    setLoading(true);
    try {
      const res = await api.get("/reminders/");
      setReminders(res.data);
    } catch (err) {}
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Frontend validation
    if (!form.medication || !form.time) {
      alert("Please fill in both medication and time.");
      return;
    }
    try {
      const payload = {
        medication: form.medication,
        time: form.time,
        notes: form.notes || undefined,
      };
      if (editingId) {
        await api.put(`/reminders/${editingId}/`, payload);
      } else {
        await api.post("/reminders/", payload);
      }
      setForm({ medication: "", time: "", notes: "" });
      setEditingId(null);
      fetchReminders();
    } catch (err) {
      alert("Failed to save reminder. Please check your input.");
    }
  }

  function handleEdit(reminder) {
    setForm({
      medication: reminder.medication,
      time: reminder.time,
      notes: reminder.notes || "",
    });
    setEditingId(reminder.id);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this reminder?")) {
      await api.delete(`/reminders/${id}/`);
      fetchReminders();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Medication Reminders</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <label>
          Medication:
          <input
            type="text"
            name="medication"
            value={form.medication}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Time:
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Notes:
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </label>
        <button type="submit" style={{ marginLeft: 16 }}>
          {editingId ? "Update" : "Add"} Reminder
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ medication: "", time: "", notes: "" });
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Reminders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Time</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr key={reminder.id}>
                <td>{reminder.medication}</td>
                <td>{reminder.time}</td>
                <td>{reminder.notes}</td>
                <td>
                  <button onClick={() => handleEdit(reminder)}>Edit</button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReminderPage;
