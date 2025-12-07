import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const OrderSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "CustomerIdentifier",
      required: true,
      index: true,
    },
    employee_id: { type: Schema.Types.ObjectId, ref: "Employee" },
    vehicle_id: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    order_date: { type: Date, default: Date.now },
    order_hash: { type: String, unique: true, sparse: true, index: true },
    order_status: { type: String, default: "Received" },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
