const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'outfitters-jwt-secret-key-2026';

// Generate JWT Token
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please log in.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
        });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET
};
