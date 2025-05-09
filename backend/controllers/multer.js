const multer = require("multer");
const path = require("path");

// Configure multer storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where you want to store uploaded files
  },
  filename: (req, file, cb) => {
    // Save file with a unique name based on timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept only certain file types (JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Allow the file
  } else {
    cb(new Error("Only .jpg, .jpeg, .png files are allowed!"), false); // Reject the file
  }
};

// Initialize multer with storage configuration and file size limit (e.g., 5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export the configured multer instance
module.exports = upload;
