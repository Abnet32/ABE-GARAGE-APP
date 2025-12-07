import mongoose, { Schema } from "mongoose";
const ServiceSchema = new Schema({
    service_name: { type: String, required: true, index: true },
    service_description: { type: String },
    active: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.CommonService ||
    mongoose.model("CommonService", ServiceSchema);
