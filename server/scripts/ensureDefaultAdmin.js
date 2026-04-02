import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import EmployeeInfo from "../models/EmployeeInfo.js";
import EmployeePass from "../models/EmployeePass.js";
import CompanyRole from "../models/CompanyRole.js";
import EmployeeRole from "../models/EmployeeRole.js";

const DEFAULT_ADMIN_EMAIL = (
  process.env.DEFAULT_ADMIN_EMAIL || "admin@abe-garage.com"
)
  .trim()
  .toLowerCase();

const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || "abe-garage123";

export const ensureDefaultAdmin = async () => {
  if (!DEFAULT_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD.length < 8) {
    console.warn(
      "Skipping default admin bootstrap: DEFAULT_ADMIN_PASSWORD is missing or too short",
    );
    return;
  }

  let admin = await Employee.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (!admin) {
    admin = await Employee.create({ email: DEFAULT_ADMIN_EMAIL });
    await EmployeeInfo.create({
      employee_id: admin._id,
      first_name: "System",
      last_name: "Admin",
      phone: "+251000000000",
    });
    console.log(`Created default admin user: ${DEFAULT_ADMIN_EMAIL}`);
  }

  const existingPass = await EmployeePass.findOne({ employee_id: admin._id });
  if (!existingPass) {
    const hashed = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await EmployeePass.create({
      employee_id: admin._id,
      employee_password_hashed: hashed,
    });
    console.log("Created password for default admin user");
  }

  let adminRole = await CompanyRole.findOne({ company_role_name: "admin" });
  if (!adminRole) {
    adminRole = await CompanyRole.create({ company_role_name: "admin" });
  }

  const existingRole = await EmployeeRole.findOne({ employee_id: admin._id });
  if (!existingRole) {
    await EmployeeRole.create({
      employee_id: admin._id,
      company_role_id: adminRole._id,
    });
    console.log("Assigned admin role to default admin user");
  }
};
