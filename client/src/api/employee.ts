import api from "../utils/axios";

const API_URL = "/employees";

export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Employee" | "Manager" | "Admin";
  password: string;
  active: boolean;
}

// GET all employees
export const getEmployees = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// ADD new employee
export const addEmployee = async (data: EmployeeData) => {
  const response = await api.post(`${API_URL}/add`, data);
  return response.data;
};

// UPDATE existing employee
export const updateEmployee = async (id: string, data: EmployeeData) => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE employee
export const deleteEmployee = async (id: string) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
