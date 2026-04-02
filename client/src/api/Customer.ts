import api from "../utils/axios";

const API_URL = "/customers";

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
}

// Add new customer
export const addCustomer = async (data: CustomerData) => {
  const response = await api.post(`${API_URL}/register`, data);
  return response.data;
};

// Update existing customer
export const updateCustomer = async (id: string, data: CustomerData) => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data;
};

// get all customers
export const getCustomers = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (err: unknown) {
    console.error("Failed to fetch customers:", err);
    throw err;
  }
};
