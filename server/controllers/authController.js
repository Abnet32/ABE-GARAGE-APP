import Employee from "../models/Employee.js";
import EmployeeInfo from "../models/EmployeeInfo.js";
import EmployeePass from "../models/EmployeePass.js";
import EmployeeRole from "../models/EmployeeRole.js";
import CompanyRole from "../models/CompanyRole.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !emailPattern.test(String(email).trim())) {
      return res
        .status(400)
        .json({ message: "Valid email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const employee =
      (await Employee.findOne({ email: normalizedEmail })) ||
      (await Employee.findOne({
        email: {
          $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      }));
    if (!employee)
      return res.status(400).json({ message: "Invalid email or password" });

    const empPass = await EmployeePass.findOne({ employee_id: employee._id });
    if (!empPass)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(
      password,
      empPass.employee_password_hashed,
    );
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const empRole = await EmployeeRole.findOne({ employee_id: employee._id });
    const roleDoc = empRole
      ? await CompanyRole.findById(empRole.company_role_id)
      : null;
    const role = roleDoc
      ? String(roleDoc.company_role_name).trim().toLowerCase()
      : "employee";

    const secret = getJwtSecret();
    const token = jwt.sign({ id: employee._id, role }, secret, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !role ||
      !emailPattern.test(String(email).trim()) ||
      String(password).length < 8
    ) {
      return res.status(400).json({
        message:
          "firstName, lastName, phone, role, valid email, and password (min 8 chars) are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await Employee.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const employee = await Employee.create({ email: normalizedEmail });

    await EmployeeInfo.create({
      employee_id: employee._id,
      first_name: String(firstName).trim(),
      last_name: String(lastName).trim(),
      phone: String(phone).trim(),
    });

    const hashed = await bcrypt.hash(password, 10);
    await EmployeePass.create({
      employee_id: employee._id,
      employee_password_hashed: hashed,
    });

    const normalizedRole = String(role).trim().toLowerCase();

    let roleDoc = await CompanyRole.findOne({
      company_role_name: normalizedRole,
    });
    if (!roleDoc)
      roleDoc = await CompanyRole.create({
        company_role_name: normalizedRole,
      });

    await EmployeeRole.create({
      employee_id: employee._id,
      company_role_id: roleDoc._id,
    });

    const secret = getJwtSecret();
    const token = jwt.sign({ id: employee._id, role: normalizedRole }, secret, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      role: normalizedRole,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
