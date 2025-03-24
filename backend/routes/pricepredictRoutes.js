// routes/authRoutes.js
const express = require('express');
const { predict } = require('../controllers/pricepredictController');
const router = express.Router();

router.post('/predict', predict);

module.exports = router;