/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/vehicle.ts
import api from "../utils/axios";

const API_BASE = "/vehicles";

export const createVehicle = async (payload: {
  customer_id: string;
  year?: string;
  make?: string;
  model?: string;
  type?: string;
  mileage?: number | string;
  tag?: string;
  serial_number?: string;
  color?: string;
}) => {
  const res = await api.post(API_BASE, payload);
  return res.data;
};

// optional helper: get vehicles by customer (if your backend supports it)
// If your backend doesn't have /api/vehicles/customer/:id you can omit using this.
export const getVehiclesByCustomer = async (customerId: string) => {
  try {
    const res = await api.get(`${API_BASE}/customer/${customerId}`);
    return res.data;
  } catch (err) {
    // fallback: get all and filter client-side if server endpoint not available
    const all = await api.get(API_BASE);
    return all.data.filter(
      (v: any) => String(v.customer_id) === String(customerId),
    );
  }
};
