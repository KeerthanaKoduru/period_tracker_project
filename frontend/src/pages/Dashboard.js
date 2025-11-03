import React, { useEffect, useState } from "react";
import api from "../api/axios";
import CycleChart from "../components/CycleChart";

function Dashboard() {
  const [cycles, setCycles] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cycleRes, symptomRes, reminderRes] = await Promise.all([
          api.get("/cycles/"),
          api.get("/symptoms/"),
          api.get("/reminders/"),
        ]);
        setCycles(cycleRes.data);
        setSymptoms(symptomRes.data);
        setReminders(reminderRes.data);
      } catch (err) {
        // handle error (e.g., not logged in)
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Notifications/alerts logic
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!loading) {
      const notes = [];
      // Upcoming period
      if (cycles.length > 1) {
        const lengths = cycles.map(
          (c) =>
            (new Date(c.end_date) - new Date(c.start_date)) /
              (1000 * 60 * 60 * 24) +
            1
        );
        const avgCycleLength = Math.round(
          lengths.reduce((a, b) => a + b, 0) / lengths.length
        );
        const lastCycle = cycles[cycles.length - 1];
        const lastEnd = new Date(lastCycle.end_date);
        const nextPeriod = new Date(
          lastEnd.getTime() + avgCycleLength * 24 * 60 * 60 * 1000
        );
        const today = new Date();
        const daysToNext = Math.ceil(
          (nextPeriod - today) / (1000 * 60 * 60 * 24)
        );
        if (daysToNext >= 0 && daysToNext <= 5) {
          notes.push(
            `Your next period is expected in ${daysToNext} day(s) (${nextPeriod.toLocaleDateString()})`
          );
        }
        // Ovulation alert
        const ovulationDay = new Date(
          nextPeriod.getTime() - 14 * 24 * 60 * 60 * 1000
        );
        const daysToOvulation = Math.ceil(
          (ovulationDay - today) / (1000 * 60 * 60 * 24)
        );
        if (daysToOvulation >= 0 && daysToOvulation <= 3) {
          notes.push(
            `Ovulation is likely in ${daysToOvulation} day(s) (${ovulationDay.toLocaleDateString()})`
          );
        }
      }
      // Medication reminders for today
      const todayStr = new Date().toISOString().slice(0, 10);
      reminders.forEach((r) => {
        if (r.time && r.medication) {
          notes.push(
            `Reminder: Take ${r.medication} at ${r.time}${
              r.notes ? " - " + r.notes : ""
            }`
          );
        }
      });
      setNotifications(notes);
    }
  }, [loading, cycles, reminders]);

  // Calculate cycle lengths for chart
  const cycleChartData = cycles.map((c) => ({
    start_date: c.start_date,
    length:
      (new Date(c.end_date) - new Date(c.start_date)) / (1000 * 60 * 60 * 24) +
      1,
  }));

  // Ovulation prediction and health insights
  let ovulationDay = null;
  let nextPeriod = null;
  let avgCycleLength = null;
  if (cycles.length > 1) {
    // Calculate average cycle length
    const lengths = cycles.map(
      (c) =>
        (new Date(c.end_date) - new Date(c.start_date)) /
          (1000 * 60 * 60 * 24) +
        1
    );
    avgCycleLength = Math.round(
      lengths.reduce((a, b) => a + b, 0) / lengths.length
    );
    // Predict next period and ovulation
    const lastCycle = cycles[cycles.length - 1];
    const lastEnd = new Date(lastCycle.end_date);
    nextPeriod = new Date(
      lastEnd.getTime() + avgCycleLength * 24 * 60 * 60 * 1000
    );
    ovulationDay = new Date(nextPeriod.getTime() - 14 * 24 * 60 * 60 * 1000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {notifications.length > 0 && (
            <section
              style={{
                marginBottom: 32,
                background: "#fffbe6",
                border: "1px solid #ffe58f",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h2 style={{ color: "#ad8b00" }}>Notifications & Alerts</h2>
              <ul>
                {notifications.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </section>
          )}
          <section style={{ marginBottom: 32 }}>
            <h2>Cycle Summary</h2>
            <p>Total Cycles: {cycles.length}</p>
            {avgCycleLength && (
              <p>Average Cycle Length: {avgCycleLength} days</p>
            )}
            {cycles.length > 0 && <CycleChart data={cycleChartData} />}
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2>Health Insights & Predictions</h2>
            {ovulationDay && (
              <>
                <p>Next Predicted Period: {nextPeriod.toLocaleDateString()}</p>
                <p>
                  Predicted Ovulation Day: {ovulationDay.toLocaleDateString()}
                </p>
              </>
            )}
            {!ovulationDay && <p>Log at least 2 cycles for predictions.</p>}
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2>Recent Symptoms</h2>
            <ul>
              {symptoms
                .slice(-5)
                .reverse()
                .map((s) => (
                  <li key={s.id}>
                    {s.date}: {s.symptom} (Severity: {s.severity})
                  </li>
                ))}
            </ul>
          </section>
          <section>
            <h2>Upcoming Reminders</h2>
            <ul>
              {reminders
                .slice(-5)
                .reverse()
                .map((r) => (
                  <li key={r.id}>
                    {r.medication} at {r.time} {r.notes && `- ${r.notes}`}
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
