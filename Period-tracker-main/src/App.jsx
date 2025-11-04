import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CyclePage from "./pages/CyclePage";
import SymptomPage from "./pages/SymptomPage";
import MedicationReminder from "./pages/MedicationReminder";
import HomePage from "./pages/HomePage";
import api from "./api";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cycle" element={<CyclePage />} />
        <Route path="/symptom" element={<SymptomPage />} />
        <Route path="/medication-reminder" element={<MedicationReminder />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
