const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Load Stripe Secret Key from .env

// Payment Handler
const processPayment = async (req, res) => {
  try {
    const { amount, currency, token } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: currency || "usd",
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
    res.status(500).json({ success: false, message: "Payment Failed", error });
  }
};

module.exports = { processPayment };
