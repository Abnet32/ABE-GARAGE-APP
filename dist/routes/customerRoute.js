import express from "express";
import { customerLogin, getAllCustomers, customerRegister, updateCustomer } from "../controllers/customerController";
const router = express.Router();
router.post("/login", customerLogin);
router.get("/", getAllCustomers);
router.post("/register", customerRegister);
router.put("/:id", updateCustomer);
export default router;
