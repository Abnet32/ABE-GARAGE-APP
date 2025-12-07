import mongoose, { Schema } from "mongoose";
const OrderServiceSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: "CommonService",
        required: true,
    },
    service_completed: { type: Boolean, default: false },
}, { timestamps: true });
OrderServiceSchema.index({ order_id: 1, service_id: 1 }, { unique: true }); // composite unique
export default mongoose.models.OrderService ||
    mongoose.model("OrderService", OrderServiceSchema);
