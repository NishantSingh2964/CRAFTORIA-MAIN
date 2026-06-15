const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    verificationCodeExpire: Date,
    password: {
        type: String,
        select: false
    },
    name: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'SuperAdmin'],
        default: 'User'
    },
    authProvider: {
        type: String,
        enum: ['google', 'local', 'clerk'],
        default: 'local'
    },
    phone: {
        type: String,
        default: ''
    },
    resetPasswordCode: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
