const express = require("express");
const multer = require("multer");
const { processCardPayment, uploadBankSlip, getPayments, updatePaymentStatus } = require("../controllers/paymentController");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 💳 Card Payment Route
router.post("/pay", processCardPayment);

// 📤 Upload Bank Slip Route
router.post("/upload-bank-slip", upload.single("bankSlip"), uploadBankSlip);

// 📜 Get All Payments Route (with populated user info)
router.get("/", getPayments);

// ✅ Approve or ❌ Cancel Payment
router.put("/status/:id", updatePaymentStatus);

module.exports = router;
