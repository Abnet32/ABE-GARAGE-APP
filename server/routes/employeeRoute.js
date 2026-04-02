import express from "express";
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  employeeLogin,
} from "../controllers/employeeController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", employeeLogin);
router.get("/", auth, adminOnly, getAllEmployees);
router.post("/add", auth, adminOnly, addEmployee);
router.put("/:id", auth, adminOnly, updateEmployee);
router.delete("/:id", auth, adminOnly, deleteEmployee);

export default router;
