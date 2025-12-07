import Inventory from "../models/Inventory.js";

// -----------------------------
// GET ALL INVENTORY ITEMS
// -----------------------------
export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory items" });
  }
};

// -----------------------------
// GET SINGLE INVENTORY ITEM BY ID
// -----------------------------
export const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory item" });
  }
};

// -----------------------------
// CREATE NEW INVENTORY ITEM
// -----------------------------
export const createInventoryItem = async (req, res) => {
  try {
    const { name, part_number, category, quantity, price, min_stock_level } =
      req.body;

    const newItem = await Inventory.create({
      name,
      part_number,
      category,
      quantity,
      price,
      min_stock_level,
    });

    res.json({ message: "Inventory item created", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to create inventory item" });
  }
};

// -----------------------------
// UPDATE INVENTORY ITEM
// -----------------------------
export const updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Inventory item updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update inventory item" });
  }
};

// -----------------------------
// DELETE INVENTORY ITEM
// -----------------------------
export const deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
};
