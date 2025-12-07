import mongoose from "mongoose";

const CompanyRoleSchema = new mongoose.Schema(
  {
    company_role_name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const CompanyRole =
  mongoose.models.CompanyRole ||
  mongoose.model("CompanyRole", CompanyRoleSchema);

export default CompanyRole;
