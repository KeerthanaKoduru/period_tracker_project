import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        navigate("/home", { state: { fromSignup: false, userName: username } });
      } else {
        alert(data.msg || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#ff7eb9", mb: 2 }}
      >
        Period Tracker & Care App
      </Typography>

      <Paper
        elevation={3}
        sx={{
          bgcolor: "#ffe6f0",
          p: 4,
          borderRadius: 3,
          width: "320px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "#333", fontWeight: "bold" }}
        >
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2, bgcolor: "#fff", borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2, bgcolor: "#fff", borderRadius: 1 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#ff7eb9",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#ff5ca8" },
            mb: 1,
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderColor: "#ff7eb9",
            color: "#ff7eb9",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#fff0f7" },
          }}
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
