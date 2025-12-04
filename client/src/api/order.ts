// src/api/order.ts
import axios from "axios";
import type { Order } from "../types";

const API_URL = "http://localhost:5000/api/orders";

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

/**
 * Transform backend order data to frontend format
 * Backend returns: { _id, customer_id: { _id, ... }, vehicle_id: { _id, ... }, info: {...}, services: [...] }
 */
const transformOrder = (data: any): Order => {
  // Extract IDs - handle both populated objects and plain IDs
  const customerId = data.customer_id?._id || data.customer_id || data.customerId;
  const vehicleId = data.vehicle_id?._id || data.vehicle_id || data.vehicleId;
  const employeeId = data.employee_id?._id || data.employee_id || data.employeeId;
  
  // Extract service IDs from services array
  const serviceIds = data.services?.map((s: any) => {
    if (typeof s === 'string' || typeof s === 'number') return s;
    return s.service_id?._id || s.service_id || s;
  }) || [];
  
  // Convert MongoDB ObjectId to number using consistent hash
  const toNumber = (id: string | number | undefined): number => {
    if (typeof id === 'number') return id;
    if (typeof id === 'string') {
      // Try to parse as number first
      const num = parseInt(id, 10);
      if (!isNaN(num) && num.toString() === id) return num;
      
      // For MongoDB ObjectId, create consistent numeric hash
      // Use last 8 characters of ObjectId for more consistent mapping
      const hashStr = id.slice(-8);
      return hashStr.split('').reduce((acc, char, idx) => {
        const charCode = char.charCodeAt(0);
        return acc + (charCode * Math.pow(31, idx));
      }, 0) % 1000000; // Keep within reasonable range
    }
    return 0;
  };

  // Format date - handle both Date objects and ISO strings
  const formatDate = (date: any): string => {
    if (!date) return new Date().toISOString().split("T")[0];
    if (date instanceof Date) return date.toISOString().split("T")[0];
    if (typeof date === 'string') {
      // If it's an ISO string, extract date part
      return date.split('T')[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  return {
    id: toNumber(data._id || data.id),
    customerId: toNumber(customerId),
    vehicleId: toNumber(vehicleId),
    employeeId: employeeId ? toNumber(employeeId) : undefined,
    date: formatDate(data.order_date || data.createdAt),
    status: (data.order_status || data.status || "Received") as Order["status"],
    description: data.info?.order_additional_requests || data.description || "",
    serviceIds: serviceIds.map(toNumber),
    hash: data.order_hash || data.hash,
    totalPrice: data.info?.order_total_price || data.totalPrice || 0,
    estimatedCompletionDate: data.info?.order_estimated_completion_date
      ? formatDate(data.info.order_estimated_completion_date)
      : undefined,
    completionDate: data.info?.order_completion_date
      ? formatDate(data.info.order_completion_date)
      : undefined,
  };
};

// GET all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(API_URL);
    const orders = Array.isArray(response.data) ? response.data : [];
    return orders.map(transformOrder);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

// GET order by ID
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return transformOrder(response.data);
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    throw error;
  }
};

// CREATE new order
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  try {
    const response = await axios.post(API_URL, data);
    
    // Backend returns { message: "Order created successfully", order: {...} }
    if (response.data.order) {
      return transformOrder(response.data.order);
    }
    
    // Fallback: if only order ID is returned, fetch the full order
    if (response.data.orderId || response.data._id) {
      return await getOrderById(response.data.orderId || response.data._id);
    }
    
    // Last resort: try to transform the response data directly
    return transformOrder(response.data);
  } catch (error: any) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

// UPDATE order status
export const updateOrderStatus = async (
  id: string | number,
  status: Order["status"]
): Promise<Order> => {
  try {
    // Map frontend status to backend format
    const statusMap: Record<string, string> = {
      "Received": "Received",
      "In Progress": "In Progress",
      "Completed": "Completed",
      "Canceled": "Canceled",
    };
    
    const response = await axios.put(`${API_URL}/${String(id)}`, {
      order_status: statusMap[status] || status,
    });
    
    // Fetch full order to get populated data
    if (response.data._id) {
      return await getOrderById(response.data._id);
    }
    return transformOrder(response.data);
  } catch (error) {
    console.error(`Failed to update order status ${id}:`, error);
    throw error;
  }
};

// DELETE order
export const deleteOrder = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${String(id)}`);
  } catch (error) {
    console.error(`Failed to delete order ${id}:`, error);
    throw error;
  }
};
