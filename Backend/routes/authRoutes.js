const express = require('express');
const router = express.Router();
const { 
    register, login, googleLogin, logout, getMe, 
    forgotPassword, resetPassword, verifyResetCode, 
    deleteAccount, sendVerificationEmail, verifyEmail, updateAvatar 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/send-verification-email', protect, sendVerificationEmail);
router.post('/verify-email', protect, verifyEmail);
router.put('/update-avatar', protect, upload.single('avatar'), updateAvatar);
router.delete('/delete-account', protect, deleteAccount);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
