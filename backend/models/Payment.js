const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ["Card", "Bank Transfer", "PayPal"], // Allowed payment methods
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
