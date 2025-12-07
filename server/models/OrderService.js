import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const OrderServiceSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

// Composite unique index
OrderServiceSchema.index({ order_id: 1, service_id: 1 }, { unique: true });

export default models.OrderService || model("OrderService", OrderServiceSchema);
