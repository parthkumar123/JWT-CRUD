"use strict";
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklistToken');

module.exports = async (req, res, next) => {
    try {
        // Extract and Validate token from the request headers
        const token = req.headers.authorization?.split(' ')?.[1];
        if (!token) {
            return res.status(401).json({ message: 'Auth failed' })
        };

        // Check if token is blacklisted
        const isBlacklisted = await BlacklistToken.exists({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token expired' })
        };

        // Verify token is valid or not
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        // Add decoded userId in request body
        req.userId = decoded.userId;
        next();
    } catch (err) {
        // Return error message
        return res.status(401).json({ message: 'Auth failed' });
    }
};
