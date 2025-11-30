// src/api/inventory.ts
import axios from "axios";
import type { InventoryItem } from "../types.ts";

const API_URL = "http://localhost:5000/api/inventories"; // adjust to your backend

// Helper to map backend response to frontend InventoryItem
const transform = (item: any): InventoryItem => ({
  id: item._id,
  name: item.name,
  partNumber: item._id.slice(0, 8).toUpperCase(), // generate SKU from _id
  category: item.category,
  quantity: item.quantity,
  price: item.price,
  minStockLevel: item.min_stock_level, // map snake_case to camelCase
});

// GET all inventory
export const getInventory = async (): Promise<InventoryItem[]> => {
  const res = await axios.get(API_URL);
  return res.data.map(transform);
};

// ADD new inventory item
export const addInventoryItem = async (
  item: Omit<InventoryItem, "id" | "partNumber">
): Promise<InventoryItem> => {
  const res = await axios.post(API_URL, item);
  return transform(res.data);
};

// UPDATE inventory item
export const updateInventoryItem = async (
  id: string,
  item: Partial<Omit<InventoryItem, "id" | "partNumber">>
): Promise<InventoryItem> => {
  const res = await axios.put(`${API_URL}/${id}`, item);
  return transform(res.data);
};

// DELETE inventory item
export const deleteInventoryItem = async (
  id: string
): Promise<InventoryItem> => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return transform(res.data);
};
