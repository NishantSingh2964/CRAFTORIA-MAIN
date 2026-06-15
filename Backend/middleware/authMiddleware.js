const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes (Ensure user is logged in via JWT)
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from cookies or Authorization header
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token || token === 'none') {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// 2. Admin access (Ensure user has Admin role)
exports.admin = async (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'SuperAdmin')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};

// 3. SuperAdmin access
exports.superAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'SuperAdmin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Requires SuperAdmin privileges'
        });
    }
};
