const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const { processPayment } = require("../controllers/PaymentController");


router.post("/pay", processPayment);

// 🔹 **POST**: Create a new payment
router.post("/", async (req, res) => {
  try {
    const { userId, amount, method } = req.body;

    const newPayment = new Payment({
      userId,
      amount,
      method,
      status: "Pending",
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 **GET**: Fetch all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 **GET**: Fetch a single payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 **PUT**: Update payment status
router.put("/:id", async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedPayment)
      return res.status(404).json({ message: "Payment not found" });
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 **DELETE**: Delete a payment
router.delete("/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
