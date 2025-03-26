const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
// const sendEmail = require('../utils/sendEmail');
const JWT_SECRET='049ebd26ec31a0ef163ea11d3f4541e3891245195eacd1727086b5ee82aa6c8f26e2a49378d79e2c2a6471b7da538c65b61cd64aebef09f91f7ca0ad9c2c7ecf17d88d950196dc1c1eb0c1f799b37628284bb6d80257dfb1fde3340871dee1a6087efaddfa1f43c79ce6d38eb60f17d4a8694a507d322ca3b7b647834032dc1f551e44a5f016f7a84dca7cee6ba6ecd3b7f400dbf7c86dc916d5c259ff48f6da6049ec40f561d80fe14b4e9b99553465806ce9d55e3ae191aa8e37bc2c6c7a13d745e3d4ba1d1d89b44305645a6ade4cedec3d7ac29a0560edb6a8fe715780275964c62d8615736cbe0fdcd70adab8e12487e1916b48caa8b3f6a459d17bbbd4';

exports.signup = async (req, res) => {
    try {
        const { name, address, email, phone, password, role, employeeId, nic } = req.body;
        console.log(name, address, email, phone, password, role, employeeId, nic);
        if (role === 'admin' && !employeeId) {
            return res.status(400).json({ message: 'Employee ID is required for admins' });
        }
        if (role === 'user' && !nic) {
            return res.status(400).json({ message: 'NIC is required for users' });
        }

        const newUser = new User({
            name,
            address,
            email,
            phone,
            password,
            role,
            employeeId: role === 'admin' ? employeeId : undefined,
            nic: role === 'user' ? nic : undefined,
        });

        console.log(newUser);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        // Generate JWT with role and user ID
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return token and user data
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// exports.forgotPassword = async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const resetToken = user.getResetPasswordToken();
//         await user.save();

//         const resetUrl = `${req.protocol}://${req.get('host')}/password-reset/${resetToken}`;
//         const message = `You have requested a password reset. Please go to the following link: \n\n ${resetUrl}`;

//         try {
//             await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
//             res.status(200).json({ message: 'Email sent' });
//         } catch (err) {
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpire = undefined;
//             await user.save();
//             return res.status(500).json({ message: 'Error sending email', error: err.message });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error resetting password', error: error.message });
//     }
// };