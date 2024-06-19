const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BlacklistedTokens = require('../models/blackListedTokens');

// generating the new token for the exixting user
const login = async (req, res) => {
    const username = req.body;
    console.log(`Generating the access token`)
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        console.log(`The access token generated successfully`)
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {

    console.log("Logging out the session : logout()")
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        const blacklistedToken = new BlacklistedTokens({ token });
        await blacklistedToken.save();

        res.status(200).json({ message: 'User logged out successfully and token blacklisted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout user, Token is already expired or blacklisted' });
    }
};

const refreshToken = async (req, res) => {
    console.log("Refreshing the token : refreshToken()");
    const { refreshToken: providedRefreshToken } = req.body;

    if (!providedRefreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
    }

    try {
        // Verify the provided refresh token
        const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Log the decoded information for debugging
        console.log("Decoded refresh token: ", decoded);

        // Generate a new access token with a short expiration time
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        
        // Optional: Generate a new refresh token
        const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        console.log("Refreshed the token.");
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Error refreshing token: ", error);
        res.status(400).json({ error: 'Invalid refresh token or token has expired. Please login again!' });
    }
};

// Refresh token
// Basic refresh token logic
// const refreshToken = async (req, res) => {
//     console.log("Refreshing the token : refreshToken()");
//     console.log(req.body);
//     const refreshToken = req.body.refreshToken;

//     if (!refreshToken) {
//         return res.status(401).json({ error: 'Refresh token not provided' });
//     }

//     try {
//         const decoded = jwt.verify(providedRefreshToken, process.env.JWT_SECRET);

//         // Generate new access token with short expiration time
//         const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

//         console.log("Refreshed the token.");
//         res.status(200).json({ accessToken: newAccessToken });
//     } catch (error) {
//         res.status(400).json({ error: 'Invalid refresh token or token has expired. Please login again!' });
//     }
// };

module.exports = {
    login,
    logout,
    refreshToken,
};
