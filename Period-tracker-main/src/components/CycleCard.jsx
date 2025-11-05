import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Divider,
} from "@mui/material";
import api from "../api";

export default function CycleCard({ cycle, onRefresh }) {
  const handleDelete = async () => {
    if (!confirm("Delete this cycle?")) return;
    try {
      await api.delete(`/cycles/${cycle.id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2">Start: {cycle.start_date}</Typography>
        <Typography variant="subtitle2">
          End: {cycle.end_date || "-"}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2">{cycle.notes}</Typography>

        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
          Symptoms: {cycle.symptoms?.length || 0} • Reminders:{" "}
          {cycle.reminders?.length || 0}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            navigator.clipboard?.writeText(JSON.stringify(cycle));
            alert("Cycle copied to clipboard");
          }}
        >
          Copy
        </Button>
        <Button size="small" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
