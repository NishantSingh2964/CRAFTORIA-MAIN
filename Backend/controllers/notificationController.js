const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications/admin
// @access  Private/Admin
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().sort('-createdAt').limit(50);
        const unreadCount = await Notification.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            unreadCount,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/admin/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/admin/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        await notification.deleteOne();
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};
