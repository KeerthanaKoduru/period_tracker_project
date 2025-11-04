import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ Add this line

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // detect where user came from
  const fromSignup = location.state?.fromSignup;
  const userName = location.state?.userName || "User";

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column", // ✅ to keep Header on top
        alignItems: "center",
      }}
    >
      {/* ✅ Header added */}
      <Header />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "20px",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", color: "#ff7eb9" }}
          >
            Hi, {userName}! 👋
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
            {fromSignup
              ? "Your account is ready 🎉 Let’s get started!"
              : "Welcome back! Choose where you’d like to go today."}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff7eb9",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff94c2" },
              }}
              onClick={() => navigate("/cycle")}
            >
              View Cycle Tracker
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff7eb9",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff94c2" },
              }}
              onClick={() => navigate("/medication-reminder")}
            >
              Medication Reminder
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff7eb9",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff94c2" },
              }}
              onClick={() => navigate("/symptom")}
            >
              Symptom Tracker
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;