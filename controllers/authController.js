"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_TOKEN_EXPIRYTIME });
};

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        const token = generateToken(user._id);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password')
        };

        const token = generateToken(user._id);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    // You can clear any session data or JWT tokens here
    res.json({ message: 'Logout successful' });
};
