import React, { useEffect, useState } from "react";
import api from "../api/axios";

function SymptomPage() {
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm] = useState({
    date: "",
    symptom: "",
    severity: 1,
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  async function fetchSymptoms() {
    setLoading(true);
    try {
      const res = await api.get("/symptoms/");
      setSymptoms(res.data);
    } catch (err) {}
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Frontend validation
    if (!form.date || !form.symptom || !form.severity) {
      alert("Please fill in all required fields.");
      return;
    }
    if (form.severity < 1 || form.severity > 10) {
      alert("Severity must be between 1 and 10.");
      return;
    }
    try {
      const payload = {
        date: form.date,
        symptom: form.symptom,
        severity: Number(form.severity),
        notes: form.notes || undefined,
      };
      if (editingId) {
        await api.put(`/symptoms/${editingId}/`, payload);
      } else {
        await api.post("/symptoms/", payload);
      }
      setForm({ date: "", symptom: "", severity: 1, notes: "" });
      setEditingId(null);
      fetchSymptoms();
    } catch (err) {
      alert("Failed to save symptom log. Please check your input.");
    }
  }

  function handleEdit(symptom) {
    setForm({
      date: symptom.date,
      symptom: symptom.symptom,
      severity: symptom.severity,
      notes: symptom.notes || "",
    });
    setEditingId(symptom.id);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this symptom log?")) {
      await api.delete(`/symptoms/${id}/`);
      fetchSymptoms();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Symptom Tracking</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Symptom:
          <input
            type="text"
            name="symptom"
            value={form.symptom}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Severity:
          <input
            type="number"
            name="severity"
            min="1"
            max="10"
            value={form.severity}
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
          {editingId ? "Update" : "Add"} Symptom
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ date: "", symptom: "", severity: 1, notes: "" });
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Symptom History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Symptom</th>
              <th>Severity</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {symptoms.map((symptom) => (
              <tr key={symptom.id}>
                <td>{symptom.date}</td>
                <td>{symptom.symptom}</td>
                <td>{symptom.severity}</td>
                <td>{symptom.notes}</td>
                <td>
                  <button onClick={() => handleEdit(symptom)}>Edit</button>
                  <button
                    onClick={() => handleDelete(symptom.id)}
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

export default SymptomPage;
