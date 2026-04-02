import express from "express";
import {
  getDashboardSummary,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard/summary", auth, adminOnly, getDashboardSummary);
router.get("/", auth, adminOnly, getOrders);
router.get("/:id", auth, adminOnly, getOrderById);
router.post("/", auth, adminOnly, createOrder);
router.put("/:id", auth, adminOnly, updateOrder);
router.delete("/:id", auth, adminOnly, deleteOrder);

export default router;
