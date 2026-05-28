const express = require('express');
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getNotifications);
router.get('/admin', getNotifications);
router.patch('/read', markAsRead);
router.patch('/admin/read', markAsRead);
router.delete('/:id', deleteNotification);
router.delete('/admin/:id', deleteNotification);

module.exports = router;
