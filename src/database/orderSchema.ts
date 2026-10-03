import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    drinkId: { type: Schema.Types.ObjectId, ref: "Drink", required: true },
    drinkName: { type: String, required: true, trim: true },
    size: { type: String, required: true, enum: ["Small", "Medium", "Large"] },
    milk: { type: String, trim: true },
    price: { type: Number, required: true, min: 0.01 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
