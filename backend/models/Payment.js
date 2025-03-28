const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cardNumber: { type: String, required: false }, // Masked for security
  expiry: { type: String, required: false },
  cvv: { type: String, required: false },
  amount: { type: Number, required: true },
  bankHolder: { type: String, required: false },
  bankName: { type: String, required: false },
  bankBranch: { type: String, required: false },
  paymentDate: { type: Date, required: false },
  bankSlip: { type: String, required: false }, // Store file path or URL
  paymentMethod: { type: String, enum: ["Card", "Bank Transfer"], required: true },
  status: { type: String, enum: ["Pending", "Approved", "Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
