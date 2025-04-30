const express = require('express');
const router = express.Router();
const { registerSeller, loginSeller, getSellerProfile } = require('../controllers/SellerController');

router.post('/register', registerSeller);
router.post('/login', loginSeller);


module.exports = router;
