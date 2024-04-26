"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const BlacklistToken = require('../models/BlacklistToken');

const generateToken = (userId) => {
    // Generate and return token based on provided userid
    return jwt.sign({ userId }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_TOKEN_EXPIRYTIME });
};

exports.signup = async (req, res) => {
    try {
        // Fetch username and password from request body
        const { username, password } = req.body;

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store username and hashed password in User collection
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Generate token for the user
        const token = generateToken(user._id);

        // Send back generated token
        res.json({ token });
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        // Fetch username and password from request body
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        // Check wether user exists or not
        if (!user) {
            throw new Error('User not found');
        };

        // Check wether password is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password')
        };

        // Generate token based on userid
        const token = generateToken(user._id);
        // Send back generated token
        res.json({ token });
    } catch (err) {
        // Return err message
        res.status(401).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization?.split(' ')?.[1];
        if (!token) {
            throw new Error('Token not found');
        };

        // Add token to blacklist
        const blacklistedToken = new BlacklistToken({ token });
        await blacklistedToken.save();

        // Return logout successful message
        res.json({ message: 'Logout successful' });
    } catch (err) {
        // Return err message
        res.status(500).json({ error: err.message });
    }
};
