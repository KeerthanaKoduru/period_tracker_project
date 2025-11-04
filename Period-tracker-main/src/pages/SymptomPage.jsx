import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Slider,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const SymptomPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood: "",
    cramps: "",
    flow: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://127.0.0.1:5000/api/symptoms/",
        {
          date: formData.date,
          mood: formData.mood,
          cramps: formData.cramps,
          flow: formData.flow,
          notes: formData.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Symptom logged successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Error submitting symptom:", err);
      alert("Failed to log symptom");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          bgcolor: "#c8f7c5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            bgcolor: "#ffffff",
            p: 5,
            borderRadius: 3,
            width: "80%",
            maxWidth: "800px",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 4, fontWeight: "bold", color: "#2e7d32" }}
          >
            Log Your Symptom
          </Typography>

          <Grid container spacing={3}>
            {/* Date Picker */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Mood Selection */}
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Mood"
                fullWidth
                value={formData.mood}
                onChange={(e) => handleChange("mood", e.target.value)}
              >
                {["Happy", "Tired", "Irritable"].map((mood) => (
                  <MenuItem key={mood} value={mood}>
                    {mood}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Cramps Selection */}
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Cramps"
                fullWidth
                value={formData.cramps}
                onChange={(e) => handleChange("cramps", e.target.value)}
              >
                {["None", "Mild", "Moderate", "Severe"].map((cramp) => (
                  <MenuItem key={cramp} value={cramp}>
                    {cramp}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Flow Selection */}
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Flow"
                fullWidth
                value={formData.flow}
                onChange={(e) => handleChange("flow", e.target.value)}
              >
                {["Light", "Medium", "Heavy"].map((flow) => (
                  <MenuItem key={flow} value={flow}>
                    {flow}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Additional Notes (optional)"
                multiline
                rows={4}
                fullWidth
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7FB77E",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                "&:hover": { backgroundColor: "#6fa86e" },
                mr: 2,
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>

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
        </Paper>
      </Box>
    </>
  );
};

export default SymptomPage;
