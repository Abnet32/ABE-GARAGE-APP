// backend/routes/serviceRoutes
import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", auth, adminOnly, getAllServices); // GET all
router.get("/:id", auth, adminOnly, getServiceById); // GET by ID
router.post("/", auth, adminOnly, createService); // CREATE
router.put("/:id", auth, adminOnly, updateService); // UPDATE
router.delete("/:id", auth, adminOnly, deleteService); // DELETE (soft)

export default router;
