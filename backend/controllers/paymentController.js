const Payment = require("../models/Payment");

// 💳 Process Card Payment
exports.processCardPayment = async (req, res) => {
  try {
    const { userId, cardNumber, expiry, cvv, amount } = req.body;

    // Simulate payment processing (Replace with real payment gateway)
    if (!userId || !cardNumber || !expiry || !cvv || !amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payment = new Payment({
      userId,
      cardNumber: "**** **** **** " + cardNumber.slice(-4), // Mask card number
      expiry,
      amount,
      paymentMethod: "Card",
      status: "Pending",
    });

    await payment.save();
    res.json({ success: true, message: "Payment recorded", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 📤 Upload Bank Slip
exports.uploadBankSlip = async (req, res) => {
  try {
    const { userId, bankHolder, bankName, bankBranch, paymentDate } = req.body;
    const bankSlip = req.file ? req.file.path : null; // Store file path

    if (!userId || !bankHolder || !bankName || !bankBranch || !paymentDate || !bankSlip) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payment = new Payment({
      userId,
      bankHolder,
      bankName,
      bankBranch,
      paymentDate,
      bankSlip,
      paymentMethod: "Bank Transfer",
      status: "Pending",
    });

    await payment.save();
    res.json({ success: true, message: "Bank slip uploaded", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 📜 Fetch All Payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Approve or ❌ Cancel Payment
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });

    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.json({ success: true, message: `Payment ${status}`, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
