"use strict";
const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    } // Token will expire in 1 hour
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);
