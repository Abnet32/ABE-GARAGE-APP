import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EmployeeSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default models.Employee || model("Employee", EmployeeSchema);
