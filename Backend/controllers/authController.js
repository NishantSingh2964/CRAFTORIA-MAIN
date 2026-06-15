const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to create token and set cookie
const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
};



// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with this email' });
        }

        if (user.authProvider !== 'local') {
            return res.status(400).json({ success: false, message: 'This account uses social login' });
        }

        // Generate Code (6 digits)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #760000; text-align: center;">Reset Your Password</h2>
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password. Use the verification code below to proceed. This code is valid for 10 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #760000; border: 1px dashed #760000; padding: 10px 20px; border-radius: 5px;">
                        ${resetCode}
                    </span>
                </div>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">Craftoria Premium Gifting &copy; 2026</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Verification Code',
                html
            });

            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (error) {
            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Reset Code
// @route   POST /api/auth/verify-reset-code
exports.verifyResetCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        res.status(200).json({ success: true, message: 'Code verified' });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Set New Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            authProvider: 'local'
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || user.authProvider !== 'local') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
exports.googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture: avatar, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user with google info if not present
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar) user.avatar = avatar;
            if (user.authProvider === 'clerk') {
                user.authProvider = 'google';
            }
            user.isEmailVerified = true; // Google accounts are pre-verified
            await user.save();
        } else {
            // Create new google user
            user = await User.create({
                name,
                email,
                avatar,
                googleId,
                authProvider: 'google',
                isEmailVerified: true
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ success: false, message: 'Google authentication failed' });
    }
};

// @desc    Logout user
// @route   GET /api/auth/logout
exports.logout = (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const userId = user._id.toString();
        const [orderCount, reviewCount] = await Promise.all([
            Order.countDocuments({ userId }),
            Review.countDocuments({ userId })
        ]);

        res.status(200).json({
            success: true,
            data: user,
            stats: {
                orderCount,
                reviewCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
exports.deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send Email Verification Code
// @route   POST /api/auth/send-verification-email
exports.sendVerificationEmail = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = code;
        user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #760000; text-align: center;">Verify Your Email</h2>
                <p>Hello ${user.name},</p>
                <p>Use the verification code below to verify your email address. This code is valid for 10 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #760000; border: 1px dashed #760000; padding: 10px 20px; border-radius: 5px;">
                        ${code}
                    </span>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">Craftoria Premium Gifting &copy; 2026</p>
            </div>
        `;

        await sendEmail({ email: user.email, subject: 'Email Verification Code', html });
        res.status(200).json({ success: true, message: 'Verification code sent' });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({
            _id: req.user.id,
            verificationCode: code,
            verificationCodeExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired code' });

        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Avatar
// @route   PUT /api/auth/update-avatar
exports.updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });

        const user = await User.findById(req.user.id);
        user.avatar = req.file.path;
        await user.save();

        res.status(200).json({ success: true, message: 'Profile picture updated', user });
    } catch (error) {
        next(error);
    }
};
