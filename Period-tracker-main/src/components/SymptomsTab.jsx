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

export default function SymptomsTab({ cycles, onRefresh }) {
  const [cycleId, setCycleId] = useState(cycles?.[0]?.id || "");
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState(1);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    if (cycles && cycles.length) {
      setCycleId(cycles[0].id);
      fetchSymptoms(cycles[0].id);
    } else {
      setSymptoms([]);
      setCycleId("");
    }
  }, [cycles]);

  async function fetchSymptoms(cid) {
    if (!cid) return setSymptoms([]);
    try {
      const res = await api.get(`/cycles/${cid}/symptoms`);
      setSymptoms(res.data);
    } catch (err) {
      console.error(err);
      setSymptoms([]);
    }
  }

  const addSymptom = async () => {
    if (!cycleId) return alert("Select cycle");
    try {
      await api.post(`/cycles/${cycleId}/symptoms`, { name, severity });
      setName("");
      setSeverity(1);
      fetchSymptoms(cycleId);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add symptom");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ minWidth: 260 }}>
        <Typography variant="subtitle1">Add symptom to cycle</Typography>
        <Select
          fullWidth
          value={cycleId}
          onChange={(e) => {
            setCycleId(e.target.value);
            fetchSymptoms(e.target.value);
          }}
        >
          {cycles?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.start_date} → {c.end_date || "-"}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Symptom name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Severity (1-5)"
          value={severity}
          type="number"
          onChange={(e) => setSeverity(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={addSymptom}>
          Add Symptom
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">Symptoms for selected cycle</Typography>
        <List>
          {symptoms.length === 0 && (
            <ListItem>
              <ListItemText primary="No symptoms recorded" />
            </ListItem>
          )}
          {symptoms.map((s) => (
            <ListItem key={s.id}>
              <ListItemText
                primary={s.name}
                secondary={`Severity ${s.severity} • ${new Date(
                  s.created_at
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
