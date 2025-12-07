import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EmployeeInfoSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    first_name: { type: String },
    last_name: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export default models.EmployeeInfo || model("EmployeeInfo", EmployeeInfoSchema);
