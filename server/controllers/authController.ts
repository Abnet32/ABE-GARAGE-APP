import type { Request, Response } from "express";
import Employee from "../models/Employee";
import EmployeeInfo from "../models/EmployeeInfo";
import EmployeePass from "../models/EmployeePass";
import EmployeeRole from "../models/EmployeeRole";
import CompanyRole from "../models/CompanyRole";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee)
      return res.status(400).json({ message: "Invalid email or password" });

    // 2️⃣ Get employee password
    const empPass = await EmployeePass.findOne({ employee_id: employee._id });
    if (!empPass)
      return res.status(400).json({ message: "Invalid email or password" });

    // 3️⃣ Compare password
    const match = await bcrypt.compare(
      password,
      empPass.employee_password_hashed
    );
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // 4️⃣ Get employee role
    const empRole = await EmployeeRole.findOne({ employee_id: employee._id });
    const roleDoc = empRole
      ? await CompanyRole.findById(empRole.company_role_id)
      : null;
    const role = roleDoc ? roleDoc.company_role_name : "employee";

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { id: employee._id, role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    // 6️⃣ Respond with token and role
    res.json({ message: "Login successful", token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // 1️⃣ Check if employee already exists
    const existing = await Employee.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // 2️⃣ Create employee
    const employee = await Employee.create({ email });

    // 3️⃣ Create employee info
    await EmployeeInfo.create({
      employee_id: employee._id,
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    // 4️⃣ Hash password and save
    const hashed = await bcrypt.hash(password, 10);
    await EmployeePass.create({
      employee_id: employee._id,
      employee_password_hashed: hashed,
    });

    // 5️⃣ Assign role
    let roleDoc = await CompanyRole.findOne({ company_role_name: role });
    if (!roleDoc)
      roleDoc = await CompanyRole.create({ company_role_name: role });

    await EmployeeRole.create({
      employee_id: employee._id,
      company_role_id: roleDoc._id,
    });

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      { id: employee._id, role: roleDoc.company_role_name },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      role: roleDoc.company_role_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
