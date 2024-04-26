"use strict";
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklistToken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Auth failed' });

        // Check if token is blacklisted
        const isBlacklisted = await BlacklistToken.exists({ token });
        if (isBlacklisted) return res.status(401).json({ message: 'Token expired' });

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};
