import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: `
          linear-gradient(135deg, #e6fff5 0%, #ccfff0 40%, #f0fff9 100%)
        `,
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "rgba(255, 126, 185, 0.9)",
          backdropFilter: "blur(10px)",
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
          }}
        >
          {/* Logo + App Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="App Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontStyle: "italic",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              HerSync
            </Typography>
          </Box>

          <Box>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                mr: 2,
                backgroundColor: "#fff",
                color: "#ff7eb9",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ffe6f0" },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{
                backgroundColor: "#a8f0d6",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#7ee0c0" },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Section */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: 2,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Glass effect container */}
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(15px)",
            borderRadius: "24px",
            padding: "40px 60px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            maxWidth: "700px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              mb: 2,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Welcome to{" "}
            <span style={{ color: "#ff7eb9", fontStyle: "italic" }}>HerSync</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#555",
              maxWidth: "600px",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.1rem",
              lineHeight: 1.8,
            }}
          >
            <i>
              "Because your body’s rhythm deserves attention, not confusion —  
              track your flow, understand your mood, and embrace every phase
              with confidence."
            </i>
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          bgcolor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            fontStyle: "italic",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          © 2025 <span style={{ color: "#ff7eb9" }}>HerSync</span>. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
