import mongoose, { Schema } from "mongoose";
const VehicleSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "CustomerIdentifier",
        required: true,
        index: true,
    },
    year: { type: String },
    make: { type: String },
    model: { type: String },
    type: { type: String },
    mileage: { type: Number, default: 0 },
    tag: { type: String },
    serial_number: { type: String },
    color: { type: String },
}, { timestamps: true });
export default mongoose.models.Vehicle ||
    mongoose.model("Vehicle", VehicleSchema);
