import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxied to Express backend
});

export const loginUser = (username, password) =>
  api.post("/auth/login", { username, password });

export const registerUser = (username, password) =>
  api.post("/auth/register", { username, password });

export default api;
