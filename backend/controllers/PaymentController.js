require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Load Stripe Secret Key

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Allows cross-origin requests

// Payment Handler
const processPayment = async (req, res) => {
  try {
    const { amount, currency = "usd", token } = req.body;

    if (!amount || !token) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency,
      payment_method_types: ["card"],
      description: "Property Hub Payment",
      payment_method: token,
      confirm: true,
    });

    res.status(200).json({
      success: true,
      message: "Payment Successful",
      paymentIntent,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: "Payment Failed", error: error.message });
  }
};

// API Routes
app.post("/api/payment/pay", processPayment);

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "API endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { processPayment };
