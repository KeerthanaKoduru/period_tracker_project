import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "../src/pages/DashboardPage";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import api, { loadToken, setAuthToken } from "./api";
import LoginPage from "./pages/LoginPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    loadToken();
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Period Tracker
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
