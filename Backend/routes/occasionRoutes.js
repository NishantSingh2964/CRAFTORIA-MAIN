const express = require('express');
const { getOccasions, createOccasion, updateOccasion, deleteOccasion } = require('../controllers/occasionController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', getOccasions);

// Admin routes
router.post('/admin', protect, admin, upload.single('image'), createOccasion);
router.patch('/admin/:id', protect, admin, upload.single('image'), updateOccasion);
router.delete('/admin/:id', protect, admin, deleteOccasion);

module.exports = router;
