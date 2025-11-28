
import React from 'react';
// import type { AdminView } from "./components/AdminDashboard";

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
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
  | "customer-detail";
// Admin / Database Types

export interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Employee';
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
  id: number;
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
  status: 'Received' | 'In Progress' | 'Completed' | 'Canceled';
  description: string; // Additional requests
  serviceIds: number[];
  hash?: string; // Order hash
  totalPrice?: number;
  estimatedCompletionDate?: string;
  completionDate?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  partNumber: string;
  quantity: number;
  price: number;
  category: string;
  minStockLevel: number;
}
