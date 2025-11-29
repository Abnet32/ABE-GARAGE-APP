import axios from "axios";

// Base URL for your backend
const API_BASE_URL = "http://localhost:5000/api";

interface LoginResponse {
  token: string;
  role: string;
  userId?: string;
  message?: string;
}

// Admin login data
interface AdminLoginData {
  email: string;
  password: string;
}

// Employee / Customer login data
interface UserLoginData {
  email: string;
  phone: string;
}

// Unified login function
export const loginUser = async (
  data: AdminLoginData | UserLoginData,
  role: "admin" | "employee" | "customer"
): Promise<LoginResponse> => {
  let url = "";

  if (role === "admin") url = `${API_BASE_URL}/auth/login`;
  else if (role === "employee") url = `${API_BASE_URL}/employees/login`;
  else if (role === "customer") url = `${API_BASE_URL}/customers/login`;

  const response = await axios.post<LoginResponse>(url, data);
  return response.data;
};

// Optional: register function
interface RegisterData {
  email: string;
  password: string;
  role?: "admin" | "employee" | "customer";
}

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return response.data;
};
