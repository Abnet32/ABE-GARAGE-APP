import api from "../utils/axios";

interface LoginResponse {
  token: string;
  role: string;
  userId?: string;
  message?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

// Optional: register function
interface RegisterData {
  email: string;
  password: string;
  role?: "admin" | "employee" | "customer";
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};
