import express from "express";
import {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", auth, adminOnly, getInventory);
router.get("/:id", auth, adminOnly, getInventoryById);
router.post("/", auth, adminOnly, createInventoryItem);
router.put("/:id", auth, adminOnly, updateInventoryItem);
router.delete("/:id", auth, adminOnly, deleteInventoryItem);

export default router;
