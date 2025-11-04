import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const MedicationReminder = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    medication: "",
    time: "",
    notes: "",
  });

  const token = localStorage.getItem("token");

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/reminders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [token]);

  // Add new reminder
  const handleAdd = async () => {
    if (!newReminder.medication || !newReminder.time) {
      alert("Please enter both medicine name and time!");
      return;
    }
    try {
      await fetch("http://127.0.0.1:5000/api/reminders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReminder),
      });
      await fetchReminders();
      setNewReminder({ medication: "", time: "", notes: "" });
    } catch (err) {
      console.error("Error adding reminder:", err);
    }
  };

  // Delete reminder
  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/reminders/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchReminders();
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          bgcolor: "#ffebf3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "90%",
            maxWidth: 600,
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 3, fontWeight: "bold", color: "#ff7eb9" }}
          >
            Medication Reminder
          </Typography>

          {/* Add Reminder Form */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Medicine Name"
                fullWidth
                value={newReminder.medication}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, medication: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                fullWidth
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes (optional)"
                fullWidth
                value={newReminder.notes}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, notes: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                onClick={handleAdd}
                sx={{
                  backgroundColor: "#ff7eb9",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#ff5ca8" },
                }}
              >
                Add Reminder
              </Button>
            </Grid>
          </Grid>

          {/* Reminder List */}
          {reminders.map((reminder) => (
            <Paper
              key={reminder.id}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#fff0f7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: "bold", color: "#333" }}>
                  {reminder.medication}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  ⏰ {reminder.time}
                </Typography>
                {reminder.notes && (
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    📝 {reminder.notes}
                  </Typography>
                )}
              </Box>
              <IconButton
                color="error"
                onClick={() => handleDelete(reminder.id)}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </Paper>

        {/* Back Button */}
        <Button
          variant="outlined"
          sx={{
            color: "#00b894",
            borderColor: "#00b894",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#eafff7" },
          }}
          onClick={() => navigate("/home")}
        >
          ← Back to Home Page
        </Button>
      </Box>
    </>
  );
};

export default MedicationReminder;
