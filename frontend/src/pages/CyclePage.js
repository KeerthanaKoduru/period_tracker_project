import React, { useEffect, useState } from "react";
import api from "../api/axios";

function CyclePage() {
  const [cycles, setCycles] = useState([]);
  const [form, setForm] = useState({ start_date: "", end_date: "", notes: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  async function fetchCycles() {
    setLoading(true);
    try {
      const res = await api.get("/cycles/");
      setCycles(res.data);
    } catch (err) {}
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Frontend validation
    if (!form.start_date || !form.end_date) {
      alert("Please fill in both start and end dates.");
      return;
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      alert("End date cannot be before start date.");
      return;
    }
    try {
      const payload = {
        start_date: form.start_date,
        end_date: form.end_date,
        notes: form.notes || undefined,
      };
      if (editingId) {
        await api.put(`/cycles/${editingId}/`, payload);
      } else {
        await api.post("/cycles/", payload);
      }
      setForm({ start_date: "", end_date: "", notes: "" });
      setEditingId(null);
      fetchCycles();
    } catch (err) {
      alert("Failed to save cycle log. Please check your input.");
    }
  }

  function handleEdit(cycle) {
    setForm({
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      notes: cycle.notes || "",
    });
    setEditingId(cycle.id);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this cycle log?")) {
      await api.delete(`/cycles/${id}/`);
      fetchCycles();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Cycle Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          End Date:
          <input
            type="date"
            name="end_date"
            value={form.end_date}
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
          {editingId ? "Update" : "Add"} Cycle
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ start_date: "", end_date: "", notes: "" });
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Cycle History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.start_date}</td>
                <td>{cycle.end_date}</td>
                <td>{cycle.notes}</td>
                <td>
                  <button onClick={() => handleEdit(cycle)}>Edit</button>
                  <button
                    onClick={() => handleDelete(cycle.id)}
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

export default CyclePage;
