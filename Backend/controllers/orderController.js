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
        const user = await User.findOne({ clerkId: req.auth.userId });
        const orderData = {
            ...req.body,
            userId: req.auth.userId,
            customerEmail: user ? user.email : 'Unknown'
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
        const userId = req.auth.userId;

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

        const user = await User.findOne({ clerkId: userId });
        const finalCustomerEmail = providedEmail || (user ? user.email : 'Unknown');

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
        const userId = req.auth?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        
        const orders = await Order.find({ userId }).sort('-createdAt');
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
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true
        });

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

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
        
        // Ensure user owns the order
        if (order.userId !== req.auth.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
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
        if (order.userId !== req.auth.userId) {
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
        if (order.userId !== req.auth.userId) {
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

