import express from "express";
import {
  customerLogin,
  getAllCustomers,
  customerRegister,
  updateCustomer,
} from "../controllers/customerController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", customerLogin);
router.get("/", auth, adminOnly, getAllCustomers);
router.post("/register", auth, adminOnly, customerRegister);
router.put("/:id", auth, adminOnly, updateCustomer);

export default router;
