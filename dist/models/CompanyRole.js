import mongoose, { Schema } from "mongoose";
const CompanyRoleSchema = new Schema({
    company_role_name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
}, { timestamps: true });
export default mongoose.models.CompanyRole ||
    mongoose.model("CompanyRole", CompanyRoleSchema);
