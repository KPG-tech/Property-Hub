const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  processCardPayment,
  uploadBankSlip, // Not used in this file, but can be used if defined separately
  getPayments,
  updatePaymentStatus,
} = require("../controllers/paymentController");

// ✅ Import the Payment model
const Payment = require("../models/Payment"); // Adjust path if different

const router = express.Router();

// 🛠️ Configure multer for bank slip uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Make sure this folder exists
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "bankSlip-" + uniqueSuffix + ext);
  },
});

// ✅ File filter: Allow only .jpg, .jpeg, .png
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png files are allowed!"));
  }
};

// 📦 Final multer upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 💳 Card Payment Route
router.post("/pay", processCardPayment);

// 📤 Upload Bank Transfer Route
router.post("/bank-transfer", upload.single("bankSlip"), async (req, res) => {
  try {
    const newPayment = new Payment({
      userId: req.user?._id || "000000000000000000000000", // Replace with real auth if needed
      paymentMethod: "Bank Transfer",
      amount: 0,
      bankHolder: req.body.bankHolder,
      bankName: req.body.bankName,
      bankBranch: req.body.bankBranch,
      paymentDate: req.body.paymentDate,
      bankSlip: req.file?.path,
      status: "Pending",
    });

    await newPayment.save();
    res.status(201).json({ success: true, payment: newPayment });
  } catch (err) {
    console.error("❌ Error in /bank-transfer route:", err);
    res.status(500).json({ success: false, error: "Payment creation failed" });
  }
});

// 📜 Get All Payments
router.get("/", getPayments);

// ✅ Update Payment Status
router.put("/status/:id", updatePaymentStatus);

module.exports = router;
