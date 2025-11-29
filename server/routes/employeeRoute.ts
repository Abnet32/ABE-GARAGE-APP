import express from "express";
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  employeeLogin,
} from "../controllers/employeeController.ts";

const router = express.Router();

router.get("/", getAllEmployees);
router.post("/login", employeeLogin);
router.post("/add", addEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
