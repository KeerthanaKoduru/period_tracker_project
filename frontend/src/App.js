import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CyclePage from "./pages/CyclePage";
import SymptomPage from "./pages/SymptomPage";
import ReminderPage from "./pages/ReminderPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div
      style={{
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#f6f8fa",
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "12px 24px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              fontWeight: 700,
              fontSize: 20,
              color: "#1890ff",
              textDecoration: "none",
              marginRight: 24,
            }}
          >
            Period Tracker
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/cycles" style={{ marginRight: 16 }}>
                Cycles
              </Link>
              <Link to="/symptoms" style={{ marginRight: 16 }}>
                Symptoms
              </Link>
              <Link to="/reminders" style={{ marginRight: 16 }}>
                Reminders
              </Link>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                background: "#1890ff",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 16px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/cycles"
            element={isAuthenticated ? <CyclePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/symptoms"
            element={
              isAuthenticated ? <SymptomPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/reminders"
            element={
              isAuthenticated ? <ReminderPage /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
