const express = require('express');
const { getDashboardStats, updateUserRole } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Stats route
router.get('/stats', protect, admin, getDashboardStats);

// User management
router.patch('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
