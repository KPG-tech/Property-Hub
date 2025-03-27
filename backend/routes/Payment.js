const express = require("express");
const Stripe = require("stripe");
const mongoose = require("mongoose");

const router = express.Router();
const stripe = new Stripe("sk_test_yourSecretKey"); // Replace with actual secret key

// Define the Payment Schema
const paymentSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  currency: String,
  status: String,
  paymentGateway: String,
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
});

// Create Payment Model
const Payment = mongoose.model("Payment", paymentSchema);

// Payment Route
router.post("/pay", async (req, res) => {
  try {
    const { userId, amount, token } = req.body;

    if (!userId || !amount || !token) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Charge the card via Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      source: token,
      description: `Payment by ${userId}`,
    });

    // Store transaction in MongoDB
    const newPayment = new Payment({
      userId,
      amount,
      currency: "USD",
      status: charge.status,
      paymentGateway: "Stripe",
      transactionId: charge.id,
    });

    await newPayment.save();

    res.json({ success: true, message: "Payment Successful!", chargeId: charge.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
