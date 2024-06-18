const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    blacklistedAt: { type: Date, default: Date.now, expires: '1d' } // Tokens will automatically be removed after 1 day
});

module.exports =  mongoose.model('BlacklistedToken', blacklistedTokenSchema);
