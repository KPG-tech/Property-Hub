// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET='049ebd26ec31a0ef163ea11d3f4541e3891245195eacd1727086b5ee82aa6c8f26e2a49378d79e2c2a6471b7da538c65b61cd64aebef09f91f7ca0ad9c2c7ecf17d88d950196dc1c1eb0c1f799b37628284bb6d80257dfb1fde3340871dee1a6087efaddfa1f43c79ce6d38eb60f17d4a8694a507d322ca3b7b647834032dc1f551e44a5f016f7a84dca7cee6ba6ecd3b7f400dbf7c86dc916d5c259ff48f6da6049ec40f561d80fe14b4e9b99553465806ce9d55e3ae191aa8e37bc2c6c7a13d745e3d4ba1d1d89b44305645a6ade4cedec3d7ac29a0560edb6a8fe715780275964c62d8615736cbe0fdcd70adab8e12487e1916b48caa8b3f6a459d17bbbd4';


exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

exports.authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};