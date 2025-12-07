import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EmployeePassSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
      index: true,
    },
    employee_password_hashed: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.EmployeePass || model("EmployeePass", EmployeePassSchema);
