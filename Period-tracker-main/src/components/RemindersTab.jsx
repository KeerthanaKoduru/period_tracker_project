import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import api from "../api";

export default function RemindersTab({ cycles, onRefresh }) {
  const [cycleId, setCycleId] = useState(cycles?.[0]?.id || "");
  const [title, setTitle] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [notes, setNotes] = useState("");
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (cycles && cycles.length) {
      setCycleId(cycles[0].id);
      fetchReminders(cycles[0].id);
    }
  }, [cycles]);

  async function fetchReminders(cid) {
    if (!cid) return setReminders([]);
    try {
      const res = await api.get(`/cycles/${cid}/reminders`);
      setReminders(res.data);
    } catch (err) {
      console.error(err);
      setReminders([]);
    }
  }

  const addReminder = async () => {
    if (!cycleId) return alert("Select cycle");
    if (!title || !scheduledFor)
      return alert("Title and scheduled date/time required");
    try {
      await api.post(`/cycles/${cycleId}/reminders`, {
        title,
        scheduled_for: scheduledFor,
        notes,
      });
      setTitle("");
      setScheduledFor("");
      setNotes("");
      fetchReminders(cycleId);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add reminder");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ minWidth: 260 }}>
        <Typography variant="subtitle1">Add reminder to cycle</Typography>
        <Select
          fullWidth
          value={cycleId}
          onChange={(e) => {
            setCycleId(e.target.value);
            fetchReminders(e.target.value);
          }}
        >
          {cycles?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.start_date} → {c.end_date || "-"}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="When (YYYY-MM-DDTHH:MM)"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          sx={{ mt: 2 }}
          placeholder="2025-11-05T09:30"
        />
        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={addReminder}>
          Add Reminder
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">
          Reminders for selected cycle
        </Typography>
        <List>
          {reminders.length === 0 && (
            <ListItem>
              <ListItemText primary="No reminders" />
            </ListItem>
          )}
          {reminders.map((r) => (
            <ListItem key={r.id}>
              <ListItemText
                primary={r.title}
                secondary={`${new Date(r.scheduled_for).toLocaleString()} • ${
                  r.notes || ""
                }`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
