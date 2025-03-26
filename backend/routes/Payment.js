const express = require("express");
const router = express.Router();
const stripe = require("stripe")("your_stripe_secret_key"); // Use environment variables for security

router.post("/pay", async (req, res) => {
    try {
        const { amount, token } = req.body;
        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency: "usd",
            source: token,
            description: "Payment for property rental",
        });

        res.json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
