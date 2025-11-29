import axios from "axios";

const API_URL = "http://localhost:5000/api/customers"; // adjust your backend endpoint

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
}

// Add new customer
export const addCustomer = async (data: CustomerData) => {
  const response = await axios.post(`${API_URL}/register`, data); // or '/add' depending on backend
  return response.data;
};

// Update existing customer
export const updateCustomer = async (id: string, data: CustomerData) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// get all customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err: unknown) {
    console.error("Failed to fetch customers:", err);
    throw err;
  }
};