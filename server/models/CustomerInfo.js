import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const CustomerInfoSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "CustomerIdentifier",
      required: true,
      index: true,
      unique: true,
    },
    first_name: { type: String },
    last_name: { type: String },
  },
  { timestamps: true }
);

export default models.CustomerInfo || model("CustomerInfo", CustomerInfoSchema);
