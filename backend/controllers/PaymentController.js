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
const handlePayment = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user123",
        amount: parseFloat(amount),
        token: "tok_visa",
      }),
    });

    const text = await response.text(); // Read response as text
    console.log("Raw Response:", text); // Log full response

    // Try parsing JSON
    const data = JSON.parse(text);
    
    if (data.success) {
      setMessage("✅ Payment Successful!");
    } else {
      setMessage("❌ Payment Failed: " + data.error);
    }
  } catch (error) {
    setMessage("❌ Payment Error: " + error.message);
  }
};

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "API endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});


const handlePayment = async () => {
  if (!cardNumber || !expiry || !cvv || !amount) {
    setMessage("⚠️ Please fill in all fields.");
    return;
  }

  if (!validateCardNumber(cardNumber)) {
    setMessage("❌ Invalid card number. Enter 16 digits in XXXX XXXX XXXX XXXX format.");
    return;
  }

  if (!validateExpiry(expiry)) {
    setMessage("❌ Invalid expiry date. Use MM/YY format and ensure it's in the future.");
    return;
  }

  if (!validateCvv(cvv)) {
    setMessage("❌ CVV should be a 3-digit number.");
    return;
  }

  const paymentAmount = parseFloat(amount);

  try {
    const response = await fetch("http://localhost:3000/api/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user123", // Replace with actual user ID
        amount: paymentAmount,
        token: "tok_visa", // Replace with real token in production
      }),
    });

    // Debugging: Read response as text and log it
    const text = await response.text();
    console.log("Raw Response:", text); // Log full response

    // Try parsing JSON response
    const data = JSON.parse(text);

    if (data.success) {
      setMessage("✅ Payment Successful!");
    } else {
      setMessage("❌ Payment Failed: " + data.error);
    }
  } catch (error) {
    setMessage("❌ Payment Error: " + error.message);
  }
};

module.exports = { processPayment };
