import express from "express";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", auth, adminOnly, getVehicles);
router.get("/:id", auth, adminOnly, getVehicleById);
router.post("/", auth, adminOnly, createVehicle);
router.put("/:id", auth, adminOnly, updateVehicle);
router.delete("/:id", auth, adminOnly, deleteVehicle);

export default router;
