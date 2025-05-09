const Payment = require("../models/Payment");

// 💳 Process Card Payment
exports.processCardPayment = async (req, res) => {
  try {
    const { userId, cardNumber, expiry, cvv, amount } = req.body;

    if (!userId || !cardNumber || !expiry || !cvv || !amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payment = new Payment({
      userId,
      cardNumber: "**** **** **** " + cardNumber.slice(-4),
      expiry,
      cvv,
      amount,
      paymentMethod: "Card",
      status: "Pending",
    });

    await payment.save();
    res.json({ success: true, message: "Card payment recorded", payment });
  } catch (error) {
    console.error("Card payment error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 📤 Upload Bank Slip
exports.uploadBankSlip = async (req, res) => {
  try {
    const { userId, bankHolder, bankName, bankBranch, paymentDate, amount } = req.body;
    const bankSlip = req.file ? req.file.filename : null;

    if (!userId || !bankHolder || !bankName || !bankBranch || !amount || !bankSlip) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payment = new Payment({
      userId,
      bankHolder,
      bankName,
      bankBranch,
      bankSlip,
      amount,
      paymentDate: paymentDate || Date.now(),
      paymentMethod: "Bank Transfer",
      status: "Pending",
    });

    await payment.save();
    res.json({ success: true, message: "Bank slip uploaded", payment });
  } catch (error) {
    console.error("Bank slip upload error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 📜 Fetch All Payments (for Admin)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    console.error("Fetching payments error:", error);
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
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
