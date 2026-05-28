const User = require('../models/User');
const Notification = require('../models/Notification');


exports.syncUser = async (req, res, next) => {
    try {
        const { clerkId, email, name, avatar } = req.body;

        if (!clerkId || !email) {
            return res.status(400).json({ success: false, message: 'Please provide clerkId and email' });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            user = await User.create({
                clerkId,
                email,
                name: name || '',
                avatar: avatar || '',
                role: 'User'
            });
            console.log(`New user created: ${email}`);

            // Trigger Notification
            await Notification.create({
                message: `New User Joined: ${name || email}`,
                type: 'User',
                link: '/admin/users'
            });
        }

        // Always keep the name and avatar fresh from Clerk
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        
        // Auto-promote nishantraj7859@gmail.com to SuperAdmin
        if (email === 'nishantraj7859@gmail.com' && user.role !== 'SuperAdmin') {
            user.role = 'SuperAdmin';
            console.log(`[AUTH] Auto-promoted ${email} to SuperAdmin`);
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const clerkId = req.auth?.userId || req.headers['clerk-id'] || req.query.clerkId;
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['User', 'Admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Prevent changing SuperAdmin roles via this endpoint
        if (user.role === 'SuperAdmin') {
            return res.status(403).json({ success: false, message: 'Cannot change SuperAdmin role' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
