// src/utils/axios.ts

import axios from "axios";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  process.env.NEXT_PUBLIC_REACT_APP_API_URL ||
  "/api";

const isAbsoluteUrl = /^https?:\/\//i.test(rawBaseUrl);
const API_BASE_URL = isAbsoluteUrl
  ? rawBaseUrl.endsWith("/api")
    ? rawBaseUrl
    : `${rawBaseUrl.replace(/\/$/, "")}/api`
  : rawBaseUrl;

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token Automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle API Errors Globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        "API Error: service unreachable. Ensure Next app and backend API are running.",
      );
    } else {
      console.error("API Error:", error.response.data || error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
