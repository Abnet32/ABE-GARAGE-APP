import dotenv from "dotenv";
dotenv.config();

import connectDB from "../configs/db.js";

import Employee from "../models/Employee.js";
import EmployeeInfo from "../models/EmployeeInfo.js";
import EmployeePass from "../models/EmployeePass.js";
import CompanyRole from "../models/CompanyRole.js";
import EmployeeRole from "../models/EmployeeRole.js";
import CustomerIdentifier from "../models/CustomerIdentifier.js";
import CustomerInfo from "../models/CustomerInfo.js";
import CommonService from "../models/CommonService.js";
import Vehicle from "../models/Vehicle.js";
import Order from "../models/Order.js";
import OrderInfo from "../models/OrderInfo.js";
import OrderService from "../models/OrderService.js";

import bcrypt from "bcryptjs";

const seed = async () => {
  try {
    console.log("📡 Connecting to database...");
    await connectDB();
    console.log("✅ Connected!");

    // -----------------------------------
    // CLEAR DATABASE
    // -----------------------------------
    console.log("🧹 Clearing collections...");

    await Promise.all([
      Employee.deleteMany({}),
      EmployeeInfo.deleteMany({}),
      EmployeePass.deleteMany({}),
      CompanyRole.deleteMany({}),
      EmployeeRole.deleteMany({}),
      CustomerIdentifier.deleteMany({}),
      CustomerInfo.deleteMany({}),
      CommonService.deleteMany({}),
      Vehicle.deleteMany({}),
      Order.deleteMany({}),
      OrderInfo.deleteMany({}),
      OrderService.deleteMany({}),
    ]);

    console.log("✅ Collections cleared");

    // -----------------------------------
    // ROLES
    // -----------------------------------

    console.log("🌱 Creating roles...");

    const [adminRole, managerRole, employeeRole] = await Promise.all([
      CompanyRole.create({ company_role_name: "admin" }),
      CompanyRole.create({ company_role_name: "manager" }),
      CompanyRole.create({ company_role_name: "employee" }),
    ]);

    console.log("➕ Created roles");

    // -----------------------------------
    // ADMIN EMPLOYEE
    // -----------------------------------

    console.log("🌱 Creating admin user...");

    const admin = await Employee.create({
      email: "admin@abe-garage.com",
    });

    await EmployeeInfo.create({
      employee_id: admin._id,
      first_name: "Abnet",
      last_name: "Mekonen",
      phone: "+251...",
    });

    const hashed = await bcrypt.hash("abe-garage123", 10);

    await EmployeePass.create({
      employee_id: admin._id,
      employee_password_hashed: hashed,
    });

    await EmployeeRole.create({
      employee_id: admin._id,
      company_role_id: adminRole._id,
    });

    console.log("✅ Admin user created");

    // -----------------------------------
    // CUSTOMER + VEHICLE + SERVICE + ORDER
    // -----------------------------------

    console.log("🌱 Creating sample customer + order...");

    const customer = await CustomerIdentifier.create({
      email: "john@example.com",
      phone_number: "0922019117",
      customer_hash: "cust_abc123",
    });

    await CustomerInfo.create({
      customer_id: customer._id,
      first_name: "John",
      last_name: "Doe",
    });

    const vehicle = await Vehicle.create({
      customer_id: customer._id,
      year: "2022",
      make: "Toyota",
      model: "Corolla",
      mileage: 12000,
      tag: "AB1234",
    });

    const service = await CommonService.create({
      service_name: "Oil change",
      service_description: "Change engine oil",
    });

    const order = await Order.create({
      customer_id: customer._id,
      employee_id: admin._id,
      vehicle_id: vehicle._id,
      order_hash: "ord_001",
      order_status: "Received",
    });

    await OrderInfo.create({
      order_id: order._id,
      order_total_price: 50,
      order_estimated_completion_date: new Date(Date.now() + 86400000),
    });

    await OrderService.create({
      order_id: order._id,
      service_id: service._id,
    });

    console.log("✅ Customer, vehicle, service, order created");

    console.log("\n🎉 SEEDING COMPLETE\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();
