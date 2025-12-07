import mongoose, { Schema } from "mongoose";
const InventorySchema = new Schema({
    name: { type: String, required: true, index: true },
    part_number: { type: String, unique: true, sparse: true },
    category: { type: String },
    quantity: { type: Number, default: 0 },
    price: { type: Number },
    min_stock_level: { type: Number, default: 5 },
}, { timestamps: true });
export default mongoose.models.Inventory ||
    mongoose.model("Inventory", InventorySchema);
