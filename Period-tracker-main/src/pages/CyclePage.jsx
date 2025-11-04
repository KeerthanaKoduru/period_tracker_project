import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const CyclePage = () => {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  // ✅ Fetch existing cycles from backend
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/api/cycles/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch cycles");
        const data = await res.json();
        setCycles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCycles();
  }, []);

  // ✅ Submit new cycle
  const handleAddCycle = async () => {
    if (!startDate || !endDate) {
      alert("Please fill both start and end dates!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/cycles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          notes,
        }),
      });

      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to add cycle");

      // After adding, refetch all cycles for up-to-date list
      const fetchCycles = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://127.0.0.1:5000/api/cycles/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch cycles");
          const data = await res.json();
          setCycles(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
        }
      };
      await fetchCycles();
      setOpenDialog(false);
      setStartDate("");
      setEndDate("");
      setNotes("");
      alert("Cycle added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding cycle log");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#ff7eb9" }}
        >
          Your Cycle Overview
        </Typography>

        {/* Cycle Log Chart */}
        <Paper elevation={3} sx={{ width: "80%", p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
            Cycle History
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cycles}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="start_date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="id"
                stroke="#ff7eb9"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff7eb9",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#ff94c2" },
            }}
            onClick={() => setOpenDialog(true)}
          >
            Add Cycle Log
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#ff7eb9",
              borderColor: "#ff7eb9",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#fff0f5" },
            }}
            onClick={() => navigate("/home")}
          >
            ← Back to Home Page
          </Button>
        </Box>

        {/* Add Cycle Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle sx={{ color: "#ff7eb9", fontWeight: "bold" }}>
            Add New Cycle Log
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ color: "#ff7eb9", fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff7eb9",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff94c2" },
              }}
              onClick={handleAddCycle}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default CyclePage;
