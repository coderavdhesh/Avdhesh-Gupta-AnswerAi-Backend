const jwt = require('jsonwebtoken');
const BlacklistedTokens = require('../models/blackListedTokens');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Check if the token is blacklisted
        const blacklistedToken = await BlacklistedTokens.findOne({ token });
        if (blacklistedToken) {
            return res.status(403).json({ error: 'Session out!' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
