const express = require('express');
const { syncUser, getUsers, getProfile, updateUserRole } = require('../controllers/userController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/sync', syncUser);
router.get('/profile', protect, getProfile);
router.get('/', protect, admin, getUsers);
router.patch('/:id/role', protect, superAdmin, updateUserRole);

module.exports = router;
