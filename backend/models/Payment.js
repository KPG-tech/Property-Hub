const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: String,
    amount: Number,
    status: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
