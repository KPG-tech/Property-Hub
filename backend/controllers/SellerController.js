const Seller = require('../models/Seller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Seller
exports.registerSeller = async (req, res) => {
    try {
        const { fullname, phone, email, username, password } = req.body;

        // Check if seller exists
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new Seller({
            fullname,
            phone,
            email,
            username,
            password: hashedPassword
        });

        await newSeller.save();
        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login Seller
exports.loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({ message: 'Seller not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: seller._id }, 'your_secret_key', { expiresIn: '1d' });
        res.json({ message: 'Login successful', token, seller });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


