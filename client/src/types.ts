import React from "react";
// import type { AdminView } from "./components/AdminDashboard";

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}
export type AdminView =
  | "dashboard"
  | "overview"
  | "orders"
  | "new-order"
  | "edit-order"
  | "calendar"
  | "inventory"
  | "employees"
  | "add-employee"
  | "edit-employee"
  | "customers"
  | "add-customer"
  | "edit-customer"
  | "services"
  | "customer-detail"
  | "employee-detail";
// Admin / Database Types

export interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "Admin" | "Manager" | "Employee" | "admin" | "manager" | "employee";
  active: boolean;
  addedDate: string;
  password?: string;
}

export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  active: boolean;
  addedDate: string;
  hash?: string; // Unique hash for public access/identification
}

export interface Vehicle {
  id: number;
  customerId: number;
  year: string;
  make: string;
  model: string;
  type: string;
  mileage: string;
  tag: string;
  serial: string;
  color: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  view?: AdminView;
  names: string;
  descriptions: string;
}
export interface Order {
  id: number;
  customerId: number;
  vehicleId: number;
  employeeId?: number; // Assigned to
  date: string;
  status: "Received" | "In Progress" | "Completed" | "Canceled";
  description: string; // Additional requests
  serviceIds: number[];
  hash?: string; // Order hash
  totalPrice?: number;
  estimatedCompletionDate?: string;
  completionDate?: string;
}

export interface InventoryItem {
  [x: string]: string | number;
  id: string;
  name: string;
  partNumber: string;
  category: string;
  quantity: number;
  price: number;
  minStockLevel: number;
}

export interface DashboardSummary {
  totals: {
    orders: number;
    pendingOrders: number;
    employees: number;
    customers: number;
    activeServices: number;
    lowStockItems: number;
  };
  statuses: {
    Received: number;
    "In Progress": number;
    Completed: number;
    Canceled: number;
  };
  revenue: {
    total: number;
  };
  recentActivity: Array<{
    id: string;
    orderHash?: string;
    status: string;
    date?: string;
    customerName: string;
  }>;
}
