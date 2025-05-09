const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Payment method
  paymentMethod: {
    type: String,
    enum: ["Card", "Bank Transfer"],
    required: true,
  },

  // Card payment info (only if paymentMethod === "Card")
  cardDetails: {
    cardNumber: { type: String },
    expiry: { type: String },
    cvv: { type: String },
  },

  // Bank transfer info (only if paymentMethod === "Bank Transfer")
  bankTransferDetails: {
    bankHolder: { type: String },
    bankName: { type: String },
    bankBranch: { type: String },
    bankSlipUrl: { type: String }, // stored file path or public URL
  },

  // Common fields
  amount: { type: Number, required: true },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
