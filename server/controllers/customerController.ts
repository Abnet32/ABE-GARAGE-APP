import type { Request, Response } from "express";
import CustomerIdentifier from "../models/CustomerIdentifier.js";
import CustomerInfo from "../models/CustomerInfo.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


// customer login
export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1d" });
};

export const customerLogin = async (req: Request, res: Response) => {
  const { email, phone } = req.body;
  if (!email || !phone)
    return res.status(400).json({ message: "Email and phone are required" });

  const customer = await CustomerIdentifier.findOne({
    email,
    phone_number: phone,
  });
  if (!customer)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(customer._id.toString(), "customer");
  res.status(200).json({ token, role: "customer", userId: customer._id });
};

// GET all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    // Populate customer info
    const customers = await CustomerIdentifier.find().lean();

    const customerData = await Promise.all(
      customers.map(async (cust) => {
        const info = await CustomerInfo.findOne({ customer_id: cust._id }).lean();
        return {
          id: cust._id,
          email: cust.email,
          phone: cust.phone_number,
          firstName: info?.first_name || "",
          lastName: info?.last_name || "",
          active: true, // default if not stored, or you can add `active` in model
          addedDate: cust.createdAt,
        };
      })
    );

    res.json(customerData);
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const { email, phone, firstName, lastName } = req.body;

    // Check if customer already exists
    const existing = await CustomerIdentifier.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Customer already exists" });

    // Create new customer identifier
    const newCustomer = await CustomerIdentifier.create({
      email,
      phone_number: phone,
    });

    // Create customer info
    await CustomerInfo.create({
      customer_id: newCustomer._id,
      first_name: firstName,
      last_name: lastName,
    });

    res
      .status(201)
      .json({ message: "Customer registered", customerId: newCustomer._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // customer id
    const { email, phone, firstName, lastName, active } = req.body;

    // Find and update CustomerIdentifier
    const customer = await CustomerIdentifier.findByIdAndUpdate(
      id,
      { email, phone_number: phone },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Find and update CustomerInfo
    const info = await CustomerInfo.findOneAndUpdate(
      { customer_id: id },
      { first_name: firstName, last_name: lastName },
      { new: true }
    );

    res.json({
      message: "Customer updated successfully",
      customer: {
        id: customer._id,
        email: customer.email,
        phone: customer.phone_number,
        firstName: info?.first_name || "",
        lastName: info?.last_name || "",
        active: active ?? true,
      },
    });
  } catch (err) {
    console.error("Failed to update customer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

