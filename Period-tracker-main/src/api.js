import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("pt_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("pt_token");
  }
}

export function loadToken() {
  const t = localStorage.getItem("pt_token");
  if (t) setAuthToken(t);
}

export default api;
