/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/order.ts
import api from "../utils/axios";
import type {
  Order as FOrder,
  Customer as FCustomer,
  Vehicle as FVehicle,
  Employee as FEmployee,
} from "../types";

const API_URL = "/orders";

export interface CreateOrderData {
  customer_id: string;
  vehicle_id: string;
  employee_id?: string;
  services?: string[];
  total_price?: number;
  description?: string;
}

export interface UpdateStatusData {
  order_status: "Received" | "In Progress" | "Completed" | "Canceled";
}

export const searchCustomersAPI = async (query: any) =>
  api.get(`/customers/search?q=${query}`).then((res) => res.data);

/** ---------- Helpers ---------- **/

// Safe pick for backend keys using snake_case or camelCase
const pick = (obj: any, ...keys: string[]) => {
  for (const k of keys) {
    if (obj == null) continue;
    if (k in obj) return obj[k];
  }
  return undefined;
};

// Convert a Mongo ObjectId or string id into a numeric id for your frontend types
const toNumberId = (id: string | number | undefined | null): number => {
  if (id === null || id === undefined) return 0;
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const parsed = parseInt(id, 10);
    if (!isNaN(parsed) && parsed.toString() === id) return parsed;
    // Otherwise hash last 8 chars for consistency
    const s = id.slice(-8);
    let acc = 0;
    for (let i = 0; i < s.length; i++) {
      acc = (acc * 31 + s.charCodeAt(i)) >>> 0;
    }
    return acc % 10000000; // keep number in a reasonable range
  }
  return 0;
};

const fmtDate = (d: any): string => {
  if (!d) return new Date().toISOString().split("T")[0];
  if (d instanceof Date) return d.toISOString().split("T")[0];
  if (typeof d === "string") return d.split("T")[0];
  return new Date().toISOString().split("T")[0];
};

/** Map backend nested documents to frontend shapes (types.ts) */
const mapCustomer = (c: any): FCustomer => ({
  id: toNumberId(pick(c, "_id", "customer_id", "id")),
  email: pick(c, "email"),
  phone: pick(c, "phone_number", "phone"),
  firstName: pick(c, "first_name", "firstName") || "",
  lastName: pick(c, "last_name", "lastName") || "",
  active: pick(c, "active_customer_status", "active") ?? true,
  addedDate: pick(c, "added_date", "createdAt")
    ? fmtDate(pick(c, "added_date", "createdAt"))
    : fmtDate(null),
  hash: pick(c, "customer_hash", "hash"),
});

const mapVehicle = (v: any): FVehicle => ({
  id: toNumberId(pick(v, "_id", "id")),
  customerId: toNumberId(pick(v, "customer_id")),
  year: pick(v, "year"),
  make: pick(v, "make"),
  model: pick(v, "model"),
  type: pick(v, "type") || "",
  mileage: String(pick(v, "mileage") ?? ""),
  tag: pick(v, "tag") ?? "",
  serial: pick(v, "serial") ?? "",
  color: pick(v, "color") ?? "",
});

const mapEmployee = (e: any): FEmployee => ({
  id: toNumberId(pick(e, "_id", "employee_id", "id")),
  email: pick(e, "email"),
  firstName: pick(e, "first_name", "firstName") || "",
  lastName: pick(e, "last_name", "lastName") || "",
  phone: pick(e, "phone") ?? "",
  role: "Employee",
  active: pick(e, "active_employee", "active") ?? true,
  addedDate: pick(e, "added_date", "createdAt")
    ? fmtDate(pick(e, "added_date", "createdAt"))
    : fmtDate(null),
});

/** Convert a single backend order to your frontend Order type (flat) */
const transformOrder = (data: any): FOrder => {
  const customerObj =
    data.customer_id && typeof data.customer_id === "object"
      ? data.customer_id
      : null;
  const vehicleObj =
    data.vehicle_id && typeof data.vehicle_id === "object"
      ? data.vehicle_id
      : null;
  const employeeObj =
    data.employee_id && typeof data.employee_id === "object"
      ? data.employee_id
      : null;

  const serviceIdsRaw = Array.isArray(data.services)
    ? data.services.map(
        (s: any) => pick(s, "service_id", "_id", "serviceId", "id") ?? s,
      )
    : [];

  return {
    id: toNumberId(pick(data, "_id", "id")),
    customerId: toNumberId(
      pick(customerObj ?? data, "_id", "customer_id", "id"),
    ),
    vehicleId: toNumberId(pick(vehicleObj ?? data, "_id", "vehicle_id", "id")),
    employeeId: employeeObj
      ? toNumberId(pick(employeeObj, "_id", "employee_id", "id"))
      : undefined,
    date: fmtDate(pick(data, "order_date", "createdAt")),
    status: (pick(data, "order_status", "status") ||
      "Received") as FOrder["status"],
    description:
      pick(data, "info")?.order_additional_requests ||
      pick(data, "description") ||
      "",
    serviceIds: serviceIdsRaw.map((x: any) => toNumberId(x)),
    hash: pick(data, "order_hash", "hash"),
    totalPrice:
      pick(data, "info")?.order_total_price ?? pick(data, "totalPrice") ?? 0,
    estimatedCompletionDate: pick(data, "info")?.order_estimated_completion_date
      ? fmtDate(pick(data, "info")?.order_estimated_completion_date)
      : undefined,
    completionDate: pick(data, "info")?.order_completion_date
      ? fmtDate(pick(data, "info")?.order_completion_date)
      : undefined,
  };
};

/** Normalize a backend orders array into { orders, customers, vehicles, employees } */
const normalizeBackendOrders = (backendOrders: any[]) => {
  const customersMap = new Map<number, FCustomer>();
  const vehiclesMap = new Map<number, FVehicle>();
  const employeesMap = new Map<number, FEmployee>();
  const orders: FOrder[] = [];

  for (const o of backendOrders) {
    // Map nested objects if present
    if (
      o.customer_id &&
      typeof o.customer_id === "object" &&
      o.customer_id._id
    ) {
      const c = mapCustomer(o.customer_id);
      customersMap.set(c.id, c);
    }
    if (o.vehicle_id && typeof o.vehicle_id === "object" && o.vehicle_id._id) {
      const v = mapVehicle(o.vehicle_id);
      vehiclesMap.set(v.id, v);
    }
    if (
      o.employee_id &&
      typeof o.employee_id === "object" &&
      o.employee_id._id
    ) {
      const e = mapEmployee(o.employee_id);
      employeesMap.set(e.id, e);
    }

    // Map order
    const mapped = transformOrder(o);
    orders.push(mapped);
  }

  return {
    orders,
    customers: Array.from(customersMap.values()),
    vehicles: Array.from(vehiclesMap.values()),
    employees: Array.from(employeesMap.values()),
  };
};

/** ---------- Exported API functions (use these from components) ---------- */

// Returns normalized data { orders, customers, vehicles, employees }
export const getAllData = async (): Promise<{
  orders: FOrder[];
  customers: FCustomer[];
  vehicles: FVehicle[];
  employees: FEmployee[];
}> => {
  try {
    const res = await api.get(API_URL);
    const data = Array.isArray(res.data) ? res.data : [];
    return normalizeBackendOrders(data);
  } catch (err) {
    console.error("getAllData failed:", err);
    throw err;
  }
};

export const getOrders = async (): Promise<FOrder[]> => {
  try {
    const res = await api.get(API_URL);
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(transformOrder);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    throw err;
  }
};

export const getOrderById = async (id: string): Promise<FOrder> => {
  try {
    const res = await api.get(`${API_URL}/${id}`);
    return transformOrder(res.data);
  } catch (err) {
    console.error(`Failed to fetch order ${id}:`, err);
    throw err;
  }
};

export const createOrder = async (data: CreateOrderData): Promise<FOrder> => {
  try {
    const res = await api.post(API_URL, data);
    if (res.data?.order) return transformOrder(res.data.order);
    if (res.data?._id) return transformOrder(res.data);
    if (res.data?.orderId) return getOrderById(res.data.orderId);
    return transformOrder(res.data);
  } catch (err) {
    console.error("Failed to create order:", err);
    throw err;
  }
};

export const updateOrderStatus = async (
  id: string | number,
  status: FOrder["status"],
): Promise<FOrder> => {
  try {
    const res = await api.put(`${API_URL}/${String(id)}`, {
      order_status: status,
    });
    // Prefer to fetch the order to get populated nested objects
    if (res.data?._id) return getOrderById(res.data._id);
    return transformOrder(res.data);
  } catch (err) {
    console.error(`Failed to update order status ${id}:`, err);
    throw err;
  }
};

export const deleteOrder = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${String(id)}`);
  } catch (err) {
    console.error(`Failed to delete order ${id}:`, err);
    throw err;
  }
};
