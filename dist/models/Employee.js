import mongoose, { Schema } from "mongoose";
const EmployeeSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    active_employee: { type: Boolean, default: true },
    added_date: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.models.Employee ||
    mongoose.model("Employee", EmployeeSchema);
