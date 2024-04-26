"use strict";
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Auth failed' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};
