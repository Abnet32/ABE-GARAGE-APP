/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import type { InventoryItem } from "../../types";
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../api/inventory";

const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    partNumber: "",
    category: "General",
    quantity: 0,
    price: 0,
    minStockLevel: 5,
  });

  // ---------------- FETCH INVENTORY ----------------
  const fetchInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ---------------- HELPER TO TRANSFORM ITEM ----------------
  const transformItem = (item: any): InventoryItem => ({
    id: item._id,
    name: item.name,
    partNumber: item._id?.slice(0, 8).toUpperCase() || "",
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    minStockLevel: item.min_stock_level,
  });

  // ---------------- CRUD OPERATIONS ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      quantity: String(formData.quantity),
      price: String(formData.price),
      minStockLevel: String(formData.minStockLevel),
    };

    try {
      if (editingItem) {
        const updated = await updateInventoryItem(
          String(editingItem.id),
          payload,
        );
        setInventory((prev) =>
          prev.map((item) =>
            item.id === updated._id ? transformItem(updated) : item,
          ),
        );
      } else {
        const newItem = await addInventoryItem(payload);
        setInventory((prev) => [...prev, transformItem(newItem)]);
      }
      setShowForm(false);
      resetForm(); // close form after save
    } catch (err) {
      setShowForm(false);
      console.error("Failed to save item:", err);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      partNumber: item.partNumber,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      minStockLevel: item.minStockLevel,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?",
    );
    if (!confirmDelete) return;

    try {
      await deleteInventoryItem(id);
      setInventory((prev) => prev.filter((item) => String(item.id) !== id)); // live update
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      partNumber: "",
      category: "General",
      quantity: 0,
      price: 0,
      minStockLevel: 5,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
            Inventory Management
            <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Track parts, stock levels, and pricing.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-red text-white px-6 py-3 rounded font-bold text-xs uppercase flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
        >
          {showForm ? "Cancel" : "Add New Item"} <Plus size={16} />
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-brand-red animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold text-brand-blue mb-6">
            {editingItem ? "Edit Item" : "Add New Inventory Item"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Part Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-200 rounded text-sm focus:border-brand-red outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Category
              </label>
              <select
                className="w-full p-3 border border-gray-200 rounded text-sm focus:border-brand-red outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>General</option>
                <option>Engine</option>
                <option>Brakes</option>
                <option>Suspension</option>
                <option>Electrical</option>
                <option>Fluids</option>
                <option>Tires</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-3 border border-gray-200 rounded text-sm focus:border-brand-red outline-none"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-200 rounded text-sm focus:border-brand-red outline-none"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Min Stock Alert
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-3 border border-gray-200 rounded text-sm focus:border-brand-red outline-none"
                value={formData.minStockLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStockLevel: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded text-gray-600 font-bold text-xs uppercase hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-blue text-white px-8 py-3 rounded font-bold text-xs uppercase hover:bg-blue-900 shadow-md"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Total Items
            </p>
            <p className="text-3xl font-bold text-brand-blue">
              {inventory.length}
            </p>
          </div>
          <Package size={32} className="text-blue-100" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Total Value
            </p>
            <p className="text-3xl font-bold text-brand-blue">
              $
              {inventory
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toLocaleString()}
            </p>
          </div>
          <p className="text-green-500 font-bold text-xl">$</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Low Stock Alert
            </p>
            <p className="text-3xl font-bold text-brand-red">
              {inventory.filter((i) => i.quantity <= i.minStockLevel).length}
            </p>
          </div>
          <AlertTriangle size={32} className="text-red-100" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner border border-gray-200 flex items-center gap-3">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search inventory by name or part number..."
          className="w-full outline-none text-sm text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    {item.quantity <= 0 ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    ) : item.quantity <= item.minStockLevel ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-blue">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {item.partNumber}
                  </td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 font-bold">{item.quantity}</td>
                  <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(String(item.id))}
                      className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No inventory items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
