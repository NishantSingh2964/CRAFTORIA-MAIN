const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const user = req.user;
        const orderData = {
            ...req.body,
            userId: user._id.toString(),
            customerEmail: user.email
        };

        const order = await Order.create(orderData);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { items, deliveryInfo, customerEmail: providedEmail } = req.body;
        const user = req.user;
        const userId = user._id.toString();

        const line_items = items.map((item) => {
            // Use item.price from frontend — already includes ₹200 customization fee if applicable
            const unitPrice = Number(item.price);
            const productName = item.customization
                ? `${item.name} (+ Customization)`
                : item.name;

            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: productName,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(unitPrice * 100),
                },
                quantity: item.quantity,
            };
        });

        const orderNumber = `GT-${Math.floor(100000 + Math.random() * 900000)}`;
        const totalAmount = line_items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0) / 100;

        const finalCustomerEmail = providedEmail || user.email;

        // Create initial order in DB
        const order = await Order.create({
            orderNumber,
            userId,
            customerEmail: finalCustomerEmail,
            items: items.map(i => ({
                productId: i.productId,
                name: i.name,
                quantity: i.quantity,
                price: Number(i.price),
                image: i.image,
                customization: i.customization || null
            })),
            totalAmount,
            deliveryInfo,
            paymentStatus: 'Unpaid',
            status: 'Processing',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Auto-delete in 15 mins if not paid
        });

        console.log(`Order created in DB: ${orderNumber}`);

        // Trigger Notification (Immediate)
        try {
            const notif = await Notification.create({
                message: `New Order Initiated: ${orderNumber}`,
                type: 'Order',
                link: '/admin/orders'
            });
            console.log(`Notification created successfully: ${notif._id}`);
        } catch (nError) {
            console.error('FAILED TO CREATE NOTIFICATION:', nError.message);
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: finalCustomerEmail === 'Unknown' ? undefined : finalCustomerEmail,
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/my-orders?payment=cancelled&orderId=${order._id}`,
            invoice_creation: {
                enabled: true,
            },
            metadata: {
                userId,
                orderId: order._id.toString(),
                orderNumber,
                deliveryInfo: JSON.stringify(deliveryInfo)
            },
        });

        // Update order with stripeSessionId
        order.stripeSessionId = session.id;
        await order.save();

        res.status(200).json({ id: session.id, url: session.url, orderId: order._id });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user?._id.toString();
        const userEmail = req.user?.email;

        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        
        // Search by userId OR customerEmail to bridge the gap between Clerk IDs and MongoDB IDs
        const orders = await Order.find({
            $or: [
                { userId: userId },
                { customerEmail: userEmail }
            ]
        }).sort('-createdAt');

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Special handling for cancellation by admin
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            // 1. Handle Refund (Full Amount for admin cancellation)
            if (order.paymentStatus === 'Paid' && order.paymentIntentId) {
                await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                    // No amount specified means full refund
                });
                order.paymentStatus = 'Refunded';
            } else if (order.paymentStatus === 'Unpaid' || order.paymentStatus === 'Payment Pending') {
                order.paymentStatus = 'Cancelled';
            }

            // 2. Restore Inventory
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
            }

            // 3. Send Email (Full Refund)
            const { sendOrderCancellationEmail } = require('../utils/emailService');
            sendOrderCancellationEmail(order, 0) // 0 fee for admin cancellation
                .catch(err => console.error('Error sending admin cancellation email:', err.message));
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Download Order Invoice
// @route   GET /api/orders/:id/invoice/download
// @access  Private
exports.downloadInvoice = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        
        // Ensure user owns the order (Check by ID or Email for legacy compatibility)
        if (order.userId !== req.user._id.toString() && order.customerEmail !== req.user.email) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this invoice' });
        }

        let pdfUrl = order.invoiceUrl;

        // If URL is missing but we have a session, try to recover it from Stripe
        if (!pdfUrl && order.stripeSessionId) {
            const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
            if (session.invoice) {
                const invoice = await stripe.invoices.retrieve(session.invoice);
                pdfUrl = invoice.invoice_pdf; // Stripe's direct PDF link
            }
        }

        if (!pdfUrl) {
            return res.status(400).json({ success: false, message: 'Invoice not available for this type of order' });
        }

        // Use native https to stream the PDF directly as a download
        const https = require('https');
        https.get(pdfUrl, (pdfStream) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
            pdfStream.pipe(res);
        }).on('error', (err) => {
            next(err);
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/admin/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark order as Payment Pending and send failure email
// @route   POST /api/orders/:id/mark-payment-pending
// @access  Private
exports.markPaymentPending = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId !== req.user._id.toString() && order.customerEmail !== req.user.email) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // If already paid, do nothing — edge case where payment succeeded after user clicked back
        if (order.paymentStatus === 'Paid') {
            return res.status(200).json({ success: true, data: order });
        }

        order.paymentStatus = 'Payment Pending';
        await order.save();

        console.log(`[ORDER] Order ${order.orderNumber} marked as pending. Email: ${order.customerEmail}`);

        // Build retry link that MyOrders page will detect and auto-redirect
        const retryUrl = `${process.env.FRONTEND_URL}/my-orders?retry=${order._id}`;

        const { sendPaymentFailedEmail } = require('../utils/emailService');
        sendPaymentFailedEmail(order, retryUrl)
            .then(() => console.log(`✅ Payment-failed email sent for ${order.orderNumber} to ${order.customerEmail}`))
            .catch((err) => console.error(`❌ Failed to send payment-failed email for ${order.orderNumber}:`, err.message));

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new Stripe checkout session for an existing unpaid/pending order
// @route   POST /api/orders/:id/retry-payment
// @access  Private
exports.retryPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId !== req.user._id.toString() && order.customerEmail !== req.user.email) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({ success: false, message: 'Order is already paid' });
        }

        const line_items = order.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: order.customerEmail === 'Unknown' ? undefined : order.customerEmail,
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/my-orders?payment=cancelled&orderId=${order._id}`,
            invoice_creation: { enabled: true },
            metadata: {
                userId: order.userId,
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                deliveryInfo: JSON.stringify(order.deliveryInfo),
            },
        });

        order.stripeSessionId = session.id;
        order.paymentStatus = 'Unpaid';
        order.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Give another 15 mins for the retry
        await order.save();

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order request (User)
// @route   POST /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId !== req.user._id.toString() && order.customerEmail !== req.user.email) return res.status(403).json({ success: false, message: 'Not authorized' });

        // Check if cancellable (Only if status is Processing)
        if (order.status !== 'Processing') {
            return res.status(400).json({ success: false, message: `Cannot cancel order in ${order.status} state` });
        }

        order.status = 'Cancellation Requested';
        await order.save();

        // Send Email to User
        const { sendCancellationRequestedEmail } = require('../utils/emailService');
        sendCancellationRequestedEmail(order)
            .catch(err => console.error('Error sending cancellation requested email:', err.message));

        // Notify Admin
        await Notification.create({
            message: `New Cancellation Request: ${order.orderNumber}`,
            type: 'Order',
            link: '/admin/cancellation-requests'
        });

        res.status(200).json({ success: true, message: 'Cancellation request sent to admin' });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve cancellation (Admin)
// @route   PATCH /api/admin/orders/:id/approve-cancel
// @access  Private/Admin
exports.approveCancellation = async (req, res, next) => {
    try {
        const NOMINAL_CHARGE = Number(process.env.CANCELLATION_FEE) || 50;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.status !== 'Cancellation Requested') {
            return res.status(400).json({ success: false, message: 'Order is not in Cancellation Requested state' });
        }

        // If Paid, initiate refund
        if (order.paymentStatus === 'Paid' && order.paymentIntentId) {
            const refundAmount = Math.max(0, (order.totalAmount - NOMINAL_CHARGE) * 100);
            if (refundAmount > 0) {
                await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                    amount: Math.round(refundAmount),
                });
                order.paymentStatus = 'Refunded';
            } else {
                order.paymentStatus = 'Cancelled';
            }
        } else {
            order.paymentStatus = 'Cancelled';
        }

        order.status = 'Cancelled';
        await order.save();

        // Restore Inventory
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
        }

        // Send Email to User (Approved/Finalized)
        const { sendOrderCancellationEmail } = require('../utils/emailService');
        sendOrderCancellationEmail(order, NOMINAL_CHARGE)
            .catch(err => console.error('Error sending cancellation email:', err.message));

        res.status(200).json({ success: true, message: 'Cancellation approved and refund initiated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject cancellation (Admin)
// @route   PATCH /api/admin/orders/:id/reject-cancel
// @access  Private/Admin
exports.rejectCancellation = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.status !== 'Cancellation Requested') {
            return res.status(400).json({ success: false, message: 'Order is not in Cancellation Requested state' });
        }

        order.status = 'Processing'; // Reset to processing
        await order.save();

        // Send Email to User (Rejected)
        const { sendCancellationWithdrawnEmail } = require('../utils/emailService');
        sendCancellationWithdrawnEmail(order) // Using Withdrawal template as it has same message (Back to processing)
            .catch(err => console.error('Error sending cancellation rejection email:', err.message));
        
        res.status(200).json({ success: true, message: 'Cancellation request rejected' });
    } catch (error) {
        next(error);
    }
};

// @desc    Withdraw cancellation request (User)
// @route   POST /api/orders/:id/withdraw-cancel
// @access  Private
exports.withdrawCancellationRequest = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId !== req.user._id.toString() && order.customerEmail !== req.user.email) return res.status(403).json({ success: false, message: 'Not authorized' });

        if (order.status !== 'Cancellation Requested') {
            return res.status(400).json({ success: false, message: 'Order is not in Cancellation Requested state' });
        }

        order.status = 'Processing';
        await order.save();

        // Send Email to User
        const { sendCancellationWithdrawnEmail } = require('../utils/emailService');
        sendCancellationWithdrawnEmail(order)
            .catch(err => console.error('Error sending cancellation withdrawn email:', err.message));

        // Notify Admin that request was withdrawn
        await Notification.create({
            message: `Cancellation Request Withdrawn: ${order.orderNumber}`,
            type: 'Order',
            link: '/admin/orders'
        });

        res.status(200).json({ success: true, message: 'Cancellation request withdrawn' });
    } catch (error) {
        next(error);
    }
};
