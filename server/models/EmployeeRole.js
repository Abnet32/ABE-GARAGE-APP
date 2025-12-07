import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EmployeeRoleSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
      unique: true,
    },
    company_role_id: {
      type: Schema.Types.ObjectId,
      ref: "CompanyRole",
      required: true,
    },
  },
  { timestamps: true }
);

export default models.EmployeeRole || model("EmployeeRole", EmployeeRoleSchema);
