/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/inventory.ts
import api from "../utils/axios";
import type { InventoryItem } from "../types";

const API_URL = "/inventories";

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

const unwrapItem = (payload: any) => payload?.item ?? payload;

// GET all inventory
export const getInventory = async (): Promise<InventoryItem[]> => {
  const res = await api.get(API_URL);
  return (Array.isArray(res.data) ? res.data : []).map(transform);
};

// ADD new inventory item
export const addInventoryItem = async (
  item: Omit<InventoryItem, "id" | "partNumber">,
): Promise<InventoryItem> => {
  const res = await api.post(API_URL, item);
  return transform(unwrapItem(res.data));
};

// UPDATE inventory item
export const updateInventoryItem = async (
  id: string,
  item: Partial<Omit<InventoryItem, "id" | "partNumber">>,
): Promise<InventoryItem> => {
  const res = await api.put(`${API_URL}/${id}`, item);
  return transform(unwrapItem(res.data));
};

// DELETE inventory item
export const deleteInventoryItem = async (
  id: string,
): Promise<InventoryItem> => {
  const res = await api.delete(`${API_URL}/${id}`);
  return transform(unwrapItem(res.data));
};
