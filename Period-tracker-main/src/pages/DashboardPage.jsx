import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import CyclesTab from "../components/CyclesTab";
import SymptomsTab from "../components/SymptomsTab";
import RemindersTab from "../components/RemindersTab";
import api, { loadToken } from "../api";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    loadToken();
    fetchCycles();
  }, []);

  async function fetchCycles() {
    try {
      const res = await api.get("/cycles");
      setCycles(res.data);
    } catch (err) {
      console.error(err);
      setCycles([]);
    }
  }

  // pass refresh to each tab so it can re-fetch cycles after changes
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Cycles" />
        <Tab label="Symptoms" />
        <Tab label="Medical Reminders" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && <CyclesTab cycles={cycles} onRefresh={fetchCycles} />}
        {tab === 1 && <SymptomsTab cycles={cycles} onRefresh={fetchCycles} />}
        {tab === 2 && <RemindersTab cycles={cycles} onRefresh={fetchCycles} />}
      </Box>
    </Paper>
  );
}
