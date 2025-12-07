// backend/routes/serviceRoutes
import express from "express";
import { getAllServices, getServiceById, createService, updateService, deleteService, } from "../controllers/serviceController";
const router = express.Router();
router.get("/", getAllServices); // GET all
router.get("/:id", getServiceById); // GET by ID
router.post("/", createService); // CREATE
router.put("/:id", updateService); // UPDATE
router.delete("/:id", deleteService); // DELETE (soft)
export default router;
