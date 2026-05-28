const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// 1. Protect routes (Ensure user is logged in via Clerk)
// This uses Clerk's official middleware to verify the session/token
exports.protect = ClerkExpressRequireAuth();

// 2. Admin access (Ensure user has Admin role in MongoDB)
exports.admin = async (req, res, next) => {
    try {
        // Clerk puts user info in req.auth
        const clerkId = req.auth.userId;

        const user = await User.findOne({ clerkId });

        if (user && (user.role === 'Admin' || user.role === 'SuperAdmin')) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Not authorized as an admin'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error in admin middleware'
        });
    }
};

// 3. SuperAdmin access (Optional)
exports.superAdmin = async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;
        const user = await User.findOne({ clerkId });

        if (user && user.role === 'SuperAdmin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Requires SuperAdmin privileges'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
