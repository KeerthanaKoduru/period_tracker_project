import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#ff7eb9",
        width: "100%",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 6 },
          minHeight: { xs: 64, sm: 70 },
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo + App Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 1,
            minWidth: 0,
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="App Logo"
            style={{ height: 40, marginRight: 10, flexShrink: 0 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              fontStyle: "italic",
              fontFamily: "'Poppins', sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            HerSync
          </Typography>
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              backgroundColor: "#fff",
              color: "#ff7eb9",
              fontWeight: "bold",
              textTransform: "none",
              whiteSpace: "nowrap",
              fontFamily: "'Poppins', sans-serif",
              "&:hover": { backgroundColor: "#ffe6f0" },
            }}
          >
            Go Back to Dashboard
          </Button>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#a8f0d6",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              whiteSpace: "nowrap",
              fontFamily: "'Poppins', sans-serif",
              "&:hover": { backgroundColor: "#7ee0c0" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;