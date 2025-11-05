import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CycleCard from "./CycleCard";
import api from "../api";
import dayjs from "dayjs";

export default function CyclesTab({ cycles, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const addCycle = async () => {
    try {
      await api.post("/cycles", {
        start_date: startDate,
        end_date: endDate || null,
        notes,
      });
      setOpen(false);
      setStartDate(dayjs().format("YYYY-MM-DD"));
      setEndDate("");
      setNotes("");
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add cycle");
    }
  };

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        Add Cycle
      </Button>
      <Grid container spacing={2}>
        {cycles.length === 0 && (
          <Box sx={{ p: 2 }}>No cycles yet — add one.</Box>
        )}
        {cycles.map((c) => (
          <Grid item key={c.id} xs={12} sm={6} md={4}>
            <CycleCard cycle={c} onRefresh={onRefresh} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add cycle</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End date (optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addCycle}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
