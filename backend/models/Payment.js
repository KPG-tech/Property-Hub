const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Card payment info (optional)
  cardNumber: { type: String },
  expiry: { type: String },
  cvv: { type: String },

  // Bank transfer info (optional)
  bankHolder: { type: String },
  bankName: { type: String },
  bankBranch: { type: String },
  bankSlip: { type: String }, // File path or public URL

  // General payment info
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["Card", "Bank Transfer"],
    required: true,
  },
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
