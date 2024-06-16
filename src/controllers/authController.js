const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

const logout = (req, res) => {

    console.log("Logging out the session : logout()")
    const token = req.header('Authorization').replace('Bearer ', '');

    // Generate a new token with a very short expiration time (e.g., 1 second)
    // const expiredToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1s' });

    res.status(200).json({ message: 'User logged out, Sucessfully!'});
};

// Refresh token
const refreshToken = async (req, res) => {
    console.log("Refreshing the token : refreshToken()")
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Generate new access token with short expiration time
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        console.log("Refreshed the token.")
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ error: 'Invalid refresh token' });
    }
};

module.exports = {
    login,
    logout,
    refreshToken,
};
