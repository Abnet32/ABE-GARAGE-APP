import mongoose, { Schema } from "mongoose";
const OrderInfoSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
        unique: true,
    },
    order_total_price: { type: Number, default: 0 },
    order_estimated_completion_date: { type: Date },
    order_completion_date: { type: Date },
    order_additional_requests: { type: String },
    order_additional_requests_completed: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.OrderInfo ||
    mongoose.model("OrderInfo", OrderInfoSchema);
