const multer = require("multer");
const path = require("path");

// Configure multer storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where you want to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

const upload = multer({ storage }); // Initialize multer with storage configuration

module.exports = upload;
