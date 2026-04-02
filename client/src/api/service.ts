/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/service.ts
import type { Service } from "../types";
import api from "../utils/axios";

const API_URL = "/services";

// ✅ Convert backend → frontend format
const transform = (s: any): Service => ({
  id: s._id,
  name: s.service_name,
  description: s.service_description,
  names: "",
  descriptions: "",
});

export const getServices = async (): Promise<Service[]> => {
  const res = await api.get(API_URL);
  return res.data.map(transform);
};

export const addServiceAPI = async (
  service: Omit<Service, "id">,
): Promise<Service> => {
  const res = await api.post(API_URL, {
    service_name: service.name,
    service_description: service.description,
  });
  return transform(res.data);
};

export const updateServiceAPI = async (
  id: string,
  service: Omit<Service, "id">,
): Promise<Service> => {
  const res = await api.put(`${API_URL}/${id}`, {
    service_name: service.name,
    service_description: service.description,
  });
  return transform(res.data);
};

export const deleteServiceAPI = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};
