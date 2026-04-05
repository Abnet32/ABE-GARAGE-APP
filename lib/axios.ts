// src/utils/axios.ts

import axios from "axios";

const API_BASE_URL = "/api";

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return String(error || "Unknown error");
  }

  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
    return JSON.stringify(data);
  }

  return error.message || "Unknown API error";
};

// Handle API Errors Globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        "API Error: service unreachable. Ensure Next app and backend API are running.",
      );
    } else {
      console.error("API Error:", getErrorMessage(error));
    }
    return Promise.reject(error);
  },
);

export default api;
