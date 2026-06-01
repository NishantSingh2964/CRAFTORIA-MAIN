const express = require('express');
const { 
    createCheckoutSession, 
    createOrder,
    getMyOrders, 
    getOrders, 
    updateOrderStatus,
    downloadInvoice,
    deleteOrder,
    markPaymentPending,
    retryPayment,
    cancelOrder,
    approveCancellation,
    rejectCancellation,
    withdrawCancellationRequest
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id/invoice/download', protect, downloadInvoice);
router.post('/:id/mark-payment-pending', protect, markPaymentPending);
router.post('/:id/retry-payment', protect, retryPayment);
router.post('/:id/cancel', protect, cancelOrder);
router.post('/:id/withdraw-cancel', protect, withdrawCancellationRequest);

// Admin routes
router.get('/admin', protect, admin, getOrders);
router.patch('/admin/:id', protect, admin, updateOrderStatus);
router.patch('/admin/:id/approve-cancel', protect, admin, approveCancellation);
router.patch('/admin/:id/reject-cancel', protect, admin, rejectCancellation);
router.delete('/admin/:id', protect, admin, deleteOrder);

module.exports = router;
