import mongoose, { Schema } from "mongoose";
const OrderStatusSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    order_status_code: { type: Number, required: true },
    note: { type: String },
    changed_at: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.models.OrderStatus ||
    mongoose.model("OrderStatus", OrderStatusSchema);
