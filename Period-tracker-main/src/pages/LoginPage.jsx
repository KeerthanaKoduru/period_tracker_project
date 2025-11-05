import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import api, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (registerMode) {
        await api.post("/auth/register", { username, password });
        setRegisterMode(false);
        alert("registered — now log in");
        return;
      }
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.access_token;
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "Error");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {registerMode ? "Register" : "Login"}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={submit}>
            {registerMode ? "Register" : "Login"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setRegisterMode(!registerMode)}
          >
            {registerMode ? "Switch to login" : "Switch to register"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
